import { Component } from "../js/component.js";

export class LangBtn extends Component {
    static getName() {
        return "langbtn";
    }

	setLang(choice)
	{
		cookieStore.set({ name: "lang", value: choice });
		this.querySelector(".active").classList.remove("active");
		this.querySelector(`#${choice}-lang`).classList.add('active');
		this.querySelector("#title-lang").innerHTML = choice.toUpperCase();
	}

    async connectedCallback() {
		this.innerHTML = content;

		let lang = await cookieStore.get("lang");
		if (lang == null)
			lang = { value: "en" };

		this.setLang(lang.value);

		this.addClickEvent('#en-lang', (e) => {
			this.setLang("en");
			location.reload();
		})
		this.addClickEvent('#fr-lang', (e) => {
			this.setLang("fr");
			location.reload();
		})
		this.addClickEvent('#es-lang', (e) => {
			this.setLang("es");
			location.reload();
		})
		this.addClickEvent('#gr-lang', (e) => {
			this.setLang("gr");
			location.reload();
		})
    }
}

const content = /*html*/`
<div class="dropup" style="width: 100%; height: 100%;">
<div class="d-flex align-items-center justify-content-center bg-secondary dropdown-toggle rounded-4" id="content-none" data-bs-toggle="dropdown" aria-expanded="false" style="cursor: pointer; width: 100%; height: 100%;">
	<i style="font-size: 1.5em; color: white;" id="title-lang">EN</i>
</div>
<ul class="dropdown-menu dropdown-menu-end" style="width: 1em;">
	<li class="dropdown-item active" id="en-lang">EN</li>
	<li class="dropdown-item" id="fr-lang">FR</li>
	<li class="dropdown-item" id="es-lang">ES</li>
	<li class="dropdown-item" id="gr-lang">GR</li>
</ul>
</div>
<style>
#langBtn::after
{
	content: none;
}
</style>
`;
