import { Component } from "../js/component.js";
import { APIRequest, user_token } from "../js/helpers.js"
import { Cache } from "../js/cache.js";
import { Friend } from "./chat/friend.js";

const State = Object.freeze({
    DEFAULT: Symbol("default"),
	FRIEND_SELECTED: Symbol("friend_selected"),
	GROUP_SELECTED: Symbol("group_selected"),
});

export class Chat extends Component {

	static getName() {
		return "chat-body"
	}

	static escapeHtml(text)
	{
		let map = {
			'&': '&amp;',
			'<': '&lt;',
			'>': '&gt;',
			'"': '&quot;',
			"'": '&#039;'
		};
		return text.replace(/[&<>"']/g, function (m) { return map[m]; });
	}

	static sendMsg(socket, msg) {
		socket.send(JSON.stringify({
			'message': msg,
			'recever_id': Friend.lastFriendActive.getAttribute("user-id")
		}));
	}

	async getFriends()
	{
		const response = await APIRequest.build('/user/friends/', 'GET').send()

		if (response.ok)
		{
			return await response.json()
		}

		return []
	}

	async connectedCallback() {
		this.innerHTML = /* html */`
			<div class="card position-absolute" style="bottom: 5em; right: 0.5em;">
				<div class="card-header d-flex justify-content-between">
					<h5 id="chat-title">Chat</h5>
					<button type="button" class="btn-close" aria-label="Close" id="chat-close"></button>
				</div>
				<div class="card-body" id="chat-body">
					<div class="list-group" id="chat-friends">
					</div>
				</div>
				<div class="card-footer">
					<input class="form-control form-control-sm" type="text" placeholder="Search" aria-label=".form-control-sm example">
				</div>
			</div>
        `;

		this.querySelector('#chat-close').addEventListener('click', () => {
			this.remove();
		});

		const socket = await this.setUpWebSocket()

		const friends = await this.getFriends();

		friends.map(friend => {
			document.querySelector('#chat-friends').innerHTML += `<c-friend avatar="${friend.avatar}" username="${friend.username}"></c-friend>`
		})

		// this.querySelector('#msg-area').addEventListener('keydown', function (event) {
		// 	if (event.key === 'Enter' && !event.shiftKey) {
		// 		event.preventDefault();
		// 		if (document.getElementById('msg-area').value === '')
		// 			return;
		// 		let msg = Chat.escapeHtml(document.getElementById('msg-area').value)
		// 		// Chat.sendMsg(socket, msg.replace(/\n/g, "<br>"));
		// 		Chat.sendPrivateMessage(socket, Friend.lastFriendActive.username, msg.replace(/\n/g, "<br>"))
		// 		document.getElementById('msg-area').value = '';
		// 	}
		// });

	}

	async setUpWebSocket()
	{
		const token = await user_token()

		if (token != null)
		{
			const socket = new WebSocket(
				'wss://'
				+ window.location.host
				+ '/ws/messages?token='
				+ token
			);

			// socket.onmessage = async (event) => {
			// 	const data = JSON.parse(event.data);
			// 	const element = document.querySelector("#messages");

			// 	element.innerHTML += `<c-message who="${data.username}" date="${data.date}" content="${data.message}"></c-message>`
			// 	await new Promise(resolve => requestAnimationFrame(resolve));

			// 	setTimeout(() => {
			// 		element.scrollTop = element.scrollHeight;
			// 	}, 5);
			// };

			// const socket = new WebSocket('ws://' + window.location.host + '/ws/chat/');

			socket.onmessage = function(event) {
				const data = JSON.parse(event.data);
				const message = data.message;
				const sender = data.sender;

				if (data.chat_type === 'GROUP')
					console.log('Group chat: ' + sender + ': ' + message);
				else if (data.chat_type === 'PRIVATE')
					console.log('Private chat: ' + sender + ': ' + message);
				else
					console.log('Unknown chat type: ' + sender + ': ' + message);
			};

			return socket
		}

		return null
	}

	static sendMessage(socket, chatType, roomName, message) {
		socket.send(JSON.stringify({
			'type': chatType,
			'room_name': roomName,
			'message': message
		}));
	}

	static sendGroupMessage(socket, groupName, message) {
		Chat.sendMessage(socket, 'group_chat', groupName, message);
	}

	static sendPrivateMessage(socket, username, message) {
		Chat.sendMessage(socket, 'PrivateChat', username, message);
	}

	static async fetchDmWith(username)
	{
		const response = await APIRequest.build(`/user/dm/${username}`, 'GET').send();

		return await response.json();
	}

	static async getDmWith(username)
	{
		let messages = Cache.getOrCreate("messages", {});

		if (messages.hasOwnProperty(username))
		{
			return messages[username];
		}
		else
		{
			messages[username] = await Chat.fetchDmWith(username);

			Cache.set("messages", messages);

			return messages[username];
		}
	}

	static async displayDmWith(username)
	{
		const messages = await Chat.getDmWith(username);
		const body = document.querySelector('#chat-body')

		document.querySelector('#chat-title').innerHTML = username

		body.innerHTML = ""

		messages.map(message => {
			const el = document.createElement('c-message');

			el.setAttribute('who', message.sender.username);
			el.setAttribute('date', message.created_at);
			el.setAttribute('content', message.content);

			body.appendChild(el);
		});

		await new Promise(resolve => requestAnimationFrame(resolve));

		setTimeout(() => {
			body.scrollTop = body.scrollHeight;
		}, 10);
	}

}
