package com.icehufs.icebreaker;

import io.github.cdimascio.dotenv.Dotenv;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@EnableScheduling
@SpringBootApplication
public class IcebreakerApplication {	
    public static void main( String[] args) {
        // .env 파일 로드
        Dotenv dotenv = Dotenv.configure()
            .directory("/app") // 컨테이너 내부 작업 디렉토리
            .ignoreIfMissing() // 파일이 없으면 무시
            .load();

        // 환경 변수를 시스템 프로퍼티로 설정
        if (dotenv != null) {
            dotenv.entries().forEach(entry -> {
                System.setProperty(entry.getKey(), entry.getValue());
            });
        }

        SpringApplication.run(IcebreakerApplication.class, args);
    }	
}

