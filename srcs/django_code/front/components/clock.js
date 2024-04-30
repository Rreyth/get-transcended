import { Component } from "../js/component.js";

export class Clock extends Component {
    static getName() {
        return "clock";
    }

    connectedCallback() {
		this.innerHTML = content;


		setInterval(() => {
			let date = new Date();
			let heures = (date.getHours() < 10) ? '0' + date.getHours() : date.getHours();
			let minutes = (date.getMinutes() < 10) ? '0' + date.getMinutes() : date.getMinutes();
			// let format = heures + ':' + minutes;
			let format = `${heures} : ${minutes}`;
	
			this.querySelector('#clock-time').innerHTML = format;
		}, 500);
    }
}

const content = /*html*/`
	<div>
		<span style="font-size: 5em;" id="clock-time"></span>
	</div>
`;
