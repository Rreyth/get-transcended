import { Thread } from "./thread.js";

export class MyRouter {
  static async push(pathname) {
    Thread.clearAll();
    const url = new URL(pathname, window.location.origin);
    const response = await fetch(url, { headers: { "X-Source": "SPA" } });
    const text = await response.text();
    window.history.pushState(undefined, "", url);
    // document.title = `${url.pathname.substring(url.pathname.lastIndexOf('/') + 1)}`;
    document.title = "A page";
    document.querySelector("#content").innerHTML = text;
  }
}

window.addEventListener("load", () => {
  MyRouter.push(window.location.pathname + window.location.search)
});
