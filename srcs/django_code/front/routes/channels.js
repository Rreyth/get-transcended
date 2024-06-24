import { Chat } from "../components/chat.js";
import { Socket } from "../js/socket.js";

Socket.set('/messages', (event) => {
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
})

Socket.set('/user/online', (event) => {
    const data = JSON.parse(event.data)
    const elements = document.querySelectorAll(`c-avatar[username=${data.username}]`)

    elements.forEach(avatar => {
        const img = avatar.querySelector('img');

        if (data.online)
            img.className = img.className.replace('secondary', 'success')
        else
            img.className = img.className.replace('success', 'secondary')
    })
})

Socket.set('/user/friends', (event) => {
    const data = JSON.parse(event.data)

    document.querySelectorAll(`[data-trd-friend=${data.user.username}]`).forEach(element => element.connectedCallback())
    document.querySelector('c-search').loadContent()
    Chat.addFriend(data.user)
})