export interface DrawObjectsIF {
    x_:number;
    y_:number;
    
    draw():void;
    visible():void;
    getX():number;
    getY():number;
    setPosition(x:number, y:number):void;
    isVisible():boolean;
    setVisible(bool:boolean):void;
    getPriority():number;
    setPriority(prio:number):void;

}