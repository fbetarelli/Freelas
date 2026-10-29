import type { generateOpenApiDocument } from "../src/index.ts";

type Document = ReturnType<typeof generateOpenApiDocument>;

const methods = ["get", "post", "patch", "delete"] as const;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function exampleFor(
  document: Document,
  method: (typeof methods)[number],
  path: string,
  status: string,
  kind: "request" | "response",
) {
  const pathItem: unknown = document.paths?.[path];
  const operation = isRecord(pathItem) ? pathItem[method] : undefined;
  const responses = isRecord(operation) ? operation.responses : undefined;
  const body = getExampleBody(kind, operation, responses, status);
  const route = `${method.toUpperCase()} ${path}`;

  if (!isRecord(body) || !isRecord(body.content)) {
    throw new Error(`Missing ${kind} for ${route}`);
  }

  const content = body.content["application/json"];
  if (!isRecord(content) || !("example" in content)) {
    throw new Error(`Missing ${kind} example for ${route}`);
  }

  return JSON.stringify(content.example, null, 2);
}

function getExampleBody(
  kind: "request" | "response",
  operation: unknown,
  responses: unknown,
  status: string,
) {
  if (kind === "request") {
    return isRecord(operation) ? operation.requestBody : undefined;
  }

  return isRecord(responses) ? responses[status] : undefined;
}

function routeRow(
  method: (typeof methods)[number],
  path: string,
  operation: Record<string, unknown>,
) {
  const isPublic = Array.isArray(operation.security) && operation.security.length === 0;
  const summary = typeof operation.summary === "string" ? operation.summary : "";
  const auth = isPublic ? "Public" : "Cookie";

  return `| ${method.toUpperCase()} | \`${path}\` | ${summary} | ${auth} |`;
}

export function renderApiReadme(document: Document) {
  const sections = (document.tags ?? []).map((tag) => {
    const rows: string[] = [];
    for (const [path, pathItem] of Object.entries(document.paths ?? {})) {
      for (const method of methods) {
        const candidate: unknown = pathItem?.[method];
        if (
          !isRecord(candidate) ||
          !Array.isArray(candidate.tags) ||
          !candidate.tags.includes(tag.name)
        ) {
          continue;
        }

        rows.push(routeRow(method, path, candidate));
      }
    }
    return `### ${tag.name}\n\n| Method | Path | Summary | Auth |\n|---|---|---|---|\n${rows.join("\n")}`;
  });

  return `# API reference

This is the API documentation entry point. Open [the Redoc reference](./openapi/reference.html) directly from this checkout to browse routes, parameters, schemas, statuses, and examples offline. The [OpenAPI JSON](./openapi/openapi.json) is the machine-readable source for other tools. With Node.js 24 or newer, regenerate both artifacts and this route index with \`npm run docs:build -w apps/api\` from the repository root.

The HTML is a read-only explorer and does not connect to an API endpoint. Login sets a JWT in an \`HttpOnly\` cookie named \`token\`; browsers send that cookie on protected requests. The OpenAPI security scheme describes this cookie, but this offline page does not need an Authorize value.

Error responses are documented by status and the \`{ "message": string }\` shape. Message text is not a stable API contract.

## Routes

${sections.join("\n\n")}

## Examples

These illustrative values are generated from examples in the OpenAPI document. IDs and dates are sample data.

### Register an account

\`POST /register\` request:

\`\`\`json
${exampleFor(document, "post", "/register", "201", "request")}
\`\`\`

\`201\` response:

\`\`\`json
${exampleFor(document, "post", "/register", "201", "response")}
\`\`\`

### Create a client

\`POST /clients\` request:

\`\`\`json
${exampleFor(document, "post", "/clients", "201", "request")}
\`\`\`

\`201\` response:

\`\`\`json
${exampleFor(document, "post", "/clients", "201", "response")}
\`\`\`

### Create a job for a client

\`POST /clients/{id}/jobs\` request:

\`\`\`json
${exampleFor(document, "post", "/clients/{id}/jobs", "201", "request")}
\`\`\`

\`201\` response:

\`\`\`json
${exampleFor(document, "post", "/clients/{id}/jobs", "201", "response")}
\`\`\`
`;
}
