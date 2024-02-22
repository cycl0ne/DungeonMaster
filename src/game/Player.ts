import { Champion } from "../DMap/Champion.js";
import { Direction } from "./enum_Direction.js";
import { enum_Moves } from "./enum_Move.js";

/*
    Player Color:
    {
        {0, 222, 0},
        {255, 255, 0},
        {255, 0, 0},
        {0, 0, 255}
    }

    name_draw_colors = {
	{182, 182, 182},
	{182, 160, 96},
	{255, 182, 0},
	{255, 255, 0}
}

system_color = {0, 222, 222}
debug_color = {255, 160, 0}
scroll_color = {0, 0, 0}
*/

export class Player {
    public posX:number;
    public posY:number;
    public level:number;
    public dir:Direction;
    private delta_x:number;
    private delta_y:number;

    champion:(Champion|null)[]=[];
    maxChampion:number = 0;
    
    constructor(x:number,y:number,l:number,dir:number)
    {
        this.posX = x;
        this.posY = y;
        this.level= l;
        this.dir = dir;
        this.delta_x = this.delta_y = 0;
    }

    getPos() {
        return [this.posX, this.posY, this.level, this.dir];
    }

    warpPos(x:number,y:number,l:number,dir:number) {
        this.posX = x;
        this.posY = y;
        this.level= l;
        this.dir = dir;
    }

    private face2delta(face:Direction) {
//        console.log("Direction: "+face);
        this.delta_x =  (face)%2;
        this.delta_y = ((face+1)%2);
        if (face == Direction.North) this.delta_y*=-1;
        if (face == Direction.West)  this.delta_x*=-1;
        console.log("face2delta x/y"+this.delta_x+":"+this.delta_y);
       
    }

    dbg_move(move:enum_Moves) {
        let tx,ty:number;

        if (move <= enum_Moves.MOVE_LEFT)
        {
            let oface:Direction = (this.dir+move)%4;
//            console.log("oface"+oface);

            this.face2delta(oface);
            tx = this.posX + this.delta_x;
            ty = this.posY + this.delta_y;
            console.log("Player will move from:"+this.posX+":"+this.posY);
            console.log("to: "+tx+":"+ty);
            this.posX=tx;
            this.posY=ty;
        } else
        {
            if (move == enum_Moves.MOVE_TURNRIGHT)
            {
                let olddir:Direction = this.dir;
                this.dir = (this.dir +1) % 4;
                console.log("Turnright");
                console.log("Facing Old/New: "+olddir+":"+this.dir);
            } else if (move == enum_Moves.MOVE_TURNLEFT)
            {
                let olddir:Direction = this.dir;
                this.dir = (this.dir +3) % 4;
                console.log("Turnleft");
                console.log("Facing Old/New: "+olddir+":"+this.dir)
            }
        }
    }

    // not used, trying new.
    private calcMov()
    {
        let x:number=0;
        let y:number=0;

        switch(this.dir)
        {
            case Direction.North:
                x = 0;
                y = -1;
            break;
            case Direction.South:
                x = 0;
                y = 1;
            break;
            case Direction.East:
                x = 1;
                y = 0;
            break;
            case Direction.West:
                x = -1;
                y = 0;
            break;
        }
        return [x,y];
    }

    turnLeft() {
    }

    turnRight() {

    }

    moveForward(){
    }

    moveBackward(){
        
    }

    moveLeft(){
//        const [x, y] = this.calcMov();
        this.posX-=1;
        //this.posY-=y;
    }

    moveRight(){
//        const [x, y] = this.calcMov();
        this.posX+=1;
        //this.posY+=y;
    }

}