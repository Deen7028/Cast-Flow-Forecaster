export interface IUser {
    id: number;
    username: string;
    fullName: string;
    role: string;
}

export interface ILoginResponse {
    user: IUser;
    token: string;
}
