# Monorepo Builder

## 1 Overview

该模块旨在为 **monorepo**（单体仓库 `monolithic repository`）环境下的多模块开发提供全面的支持，旨在简化和优化模块的开发流程，目前，`js-module`的生成规则参考 [cesium](https://github.com/CesiumGS/cesium) 的构建方式，并在其基础上进行了优化，其主要功能包括：

1. **Create Module**：可以快速创建新的`module`，具备基本的配置；
2. **Watch**：使用了`gulp.watch`，自动监听模块，当模块的文件修改后，可以自动快速的编译，动态生成入口文件和类型申明文件；
3. **Create Api Doc Dynamic**：自动根据`jsdoc`生成多模块`API`文档，文档的样式直接采用了 [Cesium API](https://cesium.com/learn/cesiumjs/ref-doc/)的样式;
4. **Package**：对`Rollup`进行了封装，创建了`RollupBuilder`用于模块的打包；
5. **Language**：该工具支持 `Typescript`和`Javascript`模块。

## 2 Install

- npm install

  ```sh
  npm i mono-builder -D
  ```

- pnpm install

  ```sh
  pnpm add mono-builder -D
  ```

## 3 Usage

可以通过 [gulpfile](https://www.gulpjs.com.cn/) 来构建，以下是 gulpfile.js 内容。

```js
import { JavascriptBuilder, RollupBuilder, BuilderSettings, PackageMonitor } from 'mono-builder';

// build .d.ts
export const buildTS = async () => {
  const workspaces = ['packages/**']; // modules name
	
  // build batch
  for (const ws of workspaces) {
    await JavascriptBuilder.generateIndex(ws);
    await JavascriptBuilder.generateTypes(ws);
  }
};

// package module
export const build = async () => {
  const workspaces = packageJson.workspaces;

  for (const ws of workspaces) {
    const builder = new RollupBuilder();
    await builder.build(ws, {
      esm: true,
      minify: true,
      sourcemap: false,
      obfuscate: false,
      external: ['cesium'],
      globals: { cesium: 'Cesium' },
    });
  }
};
```

通过 `package.json` 中的 scripts 标签中的命令直接调用

```json
...
"scripts": {
    "build": "gulp build",
    "build-ts": "gulp buildTS"
},
...
```

