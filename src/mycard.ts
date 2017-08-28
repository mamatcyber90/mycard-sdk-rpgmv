import * as crypto from 'crypto';
import * as fs from 'fs';
import * as path from 'path';
import { Device } from './device';

import { RPGMVFileStorage } from './rpgmv-file-storage';
import { RPGMVWebStorage } from './rpgmv-web-storage';
import { Storage } from './storage';
import { User } from './user';

export class MyCard {
  public static appId: string;
  public static user: User;

  // 登录
  public static login() {
    if (!this.user) {
      return (location.href = this.loginUrl());
    }
  }

  // 退出登录
  public static logout() {
    return (location.href = this.logoutUrl());
  }

  // 将是否登录过存为开关
  public static setLoginToSwitch(id: number) {
    $gameSwitches.setValue(id, !!this.user);
  }

  // 将玩家名存为变量
  public static setUsernameToVariable(id: number) {
    $gameVariables.setValue(id, this.user && this.user.username);
  }

  // 将玩家昵称存为变量
  public static setNameToVariable(id: number) {
    $gameVariables.setValue(id, this.user && this.user.name);
  }

  // 将玩家头像存为图片
  public static setAvatarToImage(image: string) {
    const avatar_url = this.user.avatar_url;
    Bitmap.prototype._requestImage = function(url: string) {
      if (url === path.join('img', image) + path.extname(url)) {
        url = avatar_url;
      }

      this._image = Bitmap._reuseImages.length === 0 ? new Image() : Bitmap._reuseImages.pop();

      if (this._decodeAfterRequest && !this._loader) {
        this._loader = ResourceHandler.createLoader(url, this._requestImage.bind(this, url), this._onError.bind(this));
      }

      this._image = new Image();
      this._image.crossOrigin = 'anonymous';
      this._url = url;
      this._loadingState = 'requesting';

      if (!Decrypter.checkImgIgnore(url) && Decrypter.hasEncryptedImages) {
        this._loadingState = 'decrypting';
        Decrypter.decryptImg(url, this);
      } else {
        this._image.src = url;

        this._image.addEventListener('load', (this._loadListener = Bitmap.prototype._onLoad.bind(this)));
        this._image.addEventListener('error', (this._errorListener = this._loader || Bitmap.prototype._onError.bind(this)));
      }
    };
  }

  // 设置玩家用户名存为角色名
  public static setUsernameToActor(id: number) {
    $dataActors[id].name = this.user.username;
  }

  // 设置玩家昵称存为角色名
  public static setNameToActor(id: number) {
    $dataActors[id].name = this.user.name;
  }

