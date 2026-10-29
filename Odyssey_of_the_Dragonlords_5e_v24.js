/*	-WHAT?-
	This script adds the content of "Odyssey of the Dragonlords: Player's Guide" (Arcanum Worlds, 2026)
	to the MPMB Character Record Sheet for the 2024 rules (5.5e).

	-KEEP IN MIND-
	This is a conversion of the 2014-rules script by Newbuu2 (v13). Content that the Player's Guide
	does not cover has been carried over and is flagged "legacy" in its description/notes.
	It has NOT been tested inside the actual MPMB v24 sheet (see the accompanying validation report).

	-INFORMATION-
	Subject:	Species, Subclasses, Spells, Weapons, Creatures, Magic Items
	Effect:		Adds the content of Odyssey of the Dragonlords to the 2024-rules character sheet
	Code by:	Newbuu2 (original 2014 script); converted to 5.5e / MPMB v24
	Date:		2026-10-26
	Sheet:		v24.2.0 or newer
*/

var iFileName = "Odyssey_of_the_Dragonlords_5e_v24.js";
RequiredSheetVersion("24.2.0");

SourceList["OotD"] = {
	name : "Odyssey of the Dragonlords: Player's Guide",
	abbreviation : "OotD",
	group : "Third Party",
	url : "https://www.arcanumworlds.com",
	date : "2026/05/14",
	defaultExcluded : true
};

// Helper: only keep spell keys that exist in the sheet's spell list (some Odyssey subclass spells are not in the free SRD'24 content)
function ootdSpellsExist(arr) {
	return arr.filter(function (s) { return !!SpellsList[s]; });
}

// ---------- SPECIES (Player's Guide ch. 7, pp. 68-79) ----------
// The Player's Guide merges the five 2014 nymph species (aurae, dryad, naiad, nereid, oread) into one
// "Nymph" species with five ancestries, and (per the 2024 rules) no longer lists species ability score
// increases or species languages.

RaceList["thylean centaur"] = {
	regExpSearch : /^(?=.*centaur).*$/i,
	name : "Centaur",
	sortname : "Centaur",
	source : [["OotD", 71]],
	plural : "Centaurs",
	size : 3,
	speed : { walk : { spd : 40, enc : 30 } },
	carryingCapacity : 2,
	trait : "Centaur (Fey, Medium)" +
		"\n \u25C6 Charge: If I move at least 15 ft in a straight line towards a target immediately before hitting it with a melee attack, I can add 1d6 damage. Once on each of my turns." +
		"\n \u25C6 Gallop: Opportunity Attacks have Disadvantage against me." +
		"\n \u25C6 Mountable: I count as one size larger when determining if I can be mounted." +
		"\n \u25C6 Quadrupedal Stride: Climbing or maneuvering in tight spaces is Difficult Terrain for me." +
		"\n \u25C6 Large Body: I count as one size larger when determining my carrying capacity.",
	features : {
		"charge" : {
			name : "Charge",
			source : [["OotD", 71]],
			minlevel : 1,
			description : desc("Move 15+ ft straight towards a target right before a melee hit: +1d6 damage (once per turn)"),
			calcChanges : {
				atkAdd : [
					function (fields, v) {
						if (!v.isSpell && !v.isNaturalWeapon && v.isMeleeWeapon) fields.Description += (fields.Description ? '; ' : '') + 'Charge: +1d6 once per turn after moving 15 ft straight';
					},
					"If I move at least 15 ft in a straight line towards a target immediately before hitting it with a melee attack, I can add 1d6 damage (once on each of my turns)."
				]
			}
		}
	}
};

RaceList["thylean medusa"] = {
	regExpSearch : /^(?=.*medusa).*$/i,
	name : "Medusa",
	sortname : "Medusa",
	source : [["OotD", 73]],
	plural : "Medusae",
	size : 3,
	speed : { walk : { spd : 30, enc : 20 } },
	vision : [["Darkvision", 120]],
	savetxt : { adv_vs : ["poisoned"] },
	trait : "Medusa (Monstrosity, Medium)" +
		"\n \u25C6 Darkvision: 120 ft." +
		"\n \u25C6 Snake Hair: Melee weapon attack (Prof. Bonus + Dex mod), 1d6 piercing. The target makes a Con save (DC 8 + Con mod + Prof. Bonus) or is Poisoned until the start of my next turn." +
		"\n \u25C6 Snake Blood: Advantage on saving throws to avoid or end the Poisoned condition." +
		"\n \u25C6 Petrifying Gaze (level 5): See the feature.",
	weaponOptions : [{
		regExpSearch : /^(?=.*snake)(?=.*hair).*$/i,
		name : "Snake Hair",
		source : [["OotD", 73]],
		ability : 2,
		type : "Natural",
		damage : [1, 6, "piercing"],
		range : "Melee",
		abilitytodamage : false,
		description : "Con save (DC 8 + Con mod + PB) or Poisoned until the start of my next turn"
	}],
	weaponsAdd : ["Snake Hair"],
	features : {
		"petrifying gaze" : {
			name : "Petrifying Gaze",
			source : [["OotD", 73]],
			minlevel : 5,
			action : [["action", ""], ["bonus action", "Petrifying Gaze (on a Restrained target)"]],
			description : desc([
				"One creature within 30 ft that I can see and that isn't Blinded makes a Con save (DC 8 + Cha mod + PB)",
				"Fail: Restrained until the end of its next turn; I can then use this on it as a Bonus Action on later turns",
				"If it fails 3 consecutive saves, it is Petrified until Greater Restoration or a similar effect ends it"
			])
		}
	}
};

RaceList["thylean minotaur"] = {
	regExpSearch : /^(?=.*minotaur).*$/i,
	name : "Minotaur",
	sortname : "Minotaur",
	source : [["OotD", 75]],
	plural : "Minotaurs",
	size : 3,
	speed : { walk : { spd : 30, enc : 20 } },
	vision : [["Darkvision", 60]],
	skills : ["Investigation"],
	carryingCapacity : 2,
	trait : "Minotaur (Monstrosity, Medium)" +
		"\n \u25C6 Keen Snout: Proficiency in Investigation; I can detect strong odors from up to six miles away." +
		"\n \u25C6 Labyrinthine Vision: Darkvision 60 ft. For ability checks to solve a maze or maze-like puzzle I can use 15 + Prof. Bonus instead of rolling. I automatically pass the save for Hypnotic Pattern. Advantage on skill checks and saves against illusions that rely on sight." +
		"\n \u25C6 Colorblindness: I can't discern any color except very bright reds." +
		"\n \u25C6 Cursed Transformation: Bonus Action, cast Polymorph on myself without a spell slot or Concentration (Wisdom); only the Bull statblock, from level 9 the Dire Bull instead. Prof. Bonus times per Long Rest." +
		"\n \u25C6 Powerful Build: Advantage on ability checks to end the Grappled condition. I count as one size larger for carrying capacity.",
	features : {
		"labyrinthine vision" : {
			name : "Labyrinthine Vision",
			source : [["OotD", 75]],
			minlevel : 1,
			description : desc([
				"Maze or maze-like puzzle ability checks: I can use 15 + Proficiency Bonus instead of rolling",
				"I automatically pass the saving throw for Hypnotic Pattern",
				"Advantage on skill checks and saves against illusions that rely on sight"
			])
		},
		"cursed transformation" : {
			name : "Cursed Transformation",
			source : [["OotD", 75]],
			minlevel : 1,
			usages : "Proficiency bonus per ",
			usagescalc : "event.value = How('Proficiency Bonus');",
			recovery : "long rest",
			action : [["bonus action", ""]],
			description : desc([
				"Cast Polymorph on myself without a spell slot or Concentration; Wisdom is my spellcasting ability",
				"I must choose the Bull statblock; from level 9 I transform into a Dire Bull instead"
			]),
			creaturesAdd : [["Bull", true], ["Dire Bull", true]]
		},
		"powerful build" : {
			name : "Powerful Build",
			source : [["OotD", 75]],
			minlevel : 1,
			description : desc("Advantage on ability checks to end the Grappled condition")
		}
	}
};

RaceList["thylean nymph"] = {
	regExpSearch : /^(?=.*nymph).*$/i,
	name : "Nymph",
	sortname : "Nymph",
	source : [["OotD", 69]],
	plural : "Nymphs",
	size : 3,
	speed : { walk : { spd : 30, enc : 20 } },
	skills : ["Persuasion"],
	spellcastingAbility : [4, 5, 6],
	savetxt : { adv_vs : ["charmed"] },
	trait : "Nymph (Fey, Medium)" +
		"\n \u25C6 Fey Ancestry: Advantage on saving throws to avoid or end the Charmed condition." +
		"\n \u25C6 Enthralling Beauty: Proficiency in Persuasion. I can cast Charm Person once, regaining it after a Short or Long Rest (Charisma)." +
		"\n \u25C6 Nymph Ancestry: Choose Night, Woodlands, Rivers, Oceans, or Mountains (variant) for a level 1 benefit and a spell at levels 3 and 7 (always prepared; once per Long Rest without a slot, or with spell slots; Int, Wis, or Cha).",
	variants : ["night", "woodlands", "rivers", "oceans", "mountains"],
	features : {
		"enthralling beauty" : {
			name : "Enthralling Beauty",
			source : [["OotD", 69]],
			minlevel : 1,
			spellcastingBonus : [{
				name : "Enthralling Beauty",
				spells : ["charm person"],
				selection : ["charm person"],
				firstCol : "oncesr",
				spellcastingAbility : 6
			}]
		}
	}
};

// Nymph ancestries (p. 69). The level 3 / level 7 spells are always prepared and castable once per Long Rest.
(function () {
	var ancestries = {
		"night" : { name : "Night Nymph (Aurae)", txt : "Darkvision 120 ft.", vision : [["Darkvision", 120]], s3 : "faerie fire", s7 : "levitate" },
		"woodlands" : { name : "Woodlands Nymph (Dryad)", txt : "Proficiency in Survival.", skills : ["Survival"], s3 : "goodberry", s7 : "barkskin" },
		"rivers" : { name : "Rivers Nymph (Naiad)", txt : "Swim speed 40 ft; I can hold my breath for 1 hour.", speed : { swim : { spd : 40, enc : 30 } }, s3 : "create or destroy water", s7 : "control water" },
		"oceans" : { name : "Oceans Nymph (Nereid)", txt : "Swim speed 40 ft; I can breathe air and water.", speed : { swim : { spd : 40, enc : 30 } }, s3 : "fog cloud", s7 : "water walk" },
		"mountains" : { name : "Mountains Nymph (Oread)", txt : "Darkvision 60 ft.", vision : [["Darkvision", 60]], s3 : "hunter's mark", s7 : "misty step" }
	};
	for (var key in ancestries) {
		var a = ancestries[key];
		var obj = {
			regExpSearch : new RegExp("^(?=.*nymph)(?=.*" + key + ").*$", "i"),
			name : a.name,
			source : [["OotD", 69]],
			plural : "Nymphs",
			trait : "Nymph (Fey, Medium)" +
				"\n \u25C6 Fey Ancestry: Advantage on saving throws to avoid or end the Charmed condition." +
				"\n \u25C6 Enthralling Beauty: Proficiency in Persuasion; Charm Person once per Short or Long Rest (Cha)." +
				"\n \u25C6 Nymph Ancestry (" + key.charAt(0).toUpperCase() + key.slice(1) + "): " + a.txt + " Spells: " + a.s3.replace(/\b\w/g, function(c){return c.toUpperCase();}) + " (level 3), " + a.s7.replace(/\b\w/g, function(c){return c.toUpperCase();}) + " (level 7); Int, Wis, or Cha.",
			spellcastingAbility : [4, 5, 6],
			features : {}
		};
		if (a.vision) obj.vision = a.vision;
		if (a.skills) obj.skills = a.skills;
		if (a.speed) obj.speed = a.speed;
		obj.features["nymph ancestry 3"] = {
			name : "Nymph Ancestry: level 3 spell",
			source : [["OotD", 69]],
			minlevel : 3,
			spellcastingBonus : [{ name : "Nymph Ancestry (level 3)", spells : [a.s3], selection : [a.s3], firstCol : "oncelr+markedbox" }]
		};
		obj.features["nymph ancestry 7"] = {
			name : "Nymph Ancestry: level 7 spell",
			source : [["OotD", 69]],
			minlevel : 7,
			spellcastingBonus : [{ name : "Nymph Ancestry (level 7)", spells : [a.s7], selection : [a.s7], firstCol : "oncelr+markedbox" }]
		};
		AddSubRace("thylean nymph", key, obj);
	}
}());

RaceList["thylean satyr"] = {
	regExpSearch : /^(?=.*satyr).*$/i,
	name : "Satyr",
	sortname : "Satyr",
	source : [["OotD", 77]],
	plural : "Satyrs",
	size : 3,
	speed : { walk : { spd : 30, enc : 20 } },
	spellcastingAbility : [4, 5, 6],
	savetxt : { adv_vs : ["charmed", "frightened", "magical sleep (can't be put to sleep by spells)"] },
	trait : "Satyr (Fey, Medium)" +
		"\n \u25C6 Fey Heritage: Advantage on saves against being Charmed or Frightened; spells can't put me to sleep." +
		"\n \u25C6 Memory for Music: Expertise in Performance." +
		"\n \u25C6 Enchanting Music: Minor Illusion cantrip; Sleep at level 3 and Suggestion at level 5, each once per Long Rest or with spell slots. Requires an instrument I am proficient with. Int, Wis, or Cha (choose).",
	features : {
		"memory for music" : {
			name : "Memory for Music",
			source : [["OotD", 77]],
			minlevel : 1,
			description : desc("Expertise in the Performance skill"),
			skills : [["Performance", "full"]]
		},
		"enchanting music 1" : {
			name : "Enchanting Music: Minor Illusion",
			source : [["OotD", 77]],
			minlevel : 1,
			spellcastingBonus : [{ name : "Enchanting Music", spells : ["minor illusion"], selection : ["minor illusion"], level : [0, 0] }]
		},
		"enchanting music 3" : {
			name : "Enchanting Music: Sleep",
			source : [["OotD", 77]],
			minlevel : 3,
			spellcastingBonus : [{ name : "Enchanting Music (level 3)", spells : ["sleep"], selection : ["sleep"], firstCol : "oncelr+markedbox" }]
		},
		"enchanting music 5" : {
			name : "Enchanting Music: Suggestion",
			source : [["OotD", 77]],
			minlevel : 5,
			spellcastingBonus : [{ name : "Enchanting Music (level 5)", spells : ["suggestion"], selection : ["suggestion"], firstCol : "oncelr+markedbox" }]
		}
	}
};

RaceList["thylean siren"] = {
	regExpSearch : /^(?=.*siren).*$/i,
	name : "Siren",
	sortname : "Siren",
	source : [["OotD", 79]],
	plural : "Sirens",
	size : 3,
	speed : { walk : { spd : 30, enc : 20 } },
	trait : "Siren (Fey, Medium)" +
		"\n \u25C6 Enthralling Voice: Advantage on Performance and Persuasion checks made with my voice; I can hold my breath for up to 1 hour." +
		"\n \u25C6 Wavering Emotions: After each Short or Long Rest I choose Flight (Fly speed 30 ft, not in Medium or Heavy armor) or Song of Sorrow (Charm Person at level 1, Enthrall at level 3, Hold Person at level 5; each once per Short or Long Rest; Deafened creatures automatically pass the save). Charisma, or my Spellcasting ability if I have the Spellcasting feature.",
	features : {
		"enthralling voice" : {
			name : "Enthralling Voice",
			source : [["OotD", 79]],
			minlevel : 1,
			description : desc("Advantage on Performance and Persuasion checks made with my voice; hold my breath up to 1 hour"),
			advantages : [["Performance", true], ["Persuasion", true]]
		},
		"wavering emotions" : {
			name : "Wavering Emotions",
			source : [["OotD", 79]],
			minlevel : 1,
			description : desc("Choose a Wavering Emotions option after finishing a Short or Long Rest"),
			choices : ["Flight", "Song of Sorrow"],
			"flight" : {
				name : "Wavering Emotions: Flight",
				description : desc("Fly speed 30 ft; I can't use it while wearing Medium or Heavy armor"),
				speed : { fly : { spd : 30, enc : 20 } }
			},
			"song of sorrow" : {
				name : "Wavering Emotions: Song of Sorrow",
				description : desc([
					"Charm Person (level 1), Enthrall (level 3), Hold Person (level 5): each once per Short or Long Rest without a spell slot",
					"A Deafened creature automatically passes its saving throw against these spells when cast this way"
				]),
				spellcastingBonus : [
					{ name : "Song of Sorrow (level 1)", spells : ["charm person"], selection : ["charm person"], firstCol : "oncesr", spellcastingAbility : 6, times : levels.map(function (n) { return n >= 1 ? 1 : 0; }) },
					{ name : "Song of Sorrow (level 3)", spells : ["enthrall"], selection : ["enthrall"], firstCol : "oncesr", spellcastingAbility : 6, times : levels.map(function (n) { return n >= 3 ? 1 : 0; }) },
					{ name : "Song of Sorrow (level 5)", spells : ["hold person"], selection : ["hold person"], firstCol : "oncesr", spellcastingAbility : 6, times : levels.map(function (n) { return n >= 5 ? 1 : 0; }) }
				]
			}
		}
	}
};

// ---------- EPIC BACKGROUNDS (Player's Guide ch. 3, pp. 30-37) ----------
// Each Epic Background grants three ability scores to choose from, an origin feat, two skills, a tool, equipment
// and a Divine Blessing. The Divine Blessings are implemented as feats (type "divine blessing").

FeatsList["ootd blessing of health"] = {
	name : "Divine Blessing: Health",
	source : [["OotD", 31]],
	type : "divine blessing",
	description : "Blessing of Health. My Constitution score increases by 2, up to a maximum of 22.",
	scores : [0, 0, 2, 0, 0, 0],
	scoresMaximum : [0, 0, 22, 0, 0, 0]
};
FeatsList["ootd blessing of protection"] = {
	name : "Divine Blessing: Protection",
	source : [["OotD", 32]],
	type : "divine blessing",
	description : "Blessing of Protection. I gain a +1 bonus to my AC and to all saving throws.",
	extraAC : [{ mod : 1, text : "I gain a +1 bonus to AC from the Blessing of Protection." }],
	addMod : [{ type : "save", field : "all", mod : 1, text : "I gain a +1 bonus to all saving throws from the Blessing of Protection." }]
};
FeatsList["ootd blessing of dragon slaying"] = {
	name : "Divine Blessing: Dragon Slaying",
	source : [["OotD", 33]],
	type : "divine blessing",
	description : "Blessing of Dragon Slaying. I have Advantage on all attacks against creatures with the dragon type. Creatures with the dragon type have Disadvantage on saving throws against my spells."
};
FeatsList["ootd blessing of the dragonlords"] = {
	name : "Divine Blessing: the Dragonlords",
	source : [["OotD", 34]],
	type : "divine blessing",
	description : "Blessing of the Dragonlords. While mounted on a dragon, I gain its damage resistances, damage immunities and senses (Blindsight, Darkvision, and its passive Perception if greater than mine). If the dragon is an adult or ancient dragon, I can also use its Legendary Resistance (counting towards its total number of uses per day)."
};
FeatsList["ootd blessing of magic resistance"] = {
	name : "Divine Blessing: Magic Resistance",
	source : [["OotD", 35]],
	type : "divine blessing",
	description : "Blessing of Magic Resistance. I have Advantage on saving throws against spells and other magical effects.",
	savetxt : { adv_vs : ["spells", "magical effects"] }
};
FeatsList["ootd blessing of luck"] = {
	name : "Divine Blessing: Luck",
	source : [["OotD", 36]],
	type : "divine blessing",
	description : "Blessing of Luck. I may reroll any one attack roll, ability check, or saving throw and must use the second roll. I can't use this again until after a long rest.",
	usages : 1,
	recovery : "long rest"
};
FeatsList["ootd blessing of the gods"] = {
	name : "Divine Blessing: the Gods",
	source : [["OotD", 30]],
	type : "divine blessing",
	description : "Blessing of the Gods. I and my direct family are immune to curses, diseases, and the Poisoned condition.",
	savetxt : { immune : ["curses", "disease", "poisoned"] }
};

