import { describe, expect, it } from "vitest";
import { parsePath } from "./parsePath";

describe("parsePath", () => {
	it("should match exact strings", () => {
		const result = parsePath("test", "test");
		expect(result.match).toEqual(true);
	});

	it("should not match different strings", () => {
		const result = parsePath("test", "not-test");
		expect(result.match).toEqual(false);
	});

	it("should not match paths with different part lengths", () => {
		const result = parsePath("test", "test/1");
		expect(result.match).toEqual(false);
	});

	it("should match a path with a parameter", () => {
		const result = parsePath("test/:id", "test/1");
		expect(result.match).toEqual(true);
		expect(result.params).toEqual({ id: "1" });
	});
});
