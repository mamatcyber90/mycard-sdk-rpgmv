import { User } from './user';
export declare class MyCard {
    static appId: string;
    static user: User;
    static login(): string | undefined;
    static logout(): string;
    static setLoginToSwitch(id: number): void;
    static setUsernameToVariable(id: number): void;
    static setNameToVariable(id: number): void;
    static setAvatarToImage(image: string): void;
    static setUsernameToActor(id: number): void;
    static setNameToActor(id: number): void;
    static main(): Promise<void>;
    private static loginUrl();
    private static jwtUrl();
    private static logoutUrl();
    private static handleLogin(token?);
    private static getTokenFromEnv();
    private static getTokenFromUrl();
}
