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
    let u = await cookieStore.get("user")

    if (u == null)
    {
        const token = await user_token()

        if (token == null)
        {
            return undefined
        }

        const response = await api('GET', '/user', {}, token)

        if (response.ok)
        {
            const json = await response.json()

            cookieStore.set({ name: "user", value: JSON.stringify(json) })

            return json
        }

        return undefined
    }

    return JSON.parse(u.value)
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