import { World } from "./world/world";
import { Vector } from "../base/vector";
import { ViewSprite } from "../presentation/rendering/view-sprite";
import { Sprite } from "./world/sprite";
import { Door } from "./world/door";
import { GameObject } from "./world/game-object";
import { Portal } from "./world/portal";

export class RayCastResult {
    public sprites: Array<ViewSprite>;
    public perpWallDist: number;
    public worldObject: GameObject | null;
    public inside: boolean;
    public hit: boolean;
    public side: number;
    public texture: number;
    public direction: Vector;
    public wallX: number;
}

export class RayCast {
    public static ray(originPos: Vector, originDir: Vector, originPlane: Vector, cameraX: number, world: World, 
        stopOnSprite: boolean = false, startLength: number = 0, maxLength: number = 8192): RayCastResult {
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
                var viewSprite = new ViewSprite((mapX+0.5) - originPos.x, (mapY+0.5) - originPos.y, worldObject.texture, worldObject.scale);
                if ( sprites.findIndex(v => v.x === viewSprite.x && v.y === viewSprite.y) < 0) {
                    sprites.push(viewSprite);
                }
                if ( stopOnSprite ) {
                    hit = 1;
                }
                continue;
            } else if ( worldObject instanceof Door) {
                if ( worldObject.block ) {
                    if ( worldObject.openAmount < 1) {
                        // Distance starts at 1, which is a normal hit, then offset by twice the open amount
                        if (side === 1 && sideDistY - (deltaDistY*(1-worldObject.openAmount*2)) < sideDistX) {
                            hit = 1;
                            texNum = worldObject.texture;
                            wallYOffset = (worldObject.openAmount*2) * stepY;
                        } else if (side === 0 && sideDistX - (deltaDistX*(1-worldObject.openAmount*2)) < sideDistY) {
                            hit = 1;
                            texNum = worldObject.texture;
                            wallXOffset = (worldObject.openAmount*2) * stepX;
                        }
                    }
                } else {
                    texNum = worldObject.texture;
                    hit = 1;

                    if (side == 1) {
                        wallYOffset = 0.5 * stepY;
                        if (sideDistY - (deltaDistY/2) < sideDistX) { //If ray hits offset wall
                            let wallX = originPos.x + this.perpendicularDistance(mapY, originPos.y, wallYOffset, stepY, rayDirY) * rayDirX;
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
                        if (sideDistX - (deltaDistX/2) < sideDistY) {
                            let wallX = originPos.y + this.perpendicularDistance(mapX, originPos.x, wallXOffset, stepX, rayDirX) * rayDirY;
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
                }
            } else {
                texNum = worldObject.texture;
                hit = 1;
            }
        }

        var perpWallDist;
        var wallX;

        // Calculate distance projected on camera direction, and the offset from the start of the wall
        if (side === 0) {
            perpWallDist = this.perpendicularDistance(mapX, originPos.x, wallXOffset, stepX, rayDirX);
            wallX = originPos.y + perpWallDist * rayDirY;
        }
        else {
            perpWallDist = this.perpendicularDistance(mapY, originPos.y, wallYOffset, stepY, rayDirY);
            wallX = originPos.x + perpWallDist * rayDirX;
        }

        wallX = wallX - Math.floor(wallX);

        // If the ray hit a portal, we cast another ray from the hit location relative to the target portal
        if (worldObject instanceof Portal && perpWallDist + startLength < maxLength) {
            const angleOffset = -(worldObject.targetPortal.targetDirection.rotationDiff(worldObject.targetDirection) - 180);
            // Convert hit information into vector in entrance portal space
            let newPos = new Vector(wallX * side, !side ? wallX : 0)
                        .rotateBy(angleOffset)
                        .add(worldObject.targetPortal.targetDirection);
            if (newPos.x < 0) {newPos.x++;}
            if (newPos.y < 0) {newPos.y++;}

            newPos = newPos.add(worldObject.targetPosition);

            const nudge = worldObject.targetPortal.targetDirection.multiply(0.1);
            while ( Math.floor(newPos.x) === Math.floor(worldObject.targetPosition.x) &&
                    Math.floor(newPos.y) === Math.floor(worldObject.targetPosition.y)) {
                    newPos = newPos.add(nudge);
            }

            const newDir = originDir.rotateBy(angleOffset);
            const newPlane = originPlane.rotateBy(angleOffset);

            const castResult = RayCast.ray(newPos, newDir, newPlane, cameraX, world, stopOnSprite, perpWallDist + startLength, maxLength);

            if ( castResult.sprites.length > 0) {
                const offset = new Vector(mapX - originPos.x, mapY - originPos.y)
                        .add(newPos.subtract(worldObject.targetPosition));

                // Reinterpret sprite position for all sprites discovered by the ray               
                castResult.sprites.forEach(s => {
                    const spritePos = new Vector(s.x, s.y)
                        .rotateBy(-angleOffset)
                        .add(offset);

                    sprites.push(new ViewSprite(spritePos.x, spritePos.y, s.sprite, s.scale));
                });
                
                castResult.sprites = sprites;
            }

            return castResult;
        }

        var result = new RayCastResult();
        result.sprites = sprites;
        result.hit = hit === 1;
        result.side = side;
        result.perpWallDist = perpWallDist + startLength;
        result.inside = inside;
        result.worldObject = worldObject;
        result.texture = texNum;
        result.direction = new Vector(rayDirX, rayDirY);
        result.wallX = wallX;
        return result;
    }

    private static perpendicularDistance(map: number, pos: number, wallOffset: number, step: number, rayDir: number) {
        return (map - pos + wallOffset + (1 - step) / 2) / rayDir;
    }
}
