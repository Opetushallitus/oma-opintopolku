# oma-opintopolku

> Oppijan henkilökohtaiset verkkosivut

## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report
```
## Tietokannan käynnistys
    docker run --rm --name omaopintopolku-db -p 5488:5432 -e POSTGRES_USER=oph -e POSTGRES_PASSWORD=oph -e POSTGRES_DB=omaopintopolku -d postgres:15.4

## Palvelun käynnistys lokaalisti
Backend-sovellus hakee häiriötiedotteet Konfon käyttämästä S3:sta ja tätä varten lokaalissa ympäristössä kannattaa luoda `application-dev.yml` -tiedosto:

```
spring:
  config:
    activate:
      on-profile: dev
bucket:
  url: https://konfo-content.untuvaopintopolku.fi/$1
logging:
  level:
    fi:
      oph:
        opintopolku: DEBUG
```


Palvelu käynnistetään komennolla:
    mvn clean package
    java -jar target/oma-opintopolku-0.1.0-SNAPSHOT.jar
tai

    mvn clean compile exec:java
tai käynnistä luokka `fi.oph.opintopolku.App` Intellij IDEA:ssa

Avaa selaimessa:

    http://localhost:8080/oma-opintopolku

## Yksikkötestien ajaminen
```
npm run test:watch
```
komento jättää testiajon pyörimään taustalle ja testit ajetaan uudestaan muutosten yhteydessä.
