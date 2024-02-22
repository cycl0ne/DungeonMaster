import { MapCell } from "../DMap/MapCell.js";
import { SpriteSystemUtil } from "../module/SpriteSystemUtil.js";
import { Distance } from "./enum_Distance.js";
import { Position } from "./enum_Position.js";
import { IInitData, IMgrClass } from "./mgr_Base.js";
import { Sprite } from "./sprite/Sprite.js";
import { SpriteManager } from "./sprite/SpriteManager.js";
import { SpriteSystem } from "./sprite/SpriteSystem.js";

export class WallObject implements IMgrClass {
    distance: Distance;
    position: Position;
    _spriteManager:SpriteManager | null;

    constructor(init:IInitData) {
        this.distance = init.distance;
        this.position = init.position;
        this._spriteManager = SpriteSystem.getInstance().getSpriteManagerName("FOV");
    }

    createSprite(img:HTMLCanvasElement|HTMLImageElement|null, x:number, y:number):Sprite {
        const sprite:Sprite = new Sprite(img, x, y, this._spriteManager);
        sprite.setVisible(false);
        sprite.setPriority(SpriteSystemUtil.SpritePrio(this.distance, this.position));
        return sprite;
    }

    disable() {}
    update(cell:MapCell, dir:number, alt:boolean, pos:Position) {} 
    render(ctx: CanvasRenderingContext2D, cell: MapCell, dir: number, alt: boolean, position: Position): void {}
}
