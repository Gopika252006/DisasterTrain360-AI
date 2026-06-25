package com.disastertrain360.service;

import org.springframework.stereotype.Service;

@Service
public class LambdaService {

    public void invokeTrainingLambda(String trainingName) {
        System.out.println("Lambda Invoked for: " + trainingName);
    }
}
