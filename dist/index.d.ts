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
    Browser_Type: string;
    Browser_Bits: number;
    Browser_Maker: string;
    Browser_Modus: string;
    Version: string | number;
    MajorVer: string;
    MinorVer: string;
    Platform: string;
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
    Device_Type: string;
    Device_Pointing_Method: string;
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
export declare class BrowscapMatchResult {
    readonly results: Map<string, BrowscapRecord>;
    private _compressedResults;
    merge(other: BrowscapMatchResult): void;
    mergeReversed(other: BrowscapMatchResult): void;
    set(key: string, record: BrowscapRecord): void;
    toObj(): {};
    get compressedResults(): BrowscapMatchResult;
    get size(): number;
}
export declare function initializeDataFiles(): void;
export declare function initializeDatabase(): ParsedBrowscapMatcher;
export declare function findBrowscapRecords(sample: string): BrowscapMatchResult;
export declare function testBrowscap(): Promise<void>;
export declare function loadBrowscap(): void;
export {};
//# sourceMappingURL=index.d.ts.map