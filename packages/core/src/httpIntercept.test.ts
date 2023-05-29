/**
 * @vitest-environment jsdom
 * */

import { describe, beforeEach, it, expect } from "vitest";
import { ElmHttpRequestInterceptor, Module } from "./httpIntercept";

describe("ElmHttpRequestInterceptor", () => {
	let elmInterceptor: ElmHttpRequestInterceptor;
	let module: Module;

	beforeEach(() => {
		elmInterceptor = new ElmHttpRequestInterceptor();
		module = elmInterceptor.newModule("test");
	});

	it("registers a new module correctly", () => {
		expect.assertions(1);
		expect(module.namespace).toEqual("test");
	});

	it("matches the get method", async () => {
		expect.assertions(1);
		const path = "get-path";
		const callback = async () => "get-data";
		module.get(path, callback);

		const result = module.match(path, "get");
		const res = await result(null);
		expect(res).toEqual("get-data");
	});

	it("matches the post method", async () => {
		expect.assertions(1);
		const path = "post-path";
		const callback = async () => "post-data";
		module.post(path, callback);

		const result = module.match(path, "post");
		const res = await result(null);
		expect(res).toEqual("post-data");
	});

	it("returns a reject promise for unsupported method", async () => {
		expect.assertions(1);
		const result = module.match("unsupported-path", "unsupported");
		expect(result).toBeUndefined();
	});
});
