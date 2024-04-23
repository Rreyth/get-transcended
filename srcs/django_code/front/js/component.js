export class Component extends HTMLElement
{

    connectedCallback()
    {
        this.addEventListener('click', this.handleClick, true)
    }

    handleClick(ev)
    {
    }

    addClickEvent(item, callback)
    {
        this.querySelector(item).addEventListener('click', callback);
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