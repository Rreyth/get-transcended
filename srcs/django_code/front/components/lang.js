import { Component } from "../../js/component.js";

export class LangBtn extends Component {
    static getName() {
        return "langbtn";
    }

    connectedCallback() {
		this.innerHTML = content;
    }
}

const content = /*html*/`
<div class="dropup">
<div class="d-flex align-items-center justify-content-center bg-secondary dropdown-toggle rounded-4" id="langBtn" data-bs-toggle="dropdown" aria-expanded="false" style="cursor: pointer; width: 3.5em; height: 3.5em;">
	<i style="font-size: 1.5em; color: white;">FR</i>
</div>
<ul class="dropdown-menu dropdown-menu-end" style="width: 1em;">
  <li class="dropdown-item active">FR</li>
  <li class="dropdown-item">EN</li>
  <li class="dropdown-item">RS</li>
</ul>
</div>
<style>
#langBtn::after
{
	content: none;
}
</style>
`;
