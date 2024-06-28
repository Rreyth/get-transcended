import { Thread } from "./thread.js";
import { user, token_checker } from "./helpers.js";
import { Socket } from "./socket.js";

export class Router {
  static async push(pathname, dontPush = false) {

    await token_checker();
    const userInfo = await user();

    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');

    if (userInfo == null && !code) {
      pathname = "/login";
      window.history.pushState({}, "", pathname);
    }
    else if (userInfo && (pathname == "/login" || pathname == "login")) {
      pathname = "/";
      window.history.pushState({}, "", pathname);
    }

    Thread.clearAll();
    Socket.run();

    const url = new URL(pathname, window.location.origin);
    const response = await fetch(url, { headers: { "X-Source": "SPA" } });
    const text = await response.text();
    if (!dontPush)
      window.history.pushState({}, "", pathname);
    let link = url.pathname;
    let title = link.substring(url.pathname.lastIndexOf('/') + 1);
    if (title.length == 0) {
      link = link.substring(0, url.pathname.lastIndexOf('/'));
      if (link.length != 0)
        title = link.substring(1);
      else
        title = "home";
    }
    document.title = title;
    document.querySelector("#content").innerHTML = text;
    window.dispatchEvent(new Event("refreshNavbar"));
  }
}

window.onpopstate = function() {
    Router.push(window.location.pathname, true);
}

window.addEventListener("load", () => {
  setTimeout(() => {
    Router.push(window.location.pathname + window.location.search, true)
  }, 200)
});
