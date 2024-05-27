export class Cache
{
    static collection = {}

    static set(name, value)
    {
        this.collection[name] = value
    }

    static remove(name)
    {
        Object.keys(details)
            .filter(key => key !== name)
            .reduce((newObj, key) => {
                    newObj[key] = details[key];
                    return newObj;
                }, {});
    }

    static get(name)
    {
        if (this.collection.hasOwnProperty(name))
        {
            return this.collection[name]
        }

        return null
    }

    static getOrCreate(name, defaultValue)
    {
        if (this.collection.hasOwnProperty(name))
        {
            return Cache.get(name)
        }

        Cache.set(name, defaultValue)

        return defaultValue
    }
}