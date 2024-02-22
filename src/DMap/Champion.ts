import { Fonts } from "../gfx/fonts/Fonts.js";
import { SysFont } from "../gfx/fonts/SysFont.js";
import { Sprite } from "../gfx/sprite/Sprite.js";
import { SpriteManager } from "../gfx/sprite/SpriteManager.js";
import { SpriteSystem } from "../gfx/sprite/SpriteSystem.js";
import { AssetManager } from "../module/AssetManager.js";
import { GraphicsUtility } from "../module/GraphicsUtility.js";
import { enum_Walls } from "../module/enum_Walls.js";

/*
	base_text_color = {182, 182, 182}, 0xb6b6b6
	highlight_text_color = { 0, 222, 0 },
*/
enum ENUM_XPLEVELNAME {
    NEOPHYTE,
    NOVICE,
    APPRENTICE,
    JOURNEYMAN,
    CRAFTSMAN,
    ADEPT,
    EXPERT,
    a_MASTER,
    b_MASTER,
    c_MASTER,
    d_MASTER,
    e_MASTER,
    f_MASTER,
    ARCHMASTER,
    MAX,
}

enum ENUM_PLAYERNAMECOLOR {
    SYSTEM,
    UNKNOWN,
    ACTIVE,
    LEADER,
}
const PLAYERNAMECOLOR:string [] = [
    "#B6B6B6",
    "#B6A060",
    "#FFB600",
    "#FFFF00",
];

const PLAYERCOLOR:string [] = [
    "#00DE00",
    "#FFFF00",
    "#FF0000",
    "#0000FF",
];


const XPLEVELNAMESTRING = [
    "NEOPHYTE",
    "NOVICE",
    "APPRENTICE",
    "JOURNEYMAN",
    "CRAFTSMAN",
    "ADEPT",
    "EXPERT",
    "a MASTER",
    "b MASTER",
    "c MASTER",
    "d MASTER",
    "e MASTER",
    "f MASTER",
    "ARCHMASTER",
]

enum ENUM_STATS {
    STRENGTH,
    DEXTERITY,
    WISDOM,
    VITALITY,
    ANTIMAGIC,
    ANTIFIRE,
    LUCK,
    MAX,
}

export enum ENUM_CLASSES {
    FIGHTER,
    NINJA,
    PRIEST,
    WIZARD,
    MAX,
}

export enum ENUM_BAR {
    HEALTH,
    STAMINA,
    MANA,
    MAX,
}

export enum ENUM_SUBCLASS_FIGHTER {
    SWING,
    THRUST,
    CLUB,
    PARRY,
    MAX,
}

export enum ENUM_SUBCLASS_NINJA {
    STEAL,
    FIGHT,
    THROW,
    SHOOT,
    MAX,
}

export enum ENUM_SUBCLASS_PRIEST {
    IDENTIFY,
    HEAL,
    INFLUENCE,
    DEFEND,
    MAX,
}

export enum ENUM_SUBCLASS_WIZARD {
    FIRE,
    AIR,
    EARTH,
    WATER,
    MAX,
}

export enum enum_Inventory {
    HAND_L,
    HAND_R,
    HEAD,
    TORSO,
    LEGS,
    FEET,
    POUCH_2,
    QUIVER1_1,
    QUIVER2_1,
    QUIVER2_2,
    QUIVER2_3,
    NECK,
    POUCH_1,
    BACKPACK_1,
    BACKPACK_2,
    BACKPACK_3,
    BACKPACK_4,
    BACKPACK_5,
    BACKPACK_6,
    BACKPACK_7,
    BACKPACK_8,
    BACKPACK_9,
    BACKPACK_10,
    BACKPACK_11,
    BACKPACK_12,
    BACKPACK_13,
    BACKPACK_14,
    BACKPACK_15,
    BACKPACK_16,
    BACKPACK_17,
    MAX,
}

enum enum_Chest {
    CHEST_1,
    CHEST_2,
    CHEST_3,
    CHEST_4,
    CHEST_5,
    CHEST_6,
    CHEST_7,
    CHEST_8,
    MAX,
}

