import { Thread } from "./thread.js";

export const render = (file) => {
    fetch(`/static/html/${file}.html`)
        .then(response => response.text())
        .then(html => {
            document.querySelector('#content').innerHTML = html;
        })
        .catch(error => console.error('Error loading page:', error));
}

class Route
{

    name = ""
    path = ""
    callback = null

    constructor(path, callback)
    {
        this.path = path
        this.callback = callback
    }

    setName(name)
    {
        this.name = name
    }
}

export class Router
{
    static routes = []
    static notFoundAction = null

    static set(path, callback)
    {
        const route = new Route(path, callback)

        this.routes.push(route)

        return route
    }

    static notFound(callback)
    {
        this.notFoundAction = callback
    }

    static run()
    {
        Thread.clearAll()

        let pageFound = false
        let pathname = location.pathname.replace(/\/+$/, '')

        this.routes.map(route => {
            let path = route.path.replace(/\/+$/, '')

            if (pathname == path)
            {
                pageFound = true
                route.callback();
            }
        })

        if (!pageFound && this.notFoundAction != null)
        {
            this.notFoundAction()
        }
    }
}

export const route = (name) => {
    let path = null
    
    Router.routes.map(r => {
        if (name == r.name)
        {
            path = r.path
        }
    })

    return path
}