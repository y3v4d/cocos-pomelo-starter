module.exports = function(app) {
    return new ChatRemote(app);
};

let ChatRemote = function(app) {
    this.app = app;
    this.channelService = app.get('channelService');
};

ChatRemote.prototype.add = function(uid, sid, rid, createChannel, callback) {
    let channel = this.channelService.getChannel(rid, createChannel);
    let username = uid.split('*')[0];

    if(!channel) {
        callback({ code: 500, error: true, msg: `Couldn't get channel ${rid}` });
        return;
    }

    channel.pushMessage({
        route: 'onUserJoin',
        user: username
    });
    
    channel.add(uid, sid);
    callback({ code: 200 });
}

ChatRemote.prototype.get = function(rid, callback) {
    let channel = this.channelService.getChannel(rid, false);
    if(!channel) {
        callback({ error: true, msg: `Couldn't find channel ${rid}` });
        return;
    }

    let users = [];
    for(const user of channel.getMembers()) {
        users.push(user.split('*')[0]);
    }

    callback({ users: users });
}

ChatRemote.prototype.kick = function(uid, sid, rid, callback) {
    const username = uid.split('*')[0];
    let channel = this.channelService.getChannel(rid, false);
    if(!channel) {
        callback({ code: 500, error: true, msg: `Couldn't get channel ${rid}` });
        return;
    }

    channel.leave(uid, sid);
    channel.pushMessage({
        route: 'onUserLeave',
        user: username
    });

    callback({ code: 200, msg: `Left channel #${rid}`});
}