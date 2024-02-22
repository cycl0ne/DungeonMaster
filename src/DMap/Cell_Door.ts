import { DoorType } from "../gfx/enum_DoorType.js";
import { Direction } from "../game/enum_Direction.js";
import { enum_MapCell } from "./enum_MapCell.js";
import { Point } from "./Point.js";
import { GameEventHandler, GEAction, GEMsg } from "../game/GameEventHandler.js";
import { MapCell } from "./MapCell.js";

export class DoorCell extends MapCell {
    state:number = 0; // 0 open, 1 = almost open, 2= half open, 3=almost close, 4 = closed, 5 bashed
    moving:number = 0;
    movDir:number = 1; // 1 Opens -1 Closes
    doorType:DoorType = DoorType.PortcullisDoor;
    doorDeco:number = 0; // Not used atm
    doorButton:boolean = true;
    doorUpDown:boolean = true; 
    doorFire:boolean = false;
    doorBash:boolean = false;
    animDoor:boolean = false;

    constructor(flags:number, p:Point) {
        super(enum_MapCell.DOOR, p);
        this.active = true;
        this.doorOpen();
        if (flags&0x10) this.doorClosed(); //closed
        if (flags & 0x8) this.facing = Direction.North;
        else this.facing = Direction.East;
    }

    blocked():boolean{
        return (this.state > 2);
    }

    doorClosed(){
        this.moving = 100;
        this.state  = 4;
        this.movDir = -1;
        this.animDoor = false;
    }

    doorOpen(){
        this.moving=0;
        this.state = 0;
        this.movDir = 1;
        this.animDoor = false;
    }

    update(tickTime:number) {
        if (!this.active) {
            GameEventHandler.getInstance().remToUpdate(this);
            return;
        }
        if (this.movDir > 0) {
            this.moving += 750*tickTime;
            if (this.moving>=0) this.state = 0;
            if (this.moving>=25) this.state = 1;
            if (this.moving>=50) this.state = 2;
            if (this.moving>=75) this.state = 3;
            if (this.moving>100) {
                this.doorClosed();
                GameEventHandler.getInstance().remToUpdate(this);
            }
        }
        else 
        {
            this.moving -= 750*tickTime;
            if (this.moving<=100) this.state = 4;
            if (this.moving<=75) this.state = 3;
            if (this.moving<=50) this.state = 2;
            if (this.moving<=25) this.state = 1;
            if (this.moving<=0) {
                this.doorOpen();
                GameEventHandler.getInstance().remToUpdate(this);
            }
        }
    }

    receiveMsg(msg:GEMsg) {
        if (msg.action == GEAction.Toggle)
        {
            this.animDoor = true;
            if (this.state != 0 && this.state != 4) this.movDir *=-1;
            GameEventHandler.getInstance().addToUpdate(this);
        }

        if (msg.action == GEAction.Activate)
        {
            this.animDoor = true;
            if (this.state != 0) {
                console.log("Got Event Activate = Open "+this.state);
                //this.movDir *=-1;
                GameEventHandler.getInstance().addToUpdate(this);
            }
        }
        if (msg.action == GEAction.Deactivate)
        {
            this.animDoor = true;
            if (this.state != 4) {
                console.log("Got Event Activate = Close "+this.state);
                //this.movDir *=-1;
                GameEventHandler.getInstance().addToUpdate(this);
            }
        }

    }
}

