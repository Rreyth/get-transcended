import { user_token } from "./helpers.js"

export class Socket
{
    static routes = {}

    static async set(path, callback)
    {
        const token = await user_token()

        this.routes[path] = new WebSocket(`wss://${window.location.host}/ws${path}${token != null ? '?token=' + token : ''}`)
        this.routes[path].onmessage = callback
    }

}