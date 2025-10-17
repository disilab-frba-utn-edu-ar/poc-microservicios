package org.utn.ba.product.services;

import org.springframework.web.multipart.MultipartFile;

public interface IFileUploadService {
  String saveImage(MultipartFile file);
}
