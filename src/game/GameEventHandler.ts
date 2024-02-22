import { Dungeon } from "../DMap/Dungeon.js";
import { CellIF, MapCell } from "../DMap/MapCell.js";
import { Point } from "../DMap/Point.js";
import { Distance } from "../gfx/enum_Distance.js";
import { Position } from "../gfx/enum_Position.js";

export enum GETypes {
    NONE,
    DOORBUTTON,
    WALL,
    WALLORNATE,
    MAX,
}

export enum GEAction {
    None,
    Activate,
    Deactivate,
    Toggle, 
    Release,
    Destroy,
    MAX,
}

export interface GEMsg {
    dis:Distance;
    pos:Position;
    type:GETypes;
    action:GEAction;
    cell:MapCell;
}

export class GameEventHandler {
    static instance:GameEventHandler;
    intervalID:any = 0;
    ticks:number = 0;
    dungeon:Dungeon;
    eventMsgQueue:GEMsg[] = [];
    updateList:CellIF[] = [];

    constructor(dungeon:Dungeon) {
        GameEventHandler.instance = this;
        this.dungeon = dungeon;
        this.intervalID = setInterval(this.ticker.bind(this), 100);
    }

    ticker():void {
        this.ticks++;
        while (this.eventMsgQueue.length >0)
        {
            const msg= this.eventMsgQueue.pop();
            if (msg) {
                console.log("Got Message: "+GEAction[msg.action]+"!");

//                const p:Point = new Point(msg.)
//                cell:MapCell = this.dungeon.getLevel(this.dungeon.actualLevel).cell();
//                msg.dis
            }
            // Now iterate through update list:
        }
        for (let obj of this.updateList) {
            //console.log("Update GEH");
            obj.update(1/100);
        }

//        if (this.ticks %10 == 0) console.log("10 ticks passed "+this.updateList.length);
    }

    addToUpdate(obj:CellIF):void {
        const index = this.updateList.indexOf(obj);
        if (index !== -1) return;
        this.updateList.push(obj);
    }

    remToUpdate(obj:CellIF):void {
        const index = this.updateList.indexOf(obj);
        if (index !== -1) this.updateList.splice(index,1);
    }

    sendEvent(msg:GEMsg) {
        this.eventMsgQueue.push(msg);
    }

    update(deltaTime:number) {
    }

    static getInstance():GameEventHandler {
        return this.instance;
    }
}