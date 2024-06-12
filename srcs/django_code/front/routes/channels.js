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
    console.log(event)
})