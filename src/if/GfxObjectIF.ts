export interface GfxObjectIF {
    name:string;
    image:any;
    width:number;
    height:number;
    scale:number;
    posX:number;
    posY:number;
    ctx: CanvasRenderingContext2D;
    visible:boolean;

    getX():number;
    getY():number;
    setPosition(x:number, y:number):void;
    setVisible(vis:boolean):void;
    isVisible():boolean;
    draw():void;
    getName():string;
}