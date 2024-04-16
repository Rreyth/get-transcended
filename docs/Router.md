## Comment cree une route
Rendez vous dans le fichier `web.js` (se trouvant dans `srcs/django_code/transcend/myapp/static/routes/`)
Une fois dans le fichier vous pourez utiliser la class `Router` permetant de cree une route simple

## Render une page HTML
Si vous souhaitez renvoyer une page html vous pourez utiliser `render(file)` (le .html ansi que le chemain static est ajouter par defaut)

### Exemple
```js
Router.set('/exemple', () => {
    // logic de cette page

    render('exemple')
})
```