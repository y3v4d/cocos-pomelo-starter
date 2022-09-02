cc.Class({
    extends: cc.Component,

    properties: {
        usernameLabel: cc.Label,
        msgLabel: cc.Label
    },

    setContent(username, message) {
        this.usernameLabel.string = username;
        this.msgLabel.string = message;
    }
});
