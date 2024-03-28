import { WorldObject } from "./world-object";
import { DynamicObject } from "./dynamic-object";
import { Door } from "./door";
import { Sprite } from "./sprite";

export class World {
    public objects: Array<Array<WorldObject | null>>;

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

    public static from(json: Array<Array<number>>, textureLimit: number): World {
		let world = new World();
		for (let x = 0; x < json.length; x++) {
			let row: Array<WorldObject> = [];

			for (let y = 0; y < json[x].length; y++) {
				const tile = json[x][y]-1;
				if ( tile < 0) {
                    row.push(null);
                } else if (tile < textureLimit ) {
					row.push(new WorldObject(tile));
				} else if ( tile < textureLimit*2) {
                    row.push(new Sprite(tile - textureLimit));
                } else if ( tile < textureLimit*3) {
					row.push(new Door(tile - (textureLimit*2)));
				} else if ( tile < textureLimit*4) {
                    row.push(new Door(tile - (textureLimit*3), true));
                } else {
                    throw new Error(`Invalid tile number of ${tile+textureLimit} at ${x},${y}`);
                }
			}

            world.objects.push(row);
		}

        world.cacheDynamicObjects();
        return world;
	}
}