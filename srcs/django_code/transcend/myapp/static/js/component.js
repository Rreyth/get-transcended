export class Component extends HTMLElement
{

    connectedCallback()
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