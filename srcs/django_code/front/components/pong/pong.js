export class Pong extends HTMLElement {
	connectedCallback() {
		this.innerHTML = `
			<canvas id="pong_canvas"></canvas>
		`;
		import("../../js/pong.js").then(async m => {
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
