TV Manager - Android app

# How to compile the project and push it to the app

To build and sign the application, there is a script and a docker image to do so:
/!\ You need Docker and ADB. /!\
```
./build_and_sign.sh
```

To deploy the app you just have to:
```
./deploy.sh <IP of the TV>
```

The app will connect automatically with HTTPs on `tv.etixlabs.com`, it is required for the production deployment.
