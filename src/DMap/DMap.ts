import { enum_FloorItem } from "../gfx/enum_FloorItem.js";
import { enum_FloorOrnate } from "../gfx/enum_FloorOrnate.js";
import { Direction } from "../game/enum_Direction.js";
import { enum_MapCell } from "./enum_MapCell.js";
import { enum_WallOrnates } from "./enum_WallOrnates.js";
import { MapCell } from "./MapCell.js";
import { MapSymbol } from "./MapSymbol.js";
import { Mob } from "./Mob.js";
import { Point } from "./Point.js";
import { SUBFLOOR } from "./sub_Floor.js";
import { SUBSTAIRS } from "./sub_Stairs.js";
import { WallCell } from "./Cell_Wall.js";

export class DMap {
    size:Point;
    offset:Point;
    cells:MapCell[][]=[];
    badcell:WallCell;
    lightningMax:number;
    lightningAct:number;

    constructor(size:Point, offset:Point) {
        this.size = size;
        this.offset = offset;
        this.cells = this.allocMap(enum_MapCell.WALL);
        this.badcell = new WallCell(enum_MapCell.BAD, new Point(-1,-1));
        this.lightningMax=100;
        this.lightningAct=100;
    }

    allocMap(filler:enum_MapCell) {
        let cells = new Array(this.size.y);
        let p:Point = new Point();
        for (p.y=0; p.y < this.size.y; ++p.y) {
            cells[p.y] = new Array(this.size.x);
            for (p.x=0; p.x < this.size.x; ++p.x) {
//              cells[p.y][p.x] = new MapCell(filler); 
            }
        }
        return cells;
    }

    createCell(p:Point, cell:MapCell) {
        if (!this.valid(p))
        {
            console.log(`Error: p not valid in CreateCell(): ${p.x}:${p.y}`);
            return;
        }
        this.cells[p.y][p.x] = cell;
    }

    dbg_printMap() {
        let index = 0;
        let text ="";
        console.log("Printing Map of Dungeon-----------------");

        for (let y = 0; y < this.size.y; y++) {
            for (let x = 0; x < this.size.x; x++) {
                text += this.cells[y][x].type + " ";
            }
            console.log(text);
            text ="";
        }
    }

