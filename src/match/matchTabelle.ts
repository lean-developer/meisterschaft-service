import { Match } from './match.entity';

export class MatchTabelle {
    private match: Match;

    constructor(match: Match) {
        this.match = match;
    }

    get gastTore(): number {
        return this.match.gastTore;
    }

    get heimTore(): number {
        return this.match.heimTore;
    }

    get isGespielt(): boolean {
        return (this.match.heimTore >= 0 && this.match.gastTore >= 0);
    }

    get isHeimsieg(): boolean {
        return (this.match.heimTore > this.match.gastTore);
    }

    get isGastsieg(): boolean {
        return (this.match.gastTore > this.match.heimTore);
    }

    get isUnentschieden(): boolean {
        return (this.match.heimTore === this.match.gastTore);
    }

    getHeimPunkte(): number {
        if (this.match.heimTore > this.match.gastTore) {
            return 3;
        }
        if (this.match.heimTore === this.match.gastTore) {
            return 1;
        }
        return 0;
    }

    getGastPunkte(): number {
        if (this.match.gastTore > this.match.heimTore) {
            return 3;
        }
        if (this.match.gastTore === this.match.heimTore) {
            return 1;
        }
        return 0;
    }
}