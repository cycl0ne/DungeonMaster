import { ScreenIF } from "./ScreenIF.js";

export interface StackIF {
    pop():void;
    push(screen:ScreenIF):void;
    cur():ScreenIF;
  }