/// <reference types="node" />
import { LocalFileSystem, SimpleStats } from './storage';
export declare class RPGMVWebStorage implements LocalFileSystem {
    savefileIdFromLocalFilePath(localFilePath: string): number;
    saveFileIdFromWebStorageKey(webStorageKey: string): number;
    readFile(filePath: string): Promise<Buffer | Uint8Array | string>;
    writeFile(file: string, data: Uint8Array): Promise<void>;
    stat(file: string): Promise<SimpleStats>;
    unlink(file: string): Promise<any>;
    utimes(file: string, atime: Date, mtime: Date): Promise<void>;
    readdir(): Promise<string[]>;
}
