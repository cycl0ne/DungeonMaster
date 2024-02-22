import { MgrBase } from "./mgr_Base.js";
import { SpriteManager } from "./sprite/SpriteManager.js";
import { WallObject } from "./Wall_Object.js";
import { initWallOrnate, wallObjectCoordinates, wallObjects, WallOrnate } from "./Wall_Ornate.js";
import { initWallText, WallText } from "./Wall_Text.js";
import { initWalls, Wall } from "./Wall_Wall.js";

export class WallManager extends MgrBase<WallObject> {
    constructor(sm:SpriteManager) {
        super(sm);
        this.initClass(initWalls, (data) => new Wall(data));
        this.initClass(initWallOrnate, wallObjectCoordinates, wallObjects, (data, coords, names)=> new WallOrnate(data, coords, names));
        this.initClass(initWallText, (data) => new WallText(data));
    }
}