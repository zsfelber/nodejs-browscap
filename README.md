# nodejs-browscap
http://browscap.org/ port for nodejs, php is not required

It's initializing from 'browscap.json' directly, this file is maintained regularly in nodejs-browscap package.

Browscap release information :
```
nodejs-browscap version: 1.0.0 ...
GJK Browscap Version: 6001008,
GJK Browscap Version Released: Wed, 19 Feb 2025 15:58:54 +0000
```

# Impl

Implemented in typescript. It is initializing an internal grammar's search tree at first invocation time, which takes a few seconds. Metadata is kept in memory afterwards. 
```
Load patterns input file...
Extracting json...
...
buildSearchTree: 8.088s
initializeDatabase: 9.690s

```
Searching algorithm is quite efficient. Current Browscap pattern database consists of 446k records, and any requested sample is being matched against each of them. (It returns all possible matched records.) Still, on my desktop env:

```
matchers: 18.134s
matchers:  18134 msecs   items cnt: 63500   286 µsecs per item
```

So the average matching time was 286 μsecs.

# Usage

```
npm i nodejs-browscap

```

```

import {findBrowscapRecords} from "nodejs-browscap";


let sample = "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/133.0.0.0 Safari/537.36";

let matches:BrowscapMatchResult = findBrowscapRecords(sample);

if (debug) {
    console.log("Records:");
    console.log(JSON.stringify(matches.compressedResults.asObj,null,2));
}

```

### Output

