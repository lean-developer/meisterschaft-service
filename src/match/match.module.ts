import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SharedModule } from 'src/shared/shared.module';
import { Match } from './match.entity';
import { MatchController } from './match.controller';
import { MatchService } from './match.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([Match]),
        SharedModule,
    ],
    providers: [
        MatchService,
    ],
    exports: [
        MatchService,
    ],
    controllers: [MatchController],
})
export class MatchModule {}
