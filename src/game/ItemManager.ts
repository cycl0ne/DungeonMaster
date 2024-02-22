
export enum ITEMCLASS {
    OTHER,
    FOOD,
    KEY,
    GEM,
    COMPASS,
    NECK,
    HEAD,
    FEET,
    SHIELD,
    SHOOTING,
    MISSLE,
    BOMB,
    MAGIC,
    SPELL,
    BONES,
    TORCH,
    SCROLL,
    CONTAINER,
    MISC,
}

export const enum ITEMTYP {
    THING,
}

export interface IItemClass {
    _name:string;
    _type:ITEMTYP;
    _class:ITEMCLASS;
    _shortdesc:string;
    _mass:number;
    _icon:HTMLCanvasElement;
    _dungeon:HTMLImageElement;
}

export class ItemObject implements IItemClass {
    _name: string;
    _type: number;
    _class: number;
    _shortdesc: string;
    _mass: number;
    _icon: HTMLCanvasElement;
    _dungeon: HTMLImageElement;

//    constructor(name:string, type:number, cla:number, shortdesc:string, mass:number, icon:HTMLCanvasElement, dungeon:HTMLCanvasElement) {
    constructor(item:IItemClass) {
        this._name      = item._name;
        this._type      = item._type;
        this._class     = item._class;
        this._shortdesc = item._shortdesc;
        this._mass      = item._mass;
        this._icon      = item._icon;
        this._dungeon   = item._dungeon;
    }
}

export class ItemFood extends ItemObject {
    _foodval:number;
    _invLocation:number;

    constructor(item:IItemClass, fval:number, invloc:number){
        super(item);
        this._foodval    = fval;
        this._invLocation= invloc;
    }
}

export class ItemManager {
    private static instance: ItemManager | null = null;
    private _itemDB:Map<string, IItemClass>;

    private constructor() {
        // Private constructor to prevent external instantiation
        this._itemDB = new Map<string, IItemClass>();
    }

    addItem(item:IItemClass) {
        this._itemDB.set(item._name, item);
    }
    
    getItem(key:string):IItemClass|undefined {
        return this._itemDB.get(key);
    }

    listItem() {
        return Array.from(this._itemDB.entries());
    }

    createItem(item:IItemClass, par1:number, par2:number) {
        let itemret:ItemObject;
        switch (item._class) {
            default:
            case ITEMCLASS.FOOD:
                itemret = new ItemFood(item, par1, par2);
            break;
        }
        console.log("created Item: "+item._name+" of class "+ITEMCLASS[item._class]+ "foodvalue: "+par1);
        this.addItem(itemret);
    }

    // Singleton
    static getInstance(): ItemManager {
        if (!ItemManager.instance) {
            ItemManager.instance = new ItemManager();
        }
        return ItemManager.instance;
    }

//168
}

