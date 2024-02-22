export class AssetManager {
    private static instance: AssetManager | null = null;

    private soundAssets: Map<string, HTMLAudioElement> = new Map();
    private imageAssets: Map<string, HTMLImageElement | HTMLCanvasElement> = new Map();
    private loadingPromise: Promise<void> | null = null;

    private constructor() {
        // Private constructor to prevent external instantiation
    }

    static getInstance(): AssetManager {
        if (!AssetManager.instance) {
            AssetManager.instance = new AssetManager();
        }
        return AssetManager.instance;
    }

    loadSound(options: { name: string; url: string }): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            const audio = new Audio();
            audio.src = options.url;
            audio.onloadeddata = () => {
                this.soundAssets.set(options.name, audio);
                resolve();
            };
            audio.onerror = (error) => {
                reject(error);
            };
            audio.load(); // Start loading the audio
        });
    }

    loadImage(options: { name: string; url: string }): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            const image = new Image();
            image.src = options.url;
            image.onload = () => {
                this.imageAssets.set(options.name, image);
                resolve();
            };
            image.onerror = (error) => {
                reject(error);
            };
        });
    }

    loadAllAssets(): Promise<void> {
        if (!this.loadingPromise) {
            const soundLoadingPromises = Array.from(this.soundAssets.values())
                .map(sound => sound.onloadeddata);

            const imageLoadingPromises = Array.from(this.imageAssets.values())
                .map(image => new Promise<void>((resolve, reject) => {
                    if (image instanceof HTMLImageElement) {
                        image.onload = (event) => resolve();
                        image.onerror = (error) => reject(error);
                    } else if (image instanceof HTMLCanvasElement) {
                        resolve(); // No need to wait for canvas
                    }
                }));

            this.loadingPromise = Promise.all([...soundLoadingPromises, ...imageLoadingPromises])
                .then(() => {
                    //console.log('All assets loaded');
                });
        }
        return this.loadingPromise;
    }

    addImage(name: string, imageOrCanvas: HTMLImageElement | HTMLCanvasElement): void {
        this.imageAssets.set(name, imageOrCanvas);
    }

    getSound(url: string): HTMLAudioElement | null {
        const audio = this.soundAssets.get(url);
        return audio?audio:null;
    }

    getImage(name: string): HTMLImageElement | HTMLCanvasElement | null {
        const image = this.imageAssets.get(name);
        return image?image:null;
    }
}
/*
// Usage
const assetManager = AssetManager.getInstance();

// Load and use assets
async function loadAndUseAssets() {
    await assetManager.loadSound({ name: 'sound1', url: 'sound1.mp3' });
    await assetManager.loadImage({ name: 'image1', url: 'image1.png' });

    const image = assetManager.getImage('image1');
    const canvas = GraphicsUtility.rescaleImage(image, 200, 150);
    assetManager.addImage('rescaledImage', canvas);

    // Access the 2D context of your canvas element
    const canvasElement = document.getElementById('canvas') as HTMLCanvasElement;
    const ctx = canvasElement.getContext('2d');

    // Use the stored canvas directly with ctx.drawImage
    const storedCanvas = assetManager.getImage('rescaledImage');
    ctx.drawImage(storedCanvas, 0, 0);
}

loadAndUseAssets().then(() => {
    console.log('All assets loaded and used');
});
*/