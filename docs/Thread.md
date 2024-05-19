# Threads

A new `Thread` class has been added, allowing you to create `setInterval` that do not affect other pages where they are not supposed to be present.

## How to use it
```js
const threadId = Thread.new(() => {
    // code ...
}, 1000);
```