# Cordova-Intro-Video
Plugin to play local video on iOS with filename intro.mp4 on full screen without controls and show the app once video is finished.
_for developers who build cordova apps on local Mac using Xcode_

## Note: Doesnt work with Phongap Build and Ionic App Flow

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

# Setup Video File (IMPORTANT) Read full steps please
1. Add platform ios to the project by running 
`ionic cordova plaform add ios`
2. Run Command
`ionic cordova prepare ios`
3. Once iOS proejct is created inside platform folder. Open Workspace file in Xcode
4. Now inside Xcode add New File as video intro.mp4 in the main App folder
5. Open Build Phases > Copy Bundle Resources click add and chose Video file added to main folder of the app in previous step.
6. Run the app on simulator. You will see video on the app page where coolMethod() function is called.

# Enhancement (TODO)
1. Need to copy video file from src or src/assests to iOS main app when cordova prepare runs.
2. Need to attach file to Bundle Resources programmatically
3. Pass name of file and extension as string to function coolMethod to play fullscreen.
