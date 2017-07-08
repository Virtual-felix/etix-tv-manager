# ETIX TV Manager API

Welcome to the Etix TV Manager API \o/

This API use the Echo framework with a clean architecture.

- The main file describe all routes then run the application.
- The config file describe all constant configuration value of the API.
- The controller/ folder (package) contain all specific handler for each routes. Those handlers make the parameter validations then call different services for the business logic.
- The service/ foler (package) contain all the business logic of the application, called by controllers.