(function () {
	var bgs = {
		"cursed one" : {
			name : "Cursed One", page : 30,
			scores : "Charisma, Intelligence, and Wisdom", feats : ["Skilled", "Divine Blessing: the Gods"],
			skills : ["Perception", "Survival"], tool : [["Calligrapher's Supplies", "Dex"]], gold : 14,
			equip : ["Calligrapher's supplies", "Healer's kit", "Fine clothes"],
			text : "I come from a great family or tribe that has been cursed for centuries, owing to the actions of one of my distant ancestors, who angered the Titans. The stigma has haunted me all my life and I'm shunned by the ignorant and superstitious. Restrictions: none. Adventure Hook: The Oracle reveals that she knows who can end the curse. Heroic Tasks: end my family's curse; find the Gem of Brightness (a family heirloom, only I can attune); find a greater family artifact key to ending the curse (choose one: Staff of Fire [any melee weapon], Belt of Fire Giant Strength [also grants fire resistance], or Efreeti Bottle [only I can use it with a Magic action])."
		},
		"demigod" : {
			name : "Demigod", page : 31,
			scores : "Constitution, Wisdom, and Strength", feats : [{ key : "magic initiate", choice : "cleric" }, "Divine Blessing: Health"],
			skills : ["Athletics", "Religion"], tool : [["Musical instrument", 1]], gold : 14,
			equip : ["Musical instrument (same as above)", "Healer's kit", "Quiver", "Traveler's clothes"],
			text : "I am a mortal child of Pythor, the god of battle. My temper is legendary and I show unnatural talent in everything that interests me. I never met my father; my mother was famed for her beauty and her skill as a harpist, and was carried away by a green dragon. Restrictions: I must be a native to Thylea. Adventure Hook: I have been summoned by the Oracle due to my fame and divine heritage. Heroic Tasks: find my mother (Ophea or a name I create); defeat Pythor's greatest foe (the green dragon Hexia); finish building Pythor's greatest weapon (Rod of Lordly Might or a Luck Blade [any sword])."
		},
		"doomed one" : {
			name : "Doomed One", page : 32,
			scores : "Charisma, Intelligence, and Strength", feats : [{ key : "magic initiate", choice : "wizard" }, "Divine Blessing: Protection"],
			skills : ["Persuasion", "History"], tool : [["Calligrapher's Supplies", "Dex"]], gold : 8,
			equip : ["Calligrapher's supplies", "Fine clothes", "Perfume"],
			text : "I come from a famous and distinguished family with Dragonlords and gods among my ancestors, but I was born under a fell astrological sign that portended a doom of epic proportions. My parents died shortly after I was born under mysterious circumstances. Restrictions: I must be a native to Thylea. Adventure Hook: The Oracle knows that my doom reflects the doom of the world; if I save myself, I can save the world. Heroic Tasks: defeat the creature fated to kill me; forge the one artifact that protects me from my doom (resistance to all damage originating from that creature); choose one: Robe of the Archmagi, Breastplate of Invulnerability, or Cloak of Invisibility."
		},
		"dragonslayer" : {
			name : "Dragonslayer", page : 33,
			scores : "Constitution, Dexterity, and Strength", feats : ["Tough", "Divine Blessing: Dragon Slaying"],
			skills : ["Acrobatics", "Stealth"], tool : [["Gaming set", 1]], gold : 29,
			equip : ["Gaming set (same as above)", "Fine clothes"],
			text : "I have a tragic past: a dragon was responsible for destroying my childhood, either by razing my village or by ruining my life while polymorphed into the shape of a man or woman. I wish to discover the identity and location of that dragon and exact vengeance. Restrictions: none. Adventure Hook: The Oracle knows how to find the dragon responsible for my tragedy. Heroic Tasks: kill that dragon; find items key to killing dragons (one lesser and one greater from: Armor of Resistance (Fire) [any armor], Ring of Resistance (Fire) [only I can attune] (lesser); Dragon Slayer [any melee weapon], Quiver of Ehlonna [includes five Ammunition of Slaying (dragons)], Wand of Binding [only I can attune] (greater))."
		},
		"gifted one" : {
			name : "Gifted One", page : 34,
			scores : "Charisma, Constitution, and Strength", feats : ["Lucky", "Divine Blessing: the Dragonlords"],
			skills : ["Intimidation", "Performance"], tool : [["Gaming set", 1]], gold : 29,
			equip : ["Gaming set (same as above)", "Traveler's clothes"],
			text : "Ever since I was a child I've shown remarkable promise, effortlessly mastering every activity I attempted. People assume I have divine blood. As I'm from a common or barbarian family, I've been the target of envy from the children of the nobility, and have spent my life proving my worth. Mostly, I want to become a Dragonlord. Restrictions: I must be a native to Thylea. Adventure Hook: The Oracle promises that the prophecy will put me on the path to become a Dragonlord. Heroic Tasks: found a new order of Dragonlords (find the Fortress of the Dragonlords, the magic item instant fortress); attune with one of the Crowns of the Dragonlords (allowing me to cast Bond of the Dragonlords and Dirge of the Dragonlords); find a dragon egg, hatch it and raise the dragon as my companion."
		},
		"haunted one" : {
			name : "Haunted One", page : 35,
			scores : "Dexterity, Intelligence, and Wisdom", feats : ["Musician", "Divine Blessing: Magic Resistance"],
			skills : ["Arcana", "Investigation"], tool : [["Musical instrument", 1]], gold : 29,
			equip : ["Musical instrument (same as above)", "Fine clothes"],
			text : "I once possessed the rarest treasure in Thylea: a truly happy life. Then one day I returned home to find my house cold and empty, and my friends and neighbors with no memory of my family, as if they never existed. I've resolved to find my family, whatever the cost. Restrictions: I must be a native to Thylea. Adventure Hook: The Oracle claims that saving the world and fulfilling the prophecy will give me answers about my family's disappearance. Heroic Tasks: be reunited with my family; reclaim my family name by tracking down family artifacts (one lesser: Ring of Protection, Amulet of Health, or Ioun Stone of Awareness; and one greater: Helm of Brilliance, Dancing Sword [any type], or Rod of Absorption)."
		},
		"lost one" : {
			name : "Lost One", page : 36,
			scores : "Constitution, Dexterity, and Wisdom", feats : ["Alert", "Divine Blessing: Luck"],
			skills : ["Insight", "Sleight of Hand"], tool : [["Navigator's tools", "Wis"]], gold : 20,
			equip : ["Dagger", "Navigator's tools", "Rope", "Traveler's clothes"],
			text : "I hail from a distant land where my people worshiped foreign gods. I sailed in search of the fabled treasures of the Dragonlords, but my ship and most of my crew were destroyed in a storm. Found by fishermen and brought to Mytros, I discovered my arrival had been prophesied by the Oracle. Restrictions: I must be an explorer from distant lands. Adventure Hook: The Oracle thinks I was sent from the outside world by the gods to fulfill the prophecy. Heroic Tasks: find my surviving crew members; find a way to get back home; find the fabled treasures of the Dragonlords (three gems worth 10,000 GP, 2,000 PP, 10,000 GP and one of: Gem of Seeing, Necklace of Prayer Beads, Glamoured Studded Leather, or Rod of Rulership)."
		},
		"vanished one" : {
			name : "Vanished One", page : 37,
			scores : "Charisma, Dexterity, and Intelligence", feats : ["Savage Attacker", "Divine Blessing: the Dragonlords"],
			skills : ["Deception", "Stealth"], tool : [["Thieves' tools", "Dex"]], gold : 20,
			equip : ["Dagger", "Navigator's tools", "Rope", "Thieves' tools", "Fine clothes"],
			text : "I am one of the Dragonlords, the legendary outside explorers who first discovered Thylea. I've been missing for almost 500 years, trapped in a waking dream in the cave of the nymph Versi (known as the Oracle) until fate called me to save Thylea; she made me swear an oath to return to her. I must relearn the skills lost to me. Restrictions: I must be an explorer from distant lands. Adventure Hook: I am the Oracle's favorite pet. Heroic Tasks: find if I have any descendants; reclaim my title as a Dragonlord (attune with a Crown of the Dragonlords to cast Bond of the Dragonlords and Dirge of the Dragonlords; find a dragon egg, hatch it and raise the dragon as my companion); get back my fabled armor (one of: Boots of Speed, Dragon Scale Mail, or Cloak of the Bat [only I can attune; transforms me into a pseudodragon])."
		}
	};
	for (var key in bgs) {
		var b = bgs[key];
		BackgroundList[key] = {
			name : b.name,
			regExpSearch : new RegExp("^(?=.*" + key.replace(" ", ")(?=.*") + ").*$", "i"),
			source : [["OotD", b.page - 0]],
			feature : b.name,
			scorestxt : "+2 to one and +1 to another -or- +1 to all three: " + b.scores,
			skills : b.skills,
			toolProfs : b.tool,
			gold : b.gold,
			equipleft : b.equip.map(function (e) { return [e, "", ""]; }),
			equipright : [["Belt pouch (with coins)", "", 1]],
			lifestyle : "modest"
		};
		BackgroundFeatureList[key] = {
			source : [["OotD", b.page - 0]],
			description : b.text,
			featsAdd : b.feats
		};
	}
}());

// ---------- SUBCLASSES (Player's Guide ch. 4, pp. 38-61) ----------

// Barbarian: Herculean Path (p. 39)
AddSubClass("barbarian", "herculean path", {
	regExpSearch : /^(?=.*(barbarian|marauder|berserker))(?=.*herculean).*$/i,
	subname : "Herculean Path",
	source : [["OotD", 39]],
	features : {
		"subclassfeature3" : {
			name : "Precocious Wrestler",
			source : [["OotD", 39]],
			minlevel : 3,
			description : desc([
				"Mighty Arms: While Raging, I can make one Unarmed Strike as a Bonus Action",
				"Iron Grip: While grappling a creature, I can wield a Two-Handed weapon with my free hand. While Raging, I can use the Grapple or Shove option of my Unarmed Strike against Huge or smaller creatures",
				"Natural Vigor: Expertise in Athletics (if already proficient, I can instead gain proficiency in another Barbarian skill)"
			]),
			action : [["bonus action", "Mighty Arms (Unarmed Strike, while Raging)"]],
			skills : [["Athletics", "only"]]
		},
		"subclassfeature6" : {
			name : "Mighty Marksman",
			source : [["OotD", 39]],
			minlevel : 6,
			description : desc([
				"Great Bow: Longbows have the Finesse property when I wield them",
				"Thunderous Shot: When I hit with a ranged weapon attack, I can roll d8s equal to my Rage Damage bonus; each creature in a 10-ft-radius Sphere centered on the target takes the total as Thunder damage, and is Prone if Large or smaller",
				"Once used, I can't use it again until a Long Rest, unless I expend a use of Rage (no action) to restore it"
			]),
			usages : 1,
			recovery : "long rest",
			additional : "or expend a Rage use"
		},
		"subclassfeature10" : {
			name : "Herculean Rage",
			source : [["OotD", 39]],
			minlevel : 10,
			description : desc([
				"While Raging, I add my Rage Damage bonus to the save DC of the Grapple and Shove options of my Unarmed Strike",
				"While Raging, I have Immunity to the Frightened condition; if Frightened when I enter my Rage, it ends"
			]),
			savetxt : { immune : ["frightened (while raging)"] }
		},
		"subclassfeature14" : {
			name : "Earthshaker",
			source : [["OotD", 39]],
			minlevel : 14,
			usages : 1,
			recovery : "long rest",
			description : desc([
				"When I activate my Rage, I can enter an earthshaking form for 1 minute or until I drop to 0 HP",
				"Quaking Steps: Once per turn when I move 5+ ft, creatures of my choice in a 40-ft Emanation make a Dex save (DC 8 + Str mod + PB) or are Prone and lose Concentration",
				"Seismic Strike: The first target I hit with a Melee weapon or Unarmed Strike each turn takes +1d6 Bludgeoning damage. Hitting an object is a Critical Hit"
			])
		}
	}
});

// Bard: College of Epic Poetry (p. 41)
AddSubClass("bard", "college of epic poetry", {
	regExpSearch : /^(?=.*(bard|skald|minstrel))(?=.*epic)(?=.*poet).*$/i,
	subname : "College of Epic Poetry",
	source : [["OotD", 41]],
	features : {
		"subclassfeature3" : {
			name : "Epic Verses",
			source : [["OotD", 41]],
			minlevel : 3,
			action : [["reaction", ""]],
			description : desc([
				"When one of these occurs by chance, I can use my Reaction and expend a Bardic Inspiration use for the listed effect; my Verse count (cumulative) then increases by 1",
				"Comedy: A creature I can see/hear rolls a natural 1 on a D20 Test; up to Cha mod (min 1) creatures within 30 ft have Disadvantage on their next D20 Test",
				"Excellence: A creature I can see/hear rolls a natural 20 on a D20 Test; up to Cha mod (min 1) creatures within 30 ft have Advantage on their next D20 Test",
				"Irony: An ally misses an attack or fails a save after rolling a Bardic Inspiration die; one creature of my choice subtracts that roll from its next attack roll or save",
				"Tragedy: An ally I can see/hear is reduced to 0 HP by an enemy; I roll a Bardic Inspiration die and the ally gains that many HP",
				"If I am within 5 ft of the creature that triggers Epic Verses, I don't expend a Bardic Inspiration use"
			])
		},
		"subclassfeature3.1" : {
			name : "Armored Poet",
			source : [["OotD", 41]],
			minlevel : 3,
			description : desc("I gain training with Medium armor"),
			armorProfs : [false, true, false, false]
		},
		"subclassfeature6" : {
			name : "Inspirational Verses",
			source : [["OotD", 41]],
			minlevel : 6,
			description : desc([
				"A creature that gains my Bardic Inspiration die also gains one of these benefits while it has the die:",
				"Agility: +10 ft Speed; movement unaffected by Difficult Terrain",
				"Vigor: Resistance to one damage type (my choice) and Temp HP equal to half my Bard level",
				"Foresight (Verse 15): +1d4 to Initiative; treats a Bardic Inspiration roll of 4 or lower as a 5",
				"Ingenuity (Verse 30): Advantage on Int and Cha saves; treats a Wis save roll of 9 or lower as a 10",
				"Power (Verse 60): Weapon/Unarmed Strike crits on 19-20; reroll one die when it has Advantage on an attack roll",
				"Protection (Verse 90): When reduced to 0 HP, it can roll the die and be reduced to that number of HP instead (die lost)",
				"Spellheart (Verse 120): Spell save DC and spell attack bonus each +1"
			])
		},
		"subclassfeature14" : {
			name : "Poetic End",
			source : [["OotD", 41]],
			minlevel : 14,
			action : [["action", " (Magic action)"]],
			description : desc([
				"Magic action: end all my ongoing Bardic Inspirations; each creature that had one rolls 1d4+1 and can restore a combined number of charges of features/magic items that regain all uses on a Long Rest or at dawn equal to the total rolled (not Spellcasting or Mystic Arcanum, nor features needing more than one Long Rest)",
				"After use, I can't use this again until I finish a number of Long Rests equal to the number of creatures affected + 1"
			])
		}
	}
});

// Cleric: Prophecy Domain (p. 43)
AddSubClass("cleric", "prophecy domain", {
	regExpSearch : /^(?=.*(cleric|priest|clergy|acolyte|oracle))(?=.*(prophecy|prophetic)).*$/i,
	subname : "Prophecy Domain",
	source : [["OotD", 43]],
	features : {
		"subclassfeature3" : {
			name : "Prophecy Domain Spells",
			source : [["OotD", 43]],
			minlevel : 3,
			description : desc("I always have the listed Prophecy Domain spells prepared (level 3: Augury, Bless, Identify, Lesser Restoration; 5: Beacon of Hope, Clairvoyance; 7: Death Ward, Divination; 9: Telepathic Bond, Scrying)"),
			spellcastingExtra : ootdSpellsExist(["augury", "bless", "identify", "lesser restoration", "beacon of hope", "clairvoyance", "death ward", "divination", "rary's telepathic bond", "scrying"])
		},
		"subclassfeature3.1" : {
			name : "Blessing of Foresight",
			source : [["OotD", 43]],
			minlevel : 3,
			description : desc("When I cast a Divination spell of level 1+ using a Spell Slot, one creature I can see gains Temporary Hit Points equal to my Wisdom modifier + Cleric level")
		},
		"subclassfeature3.2" : {
			name : "Channel Divinity: Prophetic Trance",
			source : [["OotD", 43]],
			minlevel : 3,
			action : [["bonus action", ""], ["reaction", "Prophetic Trance (D20 Test)"]],
			description : desc([
				"Use Channel Divinity as a Bonus Action to enter a trance for 10 minutes",
				"Whenever a creature I can see within 60 ft makes or fails a D20 Test, I can use my Reaction to: treat the d20 roll as a 10; have it reroll and use the higher roll; or add 1d4 to the result",
				"After I use my Reaction this way, the trance ends unless I gain 1 level of Exhaustion"
			])
		},
		"subclassfeature6" : {
			name : "Visions of Danger",
			source : [["OotD", 43]],
			minlevel : 6,
			usages : 2,
			recovery : "short rest",
			action : [["reaction", "Flash of Foresight"]],
			description : desc([
				"Flash of Foresight: When an ally takes damage or fails a save, I can use my Reaction to move up to my Speed and cast a Divination spell or a spell that restores HP to one creature (casting time must be Reaction, action, or Bonus Action)",
				"Augury Master: While in a Prophetic Trance, I can also use my Reaction when a creature I can see within 60 ft makes a D20 Test to: have it reroll and use the lower roll; or subtract 1d4 from the result"
			])
		},
		"subclassfeature17" : {
			name : "Perfect Foresight",
			source : [["OotD", 43]],
			minlevel : 17,
			usages : "Wisdom modifier per ",
			usagescalc : "event.value = Math.max(1, What('Wis Mod'));",
			recovery : "Prophetic Trance",
			action : [["reaction", "Perfect Foresight (D20 Test)"]],
			description : desc([
				"In a Prophetic Trance, with my Reaction on a D20 Test of a creature I can see within 60 ft, I can: treat the d20 roll as a 2; treat it as a 19; or add 1d10 to the result",
				"The trance ends after I use all these uses unless I gain 1 level of Exhaustion, in which case it continues",
				"While in the trance: Darkvision 120 ft; I can see Invisible creatures and objects"
			])
		}
	}
});

