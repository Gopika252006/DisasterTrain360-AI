package com.disastertrain360.service;

import com.disastertrain360.model.DistrictInsight;
import com.disastertrain360.repository.DynamoDbRepository;
import org.springframework.stereotype.Service;

import java.util.Comparator;
import java.util.List;

@Service
public class InsightService {

    private final DynamoDbRepository repo;

    public InsightService(DynamoDbRepository repo) {
        this.repo = repo;
    }

    public List<DistrictInsight> getAllInsights(String state, String riskLevel) {
        return repo.allInsights().stream()
                .filter(i -> state     == null || state.isBlank()     || i.getState().equalsIgnoreCase(state))
                .filter(i -> riskLevel == null || riskLevel.isBlank() || i.getRiskLevel().equalsIgnoreCase(riskLevel))
                .sorted(Comparator.comparingInt(DistrictInsight::getPreparednessScore))
                .toList();
    }
}
