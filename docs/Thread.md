# Les Threads

Une nouvelle classe `Thread` a été ajoutée permettant de créer des `setInterval` sans qu'ils affectent une autre page où ils ne sont pas censés être présents.

## Comment l'utiliser
```js
const threadId = Thread.new(() => {
    // code ...
}, 1000);
```