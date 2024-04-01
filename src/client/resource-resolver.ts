import { World } from "./world/world";

export class ResourceResolver {
    public parentElement: HTMLElement;
    public images: Map<string, HTMLImageElement>;

    constructor(parent: HTMLElement) {
        this.parentElement = parent;
        this.images = new Map<string, HTMLImageElement>();
    }

    getTextures(world: World): HTMLImageElement {
        let textureImage = this.images.get(world.textures.href);
        if ( textureImage != null ) {
            return textureImage;
        }

        return this.addResource(world.textures.href);
    }

    getSprites(world: World): HTMLImageElement {
        let spriteImage = this.images.get(world.sprites.href);
        if ( spriteImage != null ) {
            return spriteImage;
        }

        return this.addResource(world.sprites.href);
    }

    private addResource(url: string): HTMLImageElement {
        const img = document.createElement('img');
        img.src = url;
        img.classList.add('hidden');
        this.parentElement.appendChild(img);
        this.images.set(url, img);
        return img;
    }
}