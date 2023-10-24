import { Expose } from 'class-transformer';

export class UserTokenDto {
  @Expose()
  access_token: string;
}
