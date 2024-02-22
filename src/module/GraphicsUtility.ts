import { Distance } from "../gfx/enum_Distance.js";
import { AssetManager } from "./AssetManager.js";

export class GraphicsUtility {
    /**
     * Rescales the provided image to a new width and height.
     *
     * @param image - The source image.
     * @param newWidth - The new width for the image.
     * @param newHeight - The new height for the image.
     * @returns - A canvas with the rescaled image.
     */
    static rescaleImage(image: HTMLImageElement | HTMLCanvasElement |null, newWidth: number, newHeight: number): HTMLCanvasElement {
        const canvas = document.createElement('canvas');
        canvas.width = newWidth;
        canvas.height = newHeight;
        if (!image) return canvas;
        const ctx = canvas.getContext('2d');
        if (!ctx) return canvas;
        ctx.imageSmoothingEnabled = false;

         if (ctx) {
            ctx.drawImage(image, 0, 0, newWidth, newHeight);
        }

        return canvas;
    }

    /**
     * Rescales the provided image to a new width and height.
     *
     * @param image - The source image.
     * @param distance - The Distance of the Object to Viewer (D2/D3)
     * @returns - A canvas with the rescaled image.
     */
    static rescaleImageDistance(image: HTMLImageElement|HTMLCanvasElement, distance:Distance): HTMLCanvasElement {
        let newWidth: number    = 0;
        let newHeight: number   = 0;
        if (distance == Distance.D1 || distance == Distance.D0) return image as HTMLCanvasElement;

        if (distance == Distance.D3) {
            newWidth = Math.floor((image.width * 14)/32);
            newHeight = Math.floor((image.height * 14)/32);
        } else {
            newWidth = Math.ceil((image.width * 21)/32);
            newHeight = Math.ceil((image.height * 21)/32);
        }

        const canvas = document.createElement('canvas');
        canvas.width = newWidth;
        canvas.height = newHeight;
        const ctx = canvas.getContext('2d');
        if (!ctx) return canvas;
        ctx.imageSmoothingEnabled = false;
        ctx.drawImage(image, 0, 0, newWidth, newHeight);
        return canvas;
    }

   /**
     * Darkens the provided image based on the darkness factor.
     *
     * @param image - The source image.
     * @param darknessFactor - Factor by which to darken the image (0 is fully dark, 1 is original brightness).
     * @returns - A canvas with the darkened image.
     */
    static darkenImage(image: HTMLImageElement | HTMLCanvasElement |null, darknessFactor: number): HTMLCanvasElement {
        const canvas = document.createElement('canvas');
        if (!image) return canvas;
        canvas.width = image.width;
        canvas.height = image.height;
        const ctx = canvas.getContext('2d');
        if (!ctx) return canvas;
        ctx.imageSmoothingEnabled = false;

        if (ctx) {
            ctx.drawImage(image, 0, 0);

            let imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            let data = imageData.data;
    
            for (let i = 0; i < data.length; i += 4) {
                // Modify the red channel
                data[i] = data[i] * darknessFactor;
                // Modify the green channel
                data[i + 1] = data[i + 1] * darknessFactor;
                // Modify the blue channel
                data[i + 2] = data[i + 2] * darknessFactor;
                // The alpha channel (i + 3) remains unchanged
            }
    
            ctx.putImageData(imageData, 0, 0);
        }

        return canvas;
    }

    /**
     * Darkens the provided image based on the darkness factor.
     *
     * @param image - The source image.
     * @param distance - Distance to darken image (d2/d3) d0/d1 = return img
     * @returns - A canvas with the darkened image.
     */
    static darkenImageDistance(image: HTMLImageElement | HTMLCanvasElement | null, distance:Distance): HTMLCanvasElement {
        let dark:number = 1;
        if (distance == Distance.D1 || distance == Distance.D0) return image as HTMLCanvasElement;
        if (distance == Distance.D3) dark = 0.6;
        else dark = 0.8;
        return this.darkenImage(image, dark);
    }

    /**
     * Mirrors the provided image horizontally.
     *
     * @param image - The source image.
     * @returns - A canvas with the horizontally mirrored image.
     */
    static mirrorImageHorizontally(image: HTMLImageElement | HTMLCanvasElement | null): HTMLCanvasElement | null {
        if (!image) return null;
        const canvas = document.createElement('canvas');
        canvas.width = image.width;
        canvas.height = image.height;
        const ctx = canvas.getContext('2d');
        if (!ctx) return canvas;
        ctx.imageSmoothingEnabled = false;

        if (ctx) {
            ctx.scale(-1, 1); // Flip horizontally
            ctx.drawImage(image, -canvas.width, 0);
        }

        return canvas;
    }

