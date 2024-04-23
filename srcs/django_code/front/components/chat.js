import { Component } from "../../js/component.js";
import { escapeHtml, scrollbarToEnd } from "../../js/utils.js";

export class Chat extends Component {

	static getName() {
		return "chat-body"
	}

	static sendMsg(msg) {
		const socket = new WebSocket(
			'wss://'
			+ window.location.host
			+ '/api/chat'
		);

		socket.onopen = function (event) {
			console.log('WebSocket connection established.');
			socket.send(JSON.stringify({
				'message': msg
			}));
		};

		socket.onmessage = function (event) {
			const data = JSON.parse(event.data);
			console.log('Message from server:', data.message);
			document.querySelector("#messages").innerHTML += `<c-message who="${data.username}" date="${data.date}" content="${data.message}"></c-message>`
			
			// displayNewMsg(data, 'me');
			// displayNewMsg(data, 'nameOfSpeaker');
			// scrollbarToEnd(".msg-body");
		};
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
				<div class="select-chat">
					<div class="select-body overflow-auto">
	
						<div class="users">
							<div class="users-header my-auto">
								<div class="add-btn">
									<i class='bx bx-user-plus' ></i>
									<span> ADD FRIENDS </span>
								</div>
								<span class="separator-header"></span>
							</div>
							
							<div class="users-body">
															
							</div>
						</div>
	
						<div class="groups">
							coucou, ca c'est des groupes
						</div>
	
					</div>
	
					<div class="select-footer">
						<div class="switch-btn">
							<div class="user-btn active" id="switch-chat"><i class='bx bx-user'></i></div>
							<span class="separator-btn"></span>
							<div class="group-btn" id="switch-chat"><i class='bx bx-group' ></i></div>
						</div>
					</div>
	
				</div>
	
				<div class="msg">
					<div class="msg-header">
						<p>Undefine</p>
						<i class='bx bx-dots-horizontal-rounded'></i>
					</div>
					<div class="msg-body overflow-auto" id="messages">
	
					</div>
					<div class="msg-footer">
						<textarea id="msg-area" class="form-control"></textarea>
						<i class='bx bx-send'></i>
					</div>
				</div>
	
			</div>
		</div>
		
	</div>
        `;

		this.addClickEvent('#switch-chat', (e) => {
			let element = e.target;

			if (element.tagName == "I")
				element = element.parentElement;
			element = element.classList;

			if (!element.contains("active")) {
				if (element.contains("group-btn")) {
					document.querySelector(".user-btn").classList.remove("active");
					document.querySelector(".users").style.display = "none";
					document.querySelector(".groups").style.display = "block";
				}
				else {
					document.querySelector(".group-btn").classList.remove("active");
					document.querySelector(".groups").style.display = "none";
					document.querySelector(".users").style.display = "block";
				}
				element.add("active");
			}
		})

		document.getElementById('msg-area').addEventListener('keydown', function (event) {
			if (event.key === 'Enter' && !event.shiftKey) {
				event.preventDefault();
				if (document.getElementById('msg-area').value === '')
					return;
				let msg = escapeHtml(document.getElementById('msg-area').value)
				Chat.sendMsg(msg.replace(/\n/g, "<br>"));
				document.getElementById('msg-area').value = '';
			}
		});

	}

}
