# #!/bin/bash

rm -rf ./app/build/outputs/apk/* ./tvmanager.apk
docker build -t android-builder:latest .
docker run -it -e ANDROID_DAILY_OVERRIDE=1d64b122ff26abd6a9c456bad2b29d4d24f83729 -v $(pwd)/:/project/ -w /project/ android-builder ./gradlew clean assembleRelease
docker run -it -v $(pwd)/:/project/ -w /project/ android-builder jarsigner -tsa http://timestamp.digicert.com -sigalg MD5withRSA -digestalg SHA1 -keystore etixlabs.keystore ./app/build/outputs/apk/app-release-unsigned.apk etixlabs
docker run -it -v $(pwd)/:/project/ -w /project/ android-builder /usr/local/android-sdk-linux/build-tools/23.0.3/zipalign 4 ./app/build/outputs/apk/app-release-unsigned.apk tvmanager.apk
