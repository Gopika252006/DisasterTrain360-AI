package com.disastertrain360.service;

import com.disastertrain360.aws.S3Service;
import com.disastertrain360.model.Enrollment;
import com.disastertrain360.repository.DynamoDbRepository;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

@Service
public class EvidenceService {

    private final S3Service s3Service;
    private final DynamoDbRepository repo;

    public EvidenceService(S3Service s3Service, DynamoDbRepository repo) {
        this.s3Service = s3Service;
        this.repo = repo;
    }

    /**
     * Upload evidence files to S3 → evidence/{trainingId}/...
     * Stores the S3 key (not the full URL) on the training so presigned URLs
     * can be generated on demand. Marks the training as PENDING_APPROVAL.
     * Returns list of presigned URLs (60-min access) for immediate confirmation.
     */
    public List<String> uploadEvidence(String trainingId,
                                       String evidenceType,
                                       String uploadedBy,
                                       List<MultipartFile> files) throws IOException {
        List<String> s3Keys = new ArrayList<>();
        for (MultipartFile file : files) {
            if (file.isEmpty()) continue;
            s3Keys.add(s3Service.uploadEvidenceReturnKey(trainingId, file));
        }

        // Mark the training as PENDING_APPROVAL so admin sees it in Evidence Review.
        // Store the S3 key (not the full URL) so we can generate presigned URLs later.
        repo.findTrainingById(trainingId).ifPresent(training -> {
            training.setStatus("PENDING_APPROVAL");
            if (!s3Keys.isEmpty()) {
                training.setPhotoUrl(s3Keys.get(0)); // stores S3 key
            }
            repo.saveTraining(training);
        });

        // Return presigned URLs so the uploader can immediately verify
        List<String> presignedUrls = new ArrayList<>();
        for (String key : s3Keys) {
            presignedUrls.add(s3Service.generatePresignedUrlFromKey(key));
        }
        return presignedUrls;
    }

    /**
     * Generate a fresh presigned URL for a stored S3 key or full S3 URL.
     * Used by the admin Evidence Review page to view uploaded files.
     */
    public String getPresignedUrl(String s3KeyOrUrl) {
        return s3Service.generatePresignedUrl(s3KeyOrUrl);
    }
}
