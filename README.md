# nodejs-browscap
http://browscap.org/ port for nodejs, php is not required

It's initializing from 'browscap.json' directly, this file is maintained in node js package.
The latest nodejs-browscap package is based on :
```
"GJK_Browscap_Version": "6001008",
"timestamp": "Wed, 19 Feb 2025 15:58:54 +0000"
```

# Impl

Implemented in typescript. It is initializing an internal grammar's search tree at first invokation time, which takes a few second. Metadata is kept in memory afterwards. 
```
Load patterns input file...
Extracting json...
...
buildSearchTree: 8.088s
initializeDatabase: 9.690s

```
Searching algorithm is quite efficient. Current Browscap pattern database consists of 446k records, and any requested sample is being matched against each of them. (It returns all possible matching records.) Still, on my desktop env:

```
Valid: 10084 / 10339 98%
matchers: 3.882s
```

So the average matching time was 400μsec.

# Usage

```

import {findBrowscapRecords} from "nodejs-browscap";


let sample = "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/133.0.0.0 Safari/537.36";

let results:BrowscapMatchResult = findBrowscapRecords(sample);

if (debug) {
    console.log("Records:");
    console.log(JSON.stringify(matches.compressedResults.toObj(),null,2));
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
