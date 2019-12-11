import { SharedModule } from './../shared/shared.module';
import { Module } from '@nestjs/common';
import { TurnierService } from './turnier.service';
import { TurnierController } from './turnier.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Turnier } from './turnier.entity';
import { MannschaftModule } from './../mannschaft/mannschaft.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Turnier]),
    MannschaftModule,
    SharedModule 
  ], 
  providers: [TurnierService],
  controllers: [TurnierController]
})
export class TurnierModule {}
