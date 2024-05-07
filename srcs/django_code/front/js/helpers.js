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

export const api = async (method, path, data = {}, token = null) => {
    const url = `https://${location.hostname}:${location.port}/api${path}`
    const init = {
        method: method,
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
    }

    if (Object.keys(data).length > 0)
    {
        init.body = JSON.stringify(data)
    }

    let response = await fetch(url, init)

    return response
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
    const response = await api('POST', '/token/', {
        username: username,
        password: password
    })

    if (response.ok)
    {
        cookieStore.set({ name: "token", value: (await response.json()).access })
    }
}