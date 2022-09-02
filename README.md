# **Cocos Creator 2.4.9 PomeloJS Starter**

Project aims to show how to use PomeloJS plugin with Cocos Creator 2.4.9 (plugin itself can work on different versions as well).

## **Basic requirements**
- NodeJS 16
- Cocos Creator 2.4.9

## **Setup**
- Clone project using command line or download it through browser
- Extract the project and go into **server** folder
- Type `npm i -d` to install all needed dependencies
- Type `npm i --global pomelo` to globally install PomeloJS
- Inside **server** folder run server using `pomelo start` or `npx pomelo start` command (depending if global NodeJS packages are registered in you **PATH**)
- Open project using Cocos Creator 2.4.9
- Lanuch project and check if it works - with default values in edit boxes it should connect to the server and go to the **channel** scene
- Experiment with the project to learn about Cocos and PomeloJS integration

## **Documentation**
### Connector Handler Calls
All calls available for **connector.entryHandler** route.

#### **connector.entryHandler.entry**
Should be used as a first call after successfull connection, to log user into the channel.

**Arguments**
```ts
{
    user: string, // username
    rid: string // numerical string representing channel's id 
}
```

**Returns**
```ts
// Success
{
    code: number // (200)
}
// Failure
{
    error: boolean, // (true)
    msg: string // error message
}
```

### Chat Handler Calls
All calls available for **chat.chatHandler** route.

#### **chat.chatHandler.getInfo**
Retrives information about current user's chat channel.

**Returns**
```ts
// Success
{
    code: number, // (200)
    username: string, // current user's username
    rid: string, // current user's channel id
    users: string[] // array of all users nicknames
}
// Error
{
    error: boolean, // (true)
    msg: string // error message
}
```

#### **chat.chatHandler.send**
Sends received message to all users in the current user's channel through **onUserMessage** message.

**Arguments**
```ts
{
    msg: string // message that will be send to the current user's channel
}
```

**Returns**
```ts
// Success
{
    code: number // (200)
}
// Error
{
    error: boolean, // (true)
    msg: string // error message
}
```

### Chat Route Messages
All messages that can be send from **chat** server.
Only users who *subscribed* to the particular message through **pomelo.on** will receive the message.

#### **onUserJoin**
This message will be send to all members (except the newest one) of the channel.

```ts
{
    user: string // user that joined the channel
}
```

#### **onUserLeave**
This message will be send to all members (except the one who left) of the channel.

```ts
{
    user: string // user that left the channel
}
```

#### **onUserMessage**
This message will be send to all members of the channel.

```ts
{
    user: string, // user who sent the message
    msg: string // content of the message
}
```

### Local Storage

All values used by local storage API.
- **host** - stores last successfully connected server host
- **port** - stores last successfully connected server port
- **username** - stores last successfully logged username
- **channel** - stores last successfully logged channel