package com.disastertrain360.service;

import com.disastertrain360.model.Report;
import com.disastertrain360.repository.DynamoDbRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ReportService {

    private final DynamoDbRepository repo;

    public ReportService(DynamoDbRepository repo) {
        this.repo = repo;
    }

    public List<Report> getAllReports() {
        return repo.allReports();
    }
}
