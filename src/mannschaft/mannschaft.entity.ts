import { Column, OneToMany, ManyToMany, JoinTable, ManyToOne } from 'typeorm';
import { Entity } from 'typeorm';
import { PrimaryGeneratedColumn } from 'typeorm';
import { Match } from 'src/match/match.entity';

@Entity('mannschaft')
export class Mannschaft {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    uid: number;

    @Column({ length: 100 })
    name: string;

    @Column({ length: 5 })
    kuerzel: string;

    @Column({ length: 100 })
    img: string;

    @Column({length: 100})
    team: string;

    @Column({ length: 100})
    country: string;

    @Column()
    saisonId: number;

    @OneToMany(type => Match, match => match.heim)
    heimMatches: Match[];

    @OneToMany(type => Match, match => match.gast)
    gastMatches: Match[];
}

export interface MannschaftRaw {
    id: number;
    name: string;
    kuerzel: string;
}