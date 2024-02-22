import { Direction } from "../game/enum_Direction.js";
import { MapCell } from "./MapCell.js";
import { Point } from "./Point.js";
import { enum_MapCell } from "./enum_MapCell.js";
import { SUBSTAIRS } from "./sub_Stairs.js";

export class StairCell extends MapCell {
    direction:SUBSTAIRS = SUBSTAIRS.DOWN;

    constructor(flags:number, p:Point) {
        super(enum_MapCell.STAIRS, p);
        //console.log(`class Staircell ${this.type}`);
        if (flags & 0x8) this.facing = Direction.North;
        else this.facing=Direction.East;
        if (flags & 0x4) this.direction = SUBSTAIRS.UP;
        //console.log(`class Staircell ${this.type}: down? ${this.direction}/ facing: ${this.facing}`);

    }

    onStep(){
        //cmd_Stairs(this.direction);
    }
}
