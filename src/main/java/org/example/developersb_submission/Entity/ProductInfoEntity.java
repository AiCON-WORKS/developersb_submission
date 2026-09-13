package org.example.developersb_submission.Entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "PRODUCTS")
public class ProductInfoEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private  Integer id;

    @Column(name = "NAME", nullable = false, length = 20)
    private String name;

    @Column(name = "COST", nullable = false)
    private Integer cost;

    @Column(name = "LIST", nullable = false)
    private Integer list;

    @Column(name = "SUPPLIER", nullable = false, length = 20)
    private String supplier;

    @Column(name = "MANUFACTURER", nullable = false, length = 20)
    private String manufacturer;

    public ProductInfoEntity(){

    }

    public ProductInfoEntity(String name, Integer cost, Integer list, String supplier, String manufacturer){
        this.name=name;
        this.cost=cost;
        this.list=list;
        this.supplier=supplier;
        this.manufacturer=manufacturer;
    }
}