    dbg_allocMap() {
        let dbg_map = [
            1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
            1, 0, 0, 0, 0, 0, 0, 0, 0, 7,
            1, 0, 0, 1, 0, 0, 0, 1, 1, 1,
            1, 0, 1, 1, 0, 0, 0, 7, 1, 1,
            1, 0, 1, 1, 0, 0, 0, 1, 1, 1,
            1, 0, 0, 1, 0, 0, 0, 0, 0, 1,
            1, 0, 0, 6, 0, 0, 0, 1, 0, 1,
            1, 0, 0, 1, 0, 0, 0, 1, 0, 1,
            1, 0, 0, 1, 0, 0, 0, 0, 0, 1,
            1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
            ];
        const x = Math.sqrt(dbg_map.length);
        let p:Point = new Point(x-1,x-1);
        console.log(`---${p.x} ${p.y}`);
        if (this.valid(p)) {
            p.x +=1;
            p.y +=1;
            for (let x=0; x<p.x; x++) {
                for (let y=0; y<p.y; y++) {
                    let env = dbg_map[x+y*p.x];
                    if (env == 0) env = enum_MapCell.FLOOR;
                    this.cells[y][x].type = env;
                    if (env == MapSymbol.Stairs && x==9) {
                        this.cells[y][x].type = enum_MapCell.STAIRS;
                        this.cells[y][x].facing = Direction.West;
                        this.cells[y][x].subtype = SUBSTAIRS.DOWN; // 1= down, 0=up;
                    } else if (env == MapSymbol.Stairs && x!=9) {
                        this.cells[y][x].type = enum_MapCell.STAIRS;
                        this.cells[y][x].facing = Direction.West;
                        this.cells[y][x].subtype = SUBSTAIRS.UP; // 1= down, 0=up;
                    }
                    if (env == MapSymbol.DoorNS) {
                        this.cells[y][x].type = enum_MapCell.DOOR;
                        this.cells[y][x].subtype = SUBFLOOR.Door;
                        this.cells[y][x].facing = Direction.North;
                    }
                    if (env == MapSymbol.DoorWE) 
                    {
                        this.cells[y][x].type = enum_MapCell.DOOR;
                        this.cells[y][x].subtype = SUBFLOOR.Door;
                        this.cells[y][x].facing = Direction.East;
                    }
                }
            }
            this.cells[5][5].subtype = enum_FloorItem.FLOORITEM_ORNATE;
            this.cells[5][5].subsubtype = enum_FloorOrnate.RoundGrate;
            this.cells[6][4].subtype = enum_FloorItem.FLOORITEM_ORNATE;
            this.cells[6][4].subsubtype = enum_FloorOrnate.SquarePressurePad;
            this.cells[6][5].subtype = enum_FloorItem.FLOORITEM_ORNATE;
            this.cells[6][5].subsubtype = enum_FloorOrnate.SquarePressurePad;
            this.cells[6][6].subtype = enum_FloorItem.FLOORITEM_ORNATE;
            this.cells[6][6].subsubtype = enum_FloorOrnate.SquarePressurePad;
            this.cells[7][4].subtype = enum_FloorItem.FLOORITEM_ORNATE;
            this.cells[7][4].subsubtype = enum_FloorOrnate.Moss;
            this.cells[7][5].subtype = enum_FloorItem.FLOORITEM_ORNATE;
            this.cells[7][5].subsubtype = enum_FloorOrnate.Crack;
            this.cells[7][6].subtype = enum_FloorItem.FLOORITEM_ORNATE;
            this.cells[7][6].subsubtype = enum_FloorOrnate.Puddle;

            this.cells[9][4].subtype = enum_WallOrnates.Hook;
            this.cells[9][4].facing  = Direction.North;
            this.cells[9][5].subtype = enum_WallOrnates.Grate;
            this.cells[9][5].facing  = Direction.North;
            this.cells[9][6].subtype = enum_WallOrnates.RaLock;
            this.cells[9][6].facing  = Direction.North;

            this.cells[1][0].subtype = enum_WallOrnates.SlimeOutlet;
            this.cells[1][0].facing  = Direction.East;
            this.cells[2][0].subtype = enum_WallOrnates.SkeletonLock;
            this.cells[2][0].facing  = Direction.East;
            this.cells[3][0].subtype = enum_WallOrnates.Manacles;
            this.cells[3][0].facing  = Direction.East;
            this.cells[4][0].subtype = enum_WallOrnates.Fountain;
            this.cells[4][0].facing  = Direction.East;

            this.cells[0][4].subtype = enum_WallOrnates.Alcove;
            this.cells[0][4].facing  = Direction.South;
            this.cells[0][5].subtype = enum_WallOrnates.ArchedAlcove;
            this.cells[0][5].facing  = Direction.South;
            this.cells[0][6].subtype = enum_WallOrnates.ViAltar;
            this.cells[0][6].facing  = Direction.South;

        } else
            console.log("ERR: dbg_allocMap: Map too small");
    }

    cell(p:Point):MapCell {
        if (!this.valid(p)) return this.badcell;
        //this.chkError(p); 
        return this.cells[p.y][p.x]; 
    }

    chkError(p:Point) {
        if (this.valid(p)) return;
        console.log('x:',p.x, 'y:', p.y, 'sizex:', this.size.x,'sizey:', this.size.y);
        throw new Error(`${p.x},${p.y} illegal`);
    }

    valid(p:Point):boolean {
        return p.x >= 0 && p.x < this.size.x
        && p.y >= 0 && p.y < this.size.y; 
    }

    blocked(p:Point):boolean {
        if (!this.valid(p)) return true; 
        return this.cell(p).blocked();
    }

    wall(p:Point):boolean {
        if (!this.valid(p)) return true; 
        return this.cell(p).type==enum_MapCell.WALL;
    }

    floor(p:Point):boolean {
        if (!this.valid(p)) return false; 
        return this.cell(p).type==enum_MapCell.FLOOR;
    }

    moveMob(m:Mob, p:Point):void {
        this.cell(m.pos).mob = undefined;
        m.pos.x = p.x; m.pos.y = p.y;
        this.cell(m.pos).mob = m;
    }
}