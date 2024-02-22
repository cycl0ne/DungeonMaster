import { Fonts } from "./Fonts.js";

export class SysFont extends Fonts {
    private static instance: SysFont | null = null;

    private constructor() {
        super("obj0695", "!~#$§&'()*+,-./0123456789:;<=>? ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_abcdefghijklmonpqrstuvwx", 6, 6, 2, 266);
        // Private constructor to prevent external instantiation
    }

    static getInstance(): SysFont {
        if (!SysFont.instance) {
            SysFont.instance = new SysFont();
        }
        return SysFont.instance;
    }
}