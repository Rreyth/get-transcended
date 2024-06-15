import { Thread } from "./thread.js";
import { token_checker, user_token } from "./helpers.js";

export const render = async (file, vars = {}) => {
	const response = await fetch(`/static/html/${file}.html`);
	if (response.ok)
	{
		let html = await response.text();
		for (const property in vars) {
			html = html.replaceAll(`{{ ${property} }}`, vars[property])
		}

		document.querySelector('#content').innerHTML = html;
	}
}

export const redirect = (path) => {
	if (location.pathname + location.search == path)
		return

	window.history.pushState(null, null, path)
	Router.run()
}

class Route
{

    name = ""
    path = ""
    callback = null
    authenticate = false

    constructor(path, callback, auth)
    {
        this.path = path
        this.callback = callback
        this.authenticate = auth
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

    static set(path, callback, authenticate = false)
    {
        path = path.replace(/\/+$/, '').replace(/{\w+}/, "([^/]+)")  

        const route = new Route(path, callback, authenticate)

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

            if (route.authenticate && !(await user_token()))
            {
                return redirect('/');
            }

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