// Druid: Circle of Sacrifice (p. 45)
AddSubClass("druid", "circle of sacrifice", {
	regExpSearch : /^(?=.*(druid|shaman))(?=.*sacrifice).*$/i,
	subname : "Circle of Sacrifice",
	source : [["OotD", 45]],
	features : {
		"subclassfeature3" : {
			name : "Circle of Sacrifice Spells",
			source : [["OotD", 45]],
			minlevel : 3,
			description : desc([
				"I know the Fire Bolt cantrip and always have the Circle of Sacrifice spells prepared (3: Burning Hands, Flame Blade; 5: Fireball; 7: Wall of Fire; 9: Flame Strike)",
				"When I roll damage with any of those leveled spells, I add my Wisdom modifier to the damage roll"
			]),
			spellcastingExtra : ootdSpellsExist(["burning hands", "flame blade", "fireball", "wall of fire", "flame strike"]),
			spellcastingBonus : [{
				name : "Circle of Sacrifice",
				spells : ["fire bolt"],
				selection : ["fire bolt"],
				level : [0, 0]
			}],
			calcChanges : {
				spellAdd : [
					function (spellKey, spellObj, spName) {
						if (spName.indexOf("druid") !== -1 && ["burning hands", "flame blade", "fireball", "wall of fire", "flame strike"].indexOf(spellKey) !== -1) {
							spellObj.description = spellObj.description + (spellObj.description ? "; " : "") + "+ Wis mod to damage";
							return true;
						}
					},
					"When I roll damage with Burning Hands, Flame Blade, Fireball, Wall of Fire, or Flame Strike, I add my Wisdom modifier to the damage roll."
				]
			}
		},
		"subclassfeature3.1" : {
			name : "Ritual of Sacrifice",
			source : [["OotD", 45]],
			minlevel : 3,
			usages : "Wisdom modifier per ",
			usagescalc : "event.value = Math.max(1, What('Wis Mod'));",
			recovery : "short rest",
			description : desc("When I reduce a creature to 0 HP with Fire damage, I can immolate it as a sacrificial offering: I and each ally within 60 ft of it gain the effects of Bless for 1 minute (no Concentration required)")
		},
		"subclassfeature6" : {
			name : "Ritual of Mistletoes",
			source : [["OotD", 45]],
			minlevel : 6,
			usages : "Wisdom modifier d4s per ",
			usagescalc : "event.value = Math.max(1, What('Wis Mod'));",
			recovery : "long rest",
			additional : "or 2 Wild Shape uses (Bonus Action)",
			action : [["bonus action", ""]],
			description : desc([
				"I have sprigs of mistletoe (d4s) equal to my Wisdom modifier; as a Bonus Action I expend one for one of these, cast without a spell slot:",
				"Divining Ritual: Detect Magic; Healing Ritual: Cure Wounds; Purification Ritual: Purify Food and Drink; Song of the Solstice: Heroism",
				"When I cast a spell that restores HP, I can expend up to my Proficiency Bonus in sprigs, roll them, and add the total to the HP restored",
				"I regain all sprigs on a Long Rest, or by expending 2 Wild Shape uses as a Bonus Action"
			])
		},
		"subclassfeature10" : {
			name : "Keeper of the Law",
			source : [["OotD", 45]],
			minlevel : 10,
			description : desc([
				"High Mistletoe: My sprigs of mistletoe become d8s",
				"Sacrificial Offering: As a Bonus Action I mark a creature I can see for 1 hour. When an ally hits it, I can use my Reaction to expend a sprig, roll it, and add the result as Fire damage",
				"If a Sacrificial Offering is reduced to 0 HP, I can activate Ritual of Sacrifice on it"
			]),
			action : [["bonus action", "Sacrificial Offering"], ["reaction", "Sacrificial Offering (extra damage)"]]
		},
		"subclassfeature14" : {
			name : "Astrological Wisdom",
			source : [["OotD", 45]],
			minlevel : 14,
			action : [["bonus action", "Burning Omen (mark/renew)"]],
			description : desc([
				"Elder Mistletoe: My sprigs of mistletoe become d12s",
				"Burning Omen: When I mark a Sacrificial Offering (or later as a Bonus Action), I can expend a sprig: until the start of my next turn I can use Sacrificial Offering once per turn without a Reaction (still expending a sprig)",
				"Stone Circle: I always have Teleportation Circle prepared. With 8 hours and 1,000 GP I can build a circle of twelve standing stones (10 ft tall, 1 ton each) as a permanent anchor for Teleportation Circle"
			]),
			spellcastingExtra : ootdSpellsExist(["teleportation circle"])
		}
	}
});

// Fighter: Hoplite (p. 47)
AddSubClass("fighter", "hoplite", {
	regExpSearch : /^(?=.*(fighter|soldier|warrior))(?=.*hoplite).*$/i,
	subname : "Hoplite",
	source : [["OotD", 47]],
	features : {
		"subclassfeature3" : {
			name : "Phalanx Fighting",
			source : [["OotD", 47]],
			minlevel : 3,
			description : desc([
				"While I have a Shield equipped: +1 additional AC; Advantage on saves to avoid the Prone condition or being pushed; allies within 5 ft of me have Half Cover",
				"When I wield a spear: it gains the Reach property and its damage becomes 1d8 (one-handed) or 1d10 (two-handed)"
			]),
			savetxt : { text : ["Adv. on saves to avoid being knocked Prone or pushed (with a Shield equipped)"] }
		},
		"subclassfeature3.1" : {
			name : "Reprisal",
			source : [["OotD", 47]],
			minlevel : 3,
			action : [["reaction", ""]],
			description : desc([
				"While wielding a weapon with the Reach property, when a creature within my reach attacks an ally I can see, I can use my Reaction to make one melee attack against it",
				"If my attack hits, the target subtracts my Proficiency Bonus from the triggering attack"
			])
		},
		"subclassfeature7" : {
			name : "Spear Mastery",
			source : [["OotD", 47]],
			minlevel : 7,
			description : desc([
				"Improved Reach: With a Reach weapon, I add 10 ft to my reach instead of 5",
				"Improved Critical: Attack rolls with javelins, or melee weapons with the Light or Reach property that lack Heavy, crit on a 19 or 20",
				"Javelin Expert: With a javelin, its damage die becomes 1d8 and its range 60/180 ft (once per turn)"
			])
		},
		"subclassfeature10" : {
			name : "Shield Mastery",
			source : [["OotD", 47]],
			minlevel : 10,
			description : desc([
				"While I have a Shield equipped:",
				"Shield Rush: When I use Tactical Shift I charge a creature with my Shield; it makes a Str save (DC 8 + Str mod + PB) or takes 1d4 Bludgeoning and I can knock it Prone, push it up to 10 ft, or both",
				"Shield Wall: When an effect allows a Dex save for half damage, I can use a Str save instead: no damage on a success, half on a failure. One creature within 5 ft subjected to the same effect also takes no damage on a success and half on a failure"
			])
		},
		"subclassfeature15" : {
			name : "Promachos",
			source : [["OotD", 47]],
			minlevel : 15,
			action : [["reaction", "Heroic Riposte"]],
			description : desc([
				"Superior Critical: Attack rolls with javelins, or melee weapons with Light or Reach that lack Heavy, crit on 19-20. On a melee weapon crit I deal extra damage equal to my Str modifier (weapon's type) and knock away the target's Shield (lands up to 10 ft away)",
				"Heroic Riposte: Wielding a weapon in one hand, when a creature misses me with a melee attack I can use my Reaction to make one melee attack against it with a Light weapon, with Advantage; I can stow my one-handed weapon and draw this weapon as part of the same Reaction"
			])
		},
		"subclassfeature18" : {
			name : "Myrmidon Fury",
			source : [["OotD", 47]],
			minlevel : 18,
			description : desc("When I take the Attack action, I can forgo one attack to draw a Light melee weapon and make one melee weapon attack with it against each creature of my choice within 5 ft (separate attack roll for each)")
		}
	}
});

// Monk: Way of the Shield / Warrior of the Shield (p. 49)
AddSubClass("monk", "warrior of the shield", {
	regExpSearch : /^(?=.*(monk|martial artist))(?=.*shield).*$/i,
	subname : "Warrior of the Shield",
	source : [["OotD", 49]],
	features : {
		"subclassfeature3" : {
			name : "Aresian Technique",
			source : [["OotD", 49]],
			minlevel : 3,
			description : desc([
				"I gain training with Shields; wielding a Shield doesn't impede my Acrobatic Movement, Martial Arts, Unarmored Movement, or Unarmored Defense",
				"My Shield is considered a Monk weapon",
				"While I wield a Shield, Opportunity Attacks against me have Disadvantage"
			]),
			armorProfs : [false, false, false, true]
		},
		"subclassfeature6" : {
			name : "Shield Dancer",
			source : [["OotD", 49]],
			minlevel : 6,
			action : [["bonus action", "Vaulting Strike (1 Focus Point)"], ["reaction", "Counterattack"]],
			description : desc([
				"Vaulting Strike: Bonus Action, 1 Focus Point: leap up to 15 ft in any direction. If wielding a Shield, no Opportunity Attacks. If I take the Attack action immediately after, my melee attacks have Advantage and crit on 18-20 until the end of the turn",
				"Counterattack: When a creature misses me with an Opportunity Attack and I'm using a Shield, I can use my Reaction to make a melee weapon attack or Unarmed Strike against it without interrupting my movement"
			])
		},
		"subclassfeature11" : {
			name : "Shell of the Dragon Turtle",
			source : [["OotD", 49]],
			minlevel : 11,
			action : [["reaction", " (2 Focus Points)"]],
			description : desc("When I'm attacked, I can use my Reaction and spend 2 Focus Points to gain an additional +5 AC from my Shield (including against the triggering attack) until the start of my next turn")
		},
		"subclassfeature17" : {
			name : "Undaunted Spirit",
			source : [["OotD", 49]],
			minlevel : 17,
			action : [["action", " (1+ Focus Points)"]],
			description : desc([
				"As an Action, spend 1 Focus Point to throw my Shield at two targets within 90 ft (+1 Focus Point per extra target, up to four)",
				"Ranged attack vs each; being within 5 ft of a creature doesn't impose Disadvantage. On a hit: two rolls of my Martial Arts die + Dex or Str mod (a magical Shield's AC bonus is added to damage)",
				"After the last target, the Shield flies back to my hand"
			])
		}
	}
});

// Ranger: Amazon (p. 51)
AddSubClass("ranger", "amazon", {
	regExpSearch : /^(?=.*(ranger|huntress|hunter))(?=.*amazon).*$/i,
	subname : "Amazon",
	source : [["OotD", 51]],
	features : {
		"subclassfeature3" : {
			name : "Amazonian Magic",
			source : [["OotD", 51]],
			minlevel : 3,
			description : desc("I always have these spells prepared (3: Command; 5: Find Steed; 9: Haste; 13: Confusion; 17: Mislead)"),
			spellcastingExtra : ootdSpellsExist(["command", "find steed", "haste", "confusion", "mislead"])
		},
		"subclassfeature3.1" : {
			name : "Stimfay Companion",
			source : [["OotD", 51]],
			minlevel : 3,
			usages : 1,
			recovery : "long rest",
			additional : "or expend a spell slot of 1st level or higher",
			action : [["action", ""], ["bonus action", "Command Stimfay"]],
			description : desc([
				"As an Action I summon a clockwork-bird Stimfay bound to me within 30 ft (see its stat block; uses my PB)",
				"It's friendly, shares my initiative and acts right after me; it only takes the Dodge action unless I use a Bonus Action to command it (or if I'm Incapacitated)",
				"It remains until reduced to 0 HP, until I summon it again, or until I die; its gear is left behind",
				"Once summoned, I can't do so again until a Long Rest unless I expend a spell slot of level 1+"
			]),
			creaturesAdd : [["Stimfay", true]]
		},
		"subclassfeature7" : {
			name : "Amazonian Battle Cry",
			source : [["OotD", 51]],
			minlevel : 7,
			usages : "Wisdom modifier per ",
			usagescalc : "event.value = Math.max(1, What('Wis Mod'));",
			recovery : "long rest",
			action : [["action", " (start of my turn, no action needed)"]],
			description : desc([
				"At the start of my turn I shout my battle cry and enter a Frenzy that lasts until the end of my next turn, granting ONE of:",
				"\u2022 Resistance to every damage type except Force, Necrotic, Psychic, and Radiant",
				"\u2022 I and my Stimfay have Advantage on attacks against a creature I have Hunter's Mark on; when either of us deals damage to it, add my Proficiency Bonus to the damage",
				"\u2022 Immediately after reducing a creature to 0 HP with a weapon, I make an attack with the same weapon",
				"\u2022 Immunity to the Charmed and Frightened conditions (if Charmed or Frightened when I enter the Frenzy, it ends)"
			])
		},
		"subclassfeature11" : {
			name : "Chakram Technique",
			source : [["OotD", 51]],
			minlevel : 11,
			description : desc([
				"When I throw a Chakram I can ignore all forms of Cover and target creatures not in my line of sight (such as around corners)",
				"When I take the Attack action and hit a creature or object with a Ranged attack using a Chakram, I can forgo my next attack this turn to target any number of additional creatures of my choice within 10 ft of that target; each makes a Dex save against my spell save DC and takes the same damage as my first target on a failure"
			])
		},
		"subclassfeature15" : {
			name : "Bracer Reflection",
			source : [["OotD", 51]],
			minlevel : 15,
			usages : "Wisdom modifier per ",
			usagescalc : "event.value = Math.max(1, What('Wis Mod'));",
			recovery : "short rest",
			action : [["reaction", ""]],
			description : desc([
				"When I would be hit by an attack, I can use my Reaction to gain +5 AC against all attacks (including the triggering one) until the start of my next turn",
				"If the triggering attacker misses, it takes Force damage equal to a number of d6s equal to my Dexterity modifier"
			])
		}
	}
});

// Rogue: Odyssean (p. 53)
AddSubClass("rogue", "odyssean", {
	regExpSearch : /^(?=.*(rogue|thief|scoundrel))(?=.*odyssean).*$/i,
	subname : "Odyssean",
	source : [["OotD", 53]],
	features : {
		"subclassfeature3" : {
			name : "Rogue of Many Ways",
			source : [["OotD", 53]],
			minlevel : 3,
			action : [["action", "Concealed Approach"], ["bonus action", "Quick Scheme"]],
			description : desc([
				"Concealed Approach: As an Action, for 10 min each creature of my choice within 30 ft has Advantage on Dexterity (Stealth) checks and leaves no tracks",
				"Convincing: Deception and Persuasion checks can be made as Intelligence checks",
				"Quick Scheme: As a Bonus Action, one creature I can see within 60 ft makes an Int save (DC 8 + Int mod + PB); on a failure, I and my allies have Advantage on attacks against it until the start of my next turn. Not on the same creature more than once per combat encounter"
			])
		},
		"subclassfeature3.1" : {
			name : "Vagrant Soldier",
			source : [["OotD", 53]],
			minlevel : 3,
			armorProfs : [false, true, false, true],
			description : desc([
				"I gain training with Medium armor and Shields",
				"Spears and Tridents have the Finesse property for me",
				"I can choose an additional weapon's mastery property when I use my Rogue Weapon Mastery feature"
			])
		},
		"subclassfeature9" : {
			name : "Notorious Trickster",
			source : [["OotD", 53]],
			minlevel : 9,
			description : desc([
				"Anxious Foes: If I use a Cunning Strike option with a melee weapon attack, the target has Disadvantage on its saving throw against that option",
				"Vexing Assault: When I attack with a Finesse weapon whose mastery property I can use, I can replace that property with Vex for that attack"
			])
		},
		"subclassfeature13" : {
			name : "Tenacious Survivor",
			source : [["OotD", 53]],
			minlevel : 13,
			usages : 1,
			recovery : "short rest",
			action : [["reaction", "Steel Resolve"]],
			description : desc([
				"Quick Thinking: I add my Intelligence modifier to Initiative rolls. When I roll Initiative, I can immediately move up to my Speed without provoking Opportunity Attacks. I can exchange my Initiative result with a willing ally within 60 ft",
				"Steel Resolve: When forced to roll a saving throw, I can use my Reaction to gain Advantage on it (once per Short Rest)"
			]),
			addMod : [{ type : "skill", field : "Init", mod : "Int", text : "I add my Intelligence modifier to Initiative rolls." }]
		},
		"subclassfeature17" : {
			name : "Clever as the Gods",
			source : [["OotD", 53]],
			minlevel : 17,
			description : desc([
				"I'm constantly under the effects of the Mind Blank spell",
				"New Cunning Strike options: Expose (Cost: 6d6): each creature within 30 ft of the target can use a Reaction to make an attack against it",
				"Disrupt (Cost: 2d6): the target has Disadvantage on saves to maintain Concentration until the end of its next turn, including this attack"
			])
		}
	}
});

