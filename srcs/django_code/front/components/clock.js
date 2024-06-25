import { Component } from "../js/component.js";
import { translate } from "../js/helpers.js";
import { Thread } from "../js/thread.js";

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
	async getDate()
	{
		const month = [
			await translate("time.january"),
			await translate("time.february"),
			await translate("time.march"),
			await translate("time.april"),
			await translate("time.may"),
			await translate("time.june"),
			await translate("time.july"),
			await translate("time.august"),
			await translate("time.september"),
			await translate("time.october"),
			await translate("time.november"),
			await translate("time.december")
		];
		let date = new Date();

		const day = (date.getDate() < 10) ? '0' + date.getDate() : date.getDate();
		return day + ' ' + month[date.getMonth()] + ' ' + date.getFullYear();
	}

    async connectedCallback() {
		this.innerHTML = content;

		this.querySelector('#clock-time').innerHTML = this.getHours();
		this.querySelector('#clock-date').innerHTML = await this.getDate();

		Thread.new(async () => {
			this.querySelector('#clock-time').innerHTML = this.getHours();
			this.querySelector('#clock-date').innerHTML = await this.getDate();
		}, 1000);

    }
}

const content = /*html*/`
	<span style="font-size: 9em; font-family: 'pong-teko';" id="clock-time"></span>
	<span style="font-size: 3em; margin-top: -1.3em; font-family: 'pong-teko';" id="clock-date"></span>
`;
