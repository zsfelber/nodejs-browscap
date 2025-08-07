# nodejs-browscap
http://browscap.org/ port for nodejs, php is not required

It's initializing from 'browscap.json' directly, this file is maintained regularly in nodejs-browscap package.

Current version information :
```
nodejs-browscap version: 1.0.0
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
Valid: 10084 / 10339 98%
matchers: 3.882s
```

So the average matching time was 385μsec (in debug mode, including logging).

# Usage

```
npm i nodejs-browscap

```

```

import {findBrowscapRecords} from "nodejs-browscap";


let sample = "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/133.0.0.0 Safari/537.36";

let results:BrowscapMatchResult = findBrowscapRecords(sample);

if (debug) {
    console.log("Records:");
    console.log(JSON.stringify(matches.compressedResults.asObj,null,2));
}

```

## Output

```

Records:
{
  "Mozilla/5.0 (*Linux*x86_64*)*applewebkit*(*khtml*like*gecko*)*Chrome/*": {
    "Browser_Type": "Browser",
    "Browser_Maker": "Google Inc",
    "Browser_Modus": "unknown",
    "Platform": "Linux",
    "Platform_Version": "unknown",
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
    "Device_Maker": "unknown",
    "Device_Type": "Desktop",
    "Device_Pointing_Method": "mouse",
    "Device_Code_Name": "Linux Desktop",
    "Device_Brand_Name": "unknown",
    "RenderingEngine_Name": "Blink",
    "RenderingEngine_Version": "unknown",
    "RenderingEngine_Description": "a WebKit Fork by Google",
    "RenderingEngine_Maker": "Google Inc",
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
    "Browser_Modus": "unknown",
    "Platform": "Linux",
    "Platform_Version": "unknown",
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
    "Device_Maker": "unknown",
    "Device_Type": "Desktop",
    "Device_Pointing_Method": "mouse",
    "Device_Code_Name": "Linux Desktop",
    "Device_Brand_Name": "unknown",
    "RenderingEngine_Name": "WebKit",
    "RenderingEngine_Version": "unknown",
    "RenderingEngine_Description": "For Google Chrome, iOS (including both mobile Safari, WebViews within third-party apps, and web clips), Safari, Arora, Midori, OmniWeb, Shiira, iCab since version 4, Web, SRWare Iron, Rekonq, and in Maxthon 3.",
    "RenderingEngine_Maker": "Apple Inc",
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
    "Browser_Modus": "unknown",
    "Platform": "Linux",
    "Platform_Version": "unknown",
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
    "Device_Maker": "unknown",
    "Device_Type": "Desktop",
    "Device_Pointing_Method": "mouse",
    "Device_Code_Name": "Linux Desktop",
    "Device_Brand_Name": "unknown",
    "RenderingEngine_Version": "unknown"
  }
}

```

# Tests and execution times


```
cd node_modules/nodejs-browscap
npm run test
```

Now, you are able to review speed data and memory consumption. (Open Task Manager or System Monitor / run 'top' in a linux shell). It is about 1 Gbyte currently. 

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
| `initializeDataFiles` | `() => void` |

### :gear: initializeDatabase

Loads and initializes internal database and grammar parse trees. (Otherwise being done automatically.)

| Function | Type |
| ---------- | ---------- |
| `initializeDatabase` | `() => ParsedBrowscapMatcher` |

### :gear: uninitializeDatabase

Deletes references to all preloaded data, marking as target for garbage collector to remove it from heap.

| Function | Type |
| ---------- | ---------- |
| `uninitializeDatabase` | `(warngc?: boolean) => void` |

### :gear: testBrowscap

Runs tests.

| Function | Type |
| ---------- | ---------- |
| `testBrowscap` | `() => Promise<void>` |


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

- [header](#gear-header)
- [headerComments](#gear-headercomments)
- [defaultProperties](#gear-defaultproperties)
- [parentProperties](#gear-parentproperties)
- [built](#gear-built)

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
- [set](#gear-set)

### Properties
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

#### :gear: set

| Method | Type |
| ---------- | ---------- |
| `set` | `(key: string, record: BrowscapRecord) => void` |

#### :gear: asObj

| Property | Type | Get | Set |
| ---------- | ---------- | ---------- | ---------- |
| `asObj` | `MapLike<BrowscapRecord>` | `yes` | `no` |

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
- [MapLike](#gear-maplike)

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
| `Browser_Type` | `string` |  |
| `Browser_Bits` | `number` |  |
| `Browser_Maker` | `string` |  |
| `Browser_Modus` | `string` |  |
| `Version` | `string or number` |  |
| `MajorVer` | `string` |  |
| `MinorVer` | `string` |  |
| `Platform` | `string` |  |
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
| `Device_Type` | `string` |  |
| `Device_Pointing_Method` | `string` |  |
| `Device_Code_Name` | `string` |  |
| `Device_Brand_Name` | `string` |  |
| `RenderingEngine_Name` | `string` |  |
| `RenderingEngine_Version` | `string or number` |  |
| `RenderingEngine_Description` | `string` |  |
| `RenderingEngine_Maker` | `string` |  |


### :gear: MapLike
#### MapLike\<T\>

| Indexer | Type |
| ---------- | ---------- |
| `[index:string]` | `T` |
