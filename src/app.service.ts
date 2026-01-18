import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  /**
   * returns text
   *
   * @return {*}  {string}
   * @memberof AppService
   */
  getServerIsRunning(): string {
    return 'Server is running!';
  }
}
