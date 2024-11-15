export interface SignUpRequest {
    email: string;
    username: string;
    password: string;
}

export interface ApiResponse {
    success: boolean;
    message: string;
}

export interface LoginRequest {
    username: string;
    password: string;
}
  
export interface JwtAuthenticationResponse {
    accessToken: string;
    tokenType: string;
    userId: string;
    role: string;
}