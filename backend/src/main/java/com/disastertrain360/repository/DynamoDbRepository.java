package com.disastertrain360.repository;

import com.disastertrain360.model.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Repository;
import software.amazon.awssdk.services.dynamodb.DynamoDbClient;
import software.amazon.awssdk.services.dynamodb.model.*;

import java.util.*;
import java.util.stream.Collectors;

/**
 * Real DynamoDB repository using AWS SDK v2 low-level API.
 * Table names are configured in application.properties.
 */
@Repository
public class DynamoDbRepository {

    private static final Logger log = LoggerFactory.getLogger(DynamoDbRepository.class);

    private final DynamoDbClient dynamo;

    @Value("${app.dynamo.table.users}")         private String usersTable;
    @Value("${app.dynamo.table.trainings}")      private String trainingsTable;
    @Value("${app.dynamo.table.insights}")       private String insightsTable;
    @Value("${app.dynamo.table.reports}")        private String reportsTable;
    @Value("${app.dynamo.table.notifications}")  private String notificationsTable;
    @Value("${app.dynamo.table.enrollments}")    private String enrollmentsTable;

    public DynamoDbRepository(DynamoDbClient dynamo) {
        this.dynamo = dynamo;
    }

    // ─── Helpers ────────────────────────────────────────────────────────────

    private AttributeValue s(String v) {
        return v != null ? AttributeValue.fromS(v) : AttributeValue.fromS("");
    }

    private AttributeValue n(int v) {
        return AttributeValue.fromN(String.valueOf(v));
    }

    private AttributeValue bool(boolean v) {
        return AttributeValue.fromBool(v);
    }

    private String str(Map<String, AttributeValue> item, String key) {
        AttributeValue v = item.get(key);
        return (v != null && v.s() != null) ? v.s() : "";
    }

    private int num(Map<String, AttributeValue> item, String key) {
        AttributeValue v = item.get(key);
        if (v == null) return 0;
        if (v.n() != null) try { return Integer.parseInt(v.n()); } catch (NumberFormatException e) { return 0; }
        return 0;
    }

    private boolean boolVal(Map<String, AttributeValue> item, String key) {
        AttributeValue v = item.get(key);
        return v != null && Boolean.TRUE.equals(v.bool());
    }

    // ─── USER OPS ───────────────────────────────────────────────────────────

    public void saveUser(User user) {
        Map<String, AttributeValue> item = new HashMap<>();
        item.put("userId",     s(user.getUserId()));
        item.put("name",       s(user.getName()));
        item.put("email",      s(user.getEmail().toLowerCase()));
        item.put("password",   s(user.getPassword()));
        item.put("role",       s(user.getRole().name()));
        item.put("department", s(user.getDepartment()));
        item.put("createdAt",  s(user.getCreatedAt()));
        dynamo.putItem(PutItemRequest.builder().tableName(usersTable).item(item).build());
        log.debug("Saved user: {}", user.getEmail());
    }

    public Optional<User> findUserByEmail(String email) {
        // Scan by email (partition key is userId, so we scan with filter)
        ScanRequest req = ScanRequest.builder()
                .tableName(usersTable)
                .filterExpression("email = :e")
                .expressionAttributeValues(Map.of(":e", s(email.toLowerCase())))
                .build();
        List<Map<String, AttributeValue>> items = dynamo.scan(req).items();
        if (items.isEmpty()) return Optional.empty();
        return Optional.of(mapUser(items.get(0)));
    }

    public boolean existsByEmail(String email) {
        return findUserByEmail(email).isPresent();
    }

    private User mapUser(Map<String, AttributeValue> item) {
        UserRole role;
        try { role = UserRole.valueOf(str(item, "role")); }
        catch (IllegalArgumentException e) { role = UserRole.PUBLIC_USER; }

        return User.builder()
                .userId(str(item, "userId"))
                .name(str(item, "name"))
                .email(str(item, "email"))
                .password(str(item, "password"))
                .role(role)
                .department(str(item, "department"))
                .createdAt(str(item, "createdAt"))
                .build();
    }

    // ─── TRAINING OPS ───────────────────────────────────────────────────────

    public void saveTraining(Training t) {
        Map<String, AttributeValue> item = new HashMap<>();
        item.put("trainingId",   s(t.getTrainingId()));
        item.put("trainingName", s(t.getTrainingName()));
        item.put("theme",        s(t.getTheme()));
        item.put("state",        s(t.getState()));
        item.put("district",     s(t.getDistrict()));
        item.put("venue",        s(t.getVenue()));
        item.put("date",         s(t.getDate()));
        item.put("participants", n(t.getParticipants()));
        item.put("photoUrl",     s(t.getPhotoUrl()));
        item.put("status",       s(t.getStatus()));
        item.put("createdBy",    s(t.getCreatedBy()));
        item.put("createdAt",    s(t.getCreatedAt()));
        dynamo.putItem(PutItemRequest.builder().tableName(trainingsTable).item(item).build());
        log.debug("Saved training: {}", t.getTrainingId());
    }

