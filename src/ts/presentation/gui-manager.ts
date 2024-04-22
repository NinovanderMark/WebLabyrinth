import { World } from "../game/world/world";
import { Dialog } from "./interface/dialog";
import { ResourceResolver } from "./resource-resolver";
import { Game } from "../game/game";
import { Panel } from "./interface/panel";

export class GuiManager {
    resourceResolver: ResourceResolver;
    parentElement: HTMLElement;
    scoreElement: HTMLElement;

    panel: Panel | null;
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
        if ( this.panel ) {
            let oldElement = this.panel.element;
            this.parentElement.removeChild(oldElement);
        }

        const element = document.createElement('div');
        element.classList.add('panel');
        element.classList.add('dialog');
        const text = document.createElement('p');
        text.innerHTML = message;

        if ( sprite != null && world != null) {
            element.appendChild(this.createSpriteCanvas(sprite, world));
        }
        
        element.appendChild(text);
        this.parentElement.appendChild(element);
        this.panel = new Dialog(message, element, sprite);
    }

    public createEndScreen(game: Game, nextLevel: string | null) {
        if ( this.panel ) {
            this.parentElement.removeChild(this.panel.element);
            this.panel = null;
        }

        const element = document.createElement('div');
        element.classList.add('panel');
        
        const title = document.createElement('p');
        title.classList.add('title');
        title.innerText = "Level complete!";
        element.appendChild(title);

        // Level information
        if ( game.world.name != null) {
            const levelInfo = document.createElement('div');
            levelInfo.classList.add('level-info');
            element.appendChild(levelInfo);

            const subtitle = document.createElement('p');
            subtitle.classList.add('name');
            subtitle.innerText = game.world.name;
            levelInfo.appendChild(subtitle);

            if ( game.world.author != null) {
                const author = document.createElement('p');
                author.classList.add('author');
                author.innerText = game.world.author;
                levelInfo.appendChild(author);
            }
        }

        const scoreTable = document.createElement('table');
        scoreTable.classList.add('stats');
        const scoreRow = game.world.scoreItems > 0 ? `<tr><td>Score</td><td>${(game.player.scoreItemsFound / game.world.scoreItems )*100}%</td></tr>` : '';
        const secretRow = game.world.secrets > 0 ? `<tr><td>Secrets</td><td>${(game.player.secretsFound / game.world.secrets)*100}%</td></tr>` : '';
        scoreTable.innerHTML = `<tbody>${scoreRow}${secretRow}</tbody>`;
        element.appendChild(scoreTable);
        
        const button = document.createElement('button');
        button.classList.add('btn');

        if ( nextLevel != null) {
            button.innerText = 'Next level';
            button.onclick = () => game.loadLevel(nextLevel);

        } else {
            button.innerText = "Replay";
            button.onclick = () => game.loadLevel(game.world.url.toString());
        }

        element.appendChild(button);

        this.panel = new Panel(element);
        this.parentElement.appendChild(element);
        button.focus();
    }

    public tick(game: Game, delta: number) {
        if ( this.panel && this.panel instanceof Dialog) {
            this.panel.addDelta(delta);
            if ( this.panel.alive > 4 ) {
                this.parentElement.removeChild(this.panel.element);
                this.panel = null;
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