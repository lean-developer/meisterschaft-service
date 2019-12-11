import { Injectable } from '@nestjs/common';
import * as jwt from "jsonwebtoken";

@Injectable()
export class SessionService {

    public verifyToken(token: string): boolean {
        try {
            console.log('TOKEN: ', token);
          const verified = jwt.verify(token, process.env.SESSION_SECRET);
          if (!!verified) {
            // console.log('DECODE: ', jwt.decode(token, { complete: true }));
            return true; 
          }
          return false;
        }
        catch (err) {
            console.log(err);
            return false;
        }
    }

}
