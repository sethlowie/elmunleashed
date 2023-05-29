interface ElmApp {
	ports: {
		emailLogin: {
			subscribe: (
				callback: ({ email: string, password: string }) => void,
			) => void;
		};
		loginSuccess: {
			send: (result: any) => void;
		};
	};
}

interface Elm {
	Main: {
		init: (options: { node: HTMLElement; flags: any }) => ElmApp;
	};
}

// add Elm type to window object
declare global {
	interface Window {
		Elm: Elm;
		startApp: (flags: any) => void;
	}
}

export {};