export class Champion {
    _assetManager:AssetManager = AssetManager.getInstance();
    _spriteSystem:SpriteSystem = SpriteSystem.getInstance();
    _spriteManager:SpriteManager|null;

    _name:string="";
    _title:string="";
    _gender:string="";
    _dead:boolean = false;
    _health:number=0;
    _stamina:number=0;
    _mana:number =0;
    _stats:number []        = Array(ENUM_STATS.MAX).fill(0);
    _statsMax:number []     = Array(ENUM_STATS.MAX).fill(0);
    _bar:number []          = Array(ENUM_BAR.MAX).fill(0);
    _barMax:number []       = Array(ENUM_BAR.MAX).fill(0);
    _food:number    = 2524;
    _water:number   = 2524;

    _load:number = 0;
    _maxload:number = 0;
    
    _xpclass:number[]       = Array(ENUM_CLASSES.MAX).fill(0);
    _xpsubclas:number[][]   = Array(ENUM_CLASSES.MAX).fill(null).map(() => Array(ENUM_SUBCLASS_FIGHTER.MAX).fill(0)); 
    _portrait:HTMLCanvasElement;
    _mirrorportrait:HTMLCanvasElement;
    _portraitnumber:number = 0;
    _inventory:number [] = [];
    _sysFont:SysFont = SysFont.getInstance();

    _leader:boolean = true;
    _leftHandImg:HTMLCanvasElement;
    _rightHandImg:HTMLCanvasElement;
    _slotBox:HTMLImageElement;
    _humanBody:Sprite[][] = Array(6).fill(null).map(() => Array(2).fill(null)); // Initialize to 6 body partd + 6 hurtables
    _neckBody!:Sprite;
    _pouchBody!:Sprite;
    _quiverBody!:Sprite;
    _bagBody!:Sprite;
    _invScreen!:Sprite;

    createSprites() {
        const invscreen = this._assetManager.getImage("obj0017") as HTMLImageElement;
        this._invScreen = new Sprite(invscreen, 0, 0, this._spriteManager);
//        this._invScreen.setVisible(true);
        this._invScreen.setPriority(2);

        let canvas:HTMLCanvasElement;
        canvas = this.cutImage("obj0048", 20);
        this._humanBody[0][0] = new Sprite(canvas, 6, 53, this._spriteManager);
        canvas = this.cutImage("obj0048", 21);
        this._humanBody[0][1] = new Sprite(canvas, 6, 53, this._spriteManager);
        canvas = this.cutImage("obj0048", 22);
        this._humanBody[1][0] = new Sprite(canvas, 62, 53, this._spriteManager);
        canvas = this.cutImage("obj0048", 23);
        this._humanBody[1][1] = new Sprite(canvas, 62, 53, this._spriteManager);
        canvas = this.cutImage("obj0048", 24);
        this._humanBody[2][0] = new Sprite(canvas, 34, 26, this._spriteManager);
        canvas = this.cutImage("obj0048", 25);
        this._humanBody[2][1] = new Sprite(canvas, 34, 26, this._spriteManager);
        canvas = this.cutImage("obj0048", 26);
        this._humanBody[3][0] = new Sprite(canvas, 34, 46, this._spriteManager);
        canvas = this.cutImage("obj0048", 27);
        this._humanBody[3][1] = new Sprite(canvas, 34, 46, this._spriteManager);
        canvas = this.cutImage("obj0048", 28);
        this._humanBody[4][0] = new Sprite(canvas, 34, 66, this._spriteManager);
        canvas = this.cutImage("obj0048", 29);
        this._humanBody[4][1] = new Sprite(canvas, 34, 66, this._spriteManager);
        canvas = this.cutImage("obj0048", 30);
        this._humanBody[5][0] = new Sprite(canvas, 34, 86, this._spriteManager);
        canvas = this.cutImage("obj0048", 31);
        this._humanBody[5][1] = new Sprite(canvas, 34, 86, this._spriteManager);

        canvas = this.cutImage("obj0048", 16);
        this._neckBody = new Sprite(canvas, 6, 33, this._spriteManager);      
        canvas = this.cutImage("obj0048", 17);
        this._pouchBody = new Sprite(canvas, 6, 73, this._spriteManager);
        canvas = this.cutImage("obj0048", 18);
        this._quiverBody = new Sprite(canvas, 62, 73, this._spriteManager);
        canvas = this.cutImage("obj0048", 19);
        this._bagBody = new Sprite(canvas, 66, 33, this._spriteManager);

        this._neckBody.setPriority(5);
        this._pouchBody.setPriority(5);
        this._quiverBody.setPriority(5);
        this._bagBody.setPriority(5);
//        this._neckBody.setVisible(true);
//        this._pouchBody.setVisible(true);
//        this._quiverBody.setVisible(true);
//        this._bagBody.setVisible(true);

        for (let i=0; i<6;i++) {
            for (let j=0; j<2; j++) {
                if (this._humanBody[i][j]) {
                    this._humanBody[i][j].setPriority(5);
                    this._humanBody[i][j].setVisible(false);
                    //if (j==0) this._humanBody[i][j].setVisible(true);
                }
            }
        }
    }

