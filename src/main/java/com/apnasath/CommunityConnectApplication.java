package com.apnasath;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class CommunityConnectApplication {

    public static void main(String[] args) {
        SpringApplication.run(CommunityConnectApplication.class, args);
        System.out.println("🚀 CommunityConnect Application Started Successfully!");
        System.out.println("📍 Server running on: http://localhost:8080");
    }
}
