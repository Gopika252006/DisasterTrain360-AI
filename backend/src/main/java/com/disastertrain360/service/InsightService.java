package com.disastertrain360.service;

import com.disastertrain360.model.DistrictInsight;
import com.disastertrain360.repository.InMemoryStore;
import org.springframework.stereotype.Service;

import java.util.Comparator;
import java.util.List;

@Service
public class InsightService {

    private final InMemoryStore store;

    public InsightService(InMemoryStore store) {
        this.store = store;
    }

    public List<DistrictInsight> getAllInsights(String state, String riskLevel) {
        return store.allInsights().stream()
                .filter(i -> state     == null || state.isBlank()     || i.getState().equalsIgnoreCase(state))
                .filter(i -> riskLevel == null || riskLevel.isBlank() || i.getRiskLevel().equalsIgnoreCase(riskLevel))
                .sorted(Comparator.comparingInt(DistrictInsight::getPreparednessScore))
                .toList();
    }
}
