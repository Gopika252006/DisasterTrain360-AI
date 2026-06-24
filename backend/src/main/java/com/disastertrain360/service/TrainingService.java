package com.disastertrain360.service;

import com.disastertrain360.dto.TrainingRequest;
import com.disastertrain360.model.Training;
import com.disastertrain360.repository.InMemoryStore;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Comparator;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class TrainingService {

    private final InMemoryStore store;

    public TrainingService(InMemoryStore store) {
        this.store = store;
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
        store.saveTraining(training);
        return training;
    }

    public List<Training> getAllTrainings(String state, String district, String status) {
        return store.allTrainings().stream()
                .filter(t -> state    == null || state.isBlank()    || t.getState().equalsIgnoreCase(state))
                .filter(t -> district == null || district.isBlank() || t.getDistrict().equalsIgnoreCase(district))
                .filter(t -> status   == null || status.isBlank()   || t.getStatus().equalsIgnoreCase(status))
                .sorted(Comparator.comparing(Training::getDate).reversed())
                .toList();
    }

    public Optional<Training> getTrainingById(String id) {
        return store.findTrainingById(id);
    }
}
