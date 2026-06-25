package com.disastertrain360.service;

import com.disastertrain360.dto.TrainingRequest;
import com.disastertrain360.model.Training;
import com.disastertrain360.repository.DynamoDbRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Comparator;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class TrainingService {

    private final DynamoDbRepository repo;

    public TrainingService(DynamoDbRepository repo) {
        this.repo = repo;
    }

    public Training createTraining(TrainingRequest req, String createdBy) {
        Training training = Training.builder()
                .trainingId(UUID.randomUUID().toString())
                .trainingName(req.getTrainingName())
                .theme(req.getTheme())
                .state(req.getState())
                .district(req.getDistrict())
                .venue(req.getVenue())
                .date(req.getDate())
                .participants(req.getParticipants())
                .photoUrl(req.getPhotoUrl() != null ? req.getPhotoUrl() : "")
                .status(req.getStatus())
                .createdBy(createdBy)
                .createdAt(LocalDateTime.now().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME))
                .build();
        repo.saveTraining(training);
        return training;
    }

    public List<Training> getAllTrainings(String state, String district, String status) {
        return repo.allTrainings().stream()
                .filter(t -> state    == null || state.isBlank()    || t.getState().equalsIgnoreCase(state))
                .filter(t -> district == null || district.isBlank() || t.getDistrict().equalsIgnoreCase(district))
                .filter(t -> status   == null || status.isBlank()   || t.getStatus().equalsIgnoreCase(status))
                .sorted(Comparator.comparing(Training::getDate).reversed())
                .toList();
    }

    public Optional<Training> getTrainingById(String id) {
        return repo.findTrainingById(id);
    }

    public Optional<Training> updateTraining(String id, TrainingRequest req) {
        return repo.findTrainingById(id).map(existing -> {
            Training updated = Training.builder()
                    .trainingId(existing.getTrainingId())
                    .trainingName(req.getTrainingName() != null ? req.getTrainingName() : existing.getTrainingName())
                    .theme(req.getTheme()       != null ? req.getTheme()       : existing.getTheme())
                    .state(req.getState()       != null ? req.getState()       : existing.getState())
                    .district(req.getDistrict() != null ? req.getDistrict()    : existing.getDistrict())
                    .venue(req.getVenue()       != null ? req.getVenue()       : existing.getVenue())
                    .date(req.getDate()         != null ? req.getDate()        : existing.getDate())
                    .participants(req.getParticipants() > 0 ? req.getParticipants() : existing.getParticipants())
                    .photoUrl(req.getPhotoUrl() != null ? req.getPhotoUrl()    : existing.getPhotoUrl())
                    .status(req.getStatus()     != null ? req.getStatus()      : existing.getStatus())
                    .createdBy(existing.getCreatedBy())
                    .createdAt(existing.getCreatedAt())
                    .build();
            repo.saveTraining(updated);
            return updated;
        });
    }
}
