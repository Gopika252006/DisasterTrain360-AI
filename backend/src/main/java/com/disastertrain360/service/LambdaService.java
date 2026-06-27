package com.disastertrain360.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import software.amazon.awssdk.auth.credentials.AwsBasicCredentials;
import software.amazon.awssdk.auth.credentials.StaticCredentialsProvider;
import software.amazon.awssdk.core.SdkBytes;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.lambda.LambdaClient;
import software.amazon.awssdk.services.lambda.model.InvokeRequest;
import software.amazon.awssdk.services.lambda.model.InvokeResponse;

@Service
public class LambdaService {

    @Value("${aws.lambda.region}")
    private String region;

    @Value("${aws.lambda.access-key}")
    private String accessKey;

    @Value("${aws.lambda.secret-key}")
    private String secretKey;

    @Value("${app.aws.lambda.function-name}")
    private String functionName;

    public void invokeTrainingLambda(String trainingName) {

        AwsBasicCredentials credentials =
                AwsBasicCredentials.create(accessKey, secretKey);

        LambdaClient lambdaClient = LambdaClient.builder()
                .region(Region.of(region))
                .credentialsProvider(
                        StaticCredentialsProvider.create(credentials))
                .build();

        String payload = "{ \"trainingName\": \"" + trainingName + "\" }";

        InvokeRequest request = InvokeRequest.builder()
                .functionName(functionName)
                .payload(SdkBytes.fromUtf8String(payload))
                .build();

        InvokeResponse response = lambdaClient.invoke(request);

        System.out.println("Lambda Status Code : " + response.statusCode());

        lambdaClient.close();
    }
}