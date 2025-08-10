import * as fs from 'fs';
import * as path from 'path';
import { printTree } from 'tree-dump';
import { argv } from 'process';
import AdmZip from "adm-zip";

//for type:"module"
//import { fileURLToPath } from 'url';
//import { dirname } from 'path';
//const __filename = fileURLToPath(import.meta.url);
//const __dirname = dirname(__filename);

let printInits = true;
let debug = false;
let testIntegrity = false;
let saveBodyRecords = false;

let savedBodyRecords: BrowscapRecord[];

function reversedString(input: string) {
    let r = input.split('').reverse().join('');
    return r;
}

function loadJSONSync(filePath: string) {
    //filePath = path.resolve(filePath);
    let buf = fs.readFileSync(filePath);
    let obj = JSON.parse(buf.toString());
    return obj;
}

function extractSingleFileFromZip(zipPath: string, outFilePath: string, entryName:string, update:boolean=true) {
    zipPath = path.resolve(zipPath);
    outFilePath = path.resolve(outFilePath);

    let zip = new AdmZip(zipPath);
    let zipEntries = zip.getEntries();
    let curfilesz = 0;
    if (update && fs.existsSync(outFilePath)) {
        curfilesz = fs.statSync(outFilePath).size;
    }

    for (let zipEntry of zipEntries.values()) {
        if (zipEntry.entryName == entryName) {
            if (!update || zipEntry.header.size !== curfilesz) {
                //console.log("compressedSize !== curfilesz ",zipEntry.header.compressedSize,"!==",curfilesz);
                console.log("Extracting ",entryName,"...");
                fs.writeFileSync(outFilePath, zipEntry.getData());
            } else {
                console.log("Output file (of proper size) is present already:", outFilePath);
            }
            return true;
        }
    }
    console.log("WARN Entry not found: ",entryName, " in:", zipPath);
    return false;
}

class BrowscapMatcherNode {

    readonly root:BrowscapMatcherNode;

    readonly text: string;

    readonly nextNodes = new Map<string, BrowscapMatcherNode>();

    totalNodes = 0;

    totalNodesWithResult = 0;

    intermediateResult: string = "";

    leafResult: string;

    asterixAfterLeaf: boolean = false;

    noAsterixAfterLeaf: boolean = false;

    leafResultRecord: BrowscapRecord;

    constructor(root:BrowscapMatcherNode, text: string) {
        this.root = root?root:this;
        this.text = text;
        if (root) ++root.totalNodes;
    }

    addChild(childText: string): BrowscapMatcherNode {
        let result: BrowscapMatcherNode;
        if (this.nextNodes.has(childText)) {
            result = this.nextNodes.get(childText);
        } else {
            result = new BrowscapMatcherNode(this.root, childText);
            result.intermediateResult = this.intermediateResult;
            this.nextNodes.set(childText, result);
        }
        return result;
    }
    merge(node: BrowscapMatcherNode) {
        this.intermediateResult = node.intermediateResult;
        this.leafResult ||= node.leafResult;
        this.leafResultRecord ||= node.leafResultRecord;
        this.asterixAfterLeaf ||= node.asterixAfterLeaf;
        this.noAsterixAfterLeaf ||= node.noAsterixAfterLeaf;
        if (node.leafResult) {
            ++this.root.totalNodesWithResult;
        }

        for (let childNode of node.nextNodes.values()) {
            let thisChild = this.addChild(childNode.text);
            thisChild.merge(childNode);
        }
    }

    treeDump(tab="") {
        let astxt=()=>{
            let result=" (";
            if (this.asterixAfterLeaf) result += "*";
            if (this.noAsterixAfterLeaf) result += "-";
            result += ")"
            return result;
        };
        const str = this.text + (this.leafResult?" -> "+this.leafResult+astxt():"");
 
        let childmps: ((tab:string)=>string)[];
        childmps = Array.from(this.nextNodes.values()).map(node=>{
            return node.treeDump.bind(node);
        });
 
        let result = str + printTree(tab, childmps);

        return result;
    }

    get cnttxt() {
        return `${this.totalNodesWithResult}/${this.totalNodes}`;
    }
}

export type BrowserType = 
    "Application"|
    "Browser"|
    "Email Client"|
    "Feed Reader"|
    "Multimedia Player"|
    "Offline Browser"|
    "Bot"|
    "Bot/Crawler"|
    "Tool";

export type DeviceType =
    "Desktop"|
    "Tablet"|
    "Mobile Device"|
    "Mobile Phone"|
    "TV Device"|
    "Console"|
    "Digital Camera"|
    "Car Entertainment System"|
    "Ebook Reader";

export type DevicePointingMethod =
    "mouse"|
    "touchscreen"|
    "trackball"|
    "joystick"|
    "clickwheel"|
    "stylus";

