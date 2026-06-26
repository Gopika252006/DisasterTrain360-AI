package com.disastertrain360.service;

import org.springframework.stereotype.Service;
import software.amazon.awssdk.core.SdkBytes;
import software.amazon.awssdk.services.lambda.LambdaClient;
import software.amazon.awssdk.services.lambda.model.InvokeRequest;
import software.amazon.awssdk.services.lambda.model.InvokeResponse;

@Service
public class LambdaService {

    private static final String FUNCTION_NAME = "disastertrain360-training-processor";

    public void invokeTrainingLambda(String trainingName) {

        LambdaClient lambdaClient = LambdaClient.create();

        String payload = "{ \"trainingName\": \"" + trainingName + "\" }";

        InvokeRequest request = InvokeRequest.builder()
                .functionName(FUNCTION_NAME)
                .payload(SdkBytes.fromUtf8String(payload))
                .build();

        InvokeResponse response = lambdaClient.invoke(request);

        System.out.println("Lambda Status Code : " + response.statusCode());
    }
}