// Sorcerer: Divine Sorcery (p. 55)
// Helper: an array of 20 entries for the `times` attribute of spellcastingBonus: 1 from the given level onwards, else 0
function ootdTimesFromLevel(lvl) {
	return levels.map(function (n) { return n >= lvl ? 1 : 0; });
}
function ootdDomainSpells(domainName, tiers) {
	var bonus = [];
	[3, 5, 7, 9].forEach(function (lvl, i) {
		ootdSpellsExist(tiers[i]).forEach(function (spell) {
			bonus.push({
				name : "Divine Sorcery: " + domainName,
				spells : [spell],
				selection : [spell],
				firstCol : "oncesr",
				times : ootdTimesFromLevel(lvl)
			});
		});
	});
	return bonus;
}
AddSubClass("sorcerer", "divine sorcery", {
	regExpSearch : /^(?=.*(sorcerer|sorcery))(?=.*(divine|demigod)).*$/i,
	subname : "Divine Sorcery",
	source : [["OotD", 55]],
	features : {
		"subclassfeature3" : {
			name : "Godly Ancestor",
			source : [["OotD", 55]],
			minlevel : 3,
			description : desc([
				"Choose the Divine Domain of my godly ancestor (Good, Evil, Law, or Chaos) from the Divine Sorcery and Spells table",
				"I can cast each of the associated spells once without a spell slot, regaining the ability after a Short or Long Rest (spells are gained at Sorcerer levels 3, 5, 7, and 9)",
				"When I make a Charisma check to interact with Celestials (including gods), my Proficiency Bonus is doubled if it applies, unless I have Expertise in the skill"
			]),
			choices : ["Good", "Evil", "Law", "Chaos"],
			"good" : {
				name : "Divine Domain: Good",
				source : [["OotD", 55]],
				description : desc("Good spells (3: Aid, Bless, Healing Word, Lesser Restoration; 5: Mass Healing Word, Revivify; 7: Aura of Life, Death Ward; 9: Greater Restoration, Mass Cure Wounds), each once per Short or Long Rest"),
				spellcastingBonus : ootdDomainSpells("Good", [
					["aid", "bless", "healing word", "lesser restoration"],
					["mass healing word", "revivify"],
					["aura of life", "death ward"],
					["greater restoration", "mass cure wounds"]
				])
			},
			"evil" : {
				name : "Divine Domain: Evil",
				source : [["OotD", 55]],
				description : desc("Evil spells (3: Ray of Sickness, Witch Bolt, Blindness/Deafness, Heat Metal; 5: Animate Dead, Vampiric Touch; 7: Summon Aberration, Phantasmal Killer; 9: Cloudkill, Contagion), each once per Short or Long Rest"),
				spellcastingBonus : ootdDomainSpells("Evil", [
					["ray of sickness", "witch bolt", "blindness/deafness", "heat metal"],
					["animate dead", "vampiric touch"],
					["summon aberration", "phantasmal killer"],
					["cloudkill", "contagion"]
				])
			},
			"law" : {
				name : "Divine Domain: Law",
				source : [["OotD", 55]],
				description : desc("Law spells (3: Command, Guiding Bolt, Augury, Hold Person; 5: Dispel Magic, Slow; 7: Banishment, Freedom of Movement; 9: Dominate Person, Hold Monster), each once per Short or Long Rest"),
				spellcastingBonus : ootdDomainSpells("Law", [
					["command", "guiding bolt", "augury", "hold person"],
					["dispel magic", "slow"],
					["banishment", "freedom of movement"],
					["dominate person", "hold monster"]
				])
			},
			"chaos" : {
				name : "Divine Domain: Chaos",
				source : [["OotD", 55]],
				description : desc("Chaos spells (3: Charm Person, Disguise Self, Crown of Madness, Hideous Laughter; 5: Feign Death, Hypnotic Pattern; 7: Confusion, Dimension Door; 9: Animate Objects, Modify Memory), each once per Short or Long Rest"),
				spellcastingBonus : ootdDomainSpells("Chaos", [
					["charm person", "disguise self", "crown of madness", "tasha's hideous laughter"],
					["feign death", "hypnotic pattern"],
					["confusion", "dimension door"],
					["animate objects", "modify memory"]
				])
			}
		},
		"subclassfeature3.1" : {
			name : "Inherited Strength",
			source : [["OotD", 55]],
			minlevel : 3,
			description : desc("I am proficient in Strength saving throws and have Advantage on Constitution saves to maintain Concentration on a spell"),
			saves : ["Str"],
			savetxt : { text : ["Adv. on Con saves to maintain Concentration"] }
		},
		"subclassfeature6" : {
			name : "Empowered Magic",
			source : [["OotD", 55]],
			minlevel : 6,
			description : desc("When I cast a spell, I can spend 1 Sorcery Point to increase its effective level by 1 (only by 1), e.g. cast Fireball with a level 5 slot as a level 6 spell")
		},
		"subclassfeature14" : {
			name : "Divine Resistance",
			source : [["OotD", 55]],
			minlevel : 14,
			usages : 1,
			recovery : "short rest",
			description : desc("When I fail a saving throw, I can choose to succeed instead. If the effect deals half damage on a success, I take no damage instead")
		},
		"subclassfeature18" : {
			name : "Ascendant Sorcery",
			source : [["OotD", 55]],
			minlevel : 18,
			description : desc("When I use Empowered Magic, I can increase the spell's effective level by more than 1, spending 1 Sorcery Point per level added; the effective level can't exceed 10")
		}
	}
});

// Warlock: The Fates (p. 57)
AddSubClass("warlock", "the fates", {
	regExpSearch : /^(?=.*warlock)(?=.*\bfates\b).*$/i,
	subname : "The Fates",
	source : [["OotD", 57]],
	features : {
		"subclassfeature3" : {
			name : "Fates Spells",
			source : [["OotD", 57]],
			minlevel : 3,
			description : desc("I always have these spells prepared (3: Detect Evil and Good, Identify, Levitate, See Invisibility; 5: Clairvoyance, Call Lightning; 7: Arcane Eye, Divination; 9: Planar Binding, Geas)"),
			spellcastingExtra : ootdSpellsExist(["detect evil and good", "identify", "levitate", "see invisibility", "clairvoyance", "call lightning", "arcane eye", "divination", "planar binding", "geas"])
		},
		"subclassfeature3.1" : {
			name : "Fate's Bidding",
			source : [["OotD", 57]],
			minlevel : 3,
			usages : 1,
			recovery : "long rest",
			additional : "or expend a Pact Magic slot",
			description : desc([
				"At the end of a Short or Long Rest, I can cast one Divination spell I know or have prepared without a spell slot (I provide material components)",
				"When I cast a spell this way, I gain Temporary HP equal to my Warlock level",
				"Once used, I can't use it again until a Long Rest unless I expend a Pact Magic slot (no action) to restore its use"
			])
		},
		"subclassfeature3.2" : {
			name : "Threadreader's Insight",
			source : [["OotD", 57]],
			minlevel : 3,
			usages : "Charisma modifier per ",
			usagescalc : "event.value = Math.max(1, What('Cha Mod'));",
			recovery : "long rest",
			action : [["reaction", ""]],
			description : desc("When a creature I can see within 60 ft casts a spell that requires a saving throw, I can use my Reaction to impose Disadvantage on one target of the spell's saving throw")
		},
		"subclassfeature6" : {
			name : "Fate's Foretelling",
			source : [["OotD", 57]],
			minlevel : 6,
			action : [["action", " (new roll, Magic action)"]],
			description : desc([
				"When I finish a Short or Long Rest, I roll 1d20 and record it. I can replace any D20 Test made by me or a creature I can see with this roll (choose before the roll); it can be used only once",
				"If I have no foretelling rolls, I can use a Magic action and expend a Pact Magic slot to make a new one. Unused rolls are lost when I finish a Short or Long Rest"
			])
		},
		"subclassfeature10" : {
			name : "Fate's Demands",
			source : [["OotD", 57]],
			minlevel : 10,
			usages : 1,
			recovery : "short rest",
			description : desc([
				"Sever the Thread: When I reduce an Enemy to 0 HP, I regain one expended Pact Magic slot, and I have the Fates Coven Spells prepared for 1 hour",
				"Fates Coven Spells: Bestow Curse, Counterspell, Identify, Lightning Bolt, Locate Object, Polymorph, Scrying",
				"Once used, I can't use it again until I finish a Short or Long Rest"
			])
		},
		"subclassfeature14" : {
			name : "Tangled Fate",
			source : [["OotD", 57]],
			minlevel : 14,
			action : [["action", " (Magic action)"]],
			description : desc([
				"Magic action: choose two creatures I can see within 60 ft; each makes a Wisdom save against my spell save DC with Disadvantage. If both fail, they are Threadbound for 1 minute",
				"While Threadbound, when one creature takes damage, the other takes the same amount as Psychic damage",
				"If a Threadbound creature ends its turn more than 30 ft from the other, both take 3d10 Psychic damage"
			])
		}
	}
});

// Wizard: Academy Philosopher (pp. 59-61)
(function () {
	var phil = function (skill, name, desc1, act) {
		return {
			name : "Philosophy: " + name,
			source : [["OotD", 59]],
			description : desc(["Bonus to " + skill + " checks equal to my Intelligence modifier", desc1]),
			addMod : [{ type : "skill", field : skill, mod : "Int", text : "I add my Intelligence modifier to my " + skill + " checks (Academy Philosopher)." }],
			usages : "Intelligence modifier per ",
			usagescalc : "event.value = Math.max(1, What('Int Mod'));",
			recovery : "long rest",
			action : act
		};
	};
	AddSubClass("wizard", "academy philosopher", {
		regExpSearch : /^(?=.*(wizard|mage|magister))(?=.*(academy|philosopher)).*$/i,
		subname : "Academy Philosopher",
		source : [["OotD", 59]],
		features : {
			"subclassfeature3" : {
				name : "Philosophical School",
				source : [["OotD", 59]],
				minlevel : 3,
				description : desc("Choose a Philosophy; it gives a bonus to a skill equal to my Intelligence modifier and a feature usable Int mod times per Long Rest"),
				choices : ["Cynicism", "Empiricism", "Epicureanism", "Hedonism", "Skepticism", "Sophism", "Stoicism"],
				"cynicism" : phil("Survival", "Cynicism", "Reaction when I finish casting a spell of level 1+: gain Temporary HP equal to twice the spell's level + my Int mod, or grant them to an ally I can see within 30 ft", [["reaction", "Cynicism (after casting a spell)"]]),
				"empiricism" : phil("Perception", "Empiricism", "At the start of my turn I can closely observe a creature or object I can see within 60 ft: I learn a creature's damage Vulnerabilities, Resistances, and Immunities, and gain Advantage on my next attack roll against it"),
				"epicureanism" : phil("Medicine", "Epicureanism", "Reaction when a creature I can see targets me with an attack: Disadvantage on the attack roll. If it still hits, I gain Temporary HP equal to twice my Int mod before the damage is dealt", [["reaction", "Epicureanism"]]),
				"hedonism" : phil("Performance", "Hedonism", "When I regain HP from a spell or ability, I can add twice my Wizard level to the HP restored"),
				"skepticism" : phil("Arcana", "Skepticism", "Reaction when a creature I can see within 60 ft casts a spell: it makes a Cha save against my spell save DC or the spell doesn't take effect until the start of its next turn (fails if the caster dies or is Incapacitated before then)", [["reaction", "Skepticism"]]),
				"sophism" : phil("Persuasion", "Sophism", "Bonus Action: one creature within 30 ft that can see/hear me makes a Wis save against my spell save DC or, until the end of its next turn, has Disadvantage on its next attack roll, can't take Reactions, or can't speak, cast a spell with a Verbal component, or utter a command (my choice)", [["bonus action", "Sophism"]]),
				"stoicism" : phil("Insight", "Stoicism", "When I'm reduced to 0 HP but not killed outright, I can use my Reaction to expend a spell slot and drop to HP equal to four times the slot's level instead", [["reaction", "Stoicism"]])
			},
			"subclassfeature6" : {
				name : "Mathematical Principles",
				source : [["OotD", 61]],
				minlevel : 6,
				usages : "Intelligence modifier per ",
				usagescalc : "event.value = Math.max(1, What('Int Mod'));",
				recovery : "long rest",
				description : desc("When I make a spell attack roll for a spell of 1st level or higher, I can treat a roll of 9 or lower on the d20 as a 10")
			},
			"subclassfeature10" : {
				name : "Metaphysical Principles",
				source : [["OotD", 61]],
				minlevel : 10,
				usages : 1,
				recovery : "short rest",
				action : [["reaction", ""]],
				description : desc([
					"When a creature casts a single-target spell, I can use my Reaction to alter its course",
					"Effective level 5 or lower: I choose the target instead of the caster. Level 6 or higher: the caster makes a Con save and is subjected to the same effect on a failure"
				])
			},
			"subclassfeature14" : {
				name : "Magical Paradox",
				source : [["OotD", 61]],
				minlevel : 14,
				usages : "Intelligence modifier per ",
				usagescalc : "event.value = Math.max(1, What('Int Mod'));",
				recovery : "long rest",
				description : desc("When I would lose Concentration on a spell for any reason, I can choose to maintain it instead, as long as I'm not Incapacitated")
			}
		}
	});
}());

// ---------- SPELLS (Player's Guide ch. 5, pp. 63-64) ----------

SpellsList["dirge of the dragonlords"] = {
	name : "Dirge of the Dragonlords",
	classes : ["bard", "cleric", "paladin"],
	source : [["OotD", 63]],
	level : 2,
	school : "Necro",
	time : "1 h",
	range : "Touch",
	components : "V,M\u2020",
	compMaterial : "An offering of gems and coins worth at least 1,000 GP, which the spell consumes",
	duration : "Instantaneous",
	description : "Revive a bonded dragon dead for max 1 month (not old age) with 1 HP; closes wounds, neutralizes poison, restores organs and limbs (1,000 GP consumed)",
	descriptionFull : "You touch a bonded dragon that has been dead for no longer than 1 month and that died for any reason except old age. The dragon is revived with 1 Hit Point. This spell closes all wounds, neutralizes any poison affecting the creature when it died, and replaces damaged or missing organs and limbs."
};

SpellsList["fatebinding"] = {
	name : "Fatebinding",
	classes : ["bard", "cleric", "warlock", "wizard"],
	source : [["OotD", 63]],
	reqLoS : true,
	level : 3,
	school : "Necro",
	time : "Act",
	range : "30 ft",
	components : "V",
	duration : "1 h",
	save : "Cha",
	description : "2 crea save (Adv if Hostile; Dis if Charmed by me) or fates bound: damage/healing taken by one is mirrored on the other",
	descriptionFull : "Choose two creatures that you can see. Both creatures must make Charisma saving throws, and they do so with Advantage if they are Hostile to you. If a creature is Charmed by you, it has Disadvantage on this saving throw. If both creatures fail their saving throws, then their fates are now bound together." +
		"\n \u2022 Whenever one of the creatures takes damage, the other creature takes an identical amount of damage, unless both creatures took damage from the same single source, such as a Fireball spell." +
		"\n \u2022 Whenever one of the creatures regains Hit Points, the other creature regains an identical number of Hit Points, unless both creatures regained Hit Points from the same single source, such as Mass Cure Wounds." +
		"\n The two target creatures remain fate-bound for the duration of the spell, even if both targets are on different planes of existence."
};

SpellsList["seeds of death"] = {
	name : "Seeds of Death",
	classes : ["druid", "sorcerer", "warlock", "wizard"],
	source : [["OotD", 63]],
	level : 6,
	school : "Necro",
	time : "Act",
	range : "30 ft",
	components : "V,S,M\u0192",
	compMaterial : "Three or more minotaur teeth and alchemical fertilizer worth 100 GP",
	duration : "Conc, 10 min",
	description : "3+1/SL Minotaur Skeletons rise at start of my next turn; Bns to command; dissolve when the spell ends",
	descriptionFull : "You throw three minotaur teeth on to the ground in front of you. At the start of your next turn, three Minotaur Skeletons erupt from the ground, fully formed. You can use a Bonus Action to shout commands at the minotaur skeletons if they are within 100 ft of you. Your commands must be general orders, such as \u201Cattack that enemy\u201D or \u201Cguard this room.\u201D Once given an order, the minotaur skeletons will continue to follow it until the task is complete or until you issue another command." +
		"\n If the minotaur skeletons are given no commands, they will attack the nearest creature. When the spell ends, the minotaur skeletons dissolve into bone dust." +
		"\n " + UsingHigherLvl + "You animate an extra minotaur skeleton for each spell slot level above 6."
};

SpellsList["sleeping draught"] = {
	name : "Sleeping Draught",
	classes : ["bard", "warlock", "wizard"],
	source : [["OotD", 63]],
	level : 2,
	school : "Ench",
	time : "Act",
	range : "20 ft",
	components : "V,S,M",
	compMaterial : "A draught of liquid",
	duration : "1 min",
	save : "Wis",
	description : "1 crea save or Unconscious; success: Speed halved, no Reactions, 1 less attack; ends on damage or if shaken (5 ft); no effect on non-sleepers/Charm/Exhaustion-immune",
	descriptionFull : "You open a draught and purple mist flows from you to a target creature. The creature makes a Wisdom saving throw. On a failure, it has the Unconscious condition. On a success, the creature becomes drowsy; its Speed is halved, it can\u2019t take Reactions, and it makes one less melee or ranged attack until the end of its next turn." +
		"\n The spell ends early if the target takes damage or if someone within 5 feet takes an Action to shake it out of the spell\u2019s effect." +
		"\n A creature that does not sleep, or is Immune to the Charmed or Exhaustion conditions is not affected by this spell." +
		"\n " + UsingHigherLvl + "This spell\u2019s range increases by 20 feet for each spell slot above 2."
};

SpellsList["sword of fate"] = {
	name : "Sword of Fate",
	classes : ["bard", "cleric", "warlock", "wizard"],
	source : [["OotD", 64]],
	reqLoS : true,
	level : 5,
	school : "Illus",
	time : "Act",
	range : "60 ft",
	components : "V",
	duration : "1 h",
	save : "Dex",
	description : "1 crea cursed with a phantom sword and a command (no harm us/no magic/don't leave area); if it disobeys, Dex save or 10d8 Slashing (half on save; may decapitate)",
	descriptionFull : "Choose a creature that you can see. You curse the target for the duration of the spell, causing an illusionary sword to hang above the creature\u2019s head. Choose one of the following commands to shout out:" +
		"\n \u2022 You cannot harm us. The target creature breaks this command if they target you or your Allies with an attack or a spell that causes damage." +
		"\n \u2022 You cannot use magic. The target creature breaks this condition if they cast a spell." +
		"\n \u2022 You cannot leave this area. The target creature breaks this condition if it moves more than 30 feet from the spot it was standing when the spell was cast." +
		"\n If the creature acts contrary to your command, the sword becomes real, slices downward, and the creature makes a Dexterity saving throw. On a failure, it takes 10d8 Slashing damage and one of its heads is removed if it is reduced to 0 Hit Points by this spell, instantly killing it if it can\u2019t survive without any heads. On a success, the creature takes half as much damage only."
};

SpellsList["theogenesis"] = {
	name : "Theogenesis",
	classes : ["cleric", "sorcerer", "wizard"],
	source : [["OotD", 64]],
	level : 9,
	school : "Conj",
	time : "1 h",
	range : "Touch",
	components : "V,S,M\u0192",
	compMaterial : "Offerings worth at least 10,000 GP, which are consumed, and all three Divine Artifacts: the Caduceus, the Ambrosia, and the Promethean Fire (the artifacts are not consumed)",
	duration : "Special",
	description : "Place a divine spark in a single non-divine creature; a greater god decides (base chance 0%, cumulative bonuses); broken contact: both take 20d6 Radiant",
	descriptionFull : "Theogenesis is a powerful spell that is used to place a divine spark into a mortal creature, unlocking the potential to ascend to godhood. The artifacts are not consumed when the spell is cast, but the offerings are. Choose a single target (non-divine) creature for the spell. You must remain in contact with the target for the duration of the casting. If contact is broken, both you and the target take 20d6 Radiant damage, and both the spell and the offering are wasted. If the spell is successfully cast, then one of the greater gods must decide whether or not to grant the divine spark. The creature\u2019s relationship with the god determines its chance of success, and the base chance is 0%. Each of the bonuses below are cumulative:" +
		"\n \u2022 The target shares at least one alignment axis with the greater god: +20%" +
		"\n \u2022 The target has the exact same alignment as the greater god: +20%" +
		"\n \u2022 The target has faithfully worshipped a god in the same pantheon for at least a year: +20%" +
		"\n \u2022 The target has faithfully worshipped the greater god for at least a year: +30%" +
		"\n Failure means that the greater god decides not to grant the divine spark. That greater god can\u2019t be chosen again if the spell is cast on the same target. Success means that the target has been permanently granted a divine spark. It can only be removed with a Wish spell."
};

// ---- Legacy spells NOT covered by the Player's Guide (carried over from v13, terminology updated only) ----

