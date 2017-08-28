/// <reference types="node" />
import { LocalFileSystem, SimpleStats } from './storage';
export declare class RPGMVFileStorage implements LocalFileSystem {
    readFile(file: string): Promise<string | Buffer | Uint8Array>;
    writeFile(file: string, data: Uint8Array): Promise<void>;
    stat(file: string): Promise<SimpleStats>;
    unlink(file: string): Promise<any>;
    utimes(file: string, atime: Date, mtime: Date): any;
    readdir(file: string): Promise<string[]>;
}
