export const trans = async (key) => {
    let lang = await cookieStore.get("lang")

    if (lang == null)
    {
        cookieStore.set({ name: "lang", value: "fr" })
        lang = { value: "fr" }
    }

    const response = await fetch(`https://${location.hostname}:${location.port}/static/lang/${lang.value}.json`)

    if (response.ok)
    {
        const value = (await response.json())[key]

        return value == null ? key : value;
    }

    return key;
}