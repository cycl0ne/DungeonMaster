import { GEAction, GEMsg, GETypes, GameEventHandler } from "../../game/GameEventHandler.js";
import { Player } from "../../game/Player.js";
import { enum_FloorItem } from "../../gfx/enum_FloorItem.js";
import { enum_FloorOrnate } from "../../gfx/enum_FloorOrnate.js";
import { FloorCell } from "../Cell_Floor.js";
import { DMap } from "../DMap.js";
import { MapCell } from "../MapCell.js";
import { Point } from "../Point.js";

export enum enum_OpBy {
    Nothing,
    Anything,
    PartyOrMonster,
    PartyStepsOnPad,
    Monster,
    PartyPossessObject,
    PartyMoves,
    ParticularObject,
    PartyFacing,
    MAX,
}

export class PressurePad {
    _fo:enum_FloorOrnate = enum_FloorOrnate.SquarePressurePad;
    _cellSrc!:FloorCell;
    _cellTarget!:MapCell;
    _OpsBy:enum_OpBy;
    _Src:Point;
    _Dst:Point;
    _Lvl:DMap;
    _action:GEAction;

    constructor(lvl:DMap, src:Point, dst:Point, opby:enum_OpBy, act:GEAction) {
        this._Src   = src;
        this._Dst   = dst;
        this._OpsBy = opby;
        this._Lvl   = lvl;
        this._cellSrc = lvl.cell(this._Src) as FloorCell;
        this._cellSrc.subtype = enum_FloorItem.FLOORITEM_ORNATE;
        this._cellSrc.subsubtype =this._fo;
        this._action = act;
/*        this._cellSrc = cell;
        this._cellTarget = target;

        if (this._cellSrc.type == enum_MapCell.FLOOR){
            const floor:FloorCell = this._cellSrc as FloorCell;
        }
*/
    }

    exc(ply:Player) {
        const _cell:MapCell = this._Lvl.cell(this._Dst);
        const msg:GEMsg = {
            dis: 0,
            pos: 0,
            type: GETypes.NONE,
            action: this._action,
            cell: _cell
        };
        console.log("Send Event (PPad)");
        if (ply.maxChampion != 0) _cell.receiveMsg(msg);
        //GameEventHandler.getInstance().sendEvent(msg);
    }
}