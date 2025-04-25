package fi.oph.opintopolku.services.impl;

import com.contentful.java.cda.CDAClient;
import com.contentful.java.cda.CDAEntry;
import com.contentful.java.cda.CDAResource;
import com.contentful.java.cda.QueryOperation;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Component
@Service
public class ContentfulService {
    private static final Logger logger = LoggerFactory.getLogger(ContentfulService.class);

    @Value("${contentful.content-delivery-api-access-token}")
    private String contentDeliveryApiAccessToken;

    @Value("${contentful.contentful-space-id}")
    private String contentfulSpaceId;

    @Value("${contentful.contentful-environment-id}")
    private String contentfulEnvironmentId;

    public List<Map<String, Object>> getHairiotiedotteetFromContentful() {
        CDAClient client = CDAClient.builder()
            .setSpace(contentfulSpaceId)
            .setEnvironment(contentfulEnvironmentId)
            .setToken(contentDeliveryApiAccessToken)
            .build();

        List<CDAResource> hairiotiedotteet = client
            .fetch(CDAEntry.class)
            .withContentType("hairiotiedote")
            .where("fields.whereShown", QueryOperation.Matches, "Oma opintopolku")
            .where("locale", "*")
            .all()
            .items();

        return hairiotiedotteet.stream().map(entry -> {
            CDAEntry hairiotiedote = (CDAEntry) entry;
            return hairiotiedote.rawFields();
        }).toList();
    }
}
