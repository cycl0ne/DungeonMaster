import { StackIF } from "./ScreenStackIF.js";

export interface RawScreenIF {
    draw(ctx:CanvasRenderingContext2D) :void;
    elapsed(elapsed:number):void;
    onMouseDown(event:MouseEvent):void;
    onMouseUp(event:MouseEvent):void;
    onKeyDown(event:KeyboardEvent):void;
    onKeyUp(event:KeyboardEvent):void;
}