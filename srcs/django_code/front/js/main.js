import { Component } from "./component.js"
import { Router } from "./router.js";
import { Navbar } from "../components/navbar.js";
import { Minichat } from "../components/minichat/minichat.js";
import { Message } from "../components/minichat/message.js";
import { Friend } from "../components/minichat/friend.js";
import { ChatInput } from "../components/minichat/input.js";
import { Clock } from "../components/clock.js";
import { Login } from "../components/sign/login.js";
import { SSign } from "../components/sign/switchSign.js";
import { SignUp } from "../components/sign/signUp.js";
import { LangBtn } from "../components/lang.js";
import { Search } from "../components/navbar/search.js";

Component.loader([
	Navbar,
	Minichat,
	Message,
	Friend,
	ChatInput,
	Clock,
	Login,
	SSign,
	SignUp,
	LangBtn,
	Search,
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