    /**
     * Mirrors the provided image vertically.
     *
     * @param image - The source image.
     * @returns - A canvas with the vertically mirrored image.
     */
    static mirrorImageVertically(image: HTMLImageElement | HTMLCanvasElement | null): HTMLCanvasElement|null {
        if (!image) return null;
        const canvas = document.createElement('canvas');
        canvas.width = image.width;
        canvas.height = image.height;
        const ctx = canvas.getContext('2d');
        if (!ctx) return canvas;
        ctx.imageSmoothingEnabled = false;

        if (ctx) {
            ctx.scale(1, -1); // Flip vertically
            ctx.drawImage(image, 0, -canvas.height);
        }

        return canvas;
    }

    /**
     * Cuts a portion of the provided image based on the specified coordinates and dimensions.
     *
     * @param image - The source image.
     * @param x - The x-coordinate of the top-left corner of the rectangle.
     * @param y - The y-coordinate of the top-left corner of the rectangle.
     * @param width - The width of the rectangle.
     * @param height - The height of the rectangle.
     * @returns - A canvas containing the cut portion of the image.
     */
    static cutImage(image: HTMLImageElement | HTMLCanvasElement, x: number, y: number, width: number, height: number): HTMLCanvasElement {
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) return canvas;
        ctx.imageSmoothingEnabled = false;
        if (ctx) {
            ctx.drawImage(image, x, y, width, height, 0, 0, width, height);
        }

