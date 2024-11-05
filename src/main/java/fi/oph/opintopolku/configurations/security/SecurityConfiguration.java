package fi.oph.opintopolku.configurations.security;

import fi.oph.opintopolku.configurations.processor.OmaopintopolkuCorsProcessor;
import fi.oph.opintopolku.configurations.properties.CasOppijaProperties;
import fi.oph.opintopolku.services.impl.OmaopintopolkuUserDetailsServiceImpl;
import fi.vm.sade.properties.OphProperties;
import org.apereo.cas.client.session.SessionMappingStorage;
import org.apereo.cas.client.session.SingleSignOutFilter;
import org.apereo.cas.client.validation.Cas20ProxyTicketValidator;
import org.apereo.cas.client.validation.TicketValidator;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.env.Environment;
import org.springframework.security.cas.ServiceProperties;
import org.springframework.security.cas.authentication.CasAuthenticationProvider;
import org.springframework.security.cas.web.CasAuthenticationFilter;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableGlobalMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;

import java.util.Arrays;

@Configuration
@EnableGlobalMethodSecurity(jsr250Enabled = false, prePostEnabled = true, securedEnabled = true)
@EnableWebSecurity
public class SecurityConfiguration {
    private CasOppijaProperties casOppijaProperties;
    private OphProperties ophProperties;
    private Environment environment;
    private SessionMappingStorage sessionMappingStorage;


    @Autowired
    public SecurityConfiguration(CasOppijaProperties casOppijaProperties, OphProperties ophProperties, Environment environment,
                                 SessionMappingStorage sessionMappingStorage) {
        this.casOppijaProperties = casOppijaProperties;
        this.ophProperties = ophProperties;
        this.environment = environment;
        this.sessionMappingStorage = sessionMappingStorage;
    }

    @Bean
    public ServiceProperties serviceProperties() {
        ServiceProperties serviceProperties = new ServiceProperties();
        serviceProperties.setService(casOppijaProperties.getService() + "/j_spring_cas_security_check");
        serviceProperties.setSendRenew(casOppijaProperties.getSendRenew());
        serviceProperties.setAuthenticateAllArtifacts(true);
        return serviceProperties;
    }

    //
    // CAS authentication provider (authentication manager)
    //
    @Bean
    public CasAuthenticationProvider casAuthenticationProvider() {
        CasAuthenticationProvider casAuthenticationProvider = new CasAuthenticationProvider();
        casAuthenticationProvider.setUserDetailsService(new OmaopintopolkuUserDetailsServiceImpl());
        casAuthenticationProvider.setServiceProperties(serviceProperties());
        casAuthenticationProvider.setTicketValidator(ticketValidator());
        casAuthenticationProvider.setKey(casOppijaProperties.getKey());
        return casAuthenticationProvider;
    }

    @Bean
    public TicketValidator ticketValidator() {
        Cas20ProxyTicketValidator ticketValidator = new Cas20ProxyTicketValidator(ophProperties.url("cas-oppija.url"));
        ticketValidator.setAcceptAnyProxy(true);
        return ticketValidator;
    }

    //
    // CAS filter
    //
    @Bean
    public CasAuthenticationFilter casAuthenticationFilter(AuthenticationConfiguration authenticationConfiguration) throws Exception {
        OmaOpintopolkuCasAuthenticationFilter casAuthenticationFilter = new OmaOpintopolkuCasAuthenticationFilter(serviceProperties());
        casAuthenticationFilter.setAuthenticationManager(authenticationConfiguration.getAuthenticationManager());
        casAuthenticationFilter.setFilterProcessesUrl("/j_spring_cas_security_check");
        return casAuthenticationFilter;
    }

    //
    // CAS single logout filter
    // requestSingleLogoutFilter is not configured because our users always sign out through CAS logout (using oppija-raamit
    // logout button) when CAS calls this filter if user has ticket to this service.
    //
    @Bean
    public SingleSignOutFilter singleSignOutFilter() {
        SingleSignOutFilter singleSignOutFilter = new SingleSignOutFilter();
        //singleSignOutFilter.setCasServerUrlPrefix(this.ophProperties.url("cas-oppija.url"));
        singleSignOutFilter.setIgnoreInitConfiguration(true);
        singleSignOutFilter.setSessionMappingStorage(sessionMappingStorage);
        return singleSignOutFilter;
    }

    //
    // CAS entry point
    //
    @Bean
    public OmaopintopolkuCasAuthenticationEntryPoint omaOpintopolkuCasAuthenticationEntryPoint() {
        OmaopintopolkuCasAuthenticationEntryPoint omaOpintopolkuCasAuthenticationEntryPoint = new OmaopintopolkuCasAuthenticationEntryPoint();
        omaOpintopolkuCasAuthenticationEntryPoint.setLoginUrl(ophProperties.url("cas-oppija.login"));
        omaOpintopolkuCasAuthenticationEntryPoint.setServiceProperties(serviceProperties());
        return omaOpintopolkuCasAuthenticationEntryPoint;
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http, CasAuthenticationFilter casAuthenticationFilter) throws Exception {
        http
            .addFilter(corsFilter())
            .cors(cors -> cors.disable())
            .csrf(csrf -> csrf.disable())
            .authorizeRequests()
            .requestMatchers("/authenticate").authenticated()
            .requestMatchers("/session").authenticated()
            .anyRequest().permitAll()
            .and()
            .addFilter(casAuthenticationFilter)
            .exceptionHandling(eh -> eh.authenticationEntryPoint(omaOpintopolkuCasAuthenticationEntryPoint()))
            //.and()
            .addFilterBefore(singleSignOutFilter(), CasAuthenticationFilter.class);
        return http.build();
    }

    @Bean
    public CorsFilter corsFilter() {
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowCredentials(true);
        configuration.setAllowedOrigins(Arrays.asList(
            ophProperties.url("url-oppija-fi"),
            ophProperties.url("url-oppija-en"),
            ophProperties.url("url-oppija-sv"),
            "*"));
        configuration.setAllowedMethods(Arrays.asList("*"));
        configuration.setAllowedHeaders(Arrays.asList("caller-id"));
        source.registerCorsConfiguration("/**", configuration);
        CorsFilter corsFilter = new CorsFilter(source);
        OmaopintopolkuCorsProcessor omaOpintopolkuCorsProcessor = new OmaopintopolkuCorsProcessor();
        corsFilter.setCorsProcessor(omaOpintopolkuCorsProcessor);
        return corsFilter;
    }

}
