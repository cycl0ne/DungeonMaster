import { GameEngine } from "../game/GameEngine.js";
import { Direction } from "../game/enum_Direction.js";
import { Champion } from "./Champion.js";
import { MapCell } from "./MapCell.js";
import { Point } from "./Point.js";
import { enum_MapCell } from "./enum_MapCell.js";
import { enum_WallOrnates } from "./enum_WallOrnates.js";
/*
MirrorWall -> WallCell -> MapCell
LogicObject:

WallOrnate

*/

export class WallOrnateObject {
    _type:enum_WallOrnates;
    constructor(type:enum_WallOrnates) {
        this._type = type;
    }

    onClick(): void {
        console.log("Wallornate Object clicked");
    }    
}

export class MirrorWOObject extends WallOrnateObject {
    champion:Champion|null = null;

    constructor(c:Champion| null = null) {
        super(enum_WallOrnates.ChampionMirror);
        if (c) this.champion = c;
    }

    onClick(): void {
        console.log("Mirror Object clicked");
        if (this.champion) GameEngine.game.openReincarnate(this.champion, this);
        //GameEngine.game._inventoryTest.newChamp();
    }
}

export class WallCell extends MapCell {
    northDec:boolean= false;
    southDec:boolean= false;
    eastDec:boolean= false;
    westDec:boolean= false;
    deco:enum_WallOrnates[] = [];
    text:string[][] = Array(4).fill(null).map(() => Array(4).fill(""));
    champ:boolean=true;
    champion:Champion|null = null;
    
    //
    wornate:WallOrnateObject[] = [];
    //    4 Arrays for ?!

    constructor(flags:number, p:Point) {
        super(enum_MapCell.WALL, p);
        this.westDec = (flags & 0x1) !== 0;
        this.southDec = (flags & 0x2) !== 0;
        this.eastDec = (flags & 0x4) !== 0;
        this.northDec = (flags & 0x8) !== 0;
        for (let i=Direction.North; i<Direction.MAX; i++) this.deco[i] = enum_WallOrnates.none;

    }
}

