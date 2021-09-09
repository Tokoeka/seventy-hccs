import {
  cliExecute,
  containsText,
  equip,
  getIngredients,
  getRelated,
  numericModifier,
  totalTurnsPlayed,
  useFamiliar,
  visitUrl,
} from "kolmafia";
import { $effect, $familiar, $item, $slot, have } from "libram";
import { acquireEffect, checkEffect } from "./lib";

export enum Quest {
  HP = 1,
  Muscle = 2,
  Mysticality = 3,
  Moxie = 4,
  FamiliarWeight = 5,
  WeaponDamage = 6,
  SpellDamage = 7,
  CombatFrequency = 8,
  ItemDrop = 9,
  HotResist = 10,
  CoilWire = 11,
  Donate = 30,

  Beginning = 900,
  Leveling = 901,
  DeepDark = 902,
}

type QuestData = {
  acquire: Effect[];
  check: Effect[];
  equipment: Map<Slot, Item>;
  retrocape?: string;
  familiar?: Familiar;
};
const questRecords: Record<Quest, () => QuestData> = {
  [Quest.Beginning]: () => {
    return {
      acquire: [
        $effect`Feeling Excited`,
        $effect`Feeling Peaceful`,
        $effect`Inscrutable Gaze`,
        $effect`Spirit of Peppermint`,
        $effect`Triple-Sized`,
        $effect`Uncucumbered`,
        $effect`init.enh`,
        $effect`items.enh`,
        $effect`meat.enh`,
      ],
      check: [],
      equipment: new Map([
        [$slot`hat`, $item`Iunion Crown`],
        [$slot`back`, $item`protonic accelerator pack`],
        //[$slot`shirt`, $item`fresh coat of paint`],
        [$slot`weapon`, $item`Fourth of May Cosplay Saber`],
        [$slot`off-hand`, $item`Kramco Sausage-o-Matic™`],
        [$slot`pants`, $item`pantogram pants`],
        [$slot`acc1`, $item`hewn moon-rune spoon`],
        [$slot`acc2`, $item`Powerful Glove`],
        [$slot`acc3`, $item`Kremlin's Greatest Briefcase`],
      ]),
    };
  },

  // Maximize Myst and MP, blue rocket will do all the regen for us
  [Quest.CoilWire]: () => {
    return {
      acquire: [],
      check: [],
      equipment: new Map([
        [$slot`hat`, $item`Iunion Crown`],
        [$slot`weapon`, $item`Fourth of May Cosplay Saber`],
        [$slot`off-hand`, $item`industrial fire extinguisher`],
        [$slot`pants`, $item`Cargo Cultist Shorts`],
        [$slot`acc1`, $item`hewn moon-rune spoon`],
        [$slot`acc2`, $item`Retrospecs`],
        [$slot`acc3`, $item`Kremlin's Greatest Briefcase`],
      ]),
      retrocape: "heck thrill",
    };
  },

  [Quest.Leveling]: () => {
    const toAcquire = [
      $effect`AAA-Charged`,
      $effect`A Girl Named Sue`,
      $effect`Big`,
      $effect`Billiards Belligerence`,
      $effect`Blessing of the Bird`,
      $effect`Blessing of your favorite Bird`,
      $effect`Blood Bond`,
      $effect`Blood Bubble`,
      $effect`Broad-Spectrum Vaccine`,
      $effect`Carol of the Bulls`,
      $effect`Carol of the Hells`,
      $effect`Carol of the Thrills`,
      $effect`Ermine Eyes`,
      $effect`Favored by Lyle`,
      $effect`Feeling Excited`,
      $effect`Feeling Peaceful`,
      $effect`Fidoxene`,
      $effect`Frenzied, Bloody`,
      $effect`Full Bottle in front of Me`,
      $effect`Grumpy and Ornery`,
      $effect`Hustlin'`,
      $effect`Inscrutable Gaze`,
      $effect`Loyal Tea`,
      $effect`Mental A-cue-ity`,
      $effect`Mystically Oiled`,
      $effect`Pisces in the Skyces`,
      $effect`Puzzle Champ`,
      $effect`Ruthlessly Efficient`,
      $effect`Sigils of Yeg`,
      $effect`Singer's Faithful Ocelot`,
      $effect`Starry-Eyed`,
      $effect`Total Protonic Reversal`,
      $effect`Triple-Sized`,
      $effect`Warlock, Warstock, and Warbarrel`,
      // Beach comb
      $effect`Cold as Nice`,
      $effect`A Brush with Grossness`,
      $effect`Do I Know You From Somewhere?`,
      $effect`Does It Have a Skull In There??`,
      $effect`Hot-Headed`,
      $effect`Lack of Body-Building`,
      $effect`Oiled, Slick`,
      $effect`Pomp & Circumsands`,
      $effect`Resting Beach Face`,
      $effect`We're All Made of Starfish`,
      $effect`You Learned Something Maybe!`,
      // Class buffs
      $effect`Astral Shell`,
      $effect`Elemental Saucesphere`,
      $effect`Empathy`,
      $effect`Flimsy Shield of the Pastalord`, // Need the non-flimsy effect for PM
      $effect`Ghostly Shell`,
      $effect`Leash of Linguini`,
      $effect`Springy Fusilli`,
      // Songs
      $effect`Fat Leon's Phat Loot Lyric`,
      $effect`Ode to Booze`,
      $effect`Polka of Plenty`,
    ];
    const mpSavings = numericModifier($item`pantogram pants`, "mana cost") !== 0;
    const outfit = new Map([
      [$slot`weapon`, $item`Fourth of May Cosplay Saber`],
      [$slot`off-hand`, $item`weeping willow wand`],
      [$slot`pants`, mpSavings ? $item`pantogram pants` : $item`Cargo Cultist Shorts`],
      [$slot`acc1`, $item`hewn moon-rune spoon`],
      [$slot`acc2`, have($item`battle broom`) ? $item`battle broom` : $item`gold detective badge`],
      [$slot`acc3`, $item`Beach Comb`],
    ]);
    if (have($item`LOV Epaulettes`)) outfit.set($slot`back`, $item`LOV Epaulettes`);
    return { acquire: toAcquire, check: [], equipment: outfit, retrocape: "heck thrill" };
  },

  [Quest.Muscle]: () => {
    return {
      acquire: [
        $effect`Expert Oiliness`,
        $effect`Phorcefullness`,
        $effect`Quiet Determination`,
        $effect`Rage of the Reindeer`,
      ],
      check: [$effect`Giant Growth`, $effect`Spit Upon`],
      equipment: new Map([
        [$slot`hat`, $item`wad of used tape`],
        [$slot`weapon`, $item`Fourth of May Cosplay Saber`],
        [$slot`off-hand`, $item`dented scepter`],
        [$slot`acc1`, $item`Brutal brogues`],
        [$slot`acc3`, $item`"I Voted!" sticker`],
      ]),
      retrocape: "muscle",
    };
  },

  [Quest.Moxie]: () => {
    return {
      acquire: [$effect`Disco Fever`, $effect`Expert Oiliness`, $effect`Quiet Desperation`],
      check: [$effect`Sparkly!`, $effect`Spit Upon`],
      equipment: new Map([
        [$slot`hat`, $item`very pointy crown`],
        [$slot`weapon`, $item`Fourth of May Cosplay Saber`],
        [$slot`acc1`, $item`your cowboy boots`],
        [$slot`acc2`, $item`Beach Comb`],
        [$slot`acc3`, $item`"I Voted!" sticker`],
      ]),
      retrocape: "moxie",
    };
  },

  [Quest.HP]: () => {
    const candle = $item`extra-wide head candle`;
    return {
      acquire: [$effect`Song of Starch`],
      check: [],
      equipment: new Map([
        [$slot`hat`, have(candle) ? candle : $item`wad of used tape`],
        [$slot`back`, $item`vampyric cloake`],
        [$slot`weapon`, $item`Fourth of May Cosplay Saber`],
        [$slot`pants`, $item`Cargo Cultist Shorts`],
        [$slot`acc3`, $item`"I Voted!" sticker`],
      ]),
    };
  },

  [Quest.DeepDark]: () => {
    const outfit = new Map([
      [$slot`weapon`, $item`Fourth of May Cosplay Saber`],
      [$slot`pants`, $item`pantogram pants`],
      [$slot`acc3`, $item`Kremlin's Greatest Briefcase`],
    ]);
    if (have($item`burning paper crane`)) outfit.set($slot`off-hand`, $item`burning paper crane`);
    return { acquire: [], check: [], equipment: outfit, retrocape: "vampire hold" };
  },

  [Quest.SpellDamage]: () => {
    return {
      acquire: [
        $effect`Arched Eyebrow of the Archmage`,
        $effect`Cowrruption`,
        $effect`In a Lather`,
        $effect`Jackasses' Symphony of Destruction`,
        $effect`Song of Sauce`,
        $effect`The Magic of LOV`,
      ],
      check: [
        $effect`Do You Crush What I Crush?`,
        $effect`Filled with Magic`,
        $effect`In a Lather`,
        $effect`Inner Elf`,
        $effect`Meteor Showered`,
        $effect`Nanobrainy`,
        $effect`Sparkly!`,
        $effect`Spit Upon`,
        $effect`Toxic Vengeance`,
        $effect`Visions of the Deep Dark Deeps`,
      ],
      // TODO: handle spell damage candle
      //const candle = [$slot`off-hand`, $item`Abracandalabra`];
      equipment: new Map([
        [$slot`weapon`, $item`wrench`],
        [$slot`off-hand`, $item`weeping willow wand`],
        [$slot`pants`, $item`pantogram pants`],
        [$slot`acc1`, $item`battle broom`],
        [$slot`acc2`, $item`Powerful Glove`],
        [$slot`acc3`, $item`Kremlin's Greatest Briefcase`],
        [$slot`familiar`, $item`astral statuette`],
      ]),
      familiar: $familiar`Left-Hand Man`,
    };
  },

  [Quest.WeaponDamage]: () => {
    const toAcquire = [
      $effect`Bow-Legged Swagger`,
      $effect`Cowrruption`,
      $effect`Jackasses' Symphony of Destruction`,
      $effect`Rage of the Reindeer`,
      $effect`Scowl of the Auk`,
      $effect`Song of the North`,
      $effect`Tenacity of the Snapper`,
      $effect`The Power of LOV`,
    ];
    const toCheck = [
      $effect`Do You Crush What I Crush?`,
      $effect`In a Lather`,
      $effect`Inner Elf`,
      $effect`Meteor Showered`,
      $effect`Spit Upon`,
    ];
    const outfit = new Map([
      [$slot`weapon`, $item`broken champagne bottle`],
      [$slot`off-hand`, $item`dented scepter`],
      [$slot`acc1`, $item`Brutal brogues`],
      [$slot`acc2`, $item`Powerful Glove`],
    ]);
    const candle = $item`extra-wide head candle`;
    if (have(candle)) outfit.set($slot`hat`, candle);
    return { acquire: toAcquire, check: toCheck, equipment: outfit };
  },

  [Quest.Mysticality]: () => {
    return {
      acquire: [$effect`Quiet Judgement`],
      check: [$effect`Nanobrainy`, $effect`Spit Upon`, $effect`Witch Breaded`],
      equipment: new Map([
        [$slot`hat`, $item`wad of used tape`],
        [$slot`weapon`, $item`Fourth of May Cosplay Saber`],
        [$slot`acc1`, $item`battle broom`],
        [$slot`acc3`, $item`"I Voted!" sticker`],
      ]),
      retrocape: "mysticality",
    };
  },

  [Quest.CombatFrequency]: () => {
    return {
      acquire: [
        $effect`Become Superficially interested`,
        $effect`Feeling Lonely`,
        $effect`Gummed Shoes`,
        $effect`Invisible Avatar`,
        $effect`Silent Running`,
        $effect`Smooth Movements`,
        $effect`The Sonata of Sneakiness`,
        $effect`Throwing Some Shade`,
      ],
      check: [$effect`Silence of the God Lobster`],
      equipment: new Map([
        [$slot`hat`, $item`very pointy crown`],
        [$slot`back`, $item`protonic accelerator pack`],
        [$slot`pants`, $item`pantogram pants`],
        [$slot`acc3`, $item`Kremlin's Greatest Briefcase`],
      ]),
      familiar: $familiar`Disgeist`,
    };
  },

  [Quest.HotResist]: () => {
    return {
      acquire: [],
      check: [$effect`Fireproof Foam Suit`],
      equipment: new Map([
        [$slot`weapon`, $item`Fourth of May Cosplay Saber`],
        [$slot`off-hand`, $item`industrial fire extinguisher`],
        [$slot`acc1`, $item`Brutal brogues`],
        [$slot`acc2`, $item`hewn moon-rune spoon`],
        [$slot`acc3`, $item`Beach Comb`],
        [$slot`familiar`, $item`cracker`],
      ]),
      retrocape: "vampire hold",
      familiar: $familiar`Exotic Parrot`,
    };
  },

  [Quest.FamiliarWeight]: () => {
    return {
      acquire: [
        $effect`Man's Worst Enemy`,
        $effect`Robot Friends`,
        $effect`Shortly Stacked`,
        $effect`Whole Latte Love`,
      ],
      check: [
        $effect`[1701]Hip to the Jive`,
        $effect`Joy`,
        $effect`Smart Drunk`,
        $effect`All Is Forgiven`,
        $effect`Bureaucratized`,
        $effect`Chorale of Companionship`,
        $effect`Down With Chow`,
        $effect`Optimist Primal`,
        $effect`Meteor Showered`,
        $effect`Open Heart Surgery`,
      ],
      equipment: new Map([
        [$slot`weapon`, $item`Fourth of May Cosplay Saber`],
        [$slot`off-hand`, have($item`rope`) ? $item`rope` : $item`familiar scrapbook`],
        [$slot`acc1`, $item`Brutal brogues`],
        [$slot`acc2`, $item`hewn moon-rune spoon`],
        [$slot`acc3`, $item`Beach Comb`],
        [$slot`familiar`, $item`cracker`],
      ]),
      familiar: $familiar`Exotic Parrot`,
    };
  },

  [Quest.ItemDrop]: () => {
    const toAcquire = [
      $effect`Feeling Lost`,
      $effect`Nearly All-Natural`,
      $effect`Steely-Eyed Squint`,
      $effect`The Spirit of Taking`,
    ];
    const toCheck = [$effect`Bat-Adjacent Form`, $effect`Synthesis: Collection`];
    const carrot = numericModifier($item`latte lovers member's mug`, "item drop") > 0;
    const candles = [
      $item`extra-large utility candle`,
      $item`novelty sparkling candle`,
      $item`runed taper candle`,
    ];
    const sparkler = $item`oversized sparkler`;
    const outfit = new Map([
      [$slot`hat`, $item`wad of used tape`],
      [$slot`back`, $item`vampyric cloake`],
      [$slot`off-hand`, carrot ? $item`latte lovers member's mug` : $item`Kramco Sausage-o-Matic™`],
      [$slot`acc1`, $item`Guzzlr tablet`],
      [$slot`acc2`, $item`gold detective badge`],
      [$slot`acc3`, $item`your cowboy boots`],
      [$slot`familiar`, $item`li'l ninja costume`],
    ]);
    if (!candles.some(have) && have(sparkler)) outfit.set($slot`weapon`, sparkler);
    // can only have one candle
    for (const c of candles) if (have(c)) outfit.set($slot`weapon`, c);
    return {
      acquire: toAcquire,
      check: toCheck,
      equipment: outfit,
      familiar: $familiar`Trick-or-Treating Tot`,
    };
  },

  [Quest.Donate]: () => {
    return { acquire: [], check: [], equipment: new Map() };
  },
};

