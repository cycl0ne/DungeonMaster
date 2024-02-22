import { DMap } from "../DMap/DMap.js";
import { Dungeon } from "../DMap/Dungeon.js";
import { enum_MapCell } from "../DMap/enum_MapCell.js";
import { MapSymbol } from "../DMap/MapSymbol.js";
import { Point } from "../DMap/Point.js";
import { Direction } from "../game/enum_Direction.js";
import { GObject } from "../module/GObject.js";

export class tiles {
    ctx:CanvasRenderingContext2D;
    gfx:GObject;
    gfxArrow:GObject;
    w:number=0;
    h:number=0;
    dungeon:Dungeon;
    level:number;
    dgf:DMap;

    constructor(ctx:CanvasRenderingContext2D, dung:Dungeon) {
        this.ctx = ctx;
        this.dungeon = dung;
        this.level=-1;
        this.dgf = dung.getLevel(0);
        this.gfx = new GObject("tiles1");
        this.gfxArrow = new GObject("arrow");
        this.getNewFloor(0);
//        this.w = Math.floor((256 / this.dgf.size.x)-1);
//        this.h = Math.floor((256 / this.dgf.size.y)-1);
//        console.log(`${this.dgf.size.x} w ${this.w} h ${this.h}`);
    }

    getNewFloor(lvl:number) {
        if (this.level == lvl) return;
        this.dgf = this.dungeon.getLevel(lvl);
        this.w = Math.floor((320 / this.dgf.size.x)-1);
        this.h = Math.floor((320 / this.dgf.size.y)-1);
        this.level = lvl;
        this.clear();
    }

    clear() {
        this.ctx.fillStyle= "rgb(77, 121 , 188)";
        this.ctx.fillRect(900, 160, 320, 320);
    }

    draw(xx:number, yy:number, dir:Direction, lvl:number) {
        this.getNewFloor(lvl);
        let tilex= 32*34;
        let tiley= 32*20;
        this.ctx.fillStyle = "white";
        this.ctx.fillRect(900, 160, this.w*this.dgf.size.x, this.h*this.dgf.size.y);
        let p = new Point();

        for (let x=0; x<this.dgf.size.x; x++) {
            for (let y=0; y<this.dgf.size.y; y++)
            {
                p.x = x; p.y = y;
                const imgx = x * this.w;
                const imgy = y * this.h;
                const plyX = xx * this.w;
                const plyY = yy * this.h;

                if (this.dgf.wall(p)) {
                    this.ctx.drawImage(this.gfx.image, 32*34,32*20,31,31,900+(imgx),160+(imgy),this.w,this.h);
                }
                if (this.dgf.cell(p).type == enum_MapCell.DOOR)
                {
                    this.ctx.drawImage(this.gfx.image, 32*4,32*21,31,31,900+(imgx),160+(imgy),this.w,this.h);
                }
                if (this.dgf.cell(p).type == enum_MapCell.STAIRS)
                {
                    this.ctx.drawImage(this.gfx.image, 32*11,32*21,31,31,900+(imgx),160+(imgy),this.w,this.h);
                }
                switch(dir) {
                    case Direction.North:
                        this.ctx.drawImage(this.gfxArrow.image, 0,0,32,32, 900+plyX, 160+(plyY),this.w,this.h);
                        break;
                    case Direction.East:
                        this.ctx.drawImage(this.gfxArrow.image, 0,32,32,32, 900+plyX, 160+(plyY),this.w,this.h);
                        break;
                    case Direction.South:
                        this.ctx.drawImage(this.gfxArrow.image, 32,32,32,32, 900+plyX, 160+(plyY),this.w,this.h);
                        break;
                    case Direction.West:
                        this.ctx.drawImage(this.gfxArrow.image, 32,0,32,32, 900+plyX, 160+(plyY),this.w,this.h);
                        break;

                }
            }
        }
    }
    
}