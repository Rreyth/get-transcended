import { Component } from "./component.js"
import { Router } from "./router.js";
import { Navbar } from "../components/navbar.js";
import { Chat } from "../components/chat.js";
<<<<<<< HEAD
=======
import { Minichat } from "../components/minichat/minichat.js";
>>>>>>> a27a5e6 (start implement new chat)
import { Message } from "../components/minichat/message.js";
import { Friend } from "../components/minichat/friend.js";
import { Setting } from "../components/minichat/setting.js";
import { ChatInput } from "../components/minichat/input.js";
import { Clock } from "../components/clock.js";
import { Login } from "../components/sign/login.js";
import { SSign } from "../components/sign/switchSign.js";
import { SignUp } from "../components/sign/signUp.js";
import { LangBtn } from "../components/lang.js";

Component.loader([
	Navbar,
	Message,
	Friend,
	Chat,
	Setting,
	ChatInput,
	Clock,
	Login,
	SSign,
	SignUp,
	LangBtn,
	Chat,
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