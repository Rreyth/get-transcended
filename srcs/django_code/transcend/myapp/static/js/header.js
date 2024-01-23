// header.js
document.getElementById('app').innerHTML += `
    <header>
        <nav>
            <a href="#" onclick="loadPage('home'); return false;">Home</a>
            <a href="#" onclick="loadPage('about'); return false;">About</a>
        </nav>
    </header>
`;
