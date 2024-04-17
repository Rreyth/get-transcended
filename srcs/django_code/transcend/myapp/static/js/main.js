import { Component } from "./component.js"
import { Router } from "./router.js";
import { Navbar } from "../html/components/navbar.js";
import { Minichat } from "../html/components/minichat/minichat.js";
import { Message } from "../html/components/minichat/message.js";
import { Friend } from "../html/components/minichat/friend.js";
import { ChatInput } from "../html/components/minichat/input.js";

Component.loader([
	Navbar,
	Minichat,
	Message,
	Friend,
	ChatInput,
])

const navigateTo = url => {
	history.pushState(null, null, url);
	Router.run()
};

window.addEventListener("popstate", Router.run());

document.addEventListener("DOMContentLoaded", () => {
	document.body.addEventListener("click", e => {
		if (e.target.localName == "a" && e.target.id != 1){
			e.preventDefault();
			navigateTo(e.target.href);
		}
	});
});

const socket = new WebSocket('wss://localhost:44433/api/chat')

socket.onmessage = event => {
	const data = JSON.parse(event.data);

	console.log("data")
};
