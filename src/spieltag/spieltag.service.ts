import { SpielService } from './../spiel/spiel.service';
import { Spiel } from './../spiel/spiel.entity';
import { MannschaftService } from './../mannschaft/mannschaft.service';
import { Mannschaft } from './../mannschaft/mannschaft.entity';
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DeleteResult } from 'typeorm';
import { Spieltag } from './spieltag.entity';

@Injectable()
export class SpieltagService {
    private readonly logger = new Logger(SpieltagService.name);

    constructor(
        @InjectRepository(Spieltag) 
        private readonly spieltagRepository: Repository<Spieltag>,
        private readonly mannschaftService: MannschaftService,
        private readonly spielService: SpielService) {
    }

    async findAll(): Promise<Spieltag[]> {
        return await this.spieltagRepository.find({ relations: ["spiele", "spiele.heim", "spiele.gast"]});
    }

    async find(nr: number): Promise<Spieltag> {
        return await this.spieltagRepository.findOne(nr, { relations: ["spiele", "spiele.heim", "spiele.gast"]});
    }

    async createSpieltag(nr: number, spiele: Spiel[]) {
        let spieltag: Spieltag = new Spieltag();
        spieltag.nr = nr;
        spieltag.spiele = spiele;
        return await this.spieltagRepository.save(spieltag);
    }

    async createRandomSpieltage() {
        let mannschaften: Mannschaft[] = await this.mannschaftService.findAll();
    }

    async createSpieltage(createSpieltage: CreateSpieltag[]): Promise<Spieltag[]> {
        let savedSpieltage: Spieltag[] = [];
        for (let createSpieltag of createSpieltage) {
            let spieltagSpiele: Spiel[] = [];
            for (let spiel of createSpieltag.spiele) {
                let heim: Mannschaft = await this.mannschaftService.findByKuerzel(spiel.heim);
                let gast: Mannschaft = await this.mannschaftService.findByKuerzel(spiel.gast);
                let heimTore: number = spiel.heimTore;
                let gastTore: number = spiel.gastTore;
                if (heimTore && gastTore) {
                    // Spiel mit Tore anlegen
                    let savedSpiel: Spiel = await this.spielService.create(heim, gast, spiel.heimTore, spiel.gastTore);
                    spieltagSpiele.push(savedSpiel);
                }
                else {
                    // Spiel ohne Tore (d.h. noch nicht gespielt) anlegen
                    let savedSpiel: Spiel = await this.spielService.create(heim, gast, -1, -1);
                    spieltagSpiele.push(savedSpiel);
                }
            }
            let savedSpiele: Spiel[] = await this.spielService.createSpiele(spieltagSpiele);
            let spieltag: Spieltag = new Spieltag();
            spieltag.nr = createSpieltag.nr;
            spieltag.spiele = savedSpiele;
            savedSpieltage.push(spieltag);
        }
        return await this.spieltagRepository.save(savedSpieltage);
    }

    async delete(id: number): Promise<DeleteResult> {
        let spieltag: Spieltag = await this.find(id);
        this.logger.log('deleteSpieltag' + id);
        this.logger.log(spieltag);
        if (!!spieltag && !!spieltag.spiele) {
            await this.spielService.deleteSpiele(spieltag.spiele);
        }
        return this.spieltagRepository.delete(id);
    }
}

export interface CreateSpieltag {
    nr: number;
    spiele: 
        [
            {
                heim: string;
                gast: string;
                heimTore?: number;
                gastTore?: number;
            }
        ]
}