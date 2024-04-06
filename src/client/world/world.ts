import { GameObject } from "./game-object";
import { DynamicObject } from "./dynamic-object";
import { Door } from "./door";
import { Sprite } from "./sprite";
import { Room } from "../room/room";
import { Pickup } from "./pickup";

export class World {
    public objects: Array<Array<GameObject | null>>;
    public textures: URL;
    public sprites: URL;

	public ceiling = 5;
	public floor = 2;

    private dynamicObjects: Array<DynamicObject>;

    private constructor() {
        this.objects = [];
        this.dynamicObjects = [];
    }

    public step(delta: number) {
        this.dynamicObjects.forEach(o => o.step(delta));
    }

    public cacheDynamicObjects() {
        this.dynamicObjects.splice(0);
        for (let x = 0; x < this.objects.length; x++) {
            for (let y = 0; y < this.objects[x].length; y++) {
                const obj = this.objects[x][y];
                if ( obj instanceof Door ) {
                    this.dynamicObjects.push(obj);
                }
            }
        }
    }

    public static from(room: Room, url: URL): World {
        let pathParts = url.pathname.split('/');
        pathParts.splice(pathParts.length-1, 1);
        const basePath = pathParts.join('/');

		let world = new World();
        world.textures = new URL(`${basePath}/${room.textures}`, url.origin);
        world.sprites = new URL(`${basePath}/${room.sprites}`, url.origin);

		for (let x = 0; x < room.tiles.length; x++) {
			let row: Array<GameObject> = [];

			for (let y = 0; y < room.tiles[x].length; y++) {
				const tile = room.tiles[x][y]-1;
				if ( tile < 0) {
                    row.push(null);
                } else {
                    const obj = room.objects[tile];
                    switch (obj.type) {
                        case "block":
                            row.push(new GameObject(obj["texture"] as number));
                            break;

                        case "door":
                            row.push(new Door(obj["texture"] as number, false));
                            break;

                        case "sprite":
                            row.push(new Sprite(obj["texture"] as number));
                            break;

                        case "item":
                            const scale = obj["scale"] as number;
                            row.push(new Pickup(obj["texture"] as number, obj["name"], scale ?? 1));
                            break;

                        default:
                            throw new Error(`Unknown type '${obj.type}' for object ${tile} at ${y},${x}`);
                    }
                }
			}

            world.objects.push(row);
		}

        world.cacheDynamicObjects();
        return world;
	}
}