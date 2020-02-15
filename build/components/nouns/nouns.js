
/**
 * 
 * 
 * @class rsNoun
 * @constructor
 * @module Components
 */
(function() {
	var storageKey = "_rs_nounComponentKey";
	
	var spacing = / /g;
	
	var byName = function(a, b) {
		a = (a.name || "").toLowerCase();
		b = (b.name || "").toLowerCase();
		if(a < b) {
			return -1;
		} else if(a > b) {
			return 1;
		} else {
			return 0;
		}
	};
	
	/**
	 * Fill out item to complete fields.
	 * @method completeItem
	 * @param {Object} item
	 */
	var completeItem = function(type, item) {
		if(!item.id) {
			if(!item.name) {
				throw new Error("No ID or name");
			} else {
				item.id = type + ":" + item.name.toLowerCase().replace(spacing, "");
			}
		}
		
		item.id = item.id.toLowerCase().trim();
		if(item.name) {
			item.name = item.name.trim();
		}
		
		return item;
	};
	
	rsSystem.component("rsNouns", {
		"inherit": true,
		"mixins": [
			rsSystem.components.StorageManager,
			rsSystem.components.DataManager,

			rsSystem.components.NounFieldsModifierStats,
			rsSystem.components.NounFieldsModifierAttrs,
			rsSystem.components.NounFieldsKnowledge,
			rsSystem.components.NounFieldsItemType,
			rsSystem.components.NounFieldsLocation,
			rsSystem.components.NounFieldsPlaylist,
			rsSystem.components.NounFieldsAbility,
			rsSystem.components.NounFieldsDataset,
			rsSystem.components.NounFieldsEntity,
			rsSystem.components.NounFieldsEffect,
			rsSystem.components.NounFieldsWidget,
			rsSystem.components.NounFieldsParty,
			rsSystem.components.NounFieldsSkill,
			rsSystem.components.NounFieldsItem,
			rsSystem.components.NounFieldsNote,
			rsSystem.components.NounFieldsRace,
			rsSystem.components.NounFieldsRoom,
			rsSystem.components.NounFieldsSlot,
			rsSystem.components.NounFieldsSex
		],
		"props": {
			"universe": {
				"required": true,
				"type": Object
			},
			"player": {
				"required": true,
				"type": Object
			},
			"built": {
				"type": Object
			}
		},
		"data": function() {
			var data = {},
				x;

			data.availableToCopy = [];
			data.nameGenerators = {};
			data.attaching = null;
			data.rawValue = "{}";
			data.message = null;
			data.isValid = true;
			data.models = {};
			data.copy = null;
			data.nouns = rsSystem.listingNouns.sort();
			data.storageKeyID = storageKey;
			data.state = this.loadStorage(data.storageKeyID, {
				"current": "player",
				"building": {}
			});
//			console.log("Loaded Data[" + storageKey + "]: ", data.state);
			if(this.$route.params.type) {
				data.state.current = this.$route.params.type;
			}
			
			for(x=0; x<data.nouns.length; x++) {
				if(!data.state.building[data.nouns[x]]) {
					data.state.building[data.nouns[x]] = {};
				}
				data.models[data.nouns[x]] = new rsSystem.availableNouns[data.nouns[x]](data.state.building[data.nouns[x]], this.universe);
				data.models[data.nouns[x]]._coreData = data.state.building[data.nouns[x]];
			}
			
			data.extra_properties = [];
			
			return data;
		},
		"watch": {
			"copy": function(value) {
				if(value) {
					var copy = this.universe.nouns[this.state.current][value],
						x;
					
//					if(!copy) {
//						console.warn("Unable to find copy source[" + this.state.current + "]? " + value, copy);
//					} else {
//						console.warn("Copying source[" + this.state.current + "]? " + value, copy);
//					}
					
					value = copy?JSON.stringify(copy, null, 4):"{}";
					value = JSON.parse(value);
					if(copy && copy.template && this.state.building[this.state.current].parent !== copy.id && (this.$route.params.oid !== copy.id || (this.$route.params.oid === copy.id && this.$route.query.copy === "true"))) {
						value.parent = value.id;
						value.id += ":" + Date.now();
						if(value.randomize_name) {
							copy = this.getGenerator(value.race);
							if(copy) {
								value.name = copy.corpus[Random.integer(copy.corpus.length)].capitalize();
								for(x=1; x<value.randomize_name; x++) {
									value.name += " " + copy.corpus[Random.integer(copy.corpus.length)].capitalize();
								}
							}
						}
						delete(value.randomize_name);
						delete(value.template);
					}
					if((!copy || (copy && !copy.template)) && this.$route.query.copy === "true") {
						value.id += ":" + Date.now();
					}
					if(this.$route.query.values) {
						try {
							copy = JSON.parse(this.$route.query.values);
							Object.assign(value, copy);
						} catch(exception) {
							console.warn("Failed to load values due to parse exception: ", exception);
						}
					}
					value = JSON.stringify(value, null, 4);
//					console.warn("Setting Raw Value: ", value);
					Vue.set(this, "rawValue", value);
					Vue.set(this, "copy", null);
				}
			},
			"state.current": function(n, p) {
//				console.warn("Current Shift: ", n, p);
				if(this.state.building[n]) {
					Vue.set(this, "rawValue", JSON.stringify(this.state.building[n], null, "\t"));
				} else {
					Vue.set(this, "rawValue", {});
				}
				
				this.buildAvailableCopies();
			},
			"state": {
				"deep": true,
				"handler": function() {
//					console.warn("State Saving[" + this.storageKeyID + "]: ", this.state);
					this.models[this.state.current].id = this.state.building[this.state.current].id;
					this.models[this.state.current].recalculateProperties();
					this.saveStorage(this.storageKeyID, this.state);
					this.$forceUpdate();
				}
			},
			"$route.params": {
				"deep": true,
				"handler": function(params) {
//					console.warn("New Parameters: ", params);
					if(this.$route.params.type) {
						Vue.set(this.state, "current", params.type);
						this.broadcastModel();
					}
					if(this.$route.params.oid) {
						setTimeout(() => {
							Vue.set(this, "copy", params.oid);
						},0);
					}
				}
			},
			"rawValue": function(value) {
				try {
//					console.warn("Processing Raw Value Change[" + this.state.current + "]: ", value);
					var parsed = JSON.parse(value),
						keys,
						x;

//					console.warn(" -- Parsed Raw Value Change[" + this.state.current + "]: ", parsed);
					
//					Vue.set(this.state.building, this.state.current, parsed);
					keys = Object.keys(this.state.building[this.state.current]);
					for(x=0; x<keys.length; x++) {
						Vue.delete(this.state.building[this.state.current], keys[x]);
					}
					keys = Object.keys(parsed);
					for(x=0; x<keys.length; x++) {
						Vue.set(this.state.building[this.state.current], keys[x], parsed[keys[x]]);
					}
					if(parsed instanceof Array) {
						Vue.set(this.state.building[this.state.current], "length", parsed.length);
					}
					
//					this.saveStorage(storageKey, this.state);
					Vue.set(this, "message", null);
					Vue.set(this, "isValid", true);
					
					if(this.built) {
//						console.warn("Sync Built: ", this.built);
						keys = Object.keys(this.built);
						for(x=0; x<keys.length; x++) {
							Vue.set(this.built, keys[x], null);
						}
						keys = Object.keys(parsed);
						for(x=0; x<keys.length; x++) {
							Vue.set(this.built, keys[x], parsed[keys[x]]);
						}
					}
//					console.warn(" -- Raw Value Changed");
					
				} catch(exception) {
					Vue.set(this, "message", "Invalid: " + exception.message);
					Vue.set(this, "isValid", false);
				}
			}
		},
		"mounted": function() {
			rsSystem.register(this);
			if(this.state.building[this.state.current]) {
				Vue.set(this, "rawValue", JSON.stringify(this.state.building[this.state.current], null, "\t"));
			} else {
				Vue.set(this, "rawValue", "{}");
			}
			if(this.$route.params.oid) {
				Vue.set(this, "copy", this.$route.params.oid);
			}
			
			this.universe.$on("universe:modified", this.universeUpdate);
			this.models[this.state.current].recalculateProperties();
			this.$emit("model", this.models[this.state.current]);
			this.universeUpdate();
		},
		"methods": {
			"buildAvailableCopies": function() {
				this.availableToCopy.splice(0);
				this.availableToCopy.push.apply(this.availableToCopy, this.universe.indexes[this.state.current].listing);
				this.availableToCopy.sort(byName);
			},
			"clearField": function(field) {
				Vue.set(this.state.building[this.state.current], field.property, null);
				if(this.built) {
					Vue.set(this.built, field.property, null);
				}
			},
			"hasGenerator": function(race) {
				race = race || this.state.building[this.state.current].race;
				return (race && this.universe.indexes.race.index[race] && this.universe.indexes.race.index[race].dataset)
					|| (!race && this.universe.defaultDataset);
			},
			"pullRandomName": function(generator) {
				generator = generator || this.getGenerator(this.state.building[this.state.current].race);
				if(generator) {
					Vue.set(this.state.building[this.state.current], "name", generator.corpus[Random.integer(generator.corpus.length)].capitalize() + " " + generator.corpus[Random.integer(generator.corpus.length)].capitalize());
				}
			},
			"randomizeName": function(generator) {
				generator = generator || this.getGenerator(this.state.building[this.state.current].race);
				if(generator) {
					Vue.set(this.state.building[this.state.current], "name", generator.create().capitalize() + " " + generator.create().capitalize());
				}
			},
			"getGenerator": function(race) {
				var generator = null,
					data,
					x;
				
				if(race && this.universe.indexes.race.index[race] && this.universe.indexes.race.index[race].dataset) {
					if(!this.nameGenerators[race]) {
						data = "";
						for(x=0; x<this.universe.indexes.race.index[race].dataset.length; x++) {
							if(this.universe.indexes.dataset.index[this.universe.indexes.race.index[race].dataset[x]]) {
								data += " " + this.universe.indexes.dataset.index[this.universe.indexes.race.index[race].dataset[x]].set;
							}
						}
						generator = new NameGenerator(data);
						Vue.set(this.nameGenerators, race, generator);
					} else {
						generator = this.nameGenerators[race];
					}
//					return this.nameGenerators[race];
				} else if(this.universe.defaultDataset) {
					if(!this.nameGenerators._default) {
						if(!this.universe.defaultDataset.set) {
							console.warn("UI[pdate: ", this.universe.defaultDataset);
							this.universe.defaultDataset.recalculateProperties();
						}
						generator = new NameGenerator(this.universe.defaultDataset.set);
						Vue.set(this.nameGenerators, "_default", generator);
					} else {
						generator = this.nameGenerators._default;
					}
				}
				
				return generator;
			},
			"broadcastModel": function() {
				console.warn("New Model: ", this.state.current, this.models[this.state.current]);
				this.$emit("model", this.models[this.state.current]);
				this.models[this.state.current].recalculateProperties();
			},
			"openKnowledge": function(id) {
				if(this.universe.index.index[id]) {
					rsSystem.EventBus.$emit("display-info", this.universe.index.index[id]);
				} else {
					console.warn("ID Not Found for Knowledge: ", id);
				}
			},
			"sync": function(event) {
//				console.warn("Sync: ", event);
				if(this.built) {
					Vue.set(this.built, event.property, event.value);
				}
			},
			"labelNoun": function(noun) {
				if(noun.name) {
					if(noun.template) {
						return noun.name + " (Template)";
					}
					if(noun.source_template) {
						return noun.name + " (..." + noun.id.replace(noun.source_template, "") + ")";
					}
					return noun.name + " (..." + noun.id.substring(noun.id.length - 15) + ")";
				}
				return noun.id;
			},
			"newObject": function() {
				var keys = Object.keys(this.state.building[this.state.current]),
					x;

				if(this.built) {
					for(x=0; x<keys.length; x++) {
						Vue.delete(this.state.building[this.state.current], keys[x]);
						Vue.set(this.built, keys[x], null);
					}
				} else {
					for(x=0; x<keys.length; x++) {
						Vue.delete(this.state.building[this.state.current], keys[x]);
					}
				}
				
				if(this.$route.query.values) {
					Vue.set(this, "rawValue", this.$route.query.values);
				} else {
					Vue.set(this, "rawValue", "{}");
				}
			},
			"dropObject": function() {
				this.state.building[this.state.current]._type = this.state.current;
				this.universe.send("delete:" + this.state.current, completeItem(this.state.current, this.state.building[this.state.current]));
			},
			"fileAttach": function(event) {
//				console.warn("Noun File Attach: ", event);
				try {
					var file = event.items[0].getAsFile();
//					console.warn("File: ", file);
				} catch(exception) {
					console.error("Ex: ", exception);
				}
			},
			"selectImage": function(event) {
				var input = $(this.$el).find("#attacher"),
					value,
					keys,
					x;
				
				if(this.state.current === "image" && input && input.length && input[0].files.length) {
//					console.warn("Set Image");
					if(this.state.building[this.state.current]) {
						keys = Object.keys(this.state.building[this.state.current]);
						if(this.built) {
							for(x=0; x<keys.length; x++) {
								Vue.delete(this.state.building[this.state.current], keys[x]);
								Vue.set(this.built, keys[x], null);
							}
						} else {
							for(x=0; x<keys.length; x++) {
								Vue.delete(this.state.building[this.state.current], keys[x]);
							}
						}
					}
					
					value = {};
					this.encodeFile(input[0].files[0])
					.then((result) => {
						value.data = result.data;
						result.name = result.name.substring(0, result.name.lastIndexOf("."));
						value.id = "image:" + result.name.replace(/\./g, ":");
						value.name = result.name;
						Vue.set(this, "rawValue", JSON.stringify(value, null, 4));
						input[0].value = null;
//						console.warn("New Value: ", value);
					});
				}
			},
			"toggleEditMode": function() {
				var parsed,
					keys,
					x;
				
				if(this.state.advanced_editor) {
					try {
						parsed = JSON.parse(this.rawValue);
						keys = Object.keys(this.state.building[this.state.current]);
						for(x=0; x<keys.length; x++) {
							Vue.delete(this.state.building[this.state.current], keys[x]);
						}
						
						keys = Object.keys(parsed);
						for(x=0; x<keys.length; x++) {
							Vue.set(this.state.building[this.state.current], keys[x], parsed[keys[x]]);
						}
					} catch(ex) {
						console.error("Parse Failed: ", ex);
						Vue.set(this, "error", ex.message);
					}
					Vue.set(this.state, "advanced_editor", false);
				} else {
					Vue.set(this, "rawValue", JSON.stringify(this.state.building[this.state.current], null, 4));
					Vue.set(this.state, "advanced_editor", true);
				}
			},
			"copyNoun": function(source) {
				var result = {},
					keys = Object.keys(source),
					x;
				
				for(x=0; x<keys.length; x++) {
					if(keys[x] && keys[x][0] !== "_") {
						result[keys[x]] = source[keys[x]];
					}
				}
				
				return result;
			},
			"saveEvent": function(event) {
//				console.warn("Save?", event);
				if(event.code === "KeyS" && event.ctrlKey) {
//					console.warn("Save");
					this.modify();
					event.stopPropagation();
					event.preventDefault();
					return false;
				}
			},
			"universeUpdate": function() {
				this.buildAvailableCopies();
			},
			"modify": function() {
//				console.warn("modify: ", event);
				
				if(this.isValid) {
//					console.log("valid");
					if(this.state.building[this.state.current] instanceof Array || (this.state.building[this.state.current]["0"] && this.state.building[this.state.current].length)) {
//						console.log("array");
						for(var x=0; x<this.state.building[this.state.current].length; x++) {
//							console.warn("sync: ", this.state.building[this.state.current][x]);
							this.state.building[this.state.current][x]._type = this.state.current;
							this.universe.send("modify:" + this.state.current, completeItem(this.state.current, this.state.building[this.state.current][x]));
						}
					} else {
//						console.warn("sync: ", this.state.building[this.state.current]);
						this.state.building[this.state.current]._type = this.state.current;
						this.universe.send("modify:" + this.state.current, completeItem(this.state.current, this.state.building[this.state.current]));
					}
				}
			}
		},
		"beforeDestroy": function() {
			this.universe.$off("universe:modified", this.universeUpdate);
		},
		"template": Vue.templified("components/nouns.html")
	});
})();
