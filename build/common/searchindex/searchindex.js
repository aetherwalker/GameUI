
/**
 * 
 * @class SearchIndex
 * @constructor
 */
class SearchIndex extends EventEmitter {
	constructor(dataSet) {
		super();
		this.lookup = {};
		this.listing = [];
		this.named = {};
		this.index = {};
		/**
		 * Maps the ID of a selected object in this index to it's object value.
		 * @property selected
		 * @type Object
		 */
		this.selected = {};

		var x, buffer;
		dataSet = dataSet || this.source;
		if(dataSet) {
			this.source = dataSet;
			if(dataSet instanceof Array) {
				buffer = {};
				for(x=0; x<dataSet.length; x++) {
					if(dataSet[x].id) {
						this.lookup[dataSet[x].id] = dataSet[x];
						this.listing.push(dataSet[x]);
						buffer.name = dataSet[x].name && dataSet[x].name.toLowerCase?dataSet[x].name.toLowerCase():"";
						buffer.id = dataSet[x].id.toLowerCase();
						this.index[buffer.id] = dataSet[x];
						this.index[buffer.name] = dataSet[x];
						dataSet[x]._search = this.createSearchString(dataSet[x]);
					}
				}
			} else if(dataSet instanceof Object) {
				buffer = Object.keys(dataSet);
				for(x=0; x<buffer.length; x++) {
					if(buffer[x] && buffer[x] != "undefined") {
						this.lookup[buffer[x]] = dataSet[buffer[x]];
						this.listing.push(this.lookup[buffer[x]]);
					
						buffer.name = this.lookup[buffer[x]].name && this.lookup[buffer[x]].name.toLowerCase?this.lookup[buffer[x]].name.toLowerCase():"";
						buffer.id = buffer[x].toLowerCase();
						this.index[buffer.id] = this.lookup[buffer[x]];
						this.index[buffer.name] = this.lookup[buffer[x]];
						this.lookup[buffer[x]]._search = this.createSearchString(this.lookup[buffer[x]]);
					}
				}
			}
			this.$emit("indexed");
		} else {
//			rsSystem.log.warn("Emtpy Search Index");
		}
	}
	
	reindex() {
		this.clearIndex();
		this.indexSet(this.source);
	}
	
	indexSet(dataSet) {
		var x, buffer;
		dataSet = dataSet || this.source;
		if(dataSet) {
			this.source = dataSet;
			if(dataSet instanceof Array) {
				buffer = {};
				for(x=0; x<dataSet.length; x++) {
					if(dataSet[x].id) {
						this.lookup[dataSet[x].id] = dataSet[x];
						this.listing.push(dataSet[x]);
						buffer.name = dataSet[x].name && dataSet[x].name.toLowerCase?dataSet[x].name.toLowerCase():"";
						buffer.id = dataSet[x].id.toLowerCase();
						this.index[buffer.id] = dataSet[x];
						this.index[buffer.name] = dataSet[x];
						dataSet[x]._search = this.createSearchString(dataSet[x]);
					}
				}
			} else if(dataSet instanceof Object) {
				buffer = Object.keys(dataSet);
				for(x=0; x<buffer.length; x++) {
					if(buffer[x] && buffer[x] != "undefined") {
						this.lookup[buffer[x]] = dataSet[buffer[x]];
						this.listing.push(this.lookup[buffer[x]]);
					
						buffer.name = this.lookup[buffer[x]].name && this.lookup[buffer[x]].name.toLowerCase?this.lookup[buffer[x]].name.toLowerCase():"";
						buffer.id = buffer[x].toLowerCase();
						this.index[buffer.id] = this.lookup[buffer[x]];
						this.index[buffer.name] = this.lookup[buffer[x]];
						this.lookup[buffer[x]]._search = this.createSearchString(this.lookup[buffer[x]]);
					}
				}
			}
			this.$emit("indexed");
		} else {
			rsSystem.log.warn("Emtpy Search Index");
		}
	}
	
