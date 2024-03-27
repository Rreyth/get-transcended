/* ***** To switch users conv and groups conv selector ***** */
function switchConv(element)
{
	var classBtClicked = element.classList;
	if (!classBtClicked.contains("active"))
	{
		if (classBtClicked.contains("group-btn"))
		{
			document.querySelector(".user-btn").classList.remove("active");
			document.querySelector(".users").style.display = "none";
			document.querySelector(".groups").style.display = "block";
		}
		else
		{
			document.querySelector(".group-btn").classList.remove("active");
			document.querySelector(".groups").style.display = "none";
			document.querySelector(".users").style.display = "block";
		}
		classBtClicked.add("active");
	}
}

function scrollbarToEnd()
{
	var msgScrollBar = document.querySelector(".msg-body");
	msgScrollBar.scrollTop = msgScrollBar.scrollHeight; // scrollbar en bas de msg par deffaut
}

function displayNewMsg(data, from)
{
	var msg_conv = document.querySelector(".msg-body");

	if (from === 'me')
	{
		msg_conv.innerHTML = msg_conv.innerHTML +
			"\
				<div class=\"msg-sender\">\
					<div class=\"msg-container\">\
						<p class=\"msg-title\">Moieee</p>\
						<div class=\"msg-content\">\
							<p> " + data.message + " </p>\
							<span>27/03/2024 12:40</span>\
						</div>\
					</div>\
				</div>\
			"
	}
	else
	{
		msg_conv.innerHTML = msg_conv.innerHTML +
			"\
				<div class=\"msg-recieve\">\
					<div class=\"msg-container\">\
						<p class=\"msg-title\">Swotex</p>\
						<div class=\"msg-content\">\
							<p> " + data.message + " </p>\
							<span>27/03/2024 12:40</span>\
						</div>\
					</div>\
				</div>\
			"
	}
}

function sendMsg(msg)
{
	const socket = new WebSocket('wss://localhost:44433/api/chat');

	socket.onopen = function (event) {
		console.log('WebSocket connection established.');
		socket.send(JSON.stringify({
			'message': msg
		}));
	};

	socket.onmessage = function (event) {
		const data = JSON.parse(event.data);
		console.log('Message from server:', data.message);
		displayNewMsg(data, 'me');
		displayNewMsg(data, 'nameOfSpeaker');
		scrollbarToEnd();
	};
}

function escapeHtml(text)
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

document.getElementById('msg-area').addEventListener('keydown', function (event) {
	if (event.key === 'Enter' && !event.shiftKey) 
	{
		event.preventDefault();
		if (document.getElementById('msg-area').value === '')
			return;
		let msg = escapeHtml(document.getElementById('msg-area').value)
		sendMsg(msg.replace(/\n/g, "<br>"));
		document.getElementById('msg-area').value = '';
	}
});