declare const Bitmap: any;
declare const DataManager: any;
declare const $dataActors: any;
declare const Game_Interpreter: any;
declare const PluginManager: any;
declare const $gameVariables: any;
declare const $gameSwitches: any;
declare const ResourceHandler: any;
declare const Decrypter: any;
declare const StorageManager: any;
declare const Scene_Title: any;
declare const ConfigManager: any;
declare const SceneManager: any;
declare namespace NodeJS {
  interface Global {
    require: NodeRequireFunction;
  }
}

interface ObjectConstructor {
  getOwnPropertyDescriptors(o: any): PropertyDescriptorMap;
}

interface String {
  format(...args): string;
}
