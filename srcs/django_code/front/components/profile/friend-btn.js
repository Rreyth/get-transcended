import { user, APIRequest } from "../../js/helpers.js"

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
        const username = (await user()).username
        if (username == undefined || username == this.getAttribute('target_username'))
        {
            this.remove();
            return ;
        }

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
            let target_username = this.getAttribute('target_username')
            this.classList.add('btn-primary')

            this.onclick = async (e) => {
                APIRequest.build(`/user/friends/requests/`, 'POST').setBody({
                    to_user: target_username,
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
