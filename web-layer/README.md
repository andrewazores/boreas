# Boreas web-layer

# Requirements
Java 8 JDK
Maven
Thermostat : icedtea.classpath.org/thermostat

# Installation
mvn compile

# Usage
* Start thermostat web-storage and agent
```
$ thermostat web-storage-service
```
* Start the web-layer
```
$ mvn exec:java
```

# API

## GET requests:
```
localhost:8080/{collection-name}
```
* Gets all documents from collection
* `localhost:8080/vm-info` gets all documents from the collection `vm-info`

```
localhost:8080/{collection-name}/latest
```
* Gets latest document from collection
* `localhost:8080/vm-info/latest` gets the latest document from the collection `vm-info`

```
localhost:8080/{collection-name}/{field}/{value}
```
* Gets all documents from collection with field matching value
* `localhost:8080/vm-info/vmId/42` gets all documents with field `vmId` matching `42`.

```
localhost:8080/{collection-name}/{field}/{value}/latest
```
* Gets latest document from collection with field matching value
* `localhost:8080/vm-info/vmId/42/latest` gets the latest document with field `vmId` matching `42`.
