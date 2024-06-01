export function escapeHtml(text)
{
	let map = {
		'&': '&amp;',
		'<': '&lt;',
		'>': '&gt;',
		'"': '&quot;',
		"'": '&#039;'
	};
	return text.replace(/[&<>"']/g, function (m) { return map[m]; });
}

export function scrollbarToEnd(selector)
{
	let msgScrollBar = document.querySelector(selector);
	msgScrollBar.scrollTop = msgScrollBar.scrollHeight; // scrollbar en bas de msg par deffaut
}
