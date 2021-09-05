import {
  adv1,
  choiceFollowsFight,
  getAutoAttack,
  handlingChoice,
  inMultiFight,
  myTurncount,
  runChoice,
  runCombat,
  setAutoAttack,
  toInt,
  toUrl,
  useSkill,
  visitUrl,
} from "kolmafia";
import { $item, $location, $monster, $skill, get, Macro } from "libram";

const amateurNinja = $monster`amateur ninja`.id;
const gentrifier = $monster`gingerbread gentrifier`.id;
const toxicBeastie = $monster`toxic beastie`.id;
const LOVEnforcer = $monster`LOV Enforcer`.id;
const LOVEngineer = $monster`LOV Engineer`.id;
const DMTSquareMon = $monster`Performer of Actions`.id;
const DMTCircleMon = $monster`Thinker of Thoughts`.id;

const retailDistrict = toUrl($location`Gingerbread Upscale Retail District`).split("=")[1];

const Ghost = new Macro()
  .skill($skill`Summon Love Gnats`)
  .skill($skill`Sing Along`)
  .skill($skill`Shoot Ghost`)
  .skill($skill`Shoot Ghost`)
  .skill($skill`Shoot Ghost`)
  .skill($skill`Trap Ghost`)
  .abort();

const TryBanish = new Macro() // Reserve Snokebomb for Mother Slime
  .trySkill($skill`Throw Latte on Opponent`)
  .trySkill($skill`KGB tranquilizer dart`)
  .trySkill($skill`Reflex Hammer`)
  .trySkill($skill`Feel Hatred`)
  .abort();

const Replace = new Macro().skill($skill`Macrometeorite`);
const Backup = new Macro().if_(
  `hasskill ${toInt($skill`Back-Up to your Last Enemy`)}`,
  Macro.skill($skill`Back-Up to your Last Enemy`).skill($skill`Saucy Salve`)
);

const FreeInstaKill = new Macro()
  .skill($skill`Sing Along`)
  .trySkill($skill`Chest X-Ray`)
  .trySkill($skill`Shattering Punch`)
  .trySkill($skill`Gingerbread Mob Hit`)
  .abort();

const CigKill = new Macro()
  .skill($skill`Sing Along`)
  .tryItem($item`gingerbread cigarette`)
  .abort();

const DefaultMacro = new Macro()
  .if_(`hasskill ${toInt($skill`Shoot Ghost`)}`, Ghost)
  .if_(`monsterid ${toxicBeastie}`, Backup)
  .if_(`monsterid ${amateurNinja} || monsterid ${toxicBeastie}`, FreeInstaKill)
  .if_(`snarfblat ${retailDistrict}`, CigKill)
  .trySkill($skill`Digitize`)
  .trySkill($skill`%fn, spit on me!`)
  .if_(`hasskill ${toInt($skill`Turbo`)}`, Macro.trySkill($skill`Feel Pride`)) // Turbo used a flag to cast pride
  .skill($skill`Curse of Weaksauce`)
  .skill($skill`Micrometeorite`)
  .item($item`Time-Spinner`)
  .if_(
    `hasskill ${toInt($skill`lecture on relativity`)}`,
    Macro.skill($skill`lecture on relativity`).skill($skill`Saucy Salve`)
  )
  .skill($skill`Sing Along`)
  .skill($skill`Candyblast`)
  .repeat();

export const MacroList = {
  FreeFight: DefaultMacro,

  // Just runaway on its own causes a null pointer exception?
  Runaway: new Macro().trySkill($skill`Saucy Salve`).step("runaway"),

  Banish: TryBanish,

  Nanobrainy: new Macro()
    .skill($skill`Entangling Noodles`)
    .trySkill($skill`Giant Growth`)
    .trySkill($skill`Become a Wolf`)
    .step(TryBanish),

  Sprinkles: new Macro()
    .if_(`monsterid ${gentrifier}`, Replace)
    .skill($skill`Meteor Shower`)
    .step(FreeInstaKill),

  TropicalSkeleton: new Macro()
    .trySkill($skill`Open a Big Red Present`)
    .skill($skill`Use the Force`),

  TunnelOfLOV: new Macro()
    .if_(`monsterid ${LOVEnforcer}`, Macro.attack().repeat())
    .if_(`monsterid ${LOVEngineer}`, Macro.skill($skill`Candyblast`).repeat())
    .step(DefaultMacro),

  WitchessQueen: new Macro()
    .item($item`Time-Spinner`)
    .attack()
    .repeat(),
  WitchessWitch: new Macro()
    .skill($skill`Curse of Weaksauce`)
    .skill($skill`Sing Along`)
    .attack()
    .repeat(),

  DMTSquare: new Macro()
    .if_(`!monsterid ${DMTSquareMon}`, Replace)
    .skill($skill`Feel Envy`)
    .step(DefaultMacro),
  DMTCircle: new Macro()
    .if_(`!monsterid ${DMTCircleMon}`, Replace)
    .tryItem($item`abstraction: action`)
    .step(DefaultMacro),

  MotherSlime: new Macro().trySkill($skill`KGB tranquilizer dart`).skill($skill`Snokebomb`),

  BatFormRunaway: new Macro().trySkill($skill`Become a Bat`).step("runaway"),
  LatteGulpRunaway: new Macro().trySkill($skill`Gulp Latte`).step("runaway"),

  MeteorForce: new Macro().skill($skill`Meteor Shower`).skill($skill`Use the Force`),
  FoamForce: new Macro()
    .skill($skill`Fire Extinguisher: Foam Yourself`)
    .skill($skill`Use the Force`),
};

// Replace Libram's adventureMacro functionality for now with kolmafia-js 1.0.11
export function adventure(loc: Location, macro: Macro): void {
  if (getAutoAttack() !== 0) setAutoAttack(0);
  adv1(loc, 0, macro.toString());
  while (inMultiFight()) runCombat(macro.toString());
  if (choiceFollowsFight()) visitUrl("choice.php");
  if (handlingChoice()) runChoice(-1);
}

export function adventureUrl(url: string, macro: Macro): void {
  if (getAutoAttack() !== 0) setAutoAttack(0);
  visitUrl(url);
  runCombat(macro.toString());
  if (choiceFollowsFight()) visitUrl("choice.php");
  if (handlingChoice()) runChoice(-1);
}

export function mapMonster(location: Location, monster: Monster, macro: Macro): void {
  if (getAutoAttack() !== 0) setAutoAttack(0);
  if (get("_monstersMapped") >= 3) throw "Trying to map too many monsters";
  if (!get("mappingMonsters")) useSkill($skill`Map the Monsters`);
  const expectedTurnCount = myTurncount();
  let mapPage = "";
  while (!mapPage.includes("Leading Yourself Right to Them")) {
    mapPage = visitUrl(toUrl(location));
    if (myTurncount() > expectedTurnCount) throw "Wasted a turn somehow mapping monsters?";
  }
  visitUrl(`choice.php?pwd=&whichchoice=1435&option=1&heyscriptswhatsupwinkwink=${monster.id}`);
  runCombat(macro.toString());
  if (choiceFollowsFight()) runChoice(-1);
  if (handlingChoice()) runChoice(-1);
  if (get("mappingMonsters")) throw "Failed to unset map the monsters?";
}
