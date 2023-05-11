import { describe, expect, test } from "bun:test";
import { snowflakeSchema } from "./snowflake";

describe("snowflakeSchema", () => {
  test("accepts valid payload", () => {
    expect(() => snowflakeSchema.parse("308994132968210433")).not.toThrow();
  });

  test("raises error when receiving invalid payload", () => {
    expect(() => snowflakeSchema.parse([3, 0, 8, 9, 9, 4, 1, 3, 2, 9, 6, 8, 2, 1, 0, 4, 3, 3])).toThrow(
      '[\n  {\n    "code": "invalid_union",\n    "unionErrors": [\n      {\n        "issues": [\n          {\n            "code": "invalid_type",\n            "expected": "string",\n            "received": "array",\n            "path": [],\n            "message": "Expected string, received array"\n          }\n        ],\n        "name": "ZodError"\n      },\n      {\n        "issues": [\n          {\n            "code": "invalid_type",\n            "expected": "number",\n            "received": "array",\n            "path": [],\n            "message": "Expected number, received array"\n          }\n        ],\n        "name": "ZodError"\n      }\n    ],\n    "path": [],\n    "message": "Invalid input"\n  }\n]'
    );
  });
});
