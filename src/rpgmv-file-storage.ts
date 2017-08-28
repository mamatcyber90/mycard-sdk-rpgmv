import { promisify } from 'es6-promisify';
import * as fs from 'fs';
import * as path from 'path';
import { LocalFileSystem, SimpleStats } from './storage';

export class RPGMVFileStorage implements LocalFileSystem {
  public readFile(file: string): Promise<string | Buffer | Uint8Array> {
    return promisify(fs.readFile)(path.join(StorageManager.localFileDirectoryPath(), file));
  }

  public writeFile(file: string, data: Uint8Array): Promise<void> {
    return promisify(fs.writeFile)(path.join(StorageManager.localFileDirectoryPath(), file), data);
  }

  public stat(file: string): Promise<SimpleStats> {
    return promisify(fs.stat)(path.join(StorageManager.localFileDirectoryPath(), file));
  }

  public unlink(file: string): Promise<any> {
    return promisify(fs.unlink)(path.join(StorageManager.localFileDirectoryPath(), file));
  }

  public utimes(file: string, atime: Date, mtime: Date) {
    return promisify(fs.utimes)(path.join(StorageManager.localFileDirectoryPath(), file), atime, mtime);
  }

  public async readdir(file: string): Promise<string[]> {
    const result: string[] = [];
    for (let i = -1; i <= DataManager.maxSavefiles(); i++) {
      if (StorageManager.exists(i)) {
        result.push(path.relative(StorageManager.localFileDirectoryPath(), StorageManager.localFilePath(i)));
      }
    }
    return result;
  }
}
