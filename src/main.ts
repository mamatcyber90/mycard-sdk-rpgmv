/*:zh
 * @plugindesc 萌卡平台支持
 * @author zh99998 <zh99998＠gmail.com>
 * @preserve
 *
 * @help
 *
 * 插件命令:
 *   MyCard login                   # 登录
 *   MyCard setLoginToSwitch        # 将是否已登录存进开关
 *   MyCard setUsernameToVariable   # 自动将玩家用户名存进变量
 *   MyCard setUsernameToActor      # 将玩家用户名存为角色名
 *   MyCard setNameToVariable       # 自动将玩家昵称存进变量
 *   MyCard setNameToActor          # 将玩家昵称存为角色名
 *   MyCard setAvatarToImage        # 将玩家头像存为图片
 *   MyCard logout                  # 登出
 *
 * 每个插件命令都有个参数相对应，参数为游戏启动时自动调用，命令为手动调用
 * 示例：把参数 setUsernameToActor 设置为 1，意思是游戏启动时自动把用户名存到角色 1 的名字
 *      也可以不设 setUsernameToActor 参数，当有需要时调用执行脚本命令 setUsernameToActor 1
 *      登录和登出都需要跳转页面
 *
 * @param accessKey
 * @desc 授权密钥，请联系 zh99998@gmail.com 获取
 * @require 1
 *
 * @param storage
 * @desc 使用云存档，这个功能有 bug，先不要用
 * 不使用云存档 - false     使用云存档 - true
 * Default: 不使用云存档
 * @default false
 *
 * @param login
 * @desc 在游戏启动运行时自动检查登录，如果未登录会被跳转往登录界面。
 * 不自动登录 - false     自动登录 - true
 * Default: 不自动登录
 * @default false
 *
 * @param setLoginToSwitch
 * @desc 自动将是否已登录存进开关
 * 参数为开关 ID
 *
 * @param setUsernameToVariable
 * @desc 自动将玩家用户名存进变量
 * 参数为变量 ID
 *
 * @param setUsernameToActor
 * @desc 自动将玩家用户名存为角色名
 * 参数为角色 ID
 *
 * @param setNameToVariable
 * @desc 自动将玩家用户名存进变量
 * 参数为变量 ID
 *
 * @param setNameToActor
 * @desc 自动将玩家用户名存为角色名
 * 参数为角色 ID
 *
 * @param setAvatarToImage
 * @desc 自动将玩家头像存为图片
 * @dir img/
 * @type file
 *
 * @param precache
 * @desc 离线缓存，若使用这个功能，需要手工配置 Service Worker。
 * 不启用 - false     启用 - true
 * Default: 不启用
 * @default false
 *
 * @param showDevTools
 * @desc 游戏启动时自动打开调试工具，调试用，正式发布版本请关闭
 * 不启用 - false     启用 - true
 * Default: 不启用
 * @default false
 *
 * @param overrideLocalFilePath
 * @desc 如果要把游戏放到服务器上在线加载，同时又想让 PC 版能存档到本地 save 目录，就开启这个，只对 PC 版有效。
 * 不启用 - false     启用 - true
 * Default: 不启用
 * @default false
 *
 */

import { MyCard } from './mycard';
import './polyfills';

MyCard.main().catch(error => {
  console.error(error);
});
