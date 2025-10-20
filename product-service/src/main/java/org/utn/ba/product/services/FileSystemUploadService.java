package org.utn.ba.product.services;

import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;
import org.utn.ba.product.configuration.FileStorageProperties;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class FileSystemUploadService implements IFileUploadService{

  private final FileStorageProperties fileStorageProperties;
  private Path fileStorageLocation;
  @PostConstruct
  public void init() {
    this.fileStorageLocation = Paths.get(fileStorageProperties.getUploadDir())
        .toAbsolutePath().normalize();
    try {
      Files.createDirectories(this.fileStorageLocation);
    } catch (Exception ex) {
      throw new RuntimeException("Could not create the directory for uploads.", ex);
    }
  }

  @Override
  public String saveImage(MultipartFile file) {
    String fileName = UUID.randomUUID().toString() + "_" + file.getOriginalFilename();

    try {
      Path targetLocation = this.fileStorageLocation.resolve(fileName);
      Files.copy(file.getInputStream(), targetLocation);

      return "/images/" + fileName;
    } catch (IOException ex) {
      throw new RuntimeException("Could not store file " + fileName + ". Please try again!", ex);
    }
  }
}
