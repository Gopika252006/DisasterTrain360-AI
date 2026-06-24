package com.disastertrain360.aws;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Service;

/**
 * AWS service layer — activated only when app.mock.enabled=false.
 * Replace InMemoryStore calls in services with these methods
 * when connecting to AWS DynamoDB / S3 / SNS.
 */
@Service
@ConditionalOnProperty(name = "app.mock.enabled", havingValue = "false")
public class AwsService {

    private static final Logger log = LoggerFactory.getLogger(AwsService.class);

    @Value("${app.aws.s3.bucket}")
    private String s3Bucket;

    // ── DynamoDB ──────────────────────────────────────
    public void putItem(String tableName, Object item) {
        log.info("DynamoDB putItem → table={}", tableName);
        // TODO: serialize item to AttributeValue map and call dynamoDbClient.putItem()
    }

    public Object getItem(String tableName, String key) {
        log.info("DynamoDB getItem → table={}, key={}", tableName, key);
        // TODO: call dynamoDbClient.getItem() and deserialize
        return null;
    }

    // ── S3 ────────────────────────────────────────────
    public String uploadFile(String key, byte[] data, String contentType) {
        log.info("S3 upload → bucket={}, key={}", s3Bucket, key);
        // TODO: call s3Client.putObject()
        return "https://" + s3Bucket + ".s3.amazonaws.com/" + key;
    }

    // ── SNS ───────────────────────────────────────────
    public void publishNotification(String topicArn, String subject, String message) {
        log.info("SNS publish → topic={}, subject={}", topicArn, subject);
        // TODO: call snsClient.publish()
    }

    // ── Bedrock ───────────────────────────────────────
    public String invokeAiRecommendation(String prompt) {
        log.info("Bedrock invoke → prompt length={}", prompt.length());
        // TODO: call BedrockRuntimeClient.invokeModel() with prompt
        return "AI recommendation pending Bedrock integration.";
    }
}
