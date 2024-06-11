import { Component } from "./component.js"
import { Router } from "./router.js";
import { Navbar } from "../components/navbar.js";
import { Chat } from "../components/chat.js";
import { Message } from "../components/chat/message.js";
import { Friend } from "../components/chat/friend.js";
import { Clock } from "../components/clock.js";
import { Login } from "../components/sign/login.js";
import { SSign } from "../components/sign/switchSign.js";
import { SignUp } from "../components/sign/signUp.js";
import { LangBtn } from "../components/lang.js";
import { Search } from "../components/navbar/search.js";
import { QuickGame } from "../components/profile/quickgame.js";
import { SquareGame } from "../components/profile/squaregame.js";
import { TeamGame } from "../components/profile/teamgame.js";
import { Settings } from "../components/settings.js";
import { FriendBtn } from "../components/profile/friend-btn.js";

Component.loader([
	Navbar,
	Message,
	Friend,
	Chat,
	Clock,
	Login,
	SSign,
	SignUp,
	LangBtn,
	Search,
	QuickGame,
	SquareGame,
	TeamGame,
	Settings,
	FriendBtn,
])

const navigateTo = url => {
	history.pushState(null, null, url);
	Router.run()
};

window.addEventListener("popstate", (e) => {
	Router.run()
});

document.addEventListener("DOMContentLoaded", () => {
	document.body.addEventListener("click", e => {
		if (e.target.localName == "a" && e.target.id != 1){
			e.preventDefault();
			console.log("test")
			navigateTo(e.target.href);
		}
	});

	Router.run()
});
