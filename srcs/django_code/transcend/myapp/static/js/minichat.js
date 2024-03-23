	function btswipe(element)
	{
		var classBtClicked = element.classList;
		if (!classBtClicked.contains("active"))
		{
			if(classBtClicked.contains("headbt1"))
			{
				document.querySelector(".headbt2").classList.remove("active");
				document.querySelector(".group").style.display="none";
				document.querySelector(".friends").style.display="block";
			}
			else
			{
				document.querySelector(".headbt1").classList.remove("active");
				document.querySelector(".friends").style.display="none";
				document.querySelector(".group").style.display="block";
			}
			classBtClicked.add("active");
		}
	}

	function endofscrollmsg()
	{
		var msgScrollBar = document.querySelector(".msg-body");
		msgScrollBar.scrollTop = msgScrollBar.scrollHeight; // scrollbar en bas de msg par deffaut
	}

	function displayNewMsg(msg, from)
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

	function displayConv(element, boolAffiche)
	{
		if (boolAffiche == true)
		{
			document.querySelector(".head1").style.display="none";
			document.querySelector(".friends").style.display="none";
			document.querySelector(".head2").style.display="block";
			document.querySelector(".conv").style.display="block";
		}
		else
		{
			document.querySelector(".head2").style.display="none";
			document.querySelector(".conv").style.display="none";
			document.querySelector(".head1").style.display="block";
			document.querySelector(".friends").style.display="block";
		}
		endofscrollmsg();
	}

	// send with enter in msg

	document.getElementById('myTextarea').addEventListener('keydown', function(event) {
    	if (event.keyCode === 13 && !event.shiftKey)
		{
        	event.preventDefault();
			sendMsg(document.getElementById('myTextarea').value.replace(/\n/g, "<br>"));
			document.getElementById('myTextarea').value = '';
    	}
	});




	function sendMsg(msg)
	{
		const socket = new WebSocket('wss://localhost:44433/ws/myapp/');

		socket.onopen = function(event) {
			console.log('WebSocket connection established.');
			socket.send(JSON.stringify({
				'message': msg
			}));
		};

		socket.onmessage = function(event) {
			const data = JSON.parse(event.data);
			console.log('Message from server:', data.message);
			displayNewMsg(data.message, 'me');
			displayNewMsg("Test response : " + data.message, 'nameOfSpeaker');
		};
	}