        return canvas;
    }

    /**
     * Inverts colors in a canvas image.
     *
     * @param canvas - The canvas containing the image to be processed.
     * @param color1 - The first color to be inverted (as a 32-bit color value).
     * @param color2 - The second color to be inverted (as a 32-bit color value).
     */
    static invertColors(canvas:HTMLCanvasElement, color1:number, color2:number) {
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = new Uint32Array(imageData.data.buffer); // Treat data as 32-bit integers
    
        for (let i = 0; i < data.length; i++) {
            // Check if the pixel color matches color1
            if (data[i] === color1) {
                // Invert color1 to color2
                data[i] = color2;
            } else if (data[i] === color2) {
                // Invert color2 to color1
                data[i] = color1;
            }
        }
    
        ctx.putImageData(imageData, 0, 0);
    }
    
    /**
     * Converts specified color in an image to transparent.
     *
     * @param image - The image element or canvas to be processed.
     * @param color - The hex color code (e.g., "#FFFFFF") to be made transparent.
     * @returns A new canvas element with the specified color in the image turned to transparent.
     */
    static setImageColorToTransparent(image: HTMLImageElement | HTMLCanvasElement, color: string): HTMLCanvasElement {
        // Convert the given hex color to RGB format
        const hexToRgb = (hex: string) => {
            const bigint = parseInt(hex.replace(/^#/, ''), 16);
            const r = (bigint >> 16) & 255;
            const g = (bigint >> 8) & 255;
            const b = bigint & 255;
            return { r, g, b };
        };
    
        const rgbColor = hexToRgb(color);
    
        const canvas = document.createElement('canvas');
        canvas.width = image.width;
        canvas.height = image.height;
        const ctx = canvas.getContext('2d');
        if (!ctx) return canvas;
        ctx.imageSmoothingEnabled = false;
    
        ctx.drawImage(image, 0, 0);
    
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    
        for (let i = 0; i < imageData.data.length; i += 4) {
            if (
                imageData.data[i] === rgbColor.r &&
                imageData.data[i + 1] === rgbColor.g &&
                imageData.data[i + 2] === rgbColor.b
            ) {
                imageData.data[i + 3] = 0;  // Set alpha to 0 (transparent)
            }
        }
    
        ctx.putImageData(imageData, 0, 0);
    
        return canvas;
    }

    /**
     * Changes a specified color in an image to another color.
     *
     * @param img - The image element or canvas to be processed.
     * @param col1 - The original hex color code (e.g., "#FFFFFF") to be changed.
     * @param col2 - The new hex color code (e.g., "#000000") that will replace col1.
     * @returns A new canvas element with col1 in the image changed to col2.
     */
    static changeColor(img: HTMLImageElement | HTMLCanvasElement, col1: string, col2: string): HTMLCanvasElement {
        // Convert the given hex color to RGB format
        const hexToRgb = (hex: string) => {
            const bigint = parseInt(hex.replace(/^#/, ''), 16);
            const r = (bigint >> 16) & 255;
            const g = (bigint >> 8) & 255;
            const b = bigint & 255;
            return { r, g, b };
        };

        const rgbColor1 = hexToRgb(col1);
        const rgbColor2 = hexToRgb(col2);

        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        if (!ctx) return canvas;
        ctx.imageSmoothingEnabled = false;

        ctx.drawImage(img, 0, 0);

        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

        for (let i = 0; i < imageData.data.length; i += 4) {
            if (
                imageData.data[i] === rgbColor1.r &&
                imageData.data[i + 1] === rgbColor1.g &&
                imageData.data[i + 2] === rgbColor1.b
            ) {
                imageData.data[i] = rgbColor2.r;
                imageData.data[i + 1] = rgbColor2.g;
                imageData.data[i + 2] = rgbColor2.b;
            }
        }

        ctx.putImageData(imageData, 0, 0);

        return canvas;
    }

    static combineImages(
        img1: HTMLImageElement | HTMLCanvasElement, 
        offsetX: number, 
        offsetY: number, 
        img2: HTMLImageElement | HTMLCanvasElement
    ): HTMLCanvasElement {
        // Create a new canvas
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
    
        if (!ctx) {
            throw new Error("Failed to get canvas context.");
        }
        // Set the canvas dimensions based on the two images and the offsets
        canvas.width = img2.width;
        canvas.height = img2.height;
        // Draw the first image onto the canvas at position (0, 0)
        ctx.drawImage(img1, offsetX, offsetY);
        // Draw the second image onto the canvas at the specified offsets
        ctx.drawImage(img2, 0, 0);

        // Return the combined canvas
        return canvas;
    }

    static combineImages2(
        img1: HTMLImageElement | HTMLCanvasElement, 
        img2: HTMLImageElement | HTMLCanvasElement,
        offsetX: number, 
        offsetY: number, 
    ): HTMLCanvasElement {
        // Create a new canvas
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
    
        if (!ctx) {
            throw new Error("Failed to get canvas context.");
        }
        // Set the canvas dimensions based on the two images and the offsets
        canvas.width = img1.width;
        canvas.height = img1.height;
        // Draw the first image onto the canvas at position (0, 0)
        ctx.drawImage(img1, 0, 0);
        // Draw the second image onto the canvas at the specified offsets
        ctx.drawImage(img2, offsetX, offsetY);

        // Return the combined canvas
        return canvas;
    }

    static cloneCanvas(src:HTMLCanvasElement|HTMLImageElement):HTMLCanvasElement {
        const dest = document.createElement('canvas');
        dest.width = src.width;
        dest.height = src.height;
        const ctx = dest.getContext('2d');
        ctx?.drawImage(src, 0,0);
        return dest;
    }

    static createCanvasWH(w:number, h:number):HTMLCanvasElement {
        const dest = document.createElement('canvas');
        dest.width = w;
        dest.height = h;
        return dest;
    }

    static createCanvas(src:HTMLCanvasElement|HTMLImageElement):HTMLCanvasElement {
        const dest = document.createElement('canvas');
        dest.width = src.width;
        dest.height = src.height;
        return dest;
    }

    static cutImage16x16(where:string, what:number):HTMLCanvasElement {
        const portraits:HTMLImageElement = AssetManager.getInstance().getImage(where) as HTMLImageElement;
        const posy = Math.floor(what/16);
        const posx = Math.floor(what%16);
        return this.cutImage(portraits, posx*16, posy*16, 16, 16);
    }

    static AlignLeftCentVert(image:HTMLCanvasElement|HTMLImageElement|null, x:number, y:number):[xr:number, yr:number] {
        if (!image) return [0,0];
        let xr = x;
        let yr = y - Math.ceil(image.height/2);
        return [xr,yr];
    }

    static AlignRightCentVert(image:HTMLCanvasElement|HTMLImageElement|null, x:number, y:number):[xr:number, yr:number] {
        if (!image) return [0,0];
        
        let xr = x - image.width-1;
        let yr = y - Math.ceil(image.height/2);
        return [xr,yr];
    }

    static Center(image:HTMLCanvasElement|HTMLImageElement|null, x:number, y:number):[xr:number, yr:number] {
        if (!image) return [0,0];
        let xr = x - Math.ceil(image.width/2);
        let yr = y - Math.ceil(image.height/2);    
        return [xr,yr];
    }

    static BottomCenter(image:HTMLCanvasElement|HTMLImageElement|null, x:number, y:number):[xr:number, yr:number] {
        if (!image) return [0, 0];
        let xr = x - Math.ceil(image.width / 2);
        let yr = y - image.height;
        return [xr, yr];
    }

    static TopRight(image: HTMLCanvasElement | HTMLImageElement | null, x: number, y: number): [number, number] {
        if (!image) return [0, 0];
        const xr = x + 224 - image.width;
        y+=1;
        return [xr, y];
    }

    static CenterTop(image: HTMLCanvasElement | HTMLImageElement | null, x: number, topMargin: number): [number, number] {
        if (!image) return [0, 0];
        const xr = x + 112 - Math.ceil((image.width)/2);
        const yr = topMargin+1;
        return [xr, yr];
    }

}
