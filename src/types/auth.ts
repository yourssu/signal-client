export interface TokenResponse {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  accessTokenExpiresIn: number;
  refreshTokenExpiresIn: number;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface DevTokenRequest {
  uuid: string;
  accessKey: string;
}
