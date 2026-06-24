package com.disastertrain360.service;

import com.disastertrain360.dto.DashboardResponse;
import com.disastertrain360.model.DistrictInsight;
import com.disastertrain360.model.Training;
import com.disastertrain360.repository.InMemoryStore;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class DashboardService {

    private final InMemoryStore store;

    public DashboardService(InMemoryStore store) {
        this.store = store;
    }

    public DashboardResponse getDashboard() {
        List<Training> trainings = store.allTrainings();
        List<DistrictInsight> insights = store.allInsights();

        long completed     = trainings.stream().filter(t -> "Completed".equalsIgnoreCase(t.getStatus())).count();
        long active        = trainings.stream().filter(t -> "Ongoing".equalsIgnoreCase(t.getStatus())).count();
        int  totalPax      = trainings.stream().mapToInt(Training::getParticipants).sum();

        long prepared      = insights.stream().filter(i -> i.getPreparednessScore() >= 60).count();
        long underPrepared = insights.stream().filter(i -> i.getPreparednessScore() <  60).count();
        long highRisk      = insights.stream().filter(i -> "CRITICAL".equals(i.getRiskLevel())).count();

        double avgScore = insights.stream()
                .mapToInt(DistrictInsight::getPreparednessScore).average().orElse(65.0);

        long totalDistricts = insights.size();
        long highRiskStates = insights.stream()
                .filter(i -> i.getPreparednessScore() < 50)
                .map(DistrictInsight::getState)
                .distinct().count();

        double coverage = trainings.isEmpty() ? 0 :
                Math.round((completed / (double) trainings.size()) * 1000.0) / 10.0;

        return DashboardResponse.builder()
                .totalTrainings(trainings.size())
                .completedTrainings((int) completed)
                .preparedDistricts((int) prepared)
                .underPreparedDistricts((int) underPrepared)
                .totalStatesMonitored(30)
                .totalDistrictsMonitored(Math.max(780, (int) totalDistricts))
                .averagePreparednessScore((int) Math.round(avgScore))
                .highRiskStatesCount((int) highRiskStates)
                .totalParticipants(totalPax)
                .activePrograms((int) active)
                .coveragePercentage(coverage)
                .riskScore(Math.max(0, 100 - (int) Math.round(avgScore)))
                .build();
    }
}
