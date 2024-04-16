## Comment crée une route
Rendez-vous dans le fichier `web.js` (se trouvant dans `srcs/django_code/transcend/myapp/static/routes/`)
Une fois dans le fichier vous pourrez utiliser la class `Router` permettant de cree une route simple

## Render une page HTML
Si vous souhaitez renvoyer une page html vous pourrez utiliser `render(file)` (le .HTML ainsi que le chemin static est ajouté par défaut)

### Exemple
```js
Router.set('/exemple', () => {
    // logic de cette page

    render('exemple')
})
```