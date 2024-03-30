## Système de composants

La création d'un composant se fait avec la classe `Component`.

### Exemple
Code du fichier JS (le composant)
```js
import { Component } from "../../js/component.js";

export class Text extends Component {
  static getName() {
    return "text";
  }

  connectedCallback() {
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
    Text // Nom de votre classe
])
```

Sur les pages HTML
```html
<c-text></c-text>
```
Attention, le "c-" est obligatoire !!!