export type PlatformCode =
    "AIX"|    "Amiga OS"|    "Android for GoogleTV"|    "Android"|    "Asha"|
    "ATV OS X"|    "Bada"|    "BeOS"|    "Brew MP"|    "Brew"|    "BSD"|
    "CellOS"|    "CentOS"|    "Chromecast OS"|    "ChromeOS"|    "CygWin"|
    "Darwin"|    "Debian"|    "DragonFly BSD"|    "Fedora"|    "FirefoxOS"|
    "FreeBSD"|    "Haiku"|    "HP-UX"|    "Inferno OS"|    "iOS"|    "ipadOS"|
    "IRIX64"|    "JAVA"|    "KaiOS"|    "Linux"|    "Mac68K"|    "macOS"|    "MacOSX"|
    "MacPPC"|    "Maemo"|    "MAUI"|    "MeeGo"|    "Miui OS"|    "Mobilinux"|
    "NetBSD"|    "Nintendo 3DS"|    "Nintendo DS"|    "Nintendo DSi"|    "Nintendo Switch"|
    "Nintendo Wii"|    "Nintendo WiiU"|    "OpenBSD"|    "OpenVMS"|    "OrbisOS"|
    "OS/2"|    "PalmOS"|    "Playstation Vita"|    "Red Hat"|    "RIM OS"|
    "RIM Tablet OS"|    "RISC OS"|    "SailfishOS"|    "Series30"|    "Series40"|
    "Solaris"|    "SunOS"|    "Syllable"|    "SymbianOS"|    "Tizen"|    "Tru64 UNIX"|
    "Ubuntu Touch"|    "Ubuntu"|    "Unix"|    "webOS"|    "Win10"|    "Win16"|
    "Win2000"|    "Win31"|    "Win32"|    "Win64"|    "Win7"|    "Win8.1"|
    "Win8"|    "Win95"|    "Win98"|    "WinCE"|    "WinME"|    "WinMobile"|
    "WinNT"|    "WinPhone"|    "WinPhone10"|    "WinPhone6"|    "WinPhone7.10"|
    "WinPhone7.5"|    "WinPhone7.8"|    "WinPhone7"|    "WinPhone8.1"|    "WinPhone8"|
    "WinRT8.1"|    "WinRT8"|    "WinVista"|    "WinXP"|    "WyderOS"|    "Xbox 360 (Mobile View)"|
    "Xbox 360"|    "Xbox OS (Mobile View)"|    "Xbox OS 10 (Mobile View)"|
    "Xbox OS 10"|    "Xbox OS"|    "Xubuntu";

export type PlatformKind =
    "Android"|
    "iOS"|
    "Windows"|
    "WinMobile"|
    "MacOS"|
    "Unix"|
    "Linux"|
    "Console"|
    "Device"|
    "EmulationVirtual"|
    "EmulationVirtualMobile"|
    "OtherMobile"|
    "OtherLinuxMobile"|
    "OtherPC"
;

let PlatformKinds: Record<PlatformCode, PlatformKind> = {
    "AIX":"Unix",    "Amiga OS":"OtherPC",    "Android for GoogleTV":"Android",    "Android":"Android",    "Asha":"Android",
    "ATV OS X":"MacOS",    "Bada":"OtherLinuxMobile",    "BeOS":"OtherPC",    "Brew MP":"Device",    "Brew":"Device",    "BSD":"Unix",
    "CellOS":"Device",    "CentOS":"Linux",    "Chromecast OS":"Device",    "ChromeOS":"OtherLinuxMobile",    "CygWin":"EmulationVirtual",
    "Darwin":"Unix",    "Debian":"Linux",    "DragonFly BSD":"Unix",    "Fedora":"Linux",    "FirefoxOS":"OtherLinuxMobile",
    "FreeBSD":"Unix",    "Haiku":"OtherPC",    "HP-UX":"Unix",    "Inferno OS":"EmulationVirtual",    "iOS":"iOS",    "ipadOS":"iOS",
    "IRIX64":"Unix",    "JAVA":"EmulationVirtual",    "KaiOS":"OtherLinuxMobile",    "Linux":"Linux",    "Mac68K":"EmulationVirtual",    
    "macOS":"MacOS",    "MacOSX":"MacOS",    "MacPPC":"Unix",    "Maemo":"OtherLinuxMobile",    "MAUI":"EmulationVirtualMobile",    
    "MeeGo":"OtherLinuxMobile",    "Miui OS":"Android",        "Mobilinux":"OtherLinuxMobile",
    "NetBSD":"Unix",    "Nintendo 3DS":"Device",    "Nintendo DS":"Device",    "Nintendo DSi":"Device",    "Nintendo Switch":"Device",
    "Nintendo Wii":"Device",    "Nintendo WiiU":"Device",    "OpenBSD":"Unix",    "OpenVMS":"OtherPC",    "OrbisOS":"Console",
    "OS/2":"OtherPC",    "PalmOS":"OtherMobile",    "Playstation Vita":"Console",    "Red Hat":"Linux",    "RIM OS":"OtherMobile",
    "RIM Tablet OS":"OtherMobile",    "RISC OS":"OtherMobile",    "SailfishOS":"OtherMobile",    "Series30":"OtherMobile",    "Series40":"OtherMobile",
    "Solaris":"Unix",    "SunOS":"Unix",    "Syllable":"Unix",    "SymbianOS":"OtherMobile",    "Tizen":"Device",    "Tru64 UNIX":"Unix",
    "Ubuntu Touch":"Linux",    "Ubuntu":"Linux",    "Unix":"Unix",    "webOS":"OtherLinuxMobile",    "Win10":"Windows",    "Win16":"Windows",
    "Win2000":"Windows",    "Win31":"Windows",    "Win32":"Windows",    "Win64":"Windows",    "Win7":"Windows",    "Win8.1":"Windows",
    "Win8":"Windows",    "Win95":"Windows",    "Win98":"Windows",    "WinCE":"Windows",    "WinME":"Windows",    "WinMobile":"WinMobile",
    "WinNT":"Windows",    "WinPhone":"WinMobile",    "WinPhone10":"WinMobile",    "WinPhone6":"WinMobile",    "WinPhone7.10":"WinMobile",
    "WinPhone7.5":"WinMobile",    "WinPhone7.8":"WinMobile",    "WinPhone7":"WinMobile",    "WinPhone8.1":"WinMobile",    "WinPhone8":"WinMobile",
    "WinRT8.1":"Windows",    "WinRT8":"Windows",    "WinVista":"Windows",    "WinXP":"Windows",    "WyderOS":"OtherPC",    "Xbox 360 (Mobile View)":"Console",
    "Xbox 360":"Console",    "Xbox OS (Mobile View)":"Console",    "Xbox OS 10 (Mobile View)":"Console",
    "Xbox OS 10":"Console",    "Xbox OS":"Console",    "Xubuntu":"Linux"
};

export interface BrowscapHeader {
    
    GJK_Browscap_Version:string|number;
    
    timestamp:string;
}

