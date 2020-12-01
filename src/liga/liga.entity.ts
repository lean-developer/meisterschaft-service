import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable, OneToMany } from 'typeorm';
import { Mannschaft } from 'src/mannschaft/mannschaft.entity';
import { Saison } from 'src/saison/saison.entity';

@Entity('liga')
export class Liga {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ length: 100 })
    name: string;

    @OneToMany(type => Saison, saison => saison.liga)
    saisons: Saison[];
}
