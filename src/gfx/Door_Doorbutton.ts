import { DoorCell } from "../DMap/Cell_Door.js";
import { MapCell } from "../DMap/MapCell.js";
import { GEAction, GEMsg, GETypes } from "../game/GameEventHandler.js";
import { GraphicsUtility } from "../module/GraphicsUtility.js";
import { DoorObject } from "./Door_Object.js";
import { Distance } from "./enum_Distance.js";
import { Position } from "./enum_Position.js";
import { IInitData } from "./mgr_Base.js";
import { Sprite } from "./sprite/Sprite.js";

export const initDoorB = [
    { distance: Distance.D3, position: Position.Center },
    { distance: Distance.D3, position: Position.Right },
    { distance: Distance.D2, position: Position.Center },
    { distance: Distance.D1, position: Position.Center },
];

interface IFDoorButton {
    name:string;
    D3Rx:number;
    D3Ry:number;
    D3Cx:number;
    D3Cy:number;
    D2Cx:number;
    D2Cy:number;
    D1Cx:number;
    D1Cy:number;
}

export const initDoorButton : IFDoorButton [] = [
    {name: "obj0453", D3Rx: 199, D3Ry: 41, D3Cx: 139, D3Cy: 43, D2Cx: 153, D2Cy: 45, D1Cx: 171, D1Cy: 48},
];

export class DoorButton extends DoorObject {
    dbutton:Sprite | undefined;
    cell:DoorCell|undefined;

    constructor(init:IInitData, initData:IFDoorButton[]) {
        super(init);
        let x:number =0;
        let y:number =0;

        let img = this._assetManager.getImage(initData[0].name);

        if (this.distance == Distance.D1 && this.position == Position.Center) {
            [x,y] = GraphicsUtility.Center(img, initData[0].D1Cx, initData[0].D1Cy);
            this.dbutton = this.createSprite(img, x, y);
            this.dbutton.setUserData(this);
            return;
        } else if (this.distance == Distance.D2 && this.position == Position.Center) 
        {
            img = GraphicsUtility.rescaleImageDistance(img as HTMLCanvasElement, this.distance);
            img = GraphicsUtility.darkenImageDistance(img, this.distance);
            [x,y] = GraphicsUtility.Center(img, initData[0].D2Cx, initData[0].D2Cy);
        } else if (this.distance == Distance.D3 && this.position == Position.Right)
        {
            img = GraphicsUtility.rescaleImageDistance(img as HTMLCanvasElement, this.distance);
            img = GraphicsUtility.darkenImageDistance(img, this.distance);
            [x,y] = GraphicsUtility.Center(img, initData[0].D3Rx, initData[0].D3Ry);
        } else if (this.distance == Distance.D3 && this.position == Position.Center)
        {
            img = GraphicsUtility.rescaleImageDistance(img as HTMLCanvasElement, this.distance);
            img = GraphicsUtility.darkenImageDistance(img, this.distance);
            [x,y] = GraphicsUtility.Center(img, initData[0].D3Cx, initData[0].D3Cy);
        }
        this.dbutton = this.createSprite(img, x, y);
    }

    onClick():void {
        //console.log("Button pressed"+this.cell);
        const msg:GEMsg = {
            dis: this.distance,
            pos: this.position,
            type: GETypes.DOORBUTTON,
            action: GEAction.Toggle,
            cell: this.cell as MapCell,
        };
        if (this.cell) this.cell.receiveMsg(msg);
        //        GameEventHandler.getInstance().sendEvent(msg);
    }

    disable(): void {
        if (this.dbutton) this.dbutton.setVisible(false);
    }

    update(cell: MapCell, dir: number, alt: boolean, position: Position): void {
        const dbut:DoorCell = cell as DoorCell;
        if (dbut.doorButton) {
            if (this.dbutton) {
                this.dbutton.setVisible(true);
                if (this.distance== Distance.D1 && this.position == Position.Center) this.cell = dbut;
                else this.cell = undefined;
            }
        }
    }
}
