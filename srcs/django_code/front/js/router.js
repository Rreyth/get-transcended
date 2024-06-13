import { Thread } from "./thread.js";
import { token_checker } from "./helpers.js";

export const render = (file, vars = {}) => {
    fetch(`/static/html/${file}.html`)
        .then(response => response.text())
        .then(html => {

            for (const property in vars) {
                html = html.replaceAll(`{{ ${property} }}`, vars[property])
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
    static routes = {}
    static notFoundAction = null

    static set(path, callback)
    {
        path = path.replace(/\/+$/, '').replace(/{\w+}/, "([^/]+)")  

        const route = new Route(path, callback)

        this.routes[path] = route

        return route
    }

    static notFound(callback)
    {
        this.notFoundAction = callback
    }

    static async run()
    {
        Thread.clearAll()

        let pathname = location.pathname.replace(/\/+$/, '')
        let route = null;
        let match = null;

        let exist = Object.keys(this.routes).some(function(key) {
            const m = pathname.match(new RegExp(`^${key}$`))

            if (m != null) {
                route = Router.routes[key]
                match = m

                return true
            }

            return false
        });

        if (exist)
        {
            await token_checker();
            route.callback(match)
        }
        else
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