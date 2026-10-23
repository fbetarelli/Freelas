import { describe, expect, it } from "vitest";
import { dateSchema } from "@freelancemanager/shared";

describe("date schema", () => {
  it("accepts valid ISO calendar dates", () => {
    expect(dateSchema.safeParse("2024-02-29").success).toBe(true);
  });

  it.each(["2024/02/29", "29-02-2024", "2024-2-9", "2023-02-29"])(
    "rejects invalid date %s",
    (value) => {
      expect(dateSchema.safeParse(value).success).toBe(false);
    },
  );
});