    update() {
//        this._humanBody[0][0].setVisible(true);
//        console.log(this._spriteManager?.getPriority());
//        this._humanBody[1][0].setVisible(true);
    }


    //32x29 Img Data
    createPortrait(who:number):HTMLCanvasElement {
        const portraits:HTMLImageElement = this._assetManager.getImage("obj0026") as HTMLImageElement;
        const posy = Math.floor(who/8);
        const posx = Math.floor(who%8);
        return GraphicsUtility.cutImage(portraits, posx*32, posy*29, 32, 29);
    }

    cutImage(where:string, what:number):HTMLCanvasElement {
        const portraits:HTMLImageElement = this._assetManager.getImage(where) as HTMLImageElement;
        const posy = Math.floor(what/16);
        const posx = Math.floor(what%16);
        return GraphicsUtility.cutImage(portraits, posx*16, posy*16, 16, 16);
    }

    constructor(name:string, title:string, gender:string, health:number, stamina:number, mana:number, 
                str:number, dex:number, wis:number, vit:number, antm:number, antif:number, luck:number, 
                fig:number, nin:number, pri:number, wiz:number, portrait:number) {
        this._name      = name;
        this._title     = title;
        this._gender    = gender;
        this._health    = health;
        this._stamina   = stamina;
        this._mana      = mana;

        this._statsMax[ENUM_STATS.STRENGTH]    = this._stats[ENUM_STATS.STRENGTH]    = str;
        this._statsMax[ENUM_STATS.DEXTERITY]   = this._stats[ENUM_STATS.DEXTERITY]   = dex;
        this._statsMax[ENUM_STATS.WISDOM]      = this._stats[ENUM_STATS.WISDOM]      = wis;
        this._statsMax[ENUM_STATS.VITALITY]    = this._stats[ENUM_STATS.VITALITY]    = vit;
        this._statsMax[ENUM_STATS.ANTIMAGIC]   = this._stats[ENUM_STATS.ANTIMAGIC]   = antm;
        this._statsMax[ENUM_STATS.ANTIFIRE]    = this._stats[ENUM_STATS.ANTIFIRE]    = antif;
        this._statsMax[ENUM_STATS.LUCK]        = this._stats[ENUM_STATS.LUCK]        = luck;

        this._xpclass[ENUM_CLASSES.FIGHTER] = fig;
        this._xpclass[ENUM_CLASSES.NINJA]   = nin;
        this._xpclass[ENUM_CLASSES.PRIEST]  = pri;
        this._xpclass[ENUM_CLASSES.WIZARD]  = wiz;
    
        this._stats[ENUM_STATS.LUCK] *=5;
        this._stats[ENUM_STATS.LUCK] /=6;
        this._portraitnumber    = portrait;
        this._bar[ENUM_BAR.HEALTH]  = this._barMax[ENUM_BAR.HEALTH] =  this._health;
        this._bar[ENUM_BAR.MANA]    = this._barMax[ENUM_BAR.MANA]   =  this._mana;
        this._bar[ENUM_BAR.STAMINA] = this._barMax[ENUM_BAR.STAMINA]=  this._stamina;
        this._spriteManager = this._spriteSystem.getSpriteManagerName("Inventory");
        this._portrait = this.createPortrait(portrait);
        this._mirrorportrait = GraphicsUtility.setImageColorToTransparent(this._portrait, "0x666666");
        this._leftHandImg = this.cutImage("obj0048", 20);
        this._rightHandImg = this.cutImage("obj0048", 22);
        this._slotBox = this._assetManager.getImage("obj0033") as HTMLImageElement;
        this._maxload = this.calcMaxLoad();
        this.createSprites()
    }

