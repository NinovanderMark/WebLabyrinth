import { Game } from "../client/game";
import { Color } from "./color";

export class Renderer {
    screenWidth: number;
	screenHeight: number;
	canvas: HTMLCanvasElement;
	drawContext: CanvasRenderingContext2D;
    mapVisible: boolean;
    textures: HTMLImageElement;

    texWidth = 64;
    texHeight = 64;

    constructor(width: number, height: number, canvasElement: HTMLCanvasElement, textures: HTMLImageElement) {
        this.screenWidth = width;
		this.screenHeight = height;

        this.textures = textures;
		this.canvas = canvasElement;
		this.canvas.width = this.screenWidth;
		this.canvas.height = this.screenHeight;

        let context = this.canvas.getContext('2d');
		if ( context == null) {
			throw new Error("Unable to get 2D rendering context from Canvas");
		}

		this.drawContext = context;
        this.drawContext.imageSmoothingEnabled = false;
    }

    public toggleMap() {
        this.mapVisible = !this.mapVisible;
    }

    public render(game: Game) {
        this.renderGame(game);

        if ( this.mapVisible ) {
            this.renderMap(game);
        }
    }

    private renderGame(game: Game) {
        this.drawContext.fillStyle = "#000";
        this.drawContext.fillRect(0,0,this.screenWidth, this.screenHeight);
    
        for(var x = 0; x < this.screenWidth; x++) {
            var cameraX = 2 * x / this.screenWidth - 1; // X coordinate in camera space
            var rayDirX = game.player.direction.x + game.player.plane.x * cameraX;
            var rayDirY = game.player.direction.y + game.player.plane.y * cameraX;
    
            // Which box of the map we're in
            var mapX = Math.floor(game.player.posX);
            var mapY = Math.floor(game.player.posY);
    
            // Length of array from current position to next X or Y-side
            var sideDistX;
            var sideDistY;
    
            // Length of ray from one X or Y-side to next X or Y-side
            var deltaDistX = Math.abs(1/rayDirX);
            var deltaDistY = Math.abs(1/rayDirY);
            var perpWallDist;
    
            // What direction to step in X or Y-direction (either +1 or -1)
            var stepX;
            var stepY;
    
            var hit = 0;
            var side;
    
            // Calculate step and initial sideDist
            if (rayDirX < 0)
            {
                stepX = -1;
                sideDistX = (game.player.posX - mapX) * deltaDistX;
            }
            else
            {
                stepX = 1;
                sideDistX = (mapX + 1.0 - game.player.posX) * deltaDistX;
            }
            if (rayDirY < 0)
            {
                stepY = -1;
                sideDistY = (game.player.posY - mapY) * deltaDistY;
            }
            else
            {
                stepY = 1;
                sideDistY = (mapY + 1.0 - game.player.posY) * deltaDistY;
            }
    
            // Perform DDA
            while (hit === 0)
            {
                // Jump to next map square, OR in X-direction, OR in Y-direction
                if (sideDistX < sideDistY)
                {
                    sideDistX += deltaDistX;
                    mapX += stepX;
                    side = 0;
                }
                else
                {
                    sideDistY += deltaDistY;
                    mapY += stepY;
                    side = 1;
                }
                // Check if ray has hit a wall
                if (game.worldMap[mapY][mapX] > 0) hit = 1;
            }
    
            // Calculate distance projected on camera direction (Euclidean distance will give fisheye effect!)
            if (side === 0) perpWallDist = (mapX - game.player.posX + (1 - stepX) / 2) / rayDirX;
            else           perpWallDist = (mapY - game.player.posY + (1 - stepY) / 2) / rayDirY;
    
            // Calculate height of line to draw on screen
            var lineHeight = Math.floor(this.screenHeight / perpWallDist);
    
            const pitch = 0;

            // Calculate lowest and highest pixel to fill in current stripe
            const drawStart = -lineHeight / 2 + this.screenHeight / 2 + pitch;
            const drawEnd = lineHeight / 2 + this.screenHeight / 2 + pitch;

            var texNum = game.worldMap[mapY][mapX] - 1;

            //calculate value of wallX
            var wallX; //where exactly the wall was hit
            if (side == 0) wallX = game.player.posY + perpWallDist * rayDirY;
            else           wallX = game.player.posX + perpWallDist * rayDirX;
            wallX -= Math.floor(wallX);

            //x coordinate on the texture
            var texX = wallX * this.texWidth;
            if(side == 0 && rayDirX > 0) texX = this.texWidth - texX;
            if(side == 1 && rayDirY < 0) texX = this.texWidth - texX;

            const textureStartX = Math.floor(texX+(texNum*this.texWidth))
            this.drawContext.drawImage(this.textures, textureStartX, 0, 1, this.texHeight, x, drawStart, 1, drawEnd - drawStart);
            if ( side === 1 ) { 
                this.drawContext.strokeStyle = 'rgba(0,0,0,0.6)';
                this.drawContext.beginPath();
                this.drawContext.moveTo(x, drawStart);
                this.drawContext.lineTo(x, drawEnd);
                this.drawContext.stroke();
            }
            // if ( side === 1 ) { color.lightness = color.lightness / 2; }
            // this.drawContext.strokeStyle = "hsl(" + color.hue + "," + color.saturation + "%," + color.lightness + "%)";
        }
    }

    private renderMap(game: Game) {
        const blockSize = 10;
        this.drawContext.strokeStyle = '#f0f';

        for (var y = 0; y < game.worldMap.length; y++) {
            for (var x = 0; x < game.worldMap[y].length; x++) {
                var color = this.getBlockColor(game.worldMap[y][x]);
                this.drawContext.fillStyle = "hsl(" + color.hue + "," + color.saturation + "%," + color.lightness + "%)";
                this.drawContext.fillRect(x*blockSize, y*blockSize, blockSize, blockSize);
                if ( game.currentTileX === x && game.currentTileY === y) {
                    this.drawContext.strokeRect(x*blockSize, y*blockSize, blockSize, blockSize);
                }
            }
        }

        const playerX = game.player.posX*blockSize;
        const playerY = game.player.posY*blockSize;
        this.drawContext.strokeStyle = "#fff";
        this.drawContext.beginPath();
        this.drawContext.arc(playerX, playerY, blockSize/2, 0, 2 * Math.PI);
        this.drawContext.stroke(); 
        this.drawContext.beginPath();
        this.drawContext.moveTo(playerX, playerY);
        this.drawContext.lineTo(playerX + game.player.direction.x*blockSize, playerY + game.player.direction.y*blockSize);
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
            case 1: // Red
                hue = 0;
                break; 
            case 2: // Green
                hue = 120;
                break; 
            case 3: // Blue
                hue = 240;
                break; 
            case 4: // White
                saturation = 0;
                lightness = 100;
                break; 
            default: // Yellow
                hue = 60;
                break; 
        }

        return new Color(hue, saturation, lightness);
    }
}
