export class FloorObj {
    _type:number;
    _state:boolean;
    constructor(type:number, act:boolean) {
        this._type = type;
        this._state= act;
    }

    toggle() {
        this._state = !this._state;
    }
}

enum enum_FloorObj {
    Crack,
    Grate_Round,
    Grate_Square,
    Haze_Blue,
    Pad_Large,
    Pad_Small,
    Pad_Tiny,
    Pit,
    Pit_Invisble,
    Puddle,
    Slime,
}

export class PressurePadLarge extends FloorObj {
    constructor(act:boolean) {
        super(enum_FloorObj.Pad_Large, act); 
    }
}

