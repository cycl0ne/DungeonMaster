import { Direction } from "../../game/enum_Direction.js";
import { Champion } from "../Champion.js";

export class wobj_TextWall {
    _dir:Direction;
    constructor(dir:Direction) {this._dir = dir;}
}

export class wobj_MirrorWall {
    _dir:Direction;
    _champion:Champion|null = null;
    constructor(dir:Direction) {this._dir = dir;}

    
}