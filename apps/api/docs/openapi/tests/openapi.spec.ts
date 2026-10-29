import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { createHash } from "node:crypto";
import { openApiRequestExamples, openApiResponseExamples } from "../src/examples.ts";
import { generateOpenApiDocument } from "../src/index.ts";
import { renderApiReadme } from "../scripts/readme.ts";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function hasSharedResponseSchema(response: unknown) {
  if (!isRecord(response) || !isRecord(response.content)) return false;

  return Object.values(response.content).some((content) => {
    if (!isRecord(content) || !isRecord(content.schema)) return false;
    const reference = content.schema.$ref;
    return (
      typeof reference === "string" &&
      reference.startsWith("#/components/schemas/")
    );
  });
}

describe("OpenAPI registry", () => {
  it("generates the document with the protected route spike and strict schemas", () => {
    const document = generateOpenApiDocument();
    const createClientBody = document.paths?.["/clients"]?.post?.requestBody;

    expect(document.openapi).toBe("3.1.0");
    expect(document.security).toEqual([{ cookieAuth: [] }]);
    expect(document.components?.securitySchemes?.cookieAuth).toMatchObject({
      type: "apiKey",
      in: "cookie",
      name: "token",
    });
    expect(document.paths?.["/clients/{id}"]?.get).toBeDefined();
    expect(
      createClientBody && "content" in createClientBody
        ? createClientBody.content["application/json"]
        : undefined,
    ).toMatchObject({
      schema: { $ref: "#/components/schemas/RegisterClient" },
      example: {
        name: "Acme",
        address: "123 Main Street",
        contact: "555-0100",
      },
    });
    expect(document.paths?.["/clients/{id}"]?.get?.security).toBeUndefined();
    expect(document.paths?.["/login"]?.post?.security).toEqual([]);
    expect(document.components?.schemas?.RegisterClient).toMatchObject({
      additionalProperties: false,
    });
    expect(document.components?.responses?.BadRequest).toBeDefined();
    expect(document.paths?.["/clients"]?.post?.responses?.["400"]).toEqual({
      $ref: "#/components/responses/BadRequest",
    });
    expect(
      document.paths?.["/clients/{id}"]?.delete?.responses?.["204"],
    ).toBeDefined();
  });

  it("documents only the unauthorized shared error response for GET /me", () => {
    const document = generateOpenApiDocument();
    const responses = document.paths?.["/me"]?.get?.responses;

    expect(Object.keys(responses ?? {}).sort()).toEqual(["200", "401"]);
  });

  it("uses request examples accepted by their schemas", () => {
    for (const [schema, example] of openApiRequestExamples) {
      expect(() => schema.parse(example)).not.toThrow();
    }
  });

  it("uses success examples accepted by their response schemas", () => {
    for (const [schema, example] of openApiResponseExamples) {
      expect(() => schema.parse(example)).not.toThrow();
    }
  });

  it("keeps the JSON artifact and README route index aligned with the registry", () => {
    const document = generateOpenApiDocument();
    const json = readFileSync(new URL("../openapi.json", import.meta.url), "utf8");
    const readme = readFileSync(new URL("../../README.md", import.meta.url), "utf8");

    expect(JSON.parse(json)).toEqual(document);
    expect(readme).toBe(renderApiReadme(document));
  });

  it("keeps the offline reference self-contained", () => {
    const html = readFileSync(new URL("../reference.html", import.meta.url), "utf8");
    const json = readFileSync(new URL("../openapi.json", import.meta.url), "utf8");
    const hash = createHash("sha256").update(json).digest("hex");

    expect(html).toContain(`<!-- openapi-sha256:${hash} -->`);
    expect(html).toContain("FreelanceManager API");
    expect(html).toContain("/login");
    expect(html).toContain("/clients");
    expect(html).toContain("<script>");
    expect(html).not.toMatch(/<(?:script|link|img)[^>]+(?:src|href)=["']https?:\/\//i);
  });

  it("references a shared response schema for every success body", () => {
    const document = generateOpenApiDocument();
    const methods = ["get", "post", "patch", "delete"] as const;

    for (const [path, pathItem] of Object.entries(document.paths ?? {})) {
      for (const method of methods) {
        const operation = pathItem?.[method];
        if (!operation) continue;

        for (const [status, response] of Object.entries(operation.responses ?? {})) {
          if (!status.startsWith("2") || status === "204" || !response || !("content" in response)) {
            continue;
          }

          expect(
            hasSharedResponseSchema(response),
            `${method.toUpperCase()} ${path} ${status}`,
          ).toBe(true);
        }
      }
    }
  });
});
