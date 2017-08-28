/// <reference types="node" />
import { User } from './user';
export interface DirectoryStats {
    'filename': string;
    'basename': string;
    'lastmod': string;
    'size': 0;
    'type': 'directory';
}
export interface FileStats {
    'filename': string;
    'basename': string;
    'lastmod': string;
    'size': number;
    'type': 'file';
    'mime': string;
}
export declare type Stats = DirectoryStats | FileStats;
export declare class Storage {
    private local;
    working: boolean;
    private remote;
    constructor(appId: string, user: User, local?: LocalFileSystem | undefined);
    walkdir(dir?: string): AsyncIterable<FileStats>;
    sync(): Promise<void>;
    upload(file: string): Promise<void>;
    download(file: string, time: Date): Promise<void>;
    removeLocal(file: string): Promise<void>;
    removeRemote(file: string): Promise<void>;
}
export interface SimpleStats {
    mtime: Date;
}
export interface LocalFileSystem {
    readFile(file: string): Promise<Buffer | Uint8Array | string>;
    writeFile(file: string, data: Uint8Array): Promise<void>;
    stat(file: string): Promise<SimpleStats | undefined>;
    utimes(file: string, atime: Date, mtime: Date): Promise<void>;
    unlink(file: string): Promise<any>;
    readdir(file: string): Promise<string[]>;
}
