SINQ Mobile
===========

This application depends on Apache Cordova (formerly PhoneGap).  In my development environment, I used Cordova 2.1.0, installed at

	~/cordova-2.1.0/

When you clone this Git repository to your own environment, you may have to update the CordovaLib path.  To do this, use the <code>update_cordova_subproject</code> utility included with Cordova (located in, for example, <code>~/cordova-2.1.0/incubator-cordova-ios/bin</code> in my environment).  For example:

	python update_cordova_subproject ~/Workspace/Checkouts/sinq-mobile/ios/SINQ.xcodeproj

After this is done successfully, you should be able to compile the project in Xcode.