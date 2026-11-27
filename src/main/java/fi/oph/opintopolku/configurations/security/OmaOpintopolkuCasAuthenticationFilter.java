package fi.oph.opintopolku.configurations.security;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.cas.ServiceProperties;
import org.springframework.security.cas.web.CasAuthenticationFilter;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.context.HttpSessionSecurityContextRepository;
import org.springframework.security.web.context.SecurityContextRepository;

import java.io.IOException;

/**
 * CasAuthenticationFilter, joka hyväksyy tiketin myös CasSecurityTicket-headerista.
 *
 * Logiikka on kopioitu java-utils-kirjaston OpintopolkuCasAuthenticationFilter-luokasta
 * (opintopolku-cas-servlet-filter), koska kirjasto on käännetty Spring Security 6:ta vasten
 * eikä toimi Spring Security 7:n kanssa.
 */
public class OmaOpintopolkuCasAuthenticationFilter extends CasAuthenticationFilter {
    public static final String CAS_SECURITY_TICKET = "CasSecurityTicket";

    private final SecurityContextRepository securityContextRepository = new HttpSessionSecurityContextRepository();

    public OmaOpintopolkuCasAuthenticationFilter(ServiceProperties serviceProperties) {
        setServiceProperties(serviceProperties);
        setAuthenticationDetailsSource(new OmaOpintopolkuServiceAuthenticationDetailsSource(serviceProperties));
    }

    @Override
    protected String obtainArtifact(HttpServletRequest request) {
        // ticket-parametrin lisäksi autentikoidaan myös CasSecurityTicket-headerissa oleva ticket
        String casTicketHeader = request.getHeader(CAS_SECURITY_TICKET);
        if (casTicketHeader != null) {
            // jos ko tiketillä ollaan jo autentikoiduttu sessio, ei tehdä sitä enää
            if (casTicketHeader.equals(getSessionTicket())) {
                logger.debug("ticket already authenticated in session");
                return null;
            }
            return casTicketHeader;
        }

        // getParameter-kutsu saattaa hajottaa tietyt post-requestit, siksi ticket-parametrin
        // validointi skipataan, jos kyseessä on post-request eikä headerissa ole tikettiä
        if ("POST".equals(request.getMethod())) {
            logger.debug("skipping cas obtainArtifact because post and already authenticated");
            return null;
        }

        return super.obtainArtifact(request);
    }

    @Override
    protected boolean requiresAuthentication(HttpServletRequest request, HttpServletResponse response) {
        // kirjaudutaan uudelleen jos tiketti on vaihtunut kesken session
        Object sessionTicket = getSessionTicket(); // null kun sessiota ei ole vielä autentikoitu
        if (sessionTicket != null) {
            String requestTicket = obtainArtifact(request);
            boolean ticketChanged = requestTicket != null && !requestTicket.equals(sessionTicket);
            if (ticketChanged) {
                logger.warn("clear authentication because ticket changed");
                SecurityContextHolder.clearContext();
                // tyhjennetään myös sessioon tallennettu konteksti, muuten epäonnistunut
                // uudelleenkirjautuminen jättäisi edellisen käyttäjän kirjautuneeksi
                securityContextRepository.saveContext(SecurityContextHolder.createEmptyContext(), request, response);
            }
        }

        return super.requiresAuthentication(request, response);
    }

    private Object getSessionTicket() {
        // cas-tiketti on tallennettu authentication.credentials-kenttään
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        return auth != null ? auth.getCredentials() : null;
    }

    @Override
    public Authentication attemptAuthentication(HttpServletRequest request, HttpServletResponse response) throws AuthenticationException, IOException {
        try {
            return super.attemptAuthentication(request, response);
        } catch (RuntimeException e) {
            if (e.getCause() instanceof IOException cause
                && cause.getMessage() != null && cause.getMessage().contains("412") && cause.getMessage().contains("proxyValidate")) {
                throw new BadCredentialsException("Possible error with auth system or infra.. check: 1) configs, urls, ports, 2) caller ticket not expired, 3) cas logs", e);
            }
            throw e;
        }
    }
}
