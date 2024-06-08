export const translate = async (key) => {
    const default_lang = "en"
    let lang = await cookieStore.get("lang")

    if (lang == null)
    {
        cookieStore.set({ name: "lang", value: default_lang })
        lang = { value: default_lang }
    }

    const response = await fetch(`https://${location.hostname}:${location.port}/static/lang/${lang.value}.json`)

    if (response.ok)
    {
        let keys = key.split(".")
        let value = null

        for (let k of keys)
        {
            value = value == null ? (await response.json())[k] : value[k]
        }

        return value
    }

    cookieStore.set({ name: "lang", value: default_lang })
    return await translate(key);
}

export const user_token = async () => {
    const token = await cookieStore.get("token")

    if (token != null)
    {
        return token.value
    }

    return token
}

export const user = async () => {
    const token = await user_token()

    if (token == null)
    {
        return undefined
    }

    let base64Url = token.split('.')[1];
    let base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    let jsonPayload = decodeURIComponent(window.atob(base64).split('').map((c) => {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
}

export const auth = async (username, password) => {
    const response = await APIRequest.build('/token/', 'POST').setBody({
        username: username,
        password: password
    }).sendJSON()

    if (response.ok)
    {
        cookieStore.set({ name: "token", value: (await response.json()).access })
		return (true);
    }
	return (false);
}

export async function token_checker() {
	const token = await user_token();
	if (!token)
		return;

	const response = await APIRequest.build('/user/', 'GET').send();

	if (!response.ok) { 
		cookieStore.delete(name="token");
		return;
	}

	const expiration = (await user()).exp;
	const now = Date.now() / 1000;
	if (now >= expiration) {
		cookieStore.delete(name="token");
	}
}

export const formatDate = (date, format) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return format.replace('YYYY', year)
                 .replace('MM', month)
                 .replace('DD', day);
}

export class APIRequest
{

    constructor(path, method)
    {
        this.headers = new Headers();

        this.setMethod(method)
            .setPath(path);
    }

    static build(path, method)
    {
        return new APIRequest(path, method);
    }

    setMethod(method)
    {
        this.method = method.toUpperCase();

        return this
    }

    setPath(path)
    {
        this.url = `https://${location.hostname}:${location.port}/api${path[0] == '/' ? path : '/' + path}`;

        return this
    }

    setBody(body)
    {
        this.body = body;

        return this
    }

    async send()
    {
        const options = {
			method: this.method,
			redirect: 'follow'
		};
        const token = await user_token();

        if (token != null)
        {
            this.headers.append("Authorization", `Bearer ${token}`);
        }

        options.headers = this.headers;

        if (this.method != 'GET')
        {
            options.body = this.body;
        }

        return fetch(this.url, options);
    }

    sendJSON()
    {
        this.headers.append("Content-Type", "application/json");
        this.body = JSON.stringify(this.body)

        return this.send()
    }

}