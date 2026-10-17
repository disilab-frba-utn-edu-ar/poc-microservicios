package org.utn.ba.product.services;

public interface IStorageService {
    String generatePresignedUrl(String objectKey, String contentType);

    boolean fileExists(String objectKey);

    void promoteFile(String sourceKey, String destinationKey);
}
