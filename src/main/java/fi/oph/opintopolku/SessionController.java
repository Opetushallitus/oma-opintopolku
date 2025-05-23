package fi.oph.opintopolku;

import lombok.val;
import org.apereo.cas.client.authentication.AttributePrincipal;
import org.joda.time.DateTime;
import org.joda.time.format.DateTimeFormat;
import org.joda.time.format.DateTimeFormatter;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.cas.authentication.CasAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.view.RedirectView;

import java.text.DateFormat;
import java.util.Date;
import java.util.Locale;
import java.util.Map;
import java.util.regex.Pattern;
import java.util.stream.Collectors;


@RestController
public class SessionController {
    final static DateTimeFormatter hetuDateformatter = DateTimeFormat.forPattern("ddMMYY");
    final static DateTimeFormatter stringDateformatter = DateTimeFormat.forPattern("YYYY-MM-dd");
    private static final Logger logger = LoggerFactory.getLogger(SessionController.class);

    private static final String HETU_REGEX = "^(0[1-9]|[12]\\d|3[01])(0[1-9]|1[0-2])([5-9]\\d\\+|\\d\\d-|[01]\\dA)\\d{3}[\\dABCDEFHJKLMNPRSTUVWXY]$";

    @RequestMapping(value = "/session")
    @PreAuthorize("isAuthenticated()")
    @GetMapping
    public User getSession() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        CasAuthenticationToken casAuthenticationToken = (CasAuthenticationToken) authentication;
        AttributePrincipal principal = casAuthenticationToken.getAssertion().getPrincipal();
        Map<String, Object> attributes = principal.getAttributes();

        val user = createUser(attributes);
        logger.info("Returning user {}", user.toString());
        return user;
    }

    @RequestMapping(value = "/authenticate")
    @PreAuthorize("isAuthenticated()")
    @GetMapping
    public RedirectView authenticate() {
        return new RedirectView("/oma-opintopolku/");
    }

    private static boolean isUsingValtuudet(Map<String, Object> attributes) {
        String impersonatorHetu = (String) attributes.getOrDefault("impersonatorNationalIdentificationNumber", "");
        String impersonatorName = (String) attributes.getOrDefault("impersonatorDisplayName", "");
        return !impersonatorHetu.isEmpty() || !impersonatorName.isEmpty();
    }

    private static boolean isUsingEidas(Map<String, Object> attributes) {
        String eidasIdentifier = (String) attributes.getOrDefault("personIdentifier", "");
        return !eidasIdentifier.isEmpty();
    }

    private static String getName(boolean isUsingValtuudet, boolean isUsingEidas, Map<String, Object> attributes) {
        //Valtuudet
        String impersonatorName = (String) attributes.getOrDefault("impersonatorDisplayName", "");

        //Normaali Suomi.fi -tunnistautuminen
        String displayName = (String) attributes.getOrDefault("displayName", "");

        // Eidas-tunnistautuminen
        String firstName = (String) attributes.getOrDefault("firstName", "");
        String familyName = (String) attributes.getOrDefault("familyName", "");
        String eidasName = firstName + " " + familyName;

        if (isUsingValtuudet) {
            return impersonatorName;
        } else if (isUsingEidas) {
            return eidasName.trim();
        } else  {
            return displayName;
        }
    }

    private static String getBirthDate(boolean isUsingValtuudet, boolean isUsingEidas, Map<String, Object> attributes) {
        if (isUsingValtuudet) {
            return parseDateStringFromHetu((String) attributes.getOrDefault("impersonatorNationalIdentificationNumber", ""));
        } else if (isUsingEidas) {
            return formatDateString((String) attributes.getOrDefault("dateOfBirth", ""));
        } else  {
            return parseDateStringFromHetu((String) attributes.getOrDefault("nationalIdentificationNumber", ""));
        }
    }

    private static User createUser(Map<String, Object> attributes) {
        val user = new User();

        String attributesAsString = attributes.keySet().stream().map(k -> k + ":" + attributes.get(k))
            .collect(Collectors.joining(", ", "{", "}" ));
        logger.info("Setting user properties, data: {}", attributesAsString);

        boolean isUsingValtuudet = isUsingValtuudet(attributes);
        boolean isUsingEidas = isUsingEidas(attributes);

        String displayName = getName(isUsingValtuudet, isUsingEidas, attributes);
        String birthDay = getBirthDate(isUsingValtuudet, isUsingEidas, attributes);
        String personOid = !isUsingValtuudet
            ? (String) attributes.getOrDefault("personOid", "")
            : (String) attributes.getOrDefault("impersonatorPersonOid", "");
        String hetu = !isUsingValtuudet
            ? (String) attributes.getOrDefault("nationalIdentificationNumber", "")
            : (String) attributes.getOrDefault("impersonatorNationalIdentificationNumber", "");

        user.setName(displayName);
        user.setBirthDay(birthDay);
        user.setPersonOid(personOid);
        user.setHetu(hetu);
        user.setUsingValtuudet(isUsingValtuudet);

        return user;
    }

    private static String formatDateString(String dateString) {
        if(dateString == null || dateString.isEmpty()) {
            return "";
        }
        try {
            DateTime dt = stringDateformatter.parseDateTime(dateString);
            return formatStringFromDateTime(dt);
        } catch (IllegalArgumentException e) {
            logger.error("Error parsing date string: {}", dateString, e);
            return "";
        }
    }

    private static String parseDateStringFromHetu(String hetu) {
        if (hetu != null && Pattern.compile(HETU_REGEX).matcher(hetu).matches()) {
            try {
                DateTime dt = hetuDateformatter.parseDateTime(hetu.substring(0, 6));
                return formatStringFromDateTime(dt);
            } catch (IllegalArgumentException e) {
                logger.error("Error parsing date string from hetu: {}", hetu, e);
                return "";
            }
        }
        return "";
    }

    private static String formatStringFromDateTime(DateTime dateTime) {
        if (dateTime != null) {
            Locale locale = new Locale("fi", "fi");
            DateFormat df = DateFormat.getDateInstance(DateFormat.SHORT, locale);
            Date date = dateTime.toDate();
            return df.format(date);
        }
        return "";
    }
}