    private drawBars(ctx:CanvasRenderingContext2D, pos:number) {
        for (let i =0; i<ENUM_BAR.MAX;i++) {
            const barSize = 25;
            let barAct = this._bar[i];
            let barMax = this._barMax[i];

            if (barMax < barAct) barMax = barAct;
            if (barAct > 0) {
                let cut = (barSize - Math.floor(barSize * (Math.floor(barAct/10) / Math.floor(barMax/10))));
                const dest_x = 46 + 7 * i;
                if (i < ENUM_BAR.MANA || (barAct>=10)) {
                    if (cut == barSize) {
                        cut -=2;
                    }
                }
                if (cut < barSize*2) {
                    ctx.fillStyle = PLAYERCOLOR[pos];
                    //console.log("fillrect: "+dest_x+" "+(cut+4)+" : "+(dest_x+4)+" 24");
                    ctx.fillRect(dest_x, 2+cut, 4, 25-cut);
                }
            }
        }
    }

    calcMaxLoad():number {
        let strength= this._stats[ENUM_STATS.STRENGTH]/10;
        let maxLoad = (strength + (10 - Math.floor(strength/5))); 
        // Check if special Items are used
        return maxLoad*10;
    }

    writeChampName(ctx:CanvasRenderingContext2D) {
        this._sysFont.setHorizontalAlignment("left");
        if (this._leader) this._sysFont.renderTextAligned(ctx, 0, 1, this._name, PLAYERNAMECOLOR[ENUM_PLAYERNAMECOLOR.LEADER]);
        else this._sysFont.renderTextAligned(ctx, 0, 1, this._name, PLAYERNAMECOLOR[ENUM_PLAYERNAMECOLOR.ACTIVE]);
    }

    showInventory(ctx:CanvasRenderingContext2D) {
        const invscreen = this._assetManager.getImage("obj0017") as HTMLImageElement;
        ctx.drawImage(invscreen, 0, 0);
        const fname:string = this._name+" "+this._title;
        this._sysFont.setHorizontalAlignment("left");
        this._sysFont.renderTextAligned(ctx, 3, 3, fname, PLAYERNAMECOLOR[ENUM_PLAYERNAMECOLOR.LEADER]);
        for (let i=0; i<ENUM_BAR.MAX; i++) {
            let bar = this._bar[i];
            let dbar = Math.floor(bar/10);
            let mbar = this._barMax[i];
            let mdbar = Math.floor(mbar/10);

            this._sysFont.setHorizontalAlignment("right");
            let temp:string = dbar.toString();
            this._sysFont.renderTextAligned(ctx, 73, 8*i+112, dbar.toString(), PLAYERNAMECOLOR[ENUM_PLAYERNAMECOLOR.SYSTEM]);
            this._sysFont.renderTextAligned(ctx, 97, 8*i+112, mdbar.toString(), PLAYERNAMECOLOR[ENUM_PLAYERNAMECOLOR.SYSTEM]);
            this._sysFont.setHorizontalAlignment("left");
            this._sysFont.renderTextAligned(ctx, 73, 8*i+112, "/", PLAYERNAMECOLOR[ENUM_PLAYERNAMECOLOR.SYSTEM]);
            this._sysFont.renderTextAligned(ctx, 5, 8*i+112, ENUM_BAR[i], PLAYERNAMECOLOR[ENUM_PLAYERNAMECOLOR.SYSTEM]);
        }
        this._sysFont.setHorizontalAlignment("left");
        this._sysFont.renderTextAligned(ctx, 104, 128, "LOAD", PLAYERNAMECOLOR[ENUM_PLAYERNAMECOLOR.SYSTEM]);
        this._sysFont.renderTextAligned(ctx, 166, 128, ".", PLAYERNAMECOLOR[ENUM_PLAYERNAMECOLOR.SYSTEM]);
        this._sysFont.renderTextAligned(ctx, 178, 128, "/", PLAYERNAMECOLOR[ENUM_PLAYERNAMECOLOR.SYSTEM]);
        this._sysFont.renderTextAligned(ctx, 208, 128, "KG", PLAYERNAMECOLOR[ENUM_PLAYERNAMECOLOR.SYSTEM]);
        this._sysFont.setHorizontalAlignment("right");
        const maxLoad = this.calcMaxLoad()/10;
        //todo: Draw currentload and use THIS. Vars!
        this._sysFont.renderTextAligned(ctx, 202, 128, maxLoad.toString(), PLAYERNAMECOLOR[ENUM_PLAYERNAMECOLOR.SYSTEM]);       

        this.renderEyeStats(ctx);
//        console.log("setVisible");
    }

