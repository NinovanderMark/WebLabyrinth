export class Resources {
    public textures: string;
    public sprites: string;

    public static validate(resources: Resources): Array<string> {
        const warnings = new Array<string>();
        if ( resources.textures == null || resources.textures.length < 1) {
            throw new Error(`Room does not reference a texture file`);
        }

        if ( resources.sprites == null || resources.sprites.length < 1) {
            throw new Error(`Room does not reference a sprites file`);
        }
        return warnings;
    }
}