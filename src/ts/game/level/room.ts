import { RoomObject } from "./room-object";

export class Room {
    public ceiling: string;
    public floor: string;
    public player: Array<number>;
    public objects: Array<RoomObject>;
    public tiles: Array<Array<number>>;

    public static validate(room: Room): Array<string> {
        const warnings = new Array<string>();

        if ( room.ceiling == null ) {
            warnings.push('Ceiling was not specified, using default color');
        }

        if ( room.floor == null) {
            warnings.push('Floor was not specified, using default color');
        }

        if ( room.player == null) {
            throw new Error('Room contains no player starting position and orientation');
        }

        if ( room.player.length !== 3) {
            throw new Error(`Room player position and orientation expects 3 arguments, found ${room.player.length}`);
        }

        if ( room.objects == null || room.objects.length < 1) {
            throw new Error(`Room contains no objects`);
        }

        if (room.tiles == null || room.tiles.length < 1) {
            throw new Error(`Room contains no tiles`);
        }

        var tilesWidth = room.tiles[0].length;
        for (let y = 0; y < room.tiles.length; y++) {
            if ( room.tiles[y].length != tilesWidth) {
                console.debug('Faulty row looks like', room.tiles[y]);
                throw new Error(`Irregular row length for row ${y}, expected: ${tilesWidth} actual: ${room.tiles[y].length}`);
            }

            for (let x = 0; x < room.tiles[y].length; x++) {
                if ( room.tiles[y][x] < 0 || room.tiles[y][x] > room.objects.length) {
                    throw new Error(`Tile reference out of bounds at coordinates ${x},${y}. Should be between 0 and ${room.objects.length}`);
                }
            }
        }

        return warnings;
    }
}
