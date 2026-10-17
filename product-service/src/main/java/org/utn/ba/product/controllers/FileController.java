package org.utn.ba.product.controllers;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.utn.ba.product.dto.PresignedUrlOutputDTO;
import org.utn.ba.product.services.IStorageService;

import java.util.UUID;

@RestController
@RequestMapping("/files")
@RequiredArgsConstructor
public class FileController {
    private final IStorageService storageService;

    @Value("${minio.folder.temp}")
    private String tempFolder;

    @GetMapping("/presigned-url")
    public ResponseEntity<PresignedUrlOutputDTO> getPresignedUrl(
            @RequestParam String fileName,
            @RequestParam String contentType) {

        String tempKey = getTempKey(fileName);

        String presignedUrl = storageService.generatePresignedUrl(tempKey, contentType);

        PresignedUrlOutputDTO response = PresignedUrlOutputDTO.builder()
                .presignedUrl(presignedUrl)
                .objectKey(tempKey)
                .build();

        return ResponseEntity.ok(response);
    }

    private String getTempKey(String fileName) {
        return tempFolder + UUID.randomUUID() + "_" + fileName;
    }
}
