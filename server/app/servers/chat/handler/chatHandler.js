let chatRemote = require("../remote/chatRemote");

module.exports = function(app) {
    return new ChatHandler(app);
};

let ChatHandler = function(app) {
    this.app = app;
};

ChatHandler.prototype.getMembers = function(msg, session, next) {
    if(!session || !session.uid || !session.get('rid')) {
        next(null, { code: 500, error: true, msg: "Invalid session" });
        return;
    }

    const rid = session.get('rid');
    const username = session.uid.split('*')[0];
    this.app.rpc.chat.chatRemote.get(session, session.get('rid'), (data) => {
        if(data.error) {
            next(null, data);
            return;
        }

        next(null, { username: username, rid: rid, users: data.users });
    })
}

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