export interface BasicBrowscapUserAgentProperties {
    Parent: string;
    Comment: string;
    Browser: string;
    Browser_Bits: number;
    Platform_Bits: number;
    Version: string|number;
    MajorVer: string|number;
    MinorVer: string|number;
}

export interface BasicBrowscapUserAgent extends BasicBrowscapUserAgentProperties {
    UserAgentPatterns:string[];
}


export interface BrowscapRecord {
    PropertyName:string;
    UserAgents:BasicBrowscapUserAgent[];
    MasterParent:string;
    LiteMode:boolean;
    Parent:string;
    Comment:string;
    Browser:string;
    Browser_Type:BrowserType;
    Browser_Bits:number;
    Browser_Maker:string;
    Browser_Modus:string;
    Version:string|number;
    MajorVer:string;
    MinorVer:string;
    Platform:PlatformCode;
    Platform_Kind:PlatformKind;
    Platform_Version:string|number;
    Platform_Description:string;
    Platform_Bits:number;
    Platform_Maker:string;
    Alpha:boolean;
    Beta:boolean;
    Win16:boolean;
    Win32:boolean;
    Win64:boolean;
    Frames:boolean;
    IFrames:boolean;
    Tables:boolean;
    Cookies:boolean;
    BackgroundSounds:boolean;
    JavaScript:boolean;
    VBScript:boolean;
    JavaApplets:boolean;
    ActiveXControls:boolean;
    isMobileDevice:boolean;
    isTablet:boolean;
    isSyndicationReader:boolean;
    Crawler:boolean;
    isFake:boolean;
    isAnonymized:boolean;
    isModified:boolean;
    CssVersion:string|number;
    AolVersion:string|number;
    Device_Name:string;
    Device_Maker:string;
    Device_Type:DeviceType;
    Device_Pointing_Method:DevicePointingMethod;
    Device_Code_Name:string;
    Device_Brand_Name:string;
    RenderingEngine_Name:string;
    RenderingEngine_Version:string|number;
    RenderingEngine_Description:string;
    RenderingEngine_Maker:string;

}

export class ParsedBrowscapMatcher {
    readonly patternTreeRootNoAsterix = new BrowscapMatcherNode(null,"");
    readonly reversePatternTreeRootNoAsterix = new BrowscapMatcherNode(null,"");
    readonly patternTreeRootBothAsterix = new BrowscapMatcherNode(null,"");
    readonly fragmentTreeRoot = new BrowscapMatcherNode(null,"");
    readonly reverseFragmentTreeRoot = new BrowscapMatcherNode(null,"");

    header: BrowscapHeader;
    headerComments: string[];
    defaultProperties: BrowscapRecord;
    parentProperties = new Map<string,BrowscapRecord>();
    built = false;

    extractJsonIfNotExists() {
        console.log("Extracting json...");

        extractSingleFileFromZip(__dirname+"/../data/browscap.zip", __dirname+"/../data/browscap.json", "browscap.json");
    }

    buildFromJson() {
        if (this.built) {
            return;
        }
        this.built = true;

        console.log("Load patterns input file...");

        console.time("loadJson");

        this.extractJsonIfNotExists();

        // see ../data/browscap.zip
        let obj = loadJSONSync(__dirname+"/../data/browscap.json");
        this.headerComments = obj.comments;
        this.header = {GJK_Browscap_Version:obj.GJK_Browscap_Version.Version, timestamp:obj.GJK_Browscap_Version.Released};

        console.log("file version:",JSON.stringify(this.header,null,2));

        this.defaultProperties = JSON.parse(obj.DefaultProperties);
        replaceUnknown(this.defaultProperties);

        let bodyRecords: BrowscapRecord[] = [];
        let es: [string,string][] = Object.entries(obj);
        es.splice(0, 3);
        for (let e of es) {
            let bodyRecord: BrowscapRecord = JSON.parse(e[1]);
            bodyRecord.PropertyName = e[0];
            if (bodyRecord.Platform) {
                bodyRecord.Platform_Kind = PlatformKinds[bodyRecord.Platform];
                if (!bodyRecord.Platform_Kind) {
                    console.log("ERROR Platform:",bodyRecord.Platform,"Platform_Kind:",bodyRecord.Platform_Kind);
                    process.exit(1);
                }
            }
            bodyRecords.push(bodyRecord);
            if (bodyRecord.Parent==="DefaultProperties") {
                this.parentProperties.set(bodyRecord.PropertyName, bodyRecord);
            }
        }

        console.timeEnd("loadJson");

        this.build(bodyRecords);
    }


