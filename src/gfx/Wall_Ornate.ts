import { MirrorWOObject, WallCell } from "../DMap/Cell_Wall.js";
import { enum_WallOrnates } from "../DMap/enum_WallOrnates.js";
import { MapCell } from "../DMap/MapCell.js";
import { AssetManager } from "../module/AssetManager.js";
import { GraphicsUtility } from "../module/GraphicsUtility.js";
import { Distance } from "./enum_Distance.js";
import { Position } from "./enum_Position.js";
import { IInitData } from "./mgr_Base.js";
import { Sprite } from "./sprite/Sprite.js";
import { WallObject } from "./Wall_Object.js";

export const initWallOrnate = [
    { distance: Distance.D3, position: Position.Left },
    { distance: Distance.D3, position: Position.Center },
    { distance: Distance.D3, position: Position.Right },
    { distance: Distance.D2, position: Position.Left },
    { distance: Distance.D2, position: Position.Center },
    { distance: Distance.D2, position: Position.Right },
    { distance: Distance.D1, position: Position.Left },
    { distance: Distance.D1, position: Position.Center },
    { distance: Distance.D1, position: Position.Right },
];

enum WOrnCoord {
    SL_D3,
    SR_D3,
    FL_D3,
    FC_D3,
    FR_D3,
    SL_D2,
    SR_D2,
    FL_D2,
    FC_D2,
    FR_D2,
    SL_D1,
    SR_D1,
    FC_D1,
}

enum wOrnateGroup {
    Group0 = 0,
    Group1 = 1,
    Group2 = 2,
    Group3 = 3,
    Group4 = 4,
    Group5 = 5,
    Group6 = 6,
    Group7 = 7,
    Group8 = 8,
};

export const wallObjectCoordinates = [
    [
        {x: 85,  y: 43},
        {x: 139, y: 43},
        {x: 45,  y: 44},
        {x: 112, y: 44},
        {x: 180, y: 44},
        {x: 71,  y: 45},
        {x: 154, y: 45},
        {x: 10,  y: 47},
        {x: 112, y: 47},
        {x: 214, y: 47},
        {x: 55,  y: 49},
        {x: 170, y: 49},
        {x: 112, y: 50}
    ],
    [
        {x: 84,  y: 49},
        {x: 141, y: 50},
        {x: 44,  y: 50},
        {x: 112, y: 50},
        {x: 180, y: 50},
        {x: 68,  y: 54},
        {x: 155, y: 54},
        {x: 9,   y: 57},
        {x: 112, y: 57},
        {x: 214, y: 57},
        {x: 46,  y: 61},
        {x: 178, y: 61},
        {x: 112, y: 64},
    ],
    [ // 2 need to be ORANGE! (Botom hort/Vert Aligned)
        {x: 85,  y: 68},
        {x: 140, y: 68},
        {x: 45,  y: 73},
        {x: 112, y: 73},
        {x: 180, y: 73},
        {x: 71,  y: 85},
        {x: 153, y: 85},
//        {x: 71,  y: 83},
//        {x: 153, y: 83},
        {x: 12,  y: 92},
        {x: 113, y: 92},
        {x: 215, y: 92},
        {x: 55,  y: 103},
        {x: 169, y: 103},
        {x: 112, y: 119},
    ],
    [ // Set 3
        {x: 82,  y: 51},
        {x: 142, y: 51},
        {x: 44,  y: 56},
//        {x: 111, y: 55}, //tmp fix? ;)
        {x: 113, y: 55},
        {x: 180, y: 56},
        {x: 72,  y: 58},
        {x: 151, y: 58},
        {x: 11,  y: 65},
        {x: 113, y: 65},
        {x: 215, y: 65},
        {x: 56,  y: 67},
        {x: 168, y: 67},
        {x: 112, y: 78}
    ],
    [ // Set 4
        {x: 83,  y: 42},
        {x: 141, y: 42},
        {x: 43,  y: 43},
        {x: 113, y: 42},
        {x: 182, y: 43},
        {x: 68,  y: 44},
        {x: 156, y: 44},
        {x: 7,   y: 44},
        {x: 112, y: 44},
        {x: 217, y: 44},
        {x: 47,  y: 46},
        {x: 177, y: 46},
        {x: 111, y: 46}
    ],
    [ // Set 5
        {x: 82,  y: 44},
        {x: 142, y: 44},
        {x: 26,  y: 44},
        {x: 112, y: 44},
        {x: 195, y: 44},
        {x: 71,  y: 46},
        {x: 153, y: 46},
        {x: 5,   y: 48},
        {x: 112, y: 48},
        {x: 215, y: 48},
        {x: 49,  y: 49},
        {x: 175, y: 49},
        {x: 112, y: 51}
    ],
    [ // Set 6 (ORANGE)
        {x: 79,  y: 75},
        {x: 146, y: 75},
        {x: 36,  y: 73},
        {x: 112, y: 73},
        {x: 187, y: 73},
        {x: 69,  y: 90},
        {x: 155, y: 90},
        {x: 8,   y: 92},
        {x: 112, y: 91},
        {x: 214, y: 92},
        {x: 49,  y: 119},
        {x: 177, y: 119},
        {x: 112, y: 119}
    ],
    [ // set 7 (PURPLE)
        {x: 78,  y: 41},
        {x: 145, y: 41},
        {x: 44,  y: 38},
        {x: 115, y: 38},
        {x: 182, y: 38},
        {x: 69,  y: 38},
        {x: 155, y: 38},
        {x: 11,  y: 37},
        {x: 113, y: 37},
        {x: 217, y: 37},
        {x: 48,  y: 37},
        {x: 176, y: 36},
        {x: 112, y: 36}
    ],
    [ // set 8
        {x: 78,  y: 41},
        {x: 145, y: 41},
        {x: 44,  y: 38},
        {x: 115, y: 38},
        {x: 182, y: 38},
        {x: 69,  y: 38},
        {x: 155, y: 38},
        {x: 11,  y: 37},
        {x: 113, y: 37},
        {x: 217, y: 37},
        {x: 48,  y: 37},
        {x: 176, y: 36},
        {x: 151, y: 106}
    ]
];