    public Optional<Training> findTrainingById(String id) {
        GetItemRequest req = GetItemRequest.builder()
                .tableName(trainingsTable)
                .key(Map.of("trainingId", s(id)))
                .build();
        Map<String, AttributeValue> item = dynamo.getItem(req).item();
        if (item == null || item.isEmpty()) return Optional.empty();
        return Optional.of(mapTraining(item));
    }

    public List<Training> allTrainings() {
        ScanRequest req = ScanRequest.builder().tableName(trainingsTable).build();
        return dynamo.scan(req).items().stream()
                .map(this::mapTraining)
                .collect(Collectors.toList());
    }

    public long countTrainings() {
        return dynamo.scan(ScanRequest.builder().tableName(trainingsTable)
                .select(Select.COUNT).build()).count();
    }

    private Training mapTraining(Map<String, AttributeValue> item) {
        return Training.builder()
                .trainingId(str(item, "trainingId"))
                .trainingName(str(item, "trainingName"))
                .theme(str(item, "theme"))
                .state(str(item, "state"))
                .district(str(item, "district"))
                .venue(str(item, "venue"))
                .date(str(item, "date"))
                .participants(num(item, "participants"))
                .photoUrl(str(item, "photoUrl"))
                .status(str(item, "status"))
                .createdBy(str(item, "createdBy"))
                .createdAt(str(item, "createdAt"))
                .build();
    }

    // ─── INSIGHT OPS ────────────────────────────────────────────────────────

    public void saveInsight(DistrictInsight i) {
        Map<String, AttributeValue> item = new HashMap<>();
        item.put("insightId",         s(i.getInsightId()));
        item.put("state",             s(i.getState()));
        item.put("district",          s(i.getDistrict()));
        item.put("preparednessScore", n(i.getPreparednessScore()));
        item.put("riskLevel",         s(i.getRiskLevel()));
        item.put("coverageStatus",    s(i.getCoverageStatus()));
        item.put("gapAnalysis",       s(i.getGapAnalysis()));
        item.put("recommendation",    s(i.getRecommendation()));
        item.put("aiConfidence",      n(i.getAiConfidence()));
        item.put("lastUpdated",       s(i.getLastUpdated()));
        dynamo.putItem(PutItemRequest.builder().tableName(insightsTable).item(item).build());
    }

    public List<DistrictInsight> allInsights() {
        ScanRequest req = ScanRequest.builder().tableName(insightsTable).build();
        return dynamo.scan(req).items().stream()
                .map(this::mapInsight)
                .collect(Collectors.toList());
    }

    public long countInsights() {
        return dynamo.scan(ScanRequest.builder().tableName(insightsTable)
                .select(Select.COUNT).build()).count();
    }

    private DistrictInsight mapInsight(Map<String, AttributeValue> item) {
        return DistrictInsight.builder()
                .insightId(str(item, "insightId"))
                .state(str(item, "state"))
                .district(str(item, "district"))
                .preparednessScore(num(item, "preparednessScore"))
                .riskLevel(str(item, "riskLevel"))
                .coverageStatus(str(item, "coverageStatus"))
                .gapAnalysis(str(item, "gapAnalysis"))
                .recommendation(str(item, "recommendation"))
                .aiConfidence(num(item, "aiConfidence"))
                .lastUpdated(str(item, "lastUpdated"))
                .build();
    }

    // ─── REPORT OPS ─────────────────────────────────────────────────────────

    public void saveReport(Report r) {
        Map<String, AttributeValue> item = new HashMap<>();
        item.put("reportId",      s(r.getReportId()));
        item.put("reportName",    s(r.getReportName()));
        item.put("type",          s(r.getType()));
        item.put("generatedDate", s(r.getGeneratedDate()));
        item.put("generatedBy",   s(r.getGeneratedBy()));
        item.put("size",          s(r.getSize()));
        item.put("format",        s(r.getFormat()));
        item.put("status",        s(r.getStatus()));
        item.put("description",   s(r.getDescription()));
        item.put("reportUrl",     s(r.getReportUrl()));
        dynamo.putItem(PutItemRequest.builder().tableName(reportsTable).item(item).build());
    }

    public List<Report> allReports() {
        ScanRequest req = ScanRequest.builder().tableName(reportsTable).build();
        return dynamo.scan(req).items().stream()
                .map(this::mapReport)
                .collect(Collectors.toList());
    }

