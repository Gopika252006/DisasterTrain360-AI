package com.disastertrain360.aws;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.GetObjectRequest;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;
import software.amazon.awssdk.services.s3.presigner.S3Presigner;
import software.amazon.awssdk.services.s3.presigner.model.GetObjectPresignRequest;
import software.amazon.awssdk.auth.credentials.AwsBasicCredentials;
import software.amazon.awssdk.auth.credentials.StaticCredentialsProvider;
import software.amazon.awssdk.regions.Region;

import java.io.IOException;
import java.time.Duration;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.UUID;

/**
 * Central S3 service for all file uploads.
 *
 * S3 folder structure:
 *   training-photos/{trainingId}/{filename}
 *   certificates/{enrollmentId}/{filename}
 *   reports/{reportId}/{filename}
 *   evidence/{trainingId}/{timestamp}/{filename}
 */
@Service
public class S3Service {

    private static final Logger log = LoggerFactory.getLogger(S3Service.class);

    private final S3Client s3Client;

    @Value("${app.aws.s3.bucket}")
    private String bucket;

    @Value("${aws.s3.region}")
    private String region;

    @Value("${aws.s3.access-key}")
    private String accessKey;

    @Value("${aws.s3.secret-key}")
    private String secretKey;

    public S3Service(S3Client s3Client) {
        this.s3Client = s3Client;
    }

    // ── Upload ────────────────────────────────────────────────────────────────

    /**
     * Upload a training photo → training-photos/{trainingId}/{uuid}-{originalName}
     * Returns the public S3 URL string.
     */
    public String uploadTrainingPhoto(String trainingId, MultipartFile file) throws IOException {
        String key = String.format("training-photos/%s/%s-%s",
                trainingId, UUID.randomUUID(), sanitize(file.getOriginalFilename()));
        return upload(key, file);
    }

    /**
     * Upload a certificate PDF → certificates/{enrollmentId}/{uuid}-certificate.pdf
     * Returns the public S3 URL string.
     */
    public String uploadCertificate(String enrollmentId, MultipartFile file) throws IOException {
        String key = String.format("certificates/%s/%s-%s",
                enrollmentId, UUID.randomUUID(), sanitize(file.getOriginalFilename()));
        return upload(key, file);
    }

    /**
     * Upload a report PDF → reports/{reportId}/{uuid}-{originalName}
     * Returns the public S3 URL string.
     */
    public String uploadReport(String reportId, MultipartFile file) throws IOException {
        String key = String.format("reports/%s/%s-%s",
                reportId, UUID.randomUUID(), sanitize(file.getOriginalFilename()));
        return upload(key, file);
    }

    /**
     * Upload evidence files → evidence/{trainingId}/{timestamp}/{uuid}-{originalName}
     * Returns the S3 **key** (not the full URL) so callers can generate presigned URLs.
     */
    public String uploadEvidenceReturnKey(String trainingId, MultipartFile file) throws IOException {
        String ts  = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMdd-HHmmss"));
        String key = String.format("evidence/%s/%s/%s-%s",
                trainingId, ts, UUID.randomUUID(), sanitize(file.getOriginalFilename()));
        uploadRaw(key, file);
        log.info("S3 evidence upload → s3://{}/{}", bucket, key);
        return key;
    }

    /**
     * Upload evidence files → evidence/{trainingId}/{timestamp}/{uuid}-{originalName}
     * Returns the public S3 URL string.
     */
    public String uploadEvidence(String trainingId, MultipartFile file) throws IOException {
        String ts  = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMdd-HHmmss"));
        String key = String.format("evidence/%s/%s/%s-%s",
                trainingId, ts, UUID.randomUUID(), sanitize(file.getOriginalFilename()));
        return upload(key, file);
    }

    /**
     * Generate a presigned URL directly from an S3 key (not a full URL).
     * Valid for 60 minutes.
     */
    public String generatePresignedUrlFromKey(String key) {
        try (S3Presigner presigner = S3Presigner.builder()
                .region(Region.of(region))
                .credentialsProvider(StaticCredentialsProvider.create(
                        AwsBasicCredentials.create(accessKey, secretKey)))
                .build()) {

            GetObjectPresignRequest presignReq = GetObjectPresignRequest.builder()
                    .signatureDuration(Duration.ofMinutes(60))
                    .getObjectRequest(GetObjectRequest.builder()
                            .bucket(bucket)
                            .key(key)
                            .build())
                    .build();

            return presigner.presignGetObject(presignReq).url().toString();
        }
    }

    // ── Presigned URL (time-limited download link) ────────────────────────────

    /**
     * Generate a presigned GET URL valid for 60 minutes.
     * Use this for private files (reports, certificates).
     */
    public String generatePresignedUrl(String s3Url) {
        String key = extractKey(s3Url);
        try (S3Presigner presigner = S3Presigner.builder()
                .region(Region.of(region))
                .credentialsProvider(StaticCredentialsProvider.create(
                        AwsBasicCredentials.create(accessKey, secretKey)))
                .build()) {

            GetObjectPresignRequest presignReq = GetObjectPresignRequest.builder()
                    .signatureDuration(Duration.ofMinutes(60))
                    .getObjectRequest(GetObjectRequest.builder()
                            .bucket(bucket)
                            .key(key)
                            .build())
                    .build();

            return presigner.presignGetObject(presignReq).url().toString();
        }
    }

    // ── Internal helpers ──────────────────────────────────────────────────────

    private String upload(String key, MultipartFile file) throws IOException {
        uploadRaw(key, file);
        String url = "https://" + bucket + ".s3." + region + ".amazonaws.com/" + key;
        log.info("S3 upload → s3://{}/{}", bucket, key);
        return url;
    }

    private void uploadRaw(String key, MultipartFile file) throws IOException {
        PutObjectRequest req = PutObjectRequest.builder()
                .bucket(bucket)
                .key(key)
                .contentType(resolveContentType(file))
                .build();
        s3Client.putObject(req, RequestBody.fromBytes(file.getBytes()));
    }

    /** Strip S3 URL back to its key. */
    private String extractKey(String s3Url) {
        // e.g. https://bucket.s3.region.amazonaws.com/reports/abc/file.pdf
        String prefix = "https://" + bucket + ".s3." + region + ".amazonaws.com/";
        if (s3Url.startsWith(prefix)) return s3Url.substring(prefix.length());
        // fallback: old-style URL https://bucket.s3.amazonaws.com/key
        String old = "https://" + bucket + ".s3.amazonaws.com/";
        if (s3Url.startsWith(old)) return s3Url.substring(old.length());
        return s3Url;
    }

    private String sanitize(String filename) {
        if (filename == null) return "file";
        return filename.replaceAll("[^a-zA-Z0-9._-]", "_");
    }

    private String resolveContentType(MultipartFile file) {
        String ct = file.getContentType();
        if (ct != null && !ct.isBlank()) return ct;
        String name = file.getOriginalFilename() != null ? file.getOriginalFilename().toLowerCase() : "";
        if (name.endsWith(".pdf"))  return "application/pdf";
        if (name.endsWith(".png"))  return "image/png";
        if (name.endsWith(".jpg") || name.endsWith(".jpeg")) return "image/jpeg";
        if (name.endsWith(".mp4"))  return "video/mp4";
        return "application/octet-stream";
    }
}
