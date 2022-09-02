const Chat = require("../chat/Chat");

cc.Class({
    extends: cc.Component,

    properties: {
        channelIdLabel: {
            default: null,
            type: cc.Label
        },

        chat: {
            default: null,
            type: Chat
        }
    },

    onLoad() {
        this.chat.onMessageSendCallback = this.onChatMessageSend.bind(this);

        pomelo.on('onUserJoin', (data) => {
            this.chat.addMessage("SYSTEM", `User ${data.user} joined the room!`);
        });

        pomelo.on('onUserLeave', (data) => {
            this.chat.addMessage("SYSTEM", `User ${data.user} left the room!`);
        });

        pomelo.on('onUserMessage', (data) => {
            this.chat.addMessage(data.user, data.msg);
        });

        pomelo.request("chat.chatHandler.getInfo", (data) => {
            if(data.error) {
                console.error(data.msg);
                return;
            }

            this.channelIdLabel.string = `#${data.rid}`;
        });
    },

    onLogoutButtonClicked(event) {
        pomelo.disconnect(() => {
            console.log("Disconnected from server");

            pomelo.off('onUserMessage');
            pomelo.off('onUserLeave');
            pomelo.off('onUserMessage');

            cc.director.loadScene("login");
        });
    },

    onChatMessageSend(msg) {
        pomelo.request('chat.chatHandler.send', { msg: msg }, (data) => {
            if(data.error) console.error(data.msg);
        });
    }
});
