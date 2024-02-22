import { MapCell } from "../DMap/MapCell.js";
import { enum_FloorItem } from "../gfx/enum_FloorItem.js";
import { enum_FloorOrnate } from "./enum_FloorOrnate.js";
import { AssetManager } from "../module/AssetManager.js";
import { GraphicsUtility } from "../module/GraphicsUtility.js";
import { SpriteSystemUtil } from "../module/SpriteSystemUtil.js";
import { Distance } from "./enum_Distance.js";
import { Position } from "./enum_Position.js";
import { FloorObject } from "./Floor_Object.js";
import { IInitData, IMgrClass } from "./mgr_Base.js";
import { Sprite } from "./sprite/Sprite.js";
/*
** Ordering D1L,D1C,C1R,....
*/
export const FLOOR_ORNATE_COORDS = [
    { x:0,     y:107 },
    { x:112,   y:106 },
    { x:223,   y:107 },
    { x:31,    y:83},
    { x:112,   y:83},
    { x:194,   y:83}, //x:197
    { x:52,    y:70},
    { x:112,   y:70},
    { x:173,   y:70}    
];

export const FLOOR_ORNATE_OBJECT = [
["obj0389", "obj0390", "obj0389", "obj0387", "obj0388", "obj0387", "obj0385", "obj0386", "obj0385"],
["obj0395", "obj0396", "obj0395", "obj0393", "obj0394", "obj0393", "obj0391", "obj0392", "obj0391"],
["obj0401", "obj0402", "obj0401", "obj0399", "obj0400", "obj0399", "obj0397", "obj0398", "obj0397"],
["obj0407", "obj0408", "obj0407", "obj0405", "obj0406", "obj0405", "obj0403", "obj0404", "obj0403"],
["obj0413", "obj0414", "obj0413", "obj0411", "obj0412", "obj0411", "obj0409", "obj0410", "obj0409"],
["obj0419", "obj0420", "obj0419", "obj0417", "obj0418", "obj0417", "obj0415", "obj0416", "obj0415"],
["obj0425", "obj0426", "obj0425", "obj0423", "obj0424", "obj0423", "obj0421", "obj0422", "obj0421"],
["obj0431", "obj0432", "obj0431", "obj0429", "obj0430", "obj0429", "obj0427", "obj0428", "obj0427"],
["obj0437", "obj0438", "obj0437", "obj0435", "obj0436", "obj0435", "obj0433", "obj0434", "obj0433"],
];

export class FloorOrnate extends FloorObject {
    floorornate:Sprite[] = [];

    constructor(init:IInitData, ornateCoords: {x: number, y: number}[], ornatesObjects: string[][]) {
        super(init);
        const assetManager:AssetManager = AssetManager.getInstance();

        let cnt=0;
        for (let names of ornatesObjects) {
            let pos = ((this.distance-1)*3) + this.position-1;
            let img = assetManager.getImage(names[pos]);
            if (this.position == Position.Right) img = GraphicsUtility.mirrorImageHorizontally(img);
            let x = ornateCoords[pos].x;
            let y = ornateCoords[pos].y;
            if (img) {
                if (this.distance == Distance.D1) {
                    if (this.position == Position.Left) {
                        x = x;
                        y -= Math.ceil(img.height / 2);
//                        console.log("D1Left: "+x+":"+y);
                    } else if (this.position == Position.Right) {
                        x -= img.width-1;
                        y -= Math.ceil(img.height / 2);
 //                       console.log("D1Right: "+x+":"+y);
                    } else {
                        x -= Math.ceil(img.width/2);
                        y -= Math.ceil(img.height/2);    
                    }
                } else {
                    x -= Math.ceil(img.width/2);
                    y -= Math.ceil(img.height/2);
                }
            }
//            console.log("Create Sprite: "+x+":"+y);
            this.floorornate[cnt] = this.createSprite(img, x, y);
//            console.log("["+cnt+"]Created: "+this.distance+":"+this.position+"("+pos+")="+names[this.position-1])
            cnt++;
        }
    }

    disable() {
        for (let i=0; i< this.floorornate.length; i++) this.floorornate[i].setVisible(false);
    }

    update(cell:MapCell, dir:number, alt:boolean) {
        if (cell.subtype != enum_FloorItem.FLOORITEM_ORNATE) return;
        if (cell.subsubtype < enum_FloorOrnate.INVALID) 
        {
            this.floorornate[cell.subsubtype].setVisible(true);
        }
    } 
}
