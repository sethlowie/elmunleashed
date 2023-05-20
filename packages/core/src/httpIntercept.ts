export interface ICommandInterceptor {
	canIntercept(method: string, url: string | URL): boolean;
	interceptCommand(body: unknown): Promise<any>;
}

export interface IElmHttpRequestInterceptor {
	registerInterceptor(interceptor: ICommandInterceptor): void;
	enableInterception(): void;
}

interface XMLHttpRequestExtended extends XMLHttpRequest {
	interceptor?: ICommandInterceptor;
}

export class ElmHttpRequestInterceptor implements IElmHttpRequestInterceptor {
	private interceptors: ICommandInterceptor[] = [];
	private defaultOpen = window.XMLHttpRequest.prototype.open;
	private defaultSend = window.XMLHttpRequest.prototype.send;

	registerInterceptor(interceptor: ICommandInterceptor): void {
		this.interceptors.push(interceptor);
	}

	enableInterception(): void {
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
			this.interceptor = self.interceptors.find((interceptor) =>
				interceptor.canIntercept(method, url),
			);
			return self.defaultOpen.apply(this, [method, url, async, user, password]);
		};

		window.XMLHttpRequest.prototype.send = function (
			this: XMLHttpRequestExtended,
			body,
		) {
			if (!this.interceptor) {
				return self.defaultSend.apply(this, [body]);
			}
			// ... rest of customSend logic here ...
		};
	}
}

// const xmlRequestOpen = window.XMLHttpRequest.prototype.open;
// const xmlRequestSend = window.XMLHttpRequest.prototype.send;

// const STATUS_OK = 200;
// const STATUS_INTERNAL_ERROR = 500;

// open(method: string, url: string | URL, async: boolean, username?: string | null, password?: string | null): void;
// function customOpen(
// 	this: TauriXML,
// 	method: string,
// 	url: string | URL,
// 	async: boolean,
// 	user?: string,
// 	password?: string | null,
// ) {
// 	if (method.toLowerCase() === TAURI_METHOD) {
// 		this.isTauri = true;
// 		let urlString = "";
// 		if (typeof url === "string") {
// 			urlString = url;
// 		} else if (url instanceof URL) {
// 			urlString = url.toString();
// 		}
// 		const [op, cmd] = urlString.split("/");
// 		this.tauriOp = op;
// 		this.tauriCmd = cmd;
// 	}
// 	return xmlRequestOpen.apply(this, [method, url, async, user, password]);
// }

// type TauriXML = XMLHttpRequest & {
// 	isTauri?: boolean;
// 	tauriOp?: string;
// 	tauriCmd?: string;
// 	status?: number;
// 	response: string;
// 	readyState: number;
// 	onreadystatechange: () => void;
// };

// function handleTauriInvoke(this: TauriXML, body: unknown) {
// 	let tauriBody;
// 	if (typeof body === "string") {
// 		tauriBody = JSON.parse(body);
// 	}
//
// 	console.log("INVOKING CMD", this.tauriCmd, "WITH BODY", body);
// 	return invoke(this.tauriCmd, tauriBody)
// 		.then((resp: { body: string }) => {
// 			console.log("RESPONSE: ", resp);
// 			this.status = STATUS_OK;
// 			this.response =
// 				this.tauriCmd === "plugin:tauri-elm|http_request"
// 					? resp.body
// 					: typeof resp === "object"
// 					? JSON.stringify(resp)
// 					: resp;
// 		})
// 		.catch((error: unknown) => {
// 			console.log("ERROR: ", error);
// 			this.status = STATUS_INTERNAL_ERROR;
// 			this.response = error;
// 		})
// 		.finally(() => {
// 			this.readyState = 4;
// 			this.onreadystatechange && this.onreadystatechange();
// 			this.dispatchEvent(new Event("load"));
// 		});
// }

// function customSend(this: TauriXML, body?: Document | null) {
// 	if (!this.isTauri) {
// 		return xmlRequestSend.apply(this, [body]);
// 	}
//
// 	if (this.tauriOp === TAURI_INVOKE_OP) {
// 		Object.defineProperty(this, "readyState", { writable: true });
// 		Object.defineProperty(this, "response", { writable: true });
// 		Object.defineProperty(this, "status", { writable: true });
//
// 		return handleTauriInvoke.call(this, body);
// 	}
// }

// window.XMLHttpRequest.prototype.open = customOpen as any;
// window.XMLHttpRequest.prototype.send = customSend;
