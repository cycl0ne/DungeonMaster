import { DMap } from "../DMap/DMap.js";
import { Dungeon } from "../DMap/Dungeon.js";
import { enum_WallOrnates } from "../DMap/enum_WallOrnates.js";
import { MapCell } from "../DMap/MapCell.js";
import { MapSymbol } from "../DMap/MapSymbol.js";
import { Point } from "../DMap/Point.js";
import { enum_FloorItem } from "../gfx/enum_FloorItem.js";
import { enum_FloorOrnate } from "../gfx/enum_FloorOrnate.js";
import { AssetManager } from "../module/AssetManager.js";
import { Direction } from "../game/enum_Direction.js";
import { RndBase } from "../module/Random.js";
import Level0Data from "../_level/level0.js";
import Level1Data from "../_level/level1.js";
import { enum_DObjects } from "../module/enum_DObjects.js";
import { DoorType } from "../gfx/enum_DoorType.js";
import { enum_MapCell } from "../DMap/enum_MapCell.js";
import { WallCell } from "../DMap/Cell_Wall.js";
import { FLOORLOC, FloorCell } from "../DMap/Cell_Floor.js";
import { StairCell } from "../DMap/Cell_Stair.js";
import { DoorCell } from "../DMap/Cell_Door.js";
import { PressurePad, enum_OpBy } from "../DMap/Actuators/PressurePad.js";
import { GEAction, GETypes } from "../game/GameEventHandler.js";
import { Builder } from "./BuildChampion.js";


const Level0_WallOrnates=[
    enum_WallOrnates.Hook, enum_WallOrnates.Slime, enum_WallOrnates.Grate, enum_WallOrnates.IronRing,
];

const Level0_FloorOrnates=[
    enum_FloorOrnate.Moss, enum_FloorOrnate.Puddle, enum_FloorOrnate.Crack, 
];

const Level1_WallOrnates=[
    enum_WallOrnates.Hook, enum_WallOrnates.Slime, enum_WallOrnates.Fountain,
];

const Level1_FloorOrnates=[
    enum_FloorOrnate.Moss, enum_FloorOrnate.Puddle, 
];

enum RoomType {
    NONE,
    TELEPORTER,
    STONE,
    OPEN,
    DOOR,
    STAIRS,
    PIT,
    FALSEWALL, 
    // ... add other room types as required
}

interface LvlData {
    lvl:number;
    x:number;
    y:number;
    flags:number;
    roomType:number;
}


export class BuildGame {
    private static instance: BuildGame | null = null;
    assetManager = AssetManager.getInstance();
    uid:number = 0;

    private constructor() {
    }

    static getInstance(): BuildGame {
        if (!BuildGame.instance) {
            BuildGame.instance = new BuildGame();
        }
        return BuildGame.instance;
    }

    async fetchAssetList(): Promise<string[]> {
        const response = await fetch('assets/assets.txt');
        const text = await response.text();
        return text.split('\n').filter(Boolean);  // This will split by newline and filter out any empty lines.
    }

    async getAssetsFromTextFile(): Promise<{ name: string; url: string }[]> {
        const lines = await this.fetchAssetList();
        return lines.map(line => {
            const name = "obj" + line.substr(0, line.indexOf("."));
            const url = "assets/" + line.trim();
            return { name, url };
        });
    }

    async loadAllImages(): Promise<void> {
        const imageAssets = await this.getAssetsFromTextFile();
        const loadPromises = imageAssets.map(asset => {
            console.log("loading: "+imageAssets.length+" Assets.");
            return this.assetManager.loadImage({
                name: asset.name,
                url: asset.url,
            });
        });
        await Promise.all(loadPromises);
        console.log("Done loading.");
    }

    BuildDungeon():Dungeon {
//GameDungeon
        const dung:Dungeon = this.FinalDungeon();
//testdungeon
//        const dung:Dungeon = this.TestDungeon();
        return dung;
    }

    createWall(floor:DMap, p:Point, flags:number) {
        floor.createCell(p, new WallCell(flags, p));
    }

    createFloor(floor:DMap, p:Point, flags:number) {
        floor.createCell(p, new FloorCell(flags, p));      
    }

