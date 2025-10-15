package org.utn.ba.order.client;

import feign.RequestInterceptor;
import feign.RequestTemplate;
import org.springframework.stereotype.Component;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

@Component
public class FeignClientInterceptor implements RequestInterceptor {

  private static final String AUTHORIZATION_HEADER = "Authorization";

  @Override
  public void apply(RequestTemplate template) {
    var requestAttributes = RequestContextHolder.getRequestAttributes();
    if (requestAttributes instanceof ServletRequestAttributes) {
      var request = ((ServletRequestAttributes) requestAttributes).getRequest();

      String authHeader = request.getHeader(AUTHORIZATION_HEADER);

      if (authHeader != null && authHeader.startsWith("Bearer ")) {
        template.header(AUTHORIZATION_HEADER, authHeader);
      }
    }
  }
}