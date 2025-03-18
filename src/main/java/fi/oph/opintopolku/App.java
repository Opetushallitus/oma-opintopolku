package fi.oph.opintopolku;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.session.DefaultCookieSerializerCustomizer;
import org.springframework.context.annotation.Bean;

@SpringBootApplication
public class App {

  public static void main(String[] args) {
    System.setProperty("server.servlet.context-path", "/oma-opintopolku");
    SpringApplication.run(App.class, args);
  }

  @Bean
  public DefaultCookieSerializerCustomizer customizeCookieSerializer(){
    return cookieSerializer -> {
      cookieSerializer.setUseBase64Encoding(false);
    };
  }
}
