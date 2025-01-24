export class Rules {
    public allowMinimap: boolean;
    public displayScore: boolean;
    public resetScore: boolean;

    public static validate(rules: Rules): Array<string> {
        const warnings = new Array<string>();
        if ( rules.allowMinimap == null) {
            warnings.push(Rules.flagNotSetWarning('allowMinimap'));
        }

        if ( rules.displayScore == null) {
            warnings.push(Rules.flagNotSetWarning('displayScore'));
        }

        if ( rules.resetScore == null) {
            warnings.push(Rules.flagNotSetWarning('resetScore'));
        }

        return warnings;
    }

    private static flagNotSetWarning(flagName: string) : string {
        return `Flag ${flagName} was not set and will be set to the default value`;
    }
}