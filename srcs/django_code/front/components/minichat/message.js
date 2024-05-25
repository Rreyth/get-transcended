import { Component } from "../../js/component.js";
import { user } from "../../js/helpers.js";

export class Message extends Component {

    static getName() {
        return "message"
    }

    async connectedCallback() {
        super.connectedCallback()

        const align = this.getAttribute('who') == (await user()).username ? "align-items-end" : "align-items-start"
        const userStyle = this.getAttribute('who') == (await user()).username ? "border-radius: 0.625rem 0.625rem 0rem 0.625rem; background: #AAA;" : "border-radius: 0.625rem 0.625rem 0.625rem 0rem; background: #5F6FF9;"

        this.innerHTML = `
        <div class="d-flex flex-column ${align} align-self-stretch" style="gap: 0.3125rem;">
            <span>${this.getAttribute('who')}</span>
            <div class="d-flex flex-column text-wrap justify-content-end align-items-start" style="max-width: 9.375rem; padding: 0.3125rem; ${userStyle}; overflow-wrap: break-word;">
                <p class="align-self-stretch">
                    ${this.getAttribute('content')}
                </p>
                <span class="align-self-stretch" style="font-size: 0.5rem;">${this.getAttribute('date')}</span>
            </div>
        </div>
        `
    }

}