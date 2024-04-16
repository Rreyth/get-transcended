# Les composents

## Comment en cree
```js
import { Component } from "../../js/component.js";

export class Text extends Component {
  static getName() {
    // Nom du composent (Obligatoire !!!)
    return "text";
  }

  connectedCallback() {
    // Integration du HTML interne du composent
    this.innerHTML = `
            <p>Je suis un texte</p>
        `;
  }
}
```

Enregistrement du composant
```js
// main.js
Component.loader([
	...,
    Text // Nom de votre classe (Obligatoire !!!)
])
```

Sur les pages HTML
```html
<c-text></c-text>
```
Attention, le "c-" est obligatoire !!!