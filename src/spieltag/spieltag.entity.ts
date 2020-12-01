import { Spiel } from './../spiel/spiel.entity';
import { Column, JoinTable, ManyToMany, PrimaryColumn, ManyToOne } from 'typeorm';
import { Entity } from 'typeorm';
import { PrimaryGeneratedColumn } from 'typeorm';
import { Saison } from 'src/saison/saison.entity';
import { Match } from 'src/match/match.entity';

@Entity('spieltag')
export class Spieltag {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    nr: number;

    @Column()
    saisonId: number;

    @ManyToMany(type => Match, { cascade: true })
    @JoinTable()
    matches: Match[];
}