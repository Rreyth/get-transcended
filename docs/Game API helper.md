# Game API helper
## Connection
### By username:
```json
send:
{
	"type"		: "connect",
	"cmd" 		: "username",
	"username"	: <username>,
	"password"	: <password>,
}
```
### By token:
```json
send:
{
	"type"		: "connect",
	"cmd" 		: "token",
	"token"		: <token>,
}
```
### Reply:
```json
{
	"type"		: "connectionRpl",
	"success"	: "true" / "false",
	"error"		: "none" / <error msg>
}
```
## Game creation
### Quick game:
```json
{
	"type"	: "quickGame",
	"cmd"	: "join",
	"online": "true" / "false"
}
```
### Custom game:
```json
{
	"type"		: "custom",
	"online"	: "true" / "false",
	"mods"		: <mod list>,
	"score"		: <game max score>,
	"ai"		: <nb of ai>,
	"players"	: <nb of players (including ai)>
}
```
### Tournament:
```json
{
	"type"		: "tournament",
	"online"	: "true" / "false",
	"mods"		: <mod list>,
	"score"		: <game max score>,
	"ai"		: <nb of ai>,
	"players"	: <nb of players (including ai)>
}
```
### Reply (if online):
```json
{
	"type"	: "GameRoom" / "TournamentRoom",
	"ID"	: <room id>,
	"port"	: <room websocket port>,
	"pos"	: <pos in room queue>
}
```
## Game join
```json
{
	"type"	: "join",
	"id"	: <room id>
}
```
### Reply:
```json
{
	"type"			: "joinResponse",
	"success"		: "true" / "false",
	// if success
	"port"			: <room websocket port>,
	"pos"			: <pos in room queue>,
	"max"			: <max players in room>,
	"mode"			: <room type>,
	"custom_mods"	: <room mods>,
	// if mode = tournament
	"score"			: <game max score>,
	"ai"			: <nb of ai in room>,
	"players"		: <list of player names>
}
```
## Waiting
### Quit waiting queue:
```json
{
	"type"	: "quitGame",
	"id"	: <player id>,
	"cmd"	: "quitWait"
	//if mode = tournament
	"cmd"	: "tournament"
}
```
**Reply:**
```json
{
	"type"	: "endGame",
	"cmd"	: "quitWait",
	"id"	: <leaver id>
}
```
### Full room:
**Receive:**
```json
{
	"type"	: "start"
}
```
## Game room
### Join:
```json
{
	"type"			: "join",
	"name"			: <player name>,
	// if mode = tournament
	"tournament"	: <pos in tournament list>
}
```
### Room to player:
**Game values init:**
```json
{
	"type"		: "start",
	"id"		: <player pos in room>,
	"Room_id"	: <room id>,
	"players"	: [pos, name, max players, borderless<boolean>, square<boolean>] for each player, //init values for players object
	"walls"		: [pos, square<boolean>] for each wall, //init values for wall object
	"ball"		: borderless<boolean>, //init value for ball object
	//if obstacle in room mods
	"obstacle"	: solid<boolean> //obstacle state
}
```
**Wait for room to be ready:**
```json
{
	"type"	: "waiting"
}
```
**Game start:**
```json
{
	"type"	: "start"
}
```
## In game
### Send inputs:
```json
{
	"type"	: "input",
	"player": <player id>,
	"inputs": {key : true} //dict containing player inputs 
}
```
### Update message (receive):
**Quick and custom games:**
```json
{
	"type"		: "update",
	// if start timer (start of match)
	"timer"		: <start timer>,
	// else
	"players"	: [pos x, pos y], //pos in ratio for each player
	"ball"		: [pos x, pos y, stick<player id>, speed, dir], //pos in ratio
	"score"		: score<list>, // score of each player
	// if obstacle in room mods
	"obstacle"	: solid<boolean> //obstacle state
}
```
**Tournament games:**
```json
{
	"type"			: "update",
	"tournament"	: true,
	"state"			: <tournament state>,
	"timer"			: <timer before next match>,
	"matches"		: <list of match>,
	"index"			: <index of incomming match>
}
```
**Tournament changing state:**
```json
{
	"type"			: "update",
	"tournament"	: true,
	"cmd"			: "StartMatch" / "EndMatch" / "EndTournament",
	"states"		: <list of player state>, //"(SPEC)" / "(LOSE)" / "(LEFT)" / "(WIN)"
	"matches"		: <list of match>,
	"index"			: <index of incomming match>
}
```
### End message (receive):
```json
{
	"type"		: "endGame",
	"mode"		: "custom" / "QuickGame",
	"match"		: <list of player(id, name, score, win<boolean>)>,
	"online"	: true / false,
	"customs"	: <list of custom mods>,
	"score"		: <match max score>,
	"reason"	: "end" / "quit" //reason for the end of match
}
```