package org.example.developersb_submission.Service;

import org.example.developersb_submission.Entity.ProductInfoEntity;
import org.example.developersb_submission.Repository.ProductInfoRepository;
import org.example.developersb_submission.dto.ProductForm;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProductFormService {
    private final ProductInfoRepository productRepository;

    public ProductFormService(ProductInfoRepository productRepository) {
        this.productRepository = productRepository;
    }

    public List<ProductInfoEntity> findAllProducts() {
        return productRepository.findAll();
    }

    public ProductInfoEntity create(ProductForm form) {
        var product = new ProductInfoEntity(
                form.getName(),
                form.getCost(),
                form.getList(),
                form.getSupplier(),
                form.getManufacturer()
        );

        return productRepository.save(product);
    }
}
