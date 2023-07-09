<h2 align="center">ProxyTestX</h2>

<p align="center">一个使用<a href="https://wails.io">wails</a>写的代理测试工具</p>

## 正在积极开发，请稍后...

## 启动调试

在工程目录中执行 `wails dev` 即可启动。

如果你想在浏览器中调试，请在另一个终端进入 `frontend` 目录，然后执行 `pnpm dev` ，前端开发服务器将在 http://localhost:3333 上运行。

**项目前端默认使用pnpm作为包管理器，如需修改请编辑`wails.json`**

```json
{
  "$schema": "https://wails.io/schemas/config.v2.json",
  "name": "solid-vitesse",
  "outputfilename": "solid-vitesse",
  "frontend:install": "pnpm install", 	//更改为npm或者yarn
  "frontend:build": "pnpm build",		//这行也要同步更改
  "frontend:dev:watcher": "pnpm dev",	//这行也要同步更改
  "frontend:dev:serverUrl": "auto",
  "author": {
    "name": "xxxxxx",
    "email": "xxxxxx@gmail.com"
  }
}
```



## 构建

给你的项目打包，请执行命令： `wails build` 。
