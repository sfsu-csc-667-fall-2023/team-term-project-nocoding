// socket.js
module.exports = function (io) {
	const fs = require("fs");
	const url = require("url");

	const queue = {
		'W': [],
		'B': [],
		'U': [] // undefined (player does not care which color)
	};

	/* websocket server 
	  all sent with JSON encoding
	  */

	/**
	 * @class GameList singleton which defines the gamelist linked list
	 **/
	const GameList = (function () {
		/**
		 * @class Node defines a linked list node
		 * @param {Object} obj the object the node contains
		 * @param {Node} next the next node
		 **/
		const Node = function (obj, next) {
			this.obj = obj;
			this.next = next;
		};

		const that = {};
		let rear = null; // circular linked list, this is a pointer to the last node
		let size = 0; // size of linked list
		let unique = 0; // functions as game id

		/**
		 * Adds a game to the game list circular linked list
		 * @method addGame
		 * @param {Object} white the white player's socket
		 * @param {Object} black the black player's socket
		 **/
		that.addGame = function (white, black) {
			if (rear == null) {
				rear = new Node(new Game(white, black, unique), null);
				rear.next = rear;
			} else {
				const newNode = new Node(new Game(white, black, unique), rear.next);
				rear.next = newNode;
				rear = newNode;
			}
			size++;
			unique++;
			that.showGames();
		};

		that.removeGame = function (gid) {
			console.log("Removing game" + gid);
			if (rear == null) {
				console.log("Problem -- removing game from null list");
				return;
			}
			/*
			  linear search, not digging this, perhaps later if this ever gets popular (not very likely) use an AVL tree or hash table
			*/
			let ptr = rear.next,
				prev = rear;
			if (ptr == null) return;

			do {
				if (ptr.obj.gid == gid) {
					// remove this guy
					console.log("Removing game " + gid);
					if (ptr.next == ptr) {
						// linked list of one node
						rear = null;
					} else {
						prev.next = ptr.next;
						ptr.next = null;
						if (ptr == rear) {
							rear = prev;
						}
					}
					size--;
					that.showGames();
					return;
				}
				prev = ptr;
				ptr = ptr.next;
			} while (ptr != rear.next);
		};
		/* for debugging */
		that.showGames = function () {
			if (rear == null) {
				console.log("List empty");
				return;
			}
			let ptr = rear.next;
			let str = "Game List:\n";
			do {
				str += ptr.obj.gid + " ";
				ptr = ptr.next;
			} while (ptr != rear.next);
			console.log(str);
		};
		return that;
	}());


	const Game = function (w, b, gid) {
		const that = this; // reference in event functions
		let disconnected = false;

		that.wPlayer = w;
		that.bPlayer = b;
		that.gid = gid;
		that.waitingForPromotion = false;

		console.log("Game started");

		// remove the listener which removes it from the queue (since it no longer is on the queue)
		that.wPlayer.removeAllListeners('disconnect');
		that.bPlayer.removeAllListeners('disconnect');

		that.wPlayer.on('disconnect', function () {
			// alert the other player
			if (that.bPlayer != null) {
				that.bPlayer.emit('partnerDisconnect');
			}
			that.wPlayer = null;
			that.destroy();
		});

		that.bPlayer.on('disconnect', function () {
			if (that.wPlayer != null) {
				that.wPlayer.emit('partnerDisconnect');
			}
			that.bPlayer = null;
			that.destroy();
		});

		that.wPlayer.on('chat', function (data) {
			if (!disconnected) {
				that.bPlayer.emit('chat', data);
			}
		});

		that.bPlayer.on('chat', function (data) {
			if (!disconnected) {
				that.wPlayer.emit('chat', data);
			}
		});

		that.wPlayer.on('movemade', function (data) {
			console.log("White player made a move");
			if (!disconnected) {
				that.bPlayer.emit('opposing_move', data);
			}
		});
		that.bPlayer.on('movemade', function (data) {
			console.log("Black player made a move");
			if (!disconnected) {
				that.wPlayer.emit('opposing_move', data);
			}
		});

		that.destroy = function () {
			disconnected = true;
			if (that.wPlayer == null && that.bPlayer == null) {
				GameList.removeGame(that.gid);
			}
		};
		// all event listeners to w and b sockets for communication
		that.init();

		return that;
	};

	Game.prototype = {
		wPlayer: null,
		bPlayer: null,
		init: function () {
			// send messages to wPlayer and bPlayer that the game has started, and give them the color assigned (since they may not know the color)
			this.wPlayer.emit("matchfound", {
				color: 'W'
			});
			this.bPlayer.emit("matchfound", {
				color: 'B'
			});
		}
	};

	// may need to add some securing to prevent thread accidents in the following method later
	io.sockets.on('connection', function (sk) {
		var w = null,
			b = null,
			skColor = false;
		console.log("web socket connection received");

		sk.on('setup', function (data) {
			// remove this event once the match is found and setup is complete  
			sk.on('disconnect', function () {
				if (!!queue[skColor]) {
					var index = queue[skColor].indexOf(sk);
					console.log("Removing player from the queue");
					queue[skColor].splice(index, 1);
				}
			});
			console.log(data);
			skColor = data.color;
			if (!skColor) { skColor = 'U'; }

			if (skColor == 'W') {
				if (queue['B'].length > 0) {
					b = queue['B'].shift();
					// start a new game
					GameList.addGame(sk, b);
				}
				else if (queue['U'].length > 0) {
					b = queue['U'].shift();
					// start a new game
					GameList.addGame(sk, b);
				}
				else {
					queue['W'].push(sk);
				}
			}
			else if (skColor == 'B') {
				if (queue['W'].length > 0) {
					w = queue['W'].shift();
					// start a new game
					GameList.addGame(w, sk);
				}
				else if (queue['U'].length > 0) {
					w = queue['U'].shift();
					// start a new game
					GameList.addGame(w, sk);
				}
				else {
					queue['B'].push(sk);
				}
			}
			else {
				// either white or no color specified, add a player to whichever queue is waiting for an opponent
				if (queue['W'].length > 0) {
					w = queue['W'].shift();
					// start a new game
					GameList.addGame(w, sk);
				}
				else if (queue['B'].length > 0) {
					b = queue['B'].shift();
					// start a new game
					GameList.addGame(sk, b);
				}
				else if (queue['U'].length > 0) {
					w = queue['U'].shift(); // just give it to white
					// start a new game
					GameList.addGame(w, sk);
				}
				else {
					queue['U'].push(sk);
				}
			}
		});
	});
};
