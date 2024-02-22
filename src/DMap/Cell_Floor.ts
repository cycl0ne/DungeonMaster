import { IItemClass } from "../game/ItemManager.js";
import { MapCell } from "./MapCell.js";
import { Point } from "./Point.js";
import { enum_MapCell } from "./enum_MapCell.js";

export enum FLOORLOC {
    NE,
    SE,
    SW,
    NW,
    MAX,
}

interface IItemFloor {
    pos:FLOORLOC;
    item:IItemClass;
}

export class FloorCell extends MapCell {
    footPrints:boolean = false;
    floorDec:boolean = false;
    floorItem:boolean = false;

    floorItems:IItemFloor[] = [];
    // 4 Arrays for NE/SE/SW/NW ? -> Items?
    // 1 Array - Commands

    constructor(flags:number, p:Point) {
        super(enum_MapCell.FLOOR, p);
        this.floorDec = (flags & 0x8) !== 0;
        //for (let i=FLOORLOC.NE; i<FLOORLOC.MAX; i++) this.floorItems[i]
    }

    addItemOnfloor(item:IItemClass, dir:FLOORLOC) {
        const itemfloor:IItemFloor = {pos:dir, item:item};
        this.floorItems.push(itemfloor);
        this.floorItem = true;
        console.log("added item on floor "+item._name);
        console.log("at position "+this.p.x+":"+this.p.y);
    }

    addActuator(actuator:any)
    {
        this._actuator.push(actuator);
    }
   
    onClick() {}
}

