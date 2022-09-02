let Chat = cc.Class({
    extends: cc.Component,

    properties: {
        container: cc.Node,
        itemPrefab: cc.Prefab
    },

    onMessageSendCallback: () => {},

    addMessage(username, message) {
        const item = cc.instantiate(this.itemPrefab);
        item.getComponent("ChatItem").setContent(username, message);

        this.container.addChild(item);
    },

    onMessageSend(target) {
        const msg = target.string;
        target.string = "";
        
        this.onMessageSendCallback(msg);
    }
});
