import { FLOORLOC, FloorCell } from "../DMap/Cell_Floor.js";
import { MirrorWOObject, WallCell } from "../DMap/Cell_Wall.js";
import { Champion } from "../DMap/Champion.js";
import { DMap } from "../DMap/DMap.js";
import { Point } from "../DMap/Point.js";
import { enum_MapCell } from "../DMap/enum_MapCell.js";
import { enum_WallOrnates } from "../DMap/enum_WallOrnates.js";
import { IItemClass, ITEMCLASS, ItemManager } from "../game/ItemManager.js";
import { Direction } from "../game/enum_Direction.js";
import { AssetManager } from "../module/AssetManager.js";
import { GraphicsUtility } from "../module/GraphicsUtility.js";
import { ItemGfxManager } from "../module/ItemGfxManager.js";

export interface ChampionData {
    name: string;
    title: string;
    gender: string;
    health: number;
    stamina: number;
    mana: number;
    str: number; 
    dex: number; 
    wis: number; 
    vit: number; 
    antm: number; 
    antif: number; 
    luck: number;
    fig: number; 
    nin: number; 
    pri: number; 
    wiz: number; 
    portrait: number;
}

const champs:ChampionData [] = [
    { name: "ALEX",     title: "ANDER", gender: "M", health: 500, stamina: 570, mana: 130, str: 440, dex: 550, wis: 450, vit: 400, antm: 350, antif: 400, luck: 500, fig: 0, nin: 4, pri: 0, wiz: 3, portrait: 11},
    { name: "AZIZI",    title: "JOHARI", gender: "F", health: 610, stamina: 770, mana: 70, str: 470, dex: 480, wis: 420, vit: 450, antm: 300, antif: 350, luck: 500, fig: 2, nin: 3, pri: 0, wiz: 0, portrait: 13},
    { name: "BORIS",    title: "WIZARD OF BALDOR", gender: "M", health: 350, stamina: 650, mana: 280, str: 350, dex: 450, wis: 550, vit: 400, antm: 450, antif: 400, luck: 500, fig: 0, nin: 2, pri: 0, wiz: 3, portrait: 7},
    { name: "CHANI",    title: "SAYYADINA SIHAYA", gender: "F", health: 470, stamina: 670, mana: 170, str: 370, dex: 470, wis: 570, vit: 370, antm: 470, antif: 370, luck: 500, fig: 2, nin: 0, pri: 0, wiz: 3, portrait: 5},
    { name: "DAROOU",   title: "", gender: "M", health: 1000, stamina: 650, mana: 60, str: 500, dex: 300, wis: 350, vit: 450, antm: 300, antif: 450, luck: 500, fig: 3, nin: 0, pri: 0, wiz: 1, portrait: 23},
    { name: "ELIJA",    title: "LION OF YAITOPYA", gender: "M", health: 600, stamina: 580, mana: 220, str: 420, dex: 400, wis: 420, vit: 360, antm: 530, antif: 400, luck: 500, fig: 2, nin: 0, pri: 3, wiz: 0, portrait: 0},
    { name: "GANDO",    title: "THURFOOT", gender: "M", health: 390, stamina: 630, mana: 260, str: 390, dex: 450, wis: 470, vit: 330, antm: 480, antif: 430, luck: 500, fig: 0, nin: 3, pri: 0, wiz: 2, portrait: 15},
    { name: "GOTHMOG",  title: "", gender: "M", health: 600, stamina: 550, mana: 180, str: 400, dex: 350, wis: 480, vit: 340, antm: 500, antif: 590, luck: 500, fig: 0, nin: 0, pri: 0, wiz: 4, portrait: 21 },
    { name: "HALK",     title: "THE BARBARIAN", gender: "M", health: 900, stamina: 750, mana: 0, str: 550, dex: 430, wis: 300, vit: 460, antm: 380, antif: 480, luck: 500, fig: 4, nin: 0, pri: 0, wiz: 0, portrait: 1 },
    { name: "HAWK",     title: "THE FEARLESS", gender: "M", health: 700, stamina: 850, mana: 100, str: 450, dex: 350, wis: 380, vit: 550, antm: 350, antif: 350, luck: 500, fig: 2, nin: 0, pri: 3, wiz: 0, portrait: 6 },
    { name: "HISSSSA",  title: "LIZAR OF MAKAN", gender: "M", health: 800, stamina: 610, mana: 50, str: 580, dex: 480, wis: 350, vit: 350, antm: 430, antif: 550, luck: 500, fig: 3, nin: 2, pri: 0, wiz: 0, portrait: 3 },
    { name: "IAIDO",    title: "RUYITO CHIBURI", gender: "M", health: 480, stamina: 650, mana: 110, str: 430, dex: 550, wis: 400, vit: 350, antm: 450, antif: 500, luck: 500, fig: 3, nin: 0, pri: 2, wiz: 0, portrait: 14 },
    { name: "LEIF",     title: "THE VALIANT", gender: "M", health: 750, stamina: 700, mana: 70, str: 460, dex: 400, wis: 390, vit: 500, antm: 450, antif: 450, luck: 500, fig: 3, nin: 0, pri: 2, wiz: 0, portrait: 9 },
    { name: "LEYLA",    title: "SHADOWSEEK", gender: "F", health: 480, stamina: 600, mana: 30, str: 400, dex: 530, wis: 450, vit: 470, antm: 450, antif: 350, luck: 500, fig: 0, nin: 4, pri: 0, wiz: 0, portrait: 17 },
    { name: "LINFLAS",  title: "", gender: "M", health: 650, stamina: 500, mana: 120, str: 450, dex: 450, wis: 470, vit: 350, antm: 500, antif: 350, luck: 500, fig: 3, nin: 0, pri: 0, wiz: 2, portrait: 12 },
    { name: "MOPHUS",   title: "THE HEALER", gender: "M", health: 550, stamina: 550, mana: 190, str: 420, dex: 350, wis: 400, vit: 480, antm: 400, antif: 450, luck: 500, fig: 0, nin: 0, pri: 4, wiz: 0, portrait: 8 },
    { name: "NABI",     title: "THE PROPHET", gender: "M", health: 550, stamina: 650, mana: 150, str: 410, dex: 360, wis: 450, vit: 450, antm: 550, antif: 550, luck: 500, fig: 0, nin: 0, pri: 3, wiz: 2, portrait: 20 },
    { name: "SONJA",    title: "SHE DEVIL", gender: "F", health: 650, stamina: 700, mana: 20, str: 540, dex: 450, wis: 390, vit: 490, antm: 400, antif: 400, luck: 500, fig: 4, nin: 0, pri: 0, wiz: 0, portrait: 19 },
    { name: "STAMM",    title: "BLADECASTER", gender: "M", health: 750, stamina: 800, mana: 0, str: 520, dex: 430, wis: 350, vit: 500, antm: 350, antif: 550, luck: 500, fig: 4, nin: 0, pri: 0, wiz: 0, portrait: 16 },
    { name: "SYRA",     title: "CHILD OF NATURE", gender: "F", health: 530, stamina: 720, mana: 150, str: 380, dex: 350, wis: 430, vit: 450, antm: 420, antif: 400, luck: 500, fig: 0, nin: 0, pri: 2, wiz: 3, portrait: 2 },
    { name: "TIGGY",    title: "TAMAL", gender: "M", health: 250, stamina: 450, mana: 350, str: 300, dex: 450, wis: 500, vit: 350, antm: 590, antif: 400, luck: 500, fig: 0, nin: 2, pri: 0, wiz: 3, portrait: 18 },
    { name: "WU TSE",   title: "SON OF HEAVEN", gender: "F", health: 450, stamina: 470, mana: 200, str: 380, dex: 350, wis: 530, vit: 450, antm: 470, antif: 400, luck: 500, fig: 0, nin: 2, pri: 3, wiz: 0, portrait: 10 },
    { name: "WUUF",     title: "THE BIKA", gender: "M", health: 400, stamina: 500, mana: 300, str: 330, dex: 570, wis: 450, vit: 400, antm: 350, antif: 400, luck: 500, fig: 0, nin: 3, pri: 2, wiz: 0, portrait: 22 },
    { name: "ZED",      title: "DUKE OF BANVILLE", gender: "M", health: 600, stamina: 600, mana: 100, str: 400, dex: 400, wis: 400, vit: 500, antm: 400, antif: 400, luck: 500, fig: 2, nin: 2, pri: 2, wiz: 2, portrait: 4 },
];

