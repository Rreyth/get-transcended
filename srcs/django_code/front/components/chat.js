import { Component } from "../../js/component.js";
import { escapeHtml, scrollbarToEnd } from "../../js/utils.js";

export class Chat extends Component {

	static getName() {
		return "chat-body"
	}

	static sendMsg(msg) {
		// const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzE1MTEwNzk2LCJpYXQiOjE3MTUwOTk5OTYsImp0aSI6IjA4NmYzYmU5OTQzODQ3MWI5ODgwMjBmN2UwMjgyMzg0IiwidXNlcl9pZCI6Mn0.yMI2n-EohpKT5CieM2k7VKiPVPBKcmyAHK76SRCyOW8"
		const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzE1MTEwNzk2LCJpYXQiOjE3MTUwOTk5OTYsImp0aSI6IjA4NmYzYmU5OTQzODQ3MWI5ODgwMjBmN2UwMjgyMzg0IiwidXNlcl9pZCI6MX0.UiMJGIVLWIk8BqW4iHuXsuv7dqIuYhleJgudyuyu5tQ"
		const socket = new WebSocket(
			'wss://'
			+ window.location.host
			+ '/api/chat?token='
			+ token
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
								<div class="add-btn" id="setting-bt">
									<i class='bx bx-cog'></i>
									<span> FRIEND SETTINGS </span>
								</div>
								<span class="separator-header"></span>
							</div>
							
							<div class="users-body">

							<c-friend username="tutute fils de pute"></c-friend>
							<c-friend username="Swotex"></c-friend>
							<c-friend username="sd asd"></c-friend>
															
							</div>
						</div>
	
						<div class="groups">
							<div class="users-header my-auto">
								<div class="add-btn">
									<i class='bx bx-user-plus' ></i>
									<span> GROUP SETTINGS </span>
								</div>
								<span class="separator-header"></span>
							</div>
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

		this.addClickEvent('#setting-bt', (e) => {
			let settingComponent = document.getElementById("setting-tag");
			if (settingComponent)
			{
				document.getElementById("setting-tag").remove();
				document.body.style.overflow = "scroll";
			}
			else
			{
				document.body.innerHTML += `<c-setting id="setting-tag"></c-setting>`;
				document.body.style.overflow = "hidden";
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
