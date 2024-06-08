import { api, user_token, user } from "../../js/helpers.js"

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

        const friends = await api(`/user/friends/?target=${this.getAttribute('target_username')}`, 'GET', null, await user_token());
        const requests = await api(`/user/friends/requests/`, 'GET', null, await user_token());
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
                api(`/user/friends/requests/${request_reveived.id}`, 'POST', null, await user_token())

                e.target.remove()
            }
        }
        else if (!friends.ok)
        {
            let target_id = this.getAttribute('target_id')
            this.classList.add('btn-primary')

            this.onclick = async (e) => {
                api(`/user/friends/requests/`, 'POST', JSON.stringify({
                    to_user: target_id,
                }), await user_token())

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