export function prep(quest: Quest): void {
  const record = questRecords[quest]();
  record.acquire.forEach((effect) => acquireEffect(effect));
  record.check.forEach((effect) => checkEffect(effect));
  if (record.familiar) useFamiliar(record.familiar);
  const back = record.equipment.get($slot`back`);
  if (back && record.retrocape) throw `Multiple back items for ${quest}`;
  if (record.retrocape) cliExecute(`retrocape ${record.retrocape}`);
  record.equipment.forEach((item, slot) => {
    if (!have(item)) {
      const ingredients = Object.keys(getIngredients(item));
      if (getRelated(item, "fold")) cliExecute(`fold ${item}`);
      else if (have(Item.get(ingredients[0] ?? "none"))) cliExecute(`make ${item}`);
      else throw `Unable to find ${item}?`;
    }
    equip(slot, item);
  });
}

export function haveQuest(id: number): boolean {
  return containsText(visitUrl("council.php"), `<input type=hidden name=option value=${id}>`);
}

export function prepAndDoQuest(id: Quest): number {
  const turns = totalTurnsPlayed();
  if (id > Quest.Donate) throw `Invalid Quest ${id}!!`;
  if (haveQuest(id)) {
    prep(id);
    visitUrl("council.php");
    visitUrl(`choice.php?whichchoice=1089&option=${id}`);
    if (haveQuest(id)) throw `Couldn't complete quest ${id}?`;
  }
  return totalTurnsPlayed() - turns;
}
