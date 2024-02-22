import { GEMsg } from "../game/GameEventHandler.js";
import { Player } from "../game/Player.js";
import { PressurePad } from "./Actuators/PressurePad.js";
import { enum_MapCell } from "./enum_MapCell.js";
import { Mob } from "./Mob.js";
import { Point } from "./Point.js";

export interface CellIF {
    update(deltaTime:number):void;
    receiveMsg(msg:GEMsg):void;
    onClick():void;
}

export class MapCell implements CellIF {
    active:boolean;
    p:Point;
    type:enum_MapCell;
    subtype:number;
    subsubtype:number;
    facing:number=0;
    mob:Mob | undefined;
    _actuator:any[] = [];

    constructor(env:enum_MapCell, p:Point) {
        this.active = false;
        this.p = p;
        this.type = env; this.subtype = this.subsubtype = -1;
    } 

    onClick(): void {
        throw new Error("Method not implemented.");
    }
    
    receiveMsg(msg: GEMsg): void {}
    
    update(deltaTime:number):void {}
    mapSym():enum_MapCell {return this.type;}
    blocked():boolean {return !!this.mob || (this.type == enum_MapCell.WALL);}

    exc(ply:Player){ 
        if (this._actuator.length !==0) {
            const dpad:PressurePad = this._actuator[0] as PressurePad;
            dpad.exc(ply);
        }
    }
}




