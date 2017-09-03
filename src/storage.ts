import * as path from 'path';
import * as createClient from 'webdav';
import { User } from './user';

export interface DirectoryStats {
  filename: string;
  basename: string;
  lastmod: string;
  size: 0;
  type: 'directory';
}

export interface FileStats {
  filename: string;
  basename: string;
  lastmod: string;
  size: number;
  type: 'file';
  mime: string;
}

export type Stats = DirectoryStats | FileStats;

export class Storage {
  public working: boolean;
  public processed = new Map<string, boolean>();
  private remote;

  constructor(appId: string, user: User, private local?: LocalFileSystem) {
    this.remote = createClient(new URL(appId, 'https://api.mycard.moe/storage/').toString(), user.username, user.external_id.toString());
  }

  public getRemoteFileName(item: Stats) {
    return path.relative('/', item.filename);
  }

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
    console.log('sync');
    if (!this.local) {
      throw new Error('no local');
    }
    if (this.working) {
      return;
    }
    try {
      this.working = true;
      for await (const item of this.walkdir()) {
        const file = this.getRemoteFileName(item);
        console.log('remote', file);
        const remoteTime = new Date(item.lastmod);
        try {
          const stat = await this.local.stat(file);
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
        } catch (error) {
          // 远端有，本地无
          if (localStorage.getItem('FILE_' + file)) {
            // 远端有，本地无，记录有，删除远端
            await this.removeRemote(file);
          } else {
            // 远端有，本地无，记录无，下载
            await this.download(file, remoteTime);
          }
        }
        this.processed.set(file, true);
      }

      for (const file of await this.local.readdir('/')) {
        console.log('local', file);
        if (!this.processed.has(file)) {
          // 远端无，本地有
          if (localStorage.getItem('FILE_' + file)) {
            // 远端无，本地有，记录有，删除本地
            await this.removeLocal(file);
          } else {
            // 远端无，本地有，记录无，上传
            await this.upload(file);
          }
          this.processed.set(file, true);
        }
      }
    } finally {
      this.working = false;
    }
  }

  public async upload(file: string) {
    console.log('upload', file);
    const data = await this.local!.readFile(file);
    await this.remote.putFileContents(file, data);
    const item: FileStats = await this.remote.stat(file);
    const time = new Date(item.lastmod);
    await this.local!.utimes(file, time, time);
    localStorage.setItem('FILE_' + file, time.toString());
  }

  public async download(file: string, time: Date) {
    console.log('download', file);
    const data = await this.remote!.getFileContents(file);
    await this.local!.writeFile(file, data);
    await this.local!.utimes(file, time, time);
    localStorage.setItem('FILE_' + file, time.toString());
  }

  public async removeLocal(file: string) {
    console.log('remove local', file);
    await this.local!.unlink(file);
    localStorage.removeItem('FILE_' + file);
  }

  public async removeRemote(file: string) {
    console.log('remove remote', file);
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

  stat(file: string): Promise<SimpleStats>;

  utimes(file: string, atime: Date, mtime: Date): Promise<void>;

  unlink(file: string): Promise<any>;

  readdir(file: string): Promise<string[]>;
}
