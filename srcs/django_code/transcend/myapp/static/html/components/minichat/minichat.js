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
                        <span class="arrow-back">
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
                            <div class="msg-body chat-body overflow-auto">
                                <c-message content="oui" who="reciever"></c-message>
                                <c-message content="coucou" who="sender"></c-message>
                            </div>
                            <div class="msgArea">
                                <hr class="dropdown-divider">
                                <textarea id="myTextarea" class="form-control msgBar"></textarea>
                                <span class="sendBtn"><i class="fa fa-paper-plane-o"></i></span>
                            </div>
                        </div>

                        <div class="group" style="display: none;">
                            group page
                        </div>

                    </div>
                </div>
            </div>
        </div>  
       `;
    }

    btswipe(element)
    {
        let classBtClicked = this.classList;
        if (!classBtClicked.contains("active"))
        {
            if (classBtClicked.contains("headbt1"))
            {
                document.querySelector(".headbt2").classList.remove("active");
                document.querySelector(".group").style.display = "none";
                document.querySelector(".friends").style.display = "block";
            }
            else
            {
                document.querySelector(".headbt1").classList.remove("active");
                document.querySelector(".friends").style.display = "none";
                document.querySelector(".group").style.display = "block";
            }
            classBtClicked.add("active");
        }
    }

    endofscrollmsg()
    {
        var msgScrollBar = document.querySelector(".msg-body");
        msgScrollBar.scrollTop = msgScrollBar.scrollHeight; // scrollbar en bas de msg par deffaut
    }

    displayNewMsg(msg, from)
    {
        var msg_conv = document.querySelector(".msg-body");

        if (from === 'me')
        {
            msg_conv.innerHTML = msg_conv.innerHTML +
                "\
                    <div class=\"msgContainer\">\
                        <div class=\"sendMsg\">\
                            <p>" + msg + "</p>\
					</div>\
				</div>\
			"
        }
        else
        {
            msg_conv.innerHTML = msg_conv.innerHTML +
                "\
                    <div class=\"msgContainer\">\
                        <div class=\"recieveMsg\">\
                            <p>" + msg + "</p>\
					</div>\
				</div>\
			"
        }
        endofscrollmsg();
    }

    displayConv()
    {
        document.querySelector(".head1").style.display = "none";
        document.querySelector(".friends").style.display = "none";
        document.querySelector(".head2").style.display = "block";
        document.querySelector(".conv").style.display = "block";
        endofscrollmsg();
    }

    escapeHtml(text)
    {
        var map = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#039;'
        };
        return text.replace(/[&<>"']/g, function (m) { return map[m]; });
    }

}