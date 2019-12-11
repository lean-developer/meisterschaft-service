import { Entity, PrimaryColumn, Column } from "typeorm";
import { Gruppe } from "./gruppe.entity";

@Entity('turnier')
export class Turnier {
    @PrimaryColumn()
    nr: number;

    @Column()
    name: string;

    gruppen: Array<Gruppe>;
}