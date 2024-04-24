import { Component } from "../../js/component.js";

export class Friend extends Component
{
    static getName()
    {
        return "friend"
    }

    connectedCallback()
    {
        super.connectedCallback()
        // gerer la fonction active ou non
        this.innerHTML = `
        <div class="users-card active">
            <div class="content-card">
                <img class="rounded-circle" src="/media/profile_default.jpg" alt="profile" width="25" height="25">
                <span class="scroll-on-hover">${this.getAttribute('username')}</span>
            </div>
        </div>
        `
<<<<<<< HEAD
        let span = this.querySelector('.scroll-on-hover');
=======
        document.addEventListener("DOMContentLoaded", function() {
            let span = document.querySelector('.scroll-on-hover');
>>>>>>> 30167af (continu new chat to component + start setting screen)
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
<<<<<<< HEAD
=======
        });
>>>>>>> 30167af (continu new chat to component + start setting screen)
    }

    handleClick(ev)
    {
        
    }
}