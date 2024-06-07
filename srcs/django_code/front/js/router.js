import { Thread } from "./thread.js";
import { token_checker } from "./helpers.js";

export const render = (file, vars = {}) => {
    fetch(`/static/html/${file}.html`)
        .then(response => response.text())
        .then(html => {

            for (const property in vars) {
                html = html.replace(`{{ ${property} }}`, vars[property])
            }

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

        this.routes.map(async route => {
            let path = route.path.replace(/\/+$/, '').replace(/{\w+}/, "([^/]+)")  
            const match = pathname.match(new RegExp(`^${path}$`))

            if (match)
            {
				await token_checker();
                pageFound = true
                route.callback(match);
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