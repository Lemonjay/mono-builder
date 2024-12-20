import type { BuildOptions as EsbuildOptions } from "esbuild";
import type { ObfuscatorOptions } from "javascript-obfuscator";
declare module "mono-builder" {
/**
 * Build a specific module such as 'packages/simulation-app'.
 */
export class AppBuilder extends JavascriptBuilder {
    /**
     * Get the exports of the third party.
     */
    static getExportFromThirdParty(workspace: string): Promise<{
        [key: string]: string[];
    }>;
    /**
     * Generate the index entrance.
     */
    static generateIndex(workspace: string, version: number): Promise<string>;
    /**
     * generate index.d.ts
     */
    static generateTypes(workspace: string): void;
    /**
     * Update module
     */
    static updateModule(workspace: string): void;
    /**
     * Merge The Dts file of ThirdParty to index.d.ts
     */
    static mergeDtsFromThirdParty(workspace: string): void;
}

/**
 * Creates an instance of ArchiveBuilder.
 * @param options.directory - The folder where the project is located.
 * @param options.projectName - The name of the project.
 * @param [options.outFolder] - The output folder where the zip file will be saved.
 * @param [options.alias] - The output name of the zip file. If not set, alias will use the projectName instead.
 * @param [options.password] - The password for encrypting the zip file.
 * @param [options.author] - The author of the project.
 * @param [options.version] - The version of the project.
 */
export class ArchiveBuilder {
    constructor(options: {
        directory: string;
        projectName: string;
        outFolder?: string;
        alias?: string;
        password?: string;
        author?: string;
        version?: string;
    });
    /**
     * Add log
     */
    addLog(): void;
    /**
     * Make archive by gulp-zip.
     */
    makeZip(): void;
    /**
     * Make archive by winrar.exe.
     * @param [format = 'rar'] - The format of the archive
     * @param [volume] - Create volume [k|b|f|m|g|G]
     * @param [encryption = true] - Encrypt or not
     */
    makeRar(format?: string, volume?: string, encryption?: boolean): void;
    /**
     * Make archive by 7-zip.exe
     * @param [format = 'zip'] - The format of the archive
     * @param [volume] - Create volume [k|b|f|m|g|G]
     * @param [encryption = false] - Encrypt or not
     */
    make7z(format?: string, volume?: string, encryption?: boolean): void;
}

/**
 * Create BackendBuilder
 */
export class BackendBuilder extends JavascriptBuilder {
    /**
     * Update module
     */
    static updateModule(workspace: string): Promise<void>;
}

/**
 * Builder Base Class
 */
export class BaseBuilder {
    /**
     * Create modules
     */
    static createModules(workspaces: string[]): void;
    /**
     * Create new module directory.
     */
    static createModule(workspace: string): void;
    /**
     * Generate the directory of the module.
     */
    static generateDirectory(workspace: string): boolean;
    /**
     * Generate .gitignore
     */
    static generateGitIgnore(workspace: string): string;
    /**
     * Generate package.json.
     */
    static generatePackageJson(workspace: string): string;
    /**
     * update .eslintignore
     */
    static updateEslintIgnore(workspaces: string[]): void;
    /**
     * Install the module to the main project.
     */
    static installModule(workspace: string): void;
}

/**
 * Define BuilderSettings
 */
export namespace BuilderSettings {
    /**
     * Set the main framework.
     */
    var framework: string;
    /**
     * Set scope name.
     */
    var scope: string;
    /**
     * Set the scope name for creating API documents.
     */
    var docApiScope: string;
    /**
     * Set the scope title name for creating API documents.
     */
    var docApiTitle: string;
    /**
     * Set the path of the eslintignore.
     */
    var eslintignorePath: string;
    /**
     * Set the paths of the typedoc plugin for TypescriptBuilder
     */
    var typedocPlugin: string[];
    /**
     * Sets the tools folder.
     */
    var toolsFolder: string;
    /**
     * Sets cesium docs config path
     */
    var cesiumDocsFolder: string;
    /**
     * Sets the tools folder.
     */
    var tsdConfPath: string;
    /**
     * Set cesium Documentation path
     */
    var documentationPath: string;
    /**
     * Set cesium Documentation folder.
     */
    var outputDocsFolder: string;
    /**
     * Set module version
     */
    var version: string;
    /**
     * Sets the argv arguments for build cesium documents.
     */
    var argv: any;
    /**
     * Set thirdImportNames
     */
    var thirdImportNames: string[];
    /**
     * Sets singleThirdImportNames
     */
    var singleThirdImportNames: string[];
    /**
     * Set examples folder.
     */
    var examplesFolder: string;
    /**
     * Set relative pages
     */
    var relativePages: string[];
    /**
     * Filter some special files which has the "export default" string
     */
    var filterSpecialBuildFiles: string[];
    /**
     * Set obfuscate options
     */
    var obfuscatorOptions: ObfuscatorOptions;
    /**
     * Set the default rollup options
     */
    function getDefaultRollupOptions(): PackageManager.RollupOptionsType;
    /**
     * Set the default esbuild options
     */
    function getDefaultEsbuildOptions(): EsbuildOptions;
    /**
     * Set the path of the WinRAR.exe
     */
    var winrarPath: string;
    /**
     * Set the path of the 7-zip.exe
     */
    var zipPath: string;
    /**
     * the externalOptions for building node by Rollup.
    
    ExternalsOptions
     */
    var nodeExternalsOptions: any;
}

export namespace CesiumESBuilder {
    /**
     * Define the EsbuildOptions type.
    
    Options for customizing esbuild configurations. These options
    control how the build process should behave, including whether to minify output,
    strip debug pragmas, generate sourcemaps, or handle module output formats.
     * @property [external] - A comma-separated list of modules to mark as external, meaning they won't be bundled with the output.
     * @property [globals] - An object that maps global variables in the output to specific module names.
     * @property [minifyIdentifiers = false] - Set to true to minify variable and function names, even if `minify` is false.
     * @property [minifySyntax = false] - Set to true to minify syntax without changing identifiers or whitespace, even if `minify` is false.
     * @property [minifyWhitespace = false] - Set to true to minify whitespace for compact code output, even if `minify` is false.
     * @param [minify = false] - true if the output should be minified
     * @param [removePragmas = false] - true if the output should have debug pragmas stripped out
     * @param [sourcemap = false] - true if an external sourcemap should be generated
     * @param [iife = false] - true if an IIFE style module should be built
     * @param [node = false] - true if a CJS style node module should be built
     * @param [incremental = false] - true if build output should be cached for repeated builds
     * @param [write = true] - true if build output should be written to disk. If false, the files that would have been written as in-memory buffers
     */
    type EsbuildOptionsType = {
        external?: string;
        globals?: {
            [key: string]: string;
        };
        minifyIdentifiers?: boolean;
        minifySyntax?: boolean;
        minifyWhitespace?: boolean;
    };
    /**
     * @property [esm] - The ESM bundle.
     * @property [iife] - The IIFE bundle, for use in browsers.
     * @property [node] - The CommonJS bundle, for use in NodeJS.
     */
    type BundlesType = {
        esm?: any;
        iife?: any;
        node?: any;
    };
    /**
     * Define the BundleOptionsType for configuring Esbuild options. {@link https://esbuild.github.io/api/#general-options}
     * @property bundle - Specifies if the code should be bundled into a single output file.
    Bundling helps to optimize dependencies and reduce the number of HTTP requests.
     * @property color - Enables or disables colored output in terminal logs.
    Useful for improving readability during development.
     * @property legalComments - Controls how comments with legal directives (such as licensing information) are handled in the output.
    Possible values include 'none', 'inline', 'eof', or 'linked'.
     * @property logLimit - Limits the number of log messages displayed in the console.
    A boolean value indicates if log limiting should be applied to prevent overwhelming the terminal with too many messages.
     * @property target - Specifies the ECMAScript version or specific JavaScript environments that the output should target (e.g., 'es2015', 'es2020', 'node14').
     * @property treeShaking - Enables tree shaking to remove unused code, reducing bundle size by eliminating dead code.
    Useful for analyzing and optimizing the build.
     */
    type BundleOptionsType = {
        bundle: boolean;
        color: boolean;
        legalComments: string;
        logLimit: boolean;
        target: string;
        treeShaking: boolean;
    };
}

/**
 * Creates an instance of CesiumESBuilder.
 */
export class CesiumESBuilder {
    constructor(options?: {
        outFolderName?: string;
        globalName?: string;
    });
    /**
     * Build Entrance
     */
    build(workspace: string, options: CesiumESBuilder.EsbuildOptionsType): void;
    /**
     * Get build configs.
     */
    getConfigs(options: CesiumESBuilder.EsbuildOptionsType): void;
    /**
     * Get the output folder
     */
    getFolder(workspace: string): void;
    /**
     * Build es module.
     */
    bundleESM(options: CesiumESBuilder.EsbuildOptionsType): void;
    /**
     * Build IIFE mode for the explorer.
     */
    bundleIIFE(options: CesiumESBuilder.EsbuildOptionsType): void;
    /**
     * Build node mode for the explorer.
     */
    bundleCJS(options: CesiumESBuilder.EsbuildOptionsType): void;
    /**
     * Get contests.
     */
    readonly contexts: CesiumESBuilder.BundlesType;
}

/**
 * Creates an instance of CesiumTSBuilder.
 * @param [options.singleThirdImports] - these imports with a singer export.
 */
export class CesiumTSBuilder {
    constructor(options: {
        scope: string;
        workspace: string;
        thirdImports: string[];
        singleThirdImports?: string[];
    });
    /**
     * Build TS files.
     */
    build(): void;
    /**
     * Generate Typescript Definitions.
     */
    generateTypeScriptDefinitions(): void;
    /**
     * Add third imports to .d.ts
     * @param source - code content
     */
    writeImports(source: string, thirdImports: {
        [key: string]: string[];
    }, isTypeOnly?: boolean): string;
    /**
     * Write single third imports.
     */
    writeSingleImports(source: string): string;
    /**
     * add get single Imports
     */
    getSingleImports(): void;
    /**
     * Extract imports
     */
    getImports(thirdImports: {
        [key: string]: string[];
    }): void;
    /**
     * Gets the source files.
     */
    getSourceFiles(): Promise<string[]>;
    /**
     * Get type imports.
     */
    getTypeImports(): void;
    /**
     * Get the ultimate module imports
     */
    getUltimateModules(): void;
    /**
     * Split from cesium
     */
    static processCesiumDts(source: string): string;
    /**
     * Create new tsd-conf.json for modules
     * @param tsdConfigPath - The path of the origin tsd-config.json
     */
    static generateConfig(workspace: string, tsdConfigPath: string): string;
}

/**
 * Creates an instance of DevelopMonitor.
 * @param options.rules - watch rules
 * @param [options.delay = 1000] - watch delay
 */
export class DevelopMonitor {
    constructor(options: {
        name: string;
        workspaces: string[];
        rules: string[];
        updater: (...params: any[]) => any;
        delay?: number;
    });
    /**
     * Watch and Update with delay.
     */
    watch(): void;
    /**
     * Get watch files
     */
    getWatchFiles(rules: string[]): void;
    readonly name: string;
}

/**
 * Creates an instance of GalleryBuilder.
 */
export class GalleryBuilder {
    constructor(options: {
        directory: string;
        outFolder: string;
        config?: string;
    });
    /**
     * Build
    Convert html to js
     */
    build(): void;
    /**
     * Clear the directory.
     */
    clear(): void;
    /**
     * Format js
     */
    format(): void;
    /**
     * Add the header docs
     */
    addHeaderDocs(name: string, filename: string): void;
}

/**
 * Glsl Builder
 */
export class GlslBuilder {
    /**
     * convert glsl to JavaScript
     * @param [recreate] - 是否全部重新创建
     */
    static toJavaScript(workspace: string, minify: boolean, recreate?: boolean, format?: string): void;
    /**
     * create shader js
     * @param glslFile - glsl path
     */
    static createShaderJs(glslFile: string, minify: boolean, minifyStateFileLastModified: number, format?: string): void;
}

export class JavascriptBuilder extends BaseBuilder {
    /**
     * Build cesium docs
     * @param argv - command 参数
     * @param version - package.version 库的版本
     * @param resultFolder - The folder of the created documents.
     */
    static buildCesiumDocs(workspaces: string[], argv: any, version: string, resultFolder: string): void;
    /**
     * create new conf.json for jsdoc tools
     * @param originPath - tsd json originPath
     * @param [resultFolder] - The folder of the document.
     */
    static modifyDocumentConf(workspaces: string[], originPath: string, resultFolder?: string): string;
    /**
     * Switch entrance to build mode.
     */
    static switchPackageEntrance(workspace: string, useBuildEntrance?: boolean): string;
    /**
     * generate index.d.ts
     */
    static generateTypes(workspace: string): void;
    /**
     * Generate the index entrance.
     */
    static generateIndex(workspace: string, version: number): Promise<string>;
    /**
     * generate glsl
     */
    static generateGlsl(workspace: string, minify?: boolean, recreate?: boolean): void;
    /**
     * Update module
     */
    static updateModule(workspace: string): Promise<void>;
}

export namespace PageBuilder {
    /**
     * Define the Pages type.
     */
    type PagesType = {
        template: string;
        title: string;
        entry: string;
    };
    /**
     * Define the RollupInputs type.
     */
    type RollInputsType = {
        [key: string]: string;
    };
    /**
     * Define the TempData type.
     */
    type TempDataType = {
        name: string;
        keywords: string[];
        type: string;
        date: string;
    };
}

export function capitalizeFirst(content: string): string;

/**
 * Creates an instance of PageBuilder.
 */
export class PageBuilder {
    constructor();
    /**
     * create template html pages
     */
    createHtmlPages(): Promise<void>;
    /**
     * remove template html pages
     */
    removeHtmlPages(): Promise<boolean[]>;
    /**
     * Copy index while vite-build
     */
    copyIndexJson(): void;
    /**
     * vite build
     */
    viteBuild(): void;
    /**
     * build
     */
    build(): Promise<void>;
    /**
     * Create template options for vite.config.js
     */
    createTemplateOptions(): void;
    /**
     * create examples/index.json
     */
    createIndexJson(addLinks: boolean): void;
    /**
     * Get pages.
     */
    readonly pages: PageBuilder.PagesType;
    /**
     * Get the inputs.
     */
    readonly inputs: PageBuilder.RollInputsType;
    /**
     * Get template name from the custom jsdoc of the example pages.
     */
    static getTemplateName(content: string): string;
    /**
     * Get details from the custom jsdoc of the example pages.
     */
    static getNameAndKeywords(jsPath: string): PageBuilder.TempDataType;
    static writeHtmlFromTemplate(name: string, options: {
        template: string;
        title: string;
        entry: string;
        data: string[];
    }): void;
}

export namespace RollupBuilder {
    /**
     * Configuration options for building bundles using Rollup. These options define the output format,
    external dependencies, and optional features such as minification, obfuscation, and source maps.
     * @property iife - Set to true if the bundle should be built as an Immediately Invoked Function Expression (IIFE) format.
     * @property node - Set to true if the bundle should be built for Node.js in CommonJS (CJS) format.
     * @property esm - Set to true if the bundle should be built as an ECMAScript Module (ESM) format.
     * @property [removePragmas = false] - Set to true if debug pragmas (e.g., `console.log`) should be stripped out of the bundle.
     * @property [minify] - Set to true if the bundle should be minified to reduce file size.
     * @property [obfuscate] - Set to true if the bundle should be obfuscated for additional code security.
     * @property sourcemap - Set to true if a source map should be generated for the bundle.
     * @property external - An array of module names to be excluded from the bundle and treated as external dependencies.
    For example: `['cesium', 'turf', '@ultimate/cesium-core', '@ultimate/military-symbol']`.
     * @property globals - An object that defines global variables in the UMD or IIFE bundle format.
    Keys are module names and values are global variable names. For example: `{ cesium: 'Cesium', '@ultimate/cesium-core': 'CesiumSdk' }`.
     * @property terserOptions - Custom options to pass to the Terser plugin for minification and optimization of the bundle.
     */
    type BundleOptions = {
        iife: boolean;
        node: boolean;
        esm: boolean;
        removePragmas?: boolean;
        minify?: boolean;
        obfuscate?: boolean;
        sourcemap: boolean;
        external: string[];
        globals: {
            [key: string]: string;
        };
        terserOptions: any;
    };
}

/**
 * Creates an instance of RollupBuilder.
 * @param [options.platformType] - default PlatformType.BROWSER (默认浏览器环境)
 */
export class RollupBuilder {
    constructor(options?: {
        platformType?: PlatformType;
        isTypescript?: boolean;
        outFolderName?: string;
    });
    /**
     * Build Entrance
     */
    build(workspace: string, options?: RollupBuilder.BundleOptions): Promise<void>;
    /**
     * Create bundle
     */
    bundleDTS(options?: RollupBuilder.BundleOptions): void;
    /**
     * Create bundle
     */
    bundle(workspace: string, options?: RollupBuilder.BundleOptions): void;
    /**
     * Build es mode
     */
    bundleESM(options: RollupBuilder.BundleOptions): void;
    /**
     * Build IIFE mode for the explorer.
     */
    bundleIIFE(options: RollupBuilder.BundleOptions): void;
    /**
     * Build node mode for the explorer.
     */
    bundleCJS(options: RollupBuilder.BundleOptions): void;
    /**
     * Get the output folder
     */
    getFolder(workspace: string): void;
    /**
     * Create temp TsConfig
     * @returns remove function
     */
    createTsconfig(): (...params: any[]) => any;
}

/**
 * import 导致的 this 报错
The 'this' keyword is equivalent to 'undefined' at the top level of an ES module, and has been rewritten.
{@link https://blog.csdn.net/qq_38519358/article/details/132366605}
 */
export function onwarn(): void;

/**
 * Create SqlBuilder to convert sql to js
 */
export class SqlBuilder {
    /**
     * Convert sql to javascript
     */
    static toJavascript(workspace: string, minify: boolean, recreate?: boolean): void;
    /**
     * Convert glsl to js
     */
    static createSqlJs(sqlFile: string, minify: boolean, minifyStateFileLastModified: number): any;
}

/**
 * Creates an instance of TemporaryBuilder.
 */
export class TemporaryBuilder {
    constructor(workspace: string);
    /**
     * Get the import modules.
     */
    getImportModules(workspace: string): void;
}

/**
 * Define TypescriptBuilder
 */
export class TypescriptBuilder extends BaseBuilder {
    /**
     * Generate TS Docs
     */
    static generateDocs(workspace: string): void;
    /**
     * Generate types
     */
    static generateTypes(workspace: string): void;
    /**
     * Generate tsconfig dynamically
     * @returns The path of the tsconfig.
     */
    static generateConfig(workspace: string): string;
    /**
     * Modify package json
     */
    static modifyPackageJson(workspace: string): string;
    /**
     * Generate the index entrance.
     */
    static generateIndex(workspace: string, version: number): Promise<string>;
    /**
     * Generate tsc files
     */
    static generateDist(workspace: string): void;
    /**
     * generate glsl
     */
    static generateGlsl(workspace: string, minify?: boolean, recreate?: boolean): void;
    /**
     * Update module
     */
    static updateModule(workspace: string): Promise<void>;
}

/**
 * Creates an instance of ViteBuilder.
 * @param options - Configuration options for the ViteBuilder.
 * @param options.languageType - The language to be used for building.
 * @param options.platformType - The platform for the build process.
 * @param [options.outFolderName = 'Build'] - The name of the output folder. Defaults to 'Build'.
 */
export class ViteBuilder {
    constructor(options: {
        languageType: LanguageType;
        platformType: PlatformType;
        outFolderName?: string;
    });
}

/**
 * Creates an instance of WorkerBuilder.
 */
export class WorkerBuilder {
    constructor(options: any);
}

/**
 * Build cesium docs {@link https://www.jsdoc.com.cn/about-configuring-jsdoc jsdoc 文档}
 */
export function buildCesiumDocs(workspaces: string[], argv: any, version: string, resultFolder: string): any;

/**
 * Define BundlerType
 */
export enum BundlerType {
    ROLLUP = 0,
    ESBUILD = 1,
    VITE = 2,
    WEBPACK = 3
}

/**
 * Capitalize the first letter.
 */
export function capitalizeFirstLetter(content: string): string;

/**
 * Capitalize all words.
 */
export function capitalizeWords(content: string): string;

/**
 * Copy Directory
 */
export function copyDirectory(originFolder: string, targetFolder: string): void;

/**
 * Copy Directory
 */
export function copyDirectoryOnWindows(originFolder: string, targetFolder: string): void;

/**
 * Create folder if the folder was existed。
 */
export function createDirectory(folderPath: string, recreate?: boolean): Promise<string>;

/**
 * Creates header documentation for an example.
 * @param options - The options for configuring the header.
 * @param [options.date] - The date and time the example is created.
 * @param options.name - The name of the example.
 * @param options.filename - The file name of the example.
 * @param [options.template] - The HTML template to be used.
 * @param [options.demoType] - The type of the template.
 * @param [options.keywords] - Keywords associated with the example.
 * @param [options.description] - A brief description of the example.
 * @returns - The formatted header documentation as a string.
 */
export function createHeaderDocs(options: {
    date?: Date;
    name: string;
    filename: string;
    template?: string;
    demoType?: string;
    keywords?: string;
    description?: string;
}): string;

/**
 * create custom console.log for node
 */
export function consoleLog(): void;

/**
 * create custom console.warning for node
 */
export function consoleWarning(): void;

/**
 * create custom console.error for node
 */
export function consoleError(): void;

/**
 * Define Virtual namespace
 */
export namespace ExecCommand {
    /**
     * Define the Options type.
     * @property [cwd] - The folder where the command running.
     * @property [stdio] - Can be set to 'pipe', 'inherit, or 'ignore', or an array of these strings. show console message or not.
     */
    type OptionsType = {
        cwd?: string;
        stdio?: string;
    };
}

/**
 * Exec Command async
 */
export function execCommandSync(command: string, options?: ExecCommand.OptionsType): void;

/**
 * Exec Command
 */
export function execCommand(command: string, options?: ExecCommand.OptionsType): Promise<string>;

/**
 * Filter and sort Array
 */
export function filterAndSortArray(inputArray: string[]): string[];

/**
 * Format Date like YYYY/MM/DD HH:mm:ss
 */
export function formatDate(date?: Date): string;

/**
 * @example
 * // @export TurfMath
export { degreesToRadians, radiansToLength, getDegreesDistance };

// get result (注: ts 和 docs 该怎么匹配，暂时不知道怎写，通过 @example ？)
export * as TurfMath from './TurfMath.js'
 * @param moduleId - js path and name
 * @param [format = 'js'] - The format of the file
 */
export function getMultiExport(content: string, moduleId: string, format?: string): string;

/**
 * Generate the index file
 * @param filterRule - globby filter Rule
 */
export function generateIndex(folderPath: string, filterRule: string[], headerContent?: string, format?: string, writeFile?: boolean): Promise<string>;

/**
 * Generate random string
 */
export function generateRandomString(length: number, characters?: string): string;

/**
 * Generate password
 */
export function generatePassword(length?: number): string;

/**
 * Get the current date
 */
export function getCurrentDate(isCommonStyle?: boolean): string;

/**
 * Define the ThreeExtendImports
 */
export namespace ThreeExtendImports {
    /**
     * Define the name type.
     */
    type ResultType = {
        content: string;
        value: string | string[];
        path: string;
    };
}

/**
 * Gets the extend imports of the threejs module.
 */
export function getExtendImportsOfThree(content: string): ThreeExtendImports.ResultType[];

/**
 * Define the ThirdPartyImports
 */
export namespace ThirdPartyImports {
    /**
     * Define the name type.
     */
    type ResultType = {
        content: string;
        thirdImports: {
            [key: string]: string[];
        };
    };
}

/**
 * Get the imports from the js file.
 */
export function getImportsOfThirdParty(content: string): ThirdPartyImports.ResultType;

/**
 * Get the third party names from the js file.
 */
export function getNamesOfThirdParty(content: string): string[];

/**
 * Get Type Imports for Creating the index.d.ts file.
 */
export function getTypeImports(content: string): {
    [key: string]: string[];
};

/**
 * Gets the workspaces of the monorepo project.
 */
export function getWorkspaces(packagePath: string): string[];

/**
 * Define the frontend LanguageType.
 */
export enum LanguageType {
    JS = "javascript",
    TS = "typescript"
}

/**
 * Define LinkType
 */
export enum LinkType {
    HARD = "hard",
    SYMBOLIC = "symbolic",
    JUNCTION = "junction"
}

/**
 * Make hard or soft link。
 * @param sourcePath - The source path (use the absolute link).
 * @param linkPath - The path where the link will be created.
 * @param [removeLink = false] - Whether to remove the existing link before creating a new one.
 * @param [linkType] - The type of link to create. Can be either 'hard' or 'soft' or 'junction'.
 */
export function makeLink(sourcePath: string, linkPath: string, removeLink?: boolean, linkType?: LinkType): void;

/**
 * Define ModuleType
 */
export enum ModuleType {
    CLIENT_JS = 0,
    SERVER_JS = 1,
    CLIENT_TS = 2,
    SERVER_TS = 3,
    SPECIAL_JS = 5
}

/**
 * Define PlatformType
 */
export enum PlatformType {
    /**
     * Node Environment
     */
    NODE = "node",
    /**
     * Explorer Environment
     */
    BROWSER = "browser",
    /**
     * Code that does not rely on platform-specific features, allowing it to run in multiple environments.
    It is cross-platform and not tied to a particular platform like the browser or Node.js.
     */
    NEUTRAL = "neutral"
}

/**
 * Creates an instance of ProgressBar.
 */
export class ProgressBar {
    constructor(options: {
        completeInfo?: string;
        progressInfo?: string;
        barWidth?: number;
        total?: number;
        precision?: number;
        type: ProgressType;
    });
    /**
     * Update the bar of the progress.
     * @param index - percent or index number
     */
    update(index: number): void;
    /**
     * Update the bar of the progress.
     * @param index - percent or index number
     */
    updateBar(index: number): void;
    /**
     * Update the text of the progress.
     * @param index - percent or index number
     */
    updateText(index: number): void;
    /**
     * Set the total number.
     */
    total: number;
}

/**
 * Define ProgressType
 */
export enum ProgressType {
    BAR = "bar",
    TEXT = "text"
}

/**
 * Remove the files or folders of the modules.
 */
export function removeModuleFiles(workspaces: string[], files: string[] | string): void;

/**
 * Creates an instance of BaseManager.
 */
export class BaseManager {
    constructor(options: {
        workspace: string;
    });
    /**
     * Copy and modify the packed files to another folder.
     * @param workspace - The relative path of the module.
     * @param outFolder - The path of the output folder.
     */
    static copyPackFiles(workspace: string, outFolder: string): void;
    /**
     * Modify the index.d.ts file.
     */
    static modifyAndCopyDts(workspace: string, outFolder: string): void;
}

/**
 * Creates an instance of GithubManager.
 * @param options.name - The name of the git project.
 * @param options.url - The url of this project.
 * @param options.forkedUrl - The url of the forked Repository.
 * @param options.directory - The path of the git project.
 */
export class GithubManager {
    constructor(options: {
        name: any;
        url: string;
        forkedUrl: string;
        directory: string;
    });
    /**
     * Add upstream
    run once
     */
    addUpstream(): void;
    /**
     * Remove Upstream
    run once
     */
    removeUpstream(): void;
    /**
     * Merge and update my repository
     */
    updateMain(): void;
}

/**
 * Creates an instance of GitManager.
 * @param options.name - The name of the git project.
 * @param options.url - The url of the git project.
 * @param options.directory - The path of the git project.
 * @param [options.localUrl] - The local url of the git project.
 */
export class GitManager {
    constructor(options: {
        name: any;
        url: string;
        directory: string;
        localUrl?: string;
    });
    /**
     * Clone the git project from remote
     */
    clone(): void;
    /**
     * Get all remote branches
     */
    getRemoteBranches(): void;
    /**
     * Get all local branches
     */
    getLocalBranches(): void;
    /**
     * Checkout branch
     */
    checkout(branch: string): void;
    /**
     * Checkout branches
     */
    checkoutBranches(): void;
    /**
     * Pull project
     */
    pull(): void;
    /**
     * Fetch project
     */
    fetch(): void;
    /**
     * Push project
     */
    push(): void;
    /**
     * stash
     */
    stash(): void;
    /**
     * Set default branch.
     */
    setDefaultBranch(branch: string): void;
    /**
     * Set remote origin url
     */
    getRemoteUrl(): string;
    /**
     * Set remote origin url
     */
    setRemoteOrigin(url: string): void;
    /**
     * Push branches to the local git.
     */
    pushBranches(branches?: string[]): void;
    /**
     * Update the branch of the local git from the github.
     */
    update(branch: string): void;
    /**
     * Download git release.
     */
    downloadRelease(options: {
        url: string;
        name: string;
        directory: string;
    }): void;
    /**
     * Get the proxy of the git.
     */
    getProxy(): void;
    /**
     * Set the proxy of the git.
     */
    setProxy(): void;
    /**
     * Remove the proxy of the git.
     */
    removeProxy(): void;
    /**
     * Get the name of the project.
     */
    readonly name: string;
    /**
     * Get the url of the project.
     */
    readonly url: string;
    /**
     * Get the local url of the project.
     */
    readonly localUrl: string;
    /**
     * Get branches
     */
    readonly branches: string[];
    /**
     * Get current origin
     */
    readonly currentOrigin: string;
}

/**
 * Build npm module
 */
export class NpmModuleManager extends ToolManager {
    /**
     * Build
     */
    build(options: {
        minify?: boolean;
        obfuscate?: boolean;
        dropConsole?: boolean;
        thirdModules?: boolean;
        platformType?: boolean;
    }): void;
    /**
     * Create new package json for dist.
     */
    modifyPackageJson(minify: boolean): void;
}

export namespace PackageManager {
    /**
     * Define the BuildOptions type.
     * @property [platformType = PlatformType.BROWSER] - The type of the platform.
     * @property [moduleType = ModuleType.CLIENT_JS] - The type of the module.
     * @property [bundlerType = BundlerType.ROLLUP] - The type of the bundling method.
     * @property [buildOptions] - The options for building.
     */
    type BuildModuleOptionsType = {
        platformType?: PlatformType;
        moduleType?: ModuleType;
        bundlerType?: BundlerType;
        buildOptions?: PackageManager.RollupOptionsType;
    };
    /**
     * Define the RollupOptions type.
     * @property [esm = true] - Build esm package
     * @property [iife = false] - Build iife package for explorer
     * @property [node = false] - Build cjs for node
     * @property [minify = true] - Build with the minify rule or not.
     * @property [external = ['cesium']] - Filter the third party.
     * @property [globals = {cesium:'Cesium'}] - Give the global name for the third party.
     * @property [obfuscate = false] - Build with the obfuscate rule or not.
     * @property [terserOptions] - set the terser options.
     */
    type RollupOptionsType = {
        esm?: boolean;
        iife?: boolean;
        node?: boolean;
        minify?: boolean;
        sourcemap?: boolean;
        external?: string[];
        globals?: {
            [key: string]: string;
        };
        obfuscate?: boolean;
        terserOptions?: PackageManager.terserOptionsType;
    };
    /**
     * Define the terserOptions type.
     */
    type terserOptionsType = {
        compress?: boolean;
        mangle?: boolean;
        keep_classnames?: boolean;
        output?: any;
    };
}

/**
 * Creates an instance of PackageManager.
 */
export class PackageManager extends BaseManager {
    constructor(options: {
        workspace: string;
        packageJson: any;
    });
    /**
     * Build the api documents
     */
    static buildDocuments(workspaces: string[], options: {
        moduleType: ModuleType;
        outFolder: string;
    }): Promise<void>;
    /**
     * Build modules
     * @param workspaces - The relative paths of the modules.
     * @param options - The options of the module building.
     */
    static buildModules(workspaces: string[], options: PackageManager.BuildModuleOptionsType): Promise<void>;
    /**
     * Build module
    
    1. UpdateModule
    2. build
    3. copy and modify: PackageManager.copyPackFiles
     * @param workspace - The relative path of the module.
     * @param options - The options of the module building.
     */
    static buildModule(workspace: string, options: PackageManager.BuildModuleOptionsType): Promise<void>;
}

/**
 * Create PackageMonitor
 */
export class PackageMonitor {
    /**
     * Watch the typescript client module.
     */
    static watch(workspaces: string[], delay?: number): void;
    /**
     * Watch the javascript client module.
     */
    static watchClient(workspaces: string[], delay?: number): void;
    /**
     * Watch the javascript client module.
     */
    static watchApp(workspaces: string[], delay?: number): void;
    /**
     * Watch the javascript client module.
     */
    static watchServer(workspaces: string[], delay?: number): void;
}

/**
 * Creates an instance of ToolManager.
 */
export class ToolManager extends BaseManager {
    constructor(options: {
        workspace: string;
        outFolder: string;
    });
    /**
     * Build
     */
    build(options: {
        minify?: boolean;
        obfuscate?: boolean;
        dropConsole?: boolean;
    }): void;
    /**
     * Create new package json for dist.
     */
    modifyPackageJson(minify: boolean): void;
    /**
     * Create a release module for npm publish.
     */
    createRelease(minify?: boolean): Promise<void>;
    /**
     * Copy index and dts files
     */
    copyFiles(): void;
    /**
     * Create Script for installing node_modules.
     */
    createNodeScript(useDevDependencies?: boolean): void;
    /**
     * Filter builtinModules.
     */
    getThirdModules(): Promise<string[]>;
    /**
     * Gets the third modules.
     */
    readonly thirdModules: string[];
    /**
     * Get Import Modules
     */
    static getImportModules(workspace: string): void;
}

/**
 * Esbuild Plugin
 * @example
 * // remove functions

// >>includeStart('debug', pragmas.debug);
if (isNaN(result.x) || isNaN(result.y) || isNaN(result.z)) {
  throw new DeveloperError("normalized result is not a number");
}
// >>includeEnd('debug');
 */
export function esbuildStripPragma(): any;

/**
 * Rollup plugin
 * @example
 * // remove functions

// >>includeStart('debug', pragmas.debug);
if (isNaN(result.x) || isNaN(result.y) || isNaN(result.z)) {
  throw new DeveloperError("normalized result is not a number");
}
// >>includeEnd('debug');
 */
export function rollupStripPragma(options?: {
    include?: string[];
    exclude?: string[];
    pragmas?: string[];
}): any;


}