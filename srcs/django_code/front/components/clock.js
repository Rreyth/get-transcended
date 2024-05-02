import { Component } from "../js/component.js";

export class Clock extends Component {
    static getName() {
        return "clock";
    }

	getHours()
	{
		let date = new Date();
			let heures = (date.getHours() < 10) ? '0' + date.getHours() : date.getHours();
			let minutes = (date.getMinutes() < 10) ? '0' + date.getMinutes() : date.getMinutes();
			let format = `${heures} : ${minutes}`;
	
			return format;
	}

    connectedCallback() {
		this.innerHTML = content;

		this.querySelector('#clock-time').innerHTML = this.getHours();

		setInterval(() => {
			this.querySelector('#clock-time').innerHTML = this.getHours();
		}, 500);
    }
}

const content = /*html*/`
	<span style="font-size: 8em; font-family: 'pong-teko';" id="clock-time"></span>
	<span style="font-size: 3em; margin-top: -1.3em; font-family: 'pong-teko';" id="clock-date">02 MAI 2024</span>
`;
