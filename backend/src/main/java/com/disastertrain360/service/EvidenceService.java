package com.disastertrain360.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;

import java.io.IOException;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
public class EvidenceService {

    private static final Logger log = LoggerFactory.getLogger(EvidenceService.class);

    private final S3Client s3Client;

    @Value("${app.aws.s3.bucket}")
    private String bucket;

    public EvidenceService(S3Client s3Client) {
        this.s3Client = s3Client;
    }

    /**
     * Upload evidence files to S3 under evidence/{trainingId}/{timestamp}/{filename}
     * Returns list of S3 URLs for the uploaded files.
     */
    public List<String> uploadEvidence(String trainingId,
                                       String evidenceType,
                                       String uploadedBy,
                                       List<MultipartFile> files) throws IOException {
        List<String> urls = new ArrayList<>();
        String timestamp  = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMdd-HHmmss"));

        for (MultipartFile file : files) {
            if (file.isEmpty()) continue;

            String safeFilename = UUID.randomUUID() + "-" + file.getOriginalFilename()
                    .replaceAll("[^a-zA-Z0-9._-]", "_");
            String key = String.format("evidence/%s/%s/%s", trainingId, timestamp, safeFilename);

            PutObjectRequest req = PutObjectRequest.builder()
                    .bucket(bucket)
                    .key(key)
                    .contentType(file.getContentType())
                    .metadata(java.util.Map.of(
                            "trainingId",    trainingId,
                            "evidenceType",  evidenceType,
                            "uploadedBy",    uploadedBy,
                            "uploadedAt",    timestamp
                    ))
                    .build();

            s3Client.putObject(req, RequestBody.fromBytes(file.getBytes()));
            String url = "https://" + bucket + ".s3.amazonaws.com/" + key;
            urls.add(url);
            log.info("Evidence uploaded: {}", url);
        }

        return urls;
    }
}
