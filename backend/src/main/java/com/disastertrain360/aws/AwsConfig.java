package com.disastertrain360.aws;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import software.amazon.awssdk.auth.credentials.AwsBasicCredentials;
import software.amazon.awssdk.auth.credentials.StaticCredentialsProvider;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.dynamodb.DynamoDbClient;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.sns.SnsClient;

@Configuration
public class AwsConfig {

    // ── DynamoDB credentials ───────────────────────────────────────────────────
    @Value("${aws.dynamodb.region}")     private String dynamoRegion;
    @Value("${aws.dynamodb.access-key}") private String dynamoAccessKey;
    @Value("${aws.dynamodb.secret-key}") private String dynamoSecretKey;

    // ── S3 credentials ─────────────────────────────────────────────────────────
    @Value("${aws.s3.region}")           private String s3Region;
    @Value("${aws.s3.access-key}")       private String s3AccessKey;
    @Value("${aws.s3.secret-key}")       private String s3SecretKey;

    // ── Optional Separate SNS credentials (defaults to DynamoDB credentials) ─
    @Value("${aws.sns.region:}")         private String snsRegion;
    @Value("${aws.sns.access-key:}")     private String snsAccessKey;
    @Value("${aws.sns.secret-key:}")     private String snsSecretKey;

    @Bean
    public DynamoDbClient dynamoDbClient() {
        return DynamoDbClient.builder()
                .region(Region.of(dynamoRegion))
                .credentialsProvider(StaticCredentialsProvider.create(
                        AwsBasicCredentials.create(dynamoAccessKey, dynamoSecretKey)))
                .build();
    }

    @Bean
    public S3Client s3Client() {
        return S3Client.builder()
                .region(Region.of(s3Region))
                .credentialsProvider(StaticCredentialsProvider.create(
                        AwsBasicCredentials.create(s3AccessKey, s3SecretKey)))
                .build();
    }

    @Bean
    public SnsClient snsClient() {
        String region = (snsRegion != null && !snsRegion.isBlank()) ? snsRegion : dynamoRegion;
        String accessKey = (snsAccessKey != null && !snsAccessKey.isBlank()) ? snsAccessKey : dynamoAccessKey;
        String secretKey = (snsSecretKey != null && !snsSecretKey.isBlank()) ? snsSecretKey : dynamoSecretKey;

        return SnsClient.builder()
                .region(Region.of(region))
                .credentialsProvider(StaticCredentialsProvider.create(
                        AwsBasicCredentials.create(accessKey, secretKey)))
                .build();
    }
}
