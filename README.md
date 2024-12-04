# Module Builder

## 1 Overview

该模块旨在为 **monorepo**（单体仓库 `monolithic repository`）环境下的多模块开发提供全面的支持，旨在简化和优化模块的开发流程，目前，`js-module`的生成规则参考 [cesium](https://github.com/CesiumGS/cesium) 的构建方式，并在其基础上进行了优化，其主要功能包括：

1. **创建模块**：提供便捷的命令和模板，帮助开发者快速创建新的模块，确保一致性和最佳实践。
2. **开发支持**：集成开发工具和环境配置，支持热重载和自动化测试，提升开发效率，减少开发过程中的摩擦。
3. **动态生成文档**：自动化生成模块`API`文档，确保文档与代码始终保持同步，方便团队成员和用户查阅。
4. **生成 TypeScript 声明文件**：自动生成 `.d.ts` 声明文件，增强 TypeScript 的类型支持，确保模块在使用时能够获得良好的类型检查和智能提示，提高代码的可维护性和可读性。
5. **打包功能**：提供灵活的打包选项，支持多种输出格式和目标环境，确保模块可以在不同的平台上高效运行。同时，集成了代码分割和压缩等优化策略，以提升性能。

通过这些功能，该模块为开发者提供了一个强大的工具集，使得在单体代码库中进行多模块开发变得更加高效和可控，帮助团队更好地协作和交付高质量的软件产品。

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

