import { StackIF } from "./ScreenStackIF.js";

export interface ScreenIF {
    draw(ctx:CanvasRenderingContext2D) :void;
    elapsed(elapsed:number):void;
    onMouseDown(event:MouseEvent, stack:StackIF):void;
    onMouseUp(event:MouseEvent, stack:StackIF):void;
    onKeyDown(event:KeyboardEvent, stack:StackIF):void;
    onKeyUp(event:KeyboardEvent, stack:StackIF):void;
}