// Legacy: not in the Player's Guide. The Guide's Minotaur now uses Polymorph (Cursed Transformation). Flagged for review.
SpellsList["animal polymorph"] = {
	name : "Animal Polymorph",
	classes : ["druid", "ranger", "sorcerer"],
	source : [["OotD", 340]],
	level : 3,
	school : "Trans",
	time : "Act",
	range : "60 ft",
	components : "V,S",
	duration : "Conc, 10 min",
	save : "Wis",
	description : "1 crea save or transformed into beast of my choice of CR 1 or lower without flight; charmed if not immune (legacy)",
	descriptionFull : "This spell transforms a creature you can see within range into a new beast form. An unwilling creature must make a Wisdom saving throw to avoid the effect. A shapechanger automatically succeeds on this saving throw." +
		"\n The transformation lasts for the duration, or until the target drops to 0 Hit Points or dies. The new form can be any beast of CR 1 or less that does not have a fly speed. While in this new form, the target is charmed by you and views you as a trusted ally. The target can understand simple commands such as \u201Cattack\u201D or \u201Cstay.\u201D The charm affects creatures that are immune to charm in their normal form. The charm ends immediately when the target reverts to its normal form." +
		"\n The target\u2019s game statistics, including mental ability scores, are replaced by the statistics of the chosen beast. It retains its alignment and personality. The creature is limited in the actions it can perform by the nature of its new form, and it can\u2019t speak, cast spells, or take any other action that requires hands or speech. The creature's gear melds into its new form. The creature can\u2019t activate, use, wield, or otherwise benefit from any of its equipment." +
		"\n The target assumes the Hit Points of its new form. When it reverts to its normal form, the creature returns to the number of Hit Points it had before it transformed. If it reverts as a result of dropping to 0 Hit Points, any excess damage carries over to its normal form."
};

// Legacy: not in the Player's Guide (only referenced by the Guide's Dragonlord chapter). Flagged for review.
SpellsList["bond of the dragonlords"] = {
	name : "Bond of the Dragonlords",
	classes : ["paladin"],
	source : [["OotD", 340]],
	level : 2,
	school : "Ench",
	time : "10 min",
	range : "Touch",
	components : "V,M\u2020",
	compMaterial : "Magical armor, shield, weapon, ring, rod, staff, or wand worth at least 5,000 GP, which the spell consumes, and an unhatched dragon egg",
	duration : "Special",
	description : "I or a creature I touch becomes permanently bonded to a newly-hatched metallic dragon (legacy)",
	descriptionFull : "You permanently bond with a newly-hatched metallic dragon. This requires you to locate an unhatched dragon egg and spend 1d4 days nurturing the egg so that it hatches. The hatchling may be any of the following types of dragon wyrmling: brass, bronze, copper, or silver." +
		"\n You can confer the bond to another recipient who you are touching when you cast the spell. A dragon that has been bonded can never be bonded with another target. Likewise, this spell cannot be used to bond more than one dragon to any individual." +
		"\n Wyrmlings cannot be used as mounts until they grow into young dragons. A dragon cannot use legendary actions while it is being used as a mount." +
		"\n " + toUni("Controlling the Dragon") + " Your dragon moves and acts on your initiative. You can decide how the dragon moves and attacks. While your dragon is fighting alongside you, it loses its multiattack feature. If your dragon has a breath weapon, it can be used once, and it recharges after you and the dragon complete a long rest." +
		"\n If your bonded dragon dies, you will also die within 24 hours unless the dragon is returned to life. You cannot be raised from the dead unless your bonded dragon is alive. The same is true for your dragon."
};

// ---------- EQUIPMENT (Player's Guide ch. 8, p. 81) ----------

// New weapon mastery property
WeaponMasteriesList["return"] = {
	name : "Return",
	source : [["OotD", 81]],
	description : "When I throw this weapon, hit or miss, it returns to my hand. If the attack roll misses, my next attack roll has Advantage against that creature before the end of the current turn.",
	descriptionFull : "When this weapon is thrown, hit or miss, it returns to your hand. If the attack roll misses, the next attack roll you make has Advantage against that creature before the end of the current turn."
};

WeaponsList["chakram"] = {
	regExpSearch : /chakram/i,
	name : "Chakram",
	infoname : "Chakram [50 gp]",
	source : [["OotD", 81]],
	list : "melee",
	ability : 1,
	type : "Martial",
	damage : [1, 6, "slashing"],
	range : "Melee, 40/100 ft",
	weight : 1,
	description : "Finesse, Light, Thrown",
	mastery : "return"
};

WeaponsList["dorata"] = {
	regExpSearch : /\bdorata\b|\bdory\b/i,
	name : "Dorata",
	infoname : "Dorata [3 gp]",
	source : [["OotD", 81]],
	list : "melee",
	ability : 1,
	type : "Martial",
	damage : [1, 6, "piercing"],
	range : "Melee, 30/120 ft",
	weight : 2,
	description : "Thrown, Versatile (1d8)",
	mastery : "topple"
};

WeaponsList["honorblade"] = {
	regExpSearch : /honou?rblade/i,
	name : "Honorblade",
	infoname : "Honorblade [80 gp]",
	source : [["OotD", 81]],
	list : "melee",
	ability : 1,
	type : "Martial",
	damage : [2, 6, "slashing"],
	range : "Melee",
	weight : 7,
	description : "Heavy, Two-Handed",
	mastery : "topple"
};

WeaponsList["kopis"] = {
	regExpSearch : /\bkopis\b/i,
	name : "Kopis",
	infoname : "Kopis [20 gp]",
	source : [["OotD", 81]],
	list : "melee",
	ability : 1,
	type : "Martial",
	damage : [1, 6, "piercing"],
	range : "Melee",
	weight : 2,
	description : "Finesse, Light, Versatile (1d6 Slashing)",
	mastery : "vex"
};

WeaponsList["makhaira"] = {
	regExpSearch : /\bmakhaira\b/i,
	name : "Makhaira",
	infoname : "Makhaira [25 gp]",
	source : [["OotD", 81]],
	list : "melee",
	ability : 1,
	type : "Martial",
	damage : [1, 8, "slashing"],
	range : "Melee",
	weight : 5,
	description : "Versatile (1d10)",
	mastery : "graze"
};

// Legacy: the Player's Guide's weapon table has no Xiphos, but the Hoplite text (p. 47) calls it "a dagger called a xiphos".
WeaponsList["xiphos"] = {
	regExpSearch : /\bxiphos\b/i,
	name : "Xiphos",
	source : [["OotD", 47]],
	baseWeapon : "dagger"
};

// ---------- CREATURES (Player's Guide pp. 52 and 75) ----------

// Stimfay: the Amazon's companion (p. 52). Bonus equals the ranger's spell attack modifier.
CreatureList["stimfay"] = {
	name : "Stimfay",
	source : [["OotD", 52]],
	size : 4,
	type : "Construct",
	subtype : "",
	companion : "stimfay",
	companionApply : "stimfay",
	alignment : "Unaligned",
	ac : 12,
	hp : 8,
	hd : [0, 6],
	speed : "10 ft, fly 60 ft",
	proficiencyBonus : 2,
	proficiencyBonusLinked : true,
	challengeRating : "1/4",
	scores : [6, 15, 10, 4, 4, 5],
	saves : ["", "", "", "", "", ""],
	skills : { "perception" : 2 },
	damage_immunities : "poison, psychic",
	condition_immunities : "charmed, poisoned",
	passivePerception : 12,
	senses : "",
	languages : "",
	attacksAction : 1,
	attacks : [{
		name : "Pinion Storm",
		ability : 2,
		damage : [1, 4, "slashing"],
		range : "60 ft",
		modifiers : ["", "oWis"],
		description : "Ranged; attack bonus = my spell attack modifier; damage 1d4 + 2 + my Wisdom modifier"
	}, {
		name : "Talons",
		ability : 2,
		damage : [1, 4, "slashing"],
		range : "Melee (5 ft)",
		modifiers : ["", "oWis"],
		description : "Attack bonus = my spell attack modifier; damage 1d4 + 2 + my Wisdom modifier"
	}],
	traits : [{
		name : "Immutable Form",
		description : "The stimfay can't shape-shift."
	}, {
		name : "Keen Sight",
		description : "The stimfay has Advantage on Wisdom (Perception) checks that rely on sight."
	}],
	header : "Stimfay",
	calcChanges : {
		hp : function (totalHD, HDobj, prefix) {
			if (!classes.known.ranger) return;
			var rngrLvl = classes.known.ranger.level;
			var stimHp = 5 + 3 * rngrLvl;
			HDobj.alt.push(stimHp);
			HDobj.altStr.push(" = 5 plus three times my Ranger level (3 \xD7 " + rngrLvl + ") = " + stimHp);
		},
		setAltHp : true
	}
};

// Bull and Dire Bull: Minotaur Cursed Transformation (p. 75)
CreatureList["bull"] = {
	name : "Bull",
	source : [["OotD", 75]],
	size : 2,
	type : "Beast",
	subtype : "",
	alignment : "Unaligned",
	ac : 10,
	hp : 34,
	hd : [4, 10],
	speed : "40 ft",
	proficiencyBonus : 2,
	challengeRating : "1",
	scores : [18, 10, 16, 3, 12, 8],
	saves : ["", "", "", "", "", ""],
	skills : { "athletics" : 6, "perception" : 5, "survival" : 3 },
	passivePerception : 15,
	senses : "",
	languages : "",
	attacksAction : 1,
	attacks : [{
		name : "Gore",
		ability : 1,
		damage : [1, 6, "bludgeoning"],
		range : "Melee (5 ft)",
		description : "If the target is Large or smaller and the bull moved 20+ ft straight toward it immediately before the hit: +2d6 Bludgeoning damage and Prone"
	}]
};

CreatureList["dire bull"] = {
	name : "Dire Bull",
	source : [["OotD", 75]],
	size : 2,
	type : "Beast",
	subtype : "",
	alignment : "Unaligned",
	ac : 10,
	hp : 47,
	hd : [5, 10],
	speed : "50 ft",
	proficiencyBonus : 2,
	challengeRating : "2",
	scores : [22, 10, 18, 3, 14, 8],
	saves : ["", "", "", "", "", ""],
	skills : { "athletics" : 8, "perception" : 6, "survival" : 5 },
	passivePerception : 15,
	senses : "",
	languages : "",
	attacksAction : 1,
	attacks : [{
		name : "Gore",
		ability : 1,
		damage : [2, 6, "bludgeoning"],
		range : "Melee (5 ft)",
		description : "If the target is Large or smaller and the bull moved 20+ ft straight toward it immediately before the hit: +2d6 Bludgeoning damage and Prone"
	}],
	actions : [{
		name : "Relentless (1/day)",
		description : "Reaction, when taking 10 damage or less that would reduce it to 0 HP: it is reduced to 1 HP instead."
	}]
};
// ---------- MAGIC ITEMS (legacy v13 content; the Player's Guide contains no magic item text) ----------
// Page numbers refer to the original (2014) Odyssey book, as in v13.
MagicItemsList["ambrosia"] = {
	name : "Ambrosia",
	source : [["OotD", 445]],
	type : "wondrous item",
	rarity : "legendary",
	notLegalAL : true,
	attunement : true,
	allowDuplicates : true,
	usages : 6,
	recovery : "dawn",
	description : "6 charges, refills at dawn. One drink stops aging and death of old age (permanent). If killed after my lifespan, I can't be resurrected. Each day I drink, my age is reduced by 1d10 years (min 13, permanent). Each day I drink, my Cha score increases by 1 (max 20), wears when I don't drink ambrosia for a day.",
	descriptionFull : "This painted amphora contains ambrosia: the nectar of the gods. It resizes itself to fit the hands of the creature that holds it, and it contains enough ambrosia for six creatures to drink from it. The amphora refills itself at dawn of each day. Drinking ambrosia has the following temporary and permanent effects." + "\n " + toUni("Immortality") + " Drinking ambrosia just once makes you effectively immortal. You no longer show the physical effects of aging, and you will never die of old age. However, if you are killed after exceeding the maximum age of your race, spells can no longer resurrect you." + "\n " + toUni("Fountain of Youth") + " Each day that you drink ambrosia, your physical age is reduced by 1d10 years, to a minimum of 13 years. This effect is permanent." + "\n " + toUni("Voice of the Gods") + " Each day that you drink ambrosia, your Charisma score increases by 1, to a maximum of 20. If even a single day passes where you don't drink ambrosia, this effect wears off."
};

MagicItemsList["bulla talisman"] = {
	name : "Bulla Talisman",
	source : [["OotD", 445]],
	type : "wondrous item",
	notLegalAL : true,
	attunement : false,
	allowDuplicates : true,
	description : "While wearing this amulet, I have advantage on saving throws against spells and magical effect cast by fiends and fey creatures, if my alignment is good.",
	descriptionFull : "This acorn-shaped golden amulet is engraved with a winged figure wielding a harp. While wearing this amulet, if your alignment is good, you have advantage on saving throws against spells and magical effects cast by fiends and fey creatures."
};

MagicItemsList["lunula talisman"] = {
	name : "Lunula Talisman",
	source : [["OotD", 445]],
	type : "wondrous item",
	notLegalAL : true,
	attunement : false,
	allowDuplicates : true,
	description : "While wearing this amulet, I have advantage on saving throws against spells and magical effect cast by aberrations and monstrosities, if my alignment is good.",
	descriptionFull : "This crescent moon-shaped golden amulet is engraved with beautiful filigree. While wearing this amulet, if your alignment is good, you have advantage on saving throws against spells and magical effects cast by aberrations and monstrosities."
};

MagicItemsList["antikythera device"] = {
	name : "Antikythera Device",
	source : [["OotD", 445]],
	type : "wondrous item",
	rarity : "legendary",
	notLegalAL : true,
	attunement : false,
	allowDuplicates : true,
	description : "I can use the device to magically repair 50 HP to the ship its on. Must be calibrated to constellations on dry land. Once calibrated, it will show a path to an island in the Cerulean Gulf or Forgotten Sea associated with a particular constellation.",
	descriptionFull : "The Antikythera is a complex construct that acts as a magical compass. It also has the power to mend damage to a ship: once per day it can magically repair 50 hit points of damage to a ship it is aboard." + "\n   " + "It uses the constellations to guide its user to islands in the Cerulean Gulf or Forgotten Sea. Every island in these seas are associated with a specific constellation. The Antikythera must be used on dry land as the constant movement of waves makes it impossible to calibrate. When it is calibrated to the proper constellations, it will show a path that can be used to reach the island associated with a particular constellation."
};

MagicItemsList["axe of xander"] = {
	name : "Axe of Xander",
	source : [["OotD", 445]],
	type : "weapon (battleaxe)",
	rarity : "rare",
	notLegalAL : true,
	attunement : false,
	weaponsAdd : ["Axe of Xander"],
	weaponOptions : {
		baseWeapon : "battleaxe",
		regExpSearch : /axe of xander/i,
		name : "Axe of Xander",
		source : [["OotD", 445]],
		range : "Melee",
		description : "Versatile (1d10); +3d6 force damage to giants/titans",
		modifiers : [1,1]
	},
	allowDuplicates : true,
	description : "This battleaxe is sentient, adds +1 to hit and damage, does an additional 3d6 force damage to giants and titans, and heals me 1d6 when I use it to kill a giant or titan. See Notes.",
	descriptionFull : "This is a sentient, lawful neutral +1 greataxe (Intelligence 14, Wisdom 10, Charisma 10). It has hearing and normal vision out to a range of 120 feet. It communicates empathically by transmitting emotion to the creature carrying or using it." + "\n   " + "The axe’s primary purpose is to destroy giants and titans. When you hit one of those creatures with this weapon, it deals an extra 3d6 force damage. It also transmits a tremendous sense of satisfaction and wellbeing to its user when it kills a giant or titan. You may heal 1d6 Hit Points when this happens.",
	toNotesPage : [{
		name : "Features",
		popupName : "Features of Axe of Xander",
		note : desc([
			"The Axe of Xander is a sentient lawful neutral weapon with an Intelligence of 14, a Wisdom of 10, and a Charisma of 10. It has hearing and normal vision out to a range of 120 feet. The weapon communicates by transmitting emotions to the creature carrying it or wielding it.",
			"The axe’s primary purpose is to destroy giants and titans. It also transmits a tremendous sense of satisfaction and wellbeing to its user when it kills a giant or titan."
		]) + "\n\n" + sentientItemConflictTxt
	}]
};

MagicItemsList["balm of invulnerability"] = {
	name : "Balm of Invulnerability",
	source : [["OotD", 445]],
	type : "wondrous item",
	rarity : "very rare",
	notLegalAL : true,
	attunement : false,
	allowDuplicates : true,
	description : "I can apply this ointment to my entire body to gain resistance to non-magical damage for 1 day. Once I do so, the ointment is consumed.",
	descriptionFull : "This ointment is made from the magical herbs that only grow where titan blood has been spilled. A character may apply this balm to their entire body to gain resistance to non-magical damage for 1 day. This uses the entire jar of balm."
};

MagicItemsList["blessed olive oil"] = {
	name : "Blessed Olive Oil",
	source : [["OotD", 445]],
	type : "wondrous item",
	rarity : "uncommon",
	notLegalAL : true,
	attunement : false,
	allowDuplicates : true,
	description : "I can bathe in this fragrant olive oil, for 1 min without armor, to receive the benefits of the Bless spell. Once I do so, the oil is consumed.",
	descriptionFull : "This amphora of fragrant olive oil has been blessed by the Mother Goddess. Characters may bathe in this olive oil to be receive the same effects as a bless spell. Anyone using the oil must remove their armor and spend one minute bathing. The oil is consumed in the process."
};

MagicItemsList["breastplate of mytros"] = {
	name : "Breastplate of Mytros",
	source : [["OotD", 445]],
	type : "armor (breastplate)",
	rarity : "rare",
	description : "This breastplate gives +1 to AC and my Charisma score increases by 1. Giants and titans have disadvantage on attacks against me while wearing this breastplate.",
	descriptionFull : "A character has a +1 bonus to AC and a +1 bonus to Charisma while wearing this armor. Giants and titans have disadvantage on their attacks against an opponent wearing the Breastplate.",
	attunement : true,
	weight : 20,
	scores : [0, 0, 0, 0, 0, 1],
	armorAdd : "Breastplate of Mytros",
	armorOptions : {
		regExpSearch : /breastplate of mytros/i,
		name : "Breastplate of Mytros",
		source : [["OotD", 445]],
		type : "medium",
		ac : 15,
		stealthdis : false,
		weight : 20
	}
};

MagicItemsList["burnished dragonlord coin"] = {
	name : "Burnished Dragonlord Coin",
	source : [["OotD", 446]],
	type : "wondrous item",
	rarity : "very rare",
	notLegalAL : true,
	attunement : false,
	allowDuplicates : true,
	description : "I can understand Draconic.",
	descriptionFull : "This burnished golden coin carries the face of Xander Huorath on one side, and an engraving of the legendary ship Ultros on the reverse. The coin emits a faint golden light. Anyone who possesses a Dragonlord Coin can understand the Draconic language.",
	languageProfs : ["Draconic"]
};

