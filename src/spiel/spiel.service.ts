import { Mannschaft } from './../mannschaft/mannschaft.entity';
import { Spiel } from './spiel.entity';
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { MannschaftService } from './../mannschaft/mannschaft.service';

@Injectable()
export class SpielService {
    constructor(
        @InjectRepository(Spiel) 
        private readonly spielRepository: Repository<Spiel>,
        private readonly mannschaftService: MannschaftService) {
    }

    async findAll(): Promise<Spiel[]> {
        return await this.spielRepository.find( { relations: ["heim", "gast"]})
    }

    async create(heimMannschaft: Mannschaft, gastMannschaft: Mannschaft, heimTore: number, gastTore: number): Promise<Spiel> {
        let spiel: Spiel = new Spiel();
        spiel.heim = heimMannschaft;
        spiel.gast = gastMannschaft;
        spiel.heimTore = heimTore;
        spiel.gastTore = gastTore;
        return await this.spielRepository.save(spiel); 
    }

    async createSpielOhneTore(heimMannschaft: Mannschaft, gastMannschaft: Mannschaft): Promise<Spiel> {
        let spiel: Spiel = new Spiel();
        spiel.heim = heimMannschaft;
        spiel.gast = gastMannschaft;
        return await this.spielRepository.save(spiel); 
    }

    async createSpiele(spiele: Spiel[]): Promise<Spiel[]> {
        return await this.spielRepository.save(spiele);
    }

    async updateSpiele(spiele: Spiel[]): Promise<Spiel[]> {
        return await this.spielRepository.save(spiele);
    }

    async deleteSpiele(spiele: Spiel[]): Promise<Spiel[]> {
        return await this.spielRepository.remove(spiele);
    }
}