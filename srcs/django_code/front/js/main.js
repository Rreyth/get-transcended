import { Component } from "./component.js"
import { Router } from "./router.js";
import { Navbar } from "../components/navbar.js";
import { Chat } from "../components/chat.js";
import { Message } from "../components/minichat/message.js";
import { Friend } from "../components/minichat/friend.js";
import { Setting } from "../components/minichat/setting.js";

Component.loader([
	Navbar,
	Message,
	Friend,
	Chat,
	Setting,
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