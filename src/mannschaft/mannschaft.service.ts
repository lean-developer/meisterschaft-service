import { Score } from './score';
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DeleteResult } from 'typeorm';
import { Mannschaft, MannschaftRaw } from './mannschaft.entity';
import * as cheerio from 'cheerio';
import { MannschaftFifa } from './mannschaftFifa';
const axios = require('axios');

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

    async findAllFifaForConfederation(confederation: string) {
        let mannschaften: Array<MannschaftFifa> = [];
        let mannschaftenFifa: Array<MannschaftFifa> = await this.findAllFifa();
        for (let m of mannschaftenFifa) {
            if (m.confederation === confederation) {
                mannschaften.push(m);
            }
        }
        return mannschaften;
    }

    async findAllFifa() {
        let mannschaftenFifa: Array<MannschaftFifa> = [];
        let html = await axios.get('https://de.fifa.com/fifa-world-ranking/ranking-table/men/');
        const $ = cheerio.load(html.data);
        const elems = $('td.fi-table__td.fi-table__points');
        for (let i = 0; i < elems.length; i++) {
            const td = $(elems[i]).parent();
            const id = $(td).find('div').attr('data-team-id');
            const rank = $(td).find('td.fi-table__td.fi-table__rank').text();
            const points = $(td).find('td.fi-table__td.fi-table__points').text();
            const prevpoints = $(td).find('td.fi-table__td.fi-table__prevpoints').text();
            const rankingmovement = $(td).find('td.fi-table__td.fi-table__rankingmovement').text();
            const confederation = $(td).find('td.fi-table__td.fi-table__confederation.hidden').text();
            const team = $(td).find('span.fi-t__nText').text();
            const teamId = $(td).find('span.fi-t__nTri').text();
            const img = $(td).find('img').attr('src');
            let conf: string = confederation.replace('#', '').replace('#', '');
            
            let mannschaftFifa: MannschaftFifa = new MannschaftFifa();
            mannschaftFifa.id = id;
            mannschaftFifa.rank = rank;
            mannschaftFifa.points = points;
            mannschaftFifa.prevpoints = prevpoints;
            mannschaftFifa.rankingmovement = rankingmovement;  
            mannschaftFifa.confederation = conf;
            mannschaftFifa.team = team;
            mannschaftFifa.teamId = teamId;
            mannschaftFifa.img = img;
            mannschaftenFifa.push(mannschaftFifa);
        }
        return mannschaftenFifa;
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