    renderEyeStats(ctx:CanvasRenderingContext2D) {
        const img = this._assetManager.getImage("obj0020") as HTMLImageElement;
        ctx.drawImage(img, 20, 0, 124, 73, 100, 51, 124, 73);
        let y=0;
        for (let i=0; i<ENUM_CLASSES.MAX;i++) {
            let level = this._xpclass[i];
            //console.log("level: "+level);
            if (level>0) {
                this._sysFont.setHorizontalAlignment("left");
                let xp:string = XPLEVELNAMESTRING[level-1] +" "+ ENUM_CLASSES[i];
                this._sysFont.renderTextAligned(ctx, 106, y+53, xp, PLAYERNAMECOLOR[ENUM_PLAYERNAMECOLOR.SYSTEM]);
                y += 7;
            }                 
        }
        y = 53 + 7 * ENUM_CLASSES.MAX; // fix: Lineheight + classes
        for (let i=0; i<ENUM_STATS.LUCK;i++) {
            let stat = Math.floor(this._stats[i]/10);
            let maxstat = Math.floor(this._statsMax[i]/10);
            this._sysFont.setHorizontalAlignment("left");
            this._sysFont.renderTextAligned(ctx, 106, y, ENUM_STATS[i], PLAYERNAMECOLOR[ENUM_PLAYERNAMECOLOR.SYSTEM]);
            this._sysFont.setHorizontalAlignment("right");
            this._sysFont.renderTextAligned(ctx, 191, y, stat.toString() , PLAYERNAMECOLOR[ENUM_PLAYERNAMECOLOR.SYSTEM]);
            this._sysFont.setHorizontalAlignment("left");
            this._sysFont.renderTextAligned(ctx, 191, y, "/", PLAYERNAMECOLOR[ENUM_PLAYERNAMECOLOR.SYSTEM]);
            this._sysFont.setHorizontalAlignment("right");
            this._sysFont.renderTextAligned(ctx, 216, y, maxstat.toString() , PLAYERNAMECOLOR[ENUM_PLAYERNAMECOLOR.SYSTEM]);
            y+=7;
        }
    }

    //0x585858 -> background color
    // 67x29 = Infobox

    renderInfoBoxDun(ctx:CanvasRenderingContext2D, champ:number) {
        if (!this._dead) {
            const Infobox = this._assetManager.getImage("obj0007") as HTMLImageElement;
            ctx.drawImage(Infobox, 0, 0);
            this.drawBars(ctx, champ);
            ctx.drawImage(this._slotBox,  2, 9);
            ctx.drawImage(this._slotBox, 23, 9);
            ctx.drawImage(this._leftHandImg,  3, 10);
            ctx.drawImage(this._rightHandImg, 24, 10);
        } else {
            const Infobox = this._assetManager.getImage("obj0008") as HTMLImageElement;
            ctx.drawImage(Infobox, 0, 0);
        } 
        this.writeChampName(ctx);
    }

