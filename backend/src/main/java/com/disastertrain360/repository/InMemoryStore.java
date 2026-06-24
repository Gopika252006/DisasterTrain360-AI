package com.disastertrain360.repository;

import com.disastertrain360.model.*;
import org.springframework.stereotype.Repository;

import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

/**
 * Thread-safe in-memory store.
 * Replace individual Map/List fields with DynamoDB calls
 * by injecting AwsService and delegating to it.
 */
@Repository
public class InMemoryStore {

    // ── Users ─────────────────────────────────────────
    private final Map<String, User> usersByEmail = new ConcurrentHashMap<>();

    // ── Trainings ─────────────────────────────────────
    private final Map<String, Training> trainingsById = new ConcurrentHashMap<>();

    // ── Insights ──────────────────────────────────────
    private final List<DistrictInsight> insights = Collections.synchronizedList(new ArrayList<>());

    // ── Reports ───────────────────────────────────────
    private final List<Report> reports = Collections.synchronizedList(new ArrayList<>());

    // ── Notifications ─────────────────────────────────
    private final List<Notification> notifications = Collections.synchronizedList(new ArrayList<>());

    // ── User ops ──────────────────────────────────────
    public Optional<User> findUserByEmail(String email) {
        return Optional.ofNullable(usersByEmail.get(email.toLowerCase()));
    }

    public boolean existsByEmail(String email) {
        return usersByEmail.containsKey(email.toLowerCase());
    }

    public void saveUser(User user) {
        usersByEmail.put(user.getEmail().toLowerCase(), user);
    }

    public Collection<User> allUsers() {
        return usersByEmail.values();
    }

    // ── Training ops ──────────────────────────────────
    public void saveTraining(Training t) {
        trainingsById.put(t.getTrainingId(), t);
    }

    public Optional<Training> findTrainingById(String id) {
        return Optional.ofNullable(trainingsById.get(id));
    }

    public List<Training> allTrainings() {
        return new ArrayList<>(trainingsById.values());
    }

    // ── Insight ops ───────────────────────────────────
    public void addInsight(DistrictInsight insight) {
        insights.add(insight);
    }

    public List<DistrictInsight> allInsights() {
        return List.copyOf(insights);
    }

    // ── Report ops ────────────────────────────────────
    public void addReport(Report report) {
        reports.add(report);
    }

    public List<Report> allReports() {
        return List.copyOf(reports);
    }

    // ── Notification ops ──────────────────────────────
    public void addNotification(Notification n) {
        notifications.add(n);
    }

    public List<Notification> allNotifications() {
        return List.copyOf(notifications);
    }
}
