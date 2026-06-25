package com.disastertrain360.service;

import com.disastertrain360.aws.S3Service;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

@Service
public class EvidenceService {

    private final S3Service s3Service;

    public EvidenceService(S3Service s3Service) {
        this.s3Service = s3Service;
    }

    /**
     * Upload multiple evidence files to S3 → evidence/{trainingId}/...
     * Returns list of S3 URLs.
     */
    public List<String> uploadEvidence(String trainingId,
                                       String evidenceType,
                                       String uploadedBy,
                                       List<MultipartFile> files) throws IOException {
        List<String> urls = new ArrayList<>();
        for (MultipartFile file : files) {
            if (file.isEmpty()) continue;
            urls.add(s3Service.uploadEvidence(trainingId, file));
        }
        return urls;
    }
}
