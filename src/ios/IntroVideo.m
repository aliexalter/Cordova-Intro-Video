/********* IntroVideo.m Cordova Plugin Implementation *******/

#import <Cordova/CDV.h>
#import <AVFoundation/AVFoundation.h>
#import <AVKit/AVKit.h>

@interface IntroVideo : CDVPlugin {
  // Member variables go here.
    
}

@property (nonatomic, readwrite, strong) AVPlayer* player;
@property (nonatomic, readwrite, strong) AVPlayerLayer *playerLayer;
@property (nonatomic, readwrite, strong) UIView* view;

- (void)coolMethod:(CDVInvokedUrlCommand*)command;
@end

@implementation IntroVideo

- (void)coolMethod:(CDVInvokedUrlCommand*)command
{
    self.view = self.viewController.view;
    CDVPluginResult* pluginResult = nil;
    NSString* echo = [command.arguments objectAtIndex:0];

    if (echo != nil && [echo length] > 0) {
        pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsString:echo];
    } else {
        pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR];
    }

    [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];

    //play video
    NSString* filePath = [[NSBundle mainBundle] pathForResource:@"intro" ofType:@"mp4"];
    if(filePath) {
        NSURL *videoURL = [NSURL fileURLWithPath:filePath];
        self.player = [AVPlayer playerWithURL:videoURL];
        self.playerLayer = [AVPlayerLayer playerLayerWithPlayer:self.player];
        self.playerLayer.frame = UIScreen.mainScreen.bounds;//self.view.layer.bounds;
        self.playerLayer.videoGravity = AVLayerVideoGravityResizeAspectFill;
        [self.view.layer addSublayer:self.playerLayer];
        [self.player play];
        
        [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(playerDidFinishPlaying:)
            name: AVPlayerItemDidPlayToEndTimeNotification
            object: self.player.currentItem];
        
    }
}

-(void)playerDidFinishPlaying:(NSNotification*)note {
    NSLog(@"Video Finished");
    [self.playerLayer removeFromSuperlayer];
}

@end
