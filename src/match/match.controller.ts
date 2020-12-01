import { Controller, Logger, Get, Post, Query, Body, Param } from '@nestjs/common';
import { Match } from './match.entity';
import { MatchService } from './match.service';

@Controller('match')
export class MatchController {
    private readonly logger = new Logger(MatchController.name);

    constructor(private readonly matchService: MatchService) {}

    @Get()
    async getAll() {
        return this.matchService.findAll();
    }
}