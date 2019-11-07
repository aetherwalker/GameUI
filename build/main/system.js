// Assist function for Reactive Component Printing
var _p = function(x) {return JSON.parse(JSON.stringify(x));};

/**
 * 
 * Specifically loaded last to trigger initialization.
 * @class App
 * @constructor
 * @module Main
 * @static
 */
rsSystem.App = new Vue({
	"el": "#game",
	"data": function() {
		return {
			"settings": {}
		};
	},
	"mounted": function() {
		rsSystem.Router.addRoutes([{
			"path": "/",
			"component": rsSystem.components.RSHome,
			"children": [{
				"path": "dashboard",
				"component": rsSystem.components.RSSWDashboard,
				"children": [{
					"path": "character",
					"component": rsSystem.components.RSSWCharacter,
					"children": [{
						"path": ":oid",
						"component": rsSystem.components.RSSWCharacter
					}]
				}, {
					"path": "ship",
					"component": rsSystem.components.RSSWShip,
					"children": [{
						"path": ":oid",
						"component": rsSystem.components.RSSWShip
					}]
				}, {
					"path": "item",
					"component": rsSystem.components.RSSWItem,
					"children": [{
						"path": ":oid",
						"component": rsSystem.components.RSSWItem
					}]
				}]
			}, {
				"path": "base",
				"component": rsSystem.components.RSSWBase,
				"children": [{
					"path": ":oid",
					"component": rsSystem.components.RSSWBase
				}]
			}, {
				"path": "inventory",
				"component": rsSystem.components.RSSWInventory,
				"children": [{
					"path": ":oid",
					"component": rsSystem.components.RSSWInventory
				}]
			}, {
				"path": "hangar",
				"component": rsSystem.components.RSSWHangar,
				"children": [{
					"path": ":oid",
					"component": rsSystem.components.RSSWHangar
				}]
			}, {
				"path": "locality",
				"component": rsSystem.components.RSSWLocality,
				"children": [{
					"path": ":oid",
					"component": rsSystem.components.RSSWLocality
				}]
			}, {
				"path": "storage",
				"component": rsSystem.components.RSSWStorage,
				"children": [{
					"path": ":oid",
					"component": rsSystem.components.RSSWStorage
				}]
			}, {
				"path": "journal",
				"component": rsSystem.components.RSSWJournal,
				"children": [{
					"path": ":oid",
					"component": rsSystem.components.RSSWJournal
				}]
			}, {
				"path": "map",
				"component": rsSystem.components.RSSWMap,
				"children": [{
					"path": ":oid",
					"component": rsSystem.components.RSSWMap
				}]
			}, {
				"path": "universe",
				"component": rsSystem.components.RSSWUniverse,
				"children": [{
					"path": "character",
					"component": rsSystem.components.RSSWCharacter,
					"children": [{
						"path": ":oid",
						"component": rsSystem.components.RSSWCharacter
					}]
				}, {
					"path": "ship",
					"component": rsSystem.components.RSSWShip,
					"children": [{
						"path": ":oid",
						"component": rsSystem.components.RSSWShip
					}]
				}, {
					"path": "item",
					"component": rsSystem.components.RSSWItem,
					"children": [{
						"path": ":oid",
						"component": rsSystem.components.RSSWItem
					}]
				}]
			}, {
				"path": "nouns",
				"component": rsSystem.components.RSNounControls
			}, {
				"path": "ship",
				"component": rsSystem.components.RSSWShip
			}, {
				"path": "about",
				"component": rsSystem.components.RSAbout
			}]
		}]);
	},
	"router": rsSystem.Router,
	"props": {
	},
	"created": function() {
		var rssys = this;
		
	}
});
