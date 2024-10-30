package fi.oph.opintopolku.configurations.security;

import fi.oph.opintopolku.configurations.ConfigEnums;
import org.apereo.cas.client.util.WebUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.cas.web.CasAuthenticationEntryPoint;
import org.springframework.web.util.UriComponentsBuilder;

import java.net.URI;
import java.net.URISyntaxException;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

public class OmaopintopolkuCasAuthenticationEntryPoint extends CasAuthenticationEntryPoint {
    private final static String valtuudet_enabled = ConfigEnums.VALTUUDET_ENABLED.value();
    private static final Logger logger = LoggerFactory.getLogger(OmaopintopolkuCasAuthenticationEntryPoint.class);

    @Override
    protected String createServiceUrl(final HttpServletRequest request,
                                      final HttpServletResponse response) {
        String serviceUrl = super.getServiceProperties().getService();

        try {
            serviceUrl = getLocalizedServiceUrl(request.getRequestURL().toString());
        } catch (URISyntaxException e) {
            logger.error("Failed to get localized service url." + e);
        }
        super.getServiceProperties().setService(serviceUrl);
        super.setLoginUrl(getLocalizedLoginUrl(serviceUrl));
        return WebUtils.constructServiceUrl(null, response,
            serviceUrl, null,
            super.getServiceProperties().getArtifactParameter(),
            super.getEncodeServiceUrlWithSessionId());
    }

    private String getLocalizedServiceUrl(String url) throws URISyntaxException {
        URI uri = new URI(url);
        String host = uri.getHost();

        String initialUrl = super.getServiceProperties().getService();
        UriComponentsBuilder builder = UriComponentsBuilder.fromHttpUrl(initialUrl);
        return builder.host(host).toUriString();
    }

    private String getLocalizedLoginUrl(String url) {
        String locale = "fi";
        if (url.contains("study")) {
            locale = "en";
        } else if (url.contains("studie")) {
            locale = "sv";
        }

        UriComponentsBuilder urlBuilder = UriComponentsBuilder.fromUriString(super.getLoginUrl());

        urlBuilder.replaceQueryParam("locale", locale);
        urlBuilder.replaceQueryParam("valtuudet", valtuudet_enabled);

        return urlBuilder.build().toUriString();
    }
}


