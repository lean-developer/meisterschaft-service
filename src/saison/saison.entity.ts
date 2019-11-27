import { Column } from 'typeorm';
import { Entity } from 'typeorm';
import { PrimaryGeneratedColumn } from 'typeorm';

@Entity('saison')
export class Saison {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;
}