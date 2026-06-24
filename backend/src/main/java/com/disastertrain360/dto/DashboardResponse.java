package com.disastertrain360.dto;

public class DashboardResponse {
    private int totalTrainings;
    private int completedTrainings;
    private int preparedDistricts;
    private int underPreparedDistricts;
    private int totalStatesMonitored;
    private int totalDistrictsMonitored;
    private int averagePreparednessScore;
    private int highRiskStatesCount;
    private int totalParticipants;
    private int activePrograms;
    private double coveragePercentage;
    private int riskScore;

    public DashboardResponse() {}

    public DashboardResponse(int totalTrainings, int completedTrainings, int preparedDistricts,
                             int underPreparedDistricts, int totalStatesMonitored,
                             int totalDistrictsMonitored, int averagePreparednessScore,
                             int highRiskStatesCount, int totalParticipants, int activePrograms,
                             double coveragePercentage, int riskScore) {
        this.totalTrainings = totalTrainings;
        this.completedTrainings = completedTrainings;
        this.preparedDistricts = preparedDistricts;
        this.underPreparedDistricts = underPreparedDistricts;
        this.totalStatesMonitored = totalStatesMonitored;
        this.totalDistrictsMonitored = totalDistrictsMonitored;
        this.averagePreparednessScore = averagePreparednessScore;
        this.highRiskStatesCount = highRiskStatesCount;
        this.totalParticipants = totalParticipants;
        this.activePrograms = activePrograms;
        this.coveragePercentage = coveragePercentage;
        this.riskScore = riskScore;
    }

    public int getTotalTrainings() { return totalTrainings; }
    public void setTotalTrainings(int totalTrainings) { this.totalTrainings = totalTrainings; }

    public int getCompletedTrainings() { return completedTrainings; }
    public void setCompletedTrainings(int completedTrainings) { this.completedTrainings = completedTrainings; }

    public int getPreparedDistricts() { return preparedDistricts; }
    public void setPreparedDistricts(int preparedDistricts) { this.preparedDistricts = preparedDistricts; }

    public int getUnderPreparedDistricts() { return underPreparedDistricts; }
    public void setUnderPreparedDistricts(int underPreparedDistricts) { this.underPreparedDistricts = underPreparedDistricts; }

    public int getTotalStatesMonitored() { return totalStatesMonitored; }
    public void setTotalStatesMonitored(int totalStatesMonitored) { this.totalStatesMonitored = totalStatesMonitored; }

    public int getTotalDistrictsMonitored() { return totalDistrictsMonitored; }
    public void setTotalDistrictsMonitored(int totalDistrictsMonitored) { this.totalDistrictsMonitored = totalDistrictsMonitored; }

    public int getAveragePreparednessScore() { return averagePreparednessScore; }
    public void setAveragePreparednessScore(int averagePreparednessScore) { this.averagePreparednessScore = averagePreparednessScore; }

    public int getHighRiskStatesCount() { return highRiskStatesCount; }
    public void setHighRiskStatesCount(int highRiskStatesCount) { this.highRiskStatesCount = highRiskStatesCount; }

    public int getTotalParticipants() { return totalParticipants; }
    public void setTotalParticipants(int totalParticipants) { this.totalParticipants = totalParticipants; }

    public int getActivePrograms() { return activePrograms; }
    public void setActivePrograms(int activePrograms) { this.activePrograms = activePrograms; }

    public double getCoveragePercentage() { return coveragePercentage; }
    public void setCoveragePercentage(double coveragePercentage) { this.coveragePercentage = coveragePercentage; }

    public int getRiskScore() { return riskScore; }
    public void setRiskScore(int riskScore) { this.riskScore = riskScore; }

    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private final DashboardResponse obj = new DashboardResponse();

        public Builder totalTrainings(int v) { obj.totalTrainings = v; return this; }
        public Builder completedTrainings(int v) { obj.completedTrainings = v; return this; }
        public Builder preparedDistricts(int v) { obj.preparedDistricts = v; return this; }
        public Builder underPreparedDistricts(int v) { obj.underPreparedDistricts = v; return this; }
        public Builder totalStatesMonitored(int v) { obj.totalStatesMonitored = v; return this; }
        public Builder totalDistrictsMonitored(int v) { obj.totalDistrictsMonitored = v; return this; }
        public Builder averagePreparednessScore(int v) { obj.averagePreparednessScore = v; return this; }
        public Builder highRiskStatesCount(int v) { obj.highRiskStatesCount = v; return this; }
        public Builder totalParticipants(int v) { obj.totalParticipants = v; return this; }
        public Builder activePrograms(int v) { obj.activePrograms = v; return this; }
        public Builder coveragePercentage(double v) { obj.coveragePercentage = v; return this; }
        public Builder riskScore(int v) { obj.riskScore = v; return this; }

        public DashboardResponse build() { return obj; }
    }
}
