import { enum_DObjects } from "../module/enum_DObjects.js";

export interface DObjectIF
{
    type:enum_DObjects;
    combotype:any; // will be changed to a class COMBO
    wearlocation:number; //Bitwise location
    explanation:string;
    name:string;
    mass:number;
    inv_type:DObject;
    inv_place:number;
}

export class DObject
{
    icon:any;
    floor_image:any;
    properties:DObjectIF;

    constructor(prop:DObjectIF) 
    {
        this.properties = prop;
        
    }

    drawFloor():void{};
    drawInventory():void{};

    consume():void{};
    combo():void{};
    view():void{};
}