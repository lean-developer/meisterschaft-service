import { MannschaftRaw } from './../mannschaft/mannschaft.entity';

export class Score {
    mannschaft: MannschaftRaw;
    spiele: number;
    siege: number;
    unentschieden: number;
    niederlagen: number;
    punkte: number;
    heimPunkte: number;
    gastPunkte: number;
    torePlus: number;
    heimTorePlus: number;
    gastTorePlus: number;
    toreMinus: number;
    heimToreMinus: number;
    gastToreMinus: number;
    torDiff: number;
    sortFaktor: number;

    setSortFaktor(): void {
        // Eine Sortier-Zahl anhand der Relevanz der Score-Daten
        let sort: number = 0;

        // 1) Punkte
        sort = this.punkte * 1000;

        // 2) Tordifferenz
        sort += this.torDiff * 10;

        // 3) TorePlus
        sort += this.torePlus;

        this.sortFaktor = sort;
    }
}