import { AssetManager } from "../../module/AssetManager.js";

export class Fonts {
    _assetManager:AssetManager = AssetManager.getInstance();
    private fontName:string;
    private fontLetters:string;
    private fontData: { [char: string]: HTMLCanvasElement } = {};
    private fontWidth=8;
    private fontHeight=6;
    private fontIndex=0;
    private fgColor:string = "";
    private bgColor:string = "";
    private horizontalAlignment: 'left' | 'center' | 'right';
    private verticalAlignment: 'top' | 'middle' | 'bottom';

    static baseColor:string     =   "0xb6b6b6";
    static highlightText:string =   "0x00de00";
    static systemColor:string   =   "0x00dede";

    constructor(font:string, letters:string, width:number, height:number, spacing:number, index?:number, fgColor?: string, bgColor?: string) {
        this.fontName   = font;
        this.fontLetters= letters;
        this.fontWidth  = width;
        this.fontHeight = height;
        this.horizontalAlignment    = 'left';  // default value
        this.verticalAlignment      = 'top';   // default value

        if (fgColor) this.fgColor = fgColor;
        if (bgColor) this.bgColor = bgColor;
        if (index) this.fontIndex = index;
        const img = this._assetManager.getImage(this.fontName) as HTMLImageElement;
        if (!img) return;
        this.loadFont(img, spacing);
    }

    loadFont(fontBitmap: HTMLImageElement, spacing:number = 2) {
        const charsPerRow = Math.floor(fontBitmap.width / (this.fontWidth + spacing)); // Add 2 for left and right spacing
        const startIndex = this.fontIndex; // Starting pixel on the x-axis
    
        for (let i = 0; i < this.fontLetters.length; i++) {
            const charCanvas = document.createElement("canvas");
            charCanvas.width = this.fontWidth;
            charCanvas.height = this.fontHeight;
            const charContext = charCanvas.getContext("2d");
            if (!charContext) return;

            if (this.bgColor.length>0) {
                charContext.fillStyle = this.bgColor;
                charContext.fillRect(0, 0, this.fontWidth, this.fontHeight);
            }
    
            // Calculate the x-coordinate for the current character
            const charX = (startIndex + i * (this.fontWidth + spacing)); // Add 2 for left and right spacing
            const charY = Math.floor(charX / fontBitmap.width) * this.fontHeight;
    
            // Extract the character from the font bitmap
            charContext.drawImage(fontBitmap, charX % fontBitmap.width, charY, this.fontWidth, this.fontHeight, 0, 0, this.fontWidth, this.fontHeight);
            if (this.fgColor.length>0) {
                const coloredCharImage = this.applyFontColor(charCanvas, this.fgColor);
                this.fontData[this.fontLetters[i]] = coloredCharImage;
            } else {    
                // Use the character itself as the key in fontData
                this.fontData[this.fontLetters[i]] = charCanvas;
            }
        }
    }

    /*
    loadFont2(fontBitmap:HTMLImageElement)
    {
        const charsPerRow = Math.floor(fontBitmap.width / this.fontWidth);

        for (let i = 0; i < this.fontLetters.length; i++) {
            const charCanvas = document.createElement("canvas");
            charCanvas.width = this.fontWidth;
            charCanvas.height = this.fontHeight;
            const startIndex = this.fontIndex; // Start index for the characters in the bitmap
            const charContext = charCanvas.getContext("2d");
            if (!charContext) return;

            // Find the index of the character in the chars string
            //const charIndex = this.fontLetters.indexOf(this.fontLetters[i]);
            // Calculate the index for the current character
            const charIndex = startIndex + i;
            // Extract the character from the font bitmap
            const charX = (charIndex % charsPerRow) * this.fontWidth;
            const charY = Math.floor(charIndex / charsPerRow) * this.fontHeight;
            charContext.drawImage(fontBitmap, charX, charY, this.fontWidth, this.fontHeight, 0, 0, this.fontWidth, this.fontHeight);
            // Use the character itself as the key in fontSysData
            this.fontData[this.fontLetters[i]] = charCanvas;
        }
    }
*/

    renderTextCentered(ctx: CanvasRenderingContext2D, x: number, y: number, text: string, fgColor?:string, bgColor?:string) {
        const textWidth = this.measureTextWidth(text);
        const textHeight = this.fontHeight; // Assuming fontHeight is defined (the height of a single character in your font)
        const centerX = x - textWidth / 2;
        const centerY = y + textHeight / 2;
    
        this.renderText(ctx, centerX, centerY, text, fgColor, bgColor);
    }    

