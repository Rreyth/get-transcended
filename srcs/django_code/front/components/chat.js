import { Component } from "../js/component.js";
import { APIRequest, user_token } from "../js/helpers.js"
import { Friend } from "./chat/friend.js";
import { Group } from "./chat/group.js";

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
	static chatInput = null

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
		const response = await APIRequest.build('/user/groups/', 'GET').send()

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
					<div class="d-flex gap-2" id="chat-title">
						<h5>Chat</h5>
					</div>
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
						<div class="list-group-item list-group-item-action d-flex align-items-center gap-2" id="chat-create-group">
							<i class='bx bx-plus bx-sm'></i>
							<span>Cree un groupe</span>
						</div>
					</div>
				</div>
				<div class="card-body overflow-auto d-none" id="chat-messages" style="height: 20em;">
				</div>
				<div class="card-footer">
					<input class="form-control form-control-sm" type="text" placeholder="Search" id="chat-input" />
				</div>
			</div>
        `;

		if (this.getAttribute('close'))
			Chat.close()

		Chat.chatInput = this.querySelector('#chat-input')

		this.addClickEvent('#chat-close', () => {
			Chat.close()
		});

		(await this.getFriends()).forEach(friend => {
			document.querySelector('#chat-friends').innerHTML += `<c-friend avatar="${friend.avatar}" username="${friend.username}"></c-friend>`
		});

		(await this.getGroups()).forEach(group => {
			document.querySelector('#chat-groups').innerHTML += `<c-group group-id=${group.id} group-name=${group.name}></c-group>`
		});

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

				Chat.chatInput.value = ''
				Chat.chatInput.dispatchEvent(new Event('input', { bubbles: true }))
			}
		})

		const socket = await this.setUpWebSocket();

		Chat.chatInput.onkeydown = (event) => {
			if (event.key != 'Enter' || !event.target.value.length)
				return;

			if (Chat.state == State.FRIEND_CONVERSATION)
			{
				Chat.sendPrivateMessage(socket, Friend.friendSelected.username, escapeHtml(event.target.value.replace(/\n/g, "<br>")))
			}

			if (Chat.state == State.GROUP_CONVERSATION)
			{
				Chat.sendGroupMessage(socket, Group.groupSelected.groupId, escapeHtml(event.target.value.replace(/\n/g, "<br>")))
			}

			event.target.value = '';
		}
		Chat.chatInput.oninput = (event) => {
			if (Chat.state == State.FRIEND_SECTION)
			{
				document.querySelector("#chat-friends").querySelectorAll("c-friend").forEach(friend => {
					if (!friend.getAttribute("username").startsWith(event.target.value))
						friend.classList.add('d-none')
					else
						friend.classList.remove('d-none')
				})
			}
			else if(Chat.state == State.GROUP_SECTION)
			{
				document.querySelector("#chat-groups").querySelectorAll("c-group").forEach(group => {
					if (!group.getAttribute('group-name').startsWith(event.target.value))
						group.classList.add('d-none')
					else
						group.classList.remove('d-none')
				})
			}
		};

	}

	handleClick(ev)
	{
		switch (ev.target.id) {
			case 'chat-create-group':
				break;
			case 'chat-add-user-group':
				break;
			case 'chat-leave-group':
				break;
		}
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
					const body = document.querySelector('#chat-messages')
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
		if (Chat.state == State.GROUP_CONVERSATION)
			return roomName == Group.groupSelected.groupId
		return false
	}

	static sendMessage(socket, chatType, roomName, message) {
		socket.send(JSON.stringify({
			'type': chatType,
			'room_name': roomName,
			'message': message
		}));
	}

	static sendGroupMessage(socket, groupId, message) {
		Chat.sendMessage(socket, 'GroupChat', groupId, message);
	}

	static sendPrivateMessage(socket, username, message) {
		Chat.sendMessage(socket, 'PrivateChat', username, message);
	}

	static async displayConversation(type, id)
	{
		const response = await APIRequest.build(`/user/${type == 'GROUP' ? `groups/${id.groupId}` : `dm/${id}`}`, 'GET').send();
		const messages = await response.json();
		const chatTitle = document.querySelector('#chat-title')
		const body = document.querySelector('#chat-messages');
		const options = /* html */`
			<i class='bx bx-dots-vertical-rounded bx-sm' data-bs-toggle="dropdown"></i>
			<ul class="dropdown-menu">
				<li id="chat-add-user-group" class="dropdown-item d-flex align-items-center gap-2"><i class='bx bxs-user-plus bx-sm'></i> Add friend</li>
				<li id="chat-leave-group" class="dropdown-item text-danger d-flex align-items-center gap-2"><i class='bx bx-log-out bx-sm'></i> Leave</li>
			</ul>`

		chatTitle.innerHTML = /* html */`
			<div class="dropstart d-flex align-items-center">
				<i class='bx bx-left-arrow-alt bx-sm' id="chat-back"></i>
				${type == 'GROUP' ? options : ''}
			</div>
			${type == 'GROUP' ? id.groupName : id}
		`

		document.querySelector('#chat-back').onclick = () => {
			chatTitle.innerHTML = /* html */`<h5>Chat</h5>`
			body.innerHTML = ""
			document.querySelector('#chat-body').classList.remove('d-none')
			body.classList.add('d-none')
			Chat.state = type == 'GROUP' ? State.GROUP_SECTION : State.FRIEND_SECTION 
		}

		messages.map(message => {
			const el = document.createElement('c-message');

			el.setAttribute('who', message.sender.username);
			el.setAttribute('date', message.created_at);
			el.setAttribute('content', message.content);

			body.appendChild(el);
		});

		document.querySelector('#chat-body').classList.add('d-none')
		body.classList.remove('d-none')

		await new Promise(resolve => requestAnimationFrame(resolve));

		setTimeout(() => {
			body.scrollTop = body.scrollHeight;
		}, 10);

		Chat.state = type == 'GROUP' ? State.GROUP_CONVERSATION : State.FRIEND_CONVERSATION
	}

	static close()
	{
		const chat = document.querySelector(`c-${Chat.getName()}`)

		if (!chat.classList.contains('d-none'))
		{
			Chat.state = State.FRIEND_SECTION
			chat.classList.add('d-none')
		}
	}

	static open()
	{
		const chat = document.querySelector(`c-${Chat.getName()}`)

		chat.classList.remove('d-none')
	}

	static openOrClose()
	{
		const chat = document.querySelector(`c-${Chat.getName()}`)

		if (chat.classList.contains('d-none'))
		{
			Chat.open()
		}
		else
		{
			Chat.close()
		}
	}
}