```

Records:
{
  "Mozilla/5.0 (*Linux*x86_64*)*applewebkit*(*khtml*like*gecko*)*Chrome/*": {
    "Browser_Type": "Browser",
    "Browser_Maker": "Google Inc",
    "Platform": "Linux",
    "Platform_Description": "Linux",
    "Platform_Maker": "Linux Foundation",
    "Alpha": false,
    "Beta": false,
    "Win16": false,
    "Win32": false,
    "Win64": false,
    "Frames": true,
    "IFrames": true,
    "Tables": true,
    "Cookies": true,
    "BackgroundSounds": false,
    "JavaScript": true,
    "VBScript": false,
    "JavaApplets": false,
    "ActiveXControls": false,
    "isMobileDevice": false,
    "isTablet": false,
    "isSyndicationReader": false,
    "Crawler": false,
    "isFake": false,
    "isAnonymized": false,
    "isModified": false,
    "CssVersion": 3,
    "AolVersion": 0,
    "Device_Name": "Linux Desktop",
    "Device_Type": "Desktop",
    "Device_Pointing_Method": "mouse",
    "Device_Code_Name": "Linux Desktop",
    "RenderingEngine_Name": "Blink",
    "RenderingEngine_Description": "a WebKit Fork by Google",
    "RenderingEngine_Maker": "Google Inc",
    "Platform_Kind": "Linux",
    "UserAgents": [
      {
        "Parent": "Chrome Generic",
        "Comment": "Chrome Generic",
        "Browser": "Chrome",
        "Browser_Bits": 64,
        "Platform_Bits": 64,
        "Version": "0.0",
        "MajorVer": "0",
        "MinorVer": "0",
        "UserAgentPatterns": [
          "Mozilla/5.0 (*Linux*x86_64*)*applewebkit*(*khtml*like*gecko*)*Chrome/*",
          "Mozilla/5.0 (*Linux*x86_64*)*applewebkit*(*khtml*like*gecko*)*Chrome/* Safari/*"
        ]
      },
      {
        "Parent": "Chrome 133.0",
        "Comment": "Chrome 133.0",
        "Browser": "Chrome",
        "Browser_Bits": 64,
        "Platform_Bits": 64,
        "Version": "133.0",
        "MajorVer": "133",
        "MinorVer": "0",
        "UserAgentPatterns": [
          "Mozilla/5.0 (*Linux*x86_64*) applewebkit* (*khtml*like*gecko*) Chrome/133.0*Safari/*"
        ]
      },
      {
        "Parent": "Chrome Generic",
        "Comment": "Chrome Generic",
        "Browser": "Chrome",
        "Browser_Bits": 32,
        "Platform_Bits": 32,
        "Version": "0.0",
        "MajorVer": "0",
        "MinorVer": "0",
        "UserAgentPatterns": [
          "Mozilla/5.0 (*Linux*)*applewebkit*(*khtml*like*gecko*)*Chrome/*",
          "Mozilla/5.0 (*Linux*)*applewebkit*(*khtml*like*gecko*)*Chrome/* Safari/*"
        ]
      },
      {
        "Parent": "Chrome 133.0",
        "Comment": "Chrome 133.0",
        "Browser": "Chrome",
        "Browser_Bits": 32,
        "Platform_Bits": 32,
        "Version": "133.0",
        "MajorVer": "133",
        "MinorVer": "0",
        "UserAgentPatterns": [
          "Mozilla/5.0 (*Linux*) applewebkit* (*khtml*like*gecko*) Chrome/133.0*Safari/*"
        ]
      }
    ]
  },
  "Mozilla/5.0 (*Linux*x86_64*) applewebkit*(*khtml*like*gecko*)*Safari*": {
    "Browser_Type": "Browser",
    "Browser_Maker": "Apple Inc",
    "Platform": "Linux",
    "Platform_Description": "Linux",
    "Platform_Maker": "Linux Foundation",
    "Alpha": false,
    "Beta": false,
    "Win16": false,
    "Win32": false,
    "Win64": false,
    "Frames": true,
    "IFrames": true,
    "Tables": true,
    "Cookies": true,
    "BackgroundSounds": false,
    "JavaScript": true,
    "VBScript": false,
    "JavaApplets": true,
    "ActiveXControls": false,
    "isMobileDevice": false,
    "isTablet": false,
    "isSyndicationReader": false,
    "Crawler": false,
    "isFake": false,
    "isAnonymized": false,
    "isModified": false,
    "CssVersion": 3,
    "AolVersion": 0,
    "Device_Name": "Linux Desktop",
    "Device_Type": "Desktop",
    "Device_Pointing_Method": "mouse",
    "Device_Code_Name": "Linux Desktop",
    "RenderingEngine_Name": "WebKit",
    "RenderingEngine_Description": "For Google Chrome, iOS (including both mobile Safari, WebViews within third-party apps, and web clips), Safari, Arora, Midori, OmniWeb, Shiira, iCab since version 4, Web, SRWare Iron, Rekonq, and in Maxthon 3.",
    "RenderingEngine_Maker": "Apple Inc",
    "Platform_Kind": "Linux",
    "UserAgents": [
      {
        "Parent": "Safari Generic",
        "Comment": "Safari Generic",
        "Browser": "Safari",
        "Browser_Bits": 64,
        "Platform_Bits": 64,
        "Version": "0.0",
        "MajorVer": "0",
        "MinorVer": "0",
        "UserAgentPatterns": [
          "Mozilla/5.0 (*Linux*x86_64*) applewebkit*(*khtml*like*gecko*)*Safari*"
        ]
      }
    ]
  },
  "$common": {
    "Browser_Type": "Browser",
    "Platform": "Linux",
    "Platform_Description": "Linux",
    "Platform_Maker": "Linux Foundation",
    "Alpha": false,
    "Beta": false,
    "Win16": false,
    "Win32": false,
    "Win64": false,
    "Frames": true,
    "IFrames": true,
    "Tables": true,
    "Cookies": true,
    "BackgroundSounds": false,
    "JavaScript": true,
    "VBScript": false,
    "ActiveXControls": false,
    "isMobileDevice": false,
    "isTablet": false,
    "isSyndicationReader": false,
    "Crawler": false,
    "isFake": false,
    "isAnonymized": false,
    "isModified": false,
    "CssVersion": 3,
    "AolVersion": 0,
    "Device_Name": "Linux Desktop",
    "Device_Type": "Desktop",
    "Device_Pointing_Method": "mouse",
    "Device_Code_Name": "Linux Desktop",
    "Platform_Kind": "Linux"
  }
}

```

