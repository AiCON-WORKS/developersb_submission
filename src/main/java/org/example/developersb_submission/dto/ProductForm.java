package org.example.developersb_submission.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ProductForm {

    @NotBlank(message = "商品名は必須です")
    private String name;

    @NotNull(message = "仕入価格は必須です")
    private Integer cost;

    @NotNull(message = "定価は必須です")
    private Integer list;

    @NotBlank(message = "仕入先は必須です")
    private String supplier;

    @NotBlank(message = "メーカーは必須です")
    private String manufacturer;

}
