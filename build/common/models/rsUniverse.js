/**
 * 
 * @class RSUniverse
 * @extends RSObject
 * @constructor
 * @module Common
 * @param {Object} details Source information to initialize the object
 * 		received from the Universe.
 */
class RSUniverse extends RSObject {
	constructor(details) {
		super(details);

		/**
		 * Tracks if the system has been logged out and flags as such to prevent
		 * automatic reconnection attempts.
		 * 
		 * Automatic connection processing tends to be handled in the Connect component.
		 * @property loggedOut
		 * @type Boolean
		 */
		this.loggedOut = false;
		this.initialized = false;
		this.indexes = {};
		this.nouns = {};
		
		this.connection = {};
		this.connection.maxHistory = 100;
		this.connection.authenticator = null;
		this.connection.user = null;
		this.connection.retries = 0;
		this.connection.reconnecting = false;
		this.connection.closing = false;
		this.connection.master = false;
		this.connection.history = [];
		this.connection.entry = (entry) => {
			if(typeof(entry) === "string") {
				entry = {
					"message":entry
				};
			}
			entry.user = this.connection.user.toJSON();
			entry.time = Date.now();
			this.connection.history.unshift(entry);
			if(this.connection.history.length > this.connection.maxHistory) {
				this.connection.history.pop();
			}
		};
		
		/**
		 * Logging point for this universe.
		 * @property log
		 * @type RSLog
		 */
		this.log = new RSLog(this);
		
		this.$on("world:state", (event) => {
			if(!this.initialized) {
				this.$emit("initializing", event);
			}
			this.loadState(event);
		});
	}
	
	/**
	 * 
	 * @method connect
	 * @param {UserInformation} userInformation
	 * @param {String} address
	 */
	connect(userInformation, address) {
		if(!address) {
			throw new Error("No address specified");
		}
		
		if(!userInformation) {
			userInformation = rsSystem.AnonymousUser;
		}

		this.connection.user = userInformation;
		this.connection.address = address;
		
		return new Promise((done, fail) => {
			this.loggedOut = false;
			this.connection.entry({
				"message": "Connecting to Universe",
				"address": address
			});
			
			var socket = new WebSocket(address + "?authenticator=" + userInformation.token + "&username=" + userInformation.username + "&id=" + userInformation.id + "&name=" + userInformation.name);
			
			socket.onopen = (event) => {
				this.closing = false;
				this.connection.entry({
					"message": "Connection Established",
					"event": event
				});
				if(this.connection.reconnecting) {
					this.connection.reconnecting = false;
					this.$emit("reconnected", this);
				}
				this.$emit("connected", this);
			};
			
			socket.onerror = (event) => {
				this.connection.entry({
					"message": "Connection Failure",
					"event": event
				});
				rsSystem.log.fatal({
					"message": "Connection Failure",
					"universe": this,
					"error": event
				});
				this.connection.socket = null;
				if(!this.connection.reconnecting) {
					this.connection.entry("Mitigating Lost Connection");
					this.connection.reconnecting = true;
					this.$emit("error", {
						"message": "Connection Issues",
						"universe": this,
						"event": event
					});
				}
				this.reconnect();
			};
			
			socket.onclose = (event) => {
				this.connection.entry({
					"message": "Connection Closed",
					"event": event
				});
				if(!this.connection.closing && !this.connection.reconnecting) {
					this.connection.entry("Mitigating Lost Connection");
					this.connection.reconnecting = true;
					this.$emit("error", {
						"message": "Connection Issues",
						"universe": this,
						"event": event
					});
					this.reconnect(event);
				} else if(this.connection.closing) {
					this.$emit("disconnected", this);
				}
				this.connection.socket = null;
			};
			
			socket.onmessage = (message) => {
				try {
					this.connection.entry(message, "Message Received");
					this.connection.syncMark = message.time;
					this.connection.last = Date.now();
					
					message = JSON.parse(message.data);
					message.received = Date.now();
					message.sent = parseInt(message.sent);
					if(message.echo && message.event && !message.event.echo) {
						message.event.echo = message.echo;
					}
					console.log("Received: ", message);
					
					this.$emit(message.type, message.event);
					this.connection.entry(message, message.type);
				} catch(exception) {
					console.error("Communication Exception: ", exception);
					this.$emit("warning", {
						"message": {
							"text": "Failed to parse AQ Connection message"
						},
						"fields": {
							"message": message,
							"exception": exception
						}
					});
				}
			};
			
			this.connection.socket = socket;
			this.user = userInformation;
			done();
		});
	}
	
	/**
	 * 
	 * @method reconnect
	 * @param {Object} [event] When available, the event that caused the disconnect. Used to retrieve
	 * 		the error code to determine if reconnecting should be attempted.
	 */
	reconnect(event) {
		setTimeout(() => {
			rsSystem.log.warn("Possible Reconnect: ", event);
			if((!event || event.code <4100) && this.connection.retries < 5) {
				rsSystem.log.warn("Connection Retrying...\n", this);
				this.connection.retries++;
				this.connect(this.connection.user, this.connection.address);
			} else {
				this.$emit("disconnected", this);
				rsSystem.log.error("Reconnect Giving up\n", this);
				this.loggedOut = true;
			}
		}, 1000);
	}
	
	/**
	 * 
	 * @method disconnect
	 */
	disconnect() {
		if(!this.connection.socket) {
			this.connection.entry("Unable to disconnect, Universe not connected");
		} else {
			this.connection.entry("Disconnecting");
			this.connection.socket.close();
			this.connection.reconnecting = false;
			this.connection.closing = true;
			this.connection.socket = null;
			this.connection.address = null;
		}
	}
	
	/**
	 * 
	 * @method logout
	 */
	logout() {
		this.loggedOut = true;
		this.disconnect();
	}
	
	/**
	 * 
	 * @param {Object} state
	 * @return {Promise}
	 */
	loadState(state) {
		return new Promise((done, fail) => {
			console.log("Loading State: ", state);
			var keys = Object.keys(state),
				Constructor,
				noun,
				type,
				ids,
				id,
				i,
				t;
			
			for(t=0; t<keys.length; t++) {
				type = keys[t];
				Constructor = rsSystem.availableNouns[type];
				if(Constructor) {
					ids = Object.keys(state[type]);
					if(!this.nouns[type]) {
						this.indexes[type] = new SearchIndex();
						this.nouns[type] = {};
					}
					for(i=0; i<ids.length; i++) {
						id = ids[i];
						if(this.nouns[type][id]) {
							this.nouns[type][id].loadDelta(state[type][id]);
						} else {
							this.nouns[type][id] = new Constructor(state[type][id], this);
							this.indexes[type].indexItem(this.nouns[type][id]);
						}
						noun = this.nouns[type][id];
					}
				} else {
					rsSystem.log.error("Noun does not have a registered constructor: " + type);
				}
			}
			
			if(!this.initialized) {
				this.$emit("initialized", this);
			}
		});
	}
	
	/**
	 * 
	 * @method send
	 * @param {String} type
	 * @param {Object} data
	 */
	send(type, data) {
		data = data || {};
		if(this.connection.socket) {
			this.connection.retries = 0;
			if(typeof data !== "object") {
				throw new Error("Only objects can be sent");
			}
			if(!data.echo) {
				data.echo = Random.identifier("echo");
			}
			data = {
				"sent": Date.now(),
				"echo": data.echo,
				"event": type,
				"data": data
			};
			console.log("Sending: ", data);
			this.connection.socket.send(JSON.stringify(data));
			return data.data.echo;
		} else {
			// TODO: Buffer for connection restored
		}
	}
}

