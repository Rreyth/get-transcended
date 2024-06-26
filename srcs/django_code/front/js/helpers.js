import en from "../lang/en.json" with { type: "json" }
import fr from "../lang/fr.json" with { type: "json" }
import es from "../lang/es.json" with { type: "json" }
import gr from "../lang/gr.json" with { type: "json" }

const LANG_MAP = { en, fr, es, gr }
const DEFAULT_LANG = "en"

export const translate = async (key) => {
    const langFromCookie = await cookieStore.get("lang")
    const lang = langFromCookie?.value ?? DEFAULT_LANG

    if (!langFromCookie) { cookieStore.set({ name: "lang", value: DEFAULT_LANG }) }

    const currentLang = LANG_MAP[lang];

    const keys = key.split(".")
    let value = currentLang[keys.shift()]

    for (const k of keys)
        value = value[k];

    return value
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

	const res = await response.json();
    if (response.ok && res.access)
    {
        cookieStore.set({ name: "token", value: res.access });
		return (true);
    }
	return (res);
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

export const getAvatarUrl = (baseUrl) => {
	if (baseUrl.search("https") != -1)
		return (baseUrl.replace("/https%3A", "https://"));
	else
		return(baseUrl);
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
