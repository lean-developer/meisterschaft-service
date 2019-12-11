import { PrimaryColumn, Entity } from "typeorm";

@Entity('gruppe')
export class Gruppe {
    @PrimaryColumn()
    nr: number;
}