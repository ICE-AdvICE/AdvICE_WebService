package com.icehufs.icebreaker;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@EnableScheduling
@SpringBootApplication
public class IcebreakerApplication {

	public static void main(String[] args) {
		SpringApplication.run(IcebreakerApplication.class, args);
	}
}
