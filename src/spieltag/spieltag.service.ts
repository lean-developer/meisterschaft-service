import { SpielService } from './../spiel/spiel.service';
import { Spiel } from './../spiel/spiel.entity';
import { MannschaftService } from './../mannschaft/mannschaft.service';
import { Mannschaft } from './../mannschaft/mannschaft.entity';
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DeleteResult } from 'typeorm';
import { Spieltag } from './spieltag.entity';
import { Saison } from 'src/saison/saison.entity';
import { MatchService } from 'src/match/match.service';
import { Match } from 'src/match/match.entity';

@Injectable()
export class SpieltagService {
    private readonly logger = new Logger(SpieltagService.name);

    constructor(
        @InjectRepository(Spieltag) 
        private readonly spieltagRepository: Repository<Spieltag>,
        private readonly mannschaftService: MannschaftService,
        private readonly matchService: MatchService) {
    }

    async findAll(): Promise<Spieltag[]> {
        return await this.spieltagRepository.find();
    }

    async find(id: number): Promise<Spieltag> {
        return await this.spieltagRepository.findOne(id);
    }

    async findByNrAndBySaion(nr: number, saisonId: number): Promise<Spieltag> {
        const spieltag = this.spieltagRepository
            .createQueryBuilder('spieltag')
            .leftJoinAndSelect('spieltag.matches', 'matches')
            .leftJoinAndSelect('matches.heim', 'heim')
            .leftJoinAndSelect('matches.gast', 'gast')
            .where('spieltag.saisonId = :saisonId', { saisonId })
            .andWhere('spieltag.nr = :nr', { nr })
            .getOne();
        return spieltag;
    }

    async findBySaison(saisonId: number): Promise<Spieltag[]> {
        const spieltage = this.spieltagRepository
            .createQueryBuilder('spieltag')
            .leftJoinAndSelect('spieltag.matches', 'matches')
            .leftJoinAndSelect('matches.heim', 'heim')
            .leftJoinAndSelect('matches.gast', 'gast')
            .where('spieltag.saisonId = :saisonId', { saisonId })
            .orderBy('spieltag.nr')
            .getMany();
        return spieltage;
    }
   
    async createSpieltag(saison: Saison, nr: number, matches: Match[]) {
        let spieltag: Spieltag = new Spieltag();
        spieltag.nr = nr;
        spieltag.matches = matches;
        return await this.spieltagRepository.save(spieltag);
    }

    async createRandomSpieltage() {
        let mannschaften: Mannschaft[] = await this.mannschaftService.findAll();
    }

    async createSpieltage(saisonId: number, createSpieltage: CreateSpieltag[]): Promise<Spieltag[]> {
        let savedSpieltage: Spieltag[] = [];
        for (let createSpieltag of createSpieltage) {
            let spieltagMatches: Match[] = [];
            for (let match of createSpieltag.matches) {
                let heim: Mannschaft = await this.mannschaftService.search(saisonId, match.heim);
                let gast: Mannschaft = await this.mannschaftService.search(saisonId, match.gast);
                let heimTore: number = match.heimTore;
                let gastTore: number = match.gastTore;
                console.log('MATCH: ', heim.team, gast.team, heimTore, gastTore);
                // Spiel mit Tore anlegen
                let savedMatch: Match = await this.matchService.create(heim, gast, match.heimTore, match.gastTore);
                spieltagMatches.push(savedMatch);
            }
            let savedMatches: Match[] = await this.matchService.createMatches(spieltagMatches);
            let spieltag: Spieltag = new Spieltag();
            spieltag.nr = createSpieltag.nr;
            spieltag.saisonId = saisonId;
            spieltag.matches = savedMatches;
            savedSpieltage.push(spieltag);
        }
        return await this.spieltagRepository.save(savedSpieltage);
    }

    /*
    async delete(id: number): Promise<DeleteResult> {
        let spieltag: Spieltag = await this.find(id);
        this.logger.log('deleteSpieltag' + id);
        this.logger.log(spieltag);
        if (!!spieltag && !!spieltag.spiele) {
            await this.matchService.deleteSpiele(spieltag.spiele);
        }
        return this.spieltagRepository.delete(id);
    }
    */
}

export interface CreateSpieltag {
    nr: number;
    matches: 
        [
            {
                heim: string;
                gast: string;
                heimTore: number;
                gastTore: number;
            }
        ]
}