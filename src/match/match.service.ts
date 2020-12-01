import { InjectRepository } from '@nestjs/typeorm';
import { Logger, Injectable } from '@nestjs/common';
import { Repository, DeleteResult } from 'typeorm';
import { Match } from './match.entity';
import { Mannschaft } from 'src/mannschaft/mannschaft.entity';

@Injectable()
export class MatchService {
    private readonly logger = new Logger(MatchService.name);

    constructor(
        @InjectRepository(Match)
        private readonly matchRepository: Repository<Match>) {
    }

    async findAll(): Promise<Match[]> {
        const matches = await this.matchRepository
            .createQueryBuilder('match')
            .leftJoinAndSelect('match.heim', 'heim')
            .leftJoinAndSelect('match.gast', 'gast')
            .getMany();
        return matches;
    }

    async find(id: number): Promise<Match> {
        return await this.matchRepository.findOne(id);
    }

    async create(heimMannschaft: Mannschaft, gastMannschaft: Mannschaft, heimTore: number, gastTore: number): Promise<Match> {
        const match: Match = new Match();
        match.heim = heimMannschaft;
        match.gast = gastMannschaft;
        match.heimTore = heimTore;
        match.gastTore = gastTore;
        return await this.matchRepository.save(match);
    }

    async createMatches(matches: Match[]): Promise<Match[]> {
        // this.cacheService.setSpiele(spiele);
        return await this.matchRepository.save(matches);
    }
}
