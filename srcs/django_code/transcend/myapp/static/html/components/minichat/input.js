import { Component } from "../../../js/component.js";

export class ChatInput extends Component
{

    static getName()
    {
        return "chat-input"
    }

    connectedCallback()
    {
        super.connectedCallback()

        this.innerHTML = `
        <div class="msgArea">
            <hr class="dropdown-divider">
            <textarea id="myTextarea" class="form-control msgBar"></textarea>
            <span class="sendBtn"><i class="fa fa-paper-plane-o"></i></span>
        </div>
        `

        const textarea = this.querySelector('textarea')

        textarea.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !e.shiftKey)
            {
                e.preventDefault();
                if (document.getElementById('myTextarea').value === '')
                    return;
                let msg = document.getElementById('myTextarea').value

                const socket = new WebSocket('wss://localhost:44433/api/chat')

                socket.onopen = event => {
                    console.log('WebSocket connection established.');
                    socket.send(JSON.stringify({
                        'message': msg.replace(/\n/g, "<br>")
                    }));
                };

                document.getElementById('myTextarea').value = '';
            }
        })
    }
}