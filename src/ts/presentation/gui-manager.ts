import { World } from "../game/world/world";
import { Dialog } from "./dialog";
import { ResourceResolver } from "./resource-resolver";
import { Game } from "../game/game";

export class GuiManager {
    resourceResolver: ResourceResolver;
    parentElement: HTMLElement;
    scoreElement: HTMLElement;

    dialog: Dialog | null;
    lastScore = -1;
    texWidth = 64;
    texHeight = 64;

    constructor(resourceResolver: ResourceResolver, parent: HTMLElement) {
        this.resourceResolver = resourceResolver;
        this.parentElement = parent;
        this.scoreElement = document.createElement('p');
        this.scoreElement.classList.add('score');
        this.parentElement.appendChild(this.scoreElement);
    }

    public enteredLevel(name: string, author: string | null) {
        document.title = `WebLabyrinth - ${name}`;
        let message = name;
        if ( author != null) {
            message =`<strong>${message}</strong><br>By ${author}`;
        }
        
        this.addDialog(message);
    }

    public addDialog(message: string, sprite: number | null = null, world: World | null = null) {
        if ( this.dialog ) {
            let oldElement = this.dialog.element;
            this.parentElement.removeChild(oldElement);
        }

        const element = document.createElement('div');
        element.classList.add('dialog');
        const text = document.createElement('p');
        text.innerHTML = message;

        if ( sprite != null && world != null) {
            element.appendChild(this.createSpriteCanvas(sprite, world));
        }
        
        element.appendChild(text);
        this.parentElement.appendChild(element);
        this.dialog = new Dialog(message, element, sprite);
    }

    public tick(game: Game, delta: number) {
        if ( this.dialog ) {
            this.dialog.addDelta(delta);
            if ( this.dialog.alive > 4 ) {
                this.parentElement.removeChild(this.dialog.element);
                this.dialog = null;
            }
        }

        if ( game.player.score !== this.lastScore) {
            this.lastScore = game.player.score;
            this.scoreElement.innerText = `${this.lastScore}`.padStart(10, '0');
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