    build(bodyRecords: BrowscapRecord[]) {
        if (saveBodyRecords) {
            savedBodyRecords = bodyRecords;
        }

        if (printInits) {
            console.time("buildSearchTree");
            console.log("Generate search tree...");
        }

        for (let record of bodyRecords) {

            let row = record.PropertyName;
            row = row.toLowerCase();

            let addTo=(patternTreeRoot:BrowscapMatcherNode, fragmentTreeRoot:BrowscapMatcherNode, input:string, startstar:boolean, endstar:boolean)=>{
                let fragments = input.split("*");
                if (startstar) {
                    let p = fragments.shift();
                    if (p!=="") {
                        console.warn(`startstar && p!='' :  ${p}`);
                        process.exit(1);
                    }
                }
                if (endstar) {
                    let p = fragments.pop();
                    if (p!=="") {
                        console.warn(`endstar && p!='' :  ${p}`);
                        process.exit(1);
                    }
                }

                let patternBranch = new BrowscapMatcherNode(null,"");
                let patternBranch0 = patternBranch;

                for (let fragment of fragments) {
                    patternBranch = patternBranch.addChild(fragment);
                    patternBranch.intermediateResult += "*" + fragment;

                    let fragmentBranch = new BrowscapMatcherNode(null,"");
                    let fragmentBranch0 = fragmentBranch;

                    for (let char of fragment) {
                        fragmentBranch = fragmentBranch.addChild(char);
                        fragmentBranch.intermediateResult += char;
                    }
                    fragmentBranch.leafResult = fragment;

                    fragmentTreeRoot.merge(fragmentBranch0);
                }

                patternBranch.leafResult = input;
                patternBranch.leafResultRecord = record;

                if (endstar) {
                    patternBranch.asterixAfterLeaf = true;
                } else {
                    patternBranch.noAsterixAfterLeaf = true;
                }

                patternTreeRoot.merge(patternBranch0);
            }

            let startstar = row.startsWith("*");
            let endstar = row.endsWith("*");

            if (startstar) {
                if (endstar) {
                    addTo(this.patternTreeRootBothAsterix, this.fragmentTreeRoot, row, startstar, endstar);
                } else {
                    let rrow = reversedString(row);
                    addTo(this.reversePatternTreeRootNoAsterix, this.reverseFragmentTreeRoot, rrow, endstar, startstar);
                }
            } else {
                addTo(this.patternTreeRootNoAsterix, this.fragmentTreeRoot, row, startstar, endstar);
            }
        }

        if (printInits) {
            console.log("Total fragment nodes", "  normal:", this.fragmentTreeRoot.cnttxt, "  reverse:", this.reverseFragmentTreeRoot.cnttxt);
            console.log("Total patterns:", bodyRecords.length, "  ..*? :", this.patternTreeRootNoAsterix.cnttxt, "  *.. :", this.reversePatternTreeRootNoAsterix.cnttxt, "  *..* :", this.patternTreeRootBothAsterix.cnttxt);
            console.timeEnd("buildSearchTree");

            //console.log("Fragment tree:\n", this.fragmentTreeRoot.treeDump());
            //console.log("");
            //console.log("Fragment tree ..*? :\n", this.patternTreeRootNoAsterix.treeDump());
            //console.log("");
            //console.log("Reverse fragment tree *.. :\n", this.reverseFragmentTreeRoot.treeDump());
            //console.log("");

            //console.log("Pattern tree ..*? :\n", this.patternTreeRootNoAsterix.treeDump());
            //console.log("");
            //console.log("Reverse pattern tree *.. :\n", this.reversePatternTreeRootNoAsterix.treeDump());
            //console.log("");
            //console.log("Pattern tree *..* :\n", this.patternTreeRootBothAsterix.treeDump());
            //console.log("");
        }
    }

    mergeProperties(properties: BrowscapRecord) {
        let result: BrowscapRecord;
        if (this.defaultProperties) {
            if (properties.Parent === "DefaultProperties") {
                result = Object.assign({}, this.defaultProperties, properties);
            } else {
                let parent = this.parentProperties.get(properties.Parent);
                if (parent) {
                    result = Object.assign({}, this.defaultProperties, parent, properties);
                } else {
                    console.log("Parent not found:", properties.Parent);
                    result = Object.assign({}, this.defaultProperties, properties);
                }
            }
        } else {
            result = properties;
        }
        return result;
    }
}

class PositionalBrowscapCharMatchSet {

    readonly parsedBrowscapMatcher: ParsedBrowscapMatcher;

    readonly startPosition: number;

    readonly matchedFragments = new Map<string, boolean>();

    position: number;

    node: BrowscapMatcherNode;

    lastBrowscapMatch: BrowscapMatcherNode;

    constructor(parsedBrowscapMatcher: ParsedBrowscapMatcher, startPosition: number) {
        this.parsedBrowscapMatcher = parsedBrowscapMatcher;
        this.position = this.startPosition = startPosition;
        this.node = parsedBrowscapMatcher.fragmentTreeRoot;
    }

    moveAhead(char: string) {
        this.node = this.node.nextNodes.get(char);
        ++this.position;
        if (this.node && this.node.leafResult) {
            this.lastBrowscapMatch = this.node;
            this.matchedFragments.set(this.node.leafResult, true);
        }
        return !!this.node;
    }
}

class PositionalBrowscapFragmentMatcher {
    readonly parsedBrowscapMatcher: ParsedBrowscapMatcher;
    readonly sample: string;
    readonly positionalBrowscapCharMatchSets: PositionalBrowscapCharMatchSet[] = [];

    constructor(parsedBrowscapMatcher: ParsedBrowscapMatcher, sample: string) {
        this.parsedBrowscapMatcher = parsedBrowscapMatcher;
        this.sample = sample;
    }

    build() {
        // 1
        // fragment tree match from each sample position, get all valid
        // method result is ~ runtime pattern tree

        for (let startPos = 0; startPos < this.sample.length; ++startPos) {
            let currentSet = new PositionalBrowscapCharMatchSet(this.parsedBrowscapMatcher, startPos);
            this.positionalBrowscapCharMatchSets[startPos] = currentSet;

            inner:
            for (let i = startPos; i < this.sample.length; ++i) {
                let char = this.sample[i];
                if (!currentSet.moveAhead(char)) {
                    break inner;
                }
            }

            //console.log("startPos:", startPos, " fragment matches:", Array.from(currentSet.matchedFragments.keys()));
        }
    }

}

//check if value is primitive
function isPrimitive(obj)
{
    return (obj !== Object(obj));
}

function shallowEqual(obj1, obj2, properties={}, exceptProperties={}) {

    if(obj1 === obj2) // it's just the same object. No need to compare.
        return true;

    if(isPrimitive(obj1) && isPrimitive(obj2)) // compare primitives
        return obj1 === obj2;

    // compare objects with same number of keys
    for(let key in properties)
    {
        if (!exceptProperties[key]) {
            if((key in obj1)!==(key in obj2)) return false;
            if(obj1[key]!==obj2[key]) return false;
        }
    }

    return true;
}

function copyProperties(src, dest, properties) {
    for(let key in properties)
    {
        dest[key] = src[key];
    }
}

function deleteProperties(obj, properties) {
    for(let key in properties)
    {
        delete obj[key];
    }
}

