package com.disastertrain360.service;

import com.disastertrain360.model.Enrollment;
import com.disastertrain360.model.Training;
import com.disastertrain360.repository.DynamoDbRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Service
public class EnrollmentService {

    private final DynamoDbRepository repo;

    public EnrollmentService(DynamoDbRepository repo) {
        this.repo = repo;
    }

    /**
     * Register a user for a training. Throws if already enrolled or training not found.
     */
    public Enrollment enroll(String trainingId, String userEmail, String userName) {
        Training training = repo.findTrainingById(trainingId)
                .orElseThrow(() -> new RuntimeException("Training not found"));

        if (repo.existsEnrollment(userEmail, trainingId)) {
            throw new RuntimeException("Already enrolled in this training");
        }

        Enrollment enrollment = Enrollment.builder()
                .enrollmentId(UUID.randomUUID().toString())
                .trainingId(trainingId)
                .userEmail(userEmail.toLowerCase())
                .userName(userName)
                .trainingName(training.getTrainingName())
                .state(training.getState())
                .district(training.getDistrict())
                .date(training.getDate())
                .status("REGISTERED")
                .enrolledAt(LocalDateTime.now().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME))
                .build();

        repo.saveEnrollment(enrollment);
        return enrollment;
    }

    /**
     * Get all enrollments for a user.
     */
    public List<Enrollment> getMyEnrollments(String userEmail) {
        return repo.findEnrollmentsByEmail(userEmail);
    }

    /**
     * Get only completed enrollments (for certificates).
     */
    public List<Enrollment> getMyCertificates(String userEmail) {
        return repo.findEnrollmentsByEmail(userEmail).stream()
                .filter(e -> "COMPLETED".equalsIgnoreCase(e.getStatus()))
                .toList();
    }

    public Map<String, String> checkEnrollment(String trainingId, String userEmail) {
        boolean enrolled = repo.existsEnrollment(userEmail, trainingId);
        return Map.of("enrolled", String.valueOf(enrolled));
    }

    public List<Enrollment> getAllEnrollments() {
        return repo.allEnrollments();
    }

    public List<Enrollment> getEnrollmentsByTraining(String trainingId) {
        return repo.findEnrollmentsByTrainingId(trainingId);
    }
}
