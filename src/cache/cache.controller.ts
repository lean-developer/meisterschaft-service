import { Spieltag } from '../spieltag/spieltag.entity';
import { Spiel } from '../spiel/spiel.entity';
import { Get, Controller, Param, Post } from "@nestjs/common";
import { CacheService } from './cache.service';
import { MannschaftRaw } from "../mannschaft/mannschaft.entity";

@Controller('cache')
export class CacheController {
  constructor(private readonly cacheService: CacheService) {}

  @Get('/spieltag/:nr')
  async getSpieltag(@Param('nr') nr: number): Promise<Spieltag> {
      console.log('getSpieltag ...');
      let response: Spieltag = await this.cacheService.getSpieltag(nr);
      return response;
  }

  @Get('/spiel/:nr')
  async getSpiel(@Param('nr') nr: number): Promise<Spiel> {
      console.log('getSpiel ...');
      let response: Spiel = await this.cacheService.getSpiel(nr.toString());
      return response;
  }

  @Get('/mannschaft/:nr')
  async getMannschaft(@Param('nr') nr: number): Promise<MannschaftRaw> {
      console.log('getMannschaft ...');
      let response: MannschaftRaw = await this.cacheService.getMannschaft(nr.toString());
      return response;
  }

  @Post('/new')
  async createCache() {
      console.log('createCache ...');
      // await this.cacheService.createCache();
  }
}
