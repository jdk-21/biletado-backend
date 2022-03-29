//import {inject} from '@loopback/context';
import {HttpErrors, Request} from '@loopback/rest';
import {AuthenticationStrategy, TokenService} from '@loopback/authentication';
import {securityId, UserProfile} from '@loopback/security';
import axios from 'axios';
import * as crypto from 'crypto';
import base64 from 'base64url';

export class JWTAuthenticationStrategy implements AuthenticationStrategy {
  name = 'jwt';

  async authenticate(request: Request): Promise<UserProfile | undefined> {
    const token: string = this.extractCredentials(request);
    const verifyFunction = crypto.createVerify('RSA-SHA256');
    let response = await axios.get("localhost/auth/realms/biletado").then(
      res => {
        return res
      }
    );
    const PUB_KEY = "-----BEGIN CERTIFICATE-----" + response.data.public_key + "-----END CERTIFICATE-----";


    const jwtHeader = token.split('.')[0];
    const jwtPayload = token.split('.')[1];
    const jwtSignature = token.split('.')[2];
    verifyFunction.write(jwtHeader + '.' + jwtPayload);
    verifyFunction.end();
    const jwtSignatureBase64 = base64.toBase64(jwtSignature);
    const signatureIsValid = verifyFunction.verify(PUB_KEY, jwtSignatureBase64, 'base64');
    if (signatureIsValid) {
      let userProfile: UserProfile;
      userProfile = Object.assign(
        {[securityId]: '', name: ''},
      );
      return userProfile;
    } else {
      throw new HttpErrors.Unauthorized(`Authorization failed.`);
    }
  }

  extractCredentials(request: Request): string {
    if (!request.headers.authorization) {
      throw new HttpErrors.Unauthorized(`Authorization header not found.`);
    }

    // for example: Bearer xxx.yyy.zzz
    const authHeaderValue = request.headers.authorization;

    if (!authHeaderValue.startsWith('Bearer')) {
      throw new HttpErrors.Unauthorized(
        `Authorization header is not of type 'Bearer'.`,
      );
    }

    //split the string into 2 parts: 'Bearer ' and the `xxx.yyy.zzz`
    const parts = authHeaderValue.split(' ');
    if (parts.length !== 2)
      throw new HttpErrors.Unauthorized(
        `Authorization header value has too many parts. It must follow the pattern: 'Bearer xx.yy.zz' where xx.yy.zz is a valid JWT token.`,
      );
    const token = parts[1];

    return token;
  }
}