// Center , Side
export type wallObj = {
    ornate: [string, string],
    group: number

}

export const wallObjects:wallObj[] = [
    { ornate: ["obj0260", "obj0259"], group: wOrnateGroup.Group1 },
    { ornate: ["obj0262", "obj0261"], group: wOrnateGroup.Group1 },
    { ornate: ["obj0264", "obj0263"], group: wOrnateGroup.Group1 },
    { ornate: ["obj0266", "obj0265"], group: wOrnateGroup.Group1 },
    { ornate: ["obj0268", "obj0267"], group: wOrnateGroup.Group0 },
    { ornate: ["obj0270", "obj0269"], group: wOrnateGroup.Group0 },
    { ornate: ["obj0272", "obj0271"], group: wOrnateGroup.Group0 },
    { ornate: ["obj0274", "obj0273"], group: wOrnateGroup.Group0 },
    { ornate: ["obj0276", "obj0275"], group: wOrnateGroup.Group0 },
    { ornate: ["obj0278", "obj0277"], group: wOrnateGroup.Group0 },
    { ornate: ["obj0280", "obj0279"], group: wOrnateGroup.Group0 },
    { ornate: ["obj0282", "obj0281"], group: wOrnateGroup.Group2 },
    { ornate: ["obj0284", "obj0283"], group: wOrnateGroup.Group3 },
    { ornate: ["obj0286", "obj0285"], group: wOrnateGroup.Group0 },
    { ornate: ["obj0288", "obj0287"], group: wOrnateGroup.Group0 },
    { ornate: ["obj0290", "obj0289"], group: wOrnateGroup.Group0 },
    { ornate: ["obj0292", "obj0291"], group: wOrnateGroup.Group0 },
    { ornate: ["obj0294", "obj0293"], group: wOrnateGroup.Group0 },
    { ornate: ["obj0296", "obj0295"], group: wOrnateGroup.Group0 },
    { ornate: ["obj0298", "obj0297"], group: wOrnateGroup.Group0 },
    { ornate: ["obj0300", "obj0299"], group: wOrnateGroup.Group0 },
    { ornate: ["obj0302", "obj0301"], group: wOrnateGroup.Group0 },
    { ornate: ["obj0304", "obj0303"], group: wOrnateGroup.Group0 },
    { ornate: ["obj0306", "obj0305"], group: wOrnateGroup.Group0 },
    { ornate: ["obj0308", "obj0307"], group: wOrnateGroup.Group0 },
    { ornate: ["obj0310", "obj0309"], group: wOrnateGroup.Group0 },
    { ornate: ["obj0312", "obj0311"], group: wOrnateGroup.Group0 },
    { ornate: ["obj0314", "obj0313"], group: wOrnateGroup.Group0 },
    { ornate: ["obj0316", "obj0315"], group: wOrnateGroup.Group0 },
    { ornate: ["obj0318", "obj0317"], group: wOrnateGroup.Group0 },
    { ornate: ["obj0320", "obj0319"], group: wOrnateGroup.Group0 },
    { ornate: ["obj0322", "obj0321"], group: wOrnateGroup.Group0 },
    { ornate: ["obj0324", "obj0323"], group: wOrnateGroup.Group0 },
    { ornate: ["obj0326", "obj0325"], group: wOrnateGroup.Group2 },
    { ornate: ["obj0328", "obj0327"], group: wOrnateGroup.Group2 },
    { ornate: ["obj0330", "obj0329"], group: wOrnateGroup.Group1 },
    { ornate: ["obj0332", "obj0331"], group: wOrnateGroup.Group1 },
    { ornate: ["obj0334", "obj0333"], group: wOrnateGroup.Group1 },

    { ornate: ["obj0336", "obj0335"], group: wOrnateGroup.Group1 },
    { ornate: ["obj0338", "obj0337"], group: wOrnateGroup.Group1 },
    { ornate: ["obj0340", "obj0339"], group: wOrnateGroup.Group4 },
    { ornate: ["obj0342", "obj0341"], group: wOrnateGroup.Group4 },
    { ornate: ["obj0344", "obj0343"], group: wOrnateGroup.Group4 },
    { ornate: ["obj0346", "obj0345"], group: wOrnateGroup.Group5 },
    { ornate: ["obj0348", "obj0347"], group: wOrnateGroup.Group0 },
    { ornate: ["obj0350", "obj0349"], group: wOrnateGroup.Group0 },
    { ornate: ["obj0352", "obj0351"], group: wOrnateGroup.Group1 },
    { ornate: ["obj0354", "obj0353"], group: wOrnateGroup.Group0 },
    { ornate: ["obj0356", "obj0355"], group: wOrnateGroup.Group0 },
    { ornate: ["obj0358", "obj0357"], group: wOrnateGroup.Group0 },
    { ornate: ["obj0360", "obj0359"], group: wOrnateGroup.Group8 },
    { ornate: ["obj0362", "obj0361"], group: wOrnateGroup.Group0 },
    { ornate: ["obj0364", "obj0363"], group: wOrnateGroup.Group0 },
    { ornate: ["obj0366", "obj0365"], group: wOrnateGroup.Group0 },
    { ornate: ["obj0368", "obj0367"], group: wOrnateGroup.Group0 },
    { ornate: ["obj0370", "obj0369"], group: wOrnateGroup.Group0 },
    { ornate: ["obj0372", "obj0371"], group: wOrnateGroup.Group6 },
    { ornate: ["obj0374", "obj0373"], group: wOrnateGroup.Group6 },
    { ornate: ["obj0376", "obj0375"], group: wOrnateGroup.Group6 },
    //Lord Order Missing Grp7 ;-)
];

