package org.utn.ba.product.configuration;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class MvcConfig implements WebMvcConfigurer {

  @Value("${file.upload-dir}")
  private String uploadDir;

  @Override
  public void addResourceHandlers(ResourceHandlerRegistry registry) {
    String resourceHandler = "/images/**";

    String resourceLocations = "file:" + uploadDir + "/";

    registry.addResourceHandler(resourceHandler)
        .addResourceLocations(resourceLocations);
  }
}