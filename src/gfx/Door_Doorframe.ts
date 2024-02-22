import { MapCell } from "../DMap/MapCell.js";
import { AssetManager } from "../module/AssetManager.js";
import { GraphicsUtility } from "../module/GraphicsUtility.js";
import { SpriteSystemUtil } from "../module/SpriteSystemUtil.js";
import { DoorObject } from "./Door_Object.js";
import { Distance } from "./enum_Distance.js";
import { Position } from "./enum_Position.js";
import { IMgrClass, MgrBase } from "./mgr_Base.js";
import { Sprite } from "./sprite/Sprite.js";

export interface DoorFrameInit {
    distance: Distance;
    position: Position;
    name: string;
    name2?:string;
    name3?:string;
    x:number;
    y:number;
    x2?:number;
    y2?:number;
    x3?:number;
    y3?:number;
}

export const initDoorFrameData : DoorFrameInit [] = [
    { distance: Distance.D0, position: Position.Center, name: "obj0086", x: 96, y: 0},
    { distance: Distance.D1, position: Position.Left,   name: "obj0091",  x: 0, y: (14) },
    { distance: Distance.D1, position: Position.Center, name: "obj0087", name2: "obj0091", name3: "obj0087",  x: 43, y: (14), x2: 43+18, y2: 13, x3: 149+7, y3: 14 },
    { distance: Distance.D1, position: Position.Right,  name: "obj0091", x: 164, y: (14)},
    { distance: Distance.D2, position: Position.Left,   name: "obj0092",  x: 0, y: (21)  },
    { distance: Distance.D2, position: Position.Center, name: "obj0088", name2: "obj0092", name3: "obj0087", x: 64, y: (21), x2: 64+13, y2: 21, x3: 64+78, y3: 21},
    { distance: Distance.D2, position: Position.Right,  name: "obj0092",  x: 164, y: (21)  },
    { distance: Distance.D3, position: Position.Left,   name: "obj0090", name2: "obj0090", x: 16, y: (27), x2: 23+44+5, y2: 27},
    { distance: Distance.D3, position: Position.Center, name: "obj0089", name2: "obj0089", x: 81, y: (27), x2: 89+44, y2: 27},
    { distance: Distance.D3, position: Position.Right,  name: "obj0090", name2: "obj0090",x: 136, y: (27), x2: 224-32, y2: 27},
];


export class DoorFrame extends DoorObject {
    distance: Distance;
    position: Position;
    sprite: Sprite[] = [];
    button: Sprite[] = []; 

    constructor(init:DoorFrameInit)
    {
        super(init);
        const assetManager:AssetManager = AssetManager.getInstance();
        this.distance = init.distance;
        this.position = init.position;

        if (this.distance == Distance.D0) {
            let img = assetManager.getImage(init.name);
            this.sprite[0] = this.createSprite(img, init.x, init.y);
            return;
        }
        if (init.name3) {
            let img = assetManager.getImage(init.name);
            this.sprite[0] = this.createSprite(img, init.x, init.y);
            img = GraphicsUtility.mirrorImageHorizontally(img);
            this.sprite[2] = this.createSprite(img, init.x3!, init.y3!);
            img = assetManager.getImage(init.name2!);
            this.sprite[1] = this.createSprite(img, init.x2!, init.y2!);
            return;
        } else if (init.name2) {
            let img = assetManager.getImage(init.name);
            this.sprite[0] = this.createSprite(img, init.x, init.y);
            img = GraphicsUtility.mirrorImageHorizontally(img);
            this.sprite[1] = this.createSprite(img, init.x2!, init.y2!);
            return;
        } else {
            let img = assetManager.getImage(init.name);
            img = GraphicsUtility.cutImage(img!, 3, 0, 60, img!.height);
            this.sprite[0] = this.createSprite(img, init.x, init.y);
            return;
        }
        
    }

    createSprite(img:HTMLCanvasElement|HTMLImageElement|null, x:number, y:number):Sprite {
        const sprite:Sprite = new Sprite(img, x, y);
        sprite.setVisible(false);
        sprite.setPriority(SpriteSystemUtil.SpritePrio(this.distance, this.position));
        return sprite;
    }

    disable(): void {
        for (let i = 0; i < this.sprite.length; i++) this.sprite[i].setVisible(false);
    }
    
    enable():void {
        for (let i = 0; i < this.sprite.length; i++) this.sprite[i].setVisible(true);
    }

    disableSide(ns:number):boolean{
        if (ns==1 || ns==3) {
            this.disable();
            return true;
        }
        return false;
    }

    update(cell: MapCell, dir:number, alt:boolean, pos:Position) {
        const ns = dir%2;

        if (this.distance == Distance.D0) {
            if (ns == cell.facing) {
                this.disable();
                return;
            }
        }
        if (this.distance == Distance.D1  && (this.position == Position.Left || this.position == Position.Right)) {
            if (ns != cell.facing) {
                this.disable();
                return;
            }
        }
        this.enable();
    }
}