    renderInfoBox(ctx:CanvasRenderingContext2D, champ:number) {
        const width = ctx.canvas.width;
        const height= ctx.canvas.height;
        ctx.fillStyle = "#585858";
        ctx.fillRect(0, 0, width, height);
        if (!this._dead) {
            this.drawBars(ctx, champ);
        }
        ctx.drawImage(this._portrait, 7, 0);
    }

    renderStats(ctx:CanvasRenderingContext2D) {

    }

}

/*
function sys_render_stats(who)
	local sr = dsb_subrenderer_target()
	
	dsb_bitmap_clear(sr, base_background)
	dsb_bitmap_draw(gfx.inter_blank, sr, 6, 0, false)

	local i
	local classes = 0
	local y = 0
	
	for i=0,xp_classes - 1 do
		local level = dsb_xp_level(who, i, 0)
		local text_color = base_text
		
		if (gt_highlight and gt_highlight[who]) then
		    if (gt_highlight[who].class[i + 1]) then
		        text_color = highlight_text
			end
		end
		
		if (level > 0) then		
	    	dsb_bitmap_textout(sr, sys_font, 
				xp_levelnames[level] .. " " .. xp_classnames[i + 1],
				14, y + 4, LEFT, text_color)
			
			y = y + 14
			classes = classes + 1
			if (classes == 4) then break end		
		end		
	end
	
	y = 60
	for i=0,5 do
	    local real_stat = dsb_get_stat(who, i)
	    local real_maxstat = dsb_get_maxstat(who, i)
		local stat = math.floor(real_stat / 10)
		local maxstat = math.floor(real_maxstat / 10)
		local text_name_color = base_text
		
		if (gt_highlight and gt_highlight[who]) then
		    if (gt_highlight[who].stat[i + 1]) then
		        text_name_color = highlight_text
			end
		end
		
		dsb_bitmap_textout(sr, sys_font,
			statnames[i + 1], 14, y, LEFT, text_name_color)
			
		local stat_color = base_text
		if (stat > maxstat) then stat_color = {0, 222, 0}
		elseif (stat < maxstat) then stat_color = {255, 0, 0} end	
		dsb_bitmap_textout(sr, sys_font, stat, 182, y, RIGHT, stat_color)
			
		dsb_bitmap_textout(sr, sys_font, "/", 182, y, LEFT, base_text)
		
		dsb_bitmap_textout(sr, sys_font, maxstat, 230, y, RIGHT, base_text)	
			
		y = y + 14
	end
end

function sys_render_mainsub(who)
	local sr = dsb_subrenderer_target()
	
	dsb_bitmap_clear(sr, base_background)
	dsb_bitmap_draw(gfx.inter_foodwater, sr, 6, 0, false)
	
	local baseval = dsb_get_food(who)
    local barlen = math.floor((192 * baseval) / 3072) - 1
   	local ccolor = adjust_bar(baseval, {148, 72, 0})
    dsb_bitmap_rect(sr, 28, 38, 30+barlen, 51, {0, 0, 0}, true)
	dsb_bitmap_rect(sr, 24, 34, 26+barlen, 47, ccolor, true)
        
    baseval = dsb_get_water(who)
    barlen = math.floor((192 * baseval) / 3072) - 1
    ccolor = adjust_bar(baseval, {0, 0, 255})
    dsb_bitmap_rect(sr, 28, 84, 30+barlen, 97, {0, 0, 0}, true)
	dsb_bitmap_rect(sr, 24, 80, 26+barlen, 93, ccolor, true)
end

-- Utility function for coloring the bar
function adjust_bar(val, default)
	local rv
	
    if (val < 512) then
        rv = {255, 0, 0}  
    elseif (val < 1024) then
        rv = {255, 255, 0}
    else
    	rv = default
    end

    return rv 	
end

*/
