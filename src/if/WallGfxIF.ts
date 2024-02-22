export interface WallGfxIF {
    name:string;
    image:any;
    width:number;
    height:number;

    posX:number;
    posY:number;
    ctx: CanvasRenderingContext2D;
    visible:boolean;

    getX():number;
    getY():number;
    setPosition(x:number, y:number):void;
    setVisible(vis:boolean):void;
    isVisible():boolean;
    draw(alt:boolean):void;
    getName():string;
}