package com.disastertrain360.service;

import com.disastertrain360.model.Report;
import com.disastertrain360.repository.InMemoryStore;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ReportService {

    private final InMemoryStore store;

    public ReportService(InMemoryStore store) {
        this.store = store;
    }

    public List<Report> getAllReports() {
        return store.allReports();
    }
}