export class Builder {
    static createChampionMirror(cell:WallCell, champion:number, dir:Direction) {
        const champ = champs[champion];
        cell.champion = new Champion(champ.name, champ.title, champ.gender, champ.health, champ.stamina, champ.mana, champ.str, champ.dex, champ.wis, champ.vit, champ.antm, champ.antif, champ.luck, champ.fig, champ.nin, champ.pri, champ.wiz, champ.portrait);
        cell.deco[dir]= enum_WallOrnates.ChampionMirror;
        cell.wornate[dir] = new MirrorWOObject(cell.champion);
    }

    static createTextXY(lvl:DMap, x:number, y:number, dir: Direction, ...texts: string[]) {
        const cell:WallCell = lvl.cell(new Point(x,y)) as WallCell;
        this.createText(cell, dir, ...texts);
    }

    static createText(cell: WallCell, dir: Direction, ...texts: string[]) {
        for (let i = 0; i < texts.length; i++) {
            cell.text[dir][i] = texts[i];
        }
    }

    static createFoodItemFloor(cell:FloorCell, dir:FLOORLOC, name:string) {
        const item = ItemManager.getInstance().getItem(name);
        console.log(ItemManager.getInstance().listItem());
        if (cell.type != enum_MapCell.FLOOR) console.log("ERROR: Not a FloorCell");
        if (item) {
            cell.addItemOnfloor(item, dir);
        } else{
            console.log("ERROR: Item "+name+" not found!");
        }
    }

    static createFoodItemDB(): Promise<void> {
        const igfx = ItemGfxManager.getInstance();
        const agfx = AssetManager.getInstance();
        // Fetch the CSV file
        return fetch('/data/items.csv')
            .then(response => response.text())
            .then(data => {
                // Split the CSV by line and then by comma to get a 2D array
                let rows = data.split('\n').slice(1); // slice(1) to skip the header row
                rows.forEach(row => 
                {
                    let columns = row.split(',');
                    let item: IItemClass = {
                        _name: columns[0],
                        _type: parseInt(columns[1]),
                        _class: parseInt(columns[2]),
                        _shortdesc: columns[3],
                        _mass: parseInt(columns[4]),
                        _icon: igfx.getImage(parseInt(columns[5])),
                        _dungeon: agfx.getImage(columns[6]) as HTMLImageElement // Assume gfx has property like d_steak
                    };
                    ItemManager.getInstance().createItem(item, parseInt(columns[7]), parseInt(columns[8]));
                    // Here you can call your addItemOnFloor method or other methods to use the item object.
                });
            })
            .catch(error => console.error('---Error fetching the CSV file:', error));
    }
}