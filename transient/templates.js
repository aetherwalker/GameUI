var Templify = {};
Templify.install = function(Vue, options) {
	options = options || {};
	options.name = options.name || "templified";
	Vue[options.name] = function(name) {
		switch(name) {
			case "components/connect.html": return "<div class=\"rs-component connect-component\">\r\n\t<div class=\"heading\">\r\n\t\t<span class=\"heading-icon\"></span>\r\n\t\t<span>Login</span>\r\n\t</div>\r\n\t<div class=\"fields\">\r\n\t\t<label class=\"full\">\r\n\t\t\t<span class=\"field-text\">Username</span>\r\n\t\t\t<input type=\"text\" v-model=\"store.username\" />\r\n\t\t</label>\r\n\t\t<label class=\"full\">\r\n\t\t\t<span class=\"field-text\">Address</span>\r\n\t\t\t<input type=\"text\" v-model=\"store.address\" />\r\n\t\t</label>\r\n\t\t<div class=\"actions\">\r\n\t\t\t<button class=\"primary-action\" v-on:click=\"connect()\">\r\n\t\t\t\t<span class=\"action-icon fas fa-sign-in\"></span>\r\n\t\t\t\t<span class=\"action-text\">Connect</span>\r\n\t\t\t</button>\r\n\t\t\t<button class=\"toggle-action\" v-on:click=\"store.secure = !store.secure\">\r\n\t\t\t\tSecure?\r\n\t\t\t\t<span class=\"far\" :class=\"store.secure?'fa-check-square':'fa-square'\"></span>\r\n\t\t\t</button>\r\n\t\t</div>\r\n\t</div>\r\n</div>";
			case "components/field/autocomplete.html": return "<div class=\"rs-field rs-autocomplete\">\r\n\t<input class=\"autocomplete-field\" type=\"text\" v-model=\"modeling\" />\r\n\t<div class=\"corpus\" :class=\"{'open':matched.length}\">\r\n\t\t<div class=\"option\" v-for=\"option in matched\">\r\n\t\t\t{{option}}\r\n\t\t</div>\r\n\t</div>\r\n</div>\r\n";
			case "components/field.html": return "";
			case "components/gyroscope.html": return "";
			case "components/info.html": return "<div class=\"system-component system-info\" :class=\"open?'opened':'closed'\">\r\n\t<div class=\"main-bar\">\r\n\t\t<div class=\"titling\">\r\n\t\t\t<span v-if=\"viewing && viewing.icon\" class=\"icon\" :class=\"viewing.icon\"></span>\r\n\t\t\t<span class=\"text\">{{viewing?viewing.name:\"Information\"}}</span>\r\n\t\t</div>\r\n\t\t<button class=\"control close\" v-on:click=\"closeInfo()\">\r\n\t\t\t<span class=\"fas fa-times\"></span>\r\n\t\t</button>\r\n\t</div>\r\n\t\r\n\t<rs-object-info v-if=\"viewing\" v-on:click=\"processRequest($event)\" :record=\"viewing\" :universe=\"universe\"></rs-object-info>\r\n</div>\r\n";
			case "components/info/render/basic.html": return "<div class=\"general-information\">\r\n\t<div v-if=\"description\" v-html=\"description\"></div>\r\n\t\r\n\t<div class=\"properties\">\r\n\t\t<div class=\"property\" v-for=\"property in keys\" v-if=\"visible(property, record[property])\">\r\n\t\t\t<span class=\"key\">{{prettifyPropertyName(property)}}</span>\r\n\t\t\t<span class=\"divide\">:</span>\r\n\t\t\t<span class=\"value\">{{prettifyPropertyValue(property, record[property])}}</span>\r\n\t\t</div>\r\n\t</div>\r\n</div>";
			case "components/menu.html": return "<div class=\"system-component system-menu\" :class=\"getClassSettings()\">\r\n\t<div class=\"navigation\">\r\n\t\t<div class=\"prefixed navigation-item\" v-for=\"navItem in navigationItems\" v-if=\"isActive(navItem)\" :class=\"$router.currentRoute.path.startsWith(navItem.highlight)?'current':''\">\r\n\t\t\t<router-link class=\"navigation-contents\" :to=\"navItem.path\" :key=\"navItem.path\">\r\n\t\t\t\t<span class=\"nav-icon\" :class=\"navItem.icon\"></span>\r\n\t\t\t\t<span class=\"nav-label\" :class=\"navItem.labelClass\">{{navItem.label}}</span>\r\n\t\t\t</router-link>\r\n\t\t</div>\r\n\t\t<div class=\"separator\"></div>\r\n\t\t<div class=\"prefixed navigation-item\" v-for=\"navItem in generalItems\" v-if=\"isActive(navItem)\">\r\n\t\t\t<button class=\"prefixed navigation-contents\"v-if=\"navItem.action\" v-on:click=\"processNavigation(navItem)\">\r\n\t\t\t\t<span class=\"nav-icon\" :class=\"navItem.icon\"></span>\r\n\t\t\t\t<span class=\"nav-label\" :class=\"navItem.labelClass\">{{navItem.label}}</span>\r\n\t\t\t</button>\r\n\t\t</div>\r\n\t</div>\r\n</div>\r\n";
			case "components/nouns.html": return "<div class=\"rs-component component-nouns\">\r\n\t<div class=\"selection\">\r\n\t\t<label class=\"\">\r\n\t\t\tNoun:\r\n\t\t\t<select v-model=\"state.current\">\r\n\t\t\t\t<option v-for=\"type in nouns\" :value=\"type\">{{type}}</option>\r\n\t\t\t</select>\r\n\t\t</label>\r\n\t</div>\r\n\t\r\n\t<div class=\"sourcing\">\r\n\t\t<label class=\"\">\r\n\t\t\tCopy:\r\n\t\t\t<select v-model=\"copy\">\r\n\t\t\t\t<option v-for=\"(object, id) in universe.nouns[state.current]\" :value=\"id\">{{id}}</option>\r\n\t\t\t</select>\r\n\t\t</label>\r\n\t</div>\r\n\t\r\n\t<div class=\"building\">\r\n\t\t<textarea v-model=\"rawValue\">\r\n\t\t</textarea>\r\n\t</div>\r\n\t\r\n\t<div class=\"files\">\r\n\t\t<div class=\"property\" v-for=\"property in extra_properties\">\r\n\t\t\t<div class=\"autocompletion\">\r\n\t\t\t\t<rs-autocomplete v-model=\"property.key\" :corpus=\"propertyKeys\"></rs-autocomplete>\r\n\t\t\t</div>\r\n\t\t</div>\r\n\t</div>\r\n\t\r\n\t\r\n\t<div class=\"actions\">\r\n\t\t<button class=\"primary-action\" v-on:click=\"modify()\" :disabled=\"!isValid\">\r\n\t\t\t<span class=\"action-icon fas fa-cloud-upload\"></span>\r\n\t\t\t<span class=\"action-text\">Upload</span>\r\n\t\t</button>\r\n\t</div>\r\n</div>";
			case "components/rssw/career/display.html": return "<div class=\"career-information\">\r\n\t<div v-if=\"description\" v-html=\"description\"></div>\r\n\t<div class=\"\">\r\n\t\t<span>Classification:</span>\r\n\t\t<span>{{record.classification}}</span>\r\n\t</div>\r\n</div>\r\n";
			case "components/rssw/character/board.html": return "<div class=\"rs-component rssw component-character-board\">\r\n\t<div class=\"container flow-h inline\">\r\n\t\t<div class=\"stat soak flow-v inline\">\r\n\t\t\t<div class=\"label\">\r\n\t\t\t\t<span class=\"fas fa-shield\"></span>\r\n\t\t\t\t<span>Soak</span>\r\n\t\t\t</div>\r\n\t\t\t<div class=\"bubble solo flow-h center\">\r\n\t\t\t\t<div class=\"value\">\r\n\t\t\t\t\t<div class=\"display\">\r\n\t\t\t\t\t\t{{soak}}\r\n\t\t\t\t\t\t<!--\r\n\t\t\t\t\t\t<select v-model=\"soak\">\r\n\t\t\t\t\t\t\t<option v-for=\"value in lowValues\" :value=\"value\">{{value}}</option>\r\n\t\t\t\t\t\t</select>\r\n\t\t\t\t\t\t-->\r\n\t\t\t\t\t</div>\r\n\t\t\t\t</div>\r\n\t\t\t</div>\r\n\t\t</div>\r\n\t\t\r\n\t\t<div class=\"stat wounds flow-v inline\">\r\n\t\t\t<div class=\"label\">\r\n\t\t\t\t<span class=\"fas fa-heartbeat\"></span>\r\n\t\t\t\t<span>Wounds</span>\r\n\t\t\t</div>\r\n\t\t\t<div class=\"bubble pair flow-h inline\">\r\n\t\t\t\t<div class=\"value flow-v\">\r\n\t\t\t\t\t<div class=\"display\">\r\n\t\t\t\t\t\t<select v-model.number=\"wounds\">\r\n\t\t\t\t\t\t\t<option v-for=\"value in highValues\" v-if=\"value <= wounds_max\" :value=\"value\">{{value}}</option>\r\n\t\t\t\t\t\t</select>\r\n\t\t\t\t\t</div>\r\n\t\t\t\t</div>\r\n\t\t\t\t<div class=\"value paired flow-v inline\">\r\n\t\t\t\t\t<div class=\"display\">\r\n\t\t\t\t\t\t{{wounds_max}}\r\n\t\t\t\t\t</div>\r\n\t\t\t\t</div>\r\n\t\t\t</div>\r\n\t\t</div>\r\n\t\t\r\n\t\t<div class=\"stat wounds flow-v inline\">\r\n\t\t\t<div class=\"label\">\r\n\t\t\t\t<span class=\"fas fa-brain\"></span>\r\n\t\t\t\t<span>Strain</span>\r\n\t\t\t</div>\r\n\t\t\t<div class=\"bubble pair flow-h inline\">\r\n\t\t\t\t<div class=\"value flow-v\">\r\n\t\t\t\t\t<div class=\"display\">\r\n\t\t\t\t\t\t<select v-model.number=\"strain\">\r\n\t\t\t\t\t\t\t<option v-for=\"value in highValues\" v-if=\"value <= strain_max\" :value=\"value\">{{value}}</option>\r\n\t\t\t\t\t\t</select>\r\n\t\t\t\t\t</div>\r\n\t\t\t\t</div>\r\n\t\t\t\t<div class=\"value paired flow-v inline\">\r\n\t\t\t\t\t<div class=\"display\">\r\n\t\t\t\t\t\t{{strain_max}}\r\n\t\t\t\t\t</div>\r\n\t\t\t\t</div>\r\n\t\t\t</div>\r\n\t\t</div>\r\n\t\t\r\n\t\t<div class=\"stat soak flow-v inline\">\r\n\t\t\t<div class=\"label\">\r\n\t\t\t\t<span class=\"fas fa-user-shield\"></span>\r\n\t\t\t\t<span>Ranged</span>\r\n\t\t\t</div>\r\n\t\t\t<div class=\"bubble solo flow-h center\">\r\n\t\t\t\t<div class=\"value\">\r\n\t\t\t\t\t<div class=\"display\">\r\n\t\t\t\t\t\t{{defense_range}}\r\n\t\t\t\t\t\t<!--\r\n\t\t\t\t\t\t<select v-model=\"defense_range\">\r\n\t\t\t\t\t\t\t<option v-for=\"value in lowValues\" :value=\"value\">{{value}}</option>\r\n\t\t\t\t\t\t</select>\r\n\t\t\t\t\t\t-->\r\n\t\t\t\t\t</div>\r\n\t\t\t\t</div>\r\n\t\t\t</div>\r\n\t\t</div>\r\n\t\t\r\n\t\t<div class=\"stat soak flow-v inline\">\r\n\t\t\t<div class=\"label\">\r\n\t\t\t\t<span class=\"fas fa-user-shield\"></span>\r\n\t\t\t\t<span>Melee</span>\r\n\t\t\t</div>\r\n\t\t\t<div class=\"bubble solo flow-h center\">\r\n\t\t\t\t<div class=\"value\">\r\n\t\t\t\t\t<div class=\"display\">\r\n\t\t\t\t\t\t{{defense_melee}}\r\n\t\t\t\t\t\t<!--\r\n\t\t\t\t\t\t<select v-model=\"defense_melee\">\r\n\t\t\t\t\t\t\t<option v-for=\"value in lowValues\" :value=\"value\">{{value}}</option>\r\n\t\t\t\t\t\t</select>\r\n\t\t\t\t\t\t-->\r\n\t\t\t\t\t</div>\r\n\t\t\t\t</div>\r\n\t\t\t</div>\r\n\t\t</div>\r\n\t</div>\r\n</div>\r\n";
			case "components/rssw/character/display.html": return "<div class=\"character-information\">\r\n\t<div class=\"flow-h\">\r\n\t\t<div class=\"stat brawn flow-v centered\">\r\n\t\t\t<span>Brawn</span>\r\n\t\t\t<span>{{record.brawn}}</span>\r\n\t\t</div>\r\n\t\t<div class=\"stat agility flow-v centered\">\r\n\t\t\t<span>Agility</span>\r\n\t\t\t<span>{{record.agility}}</span>\r\n\t\t</div>\r\n\t</div>\r\n</div>\r\n";
			case "components/rssw/character/info.html": return "<div class=\"rs-component rssw component-character-info\">\r\n\t<div class=\"property name\">\r\n\t\t<span class=\"icon fad fa-user\"></span>\r\n\t\t<span class=\"name\">{{character.name}}</span>\r\n\t\t<span>( {{character.age}} Cycle old {{getSex(character)}} )</span>\r\n\t\t<button class=\"recalculate\" v-on:click=\"updateCharacter()\">\r\n\t\t\t<span class=\"far fa-sync\" :class=\"calculating?'fa-spin':''\"></span>\r\n\t\t</button>\r\n\t</div>\r\n\t<div class=\"property species\">\r\n\t\t<span class=\"icon fad fa-bug rot45\"></span>\r\n\t\t<span class=\"label\">Species:</span>\r\n\t\t<button v-for=\"(archetype, $index) in careers\" class=\"value\" v-on:click=\"showInfo(race)\">\r\n\t\t\t{{race?race.name:\"No Species\"}}\r\n\t\t</button>\r\n\t</div>\r\n\t<div class=\"property career\">\r\n\t\t<span class=\"icon fad fa-user-hard-hat\"></span>\r\n\t\t<span class=\"label\">Careers:</span>\r\n\t\t<button v-for=\"(archetype, $index) in careers\" class=\"archetype\" v-on:click=\"showInfo(archetype)\">\r\n\t\t\t<span class=\"divide\" v-if=\"$index !== 0\">, </span>\r\n\t\t\t<span class=\"value\">{{archetype.name}}</span>\r\n\t\t</button>\r\n\t</div>\r\n\t<div class=\"property speciailization\">\r\n\t\t<span class=\"icon fad fa-gavel\"></span>\r\n\t\t<span class=\"label\">Specializations:</span>\r\n\t\t<button v-for=\"(archetype, $index) in specializations\" class=\"archetype\" v-on:click=\"showInfo(archetype)\">\r\n\t\t\t<span class=\"divide\" v-if=\"$index !== 0\">, </span>\r\n\t\t\t<span class=\"value\">{{archetype.name}}</span>\r\n\t\t</button>\r\n\t</div>\r\n\t<div class=\"property ability\">\r\n\t\t<span class=\"icon fad fa-jedi\"></span>\r\n\t\t<span class=\"label\">Abilities:</span>\r\n\t\t<button v-for=\"(ability, $index) in abilities\" class=\"ability\" v-on:click=\"showInfo(ability)\">\r\n\t\t\t<span class=\"divide\" v-if=\"$index !== 0\">,</span>\r\n\t\t\t<span class=\"value\">{{ability.name}}</span>\r\n\t\t</button>\r\n\t</div>\r\n\t<div class=\"property items\">\r\n\t\t<span class=\"icon fad fa-backpack\"></span>\r\n\t\t<span class=\"label\">Items:</span>\r\n\t\t<button class=\"ability\" v-on:click=\"showInfo(character.inventory)\">\r\n\t\t\t<span class=\"value\">Inventory</span>\r\n\t\t</button>\r\n\t\t<button class=\"ability\" v-on:click=\"showInfo(character.loadout)\">\r\n\t\t\t<span class=\"divide\">,</span>\r\n\t\t\t<span class=\"value\">Loadout</span>\r\n\t\t</button>\r\n\t</div>\r\n\t<div class=\"property credits\">\r\n\t\t<span class=\"icon fad fa-coins\"></span>\r\n\t\t<span class=\"label\">Credits:</span>\r\n\t\t<input class=\"experience\" type=\"number\" v-model.number=\"credits\" v-on:change=\"changed('credits', credits)\"/>\r\n\t</div>\r\n\t<div class=\"property level\">\r\n\t\t<span class=\"icon fad fa-user-plus\"></span>\r\n\t\t<span class=\"label\">Experience:</span>\r\n\t\t<input class=\"experience\" type=\"number\" v-model.number=\"experience\" v-on:change=\"changed('xp', experience)\"/>\r\n\t</div>\r\n\t<div class=\"property description\">\r\n\t\t<span class=\"icon fas fa-info-square\"></span>\r\n\t\t<span class=\"label\">Description:</span>\r\n\t\t<div class=\"text-container\">\r\n\t\t\t<textarea class=\"description\" v-model=\"description\" v-on:change=\"changed('description', description)\"></textarea>\r\n\t\t</div>\r\n\t</div>\r\n</div>\r\n";
			case "components/rssw/character/skills/section.html": return "\r\n<table>\r\n\t<tr class=\"skill\" v-for=\"skill in skills\" v-if=\"isVisible(skill)\">\r\n\t\t<td class=\"name aligned-right flow-v\">\r\n\t\t\t<span class=\"naming\">\r\n\t\t\t\t<span v-if=\"enhancedSkill(skill)\" class=\"rs-green fas fa-check\"></span>\r\n\t\t\t\t{{skill.name}}\r\n\t\t\t</span>\r\n\t\t\t<span class=\"naming base\">\r\n\t\t\t\t{{skill.base.capitalize()}}\r\n\t\t\t</span>\r\n\t\t</td>\r\n\t\t<td class=\"icon\">\r\n\t\t\t<span :class=\"skill.icon\"></span>\r\n\t\t</td>\r\n\t\t<td class=\"stats\">\r\n\t\t\t<div class=\"level\">\r\n\t\t\t\t<div class=\"level-block\" v-for=\"level in levelBars\" :class=\"{'acquired':level < character[skill.propertyKey], 'first':level === 0}\"></div>\r\n\t\t\t</div>\r\n\t\t\t<div class=\"roll\">\r\n\t\t\t\t<span class=\"dice\" v-for=\"die in getDice(skill)\" :class=\"die\"></span>\r\n\t\t\t</div>\r\n\t\t</td>\r\n\t</tr>\r\n</table>";
			case "components/rssw/character/skills.html": return "<div class=\"rs-component rssw component-character-skills flow-v\" :class=\"{'no-names':state.hideNames}\">\r\n\t<div class=\"filter flow-v inline\">\r\n\t\t<label>\r\n\t\t\t<span>Filter Skills</span>\r\n\t\t\t<input type=\"text\" v-model=\"state.search\" />\r\n\t\t</label>\r\n\t\t<label>\r\n\t\t\t<span>Hide Names</span>\r\n\t\t\t<input type=\"checkbox\" v-model=\"state.hideNames\" />\r\n\t\t</label>\r\n\t\t<div class=\"leveling skill\">\r\n\t\t\t<label>\r\n\t\t\t\t<span>Level Skill</span>\r\n\t\t\t\t<select v-model=\"leveling\">\r\n\t\t\t\t\t<option value=\"\">[ Select a Skill ]</option>\r\n\t\t\t\t\t<option v-for=\"skill in levelSkills\" :value=\"skill.id\">{{skill.name}}</option>\r\n\t\t\t\t</select>\r\n\t\t\t</label>\r\n\t\t\t<button class=\"level up\" v-on:click=\"levelSkill(leveling, 1)\" v-if=\"leveling\" :disabled=\"getXPCost(leveling, 1) > character.xp\">\r\n\t\t\t\t<span class=\"fas fa-plus-square\"></span>\r\n\t\t\t\t<span>XP: {{getXPCost(leveling, 1)}}</span>\r\n\t\t\t</button>\r\n\t\t\t<button class=\"level down\" v-on:click=\"levelSkill(leveling, -1)\" v-if=\"leveling\">\r\n\t\t\t\t<span class=\"fas fa-minus-square\"></span>\r\n\t\t\t\t<span>XP: {{getXPCost(leveling, -1)}}</span>\r\n\t\t\t</button>\r\n\t\t</div>\r\n\t</div>\r\n\t\r\n\t<div class=\"skill-container flow-h\">\r\n\t\t<div class=\"skill-container\">\r\n\t\t\t<div class=\"skill-list general flow-v\">\r\n\t\t\t\t<h3 class=\"titling\">\r\n\t\t\t\t\t<span class=\"fas fa-tools\"></span>\r\n\t\t\t\t\t<span>General Skills</span>\r\n\t\t\t\t</h3>\r\n\t\t\t\t<rssw-skill-section :universe=\"universe\" :character=\"character\" :skills=\"skillStatsSections.general\" :state=\"state\" :user=\"user\"></rssw-skill-section>\r\n\t\t\t</div>\r\n\t\t</div>\r\n\t\t\r\n\t\t<div class=\"skill-container\">\r\n\t\t\t<div class=\"skill-list combat flow-v\">\r\n\t\t\t\t<h3 class=\"titling\">\r\n\t\t\t\t\t<span class=\"fas fa-swords\"></span>\r\n\t\t\t\t\t<span>Combat Skills</span>\r\n\t\t\t\t</h3>\r\n\t\t\t\t<rssw-skill-section :universe=\"universe\" :character=\"character\" :skills=\"skillStatsSections.combat\" :state=\"state\" :user=\"user\"></rssw-skill-section>\r\n\t\t\t</div>\r\n\t\t\t\r\n\t\t\t<div class=\"skill-list ship flow-v\">\r\n\t\t\t\t<h3 class=\"titling\">\r\n\t\t\t\t\t<span class=\"fad fa-location-arrow\"></span>\r\n\t\t\t\t\t<span>Piloting Skills</span>\r\n\t\t\t\t</h3>\r\n\t\t\t\t<rssw-skill-section :universe=\"universe\" :character=\"character\" :skills=\"skillStatsSections.piloting\" :state=\"state\" :user=\"user\"></rssw-skill-section>\r\n\t\t\t</div>\r\n\t\t\t\r\n\t\t\t<div class=\"skill-list knowledge flow-v\">\r\n\t\t\t\t<h3 class=\"titling\">\r\n\t\t\t\t\t<span class=\"fas fa-brain\"></span>\r\n\t\t\t\t\t<span>Knowledge Skills</span>\r\n\t\t\t\t</h3>\r\n\t\t\t\t<rssw-skill-section :universe=\"universe\" :character=\"character\" :skills=\"skillStatsSections.knowledge\" :state=\"state\" :user=\"user\"></rssw-skill-section>\r\n\t\t\t</div>\r\n\t\t</div>\r\n\t</div>\r\n</div>\r\n";
			case "components/rssw/character/stats.html": return "<div class=\"rs-component rssw component-character-stats\">\r\n\t<div class=\"stats\">\r\n\t\t<div class=\"stat\" v-for=\"stat in characterStats\" :key=\"stat\" v-on:click=\"leveling = stat\">\r\n\t\t\t<div class=\"bubble\">\r\n\t\t\t\t<div class=\"value\">\r\n\t\t\t\t\t{{character[stat]}}\r\n\t\t\t\t</div>\r\n\t\t\t</div>\r\n\t\t\t<div class=\"label\">\r\n\t\t\t\t{{entityStats[stat].name}}\r\n\t\t\t</div>\r\n\t\t</div>\r\n\t</div>\r\n\t<div class=\"leveling stat\">\r\n\t\t<label>\r\n\t\t\t<span>Level Stat</span>\r\n\t\t\t<select v-model=\"leveling\">\r\n\t\t\t\t<option value=\"\">[ Select a Stat ]</option>\r\n\t\t\t\t<option v-for=\"stat in characterStats\" :value=\"stat\">{{entityStats[stat].name}}</option>\r\n\t\t\t</select>\r\n\t\t</label>\r\n\t\t<button class=\"level up\" v-on:click=\"levelStat(leveling, 1)\" v-if=\"leveling\" :disabled=\"getXPCost(leveling, 1) > character.xp\">\r\n\t\t\t<span class=\"fas fa-plus-square\"></span>\r\n\t\t\t<span>XP: {{getXPCost(leveling, 1)}}</span>\r\n\t\t</button>\r\n\t\t<button class=\"level down\" v-on:click=\"levelStat(leveling, -1)\" v-if=\"leveling\">\r\n\t\t\t<span class=\"fas fa-minus-square\"></span>\r\n\t\t\t<span>XP: {{getXPCost(leveling, -1)}}</span>\r\n\t\t</button>\r\n\t</div>\r\n</div>\r\n";
			case "components/rssw/ship/stats.html": return "<div class=\"rs-component rssw component-ship-stats\">\r\n\t<div class=\"picture\">\r\n\t\t<img :src=\"'/images/rssw/ships/' + ship.profile\" />\r\n\t</div>\r\n\t<div class=\"information flow-h\">\r\n\t\t<div class=\"skill\">\r\n\t\t\t<span v-if=\"!pilot\" class=\"fas fa-ban\"></span>\r\n\t\t\t<span v-if=\"pilot\">{{pilot.skill}}</span>\r\n\t\t</div>\r\n\t\t<div class=\"container flow-v\">\r\n\t\t\t<div class=\"pilot\">\r\n\t\t\t\t<span v-if=\"!pilot\" class=\"fas fa-ban\"></span>\r\n\t\t\t\t<span v-if=\"pilot\">{{pilot.name}}</span>\r\n\t\t\t</div>\r\n\t\t\t<div class=\"name\">\r\n\t\t\t\t<span>{{ship.name}}</span>\r\n\t\t\t</div>\r\n\t\t</div>\r\n\t\t<div class=\"alliance\">\r\n\t\t\t<span v-if=\"!pilot\" class=\"fab fa-rebel\"></span>\r\n\t\t\t<span v-if=\"pilot\" class=\"fab fa-empire\"></span>\r\n\t\t</div>\r\n\t</div>\r\n\t<div class=\"data flow-h\">\r\n\t\t<div class=\"stats flow-v\">\r\n\t\t\t<div class=\"stat flow-h\" v-for=\"stat in shipStatList\" :key=\"stat.id\" :class=\"stat.class\">\r\n\t\t\t\t<span class=\"icon-bubble\">\r\n\t\t\t\t\t<span class=\"icon\" :class=\"stat.icon\"></span>\r\n\t\t\t\t</span>\r\n\t\t\t\t<span class=\"value\">{{ship[stat.id]}}</span>\r\n\t\t\t</div>\r\n\t\t</div>\r\n\t\t<div class=\"details flow-v\">\r\n\t\t\t<div class=\"ability\">\r\n\t\t\t\t<p v-if=\"!pilot || !ability\">{{ship.description}}</p>\r\n\t\t\t\t<p v-if=\"pilot && ability\">{{ability.description}}</p>\r\n\t\t\t</div>\r\n\t\t\t<div class=\"abilities\">\r\n\t\t\t\t<div class=\"ability\" v-for=\"ability in ship.abilities\">\r\n\t\t\t\t</div>\r\n\t\t\t</div>\r\n\t\t</div>\r\n\t</div>\r\n\t<div class=\"mounts flow-h\">\r\n\t\t<div class=\"icon-bubble\">\r\n\t\t\t<span class=\"icon\" v-if=\"ship.icon\" :class=\"ship.icon\"></span>\r\n\t\t</div>\r\n\t\t<div class=\"slots flow-h\">\r\n\t\t\t<div class=\"slot\" v-for=\"mount in ship.slot\">\r\n\t\t\t\t{{mount}}\r\n\t\t\t</div>\r\n\t\t</div>\r\n\t\t<div class=\"points\">\r\n\t\t\t<span class=\"fad fa-coin rs-gray\"></span>\r\n\t\t\t<span>{{points}}</span>\r\n\t\t</div>\r\n\t</div>\r\n</div>\r\n";
			case "components/table.html": return "<div class=\"system-component table-index\">\r\n\t<div class=\"table-display\">\r\n\t\t<div class=\"table-controls\">\r\n\t\t\t<div class=\"filtering\">\r\n\t\t\t\t<input type=\"text\" v-model=\"state.filter.null\" />\r\n\t\t\t\t<span class=\"search-icon fas fa-search\"></span>\r\n\t\t\t</div>\r\n\t\t\t<div class=\"controls\">\r\n\t\t\t\t<div class=\"selections\" v-if=\"index.selection.length\">\r\n\t\t\t\t\t<div v-for=\"control in controls\">\r\n\t\t\t\t\t\t{{control}}\r\n\t\t\t\t\t</div>\r\n\t\t\t\t</div>\r\n\t\t\t\t<button class=\"selections clear\" v-if=\"index.selection.length\" v-on:click=\"clearSelection()\">\r\n\t\t\t\t\t<span class=\"far fa-ban\"></span>\r\n\t\t\t\t</button>\r\n\t\t\t\t<button class=\"selections all\" v-if=\"index.selection.length != index.listing.length\" v-on:click=\"allSelection()\">\r\n\t\t\t\t\t<span class=\"far fa-check-square\"></span>\r\n\t\t\t\t</button>\r\n\t\t\t\t<button class=\"selections info\" v-if=\"index.selection.length\" v-on:click=\"infoSelection(index.selection[index.selection.length-1])\">\r\n\t\t\t\t\t<span class=\"far fa-journal-whills\"></span>\r\n\t\t\t\t</button>\r\n\t\t\t</div>\r\n\t\t</div>\r\n\r\n\t\t<div class=\"table-container\">\r\n\t\t\t<table class=\"table-element\" :class=\"state.classes\">\r\n\t\t\t\t<thead>\r\n\t\t\t\t\t<tr>\r\n\t\t\t\t\t\t<th v-for=\"header in headers\">\r\n\t\t\t\t\t\t\t<button class=\"title actionable table-content\" v-on:click=\"headerAction(header)\" :class=\"header.thClass\">\r\n\t\t\t\t\t\t\t\t<span class=\"sort fas\" v-if=\"!header.nosort && state.sortKey === header.field\" :class=\"{'fa-sort-down':state.ordering, 'fa-sort-up':!state.ordering}\"></span>\r\n\t\t\t\t\t\t\t\t<span class=\"sort fas fa-sort\" v-if=\"!header.nosort && state.sortKey !== header.field\"></span>\r\n\t\t\t\t\t\t\t\t<span>{{header.title}}</span>\r\n\t\t\t\t\t\t\t</button>\r\n\t\t\t\t\t\t</th>\r\n\t\t\t\t\t</tr>\r\n\t\t\t\t</thead>\r\n\t\t\t\t<tbody>\r\n\t\t\t\t\t<tr v-if=\"corpus.length === 0 && index.listing.length\">\r\n\t\t\t\t\t\t<td class=\"notification\" :colspan=\"headers.length\">\r\n\t\t\t\t\t\t\t<span class=\"fas fa-exclamation-triangle warning\"></span>\r\n\t\t\t\t\t\t\t<span>All Items Filtered Out</span>\r\n\t\t\t\t\t\t</td>\r\n\t\t\t\t\t</tr>\r\n\t\t\t\t\t<tr v-else-if=\"corpus.length === 0 && index.listing.length === 0\">\r\n\t\t\t\t\t\t<td class=\"notification\" :colspan=\"headers.length\">\r\n\t\t\t\t\t\t\t<span class=\"fas fa-exclamation-triangle warning\"></span>\r\n\t\t\t\t\t\t\t<span>No Items Available</span>\r\n\t\t\t\t\t\t</td>\r\n\t\t\t\t\t</tr>\r\n\t\t\t\t\t<tr v-else-if=\"index.error\">\r\n\t\t\t\t\t\t<td class=\"notification\" :colspan=\"headers.length\">\r\n\t\t\t\t\t\t\t<span class=\"fas fa-exclamation-triangle warning\"></span>\r\n\t\t\t\t\t\t\t<span>Data Source Error</span>\r\n\t\t\t\t\t\t\t<p>{{index.error}}</p>\r\n\t\t\t\t\t\t</td>\r\n\t\t\t\t\t</tr>\r\n\t\t\t\t\t<tr v-for=\"record in corpus\" :key=\"record.id\" :class=\"index.isSelected([record.id])?'record-selected':''\">\r\n\t\t\t\t\t\t<td v-for=\"(header, i) in headers\" class=\"table-record\" :class=\"header.field\" v-on:click.stop=\"select(record, header)\">\r\n\t\t\t\t\t\t\t<div v-if=\"!header.noCross\" class=\"crosshair\"></div>\r\n\t\t\t\t\t\t\t<div v-if=\"!header.noHighlight && index.isSelected([record.id]) && i === 0\" class=\"highlight starting\"></div>\r\n\t\t\t\t\t\t\t<div v-if=\"!header.noHighlight && index.isSelected([record.id]) && i === headers.length - 1\" class=\"highlight ending\"></div>\r\n\t\t\t\t\t\t\t<button class=\"table-content\">\r\n\t\t\t\t\t\t\t\t<slot name=\"table-content\">\r\n\t\t\t\t\t\t\t\t\t<div class=\"contents\" :class=\"header.field?header.field:''\" v-if=\"header.formatter\">\r\n\t\t\t\t\t\t\t\t\t\t<div v-html=\"header.formatter(record[header.field], record, header)\"></div>\r\n\t\t\t\t\t\t\t\t\t</div>\r\n\t\t\t\t\t\t\t\t\t<div class=\"contents\" :class=\"header.field?header.field:''\" v-else-if=\"header.type === 'array' || isArray(record[header.field])\">\r\n\t\t\t\t\t\t\t\t\t\t<ul>\r\n\t\t\t\t\t\t\t\t\t\t\t<li v-for=\"item in record[header.field]\">{{item.name || item}}</li>\r\n\t\t\t\t\t\t\t\t\t\t</ul>\r\n\t\t\t\t\t\t\t\t\t</div>\r\n\t\t\t\t\t\t\t\t\t<div class=\"contents\" :class=\"header.field?header.field:''\" v-else-if=\"header.type === 'object'\">\r\n\t\t\t\t\t\t\t\t\t\t<div v-html=\"formatObjectHeader(record[header.field])\">\r\n\t\t\t\t\t\t\t\t\t\t</div>\r\n\t\t\t\t\t\t\t\t\t</div>\r\n\t\t\t\t\t\t\t\t\t<div class=\"contents\" :class=\"header.field?header.field:''\" v-else-if=\"record[header.field] && typeof record[header.field] === 'object' && record[header.field] !== 'undefined'\">\r\n\t\t\t\t\t\t\t\t\t\t<pre>{{record[header.field] | JSON}}</pre>\r\n\t\t\t\t\t\t\t\t\t</div>\r\n\t\t\t\t\t\t\t\t\t<div class=\"contents\" :class=\"header.field?header.field:''\" v-else-if=\"record[header.field]\">\r\n\t\t\t\t\t\t\t\t\t\t{{record[header.field]}}\r\n\t\t\t\t\t\t\t\t\t</div>\r\n\t\t\t\t\t\t\t\t\t<div class=\"contents\" :class=\"header.field?header.field:''\" v-else>\r\n\t\t\t\t\t\t\t\t\t\t<span> </span>\r\n\t\t\t\t\t\t\t\t\t</div>\r\n\t\t\t\t\t\t\t\t</slot>\r\n\t\t\t\t\t\t\t</button>\r\n\t\t\t\t\t\t</td>\r\n\t\t\t\t\t</tr>\r\n\t\t\t\t</tbody>\r\n\t\t\t</table>\r\n\t\t</div>\r\n\t</div>\r\n\r\n\t<div class=\"table-paging\">\r\n\t\tPaging\r\n\t</div>\r\n</div>";
			case "components/viewer.html": return "\r\n<div class=\"rs-component component-viewer\">\r\n\r\n\t<div class=\"map\" v-if=\"location && sourceImage\">\r\n\t\t<div class=\"view\" onexit=\"true\" v-on:mousemove.stop=\"dragging($event)\" v-on:click.stop.prevent=\"clicking($event)\" v-on:mousedown=\"down($event)\" v-on:mouseup.stop.prevent=\"up($event)\" v-on:mousewheel.stop.prevent=\"wheeling($event)\" v-on:mouseleave=\"out($event)\">\r\n\t\t\t<!-- <div class=\"shadow\"></div> -->\r\n\t\t\t<div class=\"parchment\" v-on:contextmenu.stop.prevent=\"openActions($event)\">\r\n\t\t\t\t<div class=\"pointsOfInterest\" v-if=\"pointsOfInterest.length && state.markers\">\r\n\t\t\t\t\t<button class=\"poi\" v-if=\"poiVisible(link)\" v-for=\"link in pointsOfInterest\" :data-id=\"link.id\" :style=\"'left:' + link.x + '%; top:' + link.y + '%;'\" :key=\"link.id\" v-on:click=\"poiMenu(link)\">\r\n\t\t\t\t\t\t<span class=\"labeling\" v-if=\"link.label\">{{link.label}}</span>\r\n\t\t\t\t\t\t<span :class=\"poiClass(link)\"></span>\r\n\t\t\t\t\t</button>\r\n\t\t\t\t</div>\r\n\t\t\t\t<div class=\"coordinates\" v-for=\"coordinate in location.coordinates\">\r\n\t\t\t\t\t<span class=\"coordinate top left\" :style=\"'width: ' + coordinate.x + '%; height: ' + coordinate.y + '%;' + (coordinate.color?'border-color: ' + coordinate.color + ';':'')\"></span>\r\n\t\t\t\t\t<span class=\"coordinate bottom right\" :style=\"'left: ' + coordinate.x + '%; width: ' + (100-coordinate.x) + '%; top: ' + coordinate.y + '%; height: ' + (100-coordinate.y) + '%;' + (coordinate.color?'border-color: ' + coordinate.color + ';':'')\"></span>\r\n\t\t\t\t</div>\r\n\t\t\t\t<div class=\"coordinate-dots\">\r\n\t\t\t\t\t<button class=\"dot\" v-for=\"coordinate in location.coordinates\" :style=\"'left: ' + coordinate.x + '%; top: ' + coordinate.y + '%;' + (coordinate.color?'background-color: ' + coordinate.color + ';':'')\" v-on:click=\"dismissCoordinate(coordinate)\"></button>\r\n\t\t\t\t</div>\r\n\t\t\t\t<div class=\"actions\" v-if=\"actions.open\" :style=\"'left: ' + actions.x + 'px; top: ' + actions.y + ';'\">\r\n\t\t\t\t\t<div class=\"actions-header\">\r\n\t\t\t\t\t\t<span class=\"titling\">\r\n\t\t\t\t\t\t\t{{actions.header}}\r\n\t\t\t\t\t\t</span>\r\n\t\t\t\t\t\t<button class=\"actions-close alert\" v-on:click.stop.prevent=\"closeActions()\">\r\n\t\t\t\t\t\t\t<span class=\"fas fa-times\"></span>\r\n\t\t\t\t\t\t</button>\r\n\t\t\t\t\t</div>\r\n\t\t\t\t\t<div class=\"actions-options\">\r\n\t\t\t\t\t\t<button class=\"option normal\" v-for=\"option in actions.options\" v-on:click.stop.prevent=\"fire(option, $event)\">\r\n\t\t\t\t\t\t\t<span :class=\"option.icon || 'fas fa-chevron-square-right'\"></span>\r\n\t\t\t\t\t\t\t<span>{{option.text}}</span>\r\n\t\t\t\t\t\t</button>\r\n\t\t\t\t\t\t<input type=\"text\" v-model=\"state.alter\" v-if=\"player.master\"/>\r\n\t\t\t\t\t</div>\r\n\t\t\t\t</div>\r\n\t\t\t\t<img :src=\"sourceImage\" draggable=\"false\" />\r\n\t\t\t</div>\r\n\t\t</div>\r\n\t</div>\r\n\r\n\r\n\t<div class=\"menu\" :class=\"menuOpen?'open':'closed'\">\r\n\t\t<button class=\"toggle\" v-on:click=\"toggleMenu()\">\r\n\t\t\t<span class=\"fas\" :class=\"menuOpen?'fa-caret-square-up':'fa-caret-square-down'\"></span>\r\n\t\t</button>\r\n\t\t<div class=\"menu-items flow-v\">\r\n\t\t\t<div class=\"search\">\r\n\t\t\t\t<input type=\"text\" v-model=\"state.search\" v-on:keyup.enter=\"searchMap(state.search)\"/>\r\n\t\t\t\t<button class=\"control\" v-on:click=\"searchMap(state.search)\">\r\n\t\t\t\t\t<span class=\"icon far fa-search\"></span>\r\n\t\t\t\t</button>\r\n\t\t\t</div>\r\n\t\t\t<button class=\"control\" v-on:click=\"processAction(menuItem)\" v-for=\"menuItem in menuItems\" :class=\"menuItem.action\">\r\n\t\t\t\t<span class=\"icon\" :class=\"menuItem.icon\"></span>\r\n\t\t\t\t<span class=\"text\">{{menuItem.text}}</span>\r\n\t\t\t</button>\r\n\t\t\t<button class=\"control follow\" v-on:click=\"processAction(menuItems.markerItem)\">\r\n\t\t\t\t<span class=\"icon fal\" :class=\"state.markers?'fa-check-square':'fa-square'\"></span>\r\n\t\t\t\t<span class=\"text\">{{menuItems.markerItem.text}}</span>\r\n\t\t\t</button>\r\n\t\t\t<button class=\"control follow\" v-on:click=\"processAction(menuItems.followItem)\">\r\n\t\t\t\t<span class=\"icon fal\" :class=\"state.follow?'fa-check-square':'fa-square'\"></span>\r\n\t\t\t\t<span class=\"text\">{{menuItems.followItem.text}}</span>\r\n\t\t\t</button>\r\n\t\t\t<select class=\"control master\" v-model=\"state.master_view\" v-if=\"player.master\">\r\n\t\t\t\t<option value=\"\">Player Character</option>\r\n\t\t\t\t<option value=\"master\">Master</option>\r\n\t\t\t\t<option v-for=\"entity in universe.indexes.entity.listing\" :value=\"entity.id\">{{entity.name}}</option>\r\n\t\t\t</select>\r\n\t\t</div>\r\n\t</div>\r\n</div>\r\n";
			case "pages/about.html": return "<div class=\"rs-page page-about\">\r\n\t<h1>About</h1>\r\n\r\n</div>\r\n";
			case "pages/home.html": return "<div class=\"rs-page page-home\">\r\n\t<div class=\"login prompt\" v-if=\"state === 0\">\r\n\t\t<div class=\"boxed\">\r\n\t\t\t<div class=\"message\" v-if=\"message\">{{message}}</div>\r\n\t\t\t<rs-connect v-on:connect=\"connect\"></rs-connect>\r\n\t\t</div>\r\n\t</div>\r\n\t<div class=\"login waiting\" v-if=\"0 < state && state < 10\">\r\n\t\t<div class=\"titling\">\r\n\t\t\t<span v-if=\"state === 1\">Connecting</span>\r\n\t\t\t<span v-if=\"state === 2\">Loading</span>\r\n\t\t</div>\r\n\t\t<div class=\"status\">\r\n\t\t\t<span class=\"far fa-spinner fa-pulse\"></span>\r\n\t\t</div>\r\n\t</div>\r\n\t<div class=\"system-display active\" v-if=\"state === 10\">\r\n\t\t<system-menu :universe=\"universe\" :user=\"player\"></system-menu>\r\n\t\t<router-view class=\"system-view\" :universe=\"universe\" :user=\"player\"></router-view>\r\n\t\t<system-info :universe=\"universe\" :user=\"player\"></system-info>\r\n\t</div>\r\n</div>\r\n";
			case "pages/main.html": return "<div class=\"\">\r\n</div>\r\n";
			case "pages/noun/controls.html": return "<div class=\"rs-page page-noun_controls\">\r\n\t<h1>Nouns</h1>\r\n\t<rs-nouns :universe=\"universe\" :player=\"player\"></rs-nouns>\r\n</div>\r\n";
			case "pages/rssw/base.html": return "<div class=\"rssw-page page-base\">\r\n\t<rssw-character-info :character=\"entity\" :user=\"user\" :universe=\"universe\"></rssw-character-info>\r\n</div>\r\n";
			case "pages/rssw/character.html": return "<div class=\"rssw-page page-dashboard\">\r\n\t<rssw-character-info :character=\"entity\" :user=\"user\" :universe=\"universe\"></rssw-character-info>\r\n\t<rssw-character-board :character=\"entity\" :user=\"user\" :universe=\"universe\"></rssw-character-board>\r\n\t<rssw-character-stats :character=\"entity\" :user=\"user\" :universe=\"universe\"></rssw-character-stats>\r\n\t<rssw-character-skills :character=\"entity\" :user=\"user\" :universe=\"universe\"></rssw-character-skills>\r\n</div>\r\n";
			case "pages/rssw/dashboard.html": return "<div class=\"rssw-page page-dashboard\">\r\n\t<div v-if=\"!$route.params.oid\">\r\n\t\t<div class=\"title\">\r\n\t\t\t{{player.name}} Overview\r\n\t\t</div>\r\n\t\t\r\n\t\t<div class=\"self\" v-if=\"self\">\r\n\t\t\t<router-link class=\"navigation-button\" :to=\"'/dashboard/character/' + self.id\">\r\n\t\t\t\t<span class=\"link-icon\" :class=\"self.icon || 'fas fa-user-circle'\"></span>\r\n\t\t\t\t<span class=\"link-label\">{{self.name}}</span>\r\n\t\t\t</router-link>\r\n\t\t</div>\r\n\t\t\r\n\t\t<div class=\"control\">\r\n\t\t\t<div class=\"title\">\r\n\t\t\t\tOthers\r\n\t\t\t</div>\r\n\t\t\t<div class=\"entities\">\r\n\t\t\t\t<router-link class=\"entity navigation-button\" v-for=\"entity in owned\" :to=\"'/dashboard/' + entity.classification + '/' + entity.id\" :key=\"entity.id\" v-if=\"!self || entity.id !== self.id\">\r\n\t\t\t\t\t<span class=\"link-icon\" :class=\"entity.icon || 'fas fa-user-circle'\"></span>\r\n\t\t\t\t\t<span class=\"link-label\">{{entity.name}}</span>\r\n\t\t\t\t</router-link>\r\n\t\t\t</div>\r\n\t\t</div>\r\n\t</div>\r\n\t\r\n\t<router-view class=\"system-view opened\" :universe=\"universe\" :user=\"player\" :class=\"$route.params.oid?'loaded':''\"></router-view>\r\n</div>\r\n";
			case "pages/rssw/hangar.html": return "<div class=\"rssw-page page-dashboard\">\r\n\r\n</div>\r\n";
			case "pages/rssw/journal.html": return "<div class=\"rssw-page page-journal\">\r\n\t\r\n</div>\r\n";
			case "pages/rssw/locality.html": return "<div class=\"rssw-page page-locality\">\r\n\r\n</div>\r\n";
			case "pages/rssw/map.html": return "<div class=\"rs-page map rssw\">\r\n\r\n\t<rs-viewer :user=\"user\" :player=\"player\" :universe=\"universe\" :location=\"location\"></rs-viewer>\r\n\t\r\n</div>\r\n";
			case "pages/rssw/ship.html": return "<div class=\"rssw-page page-dashboard\">\r\n\t<rssw-ship-stats :ship=\"entity\" :user=\"user\" :universe=\"universe\"></rssw-ship-stats>\r\n</div>\r\n";
			case "pages/rssw/storage.html": return "<div class=\"rssw-page page-storage\">\r\n\r\n</div>\r\n";
			case "pages/rssw/universe.html": return "<div class=\"rssw-page page-universe\">\r\n\t<div v-if=\"!$route.params.oid\">\r\n\t\t<div class=\"title\">\r\n\t\t\tGalactic Index\r\n\t\t\t<button class=\"fas fa-sync\" v-on:click=\"resetHeaders()\">Headers</button>\r\n\t\t</div>\r\n\t\t\r\n\t\t<div class=\"index\">\r\n\t\t\t<rs-table class=\"index\" :universe=\"universe\" :user=\"player\" :index=\"state.activeIndex?universe.indexes[state.activeIndex]:universe.index\" :headers=\"state.headers\" :state=\"state\" :options=\"state.indexOptions\" v-on:action=\"processAction\"></rs-table>\r\n\t\t</div>\r\n\t\t\r\n\t\t<div class=\"control\">\r\n\t\t\t<div class=\"title\">\r\n\t\t\t\t<input class=\"filter\" v-model=\"state.search\" />\r\n\t\t\t</div>\r\n\t\t\t<div class=\"entities\">\r\n\t\t\t\t<router-link class=\"entity navigation-button\" v-for=\"entity in universe.indexes.entity.listing\" :to=\"'/universe/' + entity.classification + '/' + entity.id\" :key=\"entity.id\" v-if=\"filtered(entity)\">\r\n\t\t\t\t\t<span class=\"link-icon\" :class=\"entity.icon || 'fas fa-user-circle'\"></span>\r\n\t\t\t\t\t<span class=\"link-label\">{{entity.name}}</span>\r\n\t\t\t\t</router-link>\r\n\t\t\t</div>\r\n\t\t</div>\r\n\t</div>\r\n\t\r\n\t<router-view class=\"system-view opened\" :universe=\"universe\" :user=\"player\" :class=\"$route.params.oid?'loaded':''\"></router-view>\r\n</div>\r\n";
			case "pages/test.html": return "<div class=\"test\">\r\n\tThis is a test.\r\n</div>\r\n";
			default: return null;
		}
	};
};
Vue.use(Templify);