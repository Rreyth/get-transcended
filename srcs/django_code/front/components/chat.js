import { Component } from "../js/component.js";
import { APIRequest, translate } from "../js/helpers.js"
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
		super.connectedCallback()

		this.innerHTML = /* html */`
			<c-add-user-modal></c-add-user-modal>
			<c-create-group-modal></c-create-group-modal>
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
						<label class="btn btn-outline-primary" for="btn-groups">${ await translate("chat.groups") }</label>
					
						<input type="radio" class="btn-check" name="btnradio" id="btn-friends" autocomplete="off" checked>
						<label class="btn btn-outline-primary" for="btn-friends">${ await translate("chat.friends") }</label>
					</div>
					<div class="list-group" id="chat-friends">
					</div>
					<div class="list-group d-none" id="chat-groups">
						<div data-bs-toggle="modal" data-bs-target="#create-group-modal" class="list-group-item list-group-item-action d-flex align-items-center gap-2" id="chat-create-group">
							<i class='bx bx-plus bx-sm'></i>
							<span>${ await translate("chat.create_group") }</span>
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

		this.classList.add('d-none')
		Chat.chatInput = this.querySelector('#chat-input')

		this.addClickEvent('#chat-close', () => {
			Chat.close()
		});

		(await this.getFriends()).forEach(friend => {
			Chat.addFriend(friend)
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

		Chat.chatInput.onkeydown = (event) => {
			if (event.key != 'Enter' || !event.target.value.length)
				return;

			switch (Chat.state)
			{
				case State.FRIEND_CONVERSATION:
					Chat.sendMessage(escapeHtml(event.target.value.replace(/\n/g, "<br>")))
					break;
				case State.GROUP_CONVERSATION:
					Chat.sendMessage(escapeHtml(event.target.value.replace(/\n/g, "<br>")))
					break;
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

	async handleClick(ev)
	{
		switch (ev.target.id) {
			case 'chat-leave-group':
				const response = await APIRequest.build(`/user/groups/${Group.groupSelected.groupId}/leave`, 'POST').send()
				if (response.ok)
				{
					Group.groupSelected.remove()
					document.querySelector('#chat-back').click()
				}
				break;
			case 'chat-block-user':
				await APIRequest.build(`/user/blocks`, 'POST').setBody({
					user: Friend.friendSelected.username
				}).sendJSON()
				Friend.friendSelected.remove()
				document.querySelector('#chat-back').click()
				break;
		}
	}

	static inRoom(roomName)
	{
		if (Chat.state == State.FRIEND_CONVERSATION)
			return roomName == Friend.friendSelected.username
		if (Chat.state == State.GROUP_CONVERSATION)
			return roomName == Group.groupSelected.groupId
		return false
	}

	static async sendInviteCode(username, code) {
		const response = await APIRequest.build(`/user/dm/${username}`, 'POST').setBody({
			content: `[invite code=${code}]`
		}).sendJSON()

		if (!response.ok)
		{
			Chat.sendEphemeral('Cet utilisateur vous a bloqué.', 'danger-subtle', 'danger')
		}
	}

	static async sendMessage(message) {
		if (Chat.state == State.FRIEND_CONVERSATION)
		{
			const response = await APIRequest.build(`/user/dm/${Friend.friendSelected.username}`, 'POST').setBody({
				content: message
			}).sendJSON()

			if (!response.ok)
			{
				Chat.sendEphemeral('Cet utilisateur vous a bloqué.', 'danger-subtle', 'danger')
			}
		}
		else if (Chat.state == State.GROUP_CONVERSATION)
		{
			APIRequest.build(`user/groups/${Group.groupSelected.groupId}/messages`, 'POST').setBody({
				content: message
			}).sendJSON()
		}
	}

	static sendEphemeral(content, color, subColor)
	{
		const body = document.querySelector('#chat-messages');

		const el = document.createElement('div');
		el.classList.add('card', 'border', 'border-2', 'rounded-4', `bg-${color}`, `border-${subColor}`, 'my-3')
		el.innerHTML = /* html */`
			<div class="card-body">
				${content}
			</div>`

		body.appendChild(el);
	}

	static async displayConversation(type, id)
	{
		const response = await APIRequest.build(`/user/${type == 'GROUP' ? `groups/${id.groupId}/messages` : `dm/${id}`}`, 'GET').send();
		const messages = await response.json();
		const chatTitle = document.querySelector('#chat-title')
		const body = document.querySelector('#chat-messages');
		const options = /* html */`
			<li class="dropdown-item d-flex align-items-center gap-2" data-bs-toggle="modal" data-bs-target="#add-user-modal"><i class='bx bxs-user-plus bx-sm'></i> Add friend</li>
			<li id="chat-leave-group" class="dropdown-item text-danger d-flex align-items-center gap-2"><i class='bx bx-log-out bx-sm'></i> Leave</li>`

		chatTitle.innerHTML = /* html */`
			<div class="dropstart d-flex align-items-center">
				<i class='bx bx-left-arrow-alt bx-sm' id="chat-back"></i>
				<i class='bx bx-dots-vertical-rounded bx-sm' data-bs-toggle="dropdown"></i>
				<ul class="dropdown-menu">
					${type == 'GROUP' ? options : /* html */`<li id="chat-block-user" class="dropdown-item text-danger d-flex align-items-center gap-2"><i class='bx bx-block'></i> Bloquer</li>`}
				</ul>
			</div>
			${type == 'GROUP' ? id.groupName : id}
		`

		document.querySelector('#chat-back').onclick = async () => {
			chatTitle.innerHTML = /* html */`<h5>Chat</h5>`
			body.innerHTML = ""
			document.querySelector('#chat-body').classList.remove('d-none')
			body.classList.add('d-none')
			Chat.state = type == 'GROUP' ? State.GROUP_SECTION : State.FRIEND_SECTION 
			Chat.chatInput.placeholder = await translate("search")
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

	static addFriend(user)
	{
		document.querySelector('#chat-friends').innerHTML += `<c-friend avatar="${user.avatar}" username="${user.username}" connected="${user.online}"></c-friend>`
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

	static openConversation(username)
	{
		const ele = document.querySelector(`c-friend[username=${username}]`)

		if (ele != null)
		{
			if (Chat.state != State.FRIEND_CONVERSATION)
				ele.click();
			else if (Chat.state == State.FRIEND_CONVERSATION && Friend.friendSelected.username != username)
				ele.click();
		}

		Chat.open()
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