# Tests and execution times


```
cd <a safe dir>
gh repo clone zsfelber/nodejs-browscap && cd nodejs-browscap
npm run test
```

Now, you are able to review speed data and memory consumption. (Open Task Manager or System Monitor / run 'top' in a linux shell). 
Latter one is about 1 Gbyte currently.

### Output is as follows

```
nodejs-browscap@1.0.3 test
> node --expose-gc -r esbuild-register src/index.ts --testBrowscap

...

Generate search tree...
Total fragment nodes   normal: 4461288/161193   reverse: 9/85
Total patterns: 446406   ..*? : 445348/862619   *.. : 2/8   *..* : 1056/1813
buildSearchTree: 8.288s
initializeDatabase: 9.908s


Test matcher engine basics (all should be 100%)
--------------------------------------------------
Case ..
Valid: 1000 / 1000 100%
Case ..*
Valid: 1000 / 1000 100%
Case *.. (reverse matcher)
Valid: 1000 / 1000 100%
Case *..*
Valid: 200 / 200 100%


...

ALL
--------------------------
Valid: 10045 / 10300 98%


SELF-TEST (should be 100%)
------------------------------------------------------

Success. Valid: 50000 / 50000 100%
matchers: 18.134s
matchers:  18134 msecs   items cnt: 63500   286 µsecs per item
tests: 28.044s


```



# Uninitializing

```
import {findBrowscapRecords, uninitializeDatabase} from "nodejs-browscap";

// ...
// repetitive heavy findBrowscapRecords tasks
// ...

uninitializeDatabase();

```

It may complain about :
```
Garbage collection unavailable.  Pass --expose-gc when launching node to enable forced garbage collection.

```
You can get rid of that passing that option in command line:
```
npm run test -- --expose-gc
```

or configuring "scripts" in your package.json as follows:

```
  "scripts": {
    "test": "node --expose-gc -r esbuild-register src/index.ts --testBrowscap"
  },
```

alternatively suppress that warning message

```
uninitializeDatabase(false);

```


# API

## :toolbox: Functions

