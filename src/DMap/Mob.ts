import { MapSymbol } from "./MapSymbol.js";
import { Point } from "./Point.js";

export class Mob {
    constructor(g:MapSymbol, x:number, y:number) {
      this.isPly = (g == MapSymbol.Ply);
      this.g = g;
      this.name = MapSymbol[g]; 
      this.pos.x = x; this.pos.y = y;  
    }   
    pos:Point = new Point();
    g:MapSymbol = MapSymbol.Unknown;
    name:string = '?';
    isPly:boolean = false;
}  