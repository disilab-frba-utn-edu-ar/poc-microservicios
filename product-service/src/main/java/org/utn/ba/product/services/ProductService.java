package org.utn.ba.product.services;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.utn.ba.product.dto.ProductInputDTO;
import org.utn.ba.product.dto.ProductOutputDTO;
import org.utn.ba.product.mappers.ProductMapper;
import org.utn.ba.product.models.entities.Product;
import org.utn.ba.product.models.repositories.ProductRepository;

import java.util.List;

@Service
public class ProductService implements IProductService{

    @Autowired
    private ProductRepository productRepository;

    @Override
    public List<ProductOutputDTO> findAll() {
        return this.productRepository.findAll().stream().map(ProductMapper::createFrom).toList();
    }

    @Override
    public ProductOutputDTO findById(Long id) {
        return this.productRepository.findById(id).map(ProductMapper:: createFrom).orElse(null);
    }

    @Value("${minio.folder.temp}")
    private String tempFolder;

    @Value("${minio.folder.products}")
    private String productsFolder;

    @Autowired
    private IStorageService storageService;

    @Override
    public Long createProduct(ProductInputDTO product) {
        if (product.getTempImageKey() == null || !storageService.fileExists(product.getTempImageKey())) {
            throw new IllegalArgumentException("La imagen no existe o no se subió correctamente a MinIO");
        }

        String finalImageKey = product.getTempImageKey().replace(tempFolder, productsFolder);

        storageService.promoteFile(product.getTempImageKey(), finalImageKey);

        Product newProduct = new Product();
        newProduct.setName(product.getName());
        newProduct.setPrice(product.getPrice());
        newProduct.setImageUrl(finalImageKey);

        this.productRepository.save(newProduct);
        return newProduct.getId();
    }
}
