package com.disastertrain360.model;

public class DistrictInsight {
    private String insightId;
    private String state;
    private String district;
    private Integer preparednessScore;
    private String riskLevel;
    private String coverageStatus;
    private String gapAnalysis;
    private String recommendation;
    private Integer aiConfidence;
    private String lastUpdated;

    public DistrictInsight() {}

    public DistrictInsight(String insightId, String state, String district,
                           Integer preparednessScore, String riskLevel, String coverageStatus,
                           String gapAnalysis, String recommendation, Integer aiConfidence,
                           String lastUpdated) {
        this.insightId = insightId;
        this.state = state;
        this.district = district;
        this.preparednessScore = preparednessScore;
        this.riskLevel = riskLevel;
        this.coverageStatus = coverageStatus;
        this.gapAnalysis = gapAnalysis;
        this.recommendation = recommendation;
        this.aiConfidence = aiConfidence;
        this.lastUpdated = lastUpdated;
    }

    public String getInsightId() { return insightId; }
    public void setInsightId(String insightId) { this.insightId = insightId; }

    public String getState() { return state; }
    public void setState(String state) { this.state = state; }

    public String getDistrict() { return district; }
    public void setDistrict(String district) { this.district = district; }

    public Integer getPreparednessScore() { return preparednessScore; }
    public void setPreparednessScore(Integer preparednessScore) { this.preparednessScore = preparednessScore; }

    public String getRiskLevel() { return riskLevel; }
    public void setRiskLevel(String riskLevel) { this.riskLevel = riskLevel; }

    public String getCoverageStatus() { return coverageStatus; }
    public void setCoverageStatus(String coverageStatus) { this.coverageStatus = coverageStatus; }

    public String getGapAnalysis() { return gapAnalysis; }
    public void setGapAnalysis(String gapAnalysis) { this.gapAnalysis = gapAnalysis; }

    public String getRecommendation() { return recommendation; }
    public void setRecommendation(String recommendation) { this.recommendation = recommendation; }

    public Integer getAiConfidence() { return aiConfidence; }
    public void setAiConfidence(Integer aiConfidence) { this.aiConfidence = aiConfidence; }

    public String getLastUpdated() { return lastUpdated; }
    public void setLastUpdated(String lastUpdated) { this.lastUpdated = lastUpdated; }

    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private final DistrictInsight obj = new DistrictInsight();

        public Builder insightId(String v) { obj.insightId = v; return this; }
        public Builder state(String v) { obj.state = v; return this; }
        public Builder district(String v) { obj.district = v; return this; }
        public Builder preparednessScore(Integer v) { obj.preparednessScore = v; return this; }
        public Builder riskLevel(String v) { obj.riskLevel = v; return this; }
        public Builder coverageStatus(String v) { obj.coverageStatus = v; return this; }
        public Builder gapAnalysis(String v) { obj.gapAnalysis = v; return this; }
        public Builder recommendation(String v) { obj.recommendation = v; return this; }
        public Builder aiConfidence(Integer v) { obj.aiConfidence = v; return this; }
        public Builder lastUpdated(String v) { obj.lastUpdated = v; return this; }

        public DistrictInsight build() { return obj; }
    }
}