	/**
	 * 
	 * @method select
	 * @param {Array | Object | String} record Must refine to String IDs.
	 * 		Selection must be in this index.
	 */
	select(record) {
		if(record) {
			var x, buffer;
			if(record instanceof Array || (record.constructor && record.constructor.name === "Array")) {
				for(var x=0; x<record.length; x++) {
					if(record[x]) {
						buffer = record[x].id || record[x];
						if(this.lookup[buffer]) {
							console.log("Selected", this.lookup[buffer]);
							this.selected[buffer] = this.lookup[buffer];
						} else {
							rsSystem.log.warn("Can not select non-indexed record: ", record[x]);
						}
					}
				}
			} else {
				buffer = record.id || record;
				if(this.lookup[buffer]) {
					this.selected[buffer] = this.lookup[buffer];
				} else {
					rsSystem.log.warn("Can not select non-indexed record: ", record);
				}
			}
			this.$emit("selection");
		}
	}

	/**
	 * 
	 * @method unselect
	 * @param {Array | Object | String} record Must refine to String IDs.
	 * 		Selection must be in this index.
	 */
	unselect(record) {
		if(record) {
			var x, buffer;
			if(record instanceof Array || (record.constructor && record.constructor.name === "Array")) {
				for(var x=0; x<record.length; x++) {
					if(record[x]) {
						buffer = record[x].id || record[x];
						if(this.lookup[buffer]) {
							delete(this.selected[buffer]);
						} else {
							rsSystem.log.warn("Can not unselect non-indexed record: ", record[x]);
						}
					}
				}
			} else {
				buffer = record.id || record;
				if(this.lookup[buffer]) {
					delete(this.selected[buffer]);
				} else {
					rsSystem.log.warn("Can not select non-indexed record: ", record);
				}
			}
			this.$emit("selection");
		}
	}
	
	/**
	 * 
	 * @method clearSelection
	 */
	clearSelection() {
		this.unselect(this.selection);
	}
	
	/**
	 * 
	 * @method clearIndex
	 */
	clearIndex() {
		var x, buffer;
		
		this.listing.splice(0, this.listing.length);
		buffer = Object.keys(this.index);
		for(x=0; x<buffer.length; x++){
			delete(this.selected[buffer[x]]);
			delete(this.lookup[buffer[x]]);
			delete(this.index[buffer[x]]);
			delete(this.named[buffer[x]]);
		}
		
		this.source = null;
		this.$emit("indexed");
	}
	
	/**
	 * 
	 * @method toggleSelect
	 * @param {Record} record
	 * @return {Boolean} True if the record is now selected, false if not.
	 */
	toggleSelect(record) {
		if(this.selected[record.id]) {
			delete(this.selected[record.id]);
			return false;
		} else {
			this.selected[record.id] = record;
			return true;
		}
	}

	/**
	 * 
	 * @method isSeelcted
	 * @param {String | Object} record The record or it's ID
	 * @return {Boolean}
	 */
	isSelected(record) {
		return !!this.selected[record.id || record];
	}

	/**
	 * Array of all the IDs that are currently selected.
	 * @property selection
	 * @type Array | String
	 */
	get selection() {
		return Object.keys(this.selected);
	}
	
