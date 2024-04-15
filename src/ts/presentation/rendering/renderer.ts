import { Game } from "../../game/game";
import { Color } from "../../base/color";
import { Sprite } from "../../game/world/sprite";
import { ViewSprite } from "./view-sprite";
import { Door } from "../../game/world/door";
import { GameObject } from "../../game/world/game-object";
import { RayCast } from "../../game/raycast";
import { ResourceResolver } from "../resource-resolver";
import { Player } from "../../game/player";


export class Renderer {
    screenWidth: number;
	screenHeight: number;
	canvas: HTMLCanvasElement;

    resourceResolver: ResourceResolver;
	drawContext: CanvasRenderingContext2D;
    parentElement: HTMLElement;
    mapVisible: boolean;

    texWidth = 64;
    texHeight = 64;

    constructor(width: number, height: number, resResolver: ResourceResolver, canvasElement: HTMLCanvasElement, parent: HTMLElement) {
        this.screenWidth = width;
		this.screenHeight = height;

        this.resourceResolver = resResolver;
		this.canvas = canvasElement;
		this.canvas.width = this.screenWidth;
		this.canvas.height = this.screenHeight;

        let context = this.canvas.getContext('2d');
		if ( context == null) {
			throw new Error("Unable to get 2D rendering context from Canvas");
        }

		this.drawContext = context;
        this.drawContext.imageSmoothingEnabled = false;
        this.parentElement = parent;
    }

    public toggleMap() {
        this.mapVisible = !this.mapVisible;
    }

    public render(game: Game, delta: number) {
        this.drawContext.fillStyle = "#000";
        this.drawContext.fillRect(0,0,this.screenWidth, this.screenHeight);
    
        const textures = this.resourceResolver.getTextures(game.world);
        const sprites = this.resourceResolver.getSprites(game.world);
        
        if ( textures.naturalWidth === 0 || textures.naturalHeight === 0 || 
            sprites.naturalWidth === 0  || sprites.naturalHeight === 0) {
            this.drawContext.fillStyle = "#fff";
            this.drawContext.font = "30px Arial";
            this.drawContext.textAlign = "center";
            this.drawContext.fillText("Loading textures...", this.screenWidth/2, this.screenHeight/2);
            return;
        }

        this.renderCeilingFloor(game);
        this.renderWalls(game, textures, sprites);

        if ( this.mapVisible ) {
            this.renderMap(game);
        }

        this.renderInterface(game.player, sprites, delta);
    }

    private renderInterface(player: Player, sprites: HTMLImageElement, delta: number) {
        let left = 16;
        let bottom = 16;

        player.items.forEach(i => {
            // Don't draw items we have none of, or who are in the special 'score' category
            if ( i.amount < 1 || i.name === 'score' ) {
                return;
            }

            const width = 48;
            const y = this.screenHeight - (bottom+width);
            for (let n = 0; n < i.amount; n++) {
                this.drawContext.drawImage(sprites, i.sprite*this.texWidth, 0, this.texWidth, this.texHeight, left+(n*width/2), y, width, width);
            }
            bottom+=(width/2 + 8);
        });
    }

    private renderCeilingFloor(game: Game) {
        // Temporary implementation
        var ceilColor = this.getBlockColor(game.world.ceiling);
        this.drawContext.fillStyle = "hsl(" + ceilColor.hue + "," + ceilColor.saturation + "%," + ceilColor.lightness/2 + "%)";
        this.drawContext.fillRect(0, 0, this.screenWidth, this.screenHeight/2);

        var floorColor = this.getBlockColor(game.world.floor);
        this.drawContext.fillStyle = "hsl(" + floorColor.hue + "," + floorColor.saturation + "%," + floorColor.lightness/4 + "%)";
        this.drawContext.fillRect(0, this.screenHeight/2, this.screenWidth, this.screenHeight/2);
    }

