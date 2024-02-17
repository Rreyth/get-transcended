export default class About {
    constructor(params) {
        document.title = "About";
    }

    async getHtml() {
        return `
            <h1>whaaaaa</h1>
            <p>
                sdfsdf do eiusmod occaecat irure do.sdf sdfsdfsdf fugiat sint exercitation consequat. Sit anim laborum sit amet Lorem adipisicing ullamco duis. Anim in do magna ea pariatur et.
            </p>
            <p>
                <a href="/posts" data-link>suck bitch</a>.
            </p>
        `;
    }
}