    createDecoRnd():number {
        const rnd = RndBase.getInstance();
        const number = rnd.randomInRangeClosed(0,29);
        return number;
    }

    createWallDeco(cell:WallCell, deco:enum_WallOrnates[], facing:Direction) {
        const number = this.createDecoRnd();
        if (number > deco.length) return;
        //console.log(`Creating Wall Deco ${number} at ${cell}`);
        cell.deco[facing] = deco[number];
    }

    createFloorDeco(cell:MapCell, deco:enum_FloorOrnate[]) {
        const number = this.createDecoRnd();
        if (number > deco.length) return;
        //console.log(`Creating FloorDeco ${number} at ${cell}`);
        cell.subsubtype = deco[number];
        cell.subtype = enum_FloorItem.FLOORITEM_ORNATE;

    }

    createStairs(floor:DMap, p:Point, flags:number)
    {
        floor.createCell(p, new StairCell(flags, p));
    }

    createDoors(floor:DMap, p:Point, flags:number)
    {
        floor.createCell(p, new DoorCell(flags, p));
    }

    createLevel(lvlData:any, size:Point, offset:Point, floor:any, wall:any):DMap {
        const level:DMap = new DMap(size, offset);
        for (const entry of lvlData) {
            let p:Point = new Point(entry.x, entry.y);
            switch(entry.roomType) {
                case RoomType.STONE:
                    this.createWall(level, p, entry.flags);
                    const cell = level.cell(p) as WallCell;
                    if (cell.northDec) this.createWallDeco(cell, wall, Direction.North);
                    if (cell.southDec) this.createWallDeco(cell, wall, Direction.South);
                    if (cell.eastDec)  this.createWallDeco(cell, wall, Direction.East);
                    if (cell.westDec)  this.createWallDeco(cell, wall, Direction.West);
                break;
                case RoomType.STAIRS:
                    this.createStairs(level, p, entry.flags);
                    const cellStairs = level.cell(p) as StairCell;
                break;
                case RoomType.DOOR:
                    this.createDoors(level, p, entry.flags);
                    break;
                case RoomType.PIT:
                    this.createFloor(level, p, entry.flags);
                    const cellPt = level.cell(p) as FloorCell;
                    cellPt.type = enum_MapCell.PIT;
                break;
                case RoomType.OPEN:
                    this.createFloor(level, p, entry.flags);
                    const cellFl = level.cell(p) as FloorCell;
                    if (cellFl.floorDec) this.createFloorDeco(cellFl, floor);
                break;
                default:
                    console.log("entryroomtype not found using normal floor "+p.x+":"+p.y+":"+RoomType[entry.roomType]);
                    this.createFloor(level, p, entry.flags);
                    const cellFl2 = level.cell(p) as FloorCell;
                    if (cellFl2.floorDec) this.createFloorDeco(cellFl2, floor);
                break;
            }
        }
        return level;
    }

