package org.example.developersb_submission.controller;

import jakarta.validation.Valid;
import org.example.developersb_submission.Entity.ProductInfoEntity;
import org.example.developersb_submission.Service.ProductFormService;
import org.example.developersb_submission.dto.ProductForm;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class InfoFormController {

    private final ProductFormService productFormService;

    public InfoFormController(ProductFormService productFormService){this.productFormService = productFormService;}

    @GetMapping("/api/product-management")
    public List<ProductInfoEntity> index() {
        return productFormService.findAllProducts();
    }

    @PostMapping("/api/product-registration")
    @ResponseStatus(HttpStatus.CREATED)
    public ProductInfoEntity store(@Valid @RequestBody ProductForm form) {
        return productFormService.create(form);
    }


}
