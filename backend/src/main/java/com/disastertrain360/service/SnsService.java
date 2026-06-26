package com.disastertrain360.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import software.amazon.awssdk.services.sns.SnsClient;
import software.amazon.awssdk.services.sns.model.PublishRequest;

@Service
public class SnsService {

    private final SnsClient snsClient;

    @Value("${app.aws.sns.topic.arn}")
    private String topicArn;

    public SnsService(SnsClient snsClient) {
        this.snsClient = snsClient;
    }

    public void sendCriticalDistrictAlert(String district,
                                          int preparednessScore,
                                          String riskLevel) {

        String message = "District: " + district +
                "\nPreparedness Score: " + preparednessScore +
                "\nRisk Level: " + riskLevel +
                "\nImmediate intervention required.";

        snsClient.publish(PublishRequest.builder()
                .topicArn(topicArn)
                .subject("Critical District Alert")
                .message(message)
                .build());
    }
}