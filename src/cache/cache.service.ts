import { HashFieldValue } from './../redis/redis.service';
import { MannschaftRaw } from '../mannschaft/mannschaft.entity';
import { RedisService } from './../redis/redis.service';
import { Injectable } from "@nestjs/common";
import { Mannschaft } from '../mannschaft/mannschaft.entity';
import { Spiel } from '../spiel/spiel.entity';
import { Spieltag } from '../spieltag/spieltag.entity';

@Injectable()
export class CacheService {

  constructor(
    private readonly redisService: RedisService) {
  }

  /*
  async createCache() {
    // Mannschaften
    let mannschaften: Array<Mannschaft> = await this.mannschaftService.findAll();
    this.setMannschaften(mannschaften);

    // Spiele
    let spiele: Array<Spiel> = await this.spielService.findAll();
    this.setSpiele(spiele);

    // Spieltage
    let spieltage: Array<Spieltag> = await this.spieltagService.findAll();
    this.setSpieltage(spieltage);
  }
  */

  public setMannschaften(mannschaften: Array<Mannschaft>): void {
    for(let mannschaft of mannschaften) {
      let raw: MannschaftRaw = mannschaft;
      let hashKey: string = 'mannschaft:' + raw.id;
      let fieldValueId: HashFieldValue = { field: 'id', value: raw.id.toString() };
      let fieldValueName: HashFieldValue = { field: 'name', value: raw.name };
      let fieldValueKuerzel: HashFieldValue = { field: 'kuerzel', value: raw.kuerzel };
      let fieldValues: Array<HashFieldValue> = [];
      fieldValues.push(fieldValueId);
      fieldValues.push(fieldValueName);
      fieldValues.push(fieldValueKuerzel);
      this.redisService.setHash(hashKey, fieldValues);
    }
  }

  public setSpieltage(spieltage: Array<Spieltag>): void {
    for (let spieltag of spieltage) {
      let key: string = 'spieltag:' + spieltag.nr;
      let members: Array<string> = [];
      for (let spiel of spieltag.matches) {
        let member: string = 'spiel:' + spiel.id;
        members.push(member);
      }
      this.redisService.setList(key, members);
    }
  }

  public setSpiel(spiel: Spiel): void {
    let spiele: Array<Spiel> = [];
    spiele.push(spiel);
    this.setSpiele(spiele);
  }

  public setSpiele(spiele: Array<Spiel>): void { 
    for (let spiel of spiele) {
      let hashKey: string = 'spiel:' + spiel.id;
      let fieldValueId: HashFieldValue = { field: 'id', value: spiel.id.toString() };
      let fieldValueHeimTore: HashFieldValue = { field: 'heimTore', value: spiel.heimTore.toString() };
      let fieldValueGastTore: HashFieldValue = { field: 'gastTore', value: spiel.gastTore.toString() };
      let fieldValueHeim: HashFieldValue = { field: 'heim', value: 'mannschaft:' + spiel.heimId.toString() };
      let fieldValueGast: HashFieldValue = { field: 'gast', value: 'mannschaft:' + spiel.gastId.toString() };
      let fieldValues: Array<HashFieldValue> = [];
      fieldValues.push(fieldValueId);
      fieldValues.push(fieldValueHeimTore);
      fieldValues.push(fieldValueGastTore);
      fieldValues.push(fieldValueHeim);
      fieldValues.push(fieldValueGast);
      this.redisService.setHash(hashKey, fieldValues);
    }
  }

  async getSpieltag(nr: number): Promise<Spieltag> {
    let key: string = 'spieltag:' + nr.toString();
    let spiele: Array<Spiel> = [];
    let response: string = await this.redisService.getList(key);
    let keys: Array<string> = response.toString().split(',');
    for (let key of keys) {
        let spiel: Spiel = await this.getSpiel(key);
        spiele.push(spiel);
    }
    let spieltag: Spieltag = new Spieltag();
    spieltag.nr = nr;
    // spieltag.matches = spiele;
    return spieltag;
  }
  
  async getMannschaft(nr: string): Promise<Mannschaft> {
    let key: string = nr;
    if (!nr.startsWith('mannschaft')) {
      key = 'mannschaft:' + nr;
    }
    let res: string = await this.redisService.getHash(key);
    let resJson: string = JSON.stringify(res);
    let mannschaft: Mannschaft = JSON.parse(resJson); 
    return mannschaft;
  }

  async getSpiel(nr: string): Promise<Spiel> {
    let key: string = nr;
    if (!nr.startsWith('spiel')) {
      key = 'spiel:' + nr;
    }
    let res: string = await this.redisService.getHash(key);
    if (!res) {
      return new Spiel();
    }
    let resJson: string = JSON.stringify(res);
    let spielRaw: SpielRaw = JSON.parse(resJson);
    let heim: Mannschaft = await this.getMannschaft(spielRaw.heim);
    let gast: Mannschaft = await this.getMannschaft(spielRaw.gast);
    let spiel: Spiel = new Spiel();
    spiel.id = spielRaw.id;
    spiel.heimTore = spielRaw.heimTore;
    spiel.gastTore = spielRaw.gastTore;
    spiel.heimId = heim.id;
    spiel.gastId = gast.id;
    return spiel;
  }
}

export interface SpielRaw {
  id: number;
  heimTore: number;
  gastTore: number;
  heim: string;
  gast: string;
}