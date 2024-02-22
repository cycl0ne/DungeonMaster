import { DMap } from "./DMap.js";

export class Dungeon {
    actualLevel:number = 0;
    level:DMap[] = [];
    constructor(){}

    addLevel(dmap:DMap, lvl:number) : boolean{
        if (lvl> this.level.length) return false;
        this.level[lvl] = dmap;
        return true;
    }

    getLevel(lvl:number):DMap {
        if (lvl> this.level.length) return this.level[this.actualLevel];
        this.actualLevel = lvl;
        return this.level[lvl];
    }
}