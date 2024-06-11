import { Component } from "../../js/component.js";
import { APIRequest } from "../../js/helpers.js";
import { Group } from "./group.js";

export class AddUserModal extends Component
{
    static getName()
    {
        return "add-user-modal"
    }

    async connectedCallback()
    {
        const friends = await (await APIRequest.build('/user/friends/', 'GET').send()).json()

        this.innerHTML = /* html */`
            <div class="modal fade" id="add-user-modal" tabindex="-1">
                <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h1 class="modal-title fs-5">Add user</h1>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body" id="add-user-modal-body">
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                            <button id="add-friend-btn" type="button" class="btn btn-primary" data-bs-dismiss="modal">Add</button>
                        </div>
                    </div>
                </div>
            </div>`

        this.addEventListener('show.bs.modal', async () => {
            const members = (await (await APIRequest.build(`/user/groups/${Group.groupSelected.groupId}`, 'GET').send()).json()).members

            const checkbox = friends.map(element => {
                return `<c-friend-checkbox username=${element.username} checked=${members.some(m => m.username == element.username)}></c-friend-checkbox>`
            });

            document.querySelector('#add-user-modal-body').innerHTML = checkbox.join(' ')
        })

        document.querySelector('#add-friend-btn').onclick = async () => {
            const members = (await (await APIRequest.build(`/user/groups/${Group.groupSelected.groupId}`, 'GET').send()).json()).members

            const newMembers = [...document.querySelectorAll('input[data-friend]')].map(checkbox => {
                if (!members.some(m => checkbox.parentElement.getAttribute('username') == m.username))
                    return checkbox.parentElement.getAttribute('username')
            })

            console.log(newMembers)

            APIRequest.build(`/user/groups/${Group.groupSelected.groupId}`, 'PUT').setBody({
                members: newMembers,
            }).sendJSON()
        }
    }
}