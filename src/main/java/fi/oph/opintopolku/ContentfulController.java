package fi.oph.opintopolku;

import fi.oph.opintopolku.services.impl.ContentfulService;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RestController
public class ContentfulController {
    private final ContentfulService contentfulService;

    public ContentfulController(ContentfulService contentfulService) {
        this.contentfulService = contentfulService;
    }

    @RequestMapping(value = "/notifications/fi")
    public List<Map<String, Object>> notificationsFi() {
        return contentfulService.getHairiotiedotteetFiSvFromContentful();
    }

    @RequestMapping(value = "/notifications/sv")
    public List<Map<String, Object>> notificationsSv() {
        return contentfulService.getHairiotiedotteetFiSvFromContentful();
    }

    @RequestMapping(value = "/notifications/en")
    public List<Map<String, Object>> notificationsEn() {
        return contentfulService.getHairiotiedotteetEnFromContentful();
    }
}
