export class Pong extends HTMLElement {
	connectedCallback() {
        import("../js/pong.js").then(async m => {
            await m.reset()
            m.connect_hub()
        })
	}

	static getName() {
		return "pong";
	}

	static getExtends() {
		return {};
	}
}