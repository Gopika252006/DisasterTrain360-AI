package com.disastertrain360.model;

public class Training {
    private String trainingId;
    private String trainingName;
    private String theme;
    private String state;
    private String district;
    private String venue;
    private String date;
    private Integer participants;
    private String photoUrl;
    private String status;
    private String createdBy;
    private String createdAt;

    public Training() {}

    public Training(String trainingId, String trainingName, String theme, String state,
                    String district, String venue, String date, Integer participants,
                    String photoUrl, String status, String createdBy, String createdAt) {
        this.trainingId = trainingId;
        this.trainingName = trainingName;
        this.theme = theme;
        this.state = state;
        this.district = district;
        this.venue = venue;
        this.date = date;
        this.participants = participants;
        this.photoUrl = photoUrl;
        this.status = status;
        this.createdBy = createdBy;
        this.createdAt = createdAt;
    }

    public String getTrainingId() { return trainingId; }
    public void setTrainingId(String trainingId) { this.trainingId = trainingId; }

    public String getTrainingName() { return trainingName; }
    public void setTrainingName(String trainingName) { this.trainingName = trainingName; }

    public String getTheme() { return theme; }
    public void setTheme(String theme) { this.theme = theme; }

    public String getState() { return state; }
    public void setState(String state) { this.state = state; }

    public String getDistrict() { return district; }
    public void setDistrict(String district) { this.district = district; }

    public String getVenue() { return venue; }
    public void setVenue(String venue) { this.venue = venue; }

    public String getDate() { return date; }
    public void setDate(String date) { this.date = date; }

    public Integer getParticipants() { return participants; }
    public void setParticipants(Integer participants) { this.participants = participants; }

    public String getPhotoUrl() { return photoUrl; }
    public void setPhotoUrl(String photoUrl) { this.photoUrl = photoUrl; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getCreatedBy() { return createdBy; }
    public void setCreatedBy(String createdBy) { this.createdBy = createdBy; }

    public String getCreatedAt() { return createdAt; }
    public void setCreatedAt(String createdAt) { this.createdAt = createdAt; }

    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private final Training obj = new Training();

        public Builder trainingId(String v) { obj.trainingId = v; return this; }
        public Builder trainingName(String v) { obj.trainingName = v; return this; }
        public Builder theme(String v) { obj.theme = v; return this; }
        public Builder state(String v) { obj.state = v; return this; }
        public Builder district(String v) { obj.district = v; return this; }
        public Builder venue(String v) { obj.venue = v; return this; }
        public Builder date(String v) { obj.date = v; return this; }
        public Builder participants(Integer v) { obj.participants = v; return this; }
        public Builder photoUrl(String v) { obj.photoUrl = v; return this; }
        public Builder status(String v) { obj.status = v; return this; }
        public Builder createdBy(String v) { obj.createdBy = v; return this; }
        public Builder createdAt(String v) { obj.createdAt = v; return this; }

        public Training build() { return obj; }
    }
}
