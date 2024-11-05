package fi.oph.opintopolku.configurations.security;

import fi.oph.opintopolku.configurations.processor.OmaopintopolkuCorsProcessor;
import jakarta.servlet.http.HttpServletRequest;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.cas.ServiceProperties;
import org.springframework.security.cas.web.authentication.ServiceAuthenticationDetails;
import org.springframework.security.cas.web.authentication.ServiceAuthenticationDetailsSource;
import org.springframework.security.web.authentication.WebAuthenticationDetails;

public class OmaOpintopolkuServiceAuthenticationDetailsSource extends ServiceAuthenticationDetailsSource {
    private static final Logger logger = LoggerFactory.getLogger(OmaopintopolkuCorsProcessor.class);

    public OmaOpintopolkuServiceAuthenticationDetailsSource(ServiceProperties serviceProperties) {
        super(serviceProperties);
    }

    @Override
    public ServiceAuthenticationDetails buildDetails(HttpServletRequest request) {
        return new OmaOpintopolkuServiceAuthenticationDetailsSource.OmaOpintopolkuAuthenticationDetails(request);
    }

    public static class OmaOpintopolkuAuthenticationDetails extends WebAuthenticationDetails implements ServiceAuthenticationDetails{
        private final String serviceUrl;

        public OmaOpintopolkuAuthenticationDetails(HttpServletRequest request) {
            super(request);
            logger.debug("Got request: " + request.getRequestURL().toString() + " setting this as serviceUrl");
            this.serviceUrl = request.getRequestURL().toString();
        }

        @Override
        public String getServiceUrl() {
            return serviceUrl;
        }
    }
}