    private renderWalls(game: Game, textures: HTMLImageElement, spriteTextures: HTMLImageElement) {
        const pitch = 0;
        const zBuffer: Array<number> = [];
        zBuffer.fill(0, 0, this.screenWidth);
        const sprites: Array<ViewSprite> = [];

        for(var x = 0; x < this.screenWidth; x++) {
            var cameraX = 2 * x / this.screenWidth - 1; // X coordinate in camera space
            var ray = RayCast.ray(game.player.position, game.player.direction, game.player.plane, cameraX, game.world);

            if ( ray.sprites ) {
                ray.sprites.forEach(sprite => {
                    if ( sprites.findIndex(s => s.x.toFixed(3) === sprite.x.toFixed(3) && 
                        s.y.toFixed(3) === sprite.y.toFixed(3) && s.sprite === sprite.sprite) < 0) {
                        sprites.push(sprite);
                    }
                })
            }
            
            // Calculate height of line to draw on screen
            var lineHeight = Math.floor(this.screenHeight / ray.perpWallDist);

            // Calculate lowest and highest pixel to fill in current stripe
            const drawStart = -lineHeight / 2 + this.screenHeight / 2 + pitch;
            const drawEnd = lineHeight / 2 + this.screenHeight / 2 + pitch;

            //x coordinate on the texture
            var texX = ray.wallX * this.texWidth;
            if(ray.side == 0 && ray.direction.x > 0) texX = this.texWidth - texX;
            if(ray.side == 1 && ray.direction.y < 0) texX = this.texWidth - texX;
            
            if ( ray.worldObject instanceof Door && !ray.worldObject.block && !ray.inside ) { 
                if((ray.side == 0 && ray.direction.x > 0 )|| (ray.side == 1 && ray.direction.y < 0)) {
                    texX += Math.floor(ray.worldObject.openAmount * this.texWidth);
                } else {
                    texX -= Math.floor(ray.worldObject.openAmount * this.texWidth);
                }
                
            }

            const textureStartX = Math.floor(this.texWidth+(ray.texture*this.texWidth)-texX);
            this.drawContext.drawImage(textures, textureStartX, 0, 1, this.texHeight, x, drawStart, 1, drawEnd - drawStart);
            if ( ray.side === 1 ) { 
                this.drawContext.strokeStyle = 'rgba(0,0,0,0.6)';
                this.drawContext.beginPath();
                this.drawContext.moveTo(x, drawStart);
                this.drawContext.lineTo(x, drawEnd);
                this.drawContext.stroke();
            }

            zBuffer[x] = ray.perpWallDist;
        }

        // Sort from farthest to closest
        sprites.sort((a: ViewSprite, b: ViewSprite): number => {
            return b.distanceTo(game.player.position.x, game.player.position.y) - a.distanceTo(game.player.position.x, game.player.position.y);
        });

        // Draw sprite positions on screen for debug purposes
        let y = 14;
        this.drawContext.fillStyle = "#fff";
        this.drawContext.font = "12px Courier New";
        this.drawContext.textAlign = "left";
        
        sprites.forEach(s => {
            this.renderSpriteBillboard(s, game, zBuffer, pitch, spriteTextures);
            this.drawContext.fillText(`${s.x.toFixed(3)},${s.y.toFixed(3)}`, 8, y);
            y+= 14;
        });
    }

