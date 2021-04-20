package fi.oph.opintopolku.configurations.security;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

public class OmaOpintopolkuAuthenticationSuccessHandler implements AuthenticationSuccessHandler {
    private static final Logger logger = LoggerFactory.getLogger(OmaOpintopolkuAuthenticationSuccessHandler.class);

    @Override
    public void onAuthenticationSuccess(
        HttpServletRequest request,
        HttpServletResponse response,
        Authentication authentication) throws IOException, ServletException {

        //Set our response to OK status & redirect successful login to /omaopintopolku/authenticate
        response.setStatus(HttpServletResponse.SC_OK);
        logger.debug("Got successful authentication, redirecting to /authenticate");
        response.sendRedirect("/oma-opintopolku/authenticate");
    }
}
