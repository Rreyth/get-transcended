const ThreadClearEvent = new CustomEvent('ThreadClearEvent', {
	detail: {
		message: 'All threads cleared'
	}
});

export class Thread 
{
    static threads = []

    static new(callback, timeout)
    {
        if (typeof callback != 'function')
        {
            throw new Error('callback is not function')
        }

        let id = setInterval(callback, timeout)

        this.threads.push(id)

        return id
    }

    static clearAll()
    {
        this.threads.forEach(item => {
            clearInterval(item)
        })
		window.dispatchEvent(ThreadClearEvent);
    }
}