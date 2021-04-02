# Cordova-Intro-Video
Plugin to play local video on iOS with filename intro.mp4 on full screen without controls and show the app once video is finished.
_for developers who build cordova apps on local Mac using Xcode_

### Note: Doesnt work with Phongap Build and Ionic App Flow

# Installation
`ionic cordova plugin add https://github.com/aliexalter/Cordova-Intro-Video.git`

# Ionic settings

Create Ionic Service to use this plugin in ionic-cordova-angular project
```

import { Injectable } from '@angular/core';
import { cordova, IonicNativePlugin } from '@ionic-native/core';

@Injectable({
  providedIn: 'root'
})
export class PluginService extends IonicNativePlugin {
 //name in package.json file of plugin
 static pluginName = 'introvideo'; 
 // plugin id in the plugin.xml of plugin
 static plugin = 'cordova-plugin-introvide';
 // clobbers target in the plugin.xml of plugin
 static pluginRef = 'introvideo';
 static repo = 'https://github.com/aliexalter/Cordova-Intro-Video.git';
 static platforms = ['iOS'];
 
 coolMethod(myStrMsg): Promise<any> {
    return cordova(this, 'coolMethod', {}, [myStrMsg]);
  }
}
```
import the service file in app-component.ts or any *.page.ts
use function 
`coolMethod()` to play video full screen on iOS.

# Setup Video File Intro.mp4 (IMPORTANT) Read full steps please
1. Place file *intro.mp4* in root of ionic project
2. Add Platform iOS
`ionic cordova plaform add ios`
2. Run Command
`ionic cordova prepare ios`
3. Open Pltform/ios/you-app-name.Workspace file in Xcode

# Enhancement (TODO)
1. Pass name of file and extension as string to function coolMethod to play fullscreen.