	/**
	 * 
	 * @method list
	 * @param {String | Object} filter Defines how to filter against the _search string as a string or
	 * 		how to compare object fields based on the properties present on the filter object where the
	 * 		property "null" corresponds to the general _Search string property on the object.
	 * @param {Object} [filter.options] Optional pass the options parameter via this key for single variable invocation.
	 * @param {Boolean} order Sort. True for a-z, False for z-a. Takes priority over options.
	 * @param {Number} limit Limit list results. Applied after sort. Takes priority over options.
	 * @param {Object} [options] Pass in various configurations including order & limit.
	 * 
	 * @param {Boolean} options.order Sort. True for a-z, False for z-a.
	 * @param {Number} options.limit Limit list results. Applied after sort.
	 * @param {Boolean} options.noInstances
	 * @param {Boolean} options.onlyInstances
	 * @param {Boolean} options.sortKey
	 * @param {Array} options.list Specify a list object to populate. If omitted, a new list is created and returned.
	 * @param {Function} options.sorter Custom function that takes `sorter(recordA, recordB, order)` to sort the list
	 * 		of objects.
	 * @param {Boolean} options.secondarySortKey
	 * @param {Object} options.paging Defines paging for the list so that the returned data represents
	 * 		one page.
	 * @param {Number} options.paging.current The current page number (NOT the expected offset).
	 * @param {Number} options.paging.per The number or entries per page.
	 * @param {Number} options.paging._pages This is essentially a hack for passing back the page count calculation, as
	 * 		the list method would return only 1 page always with the current implementation.
	 * @param {Function} options.customFilter Passed a single record to check if the record is valid to include or not.
	 * @parma {Array} list Optionally specified list to use
	 */
	list(filter, order, limit, options, list) {
		var x, keys;
		
		if(filter && filter.options && typeof filter.options === "object") {
			options = filter.options;
			delete(filter.options);
			keys = Object.keys(filter);
			if(keys.length === 1 && filter.null) {
				filter = filter.null;
			}
		} else {
			options = options || {};
		}
		
		if(list === undefined) {
			list = options.list || [];
		}
		order = order===undefined?options.order:order;
		limit = limit===undefined?options.limit:limit;
		
		if(typeof filter === "string") {
			filter = filter.toLowerCase();
			for(x=0; x<this.listing.length; x++) {
				if(this.listing[x]._search.indexOf(filter) !== -1 &&
						(!options.noInstances || !this.listing[x].instanceOf) &&
						(!options.onlyInstances || this.listing[x].instanceOf)) {
					list.push(this.listing[x]);
				}
			}
		} else if(filter /* null is technically an object */ && typeof filter === "object") {
			var y, result;
			keys = keys || Object.keys(filter);
			if(filter.null) {
				filter.null = filter.null.toLowerCase();
			}
			
			for(x=0; x<this.listing.length; x++) {
				result = true;
				for(y=0; result && y<keys.length; y++) {
					if(keys[y] == "null") {
						if(!this.listing[x]._search) {
							this.listing[x]._search = this.createSearchString(this.listing[x]);
						}
						if(this.listing[x]._search.indexOf(filter.null) === -1) {
							result = false;
						}
					} else {
						switch(typeof this.listing[x][keys[y]]) {
							case "string":
								if(filter[keys[y]] instanceof RegExp) {
									result = filter[keys[y]].test(this.listing[x][keys[y]]);
//									console.log("String reg result this.listing[x][" + keys[y] + "] =?= ", filter[keys[y]], " --> " + result);
								} else {
									if(this.listing[x][keys[y]].indexOf(filter[keys[y]]) === -1) {
										result = false;
//										console.log("String index result this.listing[x][" + keys[y] + "] =?= ", filter[keys[y]], " --> " + result);
									}
								}
								break;
							case "boolean":
								if(!!this.listing[x][keys[y]] !== !!filter[keys[y]]) {
									result = false;
//									console.log("Raw Boolean this.listing[x][" + keys[y] + "](" + !!this.listing[x][keys[y]] + ") != " + !!filter[keys[y]]);
								}
								break;
							case "undefined":
							case undefined:
							case "object": // For Null, TODO: Update classes to ensure nulls don't exist. Leverage undefined for cleaner search
								switch(typeof filter[keys[y]]) {
									case "boolean":
										if(!!this.listing[x][keys[y]] !== !!filter[keys[y]]) {
											result = false;
//											console.log("Raw Switch Boolean this.listing[x][" + keys[y] + "](" + !!this.listing[x][keys[y]] + ") != " + !!filter[keys[y]]);
										}
										break;
									default:
										result = false;
								}
								break;
							default:
								if(filter[keys[y]] instanceof Array) {
									result = filter[keys[y]].indexOf(this.listing[x][keys[y]]) !== -1;
								} else if(this.listing[x][keys[y]] != filter[keys[y]]) {
									result = false;
//									console.log("Raw Compare this.listing[x][" + keys[y] + "](" + this.listing[x][keys[y]] + ") != ", filter[keys[y]]);
								}
						}
					}
				}
				if(result && (!options.customFilter || options.customFilter(this.listing[x]))) {
					list.push(this.listing[x]);
				}
			}
		} else {
			list.push.apply(list, this.listing);
		}
		
		if(order !== undefined && options.sortKey) {
			if(options.sorter) {
//				console.log("Custom sort");
				list.sort(options.sorter);
				if(order) {
					list.reverse();
				}
			} else {
//				console.log("Simple sort");
				// TODO Implement sub-sort
				var forward = order?1:-1,
					reverse = order?-1:1;
				list.sort(function(a, b) {
					a = a[options.sortKey] || "";
					b = b[options.sortKey] || "";
					return a < b?reverse:(a > b?forward:0);
				});
			}
		}
		
		if(limit || options.limit) {
			list.splice(0, parseInt(limit || options.limit));
		}
		
		if(options.paging) {
			options.paging._pages = parseInt(Math.ceil(list.length / options.paging.per));
			list = list.splice(options.paging.current * options.paging.per, options.paging.per);
		}
		
		return list;
	}
	
