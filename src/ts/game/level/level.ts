import { Rules } from "./rules";
import { Resources } from "./resources";
import { Room } from "./room";

export class Level {
    public static readonly supportedFormat = 'basic_v1';

    public name: string;
    public author: string;
    public format: string;
    public resources: Resources;
    public room: Room;
    public rules: Rules;

    public static validate(level: Level): Array<string> {
        let warnings = new Array<string>();
        
        if ( level.name == null ) {
            warnings.push('No name was provided for the room');
        }

        if ( level.author == null) {
            warnings.push('No author was provided for the room');
        }

        if ( level.format == null ) {
            warnings.push('No file format identifier was provided');
        } else if ( level.format !== this.supportedFormat) {
            warnings.push(`Provided file format of '${level.format}' does not match expected format of ${this.supportedFormat}`);
        }
        if ( level.resources == null) {
            throw new Error('No resource data was specified');
        }

        if ( level.room == null) {
            throw new Error('No room data was specified');
        }

        warnings = warnings.concat(Resources.validate(level.resources));
        warnings = warnings.concat(Room.validate(level.room));

        if ( level.rules == null) {
            warnings.push('No rules data was specified');
        } else {
            warnings = warnings.concat(Rules.validate(level.rules));
        }

        return warnings;
    }
}