import { Injectable, Logger } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { MannschaftService } from 'src/mannschaft/mannschaft.service';
import { Mannschaft, MannschaftRaw } from 'src/mannschaft/mannschaft.entity';
import { Score } from './score';
import { MatchTabelle } from 'src/match/matchTabelle';

@Injectable()
export class TabelleService {
    private readonly logger = new Logger(TabelleService.name);

    constructor(
        private readonly mannschaftService: MannschaftService) {}

    async getScores(saisonId: number): Promise<Score[]> {
        return await this.getScoresBySpieltag(saisonId, 0);
    }

    async getScoresBySpieltag(saisonId: number, spieltagNr: number): Promise<Score[]> {
        const mannschaften: Mannschaft[] = await this.mannschaftService.findBySaisonWithMatches(saisonId);
        const scores: Score[] = [];
        for (const m of mannschaften) {
            let siege: number = 0;
            let spiele: number = 0;
            let unentschieden: number = 0;
            let niederlagen: number = 0;
            let heimPunkte: number = 0;
            let heimTorePlus: number = 0;
            let heimToreMinus: number = 0;
            for (const match of m.heimMatches) {
                if (spieltagNr > 0 && spiele >= spieltagNr) {
                    break;
                }
                const matchTab = new MatchTabelle(match);
                if (!matchTab.isGespielt) {
                    continue;
                }
                spiele++;
                if (matchTab.isHeimsieg) {
                    siege++;
                }
                if (matchTab.isGastsieg) {
                    niederlagen++;
                }
                if (matchTab.isUnentschieden) {
                    unentschieden++;
                }
                heimPunkte += matchTab.getHeimPunkte();
                heimTorePlus += matchTab.heimTore;
                heimToreMinus += matchTab.gastTore;
            }
            let gastPunkte: number = 0;
            let gastTorePlus: number = 0;
            let gastToreMinus: number = 0;
            for (const match of m.gastMatches) {
                if (spieltagNr > 0 && spiele >= spieltagNr) {
                    break;
                }
                const matchTab = new MatchTabelle(match);
                if (!matchTab.isGespielt) {
                    continue;
                }
                spiele++;
                if (matchTab.isGastsieg) {
                    siege++;
                }
                if (matchTab.isHeimsieg) {
                    niederlagen++;
                }
                if (matchTab.isUnentschieden) {
                    unentschieden++;
                }
                gastPunkte += matchTab.getGastPunkte();
                gastTorePlus += matchTab.gastTore;
                gastToreMinus += matchTab.heimTore;
            }
            const punkte: number = heimPunkte + gastPunkte;
            const torePlus: number = heimTorePlus + gastTorePlus;
            const toreMinus: number = heimToreMinus + gastToreMinus;
            const torDiff: number = torePlus - toreMinus;

            const mannschaftRaw: MannschaftRaw = {
                id: m.id,
                name: m.name,
                kuerzel: m.kuerzel,
            };

            const score: Score = new Score();
            score.mannschaft = mannschaftRaw;
            score.spiele = spiele;
            score.siege = siege;
            score.unentschieden = unentschieden;
            score.niederlagen = niederlagen;
            score.punkte = punkte;
            score.heimPunkte = heimPunkte;
            score.gastPunkte = gastPunkte;
            score.torePlus = torePlus;
            score.heimTorePlus = heimTorePlus;
            score.gastTorePlus = gastTorePlus;
            score.toreMinus = toreMinus;
            score.heimToreMinus = heimToreMinus;
            score.gastToreMinus = gastToreMinus;
            score.torDiff = torDiff;
            score.setSortFaktor();
            scores.push(score);
        }
        scores.sort(
            (a, b) => (a.sortFaktor < b.sortFaktor) ? 1 : -1,
        );
        return scores;
    }

}
