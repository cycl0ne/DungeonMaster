import { ENUM_CLASSES, ENUM_SUBCLASS_FIGHTER, ENUM_SUBCLASS_NINJA, ENUM_SUBCLASS_PRIEST, ENUM_SUBCLASS_WIZARD } from "../DMap/Champion.js";

interface ACTION_IF {
    name:string;
    xp_class:ENUM_CLASSES;
    xp_sub:ENUM_SUBCLASS_FIGHTER|ENUM_SUBCLASS_NINJA|ENUM_SUBCLASS_PRIEST|ENUM_SUBCLASS_WIZARD;
    xp_get:number;
    defense:number;
    stamina:number;
    hitprob:number;
    damage:number;
    idleness:number;
    dmgdoor:boolean;
}


/*

interface ACTION_IF {
    name:string;
    xp_class:ENUM_CLASSES;
    xp_sub:ENUM_SUBCLASS_FIGHTER|ENUM_SUBCLASS_NINJA|ENUM_SUBCLASS_PRIEST|ENUM_SUBCLASS_WIZARD;
    xp_get:number;
    idleness:number;
    stamina_used:number;
    power:number;
    req_luck:number;
    door_basher:boolean;
}

const ACTIONS:ACTION_IF[] = [
    {
        name: "BLOCK",
        xp_class: ENUM_CLASSES.FIGHTER,
        xp_sub: ENUM_SUBCLASS_FIGHTER.PARRY,
        xp_get: 8,
        idleness: 3,
        stamina_used: 1,
        power: 30,
        req_luck: 30,
        door_basher: true
    },
];

const ACTION:ACTION_IF[] = [
//    ["BLOCK", ENUM_CLASSES.FIGHTER, ENUM_SUBCLASS_FIGHTER.PARRY, 8, 3, 1, 30, 30, true], 
];

type ACTIONCOMBOS = [number,boolean,number];
type COMBOS_IF = Array<ACTIONCOMBOS>;
*/
/*
const COMBOS:COMBOS_IF[] = [
    [0, true, 1],
];
*/
