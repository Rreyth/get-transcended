import { Component } from "../../js/component.js";
import { user } from "../../js/helpers.js";

const messageParser = (text) => {
	text = text.replace(/\[invite code=([\w]{4})\]/, '<a href="/pong?code=$1">Join my game room</a>')
	text = text.replace(/\*\*(\w+)\*\*/, "<b>$1</b>")
	text = text.replace(/_(\w+)_/, "<i>$1</i>")

	return text
}

export class Message extends Component {

    static getName() {
        return "message"
    }

    async connectedCallback() {
        super.connectedCallback()

        const who = this.getAttribute('who')

        const align = who == (await user()).username ? "align-items-end" : "align-items-start"
        const userStyle = who == (await user()).username ? "border-radius: 0.625rem 0.625rem 0rem 0.625rem;" : "border-radius: 0.625rem 0.625rem 0.625rem 0rem;"

        this.innerHTML = `
        <div class="d-flex flex-column ${align} align-self-stretch" style="gap: 0.3125rem;">
            <span>${who}</span>
            <div class="d-flex flex-column text-wrap justify-content-end align-items-start ${who == (await user()).username ? "bg-primary" : "bg-secondary"}" style="max-width: 9.375rem; padding: 0.3125rem; ${userStyle}; overflow-wrap: break-word;">
                <p class="align-self-stretch">
                    ${messageParser(this.getAttribute('content'))}
                </p>
                <span class="align-self-stretch" style="font-size: 0.5rem;">${this.getAttribute('date')}</span>
            </div>
        </div>
        `
    }

}