	createSearchString(object) {
		var string = "";
		if(object.name && object.name.toLowerCase) {
			string += object.name.toLowerCase(); 
		}
		if(object.id) {
			string += object.id; 
		}
		if(object.location) {
			string += object.location; 
		}
		if(object.origin) {
			string += object.origin; 
		}
		if(object.owner) {
			string += object.owner; 
		}
		if(object.backstory) {
			string += object.backstory.toLowerCase(); 
		}
		if(object.description) {
			string += object.description.toLowerCase(); 
		}
		if(object.note) {
			string += object.note.toLowerCase(); 
		}
		if(object.hiddenState) {
			string += "?"; 
		}
		return string;
	}
	
	/**
	 * 
	 * @method get
	 * @param {String} key The ID or Name of the object that should be retrieved.
	 * @return {Object} An indexed item matching the key.
	 */
	get(key) {
		return this.lookup[key] || this.named[key];
	}
	
	/**
	 * 
	 * @method indexItem
	 * @param {Object} item The object to add to the index. Uses "id" and "name".
	 */
	indexItem(item) {
		var x, buffer;
		if(item instanceof Array || (item.constructor && item.constructor.name === "Array")) {
			for(x=0; x<item.length; x++) {
				if(item[x].id) {
					if(!this.lookup[item[x].id]) {
						this.listing.push(item[x]);
						this.lookup[item[x].id] = item[x];
						this.named[item[x].name] = item[x];
						this.index[item[x].name] = item[x];
						this.index[item[x].id] = item[x];
					} else {
						Object.assign(this.lookup[item[x].id], item[x]);
					}
					this.lookup[item[x].id]._search = this.createSearchString(this.lookup[item[x].id]);
				} else {
					console.warn("Unidentified Search Index Update[Array]: ", item[x]);
				}
			}
			this.$emit("indexed");
//		} else if(item instanceof Object || (item.constructor && item.constructor.name === "Object")) {
//			buffer = Object.keys(item);
//			for(x=0; x<buffer.length; x++) {
//				if(item[buffer[x]].id) {
//					if(!this.lookup[item[buffer[x]].id]) {
//						this.listing.push(item[buffer[x]]);
//						this.lookup[item[buffer[x]].id] = item[buffer[x]];
//						this.named[item[buffer[x]].name] = item[buffer[x]];
//						this.index[item[buffer[x]].name] = item[buffer[x]];
//						this.index[item[buffer[x]].id] = item[buffer[x]];
//					} else {
//						Object.assign(this.lookup[item[buffer[x]].id], item[buffer[x]]);
//					}
//					this.lookup[item[buffer[x]].id]._search = this.createSearchString(this.lookup[item[buffer[x]].id]);
//				} else {
//					console.warn("Unidentified Search Index Update[Object]: ", item[buffer[x]]);
//				}
//			}
//			this.$emit("indexed");
		} else {
			if(item.id) {
				if(!this.lookup[item.id]) {
					this.listing.push(item);
					this.lookup[item.id] = item;
					this.named[item.name] = item;
					this.index[item.name] = item;
					this.index[item.id] = item;
				} else {
					Object.assign(this.lookup[item.id], item);
				}
				this.lookup[item.id]._search = this.createSearchString(this.lookup[item.id]);
				this.$emit("indexed");
			} else {
				console.warn("Unidentified Search Index Update: ", item);
			}
		}
	}

	/**
	 * 
	 * @method unindexItem
	 * @param {String | Object} item The object to remove from the index. MUST have an id.
	 */
	unindexItem(item) {
		item = item.id || item;
		if(item && this.lookup[item]) {
			this.listing.splice(this.listing.indexOf(this.lookup[item]), 1);
			delete(this.named[this.lookup[item].name]);
			delete(this.index[this.lookup[item].name]);
			delete(this.lookup[item]);
			delete(this.index[item]);
			this.lookup[item.id] = item;
			this.named[item.name] = item;
			this.index[item.name] = item;
			this.index[item.id] = item;
			this.$emit("indexed");
		}
	}
}
