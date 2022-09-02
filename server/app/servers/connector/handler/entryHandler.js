module.exports = function(app) {
  return new EntryHandler(app);
};

let EntryHandler = function(app) {
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
 EntryHandler.prototype.entry = function(msg, session, next) {
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

		next(null, { code: 200, users: data.users });
	});
};

// callback that should be invoked when connection with user closes, to kick him out of the current room
function onUserLeave(app, session) {
	const rid = session.get('rid');
	if(!session || !session.uid || !rid) {
		return;
	}

	app.rpc.chat.chatRemote.kick(session, session.uid, app.get('serverId'), rid, (data) => {
		if(data.error) {
			console.error(data.msg);
			return;
		}

		console.log(`Removed user ${session.uid} from channel ${rid}`);
	});
}