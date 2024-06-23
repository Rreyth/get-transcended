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
import { Group } from "../components/chat/group.js";
import { FriendCheckbox } from "../components/chat/friendCheckbox.js";
import { AddUserModal } from "../components/chat/addUserModal.js";
import { CreateGroupModal } from "../components/chat/createGroupModal.js";
import { NavProfile } from "../components/navbar/profile.js";
import { Avatar } from "../components/avatar.js";
import { About } from "../components/about.js";
import { Podium } from "../components/leaderboard/podium.js";
import { LeadUser } from "../components/leaderboard/leaduser.js";
import { Link } from "../components/link.js";
import { Pong } from "../components/pong/pong.js";
import { Leaderboard } from "../components/leaderboard/leaderboard.js";
import { Profile } from "../components/profile/profile.js";
import { ProfileHeader } from "../components/profile/profileheader.js";
import { ProfileCard } from "../components/profile/profilecard.js";
import { NavbarButton } from "../components/bootstrap/navbarButton.js";

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
	Group,
	FriendCheckbox,
	AddUserModal,
	CreateGroupModal,
	NavProfile,
	Avatar,
	About,
	Podium,
	LeadUser,
	Link,
	Pong,
	Leaderboard,
	Profile,
	ProfileHeader,
	ProfileCard,
	NavbarButton
])

// window.addEventListener("popstate", (e) => {
// 	Router.run();
// });

// document.addEventListener("DOMContentLoaded", () => {
// 	Router.run();
// });