    renderTextAligned(ctx: CanvasRenderingContext2D, x: number, y: number, text: string, fgColor?:string, bgColor?:string) {
        const textWidth =  this.measureTextWidth(text);
        const textHeight = this.fontHeight; 
        let renderX = x;
        let renderY = y;

        // Adjust x and y based on the horizontal and vertical alignments
        switch (this.horizontalAlignment) {
            case 'center':
                renderX = x - textWidth / 2;
                break;
            case 'right':
                renderX = x - textWidth;
                break;
            case 'left':
            default:
                renderX = x;
                break;
        }

        switch (this.verticalAlignment) {
            case 'middle':
                renderY = y - textHeight / 2;
                break;
            case 'bottom':
                renderY = y - textHeight;
                break;
            case 'top':
            default:
                renderY = y;
                break;
        }
        this.renderText(ctx, renderX, renderY, text, fgColor, bgColor);
    }

    renderText(ctx: CanvasRenderingContext2D, x: number, y: number, text: string, fgColor?:string, bgColor?:string) {
        const lineHeight = 6; // Adjust this based on your font's character height
    
        for (let i = 0; i < text.length; i++) {
            const char = text[i];
            const charImage = this.fontData[char];
            if (charImage) {
                // Calculate the position for each character
                const charX = x + i * this.fontWidth; // Adjust for character spacing
                
                // If a BackgroundColor is specified, fill a rectangle with that color first
                if (bgColor) {
                    ctx.fillStyle = bgColor;
                    ctx.fillRect(charX, y, this.fontWidth, this.fontHeight);
                }
    
                let coloredCharImage;
                // Apply the desired font color to the character image
                if (fgColor) coloredCharImage = this.applyFontColor(charImage, fgColor);
                else coloredCharImage = charImage;
                
                // Draw the modified image onto the main canvas with the desired color
                ctx.drawImage(coloredCharImage, charX, y);
            }
        }
    }

    measureTextWidth(text: string): number {
        // Assuming fontWidth is defined (the width of a single character in your font)
        return text.length * this.fontWidth;
    }

    private parseColor(color: string): { r: number; g: number; b: number } {
        const hex = color.replace(/^#/, '');
    
        const bigint = parseInt(hex, 16);
    
        const r = (bigint >> 16) & 255;
        const g = (bigint >> 8) & 255;
        const b = bigint & 255;
    
        return { r, g, b };
    }
    
    private applyFontColor(charImage: HTMLCanvasElement, desiredColor: string): HTMLCanvasElement {
        // Create an offscreen canvas to manipulate the color
        const offscreenCanvas = document.createElement('canvas');
        const offscreenCtx = offscreenCanvas.getContext('2d');
    
        if (offscreenCtx) {
            offscreenCanvas.width = charImage.width;
            offscreenCanvas.height = charImage.height;
    
            // Draw the character image onto the offscreen canvas
            offscreenCtx.drawImage(charImage, 0, 0);
    
            // Get the image data of the offscreen canvas
            const imageData = offscreenCtx.getImageData(0, 0, offscreenCanvas.width, offscreenCanvas.height);
    
            // Manipulate the color of the font (e.g., change white to the desired color)
            for (let j = 0; j < imageData.data.length; j += 4) {
                // Assuming white color in the font is [255, 255, 255, 255]
                if (
                    imageData.data[j] === 255 &&
                    imageData.data[j + 1] === 255 &&
                    imageData.data[j + 2] === 255 &&
                    imageData.data[j + 3] === 255
                ) {
                    // Parse the desired color string (e.g., "#FF0000" for red)
                    const parsedColor = this.parseColor(desiredColor);
    
                    // Set the desired color to the font pixels
                    imageData.data[j] = parsedColor.r;
                    imageData.data[j + 1] = parsedColor.g;
                    imageData.data[j + 2] = parsedColor.b;
                    imageData.data[j + 3] = 255; // Alpha component (fully opaque)
                }
            }
    
            // Put the modified image data back onto the offscreen canvas
            offscreenCtx.putImageData(imageData, 0, 0);
    
            return offscreenCanvas;
        }
    
        return charImage; // Return the original image if offscreen rendering fails
    }
    
    // Getter/Setter    
    setHorizontalAlignment(alignment: 'left' | 'center' | 'right') {
        this.horizontalAlignment = alignment;
    }

    getHorizontalAlignment(): 'left' | 'center' | 'right' {
        return this.horizontalAlignment;
    }

    setVerticalAlignment(alignment: 'top' | 'middle' | 'bottom') {
        this.verticalAlignment = alignment;
    }

    getVerticalAlignment(): 'top' | 'middle' | 'bottom' {
        return this.verticalAlignment;
    }

    setFgColor(color:string) {
        this.fgColor = color;
    }

    setBgColor(color:string) {
        this.bgColor = color;
    }

}
