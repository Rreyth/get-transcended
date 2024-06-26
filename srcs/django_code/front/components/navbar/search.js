import { Cache } from "../../js/cache.js";
import { Component } from "../../js/component.js";
import { user, translate, APIRequest } from "../../js/helpers.js";
import { Router } from "../../js/router.js";
import { Chat } from "../chat.js";

export class Search extends Component {

	friends = null

    static getName() {
        return "search";
    }

	async getFriends()
	{
		if (this.friends == null)
		{
			const response = await APIRequest.build("/user/friends/", "GET").send()
			this.friends = await response.json()
		}

		return this.friends
	}

	setFriendAction(elements)
	{
		if (elements)
		{
			elements.forEach(ele => {
				ele.onclick = async () => {
					const response = await APIRequest.build(`/user/friends/requests/`, 'GET').send()
					const data = await response.json()

					const friendRequest = data.received.find(req => req.from_user.username == ele.getAttribute('user-username'))

					if (friendRequest)
					{
						APIRequest.build(`/user/friends/requests/${friendRequest.id}`, 'POST').send()

						ele.classList.remove('bx-user-plus')
						ele.classList.add('bx-message-dots')
					}
					else
					{
						APIRequest.build(`/user/friends/requests/`, 'POST').setBody({ to_user: ele.getAttribute('user-username') }).sendJSON()
					}
				}
			})
		}
	}

	async createCards()
	{
		const attrContent = this.getAttribute('content');
		let response = await APIRequest.build("/user/search/?username_prefix=" + attrContent, "GET").send();
		const friends = await this.getFriends();

		response = await response.json();

		let cards = await response.map(async u => {
			const isFriend = friends.find(e => e.username == u.username)
			
			return createUserCard(u, isFriend)
		})

		cards = await Promise.all(cards)

		return cards.join('')
	}

	async loadContent()
	{
		const r = await APIRequest.build("/user/friends/", "GET").send()

		this.friends = await r.json()

		this.innerHTML = /* html */ `
			<div class="w-100 h-100 d-flex align-items-center flex-column overflow-auto">
				${await this.createCards()}
			</div>
		`;
	}

	async connectedCallback() {
		super.connectedCallback();
		if (await user() != null) {
			if (this.getAttribute('content') === "")
				this.innerHTML = await emptySearch();
			else {
				await this.loadContent()

				this.setFriendAction(this.querySelectorAll('i[data-request="friend"]'))
				this.querySelectorAll('#nav-invite-game').forEach(el => {
					el.onclick = () => {
						Router.push('/pong?room=create');

						setTimeout(async () => {

							const room_id = Cache.get('last-room-id')

							if (room_id)
								Chat.sendInviteCode(el.getAttribute("username"), room_id)
						}, 1000)
					}
				})
				this.querySelectorAll('i[data-request="message"]').forEach(e => {
					e.onclick = () => {
						Chat.openConversation(e.getAttribute('user-username'))
					}
				})
			}
		}
	}

}

async function createUserCard(u, friendId)
{
	if ((await user()).username == u.username)
		return ""

	return ( /* html */`
		<div class="card mb-3 h-25 my-2 user-search-card" style="width: 80%;">
			<div class="row g-0">
				<div class="col-4">
					<c-avatar style="width: 5.9em; height: 5.9em;" src="${u.avatar}" username="${u.username}" connected="${u.online}"></c-avatar>
				</div>
				<div class="col-8">
					<div class="card-body d-flex align-items-center justify-content-center" style="height: 67%;">
						<span class="text-truncate" style="font-size: 1.5em;">${u.username}</span>
					</div>
					<div class="d-flex align-items-start justify-content-evenly btns btns-${u.username}" style="height: 33%;">
						<a is="c-link" href="/user/${u.username}" class="text-decoration-none text-reset"><i class='bx bxs-user-detail rounded-circle bg-body-secondary text-white border border-dark p-1' id="bt-profile"></i></a>
						<i class='bx ${friendId ? 'bx-message-dots' : 'bx-user-plus'} rounded-circle bg-body-secondary text-white border border-dark p-1' style="cursor: pointer;" data-request="${friendId ? 'message' : 'friend'}" user-username="${u.username}"></i>
						<i id="nav-invite-game" username="${u.username}" class='bx bx-joystick rounded-circle bg-body-secondary text-white border border-dark p-1' style="cursor: pointer;"></i>
					</div>
				</div>
			</div>
		</div>
	`);


}

const emptySearch = async () =>/* html */ `
	<div class="w-100 h-100 d-flex justify-content-center align-items-center">
		<i class='bx bx-search-alt bx-lg' ></i>
		<span style="font-size: 1.5em; margin-left: 1em; width: 60%">${await translate("nav.research_user")}</span>
	</div>
`;
