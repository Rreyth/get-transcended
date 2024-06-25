import { user_token, token_checker } from "./helpers.js"

export class Socket
{
    static routes = {}

    static async set(path, callback)
    {
		await token_checker()
        const token = await user_token()

        if (token)
        {
            this.routes[path] = new WebSocket(`wss://${window.location.host}/ws${path}?token=${token}`)
            this.routes[path].onmessage = callback
        }
    }

}