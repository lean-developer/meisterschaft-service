import { Spiel } from './../spiel/spiel.entity';
import { Column, JoinTable, ManyToMany, PrimaryColumn } from 'typeorm';
import { Entity } from 'typeorm';
import { PrimaryGeneratedColumn } from 'typeorm';

@Entity('spieltag')
export class Spieltag {
    @PrimaryColumn()
    nr: number;

    @ManyToMany(type => Spiel, { cascade: true })
    @JoinTable()
    spiele: Spiel[];
}