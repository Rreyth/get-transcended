import { Component } from "../../js/component.js";
import { Chat } from "../chat.js";

export class Friend extends Component
{

    static lastFriendActive = null

    static getName()
    {
        return "friend"
    }

    connectedCallback()
    {
        super.connectedCallback()

        this.userId = this.getAttribute("user-id")
        this.username = this.getAttribute('username')

        this.innerHTML = /* html */`
        <div class="d-flex justify-content-between align-items-center p-1 bg-secondary rounded-4 border-2 border border-primary gap-2" style="--bs-border-opacity: .0;" id="user-card">
            <img class="rounded-circle" src="/media/frank.svg" alt="profile" width="25" height="25">
            <span class="scroll-on-hover">${this.username}</span>
        </div>
        `

        document.addEventListener("DOMContentLoaded", function() {
            let span = document.querySelector('.scroll-on-hover');

            span.addEventListener("mouseover", function() {
                this.classList.add('scrolling');
                span.style.overflow = 'visible';
                span.style.textOverflow = 'clip';
            });
            span.addEventListener("mouseout", function() {
                this.classList.remove('scrolling');
                span.style.overflow = 'hidden';
                span.style.textOverflow = 'ellipsis';
            });

        });
    }

    handleClick(ev)
    {
        if (this == Friend.lastFriendActive) return;

        Chat.displayDmWith(this)

        this.querySelector('#user-card').style = ""

        if (Friend.lastFriendActive != null)
        {
            Friend.lastFriendActive.querySelector('#user-card').style = "--bs-border-opacity: .0;"
        }
        
        Friend.lastFriendActive = this
    }
}