function replaceUnknown(obj) {
    for(let key in obj)
    {
        if (obj[key]==="unknown") {
            obj[key] = undefined;
        }
    }
}

function commonProperties<T>(vs: (T&object)[]) {
    let v0 = vs[0];
    let vs1 = vs.slice(1);
    let result:T = {} as any;

    for (let key of Object.keys(v0)) {
        let isCommon = 1;
        for (let v of Object.values(vs1)) {
            if (v0[key]!==v[key]) {
                isCommon = 0;
                break;
            }
        }
        if (isCommon) {
            result[key] = v0[key];
        }
    }
    return result;
}

function compressObjectIntoTree<T>(vs0: T[], uniqueProps:object, results: Map<string, T>, primaryKey: string, groupArrayKey: string) {
    do {
        let first = Object.assign({},vs0.shift());
        let id = first[primaryKey];

        let ua1 = {} as any;
        copyProperties(first, ua1, uniqueProps);
        deleteProperties(first, uniqueProps);

        let uas = [ua1];

        let vs = Array.from(vs0.values());
        let i = 0;

        for (let v of vs) {
            if (shallowEqual(first, v, first, uniqueProps)) {
                let ua = {} as any;
                copyProperties(v, ua, uniqueProps);
                uas.push(ua);
                vs0.splice(i, 1);
            } else {
                ++i;
            }
        }

        first[groupArrayKey] = uas;

        results.set(id, first);

    } while (vs0.length);
}

export interface MapLike<T> {
    [index:string]: T;
}

export class BrowscapMatchResult {
    private _results = new Map<string, BrowscapRecord>();
    private _resultObj: Record<string,BrowscapRecord>;
    private _compressedResults: BrowscapMatchResult;

    merge(other: BrowscapMatchResult) {
        for (let match of other._results.entries()) {
            this._results.set(match[0], match[1]);
        }
    }
    mergeReversed(other: BrowscapMatchResult) {
        for (let match of other._results.entries()) {
            this._results.set(reversedString(match[0]), match[1]);
        }
    }

    get(key: string): BrowscapRecord {
        return this._results.get(key);
    }
    set(key: string, record: BrowscapRecord) {
        this._results.set(key, record);
    }


    get size() {
        return this._results.size;
    }

    get asObj(): Record<string,BrowscapRecord> {
        if (!this._resultObj) {
            this._resultObj = {};
            for (let match of this._results.entries()) {
                this._resultObj[match[0]] = match[1];
            }
        }
        return this._resultObj;
    }

    get asMap(): ReadonlyMap<string, BrowscapRecord> {
        return this._results;
    }

    get compressedResults(): BrowscapMatchResult {
        if (!this._compressedResults) {
            this._compressedResults = new BrowscapMatchResult();
            this._compressedResults._compressedResults = this._compressedResults;

            let mainUniqueProps={
                PropertyName:1,
                Parent: 1,
                Comment: 1,
                Browser: 1,
                Browser_Bits: 1,
                Platform_Bits: 1,
                Version: 1,
                MajorVer: 1,
                MinorVer: 1
            };
            let uaUniqueProps={
                PropertyName:1
            };
            
            let vs1 = Array.from(this._results.values());
            compressObjectIntoTree(vs1, mainUniqueProps, this._compressedResults._results, "PropertyName", "UserAgents");

            for (let compres of this._compressedResults._results.values()) {
                //if (compres.Platform && !compres.Platform_Kind) {
                //    console.log("ERROR Platform:",compres.Platform,"Platform_Kind:",compres.Platform_Kind);
                //    process.exit(1);
                //}
                let vs2 = Array.from(compres.UserAgents);
                let uas = new Map<string, BasicBrowscapUserAgent>();
                compressObjectIntoTree(vs2, uaUniqueProps, uas, "PropertyName", "_UserAgentPatterns");
                compres.UserAgents = Array.from(uas.values());
                for (let compua of uas.values()) {
                    compua.UserAgentPatterns = compua["_UserAgentPatterns"].map(obj=>obj.PropertyName);
                    delete compua["_UserAgentPatterns"];
                }
            }

            this._compressedResults._results.set("$common", commonProperties(Array.from(this._compressedResults._results.values())));

        }
        return this._compressedResults;
    }
}
class BrowscapMatcherGroup {
    readonly parsedBrowscapMatcher: ParsedBrowscapMatcher;
    readonly patternTreeRoot: BrowscapMatcherNode;
    readonly positionalFragments:PositionalBrowscapFragmentMatcher;
    readonly starbefore: boolean;

    readonly endPosition: number;
    readonly results = new BrowscapMatchResult();

    constructor(parsedBrowscapMatcher: ParsedBrowscapMatcher, patternTreeRoot: BrowscapMatcherNode, positionalFragments:PositionalBrowscapFragmentMatcher, starbefore: boolean=false) {
        this.parsedBrowscapMatcher = parsedBrowscapMatcher;
        this.patternTreeRoot = patternTreeRoot;
        this.positionalFragments = positionalFragments;
        this.starbefore = starbefore;
        this.endPosition = this.positionalFragments.sample.length;
    }

    match() {

        // 2
        // walk through runtime and model pattern trees, their intersection is the result

        this.traversePatternAndSampleTree(this.patternTreeRoot, 0, this.starbefore);

    }

    traversePatternAndSampleTree(modelFragmNode: BrowscapMatcherNode, startPosition: number, starBefore=false) {
        let found = false;
        if (starBefore) {
            for (let pos = startPosition; pos < this.endPosition; ++pos) {
                found = this.traversePatternAndSampleTreeFromPos(modelFragmNode, pos) || found;
            }
        } else {
            found = this.traversePatternAndSampleTreeFromPos(modelFragmNode, startPosition);
        }
        return found;
    }

