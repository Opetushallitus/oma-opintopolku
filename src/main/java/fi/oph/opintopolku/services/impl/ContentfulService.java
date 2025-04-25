package fi.oph.opintopolku.services.impl;

import com.contentful.java.cda.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.stream.Stream;

@Component
@Service
public class ContentfulService {
    private static final Logger logger = LoggerFactory.getLogger(ContentfulService.class);

    private final CDAClient clientFiSv;
    private final CDAClient clientEn;

    private List<CDAResource> handleCdaHttpException(CDAHttpException e) {
        if (e.responseCode() == 404 || e.responseCode() == 401) {
            logger.error("Contentful Delivery API returned {}: {}", e.responseCode(), e.responseBody());
            return List.of();
        } else {
            throw e;
        }

    }

    public ContentfulService(
        @Value("${contentful.content-delivery-api-access-token}") String contentDeliveryApiAccessToken,
        @Value("${contentful.contentful-space-id}") String contentfulSpaceId,
        @Value("${contentful.contentful-environment-id}") String contentfulEnvironmentId,
        @Value("${contentful.content-delivery-api-access-token-en}") String contentDeliveryApiAccessTokenEn,
        @Value("${contentful.contentful-space-id-en}") String contentfulSpaceIdEn,
        @Value("${contentful.contentful-environment-id-en}") String contentfulEnvironmentIdEn) {
        this.clientFiSv = CDAClient.builder()
            .setSpace(contentfulSpaceId)
            .setEnvironment(contentfulEnvironmentId)
            .setToken(contentDeliveryApiAccessToken)
            .build();

        this.clientEn = CDAClient.builder()
            .setSpace(contentfulSpaceIdEn)
            .setEnvironment(contentfulEnvironmentIdEn)
            .setToken(contentDeliveryApiAccessTokenEn)
            .build();
    }

    private Stream<Map<String, Object>> getHairiotiedoteRawFields(List<CDAResource> hairiotiedotteet) {
        return hairiotiedotteet
            .stream()
            .map(entry -> {
                CDAEntry hairiotiedote = (CDAEntry) entry;
                return hairiotiedote.rawFields();
            });
    }

    public List<Map<String, Object>> getHairiotiedotteetFromContentful() {
        List<CDAResource> hairiotiedotteetFiSv;
        List<CDAResource> hairiotiedotteetEn;

        try {
            hairiotiedotteetFiSv = clientFiSv
                .fetch(CDAEntry.class)
                .withContentType("hairiotiedote")
                .where("fields.whereShown", QueryOperation.Matches, "Oma opintopolku")
                .where("locale", "*")
                .all()
                .items();
        } catch (CDAHttpException e) {
            hairiotiedotteetFiSv = handleCdaHttpException(e);
        }

        try {
            hairiotiedotteetEn = clientEn
                .fetch(CDAEntry.class)
                .withContentType("hairiotiedote")
                .where("fields.whereShown", QueryOperation.Matches, "Oma opintopolku")
                .all()
                .items();
        } catch (CDAHttpException e) {
            hairiotiedotteetEn = handleCdaHttpException(e);
        }

        Stream<Map<String, Object>> hairiotiedotteetFiSvRawFields = getHairiotiedoteRawFields(hairiotiedotteetFiSv);
        Stream<Map<String, Object>> hairiotiedotteetEnRawFields = getHairiotiedoteRawFields(hairiotiedotteetEn);

        return Stream.concat(hairiotiedotteetFiSvRawFields, hairiotiedotteetEnRawFields).toList();
    }
}
