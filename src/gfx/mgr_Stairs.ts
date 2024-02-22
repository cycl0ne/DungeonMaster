import { StairCell } from "../DMap/Cell_Stair.js";
import { MapCell } from "../DMap/MapCell.js";
import { AssetManager } from "../module/AssetManager.js";
import { GraphicsUtility } from "../module/GraphicsUtility.js";
import { SpriteSystemUtil } from "../module/SpriteSystemUtil.js";
import { Distance } from "./enum_Distance.js";
import { Position } from "./enum_Position.js";
import { IMgrClass, MgrBase } from "./mgr_Base.js";
import { Sprite } from "./sprite/Sprite.js";
import { SpriteManager } from "./sprite/SpriteManager.js";
// Transp. Color: RGB 204,136,102;

enum enum_Stairs{
    up,down,
}

interface StairsInit {
    distance:Distance, 
    position:Position, 
    name:string, 
    x:number, 
    y:number, 
    altname:string, 
    x2:number, 
    y2:number, 
    sidename?:string, 
    sidename2?:string, 
    xs?:number, 
    ys?:number, 
    xs2?:number, 
    ys2?:number
}

class Stairs implements IMgrClass{
    distance:Distance;
    position:Position;
    stairs:Sprite[] = [];
    sides:Sprite[] = [];
    sidesd0c: Sprite[] = [];

    initSprite(img1:HTMLImageElement | HTMLCanvasElement | null, x:number, y:number):Sprite
    {
        let sprite = new Sprite(img1, x, y);
        sprite.setVisible(false);
        sprite.setPriority(SpriteSystemUtil.SpritePrio(this.distance, this.position));
        return sprite;
    }

    constructor(initData:StairsInit) {
        this.position=initData.position;
        this.distance=initData.distance;
        const assetManager = AssetManager.getInstance();
        let img1:HTMLImageElement | HTMLCanvasElement | null = assetManager.getImage(initData.name);
        let img2:HTMLImageElement | HTMLCanvasElement | null = assetManager.getImage(initData.altname);

        if (this.position == Position.Right) {
            img1 = GraphicsUtility.mirrorImageHorizontally(img1);
            img2 = GraphicsUtility.mirrorImageHorizontally(img2);
        }

        if ((this.distance==Distance.D0)&&(this.position!=Position.Center)){
            this.stairs[0] = this.stairs[1] = new Sprite();
            this.sides[enum_Stairs.up]   = this.initSprite(img1, initData.x, initData.y);
            this.sides[enum_Stairs.down] = this.initSprite(img2, initData.x2, initData.y2);
        } else {
            this.stairs[enum_Stairs.up]   = this.initSprite(img1, initData.x, initData.y);
            this.stairs[enum_Stairs.down] = this.initSprite(img2, initData.x2, initData.y2);

            if (this.distance==Distance.D0)
            {
                img1 = GraphicsUtility.mirrorImageHorizontally(img1);
                this.sidesd0c[enum_Stairs.up] = this.initSprite(img1, initData.x+(194), initData.y);
                img1 = GraphicsUtility.mirrorImageHorizontally(img2);
                this.sidesd0c[enum_Stairs.down] = this.initSprite(img1, initData.x+(194), initData.y);
            }

            if (initData.sidename && initData.xs && initData.ys) {
                img1=  assetManager.getImage(initData.sidename);
                if (this.position == Position.Right) {
                    img1 = GraphicsUtility.mirrorImageHorizontally(img1);
                }
                this.sides[enum_Stairs.up] = this.initSprite(img1, initData.xs, initData.ys);
            }
            if (initData.sidename2 && initData.xs2 && initData.ys2) {
                img1=  assetManager.getImage(initData.sidename2);
                if (this.position == Position.Right) {
                    img1 = GraphicsUtility.mirrorImageHorizontally(img1);
                }
                this.sides[enum_Stairs.down] = this.initSprite(img1, initData.xs2, initData.ys2);
            }
        }
    }
    render(ctx: CanvasRenderingContext2D, cell: MapCell, dir: number, alt: boolean, position: Position): void {
        throw new Error("Method not implemented.");
    }

