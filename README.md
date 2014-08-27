# README #

### What is this repository for? ###

* Root's cross-platform mobile application using the Cordova framework. Jquery mobile is used for UI and routing

### How do I get set up? ###

* Install Cordova/phonegap and specific platform sdk (iOS in my case)
* cd to desired directory
* run command:  "cordova create [folder_name] com.your_name.[folder_name] [project_name]"
* replace new project's www file with the one in root-mobile
* Plugins: 
** cordova plugin add org.apache.cordova.console 
** cordova plugin add org.apache.cordova.device 
** cordova plugin add org.apache.cordova.device-motion 
** cordova plugin add org.apache.cordova.device-orientation 
** cordova plugin add org.apache.cordova.geolocation

* removal of plugins:  cd to project root.  "cordova plugin rm plugin_name"