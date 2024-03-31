import {Component} from "../../js/component.js";

export class Navbar extends Component {
    static getName() {
        return "nav";
    }

    connectedCallback() {
        this.innerHTML = content;
    }
}

const content = `

<!-- new navbar ? -->
<!-- https://www.w3schools.com/howto/tryit.asp?filename=tryhow_js_navbar_hide_scroll -->
<nav class="navbar navbar-expand-lg bg-body-tertiary fixed-top">
    <div class="container-fluid">
        <a class="navbar-brand" href="/">Transcendence</a>
        <button
                class="navbar-toggler"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#navbarText"
                aria-controls="navbarText"
                aria-expanded="false"
                aria-label="Toggle navigation"
        >
            <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarText">
            <ul class="navbar-nav me-auto mb-2 mb-lg-0">
                <li class="nav-item">
                    <a class="nav-link" href="/">Home</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" href="/about">About</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" href="#">Pricing</a>
                </li>
            </ul>
            <span class="navbar-text">
        <button
                type="button"
                class="btn btn-primary"
                data-bs-toggle="modal"
                data-bs-target="#exampleModal"
        >
          Login
        </button>
      </span>
        </div>
    </div>
</nav>

<div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered">
        <div class="log-content modal-content">

            <div class="loginbox">
                <form>
                    <!--<h2>Login</h2>-->
                    <div class="box">
                        <input type="text" name="username" required="" autocomplete="username">
                        <label>Username</label>
                    </div>
                    <div class="box">
                        <input type="password" name="password" required="" autocomplete="password">
                        <label>Password</label>
                    </div>
                    <div style="width: 100%; text-align: center; display: inline-block;">
                        <a href="https://google.com" class="mx-1">
                            Connect
                        </a>
                        <a id="1"
                           href="https://api.intra.42.fr/oauth/authorize?client_id=u-s4t2ud-b87436860473c1cf2dcaf70686636bad4bb15a2af3ec8ab615615dba0014102c&redirect_uri=https%3A%2F%2F127.0.0.1%3A44433%2Fauth%2F42%2F&response_type=code"
                           class="mx-1">
                            42 Login
                        </a>
                    </div>
                </form>
            </div>
        </div>
    </div>
</div>
`;
