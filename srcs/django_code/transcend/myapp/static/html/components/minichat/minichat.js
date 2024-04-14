import { Component} from "../../../js/component.js";

export class Minichat extends Component
{

    static getName()
    {
        return "minichat"
    }

    connectedCallback() {
        this.innerHTML = `
        <div class="chat">
            <div class="btn-group dropup">
                <button type="button" class="btn btn-secondary dropdown-toggle" data-bs-toggle="dropdown"
                        data-bs-auto-close="false" aria-expanded="false">
                    Messages
                    <span class="icon-up"><i class="fa fa-chevron-up" aria-hidden="true"></i></span>
                </button>

                <div class="dropdown-menu">

                    <div class="header-dropmenu head1">
                        <span>Messages </span>
                        <div class="switch-chat">
                            <button class="headbt1 btn btn-outline-success mx-2 active" onclick="btswipe(this)">Amis</button>
                            <button class="headbt2 btn btn-outline-success mx-2" onclick="btswipe(this)">Groups</button>
                        </div>
                    </div>

                    <div class="header-dropmenu head2" style="display: none;">
                        <span class="arrow-back" id="back-to-list">
                            <i class="fa fa-angle-double-left"></i>
                        </span>
                        <span>Messages de gigi</span>
                    </div>

                    <hr class="dropdown-divider">

                    <div class="chat-body overflow-auto">

                        <div class="friends">
                            <c-friend></c-friend>
                        </div>

                        <div class="conv" style="display: none;">
                            <div id="messages" class="msg-body chat-body overflow-auto">
                                <c-message content="oui" who="reciever"></c-message>
                                <c-message content="coucou" who="sender"></c-message>
                            </div>
                            <c-chat-input></c-chat-input>
                        </div>

                        <div class="group" style="display: none;">
                            group page
                        </div>

                    </div>
                </div>
            </div>
        </div>
        `;

        this.addClickEvent('#back-to-list', (e) => {
            document.querySelector(".head1").style.display = "block";
            document.querySelector(".friends").style.display = "block";
            document.querySelector(".head2").style.display = "none";
            document.querySelector(".conv").style.display = "none";
        })

        const socket = new WebSocket('wss://localhost:44433/api/chat')

        socket.onmessage = event => {
            const data = JSON.parse(event.data);
            const messages = this.querySelector('#messages');

            messages.innerHTML += `<c-message content="${data.message}" who="sender"></c-message>`
        };
    }

}