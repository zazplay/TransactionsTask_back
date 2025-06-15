export interface IUser {
  _id?: string;
  email: string;
  login: string;
  password: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IUserResponse {
  _id: string;
  email: string;
  login: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IUserLogin {
  email: string;
  password: string;
}

export interface IUserRegister {
  email: string;
  login: string;
  password: string;
}

export interface IJwtPayload {
  sub: string;
  email: string;
  login: string;
}

export interface IAuthResponse {
  access_token: string;
  user: IUserResponse;
}
