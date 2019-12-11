import { SessionGuard } from './session/session.guard';
import { Module } from '@nestjs/common';
import { SessionService } from './session/session.service';

@Module({
  providers: [
    SessionService, SessionGuard 
  ],
  exports: [
    SessionService, SessionGuard
  ]
})
export class SharedModule {}