    public long countReports() {
        return dynamo.scan(ScanRequest.builder().tableName(reportsTable)
                .select(Select.COUNT).build()).count();
    }

    private Report mapReport(Map<String, AttributeValue> item) {
        return Report.builder()
                .reportId(str(item, "reportId"))
                .reportName(str(item, "reportName"))
                .type(str(item, "type"))
                .generatedDate(str(item, "generatedDate"))
                .generatedBy(str(item, "generatedBy"))
                .size(str(item, "size"))
                .format(str(item, "format"))
                .status(str(item, "status"))
                .description(str(item, "description"))
                .reportUrl(str(item, "reportUrl"))
                .build();
    }

    // ─── NOTIFICATION OPS ───────────────────────────────────────────────────

    public void saveNotification(Notification n) {
        Map<String, AttributeValue> item = new HashMap<>();
        item.put("notificationId", s(n.getNotificationId()));
        item.put("type",           s(n.getType()));
        item.put("title",          s(n.getTitle()));
        item.put("message",        s(n.getMessage()));
        item.put("time",           s(n.getTime()));
        item.put("read",           bool(Boolean.TRUE.equals(n.getRead())));
        item.put("priority",       s(n.getPriority()));
        dynamo.putItem(PutItemRequest.builder().tableName(notificationsTable).item(item).build());
    }

    public List<Notification> allNotifications() {
        ScanRequest req = ScanRequest.builder().tableName(notificationsTable).build();
        return dynamo.scan(req).items().stream()
                .map(this::mapNotification)
                .collect(Collectors.toList());
    }

    public long countNotifications() {
        return dynamo.scan(ScanRequest.builder().tableName(notificationsTable)
                .select(Select.COUNT).build()).count();
    }

    private Notification mapNotification(Map<String, AttributeValue> item) {
        return Notification.builder()
                .notificationId(str(item, "notificationId"))
                .type(str(item, "type"))
                .title(str(item, "title"))
                .message(str(item, "message"))
                .time(str(item, "time"))
                .read(boolVal(item, "read"))
                .priority(str(item, "priority"))
                .build();
    }

    // ─── ENROLLMENT OPS ─────────────────────────────────────────────────────

    public void saveEnrollment(com.disastertrain360.model.Enrollment e) {
        Map<String, AttributeValue> item = new HashMap<>();
        item.put("enrollmentId",  s(e.getEnrollmentId()));
        item.put("trainingId",    s(e.getTrainingId()));
        item.put("userEmail",     s(e.getUserEmail()));
        item.put("userName",      s(e.getUserName()));
        item.put("trainingName",  s(e.getTrainingName()));
        item.put("state",         s(e.getState()));
        item.put("district",      s(e.getDistrict()));
        item.put("date",          s(e.getDate()));
        item.put("status",        s(e.getStatus()));
        item.put("enrolledAt",    s(e.getEnrolledAt()));
        dynamo.putItem(PutItemRequest.builder().tableName(enrollmentsTable).item(item).build());
        log.debug("Saved enrollment: {} for {}", e.getEnrollmentId(), e.getUserEmail());
    }

    public List<com.disastertrain360.model.Enrollment> findEnrollmentsByEmail(String email) {
        ScanRequest req = ScanRequest.builder()
                .tableName(enrollmentsTable)
                .filterExpression("userEmail = :e")
                .expressionAttributeValues(Map.of(":e", s(email.toLowerCase())))
                .build();
        return dynamo.scan(req).items().stream()
                .map(this::mapEnrollment)
                .collect(Collectors.toList());
    }

    public boolean existsEnrollment(String userEmail, String trainingId) {
        ScanRequest req = ScanRequest.builder()
                .tableName(enrollmentsTable)
                .filterExpression("userEmail = :e AND trainingId = :t")
                .expressionAttributeValues(Map.of(
                        ":e", s(userEmail.toLowerCase()),
                        ":t", s(trainingId)
                ))
                .build();
        return !dynamo.scan(req).items().isEmpty();
    }

    private com.disastertrain360.model.Enrollment mapEnrollment(Map<String, AttributeValue> item) {
        return com.disastertrain360.model.Enrollment.builder()
                .enrollmentId(str(item, "enrollmentId"))
                .trainingId(str(item, "trainingId"))
                .userEmail(str(item, "userEmail"))
                .userName(str(item, "userName"))
                .trainingName(str(item, "trainingName"))
                .state(str(item, "state"))
                .district(str(item, "district"))
                .date(str(item, "date"))
                .status(str(item, "status"))
                .enrolledAt(str(item, "enrolledAt"))
                .build();
    }
}
