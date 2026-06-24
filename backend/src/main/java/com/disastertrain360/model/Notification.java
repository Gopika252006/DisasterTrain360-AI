package com.disastertrain360.model;

public class Notification {
    private String notificationId;
    private String type;
    private String title;
    private String message;
    private String time;
    private Boolean read;
    private String priority;

    public Notification() {}

    public Notification(String notificationId, String type, String title, String message,
                        String time, Boolean read, String priority) {
        this.notificationId = notificationId;
        this.type = type;
        this.title = title;
        this.message = message;
        this.time = time;
        this.read = read;
        this.priority = priority;
    }

    public String getNotificationId() { return notificationId; }
    public void setNotificationId(String notificationId) { this.notificationId = notificationId; }

    public String getType() { return type; }
    public void setType(String type) { this.type = type; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }

    public String getTime() { return time; }
    public void setTime(String time) { this.time = time; }

    public Boolean getRead() { return read; }
    public void setRead(Boolean read) { this.read = read; }

    public String getPriority() { return priority; }
    public void setPriority(String priority) { this.priority = priority; }

    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private final Notification obj = new Notification();

        public Builder notificationId(String v) { obj.notificationId = v; return this; }
        public Builder type(String v) { obj.type = v; return this; }
        public Builder title(String v) { obj.title = v; return this; }
        public Builder message(String v) { obj.message = v; return this; }
        public Builder time(String v) { obj.time = v; return this; }
        public Builder read(Boolean v) { obj.read = v; return this; }
        public Builder priority(String v) { obj.priority = v; return this; }

        public Notification build() { return obj; }
    }
}