    traversePatternAndSampleTreeFromPos(modelFragmNode: BrowscapMatcherNode, startPosition: number) {


        let found = false;
        let fs = 0;
        let currentSet = this.positionalFragments.positionalBrowscapCharMatchSets[startPosition];

        if (currentSet) {

            for (let runtimeBrowscapMatch of currentSet.matchedFragments.keys()) {
                let nextStartPos = startPosition + runtimeBrowscapMatch.length;

                let modelNext = modelFragmNode.nextNodes.get(runtimeBrowscapMatch);
                if (modelNext) {
                    if (modelNext.leafResult) {
                        if (nextStartPos == this.endPosition || modelNext.asterixAfterLeaf) {
                            let value = _parsedBrowscapMatcher.mergeProperties(modelNext.leafResultRecord);
                            //if (value.Platform && !value.Platform_Kind) {
                            //    console.log("ERROR Platform:",value.Platform,"Platform_Kind:",value.Platform_Kind);
                            //    process.exit(1);
                            //}
                            this.results.set(modelNext.leafResult, value);
                            found = true;
                        }
                    }
                    found = this.traversePatternAndSampleTree(modelNext, nextStartPos, true) || found;
                } else {
                    //debug
                    //let col1 = `'${this.positionalFragments.sample.slice(0, nextStartPos)}'`;
                    //let col2 = `Failure: '${modelFragmNode.intermediateResult}*' no:'${runtimeBrowscapMatch}'`;
                    //let pad = "".padStart(this.endPosition + 4 - col1.length)
                    //console.log(col1+pad+col2);
                }
                ++fs;
            }
        } else if (startPosition != this.endPosition) {
            console.warn(`startPosition != this.endPosition :  ${startPosition} != ${this.endPosition}`);
            process.exit(1);
        }

        //debug
        //if (fs) {
        //    let col1 = `'${this.positionalFragments.sample.slice(0, startPosition)}'`;
        //    let col2 = `${found?"SUCCESS":"Failure"}: '${modelFragmNode.intermediateResult}*'`;
        //    let pad = "".padStart(this.endPosition + 4 - col1.length)
        //    console.log(col1+pad+col2);
        //}

        return found;
    }
/*
Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/133.0.0.0 Safari/537.36
Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.79 Safari/537.36
*/
}

class BidirectionalBrowscapMatcherGroup extends BrowscapMatcherGroup {

    constructor(parsedBrowscapMatcher: ParsedBrowscapMatcher, patternTreeRoot: BrowscapMatcherNode, positionalFragments:PositionalBrowscapFragmentMatcher) {
        super(parsedBrowscapMatcher, patternTreeRoot, positionalFragments, true);
    }

}
class BrowscapMatcherRuntime {
    readonly parsedBrowscapMatcher: ParsedBrowscapMatcher;
    readonly sample: string;
    readonly rsample: string;

    readonly endPosition: number;

    readonly allResults = new BrowscapMatchResult();

    forwardFragments: PositionalBrowscapFragmentMatcher;
    backwardFragments: PositionalBrowscapFragmentMatcher;

    forwards: BrowscapMatcherGroup;
    backwards: BrowscapMatcherGroup;
    bidirectional: BidirectionalBrowscapMatcherGroup;

    constructor(parsedBrowscapMatcher: ParsedBrowscapMatcher, sample: string) {
        this.parsedBrowscapMatcher = parsedBrowscapMatcher;
        this.sample = sample.toLowerCase();
        this.rsample = reversedString(sample);

        this.forwardFragments = new PositionalBrowscapFragmentMatcher(this.parsedBrowscapMatcher, this.sample);
        this.backwardFragments = new PositionalBrowscapFragmentMatcher(this.parsedBrowscapMatcher, this.rsample);

        this.forwards = new BrowscapMatcherGroup(this.parsedBrowscapMatcher, parsedBrowscapMatcher.patternTreeRootNoAsterix, this.forwardFragments);
        this.backwards = new BrowscapMatcherGroup(this.parsedBrowscapMatcher, parsedBrowscapMatcher.reversePatternTreeRootNoAsterix, this.backwardFragments);
        this.bidirectional = new BidirectionalBrowscapMatcherGroup(this.parsedBrowscapMatcher, parsedBrowscapMatcher.patternTreeRootBothAsterix, this.forwardFragments);
    }

    run() {
        // 1
        // fragment tree match from each sample position, get all valid
        // results in -~-> runtime pattern tree

        //console.log("FORWARDS:", this.forwardFragments.sample);
        this.forwardFragments.build();
        //console.log("");

        //console.log("BACKWARDS:", this.backwardFragments.sample);
        this.backwardFragments.build();
        //console.log("");


        // 2
        // walk through runtime and model pattern trees, their intersection is the result

        this.forwards.match();
        this.backwards.match();
        this.bidirectional.match();

        // 3
        // merge all results considering .. *.. ..* and *..* patterns

        this.allResults.merge(this.forwards.results);
        this.allResults.mergeReversed(this.backwards.results);
        this.allResults.merge(this.bidirectional.results);

        return this.allResults;
    }

}



function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}


function bcmatch(parsedBrowscapMatcher: ParsedBrowscapMatcher, sample: string) {

    if (debug) console.time('match');

    let rt = new BrowscapMatcherRuntime(parsedBrowscapMatcher, sample);

    let matches = rt.run();

    if (debug) console.timeEnd('match');

    return matches;
}




// export

var _parsedBrowscapMatcher: ParsedBrowscapMatcher;

/**
 * Matches sample against pattern database records. It initializes internal database automatically if was not yet done.
 */
export function findBrowscapRecords(sample: string) {

    initializeDatabase();

    if (debug) console.log("Sample:", sample);
    let matches = bcmatch(_parsedBrowscapMatcher, sample);

    if (debug) {
        console.log("Records:");
        console.log(JSON.stringify(matches.compressedResults.asObj,null,2));
    }

    return matches;
}

/**
 * Extract missing data files from ZIP archives. (Otherwise being done automatically.)
 */
