import { MapCell } from "../DMap/MapCell.js";
import { AssetManager } from "../module/AssetManager.js";
import { GraphicsUtility } from "../module/GraphicsUtility.js";
import { SpriteSystemUtil } from "../module/SpriteSystemUtil.js";
import { Distance } from "./enum_Distance.js";
import { Position } from "./enum_Position.js";
import { Sprite } from "./sprite/Sprite.js";
import { WallObject } from "./Wall_Object.js";

interface WALLINITDATA {
    distance:Distance; position: Position;
    name:string;
    altname:string;
    x:number;
    y:number;
}
export const initWalls = [
    { distance: Distance.D3, position: Position.FarLeft, name: "obj0104", altname: "obj0103", x: 0, y: 25 },
    { distance: Distance.D3, position: Position.FarRight, name: "obj0103", altname: "obj0104", x: 180, y: 25 },
    { distance: Distance.D3, position: Position.Left, name: "obj0106", altname: "obj0105", x: 7, y: 25 },
    { distance: Distance.D3, position: Position.Right, name: "obj0105", altname: "obj0106", x: 134, y: 25 },
    { distance: Distance.D3, position: Position.Center, name: "obj0107", altname: "obj0107", x: 77, y: 25 },
    { distance: Distance.D2, position: Position.FarLeft, name: "obj0099", altname: "obj0098", x: 0, y: 24 },
    { distance: Distance.D2, position: Position.FarRight, name: "obj0098", altname: "obj0099", x: 216, y: 24 },
    { distance: Distance.D2, position: Position.Left, name: "obj0101", altname: "obj0100", x: 0, y: 19 },
    { distance: Distance.D2, position: Position.Right, name: "obj0100", altname: "obj0101", x: 146, y: 19 },
    { distance: Distance.D2, position: Position.Center, name: "obj0102", altname: "obj0102", x: 59, y: 19 },
    { distance: Distance.D1, position: Position.Left, name: "obj0096", altname: "obj0095", x: 0, y: 9 },
    { distance: Distance.D1, position: Position.Right, name: "obj0095", altname: "obj0096", x: 164, y: 9 },
    { distance: Distance.D1, position: Position.Center, name: "obj0097", altname: "obj0097", x: 32, y: 9 },

    { distance: Distance.D0, position: Position.Left, name: "obj0094", altname: "obj0093", x: 0, y: 0 },
    { distance: Distance.D0, position: Position.Right, name: "obj0093", altname: "obj0094", x: 191, y: 0 },
];

export class Wall extends WallObject {
    sprite:Sprite [] = [];

    constructor(init:WALLINITDATA)
    {
        const assetManager = AssetManager.getInstance();
        super(init);
        let img = AssetManager.getInstance().getImage(init.name);
        this.sprite[0] = this.createSprite(img, init.x, init.y);
        img = AssetManager.getInstance().getImage(init.altname);
        img = GraphicsUtility.mirrorImageHorizontally(img);
        this.sprite[1] = this.createSprite(img, init.x, init.y);
        if (this.distance == Distance.D1 && this.position == Position.Center) {
            this.sprite[0].setUserData(this);
            this.sprite[1].setUserData(this);
        }
    }

    createSprite(img:HTMLCanvasElement|HTMLImageElement|null, x:number, y:number):Sprite {
        const sprite:Sprite = new Sprite(img, x, y);
        sprite.setVisible(false);
        sprite.setPriority(SpriteSystemUtil.SpritePrio(this.distance, this.position));
        return sprite;
    }

    onClick():void {
        console.log("Wall touched");
    }

    disable() {
        this.sprite[0].setVisible(false);
        this.sprite[1].setVisible(false);
    }

    update(cell:MapCell, dir:number, alt:boolean)
    {
        const altIndex = Number(alt);
        const nonAltIndex = Number(!alt);
        
        this.sprite[altIndex].setVisible(true);
        this.sprite[nonAltIndex].setVisible(false);
    }
}

