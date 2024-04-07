import { World } from "./world/world";
import { Vector } from "../base/vector";
import { ViewSprite } from "../presentation/rendering/view-sprite";
import { Sprite } from "./world/sprite";
import { Door } from "./world/door";
import { GameObject } from "./world/game-object";

export class RayCastResult {
    public sprites: Array<ViewSprite>;
    public perpWallDist: number;
    public worldObject: GameObject | null;
    public inside: boolean;
    public hit: boolean;
    public side: number;
    public texture: number;
    public direction: Vector;
}

export class RayCast {
    public static ray(originPos: Vector, originDir: Vector, originPlane: Vector, cameraX: number, world: World, stopOnSprite: boolean = false): RayCastResult {
        var rayDirX = originDir.x + originPlane.x * cameraX;
        var rayDirY = originDir.y + originPlane.y * cameraX;

        // Which box of the map we're in
        var mapX = Math.floor(originPos.x);
        var mapY = Math.floor(originPos.y);

        // Length of ray from one X or Y-side to next X or Y-side
        var deltaDistX = Math.abs(1/rayDirX);
        var deltaDistY = Math.abs(1/rayDirY);

        // What direction to step in X or Y-direction (either +1 or -1)
        var stepX;
        var stepY;

        // Length of array from current position to next X or Y-side
        var sideDistX;
        var sideDistY;

        // Calculate step and initial sideDist
        if (rayDirX < 0)
        {
            stepX = -1;
            sideDistX = (originPos.x - mapX) * deltaDistX;
        }
        else
        {
            stepX = 1;
            sideDistX = (mapX + 1 - originPos.x) * deltaDistX;
        }
        if (rayDirY < 0)
        {
            stepY = -1;
            sideDistY = (originPos.y - mapY) * deltaDistY;
        }
        else
        {
            stepY = 1;
            sideDistY = (mapY + 1 - originPos.y) * deltaDistY;
        }

        var hit = 0;
        var wallXOffset = 0;
        var wallYOffset = 0;
        var inside = false

        const sprites: Array<ViewSprite> = [];
        var wallX: number;
        var side: number;
        var texNum: number;
        var worldObject: GameObject;
        
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
            worldObject = world.objects[mapY][mapX];
            if ( worldObject == null) continue;

            if ( worldObject instanceof Sprite ) {
                var viewSprite = new ViewSprite(mapX+0.5, mapY+0.5, worldObject.texture, worldObject.scale);
                if ( sprites.findIndex(v => v.x === viewSprite.x && v.y === viewSprite.y) < 0) {
                    sprites.push(viewSprite);
                }
                if ( stopOnSprite ) {
                    hit = 1;
                }
                continue;
            } else if ( worldObject instanceof Door) {
                texNum = worldObject.texture;
                hit = 1;
                if (side == 1) {
                    wallYOffset = 0.5 * stepY;
                    perpWallDist = (mapY - originPos.y + wallYOffset + (1 - stepY) / 2) / rayDirY;
                    if (sideDistY - (deltaDistY/2) < sideDistX) { //If ray hits offset wall
                        wallX = originPos.x + perpWallDist * rayDirX;
                        wallX -= Math.floor(wallX);
                        if ( wallX <= worldObject.openAmount){
                            hit = 0; //Continue raycast for open/opening doors
                            wallYOffset = 0;
                        }
                    } else {
                        mapX += stepX;
                        side = 0;
                        inside =  true;
                        wallYOffset = 0;
                        texNum = world.objects[mapY][mapX].texture;
                    }
                } else { //side == 0
                    wallXOffset = 0.5 * stepX;
                    perpWallDist  = (mapX - originPos.x + wallXOffset + (1 - stepX) / 2) / rayDirX;
                    if (sideDistX - (deltaDistX/2) < sideDistY) {
                        wallX = originPos.y + perpWallDist * rayDirY;
                        wallX -= Math.floor(wallX);
                        if ( wallX < worldObject.openAmount) {
                            hit = 0;
                            wallXOffset = 0;
                        }
                    } else {
                        mapY += stepY;
                        side = 1;
                        inside = true;
                        wallXOffset = 0;
                        texNum = world.objects[mapY][mapX].texture;
                    }
                }
            } else {
                texNum = worldObject.texture;
                hit = 1;
            }
        }

        var perpWallDist;

        // Calculate distance projected on camera direction (Euclidean distance will give fisheye effect!)
        if (side === 0) perpWallDist = (mapX - originPos.x + wallXOffset + (1 - stepX) / 2) / rayDirX;
        else           perpWallDist = (mapY - originPos.y + wallYOffset + (1 - stepY) / 2) / rayDirY;

            var result = new RayCastResult();
            result.sprites = sprites;
            result.hit = hit === 1;
            result.side = side;
            result.perpWallDist = perpWallDist;
            result.inside = inside;
            result.worldObject = worldObject;
            result.texture = texNum;
            result.direction = new Vector(rayDirX, rayDirY);
            return result;
    }
}