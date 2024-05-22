import { Component } from "../js/component.js";
import { escapeHtml, scrollbarToEnd } from "../js/utils.js";
import { api, user_token, auth, user } from "../js/helpers.js"
import { Cache } from "../js/cache.js";
import { Friend } from "./minichat/friend.js";

export class Chat extends Component {

	static getName() {
		return "chat-body"
	}

	static sendMsg(socket, msg) {
		socket.send(JSON.stringify({
			'message': msg,
			'recever_id': Friend.lastFriendActive.getAttribute("user-id")
		}));
	}

	async getFriends()
	{
		const response = await api('/user/friends/', 'GET', null, await user_token())

		if (response.ok)
		{
			return await response.json()
		}

		return []
	}

	async connectedCallback() {
		this.innerHTML = /* html */`
			<div class="rounded-4 d-inline-flex justify-content-start align-items-start border border-secondary" style="height: 25em;">
				<div class="border-secondary border-end d-inline-flex flex-column justify-content-between align-self-stretch">
					<div class="d-flex align-self-stretch flex-column justify-content-start align-items-center gap-2 p-2" id="chat-friends">
					</div>
					

					<div class="d-flex justify-content-around align-items-center border-top border-secondary" style="padding: 0.20em;">
						<i class='bx bx-group fs-1'></i>
						<div class="border-secondary border" style="width: 1.5em; height: 0px; transform: rotate(90deg);"></div>
						<i class='bx bx-user fs-1'></i>
					</div>
				</div>

				<div class="d-flex flex-column align-items-stretch justify-content-between h-100">
					<div class="d-flex justify-content-between align-items-center gap-3 p-3 border-bottom border-secondary">
						<h3 id="friend-name">Personne</h3>
						<i class='bx bxs-cog fs-2'></i>
					</div>
					
					<div class="d-flex flex-column overflow-auto py-2" id="messages">
						<p class="text-center w-100">Selectionner un amie !</p>
					</div>

					<div class="d-flex align-items-center justify-content-center border-top border-secondary" style="padding: 0.5em;">
						<input class="rounded" placeholder="Votre message..." name="message" />
						<i class='bx bx-send fs-3' ></i>
					</div>
				</div>
			</div>
        `;

		const friends = await this.getFriends();

		friends.map(friend => {
			document.querySelector('#chat-friends').innerHTML += `<c-friend user-id="${friend.id}" username="${friend.username}"></c-friend>`
		})

		document.getElementById('msg-area').addEventListener('keydown', function (event) {
			if (event.key === 'Enter' && !event.shiftKey) {
				event.preventDefault();
				if (document.getElementById('msg-area').value === '')
					return;
				let msg = escapeHtml(document.getElementById('msg-area').value)
				Chat.sendMsg(socket, msg.replace(/\n/g, "<br>"));
				document.getElementById('msg-area').value = '';
			}
		});

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

			socket.onmessage = function (event) {
				const data = JSON.parse(event.data);

				document.querySelector("#messages").innerHTML += `<c-message who="${data.username}" date="${data.date}" content="${data.message}"></c-message>`
			};
		}
	}

	static async fetchDmWith(userId)
	{
		const response = await api(`/user/dm/${userId}`, 'GET', null, await user_token());

		return await response.json();
	}

	static async getDmWith(userId)
	{
		let messages = Cache.getOrCreate("messages", {});

		if (messages.hasOwnProperty(userId))
		{
			return messages[userId];
		}
		else
		{
			messages[userId] = await Chat.fetchDmWith(userId);

			Cache.set("messages", messages);

			return messages[userId];
		}
	}

	static async displayDmWith(friendElement)
	{
		const messages = await Chat.getDmWith(friendElement.userId);
		let element = document.querySelector('#messages')

		document.querySelector('#friend-name').innerHTML = friendElement.username

		element.innerHTML = ""

		messages.map(message => {
			element.innerHTML += `<c-message who="${message.sender.username}" date="${message.created_at}" content="${message.content}"></c-message>`
		});
	}

}
