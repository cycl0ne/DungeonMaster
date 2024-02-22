import { Distance } from "./enum_Distance.js";
import { Position } from "./enum_Position.js";
import { DoorObject } from "./Door_Object.js";
import { IInitData } from "./mgr_Base.js";
import { Sprite } from "./sprite/Sprite.js";
import { GraphicsUtility } from "../module/GraphicsUtility.js";
import { MapCell } from "../DMap/MapCell.js";
import { DoorCell } from "../DMap/Cell_Door.js";

export const INIT_DOOR = [
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

interface IFDoor {
    nameD3:string;
    nameD2:string;
    nameD1:string;
};

export const initDoor:IFDoor [] = [
    { nameD3: "obj0246", nameD2: "obj0247", nameD1: "obj0248" },
    { nameD3: "obj0249", nameD2: "obj0250", nameD1: "obj0251" },
    { nameD3: "obj0252", nameD2: "obj0253", nameD1: "obj0254" },
    { nameD3: "obj0255", nameD2: "obj0256", nameD1: "obj0257" },
];

const initDoorCoord = [
    [
        { x:   0, y: 17, w:96, h:88 },
        { x: 64,  y: 17, w:96, h:88 },
        { x: 128, y: 17, w:96, h:88 },
    ],
    [
        { x: 0,  y: 23, w:64, h:61 },
        { x: 80, y: 23, w:64, h:61 },
        { x: 160,y: 23, w:64, h:61 },
    ],
    [
        { x:  30, y: 30, w:44, h:38 },
        { x:  90, y: 30, w:44, h:38 },
        { x: 150, y: 30, w:44, h:38 },
    ]
];

export class Door extends DoorObject {
    door:Sprite[][] = [];
    doorClosed:Sprite[] = []

    createDoor(i:number, name:string, x:number, y:number) {
        let imgOrg = this._assetManager.getImage(name);
        if (!imgOrg) return;
        let img = GraphicsUtility.cutImage(imgOrg, 0, imgOrg.height-1, imgOrg.width, 1);
        this.door[i][0] = this.createSprite(img, x, y);
        img     = GraphicsUtility.cutImage(imgOrg, 0, 70, imgOrg.width, imgOrg.height-70);
        this.door[i][1] = this.createSprite(img, x, y);
        img     = GraphicsUtility.cutImage(imgOrg, 0, 44, imgOrg.width, imgOrg.height-44);
        this.door[i][2] = this.createSprite(img, x, y);
        img     = GraphicsUtility.cutImage(imgOrg, 0, 20, imgOrg.width, imgOrg.height-20);
        this.door[i][3] = this.createSprite(img, x, y);
        img = GraphicsUtility.cutImage(imgOrg, 0,0, imgOrg.width, imgOrg.height-2);
        this.door[i][4] = this.createSprite(img, x, y);
    }

    constructor(init:IInitData, initData:IFDoor[]) {
        super(init);
        let i =0;
        let img:any;
        for (let i = 0; i<5; i++) this.door.push([]);

        for (let door of initData)
        {
            switch(this.distance)
            {
                case Distance.D1:
                    this.createDoor(i, door.nameD1, initDoorCoord[this.distance-1][this.position-1].x, initDoorCoord[this.distance-1][this.position-1].y);
                    break;
                case Distance.D2:
                    this.createDoor(i, door.nameD2, initDoorCoord[this.distance-1][this.position-1].x, initDoorCoord[this.distance-1][this.position-1].y);
                    break;
                case Distance.D3:
                    this.createDoor(i, door.nameD3, initDoorCoord[this.distance-1][this.position-1].x, initDoorCoord[this.distance-1][this.position-1].y);
                    break;
                default:
                    break;
            }
            i++;
        }
    }

    update(cell: MapCell, dir: number, alt: boolean, position: Position): void {
        const dcell:DoorCell = cell as DoorCell;
        const open:number = dcell.state;
        if (!dcell.active) return;
        let ns: number = dir % 2; // 0 = NS, 1 = EW
        if (dcell.facing == ns) {
            this.door[dcell.doorType][open].setVisible(true);
        }
    }

}