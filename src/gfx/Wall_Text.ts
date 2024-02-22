import { WallCell } from "../DMap/Cell_Wall.js";
import { GraphicsUtility } from "../module/GraphicsUtility.js";
import { SpriteSystemUtil } from "../module/SpriteSystemUtil.js";
import { WallObject } from "./Wall_Object.js";
import { Distance } from "./enum_Distance.js";
import { Position } from "./enum_Position.js";
import { Fonts } from "./fonts/Fonts.js";
import { IInitData } from "./mgr_Base.js";
import { Sprite } from "./sprite/Sprite.js";

export const initWallText = [
//    { distance: Distance.D3, position: Position.Left },
    { distance: Distance.D3, position: Position.Center },
//    { distance: Distance.D3, position: Position.Right },
//    { distance: Distance.D2, position: Position.Left },
    { distance: Distance.D2, position: Position.Center },
//    { distance: Distance.D2, position: Position.Right },
//    { distance: Distance.D1, position: Position.Left },
    { distance: Distance.D1, position: Position.Center },
//    { distance: Distance.D1, position: Position.Right },
];

const TextCoords = [
    {x: 112, y:48},
    {x: 112, y:59},
    {x: 112, y:73},
    {x: 112, y:85}
];
// TODO: Optimize it to use only one sprite with a canvas taking all 4 texts.
export class WallText extends WallObject {
    _wallFont:Fonts;
    _text:string[] = [];
    _textSprite:Sprite []= [];
    _canvas:HTMLCanvasElement [] = [];
    _renderCanvas:HTMLCanvasElement [] = [];
//    _ctx:CanvasRenderingContext2D|null []=[];

    constructor(init: IInitData) {
        super(init);
        this._wallFont = new Fonts("obj0258", "ABCDEFGHIJKLMNOPQRSTUVWXYZ ", 8, 8, 0);
        for (let i=0; i<4; i++) {
            this._textSprite[i] = new Sprite();
            this._textSprite[i].setX(TextCoords[i].x);
            this._textSprite[i].setY(TextCoords[i].y);
            this._textSprite[i].setOriginY(8);
            this._textSprite[i].setPriority(SpriteSystemUtil.SpritePrio(this.distance, this.position));
            this._canvas[i] = document.createElement('canvas');
            this._canvas[i].width = 120;
            this._canvas[i].height = 8;
        }
    }

    private renderText(text:string, index:number) {
        const ctx = this._canvas[index].getContext('2d');
        if (!ctx) {console.log("Wall_Text:Update failed, no CTX");return;}
        const width = this._wallFont.measureTextWidth(text);
        this._canvas[index].width = width;
        this._wallFont.renderText(ctx, 0, 0, text);
        this._renderCanvas[index] = GraphicsUtility.rescaleImageDistance(this._canvas[index], this.distance);
        this._renderCanvas[index] = GraphicsUtility.darkenImageDistance(this._renderCanvas[index], this.distance);
        if (this._textSprite[index]) {
            this._textSprite[index].setOriginX(this._renderCanvas[index].width/2);
            this._textSprite[index].setImage(this._renderCanvas[index]);
            this._textSprite[index].setVisible(true);
        }
    }

    update(cell:WallCell, dir:number, alt:boolean, position:Position) {
        for (let i=0; i<2; i++) {
            let text:string = cell.text[(dir-2+4)%4][i];
            if (text) {
                if (text === this._text[i]) 
                {
                    this._textSprite[i].setVisible(true);
                } else
                {
                    this._text[i] = text;
                    this.renderText(text, i);
                }
            } 
        }
    }
/*
    private renderText(ctx:CanvasRenderingContext2D, x:number, y:number) {
        let [rx,ry] = GraphicsUtility.BottomCenter(this._renderCanvas, x, y)
        ctx.drawImage(this._renderCanvas, rx, ry+32); // FIX CONST VALUE 32!!
    }

    render(ctx: CanvasRenderingContext2D, cell: WallCell, dir: number, alt: boolean, position: Position) {
//        const text:string = cell.text[(dir-2+4)%4];
//        if (text) {
//            this.renderText(ctx, 112,48);
//            this.renderText(ctx, 112,59);
//            this.renderText(ctx, 112,73);
//            this.renderText(ctx, 112,85);
//        }
    }
*/
}