package it.unical.demacs.asd.energycommunities;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableAsync;

@SpringBootApplication
@EnableAsync
public class EnergycommunitiesApplication {

	public static void main(String[] args) {
		SpringApplication.run(EnergycommunitiesApplication.class, args);
	}

}