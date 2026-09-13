package org.example.developersb_submission.Repository;

import org.example.developersb_submission.Entity.ProductInfoEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ProductInfoRepository extends JpaRepository<ProductInfoEntity,Long> {
}