    disable() {
        this.stairs[enum_Stairs.up].setVisible(false);
        this.stairs[enum_Stairs.down].setVisible(false);

        if (this.sides.length>1) {
            this.sides[enum_Stairs.up].setVisible(false);
            this.sides[enum_Stairs.down].setVisible(false);
        }
        if (this.sidesd0c.length>1) {
            this.sidesd0c[enum_Stairs.up].setVisible(false);
            this.sidesd0c[enum_Stairs.down].setVisible(false);
        }

    }

    update(cell:MapCell, dir:number, alt:boolean){
        let ns: number = (dir+2) % 4; 
        const stairs:StairCell = cell as StairCell;
        const updown:number = stairs.direction;//cell.subtype;

        if ((this.sides.length>1) && (ns != cell.facing)) {
            this.sides[updown].setVisible(true);
        } else {
            if (this.distance === Distance.D0) {
                ns = (dir + 2) %2;
                if (cell.facing == dir) {
                    this.stairs[updown].setVisible(true);
                    if (this.sidesd0c.length>1) 
                    {
                        this.sidesd0c[updown].setVisible(true);
                    }
                }                
            } else {
                this.stairs[updown].setVisible(true);
            }
        }
    } 
}

const initStair:StairsInit[] = [
    { distance: Distance.D3, position: Position.Left,   name: "obj0108", x: 7+10, y: 25, altname: "obj0115", x2: 17, y2: 28 },
    { distance: Distance.D3, position: Position.Right,  name: "obj0108", x: 144, y: 25,  altname: "obj0115", x2: 133, y2: 28 },
    { distance: Distance.D3, position: Position.Center, name: "obj0109", x: 77, y: 25,   altname: "obj0116", x2: 77, y2: 25 },

    { distance: Distance.D2, position: Position.Left,   name: "obj0110", x: 0, y: 19,    altname: "obj0117", x2: 0,   y2: 19,   sidename: "obj0122", sidename2: "obj0122", xs: 60, ys:55, xs2:60, ys2:55},
    { distance: Distance.D2, position: Position.Right,  name: "obj0110", x: 164, y: 19,  altname: "obj0117", x2: 164, y2: 19,   sidename: "obj0122", sidename2: "obj0122", xs:156, ys:55, xs2:156, ys2:55},
    { distance: Distance.D2, position: Position.Center, name: "obj0111", x: 61, y: 19,   altname: "obj0118", x2: 63,  y2: 25 },

    { distance: Distance.D1, position: Position.Left,   name: "obj0112", x: 0, y: 9,     altname: "obj0119", x2: 0, y2: 17,     sidename: "obj0123", sidename2: "obj0124", xs:32,  ys:57, xs2:33, ys2:62 },
    { distance: Distance.D1, position: Position.Right,  name: "obj0112", x: 192, y: 9,   altname: "obj0119", x2: 192, y2: 17,   sidename: "obj0123", sidename2: "obj0124", xs:171, ys:57, xs2:170, ys2:62},
    { distance: Distance.D1, position: Position.Center, name: "obj0113", x: 32, y: 9,    altname: "obj0120", x2: 35, y2: 17 },

    { distance: Distance.D0, position: Position.Left,   name: "obj0125", x: 0, y: 72,    altname: "obj0125", x2: 0, y2: 72 }, // we have only SIDE !
    { distance: Distance.D0, position: Position.Right,  name: "obj0125", x: 208, y: 72,  altname: "obj0125", x2: 208, y2: 72 }, // we have only SIDE !
    { distance: Distance.D0, position: Position.Center, name: "obj0114", x: 0, y: 58,    altname: "obj0121", x2: 0, y2: 58 },
];

export class StairManager extends MgrBase<Stairs>{

    constructor(sm:SpriteManager) {
        super(sm);
        this.initClass(initStair,(data)=> new Stairs(data));
    }
}