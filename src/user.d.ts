export declare class User {
    static fromSSO(token: string): User;
    admin: boolean;
    avatar_url: string;
    email: string;
    external_id: number;
    moderator: boolean;
    name: string;
    username: string;
}
