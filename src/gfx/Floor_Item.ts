import { FloorCell } from "../DMap/Cell_Floor.js";
import { FloorObject } from "./Floor_Object.js";
import { Distance } from "./enum_Distance.js";
import { Position } from "./enum_Position.js";
import { IInitData } from "./mgr_Base.js";

class ItemCoord {
    constructor(
        public x:number,
        public y:number,
    ) {}
}

class TileCoord {
    item:ItemCoord[] = [];
    constructor(){}
}

export const INIT_FLOORITEM = [
    { distance: Distance.D3, position: Position.Left },
    { distance: Distance.D3, position: Position.Center },
    { distance: Distance.D3, position: Position.Right },
    { distance: Distance.D2, position: Position.Left },
    { distance: Distance.D2, position: Position.Center },
    { distance: Distance.D2, position: Position.Right },
    { distance: Distance.D1, position: Position.Left },
    { distance: Distance.D1, position: Position.Center },
    { distance: Distance.D1, position: Position.Right },
    { distance: Distance.D0, position: Position.Center },
];
/*
c1 D2
c2 D2
c3 D2
c4 D2
l1 D2
l2 D2
l3 D2
l4 D2
r1 D2
r2 D2
r3 D2
r4 D2

c1 D1
c2 D1
c3 D1
c4 D1
l1 D1
l2 D1
l3 D1
l4 D1
r1 D1
r2 D1
r3 D1
r4 D1

*/

/*
d3c - 2 Items SE SW
d2c - 4 Items NW, SW, SE, NE
d2r - 3 Items looking north: NW, SW, NE
d2l - 3 Items looking north: NE, SE, NW
d1r - 2 Items N: NW SW
d1l - 2 Items N: 
*/
export class FloorItem extends FloorObject {
    constructor(init:IInitData) {
        super(init);
    }

    update(cell:FloorCell, dir:number, alt:boolean) {
        const distance = Distance.D0;
//        console.log(data);
//        console.log("LOGGER :)"+ data[distance].C[0].x);
//       if (cell.floorItem) console.log("Found Item on floor: "+cell.floorItems[0].item._name+" Dist:"+Distance[this.distance]+" Pos:"+Position[this.position]);
    }
}