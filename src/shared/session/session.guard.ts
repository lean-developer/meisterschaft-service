import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { SessionService } from './session.service';

@Injectable()
export class SessionGuard implements CanActivate {
  
  constructor(private sessionService: SessionService) {
  }

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const req = context.switchToHttp().getRequest();
    let idToken = '';
    let authKey: string = req.headers['authorization']
    if (!authKey) {
      return false;
    }
    try {
      let temp = authKey.split(' ');
      if (temp.length === 2) {
        if (temp[0] === 'Bearer') {
          idToken = temp[1];
        }
      }
      console.log('AuthGuard-idToken', idToken);
      const sessionVerified = this.sessionService.verifyToken(idToken);
      console.log('sessionVerified', sessionVerified);
      return sessionVerified;
    }
    catch (err) {
      return false;
    }
  }
}
