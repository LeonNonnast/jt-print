import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthService {
  private apiKeys: string[] = [
    process.env.NEST_API_KEY,
    process.env.NEST_API_KEY_MASTERS_BREMEN,
  ];
  validateApiKey(apiKey: string) {
    return this.apiKeys.find((apiK) => apiKey === apiK);
  }
}
