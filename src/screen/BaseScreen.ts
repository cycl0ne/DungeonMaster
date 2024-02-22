import { ScreenIF } from "./ScreenIF.js";
import { StackIF } from "./ScreenStackIF.js";

export class BaseScreen implements ScreenIF {
    name:string = "BaseScreen";

    constructor() {}

    draw(ctx:CanvasRenderingContext2D){}
    elapsed(elapsed:number):void {}
    onMouseDown(event:MouseEvent, stack:StackIF) {}
    onMouseUp(event:MouseEvent, stack:StackIF) {}
    onKeyDown(event:KeyboardEvent, stack:StackIF) {}
    onKeyUp(event:KeyboardEvent, stack:StackIF) {}
}