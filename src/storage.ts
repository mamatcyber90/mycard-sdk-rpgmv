import * as path from 'path';
import * as createClient from 'webdav';
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

export type Stats = DirectoryStats | FileStats;

export class Storage {
  public working: boolean;
  private remote;

  constructor(appId: string, user: User, private local?: LocalFileSystem) {
    this.remote = createClient(new URL(appId, 'https://api.mycard.moe/storage/').toString(), user.username, user.external_id.toString());
  }

  // readFile(path: string): Promise<Uint8Array> {
  //     return this.remote.getFileContents(path);
  // }
  //
  // async writeFile(path: string, data: Uint8Array | Buffer | string) {
  //     await this.remote.putFileContents(path, data);
  //     return await this.remote.stat(path);
  // }
  //
  // unlink(path: string): Promise<void> {
  //     return this.remote.deleteFile(path);
  // }

  public async *walkdir(dir = '/'): AsyncIterable<FileStats> {
    const items: Stats[] = await this.remote.getDirectoryContents(dir);
    // console.log('取远端目录', dir, items);
    for (const item of items) {
      if (item.type === 'directory') {
        yield* this.walkdir(item.filename);
      } else {
        yield item;
      }
    }
  }

  public async sync() {
    if (!this.local) {
      throw new Error('no local');
    }

    const processed = new Map<string, boolean>();

    for await (const item of this.walkdir()) {
      const file = path.relative('/', item.filename);
      console.log('remote', file);
      processed.set(file, true);
      const remoteTime = new Date(item.lastmod);
      const stat = await this.local.stat(file);
      if (stat) {
        const localTime = stat.mtime;
        // 远端有，本地有

        if (remoteTime > localTime) {
          // 远端有，本地有，远端>本地，下载
          await this.download(file, remoteTime);
        } else if (remoteTime < localTime) {
          // 远端有，本地有，远端<本地，上传
          await this.upload(file);
        } else {
          // 远端有，本地有，远端=本地，更新记录
          const time = localTime.toString();
          if (localStorage.getItem('FILE_' + file) !== time) {
            localStorage.setItem('FILE_' + file, time);
          }
        }
      } else {
        // 远端有，本地无
        if (localStorage.getItem('FILE_' + file)) {
          // 远端有，本地无，记录有，删除远端
          await this.removeRemote(file);
        } else {
          // 远端有，本地无，记录无，下载
          await this.download(file, remoteTime);
        }
      }
    }

    for (const file of await this.local.readdir('/')) {
      console.log('local', file);
      if (!processed.has(file)) {
        // 远端无，本地有
        if (localStorage.getItem(file)) {
          // 远端无，本地有，记录有，删除本地
          await this.local.unlink(file);
        } else {
          // 远端无，本地有，记录无，上传
          await this.upload(file);
        }
      }
    }
  }

  public async upload(file: string) {
    const remotePath = path.join('/', file);
    console.log('upload', file);
    const data = await this.local!.readFile(file);
    await this.remote.putFileContents(remotePath, data);
    console.log(remotePath);
    const item: FileStats = await this.remote.stat(remotePath);
    console.log(item);
    const time = new Date(item.lastmod);
    this.local!.utimes(file, time, time);
    localStorage.setItem('FILE_' + file, time.toString());
  }

  public async download(file: string, time: Date) {
    const remotePath = path.join('/', file);
    const data = await this.remote!.getFileContents(remotePath);
    await this.local!.writeFile(file, data);
    this.local!.utimes(file, time, time);
    localStorage.setItem('FILE_' + file, time.toString());
  }

  public async removeLocal(file: string) {
    await this.local!.unlink(file);
    localStorage.removeItem('FILE_' + file);
  }

  public async removeRemote(file: string) {
    await this.remote.deleteFile(file);
    localStorage.removeItem('FILE_' + file);
  }
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
