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

        this.innerHTML = `
        <div class="card mb-1" style="max-width: 540px;">
            <div class="row g-0 mx-1">
                <div class="col-md-4 img">
                    <img src="/media/profile_default.jpg" class="img-fluid rounded-circle"
                        alt="profile_img">
                </div>
                <div class="col-md-8">
                    <div class="card-body">
                        <p class="card-text">Gigi</p>
                        <div class="dropdown" style="position: absolute; right: 8%; top: 35%;">
                            <p id="cancel-click" class="more-dot card-text dropdown-toggle" type="button"
                            data-bs-toggle="dropdown" aria-expanded="false"><i style="font-size: 1.4em;"
                                                                                class="fa fa-ellipsis-v"></i>
                            </p>
                            <ul id="cancel-click" class="dropdown-menu" style="width: 3.8em;">
                                <li><p class="dropdown-item">Supp</p></li>
                                <li><p class="dropdown-item">jsp</p></li>
                                <li><p class="dropdown-item">d'autre trucs</p></li>
                            </ul>
                        </div>
                        <p class="card-text"><small
                                class="text-body-secondary">Last </small></p>
                    </div>
                </div>
            </div>
        </div>
        `
    }

    handleClick(ev)
    {
        if (ev.target.id == "cancel-click") return

        document.querySelector(".head1").style.display = "none";
        document.querySelector(".friends").style.display = "none";
        document.querySelector(".head2").style.display = "block";
        document.querySelector(".conv").style.display = "block";
    }
}