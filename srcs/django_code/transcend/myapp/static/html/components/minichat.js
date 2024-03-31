import { Component} from "../../js/component.js";

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
                <span class="arrow-back" onclick="displayConv(this, false);"><i
                        class="fa fa-angle-double-left"></i></span>
                <span>Messages de gigi</span>
            </div>

            <hr class="dropdown-divider">

            <div class="chat-body overflow-auto">

                <div class="friends">
                    <div class="card mb-1" style="max-width: 540px;">
                        <div class="row g-0 mx-1">
                            <div class="col-md-4 img" onclick="displayConv(this, true);">
                                <img src="/media/profile_default.jpg" class="img-fluid rounded-circle"
                                     alt="profile_img">
                            </div>
                            <div class="col-md-8">
                                <div class="card-body">
                                    <p class="card-text" onclick="displayConv(this, true);">Gigi</p>
                                    <div class="dropdown" style="position: absolute; right: 8%; top: 35%;">
                                        <p class="more-dot card-text dropdown-toggle" type="button"
                                           data-bs-toggle="dropdown" aria-expanded="false"><i style="font-size: 1.4em;"
                                                                                              class="fa fa-ellipsis-v"></i>
                                        </p>
                                        <ul class="dropdown-menu" style="width: 3.8em;">
                                            <li><p class="dropdown-item">Supp</p></li>
                                            <li><p class="dropdown-item">jsp</p></li>
                                            <li><p class="dropdown-item">d'autre trucs</p></li>
                                        </ul>
                                    </div>
                                    <p class="card-text" onclick="displayConv(this, true);"><small
                                            class="text-body-secondary">Last </small></p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="conv" style="display: none;">
                    <div class="msg-body chat-body overflow-auto">

                        <div class="msgContainer">
                            <div class="recieveMsg">
                                <p>Hola boy</p>
                            </div>
                        </div>
                        <div class="msgContainer">
                            <div class="sendMsg">
                                <p>Coucou</p>
                            </div>
                        </div>
                        <div class="msgContainer">
                            <div class="recieveMsg">
                                <p>Hola boysdfsdfsdfsdfsdfsdfsdfsdfsdfsfsdfsdfsdfsdfsdfsdfsdfsdfsdf</p>
                            </div>
                        </div>
                        <div class="msgContainer">
                            <div class="sendMsg">
                                <p>Coucousfsdfsfsfsdfsdfsdfdsfsdf <br> sdfdfsdfsdfsdfsdf</p>
                            </div>
                        </div>
                        <div class="msgContainer">
                            <div class="recieveMsg">
                                <p>Hola boy</p>
                            </div>
                        </div>
                        <div class="msgContainer">
                            <div class="sendMsg">
                                <p>Coucou</p>
                            </div>
                        </div>
                        <div class="msgContainer">
                            <div class="recieveMsg">
                                <p>Hola boysdfsdfsdfsdfsdfsdfsdfsdfsdfsfsdfsdfsdfsdfsdfsdfsdfsdfsdf</p>
                            </div>
                        </div>
                        <div class="msgContainer">
                            <div class="sendMsg">
                                <p>Coucousfsdfsfsfsdfsdfsdfdsfsdf <br> sdfdfsdfsdfsdfsdf</p>
                            </div>
                        </div>
                        <div class="msgContainer">
                            <div class="recieveMsg">
                                <p>Hola boy</p>
                            </div>
                        </div>
                        <div class="msgContainer">
                            <div class="sendMsg">
                                <p>Coucou</p>
                            </div>
                        </div>
                        <div class="msgContainer">
                            <div class="recieveMsg">
                                <p>Hola boysdfsdfsdfsdfsdfsdfsdfsdfsdfsfsdfsdfsdfsdfsdfsdfsdfsdfsdf</p>
                            </div>
                        </div>
                        <div class="msgContainer">
                            <div class="sendMsg">
                                <p>Coucousfsdfsfsfsdfsdfsdfdsfsdf <br> sdfdfsdfsdfsdfsdf</p>
                            </div>
                        </div>
                        <div class="msgContainer">
                            <div class="recieveMsg">
                                <p>Hola boy</p>
                            </div>
                        </div>
                        <div class="msgContainer">
                            <div class="sendMsg">
                                <p>Coucou</p>
                            </div>
                        </div>
                        <div class="msgContainer">
                            <div class="recieveMsg">
                                <p>Hola boysdfsdfsdfsdfsdfsdfsdfsdfsdfsfsdfsdfsdfsdfsdfsdfsdfsdfsdf</p>
                            </div>
                        </div>
                        <div class="msgContainer">
                            <div class="sendMsg">
                                <p>Coucousfsdfsfsfsdfsdfsdfdsfsdf <br> sdfdfsdfsdfsdfsdf</p>
                            </div>
                        </div>
                        <div class="msgContainer">
                            <div class="recieveMsg">
                                <p>Hola boy</p>
                            </div>
                        </div>
                        <div class="msgContainer">
                            <div class="sendMsg">
                                <p>Coucou</p>
                            </div>
                        </div>
                        <div class="msgContainer">
                            <div class="recieveMsg">
                                <p>Hola boysdfsdfsdfsdfsdfsdfsdfsdfsdfsfsdfsdfsdfsdfsdfsdfsdfsdfsdf</p>
                            </div>
                        </div>
                        <div class="msgContainer">
                            <div class="sendMsg">
                                <p>Coucousfsdfsfsfsdfsdfsdfdsfsdf <br> sdfdfsdfsdfsdfsdf</p>
                            </div>
                        </div>
                        <div class="msgContainer">
                            <div class="recieveMsg">
                                <p>Hola boy</p>
                            </div>
                        </div>
                        <div class="msgContainer">
                            <div class="sendMsg">
                                <p>Coucou</p>
                            </div>
                        </div>
                        <div class="msgContainer">
                            <div class="recieveMsg">
                                <p>Hola boysdfsdfsdfsdfsdfsdfsdfsdfsdfsfsdfsdfsdfsdfsdfsdfsdfsdfsdf</p>
                            </div>
                        </div>
                        <div class="msgContainer">
                            <div class="sendMsg">
                                <p>Coucousfsdfsfsfsdfsdfsdfdsfsdf <br> sdfdfsdfsdfsdfsdf</p>
                            </div>
                        </div>

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

    displayConv(element, boolAffiche)
    {
        if (boolAffiche == true)
        {
            document.querySelector(".head1").style.display = "none";
            document.querySelector(".friends").style.display = "none";
            document.querySelector(".head2").style.display = "block";
            document.querySelector(".conv").style.display = "block";
        }
        else
        {
            document.querySelector(".head2").style.display = "none";
            document.querySelector(".conv").style.display = "none";
            document.querySelector(".head1").style.display = "block";
            document.querySelector(".friends").style.display = "block";
        }
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