import { Score } from './score';
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DeleteResult } from 'typeorm';
import { Mannschaft, MannschaftRaw } from './mannschaft.entity';

@Injectable()
export class MannschaftService {
    private readonly logger = new Logger(MannschaftService.name);
    
    constructor(
        @InjectRepository(Mannschaft) 
        private readonly mannschaftRepository: Repository<Mannschaft>) {
    }

    async findAll(): Promise<Mannschaft[]> {
        return await this.mannschaftRepository.find();
    }

    async findAllSpiele(): Promise<Mannschaft[]> {
        return await this.mannschaftRepository.find( { relations: ["heimSpiele", "gastSpiele", "heimSpiele.gast", "gastSpiele.heim"]}); 
    }

    async findByKuerzel(kuerzel: string): Promise<Mannschaft> {
        let mannschaft: Mannschaft = new Mannschaft();
        mannschaft.kuerzel = kuerzel;
        let result: Mannschaft[] = await this.mannschaftRepository.find(mannschaft);
        return result[0];
    }

    async getScores(): Promise<Score[]> {
        let mannschaften: Mannschaft[] = await this.findAllSpiele();
        let scores: Score[] = [];
        for (let mannschaft of mannschaften) {
            let siege: number = 0;
            let spiele: number = 0;
            let unentschieden: number = 0;
            let niederlagen: number = 0;
            let heimPunkte: number = 0;
            let heimTorePlus: number = 0;
            let heimToreMinus: number = 0; 
            for (let spiel of mannschaft.heimSpiele) {
                if (!spiel.isGespielt) {
                    continue;
                }
                spiele++;
                if (spiel.isHeimsieg) {
                    siege++;
                }
                if (spiel.isGastsieg) {
                    niederlagen++;
                }
                if (spiel.isUnentschieden) {
                    unentschieden++;
                }
                heimPunkte += spiel.getHeimPunkte();
                heimTorePlus += spiel.heimTore;
                heimToreMinus += spiel.gastTore;
            }
            let gastPunkte: number = 0;
            let gastTorePlus: number = 0;
            let gastToreMinus: number = 0;
            for (let spiel of mannschaft.gastSpiele) {
                if (!spiel.isGespielt) {
                    continue;
                }
                spiele++;
                if (spiel.isGastsieg) {
                    siege++;
                }
                if (spiel.isHeimsieg) {
                    niederlagen++;
                }
                if (spiel.isUnentschieden) {
                    unentschieden++;
                }
                gastPunkte += spiel.getGastPunkte();
                gastTorePlus += spiel.gastTore;
                gastToreMinus += spiel.heimTore;
            }
            let punkte: number = heimPunkte + gastPunkte;
            let torePlus: number = heimTorePlus + gastTorePlus;
            let toreMinus: number = heimToreMinus + gastToreMinus;
            let torDiff: number = torePlus - toreMinus;

            let mannschaftRaw: MannschaftRaw = {
                id: mannschaft.id,
                name: mannschaft.name,
                kuerzel: mannschaft.kuerzel
            }

            let score: Score = new Score();
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
            (a, b) => (a.sortFaktor < b.sortFaktor) ? 1 : -1
        );
        return scores;
    }

    async create(mannschaft: Mannschaft): Promise<Mannschaft> {
        return await this.mannschaftRepository.save(mannschaft);
    }

    async createMannschaften(mannschaften: Mannschaft[]): Promise<Mannschaft[]> {
        return await this.mannschaftRepository.save(mannschaften);
    }

    async delete(id: number): Promise<DeleteResult> {
        return this.mannschaftRepository.delete(id);
    }
}
