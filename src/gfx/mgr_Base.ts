import { MapCell } from "../DMap/MapCell.js";
import { Distance } from "./enum_Distance.js";
import { Position } from "./enum_Position.js";
import { SpriteManager } from "./sprite/SpriteManager.js";

export interface IInitData {
    distance: Distance;
    position: Position;
}

export interface IMgrClass {
    disable(): void;
    update(cell: MapCell, dir: number, alt: boolean, position:Position): void;
    render(ctx:CanvasRenderingContext2D, cell: MapCell, dir: number, alt: boolean, position:Position): void;
}

export abstract class MgrBase<T extends IMgrClass> {
    mgr: Map<string, T[]>;
    visible: Set<T> = new Set();
    _spriteManager:SpriteManager;

    constructor(sm:SpriteManager) {
        this.mgr = new Map<string, T[]>();
        this._spriteManager = sm;
    }

    addItem(key: string, item: T) {
        if (!this.mgr.has(key)) {
            this.mgr.set(key, []);
        }

        this.mgr.get(key)!.push(item);
    }

    getItems(key: string): T[] | undefined {
        return this.mgr.get(key);
    }

    // Initclass Functions.
    protected initClass<TItem extends IInitData>(
        dataArray: Array<TItem>,
        factoryFunction: (data: TItem) => any
    ): void;

    // Overload for 2 parameters
    protected initClass<TItem extends IInitData, TCoord>(
        dataArray: Array<TItem>,
        coordsArray: TCoord[],
        factoryFunction: (data: TItem, coords: TCoord[]) => any
    ): void;

    // Overload for 3 parameters
    protected initClass<TItem extends IInitData, TCoord, TName>(
        dataArray: Array<TItem>,
        coordsArray: TCoord[],
        namesArray: TName[],
        factoryFunction: (data: TItem, coords: TCoord[], names: TName[]) => any
    ): void;

    // Implementation of the wrapper method
    protected initClass(...args: any[]): void {
        if (args.length === 2) {
            this.initializeWithClass(args[0], args[1]);
        } else if (args.length === 3) {
            this.initializeWithClass2Parameter(args[0], args[1], args[2]);
        } else if (args.length === 4) {
            this.initializeWithClass3Parameter(args[0], args[1], args[2], args[3]);
        } else {
            // Handle invalid number of arguments
            throw new Error("Invalid number of arguments for initClass.");
        }
    }

    protected initializeWithClass<TItem extends IInitData>(dataArray: Array<TItem>, factoryFunction: (data: TItem) => T) {
        for (let data of dataArray) {
            const key = `${data.distance}_${data.position}`;
            this.addItem(key, factoryFunction(data));
        }
    }    

    protected initializeWithClass3Parameter<TItem extends IInitData, TCoord, TName> (
        dataArray: Array<TItem>,
        coordsArray: TCoord[],
        namesArray: TName[],
        factoryFunction: (data: TItem, coords: TCoord[], names: TName[]) => T ) 
    {
        for (let data of dataArray) {
            const key = `${data.distance}_${data.position}`;
            this.addItem(key, factoryFunction(data, coordsArray, namesArray));
        }
    }

    protected initializeWithClass2Parameter<TItem extends IInitData, TCoord> (
        dataArray: Array<TItem>,
        coordsArray: TCoord[],
        factoryFunction: (data: TItem, coords: TCoord[]) => T ) 
    {
        for (let data of dataArray) {
            const key = `${data.distance}_${data.position}`;
            this.addItem(key, factoryFunction(data, coordsArray));
        }
    }


    clear() {
        this.visible.forEach((item) => {
            item.disable();
        });
        this.visible.clear();
    }

    update(distance: Distance, position: Position, cell: MapCell, dir: number, alt: boolean) {
        const key = `${distance}_${position}`;
        const mgrClasses = this.getItems(key);
        
        if (!mgrClasses || mgrClasses.length === 0) return;

        mgrClasses.forEach(mgrClass => {
            mgrClass.update(cell, dir, alt, position); //---Todo: Maybe return a TRUE/False for the Visible ADD List?
            this.visible.add(mgrClass);
        });
    }

    render(ctx:CanvasRenderingContext2D, distance: Distance, position: Position, cell: MapCell, dir: number, alt: boolean) {
        const key = `${distance}_${position}`;
        const mgrClasses = this.getItems(key);
        
        if (!mgrClasses || mgrClasses.length === 0) return;

        mgrClasses.forEach(mgrClass => {
            mgrClass.render(ctx, cell, dir, alt, position); //---Todo: Maybe return a TRUE/False for the Visible ADD List?
            this.visible.add(mgrClass);
        });
    }
}