export class WallOrnate extends WallObject {
    wallornate:Sprite [] = [];
    wallornateSide:Sprite [] = [];
    ornateCoords:{ x: number, y: number }[][]
    swapCanvas!:HTMLCanvasElement;
    _assetManager:AssetManager= AssetManager.getInstance();
    _cell:MapCell|undefined = undefined;
    _celldir:number|undefined = undefined;

    computeImageCoords(img:any, group:number, index:number):[number, number] {
        let x:number = 0;
        let y:number = 0;
        switch (group) {
            case wOrnateGroup.Group6:
            case wOrnateGroup.Group2:
                [x, y] = GraphicsUtility.BottomCenter(img, this.ornateCoords[group][index].x, this.ornateCoords[group][index].y);
            break;
            default:
            case wOrnateGroup.Group0:
            case wOrnateGroup.Group1:
            case wOrnateGroup.Group3:
            case wOrnateGroup.Group4:
            case wOrnateGroup.Group5:
            case wOrnateGroup.Group7:
                [x, y] = GraphicsUtility.Center(img, this.ornateCoords[group][index].x, this.ornateCoords[group][index].y);
            break;
        }
        return [ x, y ];
    }

    createImageAndCenter(name:string, group:number, index:number, mirror:boolean=false) {
        let x:number;
        let y:number;
        let img = this._assetManager.getImage(name);
        if (mirror) img = GraphicsUtility.mirrorImageHorizontally(img);
        [x,y] = this.computeImageCoords(img, group, index);
        return this.createSprite(img, x, y);     
    }

