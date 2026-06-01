package dev.kali.labendicion;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class LabendicionApplication {

    public static void main(String[] args) {
        SpringApplication.run(LabendicionApplication.class, args);
    }

}
