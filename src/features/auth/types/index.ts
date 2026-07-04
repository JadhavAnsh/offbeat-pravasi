export type AuthUser = {
  id: string;
  email: string;
  fullName?: string | null;
  isAdmin?: boolean;
  organizerStatus?: string;
};

export type LoginInput = {
  email: string;
  password: string;
};

export type SignUpInput = LoginInput & {
  fullName: string;
};

export type VerifyOtpInput = {
  email: string;
  otp: string;
};

export type TokenPair = {
  accessToken: string;
  refreshToken: string;
};

export type AuthSession = TokenPair & {
  user: AuthUser;
};
