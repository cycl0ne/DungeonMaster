import { MapCell } from "../DMap/MapCell.js";
import { enum_MapCell } from "../DMap/enum_MapCell.js";
import { AssetManager } from "../module/AssetManager.js";
import { GraphicsUtility } from "../module/GraphicsUtility.js";
import { FloorObject } from "./Floor_Object.js";
import { Distance } from "./enum_Distance.js";
import { Position } from "./enum_Position.js";
import { IInitData } from "./mgr_Base.js";
import { Sprite } from "./sprite/Sprite.js";

export const initPit = [
    { distance: Distance.D0, position: Position.Left },
    { distance: Distance.D0, position: Position.Center },
    { distance: Distance.D0, position: Position.Right },
    { distance: Distance.D1, position: Position.Left },
    { distance: Distance.D1, position: Position.Center },
    { distance: Distance.D1, position: Position.Right },
    { distance: Distance.D2, position: Position.Left },
    { distance: Distance.D2, position: Position.Center },
    { distance: Distance.D2, position: Position.Right },
    { distance: Distance.D3, position: Position.FarLeft },
    { distance: Distance.D3, position: Position.Left },
    { distance: Distance.D3, position: Position.Center },
    { distance: Distance.D3, position: Position.Right },
    { distance: Distance.D3, position: Position.FarRight },
];

enum PitsCoord {
    L_D0,
    C_D0,
    R_D0,
    L_D1,
    C_D1,
    R_D1,
    L_D2,
    C_D2,
    R_D2,
    FL_D3,
    L_D3,
    C_D3,
    R_D3,
    FR_D3,
}

/*
Ceileing
    { x: 0,   y: 0,   pos: 1 },
    { x: 0,   y: 0,   pos: 5 },
    { x: 0,   y: 0,   pos: 2 },
    { x: 0,   y: 8,   pos: 1 },
    { x: 0,   y: 8,   pos: 5 },
    { x: 0,   y: 8,   pos: 2 },
    { x: 0,   y: 19,  pos: 1 },
    { x: 0,   y: 19,  pos: 5 },
    { x: 0,   y: 19,  pos: 2 },
*/

// Sort: D0L, C, R ; D1L, C, R, ...
export const FLOOR_PIT_COORDS = [
    { x: -4,  y: 126, pos: 1 },
    { x: 0,   y: 127, pos: 5 }, // d0 C
    { x: 0,   y: 126, pos: 2 },
    { x: -3,  y: 94,  pos: 1 },
    { x: 1-1,   y: 94,  pos: 5 }, // D1C
    { x: 2,   y: 94,  pos: 2 },
    { x: -1,  y: 76,  pos: 1 },
    { x: 0,   y: 77+1,  pos: 5 }, //d2C
    { x: 1,   y: 76,  pos: 2 },
    { x: 0,   y: 66-1,  pos: 1 },
    { x: 4,   y: 65,  pos: 1 },
    { x: -1,  y: 65,  pos: 5 },
    { x: -4,  y: 65,  pos: 2 },
    { x: 0,   y: 66-1,  pos: 2 },
];

export const FLOOR_PIT_OBJECT = [
    ["obj0056", "obj0057", "obj0056", "obj0054", "obj0055", "obj0054", "obj0052", "obj0053", "obj0052", "obj0049", "obj0050", "obj0051", "obj0050", "obj0049"],
];

export class FloorPit extends FloorObject{
    floorpit:Sprite[] = [];
    _assetManager:AssetManager = AssetManager.getInstance();

    private enum2Array()
    {
        switch(this.distance){
            case 0:
                return this.position-1;
            case 1:
                return this.position-1 + 3;
            case 2:
                return this.position-1 + 6;
            case 3:
                return this.position + 9;
        }
        return 0;
    }

    constructor(init:IInitData, pitCoords: {x: number, y: number, pos:number}[], pitObjects: string[][]) {
        super(init);

        for (let names of pitObjects) {
            let pos:number = this.enum2Array();
            let img = this._assetManager.getImage(names[pos]);
            //console.log(names[pos]+": "+Distance[this.distance]+":"+Position[this.position]);

            if (this.position == Position.Right) img = GraphicsUtility.mirrorImageHorizontally(img);
            if (this.position == Position.FarRight) img = GraphicsUtility.mirrorImageHorizontally(img);
            let x:number = 0;  
            let y:number = 0;
            switch(pitCoords[pos].pos) {
                case 1:
                    x= pitCoords[pos].x;
                    y = pitCoords[pos].y+1;
                    break;
                case 2:
                    [x, y] = GraphicsUtility.TopRight(img, pitCoords[pos].x, pitCoords[pos].y);
                    break;
                case 5:
                    [x, y] = GraphicsUtility.CenterTop(img, pitCoords[pos].x, pitCoords[pos].y);
                   break;
                default:
                    console.log("ERR: "+pitCoords[pos].pos);
                    break;
            }
            this.floorpit[0] = this.createSprite(img, x, y);
        }
    }

    update(cell:MapCell, dir:number, alt:boolean) {
//        if (this.position = Position.Center) console.log("Pit: "+this.distance+":"+this.position+": "+cell.type);
//        if (cell.type == enum_MapCell.PIT) console.log("Pit: "+this.distance+":"+this.position);
        if (cell.type == enum_MapCell.PIT) this.floorpit[0].setVisible(true);
    }
}