    adjustImageForXCoordinates(img:any, x:number, y:number): Sprite {
        if (x <0 ) {
            let trimAmount = Math.abs(x);
            img = GraphicsUtility.cutImage(img, trimAmount, 0, img.width-trimAmount, img.height);
            x=0; // set to 0 since we cut in border
        } else if (img.width + x - 224 >0)
        {
            const trimAmount = img.width + x - 224;
            img = GraphicsUtility.cutImage(img, 0,0, img.width-trimAmount, img.height);
        }
        return this.createSprite(img, x,y);
    }

    createImageAndProcess(name:string, group:number, index:number, mirror:boolean=false):Sprite
    {
        let x:number;
        let y:number;
        let img = this._assetManager.getImage(name);
        if (mirror) img = GraphicsUtility.mirrorImageHorizontally(img);
        img = GraphicsUtility.rescaleImageDistance(img as HTMLCanvasElement, this.distance);
        img = GraphicsUtility.darkenImageDistance(img, this.distance);
        [x,y] = this.computeImageCoords(img, group, index);
        return this.adjustImageForXCoordinates(img,x,y);
    }

    constructor(init: IInitData, ornateCoords: { x: number, y: number }[][], ornateObj:wallObj[]) {
        super(init);
        this.ornateCoords = ornateCoords;
        
        for (let i=0; i<ornateObj.length; i++) {
            const name    = ornateObj[i].ornate[0];
            const sideName= ornateObj[i].ornate[1];
            const grp     = ornateObj[i].group;

            switch(init.distance)
            {
                case Distance.D3:
                    if (init.position == Position.Center) {
                        this.wallornate[i]     = this.createImageAndProcess(name, grp, WOrnCoord.FC_D3, false);
                    } else if (init.position == Position.Left) {
                        this.wallornate[i]     = this.createImageAndProcess(name, grp, WOrnCoord.FL_D3, false);
                        this.wallornateSide[i] = this.createImageAndProcess(sideName, grp, WOrnCoord.SL_D3, false);
                    } else if (init.position == Position.Right) {
                        this.wallornate[i]     = this.createImageAndProcess(name, grp, WOrnCoord.FR_D3, true);
                        this.wallornateSide[i] = this.createImageAndProcess(sideName, grp, WOrnCoord.SR_D3, true);
                    } 
                break;
                case Distance.D2:
                    if (init.position == Position.Center) {
                        this.wallornate[i]     = this.createImageAndProcess(name, grp, WOrnCoord.FC_D2, false);
                    } else if (init.position == Position.Left) {
                        this.wallornate[i]     = this.createImageAndProcess(name, grp, WOrnCoord.FL_D2, false);
                        this.wallornateSide[i] = this.createImageAndProcess(sideName, grp, WOrnCoord.SL_D2, false);
                    } else if (init.position == Position.Right) {
                        this.wallornate[i]     = this.createImageAndProcess(name, grp, WOrnCoord.FR_D2, true);
                        this.wallornateSide[i] = this.createImageAndProcess(sideName, grp, WOrnCoord.SR_D2, true);
                    }
                break;
                case Distance.D1:
                    if (init.position == Position.Center) {
                        this.wallornate[i]      = this.createImageAndCenter(name, grp, WOrnCoord.FC_D1);
                        this.wallornate[i].setUserData(this);
                    } else if (init.position == Position.Left) {
                        this.wallornateSide[i]  = this.createImageAndCenter(sideName, grp, WOrnCoord.SL_D1);
                    } else if (init.position == Position.Right) {
                        this.wallornateSide[i]  = this.createImageAndCenter(sideName, grp, WOrnCoord.SR_D1, true);
                    } 
                break;
            } 
        }
    }

