import { DObject, DObjectIF } from "../if/DObject.js";
import { enum_DObjects } from "../module/enum_DObjects.js";

export class Weapon extends DObject {
    inventory_image:any;
    floor_image:any;

    base_range:number;
    base_tpower:number;
    impact:number;

    constructor(prop:DObjectIF, brange:number, btpower:number, imp:number) {
        super(prop);
        this.base_range=brange;
        this.base_tpower=btpower;
        this.impact=imp;
    }

    getType() {return super.properties.type;}

    consume():void{};
    combo():void {};
    view():void {};  
}