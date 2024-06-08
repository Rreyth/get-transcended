import { user_token, user, APIRequest } from "../../js/helpers.js"

export class FriendBtn extends HTMLButtonElement
{
    static getName()
    {
        return "friend-btn"
    }

    static getExtends()
    {
        return { extends: 'button' }
    }

    constructor() {
        super();
    }

    async connectedCallback()
    {
        if ((await user()).username == this.getAttribute('target_username'))
            this.remove()

        const friends = await APIRequest.build(`/user/friends/?target=${this.getAttribute('target_username')}`, 'GET').send();
        const requests = await APIRequest.build(`/user/friends/requests/`, 'GET').send();
        const data = await requests.json()
        
        const request_sended = data.send.some(e => e.to_user.username == this.getAttribute('target_username'))
        const request_reveived = data.received.find(e => e.from_user.username == this.getAttribute('target_username'))

        if (request_sended)
        {
            this.classList.add('btn-primary')
            this.disabled = true
        }
        else if (request_reveived != undefined)
        {
            this.classList.add('btn-success')
            this.innerHTML = "Accept friend request"

            this.onclick = async (e) => {
                APIRequest.build(`/user/friends/requests/${request_reveived.id}`, 'POST').send()

                e.target.remove()
            }
        }
        else if (!friends.ok)
        {
            let target_id = this.getAttribute('target_id')
            this.classList.add('btn-primary')

            this.onclick = async (e) => {
                APIRequest.build(`/user/friends/requests/`, 'POST').setBody({
                    to_user: target_id,
                }).sendJSON()

                e.target.disabled = true
                e.target.onclick = () => {}
            }
        }
        else
        {
            this.remove()
        }
    }
}