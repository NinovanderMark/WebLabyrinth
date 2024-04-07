import { World } from "../game/world/world";
import { Dialog } from "./dialog";
import { ResourceResolver } from "./resource-resolver";

export class GuiManager {
    resourceResolver: ResourceResolver;
    parentElement: HTMLElement;

    dialog: Dialog | null;
    texWidth = 64;
    texHeight = 64;

    constructor(resourceResolver: ResourceResolver, parent: HTMLElement) {
        this.resourceResolver = resourceResolver;
        this.parentElement = parent;
    }

    public addDialog(message: string, sprite: number | null = null, world: World | null = null) {
        if ( this.dialog ) {
            let oldElement = this.dialog.element;
            this.parentElement.removeChild(oldElement);
        }

        const element = document.createElement('div');
        element.classList.add('dialog');
        const text = document.createElement('p');
        text.innerText = message;

        if ( sprite != null && world != null) {
            element.appendChild(this.createSpriteCanvas(sprite, world));
        }
        
        element.appendChild(text);
        this.parentElement.appendChild(element);
        this.dialog = new Dialog(message, element, sprite);
    }

    public tick(delta: number) {
        if ( this.dialog ) {
            this.dialog.addDelta(delta);
            if ( this.dialog.alive > 3 ) {
                this.parentElement.removeChild(this.dialog.element);
                this.dialog = null;
            }
        }
    }

    private createSpriteCanvas(sprite: number, world: World): HTMLCanvasElement {
        const canvas = document.createElement('canvas');
        canvas.width = this.texWidth;
        canvas.height = this.texHeight;

        const ctx = canvas.getContext('2d');
        if ( ctx == null ) {
            throw new Error(`Unable to create 2D context`);
        }

        const sheet = this.resourceResolver.getSprites(world);
        ctx.drawImage(sheet, sprite*this.texWidth, 0, this.texWidth, this.texHeight, 0, 0, this.texWidth, this.texHeight);
        return canvas;
    }
}