  public static async main() {
    const parameters = PluginManager.parameters('MyCard');
    this.appId = parameters.accessKey;

    if (StorageManager.isLocalMode()) {
      if (JSON.parse(parameters.showDevTools)) {
        const { Window } = require('nw.gui');
        Window.get().showDevTools();
      }
      if (JSON.parse(parameters.overrideLocalFilePath)) {
        const localFilePath = path.join(path.dirname(global.process.execPath), 'www');
        if (!fs.existsSync(localFilePath)) {
          fs.mkdirSync(localFilePath);
        }
        global.process.mainModule!.filename = path.join(localFilePath, 'index.html');
      }
      const { App } = require('nw.gui');
      App.addOriginAccessWhitelistEntry('https://accounts.moecube.com', 'file', '', true);
      App.addOriginAccessWhitelistEntry('https://api.moecube.com', 'file', '', true);
    }

    this.handleLogin();

    if (JSON.parse(parameters.login)) {
      this.login();
    }

    // 如果没登录，后面的自动处理就都不需要做了
    if (!this.user) {
      return;
    }

    if (JSON.parse(parameters.precache) && 'serviceWorker' in navigator && location.protocol === 'https:') {
      try {
        await navigator.serviceWorker.register('service-worker.js');
      } catch (error) {
        console.error(error);
      }
    }

    // register Plugin Command
    const _Game_Interpreter_pluginCommand = Game_Interpreter.prototype.pluginCommand;
    Game_Interpreter.prototype.pluginCommand = function(command: string, args: any[]) {
      _Game_Interpreter_pluginCommand.call(this, command, args);
      if (command === 'MyCard') {
        console.log(args);
        const [method, ...params] = args;
        MyCard[method](...params);
      }
    };

    const usernameVariableId = parseInt(parameters.setUsernameToVariable);
    const nameVariableId = parseInt(parameters.setameToVariable);
    const switchId = parseInt(parameters.setLoginToSwitch);
    if (usernameVariableId || nameVariableId || switchId) {
      const _DataManager_createGameObjects = DataManager.createGameObjects;
      DataManager.createGameObjects = () => {
        _DataManager_createGameObjects();
        if (usernameVariableId) {
          this.setUsernameToVariable(usernameVariableId);
        }
        if (nameVariableId) {
          this.setNameToVariable(usernameVariableId);
          $gameVariables.setValue(nameVariableId, this.user.name);
        }
        if (switchId) {
          this.setLoginToSwitch(switchId);
        }
      };
    }

    const usernameActorId = parseInt(parameters.setUsernameToActor);
    const nameActorId = parseInt(parameters.setNameToActor);
    if (usernameActorId || nameActorId) {
      const _DataManager_onLoad = DataManager.onLoad;
      DataManager.onLoad = (object: any) => {
        if (object === $dataActors) {
          if (usernameActorId || nameVariableId) {
            this.setUsernameToActor(usernameActorId);
            this.setNameToActor(nameActorId);
          }
        }
        _DataManager_onLoad.bind(DataManager, object);
      };
    }

    const image = parameters.setAvatarToImage;
    if (image) {
      this.setAvatarToImage(image);
    }

    if (JSON.parse(parameters.storage)) {
      const storage = new Storage(this.appId, this.user, StorageManager.isLocalMode() ? new RPGMVFileStorage() : new RPGMVWebStorage());

      const _StorageManager_save = StorageManager.save.bind(StorageManager);
      StorageManager.save = function(savefileId: number, json: any) {
        _StorageManager_save(savefileId, json);
        storage.sync();
      };

      try {
        await storage.sync();
      } catch (error) {
        console.error(error);
      }
    }
  }

  private static loginUrl(): string {
    let params = new URLSearchParams();
    params.set('return_sso_url', this.jwtUrl());
    const payload = Buffer.from(params.toString()).toString('base64');

    const url = new URL('https://accounts.moecube.com');
    params = url.searchParams;
    params.set('sso', payload);
    params.set('sig', crypto.createHmac('sha256', 'zsZv6LXHDwwtUAGa').update(payload).digest('hex'));
    return url.toString();
  }

  private static jwtUrl(): string {
    const url = new URL('https://api.moecube.com/pay/jwt.php');
    url.searchParams.set('app_id', this.appId);
    url.searchParams.set('device_id', Device.id());
    url.searchParams.set('callback', location.href);
    return url.toString();
  }

  private static logoutUrl(): string {
    const url = new URL('https://accounts.moecube.com/logout');
    url.searchParams.set('redirect', this.loginUrl());
    return url.toString();
  }

  private static handleLogin(token = this.getTokenFromEnv() || this.getTokenFromUrl()): User | undefined {
    // if (token) {
    //     localStorage.setItem('sso', token);
    // } else {
    //     token = localStorage.getItem('sso');
    // }
    if (!token) {
      return;
    }
    this.user = User.fromSSO(token);
    history.replaceState({}, 'page 2', location.pathname);
  }

  private static getTokenFromEnv(): string | undefined {
    return global.process && global.process.env && global.process.env.MyCardSSO;
  }

  private static getTokenFromUrl(): string | undefined | null {
    return new URL(location.href).searchParams.get('sso');
  }
}