export function initializeDataFiles() {
    if (!_parsedBrowscapMatcher) {
        _parsedBrowscapMatcher = global["parsedBrowscapMatcher"];
    }

    if (!_parsedBrowscapMatcher) {
        global["parsedBrowscapMatcher"] = _parsedBrowscapMatcher = new ParsedBrowscapMatcher();
    }

    _parsedBrowscapMatcher.extractJsonIfNotExists();
}

/**
 * Loads and initializes internal database and grammar parse trees. (Otherwise being done automatically.)
 */
export function initializeDatabase() {
    if (!_parsedBrowscapMatcher) {
        _parsedBrowscapMatcher = global["parsedBrowscapMatcher"];
    }

    if (!_parsedBrowscapMatcher) {
        global["parsedBrowscapMatcher"] = _parsedBrowscapMatcher = new ParsedBrowscapMatcher();
    }

    if (!_parsedBrowscapMatcher.built) {
        console.time('initializeDatabase');

        _parsedBrowscapMatcher.buildFromJson();
        
        console.timeEnd('initializeDatabase');
    }

    return _parsedBrowscapMatcher;
}

/**
 * Deletes references to all preloaded data, marking as target for garbage collector to remove it from heap.
 */
export function uninitializeDatabase(gc=true,warngc=true) {
    global["parsedBrowscapMatcher"] = _parsedBrowscapMatcher = undefined;

    if (gc) {
        if (global.gc) {
            global.gc();
        } else if (warngc) {
            console.log('Garbage collection unavailable.  Pass --expose-gc '
            + 'when launching node to enable forced garbage collection.');
        }
    }
}


/**
 * Runs tests.
 */
