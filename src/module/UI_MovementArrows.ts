import { enum_Moves } from "../game/enum_Move.js";
import { GObject } from "./GObject.js";

export class UI_MovementArrows {
    ctx:CanvasRenderingContext2D;
    arrows: GObject;
    arrowsinv: GObject;
    w=27;
    h=21;
    ui_posX=233;
    ui_posY=123;
    // 27; 21 - 1 pixel border -> middle buttons
    // 29; 21 - 1 pixel ->left and right buttons
    private last:enum_Moves;

    constructor(ctx:CanvasRenderingContext2D)
    {
        this.ctx = ctx;
        this.arrows = new GObject("obj0013");
        this.arrowsinv = new GObject("obj0013i");
        this.last = enum_Moves.MOVE_MAX;
    }

    draw(){
        this.arrows.draw(this.ctx, this.ui_posX, this.ui_posY);
    }

    drawTurnLeft(){
        this.ctx.drawImage(this.arrowsinv.image, 1, 1, 28, this.h, (1+this.ui_posX)*4, 123*4, 28*4, this.h*4);
    }

    drawUp(){
        this.ctx.drawImage(this.arrowsinv.image, 30, 1, this.w, this.h, (30+this.ui_posX)*4, 123*4, this.w*4, this.h*4);
    }

    drawTurnRight(){
        this.ctx.drawImage(this.arrowsinv.image, 58, 1, 28, this.h, (58+this.ui_posX)*4, 123*4, 28*4, this.h*4);
    }

    drawLeft() {
        this.ctx.drawImage(this.arrowsinv.image, 1, 23, 28, this.h, (1+this.ui_posX)*4, (23+this.ui_posY)*4, 28*4, this.h*4);
    }

    drawBack() {
        this.ctx.drawImage(this.arrowsinv.image, 30, 23, this.w, this.h, (30+this.ui_posX)*4, (23+this.ui_posY)*4, 28*4, this.h*4);
    }

    drawRight() {
        this.ctx.drawImage(this.arrowsinv.image, 58, 23, 28, this.h, (58+this.ui_posX)*4, (23+this.ui_posY)*4, 28*4, this.h*4);
    }

    onRelease() {
        if (this.last == enum_Moves.MOVE_MAX) return;
        this.draw();
    }

    onclick(x:number, y:number):enum_Moves {
        // (30+this.ui_posX)*4, 123*4, this.w*4, this.h*4
        let xx = 1052;
        let yy = 492;
        this.last = enum_Moves.MOVE_MAX;

        if ((x > xx) && (x < xx+108) && (y>yy) && (y<492+84)){
            this.drawUp();
            this.last = enum_Moves.MOVE_UP;
        } else if (x >933 && x<1043 && y>491 && y<570) {
            this.drawTurnLeft();
            this.last = enum_Moves.MOVE_TURNLEFT;
        } else if (x >1159 && x<1266 && y>491 && y<570) {
            this.drawTurnRight();
            this.last = enum_Moves.MOVE_TURNRIGHT;
        } else if (x >933 && x<1043 && y>576 && y<655) {
            this.drawLeft();
            this.last = enum_Moves.MOVE_LEFT;
        } else if (x >1050 && x<1153 && y>576 && y<655) {
            this.drawBack();
            this.last = enum_Moves.MOVE_BACK;
        } else if (x >1159 && x<1266 && y>576 && y<655) {
            this.drawRight();
            this.last = enum_Moves.MOVE_RIGHT;
        }
        return this.last;
    }
}