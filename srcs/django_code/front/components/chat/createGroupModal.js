import { Component } from "../../js/component.js";
import { APIRequest } from "../../js/helpers.js";

export class CreateGroupModal extends Component
{
    static getName()
    {
        return "create-group-modal"
    }

    connectedCallback()
    {
        this.innerHTML = /* html */`
            <div class="modal fade" id="create-group-modal" tabindex="-1">
                <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h1 class="modal-title fs-5">Add user</h1>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body">
                            <label for="group-name" class="form-label">Group name :</label>
                            <input type="email" class="form-control" id="group-name" placeholder="ft_transcendence">
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                            <button id="create-group-btn" type="button" class="btn btn-primary" data-bs-dismiss="modal">Create</button>
                        </div>
                    </div>
                </div>
            </div>`

        document.querySelector('#create-group-btn').onclick = async () => {
            const response = await APIRequest.build('/user/groups/', 'POST').setBody({ name: document.querySelector('#group-name').value }).sendJSON()

            if (!response.ok)
                return

            const data = await response.json()
            const el = document.createElement('c-group')

            el.setAttribute('group-id', data.id)
            el.setAttribute('group-name', data.name)

            document.querySelector('#chat-groups').appendChild(el)
        }
    }
}