    createTestLevel( floor:any, wall:any):DMap {
        const dbg_map = [
            1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
            1, 0, 0, 6, 0, 0, 0, 0, 0, 0,
            1, 0, 0, 1, 0, 0, 0, 1, 1, 1,
            1, 0, 1, 1, 0, 0, 0, 0, 1, 1,
            1, 0, 1, 1, 0, 4, 0, 1, 1, 1,
            1, 0, 0, 1, 0, 0, 0, 0, 0, 1,
            1, 0, 0, 6, 0, 0, 0, 1, 0, 1,
            1, 0, 0, 1, 0, 0, 0, 1, 0, 1,
            1, 0, 0, 1, 0, 0, 0, 0, 0, 1,
            1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
            ];
        const x = Math.sqrt(dbg_map.length);
        let lvlp:Point = new Point(x,x);
        const offset:Point = new Point(0,0);
        const level:DMap = new DMap(lvlp, offset);

        for (let x=0; x<lvlp.x; x++) {
            for (let y=0; y<lvlp.y; y++) {
                let env = dbg_map[x+y*lvlp.x]
                let p = new Point(x,y);
                switch(env) {
                    case MapSymbol.Wall:
                        this.createWall(level, p, 0);
                        const cell = level.cell(p) as WallCell;
                        if (cell.northDec) this.createWallDeco(cell, wall, Direction.North);
                        if (cell.southDec) this.createWallDeco(cell, wall, Direction.South);
                        if (cell.eastDec)  this.createWallDeco(cell, wall, Direction.East);
                        if (cell.westDec)  this.createWallDeco(cell, wall, Direction.West);
                        break;
                    case MapSymbol.DoorWE:
                        //console.log("Door "+p.x+":"+p.y);
                        this.createDoors(level, p, 0x10);
                        break;    
                    case enum_MapCell.PIT:
                        console.log(p);
                        this.createFloor(level, p, 0);
                        const cellPt = level.cell(p) as FloorCell;
                        cellPt.type = enum_MapCell.PIT;
                        break;
                    default:
                    case MapSymbol.Floor:
                        this.createFloor(level, p, 0x8);
                        const cellFl = level.cell(p) as FloorCell;
                        if (cellFl.floorDec) this.createFloorDeco(cellFl, floor);    
                        break;
                }
            }
        }
        let wdeco:WallCell 
        wdeco = level.cells[9][4] as WallCell;
        wdeco.deco[Direction.North] = enum_WallOrnates.FullTorch;
        wdeco = level.cells[9][5] as WallCell;
        wdeco.deco[Direction.North] = enum_WallOrnates.ChampionMirror;
        wdeco = level.cells[9][6] as WallCell;
        Builder.createChampionMirror(wdeco, 7, Direction.North);
//        wdeco.deco[Direction.North] = enum_WallOrnates.ChampionMirror;
//        wdeco.champion = new Champion("ALEX", "ANDER", "M", 500, 570, 130, 440, 550, 450, 400, 350, 400, 500, 0, 4, 0, 3, 11);

        wdeco = level.cells[2][3] as WallCell;
        Builder.createText(wdeco, Direction.West, "OTHER SIDE WILL", "GRANT ACCESS");
        
        let cell:DoorCell;
        cell = level.cells[1][3] as DoorCell;
        if (cell.type!= enum_MapCell.DOOR) console.log("ERRRORRRRR!! "+enum_MapCell[cell.type]);
        cell.doorType = DoorType.WoodenDoor;
        cell.doorButton = false;
        const dst:Point = new Point(3,1);
        const src:Point = new Point(4,1);

        let dpad:PressurePad = new PressurePad(level, src, dst, enum_OpBy.Anything, GEAction.Activate);
        level.cell(src)._actuator.push(dpad);
        
        src.x = 2; src.y=1;
        dpad = new PressurePad(level, src, dst, enum_OpBy.Anything, GEAction.Deactivate);
        level.cell(src)._actuator.push(dpad);
 
        let fcell = level.cells[4][5];
        console.log(fcell);

        return level;
    }