    private renderSpriteBillboard(sprite: ViewSprite, game: Game, zBuffer: Array<number>, pitch: number, texture: HTMLImageElement) {
        const invDet = 1.0 / (game.player.plane.x * game.player.direction.y - game.player.direction.x * game.player.plane.y); //required for correct matrix multiplication

        const transformX = invDet * (game.player.direction.y * sprite.x - game.player.direction.x * sprite.y);
        const transformY = invDet * (-game.player.plane.y * sprite.x + game.player.plane.x * sprite.y); //this is actually the depth inside the screen, that what Z is in 3D

        const spriteScreenX = Math.floor((this.screenWidth / 2) * (1 + transformX / transformY));

        //calculate height of the sprite on screen
        const spriteHeight = Math.abs(Math.floor(this.screenHeight / (transformY))); //using 'transformY' instead of the real distance prevents fisheye

        //calculate width of the sprite
        const spriteWidth = Math.abs(Math.floor(this.screenHeight / (transformY))) * sprite.scale;
        var drawStartX = Math.floor(-spriteWidth / 2 + spriteScreenX);
        if(drawStartX < 0) drawStartX = 0;
        var drawEndX = spriteWidth / 2 + spriteScreenX;
        if(drawEndX >= this.screenWidth) drawEndX = this.screenWidth - 1;

        //loop through every vertical stripe of the sprite on screen
        for(var stripe = drawStartX; stripe < drawEndX; stripe++)
        {
            const texX = Math.floor((stripe - (-spriteWidth / 2 + spriteScreenX)) * this.texWidth / spriteWidth);
            //the conditions in the if are:
            //1) it's in front of camera plane so you don't see things behind you
            //2) it's on the screen (left)
            //3) it's on the screen (right)
            //4) ZBuffer, with perpendicular distance
            if(transformY > 0 && stripe > 0 && stripe < this.screenWidth && transformY < zBuffer[stripe]) {
                // Ensure that we don't pick a pixel that's outside the tile, which may happen due to rounding with scaled sprites
                let spriteStartX = Math.min((sprite.sprite * this.texWidth) + texX,(sprite.sprite * this.texWidth) + this.texWidth);
                spriteStartX = Math.max(spriteStartX, (sprite.sprite * this.texWidth));

                const startY = -((spriteHeight* sprite.scale)/2) + ((spriteHeight/2) - (spriteHeight * sprite.scale)/2) + (this.screenHeight / 2) + pitch;
                this.drawContext.drawImage(texture, spriteStartX, 0, 1, this.texHeight, stripe, startY, 1, spriteHeight*sprite.scale);
                zBuffer[stripe] = transformY;
            }
        }
    }

    private renderMap(game: Game) {
        const blockSize = 8;

        for (var y = 0; y < game.world.objects.length; y++) {
            for (var x = 0; x < game.world.objects[y].length; x++) {
                const obj = game.world.objects[y][x];
                if ( obj == null) continue;

                var color = this.getBlockColor(obj.texture+1);
                this.drawContext.fillStyle = "hsl(" + color.hue + "," + color.saturation + "%," + color.lightness + "%)";
                if ( obj instanceof Sprite ) {
                    this.drawContext.strokeStyle = '#f77';
                    this.drawCircle((x+0.5)*blockSize, (y+0.5)*blockSize, blockSize/2);
                } else if ( obj instanceof Door && !obj.block) {
                    var neighbour: GameObject;
                    if ( x > 0) {
                        neighbour = game.world.objects[y][x-1];
                    } else {
                        neighbour = game.world.objects[y][x+1];
                    }
                    if ( neighbour == null ) { this.drawContext.fillRect((x+0.25)*blockSize, y*blockSize, blockSize/2, blockSize); }
                    else { this.drawContext.fillRect(x*blockSize, (y+0.25)*blockSize, blockSize, blockSize/2); }
                } else {
                    this.drawContext.fillRect(x*blockSize, y*blockSize, blockSize, blockSize);
                }
                
                if ( game.currentTileX === x && game.currentTileY === y) {
                    this.drawContext.strokeStyle = '#f0f';
                    this.drawContext.strokeRect(x*blockSize, y*blockSize, blockSize, blockSize);
                }
            }
        }

        const playerX = game.player.position.x*blockSize;
        const playerY = game.player.position.y*blockSize;
        this.drawContext.strokeStyle = "#fff";
        this.drawCircle(playerX, playerY, blockSize/2);
        this.drawContext.beginPath();
        this.drawContext.moveTo(playerX, playerY);
        this.drawContext.lineTo(playerX + game.player.direction.x*blockSize, playerY + game.player.direction.y*blockSize);
        this.drawContext.stroke();
    }

    private drawCircle(x: number, y: number, r: number) {
        this.drawContext.beginPath();
        this.drawContext.arc(x, y, r, 0, 2 * Math.PI);
        this.drawContext.stroke(); 
    }

    private getBlockColor(blockId: number): Color {
        var hue = 0;
        var saturation = 100;
        var lightness = 50

        switch(blockId) {
            case 0: // Empty
                saturation = 0;
                lightness = 0;
                break;
            
            default:
                hue = blockId*40;
                break; 
        }

        return new Color(hue, saturation, lightness);
    }
}
