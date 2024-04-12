export class Component extends HTMLElement
{

    connectedCallback()
    {
        const rules = this.rules()

        if (Object.keys(rules).length > 0)
        {
            for (const attr in rules)
            {
                if (!this.getAttribute(attr) && rules[attr].includes('required'))
                {
                    throw new Error(`${attr} is required for ${c.getName()}`)
                }

                this[attr] = attr

                this.removeAttribute(attr)
            }
        }

        this.addEventListener('click', this.handleClick, true)
    }

    rules()
    {
        return {}
    }

    handleClick(ev)
    {
    }

    static getName()
    {
        throw new Error("Name is not define")
    }

    static loader(components = [])
    {
        components.forEach(c => {
            customElements.define(`c-${c.getName()}`, c)
        })
    }
    
}