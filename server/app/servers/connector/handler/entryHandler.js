module.exports = function(app) {
  return new Handler(app);
};

let Handler = function(app) {
  this.app = app;
};

/**
 * New client entry.
 *
 * @param  {Object}   msg     request message
 * @param  {Object}   session current session object
 * @param  {Function} next    next step callback
 * @return {Void}
 */
Handler.prototype.entry = function(msg, session, next) {
	const user = msg.user;
	const rid = msg.rid;
	const uid = `${user}*${rid}`;

	const sessionService = this.app.get('sessionService');
	if(sessionService.getByUid(uid)) {
		next(null, { error: true, msg: "User already logged" });
		return;
	}

	session.bind(uid);
	session.set('rid', rid);
	session.push('rid', (err) => {
		if(err) console.error(err);
	});
	session.on('closed', onUserLeave.bind(this, this.app));

	this.app.rpc.chat.chatRemote.add(session, uid, this.app.get('serverId'), rid, true, (data) => {
		if(data.error) {
			next(null, data);
			return;
		}

		next(null, { code: 200, msg: `Entered channel #${rid}`, users: data.users });
	});
};

function onUserLeave(app, session) {
	if(!session || !session.uid) {
		return;
	}

	app.rpc.chat.chatRemote.kick(session, session.uid, app.get('serverId'), session.get('rid'), (data) => {
		if(data.error) {
			console.error(data.msg);
			return;
		}

		console.log(data.msg);
	});
}