package com.disastertrain360.model;

public class Report {
    private String reportId;
    private String reportName;
    private String type;
    private String generatedDate;
    private String generatedBy;
    private String size;
    private String format;
    private String status;
    private String description;
    private String reportUrl;

    public Report() {}

    public Report(String reportId, String reportName, String type, String generatedDate,
                  String generatedBy, String size, String format, String status,
                  String description, String reportUrl) {
        this.reportId = reportId;
        this.reportName = reportName;
        this.type = type;
        this.generatedDate = generatedDate;
        this.generatedBy = generatedBy;
        this.size = size;
        this.format = format;
        this.status = status;
        this.description = description;
        this.reportUrl = reportUrl;
    }

    public String getReportId() { return reportId; }
    public void setReportId(String reportId) { this.reportId = reportId; }

    public String getReportName() { return reportName; }
    public void setReportName(String reportName) { this.reportName = reportName; }

    public String getType() { return type; }
    public void setType(String type) { this.type = type; }

    public String getGeneratedDate() { return generatedDate; }
    public void setGeneratedDate(String generatedDate) { this.generatedDate = generatedDate; }

    public String getGeneratedBy() { return generatedBy; }
    public void setGeneratedBy(String generatedBy) { this.generatedBy = generatedBy; }

    public String getSize() { return size; }
    public void setSize(String size) { this.size = size; }

    public String getFormat() { return format; }
    public void setFormat(String format) { this.format = format; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getReportUrl() { return reportUrl; }
    public void setReportUrl(String reportUrl) { this.reportUrl = reportUrl; }

    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private final Report obj = new Report();

        public Builder reportId(String v) { obj.reportId = v; return this; }
        public Builder reportName(String v) { obj.reportName = v; return this; }
        public Builder type(String v) { obj.type = v; return this; }
        public Builder generatedDate(String v) { obj.generatedDate = v; return this; }
        public Builder generatedBy(String v) { obj.generatedBy = v; return this; }
        public Builder size(String v) { obj.size = v; return this; }
        public Builder format(String v) { obj.format = v; return this; }
        public Builder status(String v) { obj.status = v; return this; }
        public Builder description(String v) { obj.description = v; return this; }
        public Builder reportUrl(String v) { obj.reportUrl = v; return this; }

        public Report build() { return obj; }
    }
}
