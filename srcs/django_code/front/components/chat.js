import { Component } from "../js/component.js";
import { APIRequest, user_token } from "../js/helpers.js"
import { Friend } from "./chat/friend.js";

const State = Object.freeze({
	FRIEND_SECTION: Symbol("friend_section"),
	GROUP_SECTION: Symbol("group_section"),
	FRIEND_CONVERSATION: Symbol("friend_conversation"),
	GROUP_CONVERSATION: Symbol("group_conversation"),
});

const escapeHtml = (text) => {
	let map = {
		'&': '&amp;',
		'<': '&lt;',
		'>': '&gt;',
		'"': '&quot;',
		"'": '&#039;'
	};
	return text.replace(/[&<>"']/g, function (m) { return map[m]; });
}

export class Chat extends Component {

	static state = State.FRIEND_SECTION

	static getName() {
		return "chat-body"
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

	async getGroups()
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
			<div class="card position-absolute w-25" style="bottom: 5em; right: 0.5em; min-width: 20em;">
				<div class="card-header d-flex justify-content-between">
					<h5 class="d-flex align-items-center" id="chat-title">Chat</h5>
					<button type="button" class="btn-close" aria-label="Close" id="chat-close"></button>
				</div>
				<div class="card-body overflow-auto" id="chat-body" style="height: 20em;">
					<div class="btn-group w-100 mb-4" role="group">
						<input type="radio" class="btn-check" name="btnradio" id="btn-groups" autocomplete="off">
						<label class="btn btn-outline-primary" for="btn-groups">Groups</label>
					
						<input type="radio" class="btn-check" name="btnradio" id="btn-friends" autocomplete="off" checked>
						<label class="btn btn-outline-primary" for="btn-friends">Friends</label>
					</div>
					<div class="list-group" id="chat-friends">
					</div>
					<div class="list-group d-none" id="chat-groups">
					</div>
				</div>
				<div class="card-footer">
					<input class="form-control form-control-sm" type="text" placeholder="Search" id="chat-input" />
				</div>
			</div>
        `;

		this.addClickEvent('#chat-close', () => {
			Chat.state = State.FRIEND_SECTION
			this.remove()
		});

		(await this.getFriends()).map(friend => {
			document.querySelector('#chat-friends').innerHTML += `<c-friend avatar="${friend.avatar}" username="${friend.username}"></c-friend>`
		})

		this.querySelectorAll("input[type=radio]").forEach(input => {
			input.onchange = (event) => {
				const friends = this.querySelector("#chat-friends")
				const groups = this.querySelector('#chat-groups')
				
				if (Chat.state == State.FRIEND_SECTION) {
					friends.classList.add('d-none')
					groups.classList.remove('d-none')
					Chat.state = State.GROUP_SECTION
				} else {
					groups.classList.add('d-none')
					friends.classList.remove('d-none')
					Chat.state = State.FRIEND_SECTION
				}
			}
		})

		const socket = await this.setUpWebSocket();

		this.querySelector('#chat-input').onkeydown = (event) => {
			if (Chat.state == State.FRIEND_CONVERSATION && event.key === 'Enter' && event.target.value.length) {
				Chat.sendPrivateMessage(socket, Friend.friendSelected.username, escapeHtml(event.target.value.replace(/\n/g, "<br>")))
				event.target.value = '';
			}

			if (Chat.state == State.FRIEND_SECTION)
			{

			}
		};

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

			socket.onmessage = function(event) {
				const data = JSON.parse(event.data);

				if (Chat.inRoom(data.room_name))
				{
					const body = document.querySelector('#chat-body')
					const el = document.createElement('c-message');

					el.setAttribute('who', data.sender);
					el.setAttribute('date', data.date);
					el.setAttribute('content', data.message);

					body.appendChild(el);
					setTimeout(() => {
						body.scrollTop = body.scrollHeight;
					}, 5);
				}
			};

			return socket
		}

		return null
	}

	static inRoom(roomName)
	{
		if (Chat.state == State.FRIEND_CONVERSATION)
			return roomName == Friend.friendSelected.username
		return false
	}

	static sendMessage(socket, chatType, roomName, message) {
		socket.send(JSON.stringify({
			'type': chatType,
			'room_name': roomName,
			'message': message
		}));
	}

	static sendGroupMessage(socket, groupName, message) {
		Chat.sendMessage(socket, 'GroupChat', groupName, message);
	}

	static sendPrivateMessage(socket, username, message) {
		Chat.sendMessage(socket, 'PrivateChat', username, message);
	}

	static async displayDmWith(username)
	{
		const response = await APIRequest.build(`/user/dm/${username}`, 'GET').send();
		const messages = await response.json();

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

		Chat.state = State.FRIEND_CONVERSATION
	}
}
