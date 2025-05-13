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
Backend-sovellus hakee häiriötiedotteet Contentfulin APIsta ja tätä varten lokaalissa ympäristössä kannattaa luoda `application-dev.yml` -tiedosto:

```
spring:
  config:
    activate:
      on-profile: dev

contentful:
  contentful-space-id: ...
  content-delivery-api-access-token: ...
  contentful-environment-id: testi

  contentful-space-id-en: ...
  content-delivery-api-access-token-en: ...
  contentful-environment-id-en: testi


logging:
  level:
    fi:
      oph:
        opintopolku: DEBUG
```

Contentfulin space-id:t ja access-tokenit löytyvät helpoiten contentful.comista. Sinne kirjautumista varten tarvittavat kehittäjien käyttäjätunnus ja salasana löytyvät
OPH Utility -tilin AWS Secrets Managerista.


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
