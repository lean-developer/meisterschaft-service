import { Column, OneToMany, ManyToOne } from 'typeorm';
import { Entity } from 'typeorm';
import { PrimaryGeneratedColumn } from 'typeorm';
import { Liga } from 'src/liga/liga.entity';
import { Spieltag } from 'src/spieltag/spieltag.entity';

@Entity('saison')
export class Saison {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ length: 100 })
    name: string;

    @Column({ length: 100 })
    desc: string;

    @ManyToOne( type => Liga, liga => liga.saisons)
    liga: Liga;
}