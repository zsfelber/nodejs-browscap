declare class BrowscapMatcherNode {
    readonly root: BrowscapMatcherNode;
    readonly text: string;
    readonly nextNodes: Map<string, BrowscapMatcherNode>;
    totalNodes: number;
    totalNodesWithResult: number;
    intermediateResult: string;
    leafResult: string;
    asterixAfterLeaf: boolean;
    noAsterixAfterLeaf: boolean;
    leafResultRecord: BrowscapRecord;
    constructor(root: BrowscapMatcherNode, text: string);
    addChild(childText: string): BrowscapMatcherNode;
    merge(node: BrowscapMatcherNode): void;
    treeDump(tab?: string): string;
    get cnttxt(): string;
}
export type BrowserType = "Application" | "Browser" | "Email Client" | "Feed Reader" | "Multimedia Player" | "Offline Browser" | "Bot" | "Bot/Crawler" | "Tool";
export type DeviceType = "Desktop" | "Tablet" | "Mobile Device" | "Mobile Phone" | "TV Device" | "Console" | "Digital Camera" | "Car Entertainment System" | "Ebook Reader";
export type DevicePointingMethod = "mouse" | "touchscreen" | "trackball" | "joystick" | "clickwheel" | "stylus";
export type PlatformCode = "Linux" | "WinVista" | "WinXP" | "Win32" | "Win10" | "Win8.1" | "Win8" | "Win7" | "iOS" | "Android" | "Darwin" | "ipadOS" | "MacOSX" | "Miui OS" | "macOS" | "MacPPC" | "Mac68K" | "Brew" | "ChromeOS" | "CentOS" | "Win2000" | "BSD" | "WinPhone8" | "ATV OS X" | "Unix" | "Win64" | "WinNT" | "Ubuntu" | "Ubuntu Touch" | "OpenBSD" | "WinPhone10" | "WinPhone8.1" | "WinPhone" | "WinPhone7" | "SymbianOS" | "Asha" | "Series40" | "JAVA" | "RIM OS" | "Bada" | "WinCE" | "Win98" | "Win95" | "WinME" | "Inferno OS" | "Amiga OS" | "Tizen" | "Syllable" | "FreeBSD" | "MeeGo" | "Maemo" | "WinMobile" | "Mobilinux" | "SunOS" | "Solaris" | "OS/2" | "BeOS" | "Xbox OS 10" | "Xbox OS 10 (Mobile View)" | "RISC OS" | "Debian" | "Xubuntu" | "Chromecast OS" | "NetBSD" | "webOS" | "Android for GoogleTV" | "Brew MP" | "Nintendo Switch" | "Nintendo WiiU" | "Nintendo 3DS" | "Nintendo DS" | "Nintendo Wii" | "Nintendo DSi" | "Xbox OS (Mobile View)" | "WinPhone6" | "WinPhone7.5" | "Xbox 360 (Mobile View)" | "WinPhone7.8" | "SailfishOS" | "Series30" | "CellOS" | "OrbisOS" | "Playstation Vita" | "Haiku" | "MAUI" | "CygWin" | "HP-UX" | "IRIX64" | "AIX" | "Tru64 UNIX" | "RIM Tablet OS" | "Win31" | "DragonFly BSD" | "PalmOS" | "WinRT8.1" | "WinRT8" | "Xbox OS" | "Xbox 360" | "Fedora" | "FirefoxOS" | "KaiOS" | "Red Hat" | "Win16" | "OpenVMS" | "WyderOS" | "WinPhone7.10";
export interface BrowscapHeader {
    GJK_Browscap_Version: string | number;
    timestamp: string;
}
export interface BasicBrowscapUserAgentProperties {
    Parent: string;
    Comment: string;
    Browser: string;
    Browser_Bits: number;
    Platform_Bits: number;
    Version: string | number;
    MajorVer: string | number;
    MinorVer: string | number;
}
export interface BasicBrowscapUserAgent extends BasicBrowscapUserAgentProperties {
    UserAgentPatterns: string[];
}
export interface BrowscapRecord {
    PropertyName: string;
    UserAgents: BasicBrowscapUserAgent[];
    MasterParent: string;
    LiteMode: boolean;
    Parent: string;
    Comment: string;
    Browser: string;
    Browser_Type: BrowserType;
    Browser_Bits: number;
    Browser_Maker: string;
    Browser_Modus: string;
    Version: string | number;
    MajorVer: string;
    MinorVer: string;
    Platform: PlatformCode;
    Platform_Version: string | number;
    Platform_Description: string;
    Platform_Bits: number;
    Platform_Maker: string;
    Alpha: boolean;
    Beta: boolean;
    Win16: boolean;
    Win32: boolean;
    Win64: boolean;
    Frames: boolean;
    IFrames: boolean;
    Tables: boolean;
    Cookies: boolean;
    BackgroundSounds: boolean;
    JavaScript: boolean;
    VBScript: boolean;
    JavaApplets: boolean;
    ActiveXControls: boolean;
    isMobileDevice: boolean;
    isTablet: boolean;
    isSyndicationReader: boolean;
    Crawler: boolean;
    isFake: boolean;
    isAnonymized: boolean;
    isModified: boolean;
    CssVersion: string | number;
    AolVersion: string | number;
    Device_Name: string;
    Device_Maker: string;
    Device_Type: DeviceType;
    Device_Pointing_Method: DevicePointingMethod;
    Device_Code_Name: string;
    Device_Brand_Name: string;
    RenderingEngine_Name: string;
    RenderingEngine_Version: string | number;
    RenderingEngine_Description: string;
    RenderingEngine_Maker: string;
}
export declare class ParsedBrowscapMatcher {
    readonly patternTreeRootNoAsterix: BrowscapMatcherNode;
    readonly reversePatternTreeRootNoAsterix: BrowscapMatcherNode;
    readonly patternTreeRootBothAsterix: BrowscapMatcherNode;
    readonly fragmentTreeRoot: BrowscapMatcherNode;
    readonly reverseFragmentTreeRoot: BrowscapMatcherNode;
    header: BrowscapHeader;
    headerComments: string[];
    defaultProperties: BrowscapRecord;
    parentProperties: Map<string, BrowscapRecord>;
    built: boolean;
    extractJsonIfNotExists(): void;
    buildFromJson(): void;
    build(bodyRecords: BrowscapRecord[]): void;
    mergeProperties(properties: BrowscapRecord): BrowscapRecord;
}
export interface MapLike<T> {
    [index: string]: T;
}
export declare class BrowscapMatchResult {
    private _results;
    private _resultObj;
    private _compressedResults;
    merge(other: BrowscapMatchResult): void;
    mergeReversed(other: BrowscapMatchResult): void;
    get(key: string): BrowscapRecord;
    set(key: string, record: BrowscapRecord): void;
    get size(): number;
    get asObj(): MapLike<BrowscapRecord>;
    get asMap(): ReadonlyMap<string, BrowscapRecord>;
    get compressedResults(): BrowscapMatchResult;
}
/**
 * Matches sample against pattern database records. It initializes internal database automatically if was not yet done.
 */
export declare function findBrowscapRecords(sample: string): BrowscapMatchResult;
/**
 * Extract missing data files from ZIP archives. (Otherwise being done automatically.)
 */
export declare function initializeDataFiles(): void;
/**
 * Loads and initializes internal database and grammar parse trees. (Otherwise being done automatically.)
 */
export declare function initializeDatabase(): ParsedBrowscapMatcher;
/**
 * Deletes references to all preloaded data, marking as target for garbage collector to remove it from heap.
 */
export declare function uninitializeDatabase(gc?: boolean, warngc?: boolean): void;
/**
 * Runs tests.
 */
export declare function testBrowscap(): Promise<void>;
export {};
//# sourceMappingURL=index.d.ts.map