    TestDungeon():Dungeon {
        const dungeon:Dungeon = new Dungeon();
        const size:Point = new Point(19,19);
        const offset:Point = new Point(0,0);
        const level0 = this.createTestLevel(Level0_FloorOrnates, Level0_WallOrnates);
        if (!dungeon.addLevel(level0, 0)) {
            console.log("error adding level");
        }
        return dungeon;
    }

// 2nd Stage Lvl Filler
    FinalDungeon2(lvl:DMap) {
        const p:Point = new Point(1,14);
        let cell:DoorCell = lvl.cell(p) as DoorCell;
        console.log("Deco:"+cell.doorDeco+":"+enum_MapCell[cell.type]);
        if (cell.type != enum_MapCell.DOOR) {
            console.log("No Door here?");

        }
        cell.doorType = DoorType.WoodenDoor;
        p.x = 5; p.y = 9; 
        cell = lvl.cell(p) as DoorCell;
        cell.doorButton = false;
        const dst:Point = new Point(5,9);
        const src:Point = new Point(6,9);

        const dpad:PressurePad = new PressurePad(lvl, src, dst, enum_OpBy.Anything, GEAction.Activate);
        lvl.cell(src)._actuator.push(dpad);
        let wdeco = lvl.cells[5][8] as WallCell;
        Builder.createText(wdeco, Direction.North, "HALL OF", "CHAMPIONS");

        wdeco = lvl.cells[3][10] as WallCell;
        Builder.createChampionMirror(wdeco, 11, Direction.South);
        wdeco = lvl.cells[6][10] as WallCell;
        Builder.createChampionMirror(wdeco, 23, Direction.North);
        wdeco = lvl.cells[7][8] as WallCell;
        Builder.createChampionMirror(wdeco, 5, Direction.East);
        wdeco = lvl.cells[10][9] as WallCell;
        Builder.createChampionMirror(wdeco, 19, Direction.North);
        wdeco = lvl.cells[2][14] as WallCell;
        Builder.createChampionMirror(wdeco, 3, Direction.South);
        wdeco = lvl.cells[4][16] as WallCell;
        Builder.createChampionMirror(wdeco, 9, Direction.West);
        wdeco = lvl.cells[7][14] as WallCell;
        Builder.createChampionMirror(wdeco, 2, Direction.North);
        wdeco = lvl.cells[7][16] as WallCell;
        Builder.createChampionMirror(wdeco, 0, Direction.South);
        wdeco = lvl.cells[10][17] as WallCell;
        Builder.createChampionMirror(wdeco, 16, Direction.North);
        wdeco = lvl.cells[15][16] as WallCell;
        Builder.createChampionMirror(wdeco, 10, Direction.North);
        wdeco = lvl.cells[16][16] as WallCell;
        Builder.createChampionMirror(wdeco, 7, Direction.South);
        wdeco = lvl.cells[8][12] as WallCell;
        Builder.createChampionMirror(wdeco, 15, Direction.South);
        wdeco = lvl.cells[11][11] as WallCell;
        Builder.createChampionMirror(wdeco, 6, Direction.North);
        wdeco = lvl.cells[12][15] as WallCell;
        Builder.createChampionMirror(wdeco, 17, Direction.West);
        wdeco = lvl.cells[14][14] as WallCell;
        Builder.createChampionMirror(wdeco, 15, Direction.West);
        wdeco = lvl.cells[11][13] as WallCell;
        Builder.createChampionMirror(wdeco, 22, Direction.South);
        wdeco = lvl.cells[13][11] as WallCell;
        Builder.createChampionMirror(wdeco, 13, Direction.East);
        wdeco = lvl.cells[16][11] as WallCell;
        Builder.createChampionMirror(wdeco, 18, Direction.North);
        wdeco = lvl.cells[13][10] as WallCell;
        Builder.createChampionMirror(wdeco, 20, Direction.West);
        wdeco = lvl.cells[14][7] as WallCell;
        Builder.createChampionMirror(wdeco, 21, Direction.North);
        wdeco = lvl.cells[14][8] as WallCell;
        Builder.createChampionMirror(wdeco, 12, Direction.South);
        wdeco = lvl.cells[17][7] as WallCell;
        Builder.createChampionMirror(wdeco, 1, Direction.North);
        wdeco = lvl.cells[13][5] as WallCell;
        Builder.createChampionMirror(wdeco, 4, Direction.East);
        wdeco = lvl.cells[8][7] as WallCell;
        Builder.createChampionMirror(wdeco, 8, Direction.South);
        Builder.createFoodItemDB().then(()=>
                {let fcell:FloorCell = lvl.cells[5][0] as FloorCell;
                Builder.createFoodItemFloor(fcell, FLOORLOC.NE, "APPLE");})
                .catch(error => console.error("Error:", error));
    }

    FinalDungeon():Dungeon {
        const dungeon:Dungeon = new Dungeon();
        let size:Point = new Point(19,19);
        let offset:Point = new Point(0,0);
        const level0:DMap = this.createLevel(Level0Data, size, offset, Level0_FloorOrnates, Level0_WallOrnates);
        this.FinalDungeon2(level0);
        if (!dungeon.addLevel(level0, 0)) {
            console.log("error adding level");
        }
        size = new Point(32,32);
        offset = new Point(0,14);
        const level1:DMap = this.createLevel(Level1Data, size, offset, Level1_FloorOrnates, Level1_WallOrnates);
        if (!dungeon.addLevel(level1, 1)) {
            console.log("error adding level");
        }

       return dungeon;
    }
}