- [findBrowscapRecords](#gear-findbrowscaprecords)
- [initializeDataFiles](#gear-initializedatafiles)
- [initializeDatabase](#gear-initializedatabase)
- [uninitializeDatabase](#gear-uninitializedatabase)
- [testBrowscap](#gear-testbrowscap)

### :gear: findBrowscapRecords

Matches sample against pattern database records. It initializes internal database automatically if was not yet done.

| Function | Type |
| ---------- | ---------- |
| `findBrowscapRecords` | `(sample: string) => BrowscapMatchResult` |

### :gear: initializeDataFiles

Extract missing data files from ZIP archives. (Otherwise being done automatically.)

| Function | Type |
| ---------- | ---------- |
| `initializeDataFiles` | `(replaceUnknownStrToUndefined?: boolean) => void` |

Parameters:

* `replaceUnknownStrToUndefined`: replace "unknown" strings to javascript undefined in database


### :gear: initializeDatabase

Loads and initializes internal database and grammar parse trees. (Otherwise being done automatically.)

| Function | Type |
| ---------- | ---------- |
| `initializeDatabase` | `(replaceUnknownStrToUndefined?: boolean) => ParsedBrowscapMatcher` |

Parameters:

* `replaceUnknownStrToUndefined`: replace "unknown" strings to javascript undefined in database


### :gear: uninitializeDatabase

Deletes references to all preloaded data, marking as target for garbage collector to remove it from heap.

| Function | Type |
| ---------- | ---------- |
| `uninitializeDatabase` | `(gc?: boolean, warngc?: boolean) => void` |

### :gear: testBrowscap

Runs tests.

| Function | Type |
| ---------- | ---------- |
| `testBrowscap` | `() => Promise<void>` |


## :wrench: Constants

- [PlatformKinds](#gear-platformkinds)

### :gear: PlatformKinds

| Constant | Type |
| ---------- | ---------- |
| `PlatformKinds` | `Record<PlatformCode, PlatformKind>` |


## :factory: ParsedBrowscapMatcher

### Methods

- [extractJsonIfNotExists](#gear-extractjsonifnotexists)
- [buildFromJson](#gear-buildfromjson)
- [build](#gear-build)
- [mergeProperties](#gear-mergeproperties)

#### :gear: extractJsonIfNotExists

| Method | Type |
| ---------- | ---------- |
| `extractJsonIfNotExists` | `() => void` |

#### :gear: buildFromJson

| Method | Type |
| ---------- | ---------- |
| `buildFromJson` | `() => void` |

#### :gear: build

| Method | Type |
| ---------- | ---------- |
| `build` | `(bodyRecords: BrowscapRecord[]) => void` |

#### :gear: mergeProperties

| Method | Type |
| ---------- | ---------- |
| `mergeProperties` | `(properties: BrowscapRecord) => BrowscapRecord` |

### Properties

- [replaceUnknownStrToUndefined](#gear-replaceunknownstrtoundefined)
- [header](#gear-header)
- [headerComments](#gear-headercomments)
- [defaultProperties](#gear-defaultproperties)
- [parentProperties](#gear-parentproperties)
- [built](#gear-built)

#### :gear: replaceUnknownStrToUndefined

| Property | Type |
| ---------- | ---------- |
| `replaceUnknownStrToUndefined` | `boolean` |

#### :gear: header

| Property | Type |
| ---------- | ---------- |
| `header` | `BrowscapHeader` |

#### :gear: headerComments

| Property | Type |
| ---------- | ---------- |
| `headerComments` | `string[]` |

#### :gear: defaultProperties

| Property | Type |
| ---------- | ---------- |
| `defaultProperties` | `BrowscapRecord` |

#### :gear: parentProperties

| Property | Type |
| ---------- | ---------- |
| `parentProperties` | `Map<string, BrowscapRecord>` |

#### :gear: built

| Property | Type |
| ---------- | ---------- |
| `built` | `boolean` |

## :factory: BrowscapMatchResult

### Methods

- [merge](#gear-merge)
- [mergeReversed](#gear-mergereversed)
- [get](#gear-get)
- [set](#gear-set)

### Properties
- [size](#gear-size)
- [asObj](#gear-asObj)
- [asMap](#gear-asMap)
- [compressedResults](#gear-compressedResults)


#### :gear: merge

| Method | Type |
| ---------- | ---------- |
| `merge` | `(other: BrowscapMatchResult) => void` |

#### :gear: mergeReversed

| Method | Type |
| ---------- | ---------- |
| `mergeReversed` | `(other: BrowscapMatchResult) => void` |

#### :gear: get

| Method | Type |
| ---------- | ---------- |
| `get` | `(key: string) => BrowscapRecord` |

#### :gear: set

| Method | Type |
| ---------- | ---------- |
| `set` | `(key: string, record: BrowscapRecord) => void` |

#### :gear: size

| Property | Type | Get | Set |
| ---------- | ---------- | ---------- | ---------- |
| `size` | `number` | `yes` | `no` |

#### :gear: asObj

| Property | Type | Get | Set |
| ---------- | ---------- | ---------- | ---------- |
| `asObj` | `Record<string,BrowscapRecord>` | `yes` | `no` |

#### :gear: asMap

| Property | Type | Get | Set |
| ---------- | ---------- | ---------- | ---------- |
| `asMap` | `ReadonlyMap<string, BrowscapRecord>` | `yes` | `no` |

#### :gear: compressedResults

| Property | Type | Get | Set |
| ---------- | ---------- | ---------- | ---------- |
| `compressedResults` | `BrowscapMatchResult` | `yes` | `no` |

## :tropical_drink: Interfaces

- [BrowscapHeader](#gear-browscapheader)
- [BasicBrowscapUserAgentProperties](#gear-basicbrowscapuseragentproperties)
- [BasicBrowscapUserAgent](#gear-basicbrowscapuseragent)
- [BrowscapRecord](#gear-browscaprecord)

### :gear: BrowscapHeader



| Property | Type | Description |
| ---------- | ---------- | ---------- |
| `GJK_Browscap_Version` | `string or number` |  |
| `timestamp` | `string` |  |


### :gear: BasicBrowscapUserAgentProperties



| Property | Type | Description |
| ---------- | ---------- | ---------- |
| `Parent` | `string` |  |
| `Comment` | `string` |  |
| `Browser` | `string` |  |
| `Browser_Bits` | `number` |  |
| `Platform_Bits` | `number` |  |
| `Version` | `string or number` |  |
| `MajorVer` | `string or number` |  |
| `MinorVer` | `string or number` |  |


### :gear: BasicBrowscapUserAgent
#### extends BasicBrowscapUserAgentProperties


| Property | Type | Description |
| ---------- | ---------- | ---------- |
| `UserAgentPatterns` | `string[]` |  |


### :gear: BrowscapRecord



| Property | Type | Description |
| ---------- | ---------- | ---------- |
| `PropertyName` | `string` |  |
| `UserAgents` | `BasicBrowscapUserAgent[]` |  |
| `MasterParent` | `string` |  |
| `LiteMode` | `boolean` |  |
| `Parent` | `string` |  |
| `Comment` | `string` |  |
| `Browser` | `string` |  |
| `Browser_Type` | `BrowserType` |  |
| `Browser_Bits` | `number` |  |
| `Browser_Maker` | `string` |  |
| `Browser_Modus` | `string` |  |
| `Version` | `string or number` |  |
| `MajorVer` | `string` |  |
| `MinorVer` | `string` |  |
| `Platform` | `PlatformCode` |  |
| `Platform_Kind` | `PlatformKind` |  |
| `Platform_Version` | `string or number` |  |
| `Platform_Description` | `string` |  |
| `Platform_Bits` | `number` |  |
| `Platform_Maker` | `string` |  |
| `Alpha` | `boolean` |  |
| `Beta` | `boolean` |  |
| `Win16` | `boolean` |  |
| `Win32` | `boolean` |  |
| `Win64` | `boolean` |  |
| `Frames` | `boolean` |  |
| `IFrames` | `boolean` |  |
| `Tables` | `boolean` |  |
| `Cookies` | `boolean` |  |
| `BackgroundSounds` | `boolean` |  |
| `JavaScript` | `boolean` |  |
| `VBScript` | `boolean` |  |
| `JavaApplets` | `boolean` |  |
| `ActiveXControls` | `boolean` |  |
| `isMobileDevice` | `boolean` |  |
| `isTablet` | `boolean` |  |
| `isSyndicationReader` | `boolean` |  |
| `Crawler` | `boolean` |  |
| `isFake` | `boolean` |  |
| `isAnonymized` | `boolean` |  |
| `isModified` | `boolean` |  |
| `CssVersion` | `string or number` |  |
| `AolVersion` | `string or number` |  |
| `Device_Name` | `string` |  |
| `Device_Maker` | `string` |  |
| `Device_Type` | `DeviceType` |  |
| `Device_Pointing_Method` | `DevicePointingMethod` |  |
| `Device_Code_Name` | `string` |  |
| `Device_Brand_Name` | `string` |  |
| `RenderingEngine_Name` | `string` |  |
| `RenderingEngine_Version` | `string or number` |  |
| `RenderingEngine_Description` | `string` |  |
| `RenderingEngine_Maker` | `string` |  |


## :cocktail: Types

- [BrowserType](#gear-browsertype)
- [DeviceType](#gear-devicetype)
- [DevicePointingMethod](#gear-devicepointingmethod)
- [PlatformCode](#gear-platformcode)
- [PlatformKind](#gear-platformkind)

### :gear: BrowserType

| Type | Type |
| ---------- | ---------- |
| `BrowserType` | `"Application"\| "Browser"\| "Email Client"\| "Feed Reader"\| "Multimedia Player"\| "Offline Browser"\| "Bot"\| "Bot/Crawler"\| "Tool"` |

### :gear: DeviceType

| Type | Type |
| ---------- | ---------- |
| `DeviceType` | `"Desktop"\| "Tablet"\| "Mobile Device"\| "Mobile Phone"\| "TV Device"\| "Console"\| "Digital Camera"\| "Car Entertainment System"\| "Ebook Reader"` |

### :gear: DevicePointingMethod

| Type | Type |
| ---------- | ---------- |
| `DevicePointingMethod` | `"mouse"\| "touchscreen"\| "trackball"\| "joystick"\| "clickwheel"\| "stylus"` |

### :gear: PlatformCode

| Type | Type |
| ---------- | ---------- |
| `PlatformCode` | `"AIX"\|    "Amiga OS"\|    "Android for GoogleTV"\|    "Android"\|    "Asha"\| "ATV OS X"\|    "Bada"\|    "BeOS"\|    "Brew MP"\|    "Brew"\|    "BSD"\| "CellOS"\|    "CentOS"\|    "Chromecast OS"\|    "ChromeOS"\|    "CygWin"\| "Darwin"\|    "Debian"\|    "DragonFly BSD"\|    "Fedora"\|    "FirefoxOS"\| "FreeBSD"\|    "Haiku"\|    "HP-UX"\|    "Inferno OS"\|    "iOS"\|    "ipadOS"\| "IRIX64"\|    "JAVA"\|    "KaiOS"\|    "Linux"\|    "Mac68K"\|    "macOS"\|    "MacOSX"\| "MacPPC"\|    "Maemo"\|    "MAUI"\|    "MeeGo"\|    "Miui OS"\|    "Mobilinux"\| "NetBSD"\|    "Nintendo 3DS"\|    "Nintendo DS"\|    "Nintendo DSi"\|    "Nintendo Switch"\| "Nintendo Wii"\|    "Nintendo WiiU"\|    "OpenBSD"\|    "OpenVMS"\|    "OrbisOS"\| "OS/2"\|    "PalmOS"\|    "Playstation Vita"\|    "Red Hat"\|    "RIM OS"\| "RIM Tablet OS"\|    "RISC OS"\|    "SailfishOS"\|    "Series30"\|    "Series40"\| "Solaris"\|    "SunOS"\|    "Syllable"\|    "SymbianOS"\|    "Tizen"\|    "Tru64 UNIX"\| "Ubuntu Touch"\|    "Ubuntu"\|    "Unix"\|    "webOS"\|    "Win10"\|    "Win16"\| "Win2000"\|    "Win31"\|    "Win32"\|    "Win64"\|    "Win7"\|    "Win8.1"\| "Win8"\|    "Win95"\|    "Win98"\|    "WinCE"\|    "WinME"\|    "WinMobile"\| "WinNT"\|    "WinPhone"\|    "WinPhone10"\|    "WinPhone6"\|    "WinPhone7.10"\| "WinPhone7.5"\|    "WinPhone7.8"\|    "WinPhone7"\|    "WinPhone8.1"\|    "WinPhone8"\| "WinRT8.1"\|    "WinRT8"\|    "WinVista"\|    "WinXP"\|    "WyderOS"\|    "Xbox 360 (Mobile View)"\| "Xbox 360"\|    "Xbox OS (Mobile View)"\|    "Xbox OS 10 (Mobile View)"\| "Xbox OS 10"\|    "Xbox OS"\|    "Xubuntu"` |

### :gear: PlatformKind

| Type | Type |
| ---------- | ---------- |
| `PlatformKind` | `"Android"\| "iOS"\| "Windows"\| "WinMobile"\| "MacOS"\| "Unix"\| "Linux"\| "Console"\| "Device"\| "EmulationVirtual"\| "EmulationVirtualMobile"\| "OtherMobile"\| "OtherLinuxMobile"\| "OtherPC"` |

