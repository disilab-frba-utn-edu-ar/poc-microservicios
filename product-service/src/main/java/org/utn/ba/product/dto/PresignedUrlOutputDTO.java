package org.utn.ba.product.dto;

import lombok.*;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PresignedUrlOutputDTO {
    private String presignedUrl;
    private String objectKey;
}
