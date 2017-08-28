import { fromPairs } from 'lodash';

// import 'whatwg-fetch';

export class User {
  public static fromSSO(token: string): User {
    return Object.assign(new User(), fromPairs(Array.from(new URLSearchParams(Buffer.from(token, 'base64').toString()))));
  }

  public admin: boolean;
  public avatar_url: string;
  public email: string;
  public external_id: number;
  public moderator: boolean;
  public name: string;
  public username: string;

  // async getKeys() {
  //     const url = new URL('https://api.moecube.com/pay/keys');
  //     url.searchParams.set('user_id', this.email);
  //     const response = await fetch(url.toString());
  //     const keys = await response.json();
  // }
}
