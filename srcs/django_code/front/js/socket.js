import { user_token, token_checker } from "./helpers.js"

export class Socket
{
    static routes = {};
    static save = {};
	static isSet = false;

    static async set(path, callback)
    {
		this.save[path] = callback;
    }

	static async run() {
		await token_checker();
		const token = await user_token();
		if (!token)
			this.cleanRoutes();
		if (this.isSet)
			return;

        if (token)
        {
			for (const [path, callback] of Object.entries(this.save)) {
            	this.routes[path] = new WebSocket(`wss://${window.location.host}/ws${path}?token=${token}`);
            	this.routes[path].onmessage = callback;
			}
			this.isSet = true;
        }
	}

	static cleanRoutes() {
		this.isSet = false;
		for (const ws of Object.values(this.routes)) {
			ws.close();
		}
		this.routes = {};
	}
}
