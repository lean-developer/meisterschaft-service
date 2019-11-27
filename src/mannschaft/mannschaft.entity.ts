import { Column, OneToMany } from 'typeorm';
import { Entity } from 'typeorm';
import { PrimaryGeneratedColumn } from 'typeorm';
import { Spiel } from 'src/spiel/spiel.entity';

@Entity('mannschaft')
export class Mannschaft {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ length: 100 })
    name: string;

    @Column({ length: 5 })
    kuerzel: string;

    @OneToMany(type => Spiel, spiel => spiel.heim)
    heimSpiele: Spiel[];

    @OneToMany(type => Spiel, spiel => spiel.gast)
    gastSpiele: Spiel[];
}

export interface MannschaftRaw {
    id: number;
    name: string;
    kuerzel: string;
}