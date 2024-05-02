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