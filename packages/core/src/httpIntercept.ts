import { parsePath } from "./parsePath";

export interface Module {
	namespace: string;
	get<T = unknown, S = undefined>(
		url: string,
		callback: (data: S) => Promise<T>,
	): void;
	post<T = unknown, S = undefined>(
		url: string,
		callback: (data: S) => Promise<T>,
	): void;

	match<T, S>(url: string, method: string): (data: S) => Promise<T>;
}

class SimpleModule implements Module {
	namespace: string;

	private getListeners: any = {};
	private postListeners: any = {};

	constructor(namespace: string) {
		this.namespace = namespace;
	}

	get<T, S>(path: string, callback: (data: S) => Promise<T>) {
		this.getListeners[path] = callback;
	}

	post<T, S>(path: string, callback: (data: S) => Promise<T>) {
		this.postListeners[path] = callback;
	}

	private findListenersByMethod(method: string) {
		switch (method.toLowerCase()) {
			case "get":
				return this.getListeners;
			case "post":
				return this.postListeners;
			default:
				return {};
		}
	}

	match<T, S>(path: string, method: string): (data: S) => Promise<T> {
		console.log("MATCHING", method, path, this.getListeners[path]);
		const listeners = this.findListenersByMethod(method);
		let handler: any;

		for (const [key, value] of Object.entries(listeners)) {
			if (parsePath(key, path).match) {
				handler = value;
			}
		}
		return handler;
	}
}

export const newModule = (namespace: string) => {
	return new SimpleModule(namespace);
};

export interface IElmHttpRequestInterceptor {
	newModule(namespace: string): Module;
	registerModule(interceptor: Module): void;
	listen(): void;
}

interface XMLHttpRequestExtended extends XMLHttpRequest {
	interceptor?: Module;
	response: any;
	readyState: number;
	onreadystatechange: () => void;
	status: number;
	headers: Record<string, string>;
	defaultSetRequestHeader: (header: string, value: string) => void;
}

export class ElmHttpRequestInterceptor implements IElmHttpRequestInterceptor {
	private interceptors: Module[] = [];
	private defaultOpen = window.XMLHttpRequest.prototype.open;
	private defaultSend = window.XMLHttpRequest.prototype.send;
	private defaultSetRequestHeader =
		window.XMLHttpRequest.prototype.setRequestHeader;
	private headers: Record<string, string> = {};

	newModule(namespace: string): Module {
		const module = new SimpleModule(namespace);
		this.registerModule(module);
		return module;
	}

	registerModule(interceptor: Module): void {
		this.interceptors.push(interceptor);
	}

	listen(): void {
		const self = this;
		// @ts-expect-error
		window.XMLHttpRequest.prototype.open = function (
			this: XMLHttpRequestExtended,
			method,
			url,
			async,
			user,
			password,
		) {
			this.interceptor = self.interceptors.find(
				(interceptor) => interceptor.namespace === method,
			);
			return self.defaultOpen.apply(this, [method, url, async, user, password]);
		};

		window.XMLHttpRequest.prototype.setRequestHeader = function (
			this: XMLHttpRequestExtended,
			header,
			value,
		) {
			console.log("SET REQUEST HEADER", header, value);
			this.headers[header] = value;
			return this.defaultSetRequestHeader(header, value);
		};

		window.XMLHttpRequest.prototype.send = function (
			this: XMLHttpRequestExtended,
			body,
		) {
			if (!this.interceptor) {
				return self.defaultSend.apply(this, [body]);
			}
			if (body) {
				this.setRequestHeader("waffles", "are great");
				console.log("HERE::: ", this.getAllResponseHeaders());
				Object.defineProperty(this, "response", { writable: true });
				Object.defineProperty(this, "status", { writable: true });
				Object.defineProperty(this, "readyState", { writable: true });
				const data = JSON.parse(body.toString());
				const fn = this.interceptor.match(data.path, data.method);
				if (!fn) {
					this.status = 500;
					this.response = objectToArrayBuffer({ error: "No handler found" });
					this.readyState = 4;
					this.onreadystatechange && this.onreadystatechange();
					this.dispatchEvent(new Event("load"));
					return;
				}
				fn(data.body)
					.then((resp) => {
						console.log("RESPONSE", resp);
						this.status = 200;
						this.response = objectToArrayBuffer(resp);
					})
					.catch((_err: unknown) => {
						// fdsa
					})
					.finally(() => {
						this.readyState = 4;
						this.onreadystatechange && this.onreadystatechange();
						this.dispatchEvent(new Event("load"));
					});
			}
		};
	}
}

export const portModule = () => {
	return new ElmHttpRequestInterceptor();
};

function objectToArrayBuffer(obj: unknown) {
	let str = JSON.stringify(obj);
	let buffer = new ArrayBuffer(str.length * 2); // 2 bytes for each char
	let view = new DataView(buffer);

	for (let i = 0; i < str.length; i++) {
		view.setUint16(i * 2, str.charCodeAt(i), true);
	}

	return buffer;
}
