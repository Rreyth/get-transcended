import { Thread } from "./thread.js";
import { user, token_checker } from "./helpers.js";

export class Router {
  static async push(pathname) {
    
    await token_checker();
    const userInfo = await user();
    
    if (userInfo == null && pathname != "/login" && pathname != "login") {
      pathname = "/login";
    }
    
    Thread.clearAll();
    const url = new URL(pathname, window.location.origin);
    const response = await fetch(url, { headers: { "X-Source": "SPA" } });
    const text = await response.text();
    window.history.pushState(undefined, "", url);
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

window.addEventListener("load", () => {
  Router.push(window.location.pathname + window.location.search)
});
