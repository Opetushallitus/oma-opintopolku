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

    @RequestMapping(value = "/notifications")
    public List<Map<String, Object>> notifications() {
        return contentfulService.getHairiotiedotteetFromContentful();
    }
}
