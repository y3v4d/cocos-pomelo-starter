cc.Class({
    extends: cc.Component,

    properties: {
        ipBox: {
            default: null,
            type: cc.EditBox
        },
        portBox: {
            default: null,
            type: cc.EditBox
        },
        usernameBox: {
            default: null,
            type: cc.EditBox
        },
        channelBox: {
            default: null,
            type: cc.EditBox
        },
        errorMessage: cc.Label
    },

    onLoad() {
        this.errorMessage.node.opacity = 0;

        this.ipBox.string = cc.sys.localStorage.getItem('host') || "";
        this.portBox.string = cc.sys.localStorage.getItem('port') || "";
        this.usernameBox.string = cc.sys.localStorage.getItem('username') || "";
        this.channelBox.string = cc.sys.localStorage.getItem('channel') || "";

        pomelo.on('io-error', event => {
            this.showError(`Couldn't connect to server`);
        });
    },

    showError(msg) {
        this.errorMessage.node.opacity = 255;
        this.errorMessage.string = `Error: ${msg}`;

        cc.tween(this.errorMessage.node)
            .to(5, { opacity: 0 })
            .start();
    },

    onConnectButtonClicked(event) {
        const username = this.usernameBox.string;
        const channel = parseInt(this.channelBox.string);
        const host = this.ipBox.string;
        const port = this.portBox.string;

        if(username.length < 4) {
            this.showError("Username has to be at least 4 characters long");
            return;
        }

        if(isNaN(channel)) {
            this.showError("Invalid channel number");
            return;
        }

        pomelo.init({
            host: host,
            port: port
        }, () => {
            // save login data for future
            cc.sys.localStorage.setItem('host', host);
            cc.sys.localStorage.setItem('port', port);

            console.log("Successfully connected");
            
            pomelo.request("connector.entryHandler.entry", { user: username, rid: channel.toString() }, (data) => {
                if(data.error) {
                    this.showError(data.msg);
                    pomelo.disconnect(() => {
                        console.log("Disconnected from the server");
                    });

                    return;
                }

                pomelo.off('io-error');

                cc.sys.localStorage.setItem('username', username);
                cc.sys.localStorage.setItem('channel', channel);
                cc.director.loadScene("channel");
            });
        });
    }
});