MagicItemsList["caduceus"] = {
	name : "Caduceus",
	source : [["OotD", 446]],
	type : "wondrous item",
	rarity : "legendary",
	description : "This staff offers abilities based on whether the user is or isn't a fiend or undead. Select the type that applies to you.",
	descriptionFull : "The Caduceus is a staff that features five dragons winding around it, with the top featuring two unfolded dragon wings. The staff was created by the wizard Damon over five centuries ago. Forged in the primordial waters of the Nether Sea, the Caduceus was a life-giving staff with the power to turn the tide against the Titans in the First War. Damon gave it to the dragonlord named Karpathos, also known as the Wolf Lord. Karpathos used the Caduceus to raise the Dragonlords from death during the First War. But he was seduced by Lutheria into believing the staff could elevate him to godhood. Karpathos betrayed his fellow dragonlords and swore an oath to Lutheria. He later broke the oath at the urging of his wife and Lutheria transformed him into Thylea’s first vampire as punishment." + "\n   " + "The Caduceus is an item of powerful life giving. In the hands of a living being it gives the power to heal and bring back those who have died. However, in the hands of the fiendish or undead, the Caduceus works in an entirely different manner." + "\n   " + "The Caduceus has 5 charges, which recharge daily at dawn. When used by a creature that is not a fiend or undead, they can be used in the following manner:" + "\n " + "\u2022 Cast the heal spell (1 charge)" + "\n " + "\u2022 Cast the greater restoration spell (1 charge)" + "\n " + "\u2022 Cast the resurrection spell (5 charges)" + "\n   " + "When used by a fiend or undead creature, the rod can be used in the following manner:" + "\n " + "\u2022 Cast the create undead spell as a 9th level spell (2 charges)" + "\n " + "\u2022 " + "Create a vampire spawn from a corpse that has been drained of blood (1 charge)" + "\u2022 Restore 100 hit points to an undead or fiend, even if they are at 0 hit points (2 charges)" + "\n   " + "The Caduceus is seemingly indestructible. However, it can be broken by an empyrean with a CR of 15 or higher. When the staff is destroyed, the life force of the titan contained within the Caduceus can be used to raise one empyrean from death, or it can be used to transform a creature with divine blood into a young empyrean.",
	attunement : true,
	allowDuplicates : true,
	usages : 5,
	recovery : "dawn",
	choices : ["Non Fiend/Undead", "Fiend/Undead"],
	"non fiend/undead" : {
		name : "Caduceus [non fiend/undead]",
		description : "This staff has 5 charges and regains them daily at dawn. I can cast the Heal spell (1 charge). I can cast the Greater Restoration spell (1 charge). I can cast the Resurrection spell (5 charges). See Notes for more properties.",
		descriptionFull : "The Caduceus is a staff that features five dragons winding around it, with the top featuring two unfolded dragon wings. The staff was created by the wizard Damon over five centuries ago. Forged in the primordial waters of the Nether Sea, the Caduceus was a life-giving staff with the power to turn the tide against the Titans in the First War. Damon gave it to the dragonlord named Karpathos, also known as the Wolf Lord. Karpathos used the Caduceus to raise the Dragonlords from death during the First War. But he was seduced by Lutheria into believing the staff could elevate him to godhood. Karpathos betrayed his fellow dragonlords and swore an oath to Lutheria. He later broke the oath at the urging of his wife and Lutheria transformed him into Thylea’s first vampire as punishment." + "\n   " + "The Caduceus is an item of powerful life giving. In the hands of a living being it gives the power to heal and bring back those who have died. However, in the hands of the fiendish or undead, the Caduceus works in an entirely different manner." + "\n   " + "The Caduceus has 5 charges, which recharge daily at dawn. When used by a creature that is not a fiend or undead, they can be used in the following manner:" + "\n " + "\u2022 Cast the heal spell (1 charge)" + "\n " + "\u2022 Cast the greater restoration spell (1 charge)" + "\n " + "\u2022 Cast the resurrection spell (5 charges)",
		spellFirstColTitle : "Ch",
		spellcastingBonus : [{
			name : "1 charge",
			spells : ["heal"],
			selection : ["heal"],
			firstCol : 1
		}, {
			name : "1 charge",
			spells : ["greater restoration"],
			selection : ["greater restoration"],
			firstCol : 1
		}, {
			name : "5 charges",
			spells : ["resurrection"],
			selection : ["resurrection"],
			firstCol : 5
		}],
		toNotesPage : [{
			name : "Caduceus Properties",
			note : "The Caduceus is seemingly indestructible. However, it can be broken by an empyrean with a CR of 15 or higher. When the staff is destroyed, the life force of the titan contained within the Caduceus can be used to raise one empyrean from death, or it can be used to transform a creature with divine blood into a young empyrean."
		}],
		limfeaname : "Caduceus"
	},
	"fiend/undead" : {
		name : "Caduceus [non fiend/undead]",
		description : "This staff has 5 charges and regains them daily at dawn. I can cast the Create Undead spell at 9th level (2 charges). I can create a vampire spawn from a corpse drained of blood (1 charge). I can restore 100 HP to a fiend/undead, even if they are at 0 HP (2 charges). See Notes for more properties.",
		descriptionFull : "The Caduceus is a staff that features five dragons winding around it, with the top featuring two unfolded dragon wings. The staff was created by the wizard Damon over five centuries ago. Forged in the primordial waters of the Nether Sea, the Caduceus was a life-giving staff with the power to turn the tide against the Titans in the First War. Damon gave it to the dragonlord named Karpathos, also known as the Wolf Lord. Karpathos used the Caduceus to raise the Dragonlords from death during the First War. But he was seduced by Lutheria into believing the staff could elevate him to godhood. Karpathos betrayed his fellow dragonlords and swore an oath to Lutheria. He later broke the oath at the urging of his wife and Lutheria transformed him into Thylea’s first vampire as punishment." + "\n   " + "The Caduceus is an item of powerful life giving. When used by a fiend or undead creature, the rod can be used in the following manner:" + "\n " + "\u2022 Cast the create undead spell as a 9th level spell (2 charges)" + "\n " + "\u2022 " + "Create a vampire spawn from a corpse that has been drained of blood (1 charge)" + "\n " + "\u2022 Restore 100 hit points to an undead or fiend, even if they are at 0 hit points (2 charges)",
		spellFirstColTitle : "Ch",
		spellcastingBonus : {
			name : "1 charge",
			spells : ["create undead"],
			selection : ["create undead"],
			firstCol : 1
		},
		spellChanges : {
			"create undead" : {
				description : "Animate/reassert control over six ghouls, three ghasts or wights, or two mummies.",
				changes : "Using the Caduceus, I can cast Create Undead as if I'm using a 9th-level spell slot."
			}
		},
		toNotesPage : [{
			name : "Caduceus Properties",
			note : "The Caduceus is seemingly indestructible. However, it can be broken by an empyrean with a CR of 15 or higher. When the staff is destroyed, the life force of the titan contained within the Caduceus can be used to raise one empyrean from death, or it can be used to transform a creature with divine blood into a young empyrean."
		}],
		limfeaname : "Caduceus"
	}
};

MagicItemsList["chariot of dawn"] = {
	name : "Chariot of Dawn",
	source : [["OotD", 446]],
	type : "wondrous item",
	rarity : "legendary",
	notLegalAL : true,
	attunement : true,
	allowDuplicates : true,
	description : "I can speak the command word to activate the chariot, causing four golden horses to appear and begin pulling the chariot. I can only activate the chariot during the day in the open air and cannot be used underground or during night. See Notes. ",
	descriptionLong : "I can speak the command word to activate the chariot, causing four golden horses to appear and pull it. I gain a 90 ft flying speed. The chariot shines with a radiant light with a radius of 60 ft. Anyone in this radius takes 1d6 damage, except me. Every round I must use a bonus action to make a DC 15 Animal Handling (Wisdom) check to maintain control or the horses will use their full movement to fly straight up. I can only activate the chariot during the day and in the open air and cannot be used underground or during the night.",
	descriptionFull : "This chariot is a beautifully decorated artifact made from bronze. The chariot can only be activated while during the day in the open air and cannot be used underground or during night. When activated with its command word, a team of four golden horses spring into existence to pull the vehicle. The chariot shines with a painfully radiant light in a 60 ft. radius. Anyone within that radius other than the rider takes 4 (1d6) damage." + "\n   " + "The chariot has a flying speed of 90 ft. Flying is a free action, but the horses are difficult to control, and every round, the chariot rider must use a bonus action to control the horses. This requires a successful DC 15 Wisdom (Animal Handling) check. Failure means that the control is lost and the horses will move their full movement to climb straight up into the sky.",
	toNotesPage : [{
		name : "Chariot of Dawn Features",
		note : [
			"This chariot is a beautifully decorated artifact made from bronze. I can only activate it during the day in the open air and I cannot use it underground or during night. When I activate it with its command word, a team of four golden horses spring into existence to pull the vehicle. The chariot shines with a painfully radiant light in a 60 ft radius. Anyone within that radius other than the rider takes 4 (1d6) damage.",
			"The chariot has a flying speed of 90 ft. Flying is a free action, but the horses are difficult to control, and every round, I must use a bonus action to control the horses. This requires a successful DC 15 Animal Handling (Wisdom) check. Failure means that the control is lost and the horses will move their full movement to climb straight up into the sky."
		]
	}]
};

MagicItemsList["greatclub of the cyclopes"] = {
	name : "Greatclub of the Cyclopes",
	source : [["OotD", 446]],
	type : "weapon (greatclub)",
	rarity : "legendary",
	notLegalAL : true,
	attunement : false,
	weaponsAdd : ["Greatclub of the Cyclopes"],
	weaponOptions : {
		baseWeapon : "greatclub",
		regExpSearch : /greatclub of the cyclopes/i,
		name : "Greatclub of the Cyclopes",
		source : [["OotD", 446]],
		range : "Melee",
		description : "Two-handed; DC 16 Str save stunned and prone",
		modifiers : [1,1]
	},
	allowDuplicates : true,
	description : "This greatclub adds +1 to hit and damage. When I hit a target, it must make a DC 16 Strength save or become stunned and knocked prone until the end of its next turn.",
};

MagicItemsList["crown of laurels"] = {
	name : "Crown of Laurels",
	source : [["OotD", 447]],
	type : "wondrous item",
	rarity : "very rare",
	notLegalAL : true,
	attunement : true,
	allowDuplicates : true,
	description : "While wearing the Crown of Laurels, I gain a +2 bonus to Wisdom saving throws.",
	addMod : [{ type : "save", field : "wis", mod : 2, text : "While wearing the Crown of Laurels, I gain a +2 bonus to Wisdom saving throws." }],
	descriptionFull : "This crown of enchanted laurel leaves is customarily awarded to the winner of the Great Games. It was crafted by Vallus, the Queen of Mytros and the Goddess of Wisdom. When worn, the crown provides +2 to Wisdom saving throws."
};

MagicItemsList["crown of the dragonlords"] = {
	name : "Crown of the Dragonlords",
	source : [["OotD", 447]],
	type : "wondrous item",
	rarity : "rare",
	description : "This crown allows spellcasters to prepare the following spells: Bond of the Dragonlords and Dirge of the Dragonlords. Non-spellcasters can use the crown to cast Bond of the Dragonlords.",
	descriptionFull : "If you are a spellcaster (bard, cleric, druid, paladin, ranger, sorcerer, warlock or wizard), this crown grants you the ability to prepare the following spells: bond of the dragonlords and dirge of the dragonlords. If you are not a spellcaster, then as long as you wear the crown, you can cast bond of the dragonlords. Once you cast it, you must finish a long rest before you can cast it again. The material components are still required for both spells.",
	attunement : true,
	allowDuplicates : true,
	choices : ["Spellcaster", "Non-spellcaster"],
	"spellcaster" : {
		name : "Crown of the Dragonlords [spellcaster]",
		description : "I can prepare the following spells: Bond of the Dragonlords and Dirge of the Dragonlords.",
		descriptionFull : "If you are a spellcaster (bard, cleric, druid, paladin, ranger, sorcerer, warlock or wizard), this crown grants you the ability to prepare the following spells: bond of the dragonlords and dirge of the dragonlords.",
		spellcastingBonus : [{
			spells : ["bond of the dragonlords"],
			selection : ["bond of the dragonlords"],
			firstCol : "checkbox"
		}, {
			spells : ["dirge of the dragonlords"],
			selection : ["dirge of the dragonlords"],
			firstCol : "checkbox"
		}]
	},
	"non-spellcaster" : {
		name : "Crown of the Dragonlords [non-spellcaster]",
		description : "While wearing this crown I can cast the Bond of the Dragonlords spell. It still requires material components.",
		descriptionFull : "If you are not a spellcaster, then as long as you wear the crown, you can cast bond of the dragonlords. Once you cast it, you must finish a long rest before you can cast it again. The material components are still required for both spells.",
		spellFirstColTitle : "Ch",
		spellcastingBonus : {
			name : "1 charge",
			spells : ["bond of the dragonlords"],
			selection : ["bond of the dragonlords"],
			firstCol : 1
		},
		usages : 1,
		recovery : "long rest",
		limfeaname : "Crown of the Dragonlords"
	}
};

MagicItemsList["everburning torch"] = {
	name : "Everburning Torch",
	source : [["OotD", 447]],
	type : "wondrous item",
	rarity : "uncommon",
	notLegalAL : true,
	attunement : false,
	allowDuplicates : true,
	description : "This bronze torch is enchanted with the continual flame spell. I can twist the pommel of the torch to ignite or douse the flame.",
	descriptionFull : "This bronze torch is enchanted with the continual flame spell. The pommel of the torch can be twisted to ignite or douse the flame."
};

MagicItemsList["game of twenty squares"] = {
	name : "Game of Twenty Squares",
	source : [["OotD", 447]],
	type : "wondrous item",
	rarity : "uncommon",
	notLegalAL : true,
	attunement : false,
	allowDuplicates : true,
	description : "This game requires two players, and is played by moving seven pieces across a board comprised of twenty squares. Dice are rolled to determine how quickly pieces can move. The object of the game is to reach the end before my opponent. Protected from magical interference. See Notes.",
	descriptionFull : "The game requires two players, and it is played by moving seven pieces across a board comprising twenty squares. Dice are rolled to determine how quickly the pieces can move, and the object of the game is to reach the end of the twenty-square course before your opponent. This requires a mix of strategy and luck. The game is protected against magical interference, which prevents cheating with spells such as mage hand." + "\n " + toUni("Magical Wagers") + "Anything can be wagered on the outcome of the game—wealth, power, magic, or even the lives of the two players. Whenever gods play the game, this wager is enforced by magic woven into the fabric of the multiverse. Depending upon the nature of the wager, as many as six rematches may be allowed." + "\n " + toUni("Starting the Game") + "Two players are required to play the game. They must agree to their wager beforehand, and it is customary to cut the thumb and make a 'blood handshake' before the game begins." + "\n " + toUni("The game is resolved by making a series of seven opposed skill checks, which represent the various strategies that can be used to win the game. Each opposed skill check determines the outcome of a race between two game pieces. The winner of the game is the player who wins at least four rounds, which means that it is possible to win in just four rounds.") + "\n " + toUni("The Seven Rounds") + "The seven rounds proceed as a series of opposed skill checks. The skill checks are made in this order: Performance, Insight, History, Deception, Intimidation, Persuasion, Perception. Tied skill checks must be repeated until one player prevails.",
	toNotesPage : [{
		name : "Game of Twenty Squares Rules",
		note : [
			"\u2022 Requires two players",
			"\u2022 Players must agree on a wager prior to playing",
			"\u2022 When gods play, the wager is magically enforced",
			"\u2022 There are seven rounds, each resolved by contested skill checks, which are:",
			"\t\u2022 Performance",
			"\t\u2022 Insight",
			"\t\u2022 History",
			"\t\u2022 Deception",
			"\t\u2022 Intimidation",
			"\t\u2022 Persuasion",
			"\t\u2022 Perception",
			"\u2022 Tied skill checks are repeated until a player wins",
			"\u2022 The first person to win four rounds wins the game"
		]
	}]
};

MagicItemsList["golden apple"] = {
	name : "Golden Apple",
	source : [["OotD", 448]],
	type : "wondrous item",
	rarity : "very rare",
	notLegalAL : true,
	attunement : true,
	allowDuplicates : true,
	description : "I can use an action to throw the apple, causing everyone in a 30 ft radius of where it lands to make a DC 18 Wis save. On a failure, they continually move toward it in an attempt to take it and can do nothing else. The save is repeats if no one has the apple. Once a person has it, they spend the next day guarding it.",
	descriptionFull : "These apples are wrought from solid gold, and are so beautiful that they inspire immense greed in anyone who sees them." + "\n   " + "On a turn, the owner of a golden apple may use an action to throw it. Everyone within a 30-foot radius of where the apple lands must make a DC 18 Wisdom saving throw. On a failure, they must use their next turn to move toward the apple and attempt to take it for themselves. This saving throw is repeated on each turn if no one has possession of the apple. No other activities are possible while wanting the golden apple. Once a creature has taken possession of the apple, they will spend the next day jealously guarding it. Weaker creatures, such as bandits or goatlings, may attempt to run away and hide it from others."
};

MagicItemsList["glaive of sydon"] = {
	name : "Glaive of Sydon",
	source : [["OotD", 448]],
	type : "weapon (glaive)",
	rarity : "legendary",
	notLegalAL : true,
	attunement : true,
	weaponsAdd : ["Glaive of Sydon"],
	weaponOptions : {
		baseWeapon : "glaive",
		regExpSearch : /glaive of sydon/i,
		name : "Glaive of Sydon",
		source : [["OotD", 448]],
		range : "Melee",
		description : "Heavy, reach, two-handed; +4d6 lightning dmg once per turn",
		modifiers : [2,2]
	},
	allowDuplicates : true,
	description : "This glaive adds +2 to hit and damage. Once per turn, when I hit a target, I can inflict an additional 4d6 lightning damage.",
	descriptionFull : "You gain a +2 bonus to attack and damage rolls with this magic weapon. Once per turn, when you hit a creature with this weapon, you may choose to inflict an additional 4d6 lightning damage."
};

MagicItemsList["golden shield of volkan"] = {
	name : "Golden Shield of Volkan",
	source : [["OotD", 448]],
	type : "shield",
	rarity : "very rare",
	notLegalAL : true,
	attunement : true,
	allowDuplicates : true,
	description : "I can use a bonus action to cast Thunderwave 3 times a day with this shield. I can attach the head of a medium or smaller creature and spend an action to activate it, once per day. I gain one of the creature's traits for 5 rounds; no spellcasting. I have adv. on initiative and Perception (Wis) checks. I also know Draconic.",
	descriptionFull : "",
	languageProfs : ["Draconic"],
	spellcastingAbility : "class",
	spellFirstColTitle : "Ch",
	spellcastingBonus : {
		name : "1 charge",
		spells : ["thunderwave"],
		selection : ["thunderwave"],
		firstCol : 1
	},
	extraLimitedFeatures : [{
		name : "Golden Shield of Volkan (Thunderwave)",
		usages : 3,
		recovery : "dawn"
	}, {
		name : "Golden Shield of Volkan (Activate Head)",
		usages : 1,
		recovery : "dawn"
	}],
	vision : [["Adv. on Perception checks", 0]],
	action : [["action", " (Activate Head)"], ["bonus action", " (Thunderwave)"]]
};

var hagsLoomTable = [
	toUni("Items Craftable with Hag's Loom:"),
	toUni("Crafted Item, Days, Cost (gp), Primary Ingredient, Second Ingredient"),
	"Armor of Invulnerability, 10, 20,000, Golden Lion Hide, Gorgon blood",
	"Cloak of Invisibility, 10, 20,000, Golden Fleece, Gorgon blood",
	"Robe of the Archmagi, 10, 20,000, Golden Fleece, Gorgon Blood"
];

