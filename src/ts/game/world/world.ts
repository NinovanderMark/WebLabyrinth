import { GameObject } from "./game-object";
import { DynamicObject } from "./dynamic-object";
import { Door } from "./door";
import { Sprite } from "./sprite";
import { Level } from "../level/level";
import { Room } from "../level/room";
import { Pickup } from "./pickup";
import { Portal } from "./portal";
import { Vector } from "../../base/vector";

export class World {
    public name: string;
    public author: string;
    public objects: Array<Array<GameObject | null>>;
    public items: Map<string, Pickup>;

    public textures: URL;
    public sprites: URL;

	public ceiling: string;
	public floor: string;

    private dynamicObjects: Array<DynamicObject>;

    private constructor() {
        this.objects = [];
        this.dynamicObjects = [];
        this.items = new Map<string, Pickup>();
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

    public static from(level: Level, url: URL): World {
        let pathParts = url.pathname.split('/');
        pathParts.splice(pathParts.length-1, 1);
        const basePath = pathParts.join('/');

		let world = new World();
        world.name = level.name;
        world.author = level.author;
        world.textures = new URL(`${basePath}/${level.resources.textures}`, url.origin);
        world.sprites = new URL(`${basePath}/${level.resources.sprites}`, url.origin);

        let room = level.room;
        world.ceiling = room.ceiling != null ? room.ceiling : '#005580';
        world.floor = room.floor != null ? room.floor : '#2b4000';

        let portals: Map<number, { portal: Portal, target: number} > = new Map<number, { portal: Portal, target: number}>();
		for (let y = 0; y < room.tiles.length; y++) {
			let row: Array<GameObject> = [];

			for (let x = 0; x < room.tiles[y].length; x++) {
				const tile = room.tiles[y][x]-1;
				if ( tile < 0) {
                    row.push(null);
                } else {
                    const obj = room.objects[tile];
                    switch (obj.type) {
                        case "block":
                            row.push(new GameObject(obj["texture"] as number));
                            break;

                        case "portal":
                            const dir = obj["targetDirection"] as Array<number>;
                            const target = obj["targetPortal"] as number;
                            const portal = new Portal(new Vector(x, y), new Vector(dir[0], dir[1]));
                            row.push(portal);
                            portals.set(tile+1, { portal: portal, target: target });
                            break;

                        case "door":
                            const block = obj["block"] as boolean;
                            const unlockTexture = obj["texture-unlocked"] as number | null;
                            row.push(new Door(obj["texture"] as number, block ?? false, obj["key"] as string, unlockTexture));
                            break;

                        case "sprite":
                            row.push(new Sprite(obj["texture"] as number));
                            break;

                        case "item":
                            const scale = obj["scale"] as number;
                            const amount = obj["amount"] as number;
                            const name = obj["name"];
                            const pickup = new Pickup(obj["texture"] as number, name, amount ?? 1, scale ?? 1);
                            row.push(pickup);
                            world.items.set(name, pickup);
                            break;

                        default:
                            throw new Error(`Unknown type '${obj.type}' for object ${tile} at ${x},${y}`);
                    }
                }
			}

            world.objects.push(row);
		}

        // Connect related portals
        portals.forEach((v,k) => {
            const target = portals.get(v.target);
            if ( target == null) {
                throw new Error(`Unable to find Portal with id ${v.target}`);
            }
            
            v.portal.connect(target.portal);
        })

        world.cacheDynamicObjects();
        return world;
	}
}