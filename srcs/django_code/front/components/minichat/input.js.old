import { Component } from "../../js/component.js";

const s = new WebSocket('wss://localhost:44433/api/chat')

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

                s.send(JSON.stringify({
                    'message': msg.replace(/\n/g, "<br>")
                }));

                document.getElementById('myTextarea').value = '';
            }
        })
    }
}