MagicItemsList["hag's loom"] = {
	name : "Hag's Loom",
	source : [["OotD", 448]],
	type : "wondrous item",
	rarity : "very rare",
	notLegalAL : true,
	attunement : true,
	allowDuplicates : true,
	weight : 1000,
	description : "I can use the loom to cast the Commune spell once per day, though it takes 1 hour because the answer is woven into cloth by the loom. I can use the loom to create magical items if I am the Doomed One, otherwise there is a 1% chance I can use the loom in this way. See Notes.",
	descriptionFull : "This magical loom weighs 1000 pounds and is used to divine the future. The loom can cast a commune spell once per day, but this takes an hour, as the answer must be woven into cloth made by the loom." + "\n   " + "In addition to its divination powers, certain individuals can also use the loom to create magic items. There is, however, only a 1% chance for any individual to have this power. The loom can only be used to weave each of the magic items on the table below. The person weaving the magic items must have all of the appropriate components. The Doomed One also has the power to use this loom." + "\n   " + "Once all three items have been woven the loom becomes non-magical." + desc(hagsLoomTable),
	usages : 1,
	recovery : "dawn",
	spellFirstColTitle : "Us",
	spellcastingBonus : {
		name : "1 use",
		spells : ["commune"],
		selection : ["commune"],
		firstCol : 1
	},
	spellChanges : {
		"commune" : {
			time : "1 h",
			changes : "Using the Hag's Loom, I can cast Commune, but it takes an hour to complete, as the answer is woven into cloth."
		}
	},
	toNotesPage : [{
		name : "Hag's Loom Crafting",
		note : [
			"Each item costs 20,000gp, takes 10 days to craft, and requires two ingredients:",
			"\u2022 Armor of Invulnerability - Golden Lion Hide, Gorgon Blood",
			"\u2022 Cloak of Invisibility - Golden Fleece, Gorgon Blood",
			"\u2022 Robe of the Archmagi - Golden Fleece, Gorgon Blood",
			"Once all three items have been woven, the loom becomes non-magical"
		]
	}]
};

MagicItemsList["helm of darkness"] = {
	name : "Helm of Darkness",
	source : [["OotD", 448]],
	type : "wondrous",
	rarity : "legendary",
	notLegalAL : true,
	attunement : true,
	allowDuplicates : true,
	vision : ["Darkvision", 60],
	description : "While wearing this helmet, magical darkness spreads in a 15 ft radius, even going around corners. Normal light cannot pierce it nor is it dispelled by magical light. I gain Darkvision out to 60 ft, which is not affected by darkness from the helmet or another source. Covering it with something opaque blocks the darkness.",
	descriptionFull : "Magical darkness spreads from the helmet when it is worn and fills a 15-foot-radius sphere; the darkness will even spread around corners. A creature with darkvision can’t see through the Helm’s darkness, and nonmagical light will not pierce it. The magical darkness is not dispelled by light from magical effects. The Helm’s wearer, on the other hand, has darkvision to a range of 60 feet. This darkvision is not affected by darkness from the helmet or another source." + "\n   " + "Completely covering the helmet with something opaque blocks the darkness: think of the darkness as “negative light”."
};

MagicItemsList["horn of balmytria"] = {
	name : "Horn of Balmytria",
	source : [["OotD", 449]],
	type : "wondrous",
	rarity : "rare",
	notLegalAL : true,
	attunement : true,
	allowDuplicates : true,
	usages : 1,
	recovery : "dawn",
	action : ["action", " (Paralyzing Mist)"],
	description : "I can speak a command word to make food/water/wine for 6 Medium creatures for a day. The wine can cause prophetic dreams. A second command word makes a 5 ft radius mist within 60 ft; grows 5 ft per round (max 30). A creature starting in it makes a DC 14 Con save or paralyzed until star of its next turn.",
	descriptionLong : "The horn has two command words. When I speak the first one food, water, and wine is created to sustain six Medium creatures for a day. The wine can induce a sleep with prophetic dreams. I can use an action to speak the second command word, creating a mist with a 5 ft radius within 60ft that grows 5 ft per round. Any creature starting its turn in the mist must make a DC 14 Constitution saving throw or be paralyzed until the start of its next turn.",
	descriptionFull : "This horn was fashioned from one of the horns of Balmytria. It has two command words: one produces delicious food, along with water and wine, in a sufficient quantity to keep six Medium-sized creatures well fed for a day. If wine is drunk from the horn it can sometimes (at your discretion) induce a deep sleep with dreams that will reveal possible futures." + "\n   " + "The second command word produces a paralyzing, mercurial vapor. Once per day, you may use an action to create a cloud within 60 ft. of you. The cloud starts with a 5 ft. radius, which increases by 5 ft. each round to a maximum of 30 ft. Any creature that starts its turn in the mist must make a DC 14 Constitution saving throw or be paralyzed until the start of its next turn."
};

MagicItemsList["mithral chakram"] = {
	name : "Mithral Chakram",
	source : [["OotD", 449]],
	type : "weapon (chakram)",
	rarity : "legendary",
	notLegalAL : true,
	attunement : false,
	weaponsAdd : ["Mithral Chakram"],
	weaponOptions : {
		baseWeapon : "chakram",
		regExpSearch : /mithral chakram/i,
		name : "Mithral Chakram",
		source : [["OotD", 449]],
		modifiers : [1,1]
	},
	allowDuplicates : true,
	description : "This chakram adds +1 to hit and damage. When I miss an attack with this weapon, I can try the same attack roll against another creature within 10 feet of the first target.",
	descriptionFull : "This mithral-forged, bladed circular disc is an unusual thrown weapon. It glides through the air, slicing through anything in its path before returning to the thrower." + "\n   " + "Attacks made with this weapon have a +1 bonus to attack and damage rolls. When you miss an attack with this weapon, you may try the same attack roll against another creature within 10 feet of the first target."
};

MagicItemsList["mithral dorata"] = {
	name : "Mithral Dorata",
	source : [["OotD", 449]],
	type : "weapon (spear)",
	rarity : "uncommon",
	notLegalAL : true,
	attunement : false,
	weaponsAdd : ["Mithral Dorata"],
	weaponOptions : {
		baseWeapon : "spear",
		regExpSearch : /mithral dorata/i,
		name : "Mithral Dorata",
		source : [["OotD", 449]],
		modifiers : [1,1]
	},
	allowDuplicates : true,
	description : "This dorata adds +1 to hit and damage. I do not suffer disadvantage on ranged attacks due to enemies in close proximity when I am wielding this weapon.",
	descriptionFull : "These mithral-forged spears are designed to be carried together, with one to be used for throwing and one to be used for close-quarters combat." + "\n   " + "Attacks made with this weapon have a +1 bonus to attack and damage rolls. You do not suffer disadvantage on ranged attacks due to enemies in close proximity when you are wielding this weapon.",
	calcChanges : {
		atkAdd : [
			function (fields, v) {
				if (v.isRangedWeapon || (/thrown/i).test(fields.Description)) {
					fields.Description += (fields.Description ? '; ' : '') + "No disadv. on ranged with enemies in close proximity";
				}
			}, ''
		]
	}
};

MagicItemsList["mithral honorblade"] = {
	name : "Mithral Honorblade",
	source : [["OotD", 449]],
	type : "weapon (greatsword)",
	rarity : "very rare",
	notLegalAL : true,
	attunement : false,
	weaponsAdd : ["Mithral Honorblade"],
	weaponOptions : {
		baseWeapon : "greatsword",
		regExpSearch : /mithral honorblade/i,
		name : "Mithral Honorblade",
		source : [["OotD", 449]],
		modifiers : [1,1],
		description : "Heavy, two-handed; Destroy non-magical shield on hit"
	},
	allowDuplicates : true,
	description : "This magic greatsword adds +1 to hit and damage. Whenever I hit a creature wielding a non-magical shield, that shield is instantly destroyed.",
	descriptionFull : "This oversized, mithral-forged makhaira was designed by ancient jancan smiths. Although it seems much too large for a human, the warrior monks of Aresia have been known to specialize in the use of honorblades." + "\n   " + "Attacks made with this weapon have a +1 bonus to attack and damage rolls. Whenever this magic weapon hits a creature wielding a non-magical shield, that shield is instantly destroyed."
};

MagicItemsList["mithral kopis"] = {
	name : "Mithral Kopis",
	source : [["OotD", 449]],
	type : "weapon (shortsword)",
	rarity : "uncommon",
	notLegalAL : true,
	attunement : false,
	weaponsAdd : ["Mithral Kopis"],
	weaponOptions : {
		baseWeapon : "shortsword",
		regExpSearch : /mithral kopis/i,
		name : "Mithral Kopis",
		source : [["OotD", 449]],
		modifiers : [1,1],
		description : "Finesse, light; Deals piercing or slashing damage"
	},
	allowDuplicates : true,
	description : "This kopis adds +1 to hit and damage. When I make an attack with this weapon, I can choose to have it inflict piercing or slashing damage.",
	descriptionFull : "This mithral-forged, forward-curving shortsword is heavier along the end of the blade. This gives it more cutting power than most shortswords." + "\n   " + "Attacks made with this weapon have a +1 bonus to attack and damage rolls. When you make an attack with this sword, you may choose to have it inflict piercing or slashing damage."
};

MagicItemsList["mithral makhaira"] = {
	name : "Mithral Makhaira",
	source : [["OotD", 449]],
	type : "weapon (longsword)",
	rarity : "uncommon",
	notLegalAL : true,
	attunement : false,
	weaponsAdd : ["Mithral Makhaira"],
	weaponOptions : {
		baseWeapon : "longsword",
		regExpSearch : /mithral makhaira/i,
		name : "Mithral Makhaira",
		source : [["OotD", 449]],
		modifiers : [1,1],
		description : "Versatile (1d10); +1d4 while mounted"
	},
	allowDuplicates : true,
	description : "This makhaira adds +1 to hit and damage. When I attack with this weapon while I am mounted, it does an additional 1d4 slashing damage on hit.",
	descriptionFull : "This mithral-forged longsword has a single curved blade with a flat edge along the top. It is heavier than most longswords, making it more effective while mounted." + "\n   " + "Attacks made with this weapon have a +1 bonus to attack and damage rolls. When you attack with this blade while you are mounted, it does an additional d4 slashing damage on hit."
};

MagicItemsList["mithral xiphos"] = {
	name : "Mithral Xiphos",
	source : [["OotD", 449]],
	type : "weapon (dagger)",
	rarity : "uncommon",
	notLegalAL : true,
	attunement : false,
	weaponsAdd : ["Mithral Xiphos"],
	weaponOptions : {
		baseWeapon : "dagger",
		regExpSearch : /mithral xiphos/i,
		name : "Mithral Xiphos",
		source : [["OotD", 449]],
		modifiers : [1,1],
		description : "Finesse, light, thrown; Ignore AC from shields",
	},
	allowDuplicates : true,
	description : "This xiphos adds +1 to hit and damage. When I attack with this weapon, I ignore any AC that the enemy gains from wielding a shield.",
	descriptionFull : "This mithral-forged dagger has a straight, leaf-shaped blade, which is excellent for thrusting and piercing between shields in phalanx formations." + "\n   " + "Attacks made with this weapon have a +1 bonus to attack and damage rolls. When you make an attack with this weapon, you ignore any AC that the enemy gains from wielding a shield."
};

var instrumentsOfTheMuseFullDescription = [
	"These instruments were crafted by the forge god Volkan for his daughter, Kyrah. Each instrument is simple but elegant, designed so as not to attract unwanted attention, because the goddess of music loves to travel in disguise as a common bard. However, when played, the instruments produce rapturous melodies, owing to the fact that they are crafted from the hair of nymphs.",
	"The following table lists the spells common to all the instruments, as well as the spells that are specific to each instrument. You can use an action to play the instrument and cast one of its spells. Once the instrument has been used to cast a spell, it can't be used to cast that spell again until the next dawn. The spells use your spellcasting ability and spell save DC. When you use the instrument to cast a spell as a source or as a focus, your spell save DC is increased by 2.",
	">>Instrument\tSpells<<",
	"  All         !!\tjump, invisibility, levitate",
	"  Boreal harp \tcontrol weather, conjure animals",
	"  Euros lyre  \tsleep (4th level), counterspell (3rd level)",
	"  Notos kithara\tzone of truth, magic circle",
	"  Zephyr lute \thold person, conjure elemental"
];

MagicItemsList["instruments of the muse"] = {
	name : "Instruments of the Muse",
	source : [["OotD", 449]],
	type : "wondrous item",
	rarity : "rare",
	notLegalAL : true,
	attunement : true,
	prerequisite : "Requires attunement by a bard",
	prereqeval : function(v) { return (classes.known.bard); },
	calcChanges : {
		spellCalc : [
			function (type, spellcasters, ability) {
				if (type == "dc" && (/bard/).test(spellcasters)) return 2;
			},
			"I gain a +2 bonus to saving throw DCs of my bard spells."
		]
	},
	extraLimitedFeatures : [{
		name : "Boreal harp",
		usages : 1,
		recovery : "dawn"
	}, {
		name : "Euros lyre",
		usages : 1,
		recovery : "dawn"
	}, {
		name : "Notos kithara",
		usages : 1,
		recovery : "dawn"
	}, {
		name : "Zephyr lute",
		usages : 1,
		recovery : "dawn"
	}],
	spellFirstColTitle : "Us",
	spellcastingBonus : [{
		name : "Instruments of the Muse",
		spells : ["jump"],
		selection : ["jump"],
		firstCol : 1
	}, {
		name : "Instruments of the Muse",
		spells : ["invisibility"],
		selection : ["invisibility"],
		firstCol : 1
	}, {
		name : "Instruments of the Muse",
		spells : ["levitate"],
		selection : ["levitate"],
		firstCol : 1
	}, {
		name : "Boreal harp",
		spells : ["control weather"],
		selection : ["control weather"],
		firstCol : 1
	}, {
		name : "Boreal harp",
		spells : ["conjure animals"],
		selection : ["conjure animals"],
		firstCol : 1
	}, {
		name : "Euros lyre",
		spells : ["sleep"],
		selection : ["sleep"],
		firstCol : 1
	}, {
		name : "Euros lyre",
		spells : ["counterspell"],
		selection : ["counterspell"],
		firstCol : 1
	}, {
		name : "Notos kithara",
		spells : ["zone of truth"],
		selection : ["zone of truth"],
		firstCol : 1
	}, {
		name : "Notos kithara",
		spells : ["magic circle"],
		selection : ["magic circle"],
		firstCol : 1
	}, {
		name : "Zephyr lute",
		spells : ["hold person"],
		selection : ["hold person"],
		firstCol : 1
	}, {
		name : "Zephyr lute",
		spells : ["conjure elemental"],
		selection : ["conjure elemental"],
		firstCol : 1
	}],
	spellChanges : {
		"sleep" : {
			description : "20-ft rad 9d8 HP of conscious creatures fall asleep, starting with the lowest current HP crea",
			changes : "Using the Euros lyre, I can cast Sleep as if I'm using a 4th-level spell slot."
		},
		"counterspell" : {
			description : "Stop a spell being cast; make DC 13 spellcasting ability check if above the spell slot lvl used",
			changes : "Using the Euros lyre, I can cast Counterspell as if I'm using a 3rd-level spell slot."
		}
	},
	allowDuplicates : true,
	description : "A set of four instruments: harp, lyre, kithara, lute. I can use each instrument once to cast a spell (see Notes), they regain the ability to do so at dawn. They use my spellcasting ability and spell DC. I can use the instruments as a spellcasting focus. When used as a focus or source for a spell, its DC is increased by 2.",
	descriptionFull : instrumentsOfTheMuseFullDescription.join("\n   ").replace("!!", "").replace(/>>(.*?)<</g, function(a, match) { return toUni(match); }),
	toNotesPage : [{
		name : "Instruments of the Muse",
		popupName : "Instruments of the Muse Spells",
		note : desc(instrumentsOfTheMuseFullDescription.slice(2)).replace("!!", "\t").replace(/>>(.*?)<</g, function(a, match) { return match.toUpperCase(); })
	}]
};

MagicItemsList["palladium"] = {
	name : "Palladium",
	source : [["OotD", 450]],
	type : "wondrous item",
	notLegalAL : true,
	attunement : false,
	allowDuplicates : true,
	description : "The Palladium can be enshrined in a city or ship. This process takes seven days of devoted prayer from a priest, which can be expedited by sacrifices. Once enshrined, it offers benefits to the city or ship. The benefits end if it is ever moved by more than an inch. See Notes.",
	descriptionFull : "This artifact bestows magical protection upon any city or ship that enshrines it. Enshrining the Palladium within a city or ship requires seven days of devoted prayer by a priest. Sacrifices are sometimes offered to expedite this process. Once the artifact is enshrined, it bestows its full protection. However, if the artifact is ever moved by more than an inch, the protective effects end." + "\n " + toUni("Protected Cities") + "The city walls have resistance to all damage types. Siege weapons mounted on the city walls have advantage on all attacks." + "\n " + toUni("Protected Ships") + "The ship's hull has resistance to all damage types. Siege weapons mounted on the deck of the ship have advantage on all attacks." + "\n " + toUni("Forbiddance") + "The city is protected by the effects of the Forbiddance spell, preventing teleportation into or out of the city, as defined by its walls.",
	toNotesPage : [{
		name : "Palladium Enshrined Benefits",
		popupName : "Palladium Enshrined Benefits",
		note : desc ([
			"\u2022 Protected Cities",
			"   The city walls have resistance to all damage types. Siege weapons mounted on the city walls have advantage on all attacks.",
			"\u2022 Protected Ships",
			"   The ship's hull has resistance to all damage types. Siege weapons mounted on the deck of the ship have advantage on all attacks.",
			"\u2022 Forbiddance",
			"   The city is protected by the effects of the Forbiddance spell, preventing teleportation into or out of the city, as defined by its walls."
		])
	}]
};

MagicItemsList["pegasus bridle"] = {
	name : "Pegasus Bridle",
	source : [["OotD", 450]],
	type : "wondrous item",
	rarity : "rare",
	notLegalAL : true,
	attunement : true,
	allowDuplicates : true,
	description : "I can use this bridle to tame a pegasus, so that I can use it as a flying mount. Once the pegasus has been bridled, I am the only on who can commaned it while I am attuned to this item.",
	descriptionFull : "This golden bridle may be used to tame a pegasus, so that the mythical creature may be used as a flying mount. Once the pegasus has been bridled, it may only be commanded by the character who is attuned to this item.",
};

MagicItemsList["potion of aging"] = {
	name : "Potion of Aging",
	source : [["OotD", 450]],
	type : "wondrous item",
	rarity : "legendary",
	notLegalAL : true,
	attunement : false,
	allowDuplicates : true,
	description : "A creature physically ages by one year for each drop the creature drinks.",
	descriptionFull : "This cloudy blue potion was brewed from the blood of a living god. For each droplet that a creature drinks from this potion, the creature physically ages by one year. Creatures with shorter lifespans, such as humans, should be cautious when drinking this potion." + "\n   " + "Brewing the potion is a long process that requires one droplet of divine blood to be added each year for many years. Such potions are always designated with the number of years that it took to brew them. For example, a potion of aging (25 years) contains 25 droplets.",
};

var pythorsHammerTable = [
	toUni("Items Craftable with Pythor's Hammer"),
	toUni("Crafted Item, Days, Cost (gp), Primary Ingredient, Second Ingredient"),
	"Luck Blade, 10, 20,000, Any magical sword, orb of star metal",
	"Rod of Lordly Might, 10, 20,000, Any magical mace, adamantine ingot"
];

