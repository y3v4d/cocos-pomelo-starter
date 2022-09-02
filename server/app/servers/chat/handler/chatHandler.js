module.exports = function(app) {
    return new ChatHandler(app);
};

let ChatHandler = function(app) {
    this.app = app;
};

// retrieves current user username, id of the channel and all members nicknames
ChatHandler.prototype.getInfo = function(msg, session, next) {
    if(!session || !session.uid || !session.get('rid')) {
        next(null, { error: true, msg: "Invalid session" });
        return;
    }

    const rid = session.get('rid');
    const username = session.uid.split('*')[0];

    const channelService = this.app.get('channelService');
    const channel = channelService.getChannel(rid, false);
    if(!channel) {
        callback({ error: true, msg: `Couldn't find channel ${rid}` });
        return;
    }

    let users = [];
    for(const user of channel.getMembers()) {
        users.push(user.split('*')[0]);
    }

    next(null, { username: username, rid: rid, users: users });
}

// send message received from client to his current channel
ChatHandler.prototype.send = function(msg, session, next) {
    if(!session || !session.uid || !session.get('rid')) {
        next(null, { error: true, msg: "Invalid session" });
        return;
    }

    const username = session.uid.split('*')[0];
    const rid = session.get('rid');

    const channelService = this.app.get('channelService');
    const channel = channelService.getChannel(rid);
    if(!channel) {
        next(null, { error: true, msg: `Didn't find channel ${rid}` });
        return;
    }
    
    channel.pushMessage({
        route: 'onUserMessage',
        user: username,
        msg: msg.msg
    });

    next(null, { code: 200 });
}