package com.till.bank;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.PropertySource;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

//@EnableJpaRepositories("com.till.bank.*")
//@ComponentScan(basePackages = { "com.till.bank.*" })
//@EntityScan("com.till.bank.*") // Specify the package to scan for entities

@SpringBootApplication
@PropertySource("classpath:application-local.properties")
public class BankApplication {
	public static void main(String[] args){SpringApplication.run(BankApplication.class, args);
	}

}