export async function testBrowscap() {
    console.time('tests');

    saveBodyRecords = true;
    initializeDatabase();

    console.time('matchers');

    let subvalid=0;
    let subtotal=0;
    let valid=0;
    let total=0;
    function add(userAgent:string){
        let lstresult = findBrowscapRecords(userAgent);
        if (lstresult.size) ++subvalid;
        ++subtotal;

        if (testIntegrity) {
            lstresult.compressedResults;
        }
    };
    function printStats() {
        console.log("Valid:",subvalid,"/",subtotal,(subvalid*100/subtotal).toFixed(0)+"%");
        valid += subvalid;
        total += subtotal;
        subvalid=0;
        subtotal=0;
    }
    function printAllStats() {
        console.log("");
        console.log("");
        console.log("ALL");
        console.log("--------------------------");
        console.log("Valid:",valid,"/",total,(valid*100/total).toFixed(0)+"%");
        valid=0;
        total=0;
    }
    function countUnitTestRes(msg: string, expect:number, received:number) {
        if (expect===received) {
            ++subvalid;
            if (debug) console.log("Success  ",msg," expected:",expect," OK");
        } else {
            if (debug) console.log("Failure  ",msg," expected:",expect," received:",received);
        }
        ++subtotal;
    }
    function bmatchUnitTest(machter:ParsedBrowscapMatcher, sample:string, expect:number) {
        let matches1 = bcmatch(machter, sample);
        countUnitTestRes(`Sample:"${sample}"`, expect, matches1.size);
        if (expect !== matches1.size) {
            console.log("Failure  ",`Sample:"${sample}"`," expected:",expect," received:",matches1.size);
            console.log(JSON.stringify(matches1.asObj,null,2));
        }
    }

    debug = false;
    saveBodyRecords = false;
    printInits = false;

    let _englishWords0 = fs.readFileSync(__dirname+'/../data/english-words.txt').toString();
    let _englishWords = _englishWords0.split("\n");
    let englishWords:Record<string,string[]>={};
    for (let w of _englishWords) {
        w = w.toLowerCase();
        let byCapital = englishWords[w[0]];
        if (!byCapital) {
            englishWords[w[0]] = byCapital = [];
        }
        byCapital.push(w);
    }

    console.log("Basic test matcher engine (all should be 100%)");
    console.log("--------------------------------------------------");
    function buildAbcMatcher(pref:string,postf:string,from='a',to='z') {
        let fakeBrowscap = new ParsedBrowscapMatcher();
        let abc:BrowscapRecord[] = [];
        let a = from.charCodeAt(0);
        let z = to.charCodeAt(0);
        for (let ed=z; ed>=a; --ed) {
            let words = [];
            for (let l=a; l<=ed; ++l) {
                words.push(String.fromCharCode(l)+"*");
            }
            let rec = {PropertyName:pref+words.join(" ")+postf, Parent:"DefaultProperties"} as BrowscapRecord;
            abc.push(rec);
            if (debug) console.log(rec);
        }
        fakeBrowscap.build(abc);
        fakeBrowscap.defaultProperties = {} as BrowscapRecord;
        return fakeBrowscap;
    }
    function buildZyxMatcher(pref:string,postf:string,from='a',to='z') {
        let fakeBrowscap = new ParsedBrowscapMatcher();
        let abc:BrowscapRecord[] = [];
        let a = from.charCodeAt(0);
        let z = to.charCodeAt(0);
        for (let bg=a; bg<=z; ++bg) {
            let words = [];
            for (let l=bg; l<=z; ++l) {
                words.push(String.fromCharCode(l)+"*");
            }
            let rec = {PropertyName:pref+words.join(" ")+postf, Parent:"DefaultProperties"} as BrowscapRecord;
            abc.push(rec);
            if (debug) console.log(rec);
        }
        fakeBrowscap.build(abc);
        fakeBrowscap.defaultProperties = {} as BrowscapRecord;
        return fakeBrowscap;
    }

    let nonrndscramblecnt=0;
    // generate sentences like "A big cat danced elegantly"
    function genSentence(pref:string,postf:string,from='a',to='z') {
        let words:string[] = [];
        let a = from.charCodeAt(0);
        let z = to.charCodeAt(0);
        for (let l=a; l<=z; ++l) {
            let letter = String.fromCharCode(l);
            let byCapital = englishWords[letter];
            if (!byCapital) {
                console.log(`Error, missing letter '${letter}'`);
                process.exit(1);
            }
            words.push(byCapital[nonrndscramblecnt%byCapital.length]);
        }
        return pref+words.join(" ")+postf;
    }
    function tastRndSentences(machter:ParsedBrowscapMatcher, desc:{from:string,to:string,pref:string,postf:string}, both=false) {
        let expect = desc.to.charCodeAt(0)-desc.from.charCodeAt(0)+1;
        for (let i=0; i<100; ++i) {
            bmatchUnitTest(machter, genSentence(desc.pref, "", desc.from, desc.to), both?expect:0);
            bmatchUnitTest(machter, genSentence(desc.pref, desc.postf, desc.from, desc.to), expect);
        }
    }

    let scs1 = [{from:'a',to:'b'}, {from:'a',to:'e'}, {from:'a',to:'k'}, {from:'a',to:'p'}, {from:'a',to:'z'}];
    let scs2 = [{from:'y',to:'z'}, {from:'p',to:'z'}, {from:'k',to:'z'}, {from:'e',to:'z'}, {from:'a',to:'z'}];

    console.log("Case ..");
    let fakeBrowscap1 = buildAbcMatcher("",".");
    for (let sc of scs1) {
        tastRndSentences(fakeBrowscap1, Object.assign({pref:"",postf:"."},sc));
    }
    printStats();

    console.log("Case ..*");
    let fakeBrowscap2 = buildAbcMatcher("","");
    for (let sc of scs1) {
        tastRndSentences(fakeBrowscap2, Object.assign({pref:"",postf:""},sc), true);
    }
    printStats();

    console.log("Case *.. (reverse matcher)");
    let fakeBrowscap3= buildZyxMatcher("*",".");
    for (let sc of scs2) {
        tastRndSentences(fakeBrowscap3, Object.assign({pref:"",postf:"."},sc));
    }
    printStats();

    printAllStats();



    console.log("");
    console.log("");
    console.log("https://www.link-assistant.com/seo-wiki/user-agent/");
    console.log("--------------------------");

    // https://www.link-assistant.com/seo-wiki/user-agent/
    add("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.79 Safari/537.36");

    // Microsoft Edge on Windows
    add("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36 Edg/119.0.0.0");

    // Google Chrome on Mac OS X
    add("Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36");

    // Google Chrome on Windows
    add("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36");

    // Mozilla Firefox on Windows
    add("Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/119.0");

    // Safari on iPhone (iOS) and iPad (iPadOS)
    add("Mozilla/5.0 (iPhone; CPU iPhone OS 16_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.5 Mobile/15E148 Safari/604.1");
    add("Mozilla/5.0 (iPad; CPU OS 16_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.5 Mobile/15E148 Safari/604.1");

    // Chrome on Android
    add("Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Mobile Safari/537.36");

    // Samsung Galaxy S22 5G:
    add("Mozilla/5.0 (Linux; Android 13; SM-S901B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Mobile Safari/537.36");

    console.log("");
    printStats();

    console.log("");
    console.log("");
    console.log("playwright");
    console.log("--------------------------");

    // playwright devices
    let devices = loadJSONSync(__dirname+'/../data/test/devices.json');
    for (let devicedesc of Object.values(devices)) {
        let ua:string = devicedesc["userAgent"];
        add(ua);
    }
    console.log("");
    printStats();

    console.log("");
    console.log("");
    console.log("generalized playwright");
    console.log("--------------------------");

    // playwright devices with variables
    let varDevices = loadJSONSync(__dirname+'/../data/test/devices-var.json');
    for (let devicedesc of Object.values(varDevices)) {
        let ua:string = devicedesc["userAgent"];
        ua = ua.replace("${mozilla-version}", "5.0");
        ua = ua.replace(/\$\{.*?\}/g, "*");
        add(ua);
    }
    console.log("");
    printStats();


    {
        console.log("");
        console.log("");
        console.log("whatismybrowser");
        console.log("--------------------------");

        extractSingleFileFromZip(__dirname+"/../data/test/whatismybrowser-user-agents.zip", __dirname+"/../data/test/whatismybrowser-user-agents.csv", "whatismybrowser-user-agents.csv");

        let buf = fs.readFileSync(__dirname+"/../data/test/whatismybrowser-user-agents.csv");

        let rows = buf.toString().split("\n");

        for (let row of rows) {
            let matcher = /^\"(.*)\"$/.exec(row);
            if (matcher) {
                row = matcher[1];
            } else if (!row.trim()){
                continue;
            } else {
                console.warn(`Invalid row:"${row}"`);
                continue;
            }
            add(row);
        }
        console.log("");
        printStats();
    }

    
    debug = true;
    
    console.log("");
    console.log("");
    console.log("Showing result");
    console.log("--------------------------");
    add("Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/133.0.0.0 Safari/537.36");

    console.log("");
    printStats();

    console.log("");
    printAllStats();


    debug = false;
    
    console.log("");
    console.log("");
    console.log("SELF-TEST (takes a while, should be 100%)");
    console.log("------------------------------------------------------");

    // direct patterns from browscap.json (should match)
    for (let bcrec of savedBodyRecords) {
        add(bcrec.PropertyName);
    }
    console.log("");
    printStats();


    console.timeEnd('matchers'); //Prints something like that-> tests: 11374.004ms

    console.timeEnd('tests'); //Prints something like that-> tests: 11374.004ms

    if (global.gc) {
        global.gc();
    } else {
        console.log('Garbage collection unavailable.  Pass --expose-gc '
        + 'when launching node to enable forced garbage collection.');
    }

    // to check consumed memory (3 mins)
    await(sleep(180000));
}


if (argv.indexOf("--initBrowscap")!=-1) {
    initializeDataFiles();
}

if (argv.indexOf("--initBrowscapDb")!=-1) {
    initializeDatabase();
}

if (argv.indexOf("--testBrowscap")!=-1) {
    testBrowscap();
}
