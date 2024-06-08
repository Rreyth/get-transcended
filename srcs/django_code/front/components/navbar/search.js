import { Component } from "../../js/component.js";
import { user, translate, user_token, api } from "../../js/helpers.js";

export class Search extends Component {

	friends = null

    static getName() {
        return "search";
    }

	async getFriends()
	{
		if (this.friends == null)
		{
			const response = await api("/user/friends/", "GET", null, await user_token())
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
					const response = await api(`/user/friends/requests/`, 'GET', null, await user_token())
					const data = await response.json()

					const friendRequest = data.received.find(req => req.from_user.id == ele.getAttribute('user-id'))

					if (friendRequest)
					{
						api(`/user/friends/requests/${friendRequest.id}`, 'POST', null, await user_token())

						ele.classList.remove('bx-user-plus')
						ele.classList.add('bx-message-dots')
					}
					else
					{
						api(`/user/friends/requests/`, 'POST', JSON.stringify({ to_user: ele.getAttribute('user-id') }), await user_token())
					}
				}
			})
		}
	}

	async connectedCallback() {
		super.connectedCallback();
		if (await user() != null) {
			let token = await user_token();
			let attrContent = this.getAttribute('content');


			if (this.getAttribute('content') === "")
				this.innerHTML = await emptySearch();
			else {
				let response = await api("/user/search/?username_prefix=" + attrContent, "GET", null, token);
				response = await response.json();
			
				this.innerHTML = /* html */ `
					<div class="w-100 h-100 d-flex align-items-center flex-column overflow-auto">
						${(await Promise.all(response.map(async u => createUserCard(u, (await this.getFriends()).find(e => e.username == u.username))))).join('')}
					</div>
					<style>
						.user-search-card:hover
						{
							border-color: blue;
						}
					</style>
				`;

				this.setFriendAction(this.querySelectorAll('i[data-request="friend"]'))
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
				<div class="col-md-4">
					<img src="${u.avatar}" class="img-fluid rounded-start" alt="...">
				</div>
				<div class="col-md-8">
					<div class="card-body d-flex align-items-center justify-content-center" style="height: 67%;">
						<span class="text-truncate" style="font-size: 1.5em;">${u.username}</span>
					</div>
					<div class="d-flex align-items-start justify-content-evenly btns btns-${u.username}" style="height: 33%;">
						<a href="/user/${u.username}" class="text-decoration-none text-reset"><i class='bx bxs-user-detail rounded-circle bg-light border border-dark p-1' id="bt-profile"></i></a>
						<i class='bx ${friendId ? 'bx-message-dots' : 'bx-user-plus'} rounded-circle bg-light border border-dark p-1' style="cursor: pointer;" data-request="${friendId ? 'message' : 'friend'}" user-id="${u.id}"></i>
						<i class='bx bx-joystick rounded-circle bg-light border border-dark p-1' style="cursor: pointer;"></i>
					</div>
				</div>
			</div>
		</div>
	`);
}

const emptySearch = async () =>/* html */ `
	<div class="w-100 h-100 d-flex justify-content-center align-items-center">
		<i class='bx bx-search-alt bx-lg' ></i>
		<span style="font-size: 1.5em; margin-left: 1em; width: 60%">${await translate("nav.rshUser")}</span>
	</div>
`;
