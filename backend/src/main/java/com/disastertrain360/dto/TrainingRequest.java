package com.disastertrain360.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class TrainingRequest {

    @NotBlank(message = "Training name is required")
    private String trainingName;

    @NotBlank(message = "Theme is required")
    private String theme;

    @NotBlank(message = "State is required")
    private String state;

    @NotBlank(message = "District is required")
    private String district;

    @NotBlank(message = "Venue is required")
    private String venue;

    @NotBlank(message = "Date is required")
    private String date;

    @NotNull(message = "Participants count is required")
    @Min(value = 1, message = "Participants must be at least 1")
    private Integer participants;

    private String photoUrl;

    @NotBlank(message = "Status is required")
    private String status;

    public TrainingRequest() {}

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
}