    onClick():void {
        let orn:number=0;
        for (let i=0; i<this.wallornate.length; i++) if (this.wallornate[i].visible) {orn=i; break}
        if (this._cell && (this._celldir !=undefined)) {
            console.log("Wallornate touched "+enum_WallOrnates[orn+1]+" ");
            const cell = this._cell as WallCell;
            if (cell.wornate[this._celldir]) cell.wornate[this._celldir].onClick();
        } else {
            console.log("ERROR: Wallornate touched "+enum_WallOrnates[orn+1]+" without cell");
            console.log("cell:"+this._cell);
            console.log("celldir:"+this._celldir);
        }
    }

    disable() {
        for (let i=0; i< this.wallornate.length; i++) this.wallornate[i].setVisible(false);
        for (let i=0; i< this.wallornateSide.length; i++) this.wallornateSide[i].setVisible(false);
    }

    isWallCell(cell: any): cell is WallCell {
        return cell instanceof WallCell;
    }

    update(cell:WallCell, dir:number, alt:boolean, position:Position) {
        if (this.isWallCell(cell)) 
        {
            if (this.distance== Distance.D1 && this.position == Position.Center) {this._celldir = (dir + 2) % 4; this._cell = cell; }
            else {this._cell = undefined; this._celldir = undefined}

            const frontIndex = cell.deco[(dir + 2) % 4]; // +2 represents the front direction
            if (frontIndex)
            {
                if (this.wallornate[frontIndex-1]) {
                    this.wallornate[frontIndex-1].setVisible(true);
                    if (this.distance == Distance.D1 && (frontIndex == enum_WallOrnates.ChampionMirror)) {
                        if (!this.swapCanvas) {
                            this.swapCanvas = this.wallornate[frontIndex-1].getImage() as HTMLCanvasElement;
                        }
                        const mirr:MirrorWOObject = cell.wornate[(dir + 2) % 4] as MirrorWOObject;
                        if (mirr.champion) {
                            //let canvas = this.wallornate[frontIndex-1].getImage() as HTMLCanvasElement;
                            ///canvas = GraphicsUtility.setImageColorToTransparent(canvas, "0x00cccc");
                            let tmp = GraphicsUtility.combineImages2(this.swapCanvas, mirr.champion._mirrorportrait, 8, 6);
                            this.wallornate[frontIndex-1].setImage(tmp);
                        } else {
                            if (this.swapCanvas !== this.wallornate[frontIndex-1].getImage()) this.wallornate[frontIndex-1].setImage(this.swapCanvas);
                        }
                    }
                }
            }
            // Confusing but true: if we look straight and have right a wall, then the items "left" need to be drawn
            // this works, but normaly we have this.position-> need to check brainlogic here
            if (this.position > Position.Center){
                const leftIndex  = cell.deco[(dir + 3) % 4]; // +3 represents the left direction
                if (leftIndex && this.wallornateSide[leftIndex-1])  this.wallornateSide[leftIndex-1].setVisible(true);
            } else
            {
                const rightIndex = cell.deco[(dir + 1) % 4];
                if (rightIndex&& this.wallornateSide[rightIndex-1]) this.wallornateSide[rightIndex-1].setVisible(true);
            }
        }   
    }
}

