import { describe, expect, it } from "vitest";
import { evaluateStatus, parseStatusState, type StatusRule } from "./status";
import type { ResolvedEntities } from "./resolver";

function entities(): ResolvedEntities {
  return {
    issues_overdue: { entity_id: "sensor.a", state: "3", attributes: {} },
    ci_state: { entity_id: "sensor.b", state: "Failure", attributes: {} },
    latest_release: { entity_id: "sensor.c", state: "v1", attributes: { prerelease: true, n: 7 } },
    broken: { entity_id: "sensor.d", state: "unavailable", attributes: {} },
  };
}

const rule = (r: Partial<StatusRule>): StatusRule => ({
  field: "issues_overdue",
  state: "failure",
  ...r,
});

describe("parseStatusState", () => {
  it("maps the three tones to theme colours", () => {
    expect(parseStatusState("success").tone).toBe("success");
    expect(parseStatusState(" Failure ").tone).toBe("failure");
    expect(parseStatusState("pending").color).toContain("--warning-color");
  });

  it("treats none and empty as no status", () => {
    expect(parseStatusState("none")).toEqual({});
    expect(parseStatusState("")).toEqual({});
  });

  it("accepts a colour name or a CSS colour", () => {
    expect(parseStatusState("purple")).toEqual({ color: "var(--purple-color)" });
    expect(parseStatusState("#ff0000")).toEqual({ color: "#ff0000" });
  });

  it("rejects values that could add further CSS", () => {
    expect(parseStatusState("red; position: fixed")).toEqual({});
  });
});

describe("evaluateStatus", () => {
  it("compares numbers numerically", () => {
    expect(evaluateStatus([rule({ operator: ">", value: 2 })], entities()).tone).toBe("failure");
    expect(evaluateStatus([rule({ operator: ">", value: 10 })], entities())).toEqual({});
    expect(evaluateStatus([rule({ operator: "<=", value: "3" })], entities()).tone).toBe("failure");
  });

  it("defaults to equality and ignores case for text", () => {
    expect(evaluateStatus([rule({ field: "ci_state", value: "failure" })], entities()).tone).toBe(
      "failure",
    );
    expect(evaluateStatus([rule({ operator: "!=", value: 3 })], entities())).toEqual({});
  });

  it("supports contains", () => {
    expect(
      evaluateStatus([rule({ field: "ci_state", operator: "contains", value: "ail" })], entities())
        .tone,
    ).toBe("failure");
  });

  it("reads attributes with sensor:attribute", () => {
    expect(
      evaluateStatus(
        [rule({ field: "latest_release:prerelease", value: "true", state: "pending" })],
        entities(),
      ).tone,
    ).toBe("pending");
    expect(
      evaluateStatus([rule({ field: "latest_release:n", operator: ">=", value: 7 })], entities())
        .tone,
    ).toBe("failure");
  });

  it("uses the first matching rule", () => {
    const result = evaluateStatus(
      [
        rule({ operator: ">", value: 100, state: "failure" }),
        rule({ operator: ">", value: 1, state: "pending" }),
        rule({ operator: ">", value: 0, state: "success" }),
      ],
      entities(),
    );
    expect(result.tone).toBe("pending");
  });

  it("skips rules whose sensor is missing or has no value", () => {
    expect(evaluateStatus([rule({ field: "nope", value: 1 })], entities())).toEqual({});
    expect(evaluateStatus([rule({ field: "broken", value: "unavailable" })], entities())).toEqual(
      {},
    );
    expect(evaluateStatus([rule({ field: "latest_release:gone", value: 1 })], entities())).toEqual(
      {},
    );
  });

  it("returns no status without rules", () => {
    expect(evaluateStatus([], entities())).toEqual({});
  });
});
