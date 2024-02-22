import { Distance } from "./enum_Distance.js";
import { Position } from "./enum_Position.js";
import { FloorOrnate, FLOOR_ORNATE_COORDS, FLOOR_ORNATE_OBJECT } from "./Floor_Ornate.js";
import { MgrBase } from "./mgr_Base.js";
import { FloorObject } from "./Floor_Object.js";
import { FLOOR_PIT_COORDS, FLOOR_PIT_OBJECT, FloorPit, initPit } from "./Floor_Pit.js";
import { SpriteManager } from "./sprite/SpriteManager.js";
import { FloorItem, INIT_FLOORITEM } from "./Floor_Item.js";
// Transp. Color: RGB 204,136,102;

const INIT_FLOOR = [
    { distance: Distance.D3, position: Position.Left },
    { distance: Distance.D3, position: Position.Center },
    { distance: Distance.D3, position: Position.Right },
    { distance: Distance.D2, position: Position.Left },
    { distance: Distance.D2, position: Position.Center },
    { distance: Distance.D2, position: Position.Right },
    { distance: Distance.D1, position: Position.Left },
    { distance: Distance.D1, position: Position.Center },
    { distance: Distance.D1, position: Position.Right },
];

export class FloorManager extends MgrBase<FloorObject> {
    constructor(sm:SpriteManager) {
        super(sm);
        this.initClass(INIT_FLOOR, FLOOR_ORNATE_COORDS, FLOOR_ORNATE_OBJECT, (data, coordsArray, namesArray) => new FloorOrnate(data, coordsArray, namesArray));
        this.initClass(initPit, FLOOR_PIT_COORDS, FLOOR_PIT_OBJECT, (data, coordsArray, namesArray) => new FloorPit(data, coordsArray, namesArray));
        this.initClass(INIT_FLOORITEM, (data)=> new FloorItem(data));
    }
}