package org.example.developersb_submission.config;

import org.example.developersb_submission.Entity.AppUser;
import org.example.developersb_submission.Entity.ProductInfoEntity;
import org.example.developersb_submission.Entity.Role;
import org.example.developersb_submission.Repository.AppUserRepository;
import org.example.developersb_submission.Repository.ProductInfoRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class DataInitializer {
    @Bean
    CommandLineRunner initChapterData(
            AppUserRepository appUserRepository,
            PasswordEncoder passwordEncoder,
            ProductInfoRepository productInfoRepository) {
        return args -> {
            if (appUserRepository.count() == 0) {
                appUserRepository.save(new AppUser("user1", passwordEncoder.encode("user1"), Role.ROLE_USER));
                appUserRepository.save(new AppUser("admin", passwordEncoder.encode("admin"), Role.ROLE_ADMIN));
            }

            if (productInfoRepository.count() == 0) {
                productInfoRepository.save(new ProductInfoEntity("ネジ", 80, 100, "鈴木商店", "切削商店"));
                productInfoRepository.save(new ProductInfoEntity("ハサミ", 280, 300, "工具店", "NONO"));
                productInfoRepository.save(new ProductInfoEntity("のり", 100, 130, "鈴木商店", "NONO"));
                productInfoRepository.save(new ProductInfoEntity("蝶番", 120, 150, "竹田金属", "カナセラ"));
//            }
            }
            ;
        };
    }
}
