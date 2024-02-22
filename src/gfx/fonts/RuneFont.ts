import { Fonts } from "./Fonts.js";

export class RuneFont extends Fonts {
    private static instance: RuneFont | null = null;

    private constructor() {
        super("obj0695", "!~#$§&'()*+,-./0123456789:;<=>? ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_abcdefghijklmonpqrstuvwx", 6, 6, 2, 266, "#00dede", "#000000");
        // Private constructor to prevent external instantiation
    }

    static getInstance(): RuneFont {
        if (!RuneFont.instance) {
            RuneFont.instance = new RuneFont();
        }
        return RuneFont.instance;
    }
}