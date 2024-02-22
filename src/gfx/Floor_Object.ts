import { Distance } from "./enum_Distance.js";
import { Position } from "./enum_Position.js";
import { IInitData, IMgrClass } from "./mgr_Base.js";
import { MapCell } from "../DMap/MapCell.js";
import { SpriteSystemUtil } from "../module/SpriteSystemUtil.js";
import { Sprite } from "./sprite/Sprite.js";
import { SpriteManager } from "./sprite/SpriteManager.js";
import { SpriteSystem } from "./sprite/SpriteSystem.js";

//--------ROOT Class for all Floor Objects
export class FloorObject implements IMgrClass {
    distance: Distance;
    position: Position;
    _spriteManager:SpriteManager | null;

    constructor(init:IInitData) {
        this.distance = init.distance;
        this.position = init.position;
        this._spriteManager = SpriteSystem.getInstance().getSpriteManagerName("FOV");
    }
    
    render(ctx: CanvasRenderingContext2D, cell: MapCell, dir: number, alt: boolean, position: Position): void {
        throw new Error("Method not implemented.");
    }

    createSprite(img:HTMLCanvasElement|HTMLImageElement|null, x:number, y:number):Sprite {
        const sprite:Sprite = new Sprite(img, x, y, this._spriteManager);
        sprite.setVisible(false);
        sprite.setPriority(SpriteSystemUtil.SpritePrio(this.distance, this.position));
        return sprite;
    }
    
    disable() {}
    update(cell:MapCell, dir:number, alt:boolean, pos:Position) {} 
}