MagicItemsList["pythor's hammer"] = {
	name : "Pythor's Hammer",
	source : [["OotD", 450]],
	type : "weapon (warhammer)",
	rarity : "legendary",
	notLegalAL : true,
	attunement : true,
	weaponsAdd : ["Pythor's Hammer"],
	weight : 2,
	weaponOptions : {
		baseWeapon : "warhammer",
		regExpSearch : /pythor's warhammer/i,
		name : "Pythor's Hammer",
		source : [["OotD", 450]],
		modifiers : [1,1],
		description : "Versatile (1d10)"
	},
	allowDuplicates : true,
	description : "This warhammer adds +1 to hit and damage. Once per day, I can instantly summon the hammer to my hand from any distance. The hammer can also be used to craft weapons and armor; See Notes.",
	descriptionFull : "Attacks made with this weapon have a +1 bonus to attack and damage rolls. Once per day, you may instantly summon the hammer to your hand from any distance, and it teleports directly into your grasp. The hammer’s main purpose is to forge magical weapons and armor, and if used in such a fashion, the creation time is halved. Refer to the table below for crafting recipes." + desc(pythorsHammerTable),
	toNotesPage : [{
		name : "Pythor's Hammer Crafting",
		note : [
			"Each item costs 20,000gp, takes 10 days to craft, and requires two ingredients:",
			"\u2022 Luck Blade - Any magical sword, orb of star metal",
			"\u2022 Rod of Lordly Might - Any magical mace, adamantine ingot",
			"If Phythor's Hammer is used to craft a magical weapon/armor, the time to craft is halved"
		]
	}]
};

MagicItemsList["scythe of lutheria"] = {
	name : "Scythe of Lutheria",
	source : [["OotD", 450]],
	type : "weapon (scythe)",
	rarity : "legendary",
	notLegalAL : true,
	attunement : true,
	weaponsAdd : ["Scythe of Lutheria"],
	weight : 6,
	weaponOptions : {
		baseWeapon : "glaive",
		regExpSearch : /scythe of lutheria/i,
		name : "Scythe of Lutheria",
		source : [["OotD", 450]],
		modifiers : [1,1],
		description : "Heavy, reach, two-handed; On crit DC 15 Con save if under 100 HP, or killed",
	},
	allowDuplicates : true,
	description : "This scythe adds +1 to hit and damage. When I score a critical hit, the target, if under 100 HP, makes a DC 15 Constitution save or is killed, if it's not a construct or undead. On subsequent occurrences, I make a DC 15 Charisma save or turn Evil. Only a Wish spell can undo this effect.",
	descriptionFull : "Attacks made with this weapon have a +1 bonus to attack and damage rolls. If critical hit is scored against a creature that has fewer than 100 hit points, it must make a DC15 Constitution saving throw or be slain instantly; constructs and the undead are immune to this effect. When a creature is slain in this manner, the user feels a surge of dark pleasure that entices them to become evil. On the second and subsequent slaying the user must make a DC15 Charisma saving throw or their alignment changes to evil. Affiliation to Law or Chaos is unchanged. Only a wish spell can undo this alignment change."
};

MagicItemsList["shortbow of cupidity"] = {
	name : "Shortbow of Cupidity",
	source : [["OotD", 450]],
	type : "weapon (shortbow)",
	rarity : "legendary",
	notLegalAL : true,
	attunement : true,
	weaponsAdd : ["Shortbow of Cupidity"],
	weight : 2,
	weaponOptions : {
		baseWeapon : "shortbow",
		regExpSearch : /shortbow of cupidity/i,
		name : "Shortbow of Cupidity",
		source : [["OotD", 450]],
		modifiers : [1,1],
		description : "Ammunition, two-handed; DC 14 Wis save or charmed for 1 h",
	},
	usages : 1,
	recovery : "dawn",
	additional : "charm",
	allowDuplicates : true,
	description : "This shortbow adds +1 to hit and damage. On a hit, I can force the target to make a DC 14 Wisdom save or be charmed by me for 1 hour. I can do this only once per day.",
	descriptionFull : "Attacks made with this weapon have a +1 bonus to attack and damage rolls. Once per day, on a successful hit, you may force the target to make a DC 14 Wisdom saving throw. On a failure, the target is charmed by you for one hour."
};

MagicItemsList["the promethean fire"] = {
	name : "The Promethean Fire",
	nameTest : "The Promethean Fire",
	source : [["OotD", 450]],
	rarity : "legendary",
	type : "weapon (spear)",
	description : "While attuning, I can change this item into any simple/martial weapon; keeps all traits. This spear adds +3 to hit/damage, does fire damage, emits 60 ft sunlight. It has 5 charges, which I can use to cast Awaken (3), Fabricate (2), Plant Growth (2), Stone Shape (2); DC 17. Regains 1d4 + 1 at dawn.",
	descriptionLong : "While attuning to this spear, I can transform it into any simple or martial weapon; it retains all of its magical properties. This spear adds +3 to hit and damage, deals fire damage, radiates sunlight out to 60 ft, and has 5 charges. It regains 1d4 + 1 charges at dawn. Using charges, I can cast the following transmutation spells: Awaken (3 charges), Fabricate (2 charges), Plant Growth (2 charges), and Stone Shape (2 charges). These spells have a DC of 17.",
	descriptionFull : "This spear was crafted from the Great Tree of Thylea and set ablaze with the fires of creation. When attuning with this item, you may transform it into any martial or simple weapon of your choice. The new weapon has all the same magical properties." + "\n   " + toUni("Attack Bonus") + " Attacks made with this weapon have a +3 bonus to attack and damage rolls. Regardless of the form that this weapon takes, its damage type is fire." + "\n   " + toUni("Radiant Light") + " The weapon radiates a blazing light out to 60 feet. This light is sunlight." + "\n   " + toUni("Transmutation Spells") + " The weapon has 5 charges. It regains 1d4 + 1 expended charges daily at dawn. Spells cast from this weapon have a save DC of 17. You can use this weapon to cast the following spells: awaken (3 charges), fabricate (2 charges), plant growth (2 charges), stone shape (2 charges).",
	attunement : true,
	usages : 5,
	recovery : "dawn",
	additional : "regains 1d4 + 1",
	chooseGear : {
		type : "weapon",
		descriptionChange : ["replace", "spear"],
		prefixOrSuffix : "suffix"
	},
	fixedDC : 17,
	spellFirstColTitle : "Ch",
	spellcastingBonus : [{
		name : "3 charges",
		spells : ["awaken"],
		selection : ["awaken"],
		firstCol : 3
	}, {
		name : "2 charges",
		spells : ["fabricate"],
		selection : ["fabricate"],
		firstCol : 2
	}, {
		name : "2 charges",
		spells : ["plant growth"],
		selection : ["plant growth"],
		firstCol : 2
	}, {
		name : "2 charges",
		spells : ["stone shape"],
		selection : ["stone shape"],
		firstCol : 2
	}],
	calcChanges : {
		atkAdd : [
			function (fields, v) {
				if (!v.theWea.isMagicWeapon && !v.isSpell && (/the promethean fire/i).test(v.WeaponText)) {
					fields.Damage_Type = 'fire';
				}
			},
			'If I include "The Promethean Fire" in the name of a weapon, it will be treated as the magic weapon The Promethean Fire. It has +3 to hit and damage and deals fire damage.'
		],
		atkCalc : [
			function (fields, v, output) {
				if (!v.isSpell && (/the promethean fire/i).test(v.WeaponTextName)) {
					output.magic = v.thisWeapon[1] + 3;
					output.extraHit += 3;
				}
			}
		]
	}
};

MagicItemsList["titansbane, blade of talieus"] = {
	name : "Titansbane, Blade of Talieus",
	source : [["OotD", 450]],
	type : "weapon (longsword)",
	rarity : "legendary",
	notLegalAL : true,
	attunement : true,
	weaponsAdd : ["Titansbane, Blade of Talieus"],
	weight : 2,
	weaponOptions : {
		baseWeapon : "longsword",
		regExpSearch : /titansbane, blade of talieus/i,
		name : "Titansbane, Blade of Talieus",
		source : [["OotD", 450]],
		modifiers : [2,2],
		description : "Versatile (1d10); +2d6 necrotic to giants/celestials/gygans/cyclopes"
	},
	allowDuplicates : true,
	description : "Titansbane is a sentient longsword that adds +2 to hit and damage. On a hit, it deals an extra 2d6 necrotic damage to giants, celestials, gygans, and cyclopes. It wishes to be returned to its master.",
	descriptionFull : "Attacks made with this weapon have a +2 bonus to attack and damage rolls. When a giant or celestial is hit by this weapon, the creature takes an extra 2d6 necrotic damage. Gygans and cyclopes are also affected." + "\n   " + "Titansbane is sentient and wishes to be returned to its master. It was forged by Talieus, the ancient titan who pulls Lutheria’s barge. It was wielded against Sydon by Hergeron and then lost in the War of the Titans." + "\n " + toUni("Titansbane: The Sentient Weapon") + "\n This is the only blade that can cut the bindings that Lutheria used to sew Talieus’s mouth and eyes shut. If his bindings are cut, Talieus will immediately stop pulling Lutheria’s barge, thank the one who helped him, and then disappear across the horizon of the Nether Sea. He will entrust the weapon to the one who freed him.",
	toNotesPage : [{
		name : "Features",
		popupName : "Features of Titansbane",
		note : desc(["Titansbane is a sentient longsword. It wishes to be returned to its master."]) + "\n\n" + sentientItemConflictTxt
	}]
};

MagicItemsList["toga praetexta"] = {
	name : "Toga Praetexta",
	source : [["OotD", 451]],
	type : "wondrous item",
	rarity : "uncommon",
	usages : 1,
	recovery : "dawn",
	additional : "flourish",
	notLegalAL : true,
	attunement : false,
	allowDuplicates : true,
	saves : ["Cha"],
	description : "While wearing this toga, I have proficiency in Charisma saving throws. Once per day, when I fail a Charisma check trying to influence a crowd, I can flourish the toga to re-roll the check.",
	descriptionFull : "This white, woolen cloth toga has broad purple stripes along its border, and it drapes fashionably across the body when worn. It has been purified by priests through ritual processions and sacrifices on the night of the new moon. While wearing the toga, you have proficiency in Charisma saving throws. Additionally, once per day, when you fail a Charisma check to influence a crowd of people, you may flourish your toga to impress the crowd and re-roll that check."
};

MagicItemsList["wheel of fortune"] = {
	name : "Wheel of Fortune",
	source : [["OotD", 451]],
	type : "wondrous item",
	rarity : "legendary",
	notLegalAL : true,
	attunement : false,
	allowDuplicates : true,
	description : "I can spin this 6 ft tall bronze wheel to receive a magical effect depending upon which constellation it lands on. Any attempt to influence the outcome causes the the wheel to lose its magic until the dawn of the next day. A creature can only spin the wheel once every 24 hours. See Notes.",
	descriptionFull : "This is a 6-foot-tall bronze wheel that has been set on a stand so that it can easily be spun. Along the wheel are inscriptions showing each of Thylea’s major constellations. At the top of the wheel is the symbol of the mother goddess, pointing down. When the wheel is spun, a magical effect occurs depending upon which of the inscriptions the mother goddess is pointing at. Any effect, magical or otherwise, that would make the spinning of the wheel not random removes all of the wheel’s magic until the dawn of the next day. A creature may only spin the wheel of fortune once per day (24-hour period). Refer to the table on the next page for the effects of the wheel." + [
			toUni("1 / The Bear") + ". Your Constitution and Intelligence scores increase by 4 for 8 hours.",
			toUni("2 / The Gygan") + ". A gygan hero has been sent to kill you. In every battle, there is a cumulative 10% chance that the gygan hero catches up with you and attacks. He attacks in the second round of the battle and focuses all of his attacks on you. When the gygan is defeated, this effect ends.",
			toUni("3 / The Prisoner") + ". You are banished to an extradimensional maze. At the end of each day you may make an Intelligence check at DC 15 to escape. In your place, a sacred beast appears beside the wheel. This beast will, to the best of its abilities, try to accomplish any goals you were working on. You may choose any beast of a CR equal to or less than your level. The beast has the celestial type. Your gamemaster can allow you to continue play as this beast until you free yourself from your maze. When you free yourself, the beast vanishes, and you appear in its place.",
			toUni("4 / The Tree") + ". You gain the ability to cast the spell polymorph one time in the next 8 hours. The spell is different in the following ways. The duration is concentration, up to 1 minute. The new form can only be a treant.",
			toUni("5 / The Trickster") + ". You become the center of a zone of wild magic. For the next 8 hours, any spell cast within 30 feet of you has a 25% chance of being replaced by a wild magic surge. The caster rolls on the Sorcerer’s wild magic chart when this happens.",
			toUni("6 / The Bard") + ". Everything you say becomes indescribably funny for the next 8 hours. As an action, you may cast the spell hideous laughter with no somatic or material components.",
			toUni("7 / The Warrior") + ". The Fates have decided that you need to be tested. In every battle, there is a cumulative 10% chance that all of the enemies focus their attacks upon you until you are rendered unconscious. This effect ends when the enemies in the battle are defeated.",
			toUni("8 / The Centaur") + ". A centaur hero has been sent to make your life miserable. The centaur hero can cast transport via plants twice per day and it does not have disadvantage when attacking at long range. In every battle, there is a 50% chance that the centaur hero will show up on the second round at the maximum range of its longbow and fire arrows at you. It will attack you for 5 rounds and try to stay at maximum range during that time. At the end of 5 rounds, the centaur will escape by using transport via plants. This effect ends when the centaur hero is killed.",
			toUni("9 / The Queen") + ". Your Charisma and Wisdom scores increase by 4 for 8 hours.",
			toUni("10 / The Twins") + ". In every battle, there is a cumulative 10% chance that the enemy creature with the lowest CR is polymorphed into a cyclops. The polymorph effect lasts for one hour.",
			toUni("11 / The Ant") + ". Your size becomes Tiny for the next 8 hours. Everything you are wearing shrinks with you. Your Strength and Constitution scores are reduced by 6 to a minimum of 3. Your movement score is halved, rounded down. All of your weapon attacks have a base damage of 1. All of your spell ranges are halved, rounded down. Creatures have advantage to save against any abilities or spells that you use. You have advantage on Dexterity (Stealth) checks.",
			toUni("12 / The Dragon") + ". You gain a metallic dragon companion for 24 hours. Choose between brass, bronze, copper, or silver. The dragon is a wyrmling. If you already have a wyrmling (i.e. as an Oath of the Dragonlord paladin), then your wyrmling becomes a young dragon for 24 hours. If you have a young dragon, then your young dragon become an adult dragon for 24 hours.",
			toUni("13 / The Nymph") + ". Any armor, boots, cloaks, clothes, gloves, helms, or robes (magical or otherwise) that you are wearing vanish, leaving you naked. These items are returned to you by a nymph 24 hours later.",
			toUni("14 / The Spear") + ". Your Strength and Dexterity scores increase by 4 for 8 hours.",
			toUni("15 / The Chariot") + ". For 8 hours, you gain the ability to use a bonus action to take the Dash action.",
			toUni("16 / The Blacksmith") + ". You gain a +2 bonus to your Armor Class for 8 hours.",
			toUni("17 / The Titan") + ". You gain the ability to cast the spell polymorph one time in the next 8 hours. The spell is different in the following ways. The duration is concentration, up to 1 minute. The new form can only be a storm giant.",
			toUni("18 / The Dreamer") + ". Your nightmares become reality. Whenever you take a long rest, there is a 10% cumulative chance that you have a nightmare halfway through the rest. When this happens, a creature materializes before you and fights to the death. The creature is determined by your level. 1-4: harpy, 5-8: gorgon, 9-12: hydra, 13+: Cerberus. This effect ends when the nightmare creature is defeated.",
			toUni("19 / Empty") + ". The wheel vanishes, reappearing somewhere else in the world.",
			toUni("20 / The Swine") + ". Spin twice for the day."
		].join("\n \u2022 "),
	toNotesPage : [{
		name : "Constellations and Their Effects",
		note : [
			"I gain an effect based on the contellation the wheel lands on",
			"\n\n1d20\tCONSTELLATION\t1d20\tCONSTELLATION",
			"1\tThe Bear      \t11\tThe Ant",
			"2\tThe Gygan  \t12\tThe Dragon",
			"3\tThe Prisoner\t13\tThe Nymph",
			"4\tThe Tree      \t14\tThe Spear",
			"5\tThe Trickster\t15\tThe Chariot",
			"6\tThe Bard      \t16\tThe Blacksmith",
			"7\tThe Warrior\t17\tThe Titan",
			"8\tThe Centaur\t18\tThe Dreamer",
			"9\tThe Queen  \t19\tEmpty",
			"10\tThe Twins    \t20\tThe Swine",
			"\u2022 The Bear. My Constitution and Intelligence scores increase by 4 for 8 hours.",
			"\u2022 The Gygan. 10% chance for a gygan hero to appear in every battle and focus on killing me. Ends when it is defeated.",
			"\u2022 The Prisoner. I am banished to an extradimensional maze. I make a DC 15 Intelligence check to escape at the end of each day. I gain control of a celestial beast of CR equal to or less than my level until I free myself.",
			"\u2022 The Tree. I can cast polymorph once within the next 8 hours. The duration is concentration, up to 1 min. The new form can only be a treant.",
			"\u2022 The Trickster. Any spell cast within 30 ft of me has a 25% of being replaced by a wild magic surge.",
			"\u2022 The Bard. For the next 8 hours I can use an action to cast Tasha's Hideous Laughter without somatic or material components.",
			"\u2022 The Warrior. 10% chance every battle that all enemies attack me until I am unconscious. Ends when the enemies are defeated.",
			"\u2022 The Centaur. 50% chance for a centaur hero appear in every battle and attack me for 5 rounds. Ends when it is defeated.",
			"\u2022 The Queen. My Charisma and Wisdom scores increase by 4 for 8 hours.",
			"\u2022 The Twins. 10% chance every battle that the lowest CR enemy is polymorphed into a cyclops.",
			"\u2022 The Ant. My size becomes Tiny for 8 hours. Everything I am wearing shrinks with me. My Strength and Constitution scores are reduced by 6 (min 3). My movement and spell ranges are halved, rounded down. All of my weapon attacks have a base damage of 1. Creatures have advantage on saves from my spells and abilities. I have advantage on Stealth (Dexterity) checks.",
			"\u2022 The Dragon. I gain a metallic (brass, bronze, copper, silver) dragon wyrmling companion for 24 hours. If I already have one, then it becomes a young dragon for 24 hours. If I have a young dragon, then it becomes an adult dragon for 24 hours.",
			"\u2022 The Nymph. My armor, boots, cloaks, clothes, gloves, helm, and/or robes that I am wearing vanish. They are returned by a nymph 24 hours later.",
			"\u2022 The Spear. My Strength and Dexterity scores increase by 4 for 8 hours.",
			"\u2022 The Chariot. I can use a bonus action to take the Dash action for 8 hours.",
			"\u2022 The Blacksmith. I gain +2 AC for 8 hours.",
			"\u2022 The Titan. I can cast polymorph once within the next 8 hours. The duration is concentration, up to 1 min. The new form can only be a storm giant.",
			"\u2022 The Dreamer. 10% during a long rest that nightmare materializes halfway through and fights to the death. The creature that appears is based on my level. 1-4: harpy, 5-8: gorgon, 9-12: hydra, 13+: Cerberus. Ends when it is defeated.",
			"\u2022 Empty. The wheel vanishes, reappearing somewhere else in the world.",
			"\u2022 The Swine. I can spin the wheel twice for the day."
		]
	}]
};
// Magic items end
