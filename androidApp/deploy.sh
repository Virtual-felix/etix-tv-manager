#!/bin/bash

# Use with ./deploy.sh <IP of the TV>

# Connect to the TV with adb
adb connect $1

# If it's installed with another signing key, you have to uninstall it...
adb uninstall com.tvmanager.tvmanager

# Install the APK
adb install -r -d tvmanager.apk
