import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";


@Entity('liga')
export class Spiel {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;
}