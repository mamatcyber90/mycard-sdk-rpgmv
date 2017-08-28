import { LocalFileSystem, SimpleStats } from './storage';

export class RPGMVWebStorage implements LocalFileSystem {
  public savefileIdFromLocalFilePath(localFilePath: string): number {
    switch (localFilePath) {
      case 'config.rpgsave':
        return -1;
      case 'global.rpgsave':
        return 0;
      default:
        const matched = localFilePath.match(/file(\d+).rpgsave/);
        if (!matched) {
          throw new Error('not a valid key');
        }
        return parseInt(matched[1]);
    }
  }

  public saveFileIdFromWebStorageKey(webStorageKey: string) {
    switch (webStorageKey) {
      case 'RPG Config':
        return -1;
      case 'RPG Global':
        return 0;
      default:
        const matched = webStorageKey.match(/RPG File(\d+)/);
        if (!matched) {
          throw new Error('not a valid key');
        }
        return parseInt(matched[1]);
    }
  }

  public async readFile(filePath: string): Promise<Buffer | Uint8Array | string> {
    const data = localStorage.getItem(StorageManager.webStorageKey(this.savefileIdFromLocalFilePath(filePath)));
    if (!data) {
      throw new Error('not exists');
    }
    return data;
  }

  public async writeFile(file: string, data: Uint8Array) {
    localStorage.setItem(StorageManager.webStorageKey(this.savefileIdFromLocalFilePath(file)), data.toString());
    localStorage.setItem('WRAPPED_' + file, Date.now().toString());
  }

  public async stat(file: string): Promise<SimpleStats> {
    const t = localStorage.getItem(file);
    return {
      mtime: t ? new Date(t) : new Date(0)
    };
  }

  public async unlink(file: string): Promise<any> {
    localStorage.removeItem(StorageManager.webStorageKey(this.savefileIdFromLocalFilePath(file)));
    localStorage.removeItem('WRAPPED_' + file);
  }

  public async utimes(file: string, atime: Date, mtime: Date) {
    localStorage.setItem('WRAPPED_' + file, mtime.getTime().toString());
  }

  public async readdir(): Promise<string[]> {
    const result: string[] = [];
    for (let i = -1; i <= DataManager.maxSavefiles(); i++) {
      if (StorageManager.exists(i)) {
        result.push(StorageManager.localFilePath(i));
      }
    }
    return result;
  }
}
