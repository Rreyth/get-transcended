document.addEventListener('DOMContentLoaded', () => {
    const appContainer = document.getElementById('app');

    const loadPage = (page) => {
        fetch(`/static/js/pages/${page}.js`)
            .then(response => response.text())
            .then(script => {
                appContainer.innerHTML = script;
                history.pushState({ page }, null, page);
            });
    };

    window.addEventListener('popstate', (event) => {
        const page = event.state ? event.state.page : 'home';
        loadPage(page);
    });

    loadPage('home');
});
