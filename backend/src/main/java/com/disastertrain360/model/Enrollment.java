package com.disastertrain360.model;

public class Enrollment {
    private String enrollmentId;
    private String trainingId;
    private String userEmail;
    private String userName;
    private String trainingName;
    private String state;
    private String district;
    private String date;
    private String status;        // REGISTERED, COMPLETED, CANCELLED
    private String enrolledAt;

    public Enrollment() {}

    public static Builder builder() { return new Builder(); }

    public String getEnrollmentId()  { return enrollmentId; }
    public String getTrainingId()    { return trainingId; }
    public String getUserEmail()     { return userEmail; }
    public String getUserName()      { return userName; }
    public String getTrainingName()  { return trainingName; }
    public String getState()         { return state; }
    public String getDistrict()      { return district; }
    public String getDate()          { return date; }
    public String getStatus()        { return status; }
    public String getEnrolledAt()    { return enrolledAt; }

    public void setEnrollmentId(String v)  { this.enrollmentId = v; }
    public void setTrainingId(String v)    { this.trainingId = v; }
    public void setUserEmail(String v)     { this.userEmail = v; }
    public void setUserName(String v)      { this.userName = v; }
    public void setTrainingName(String v)  { this.trainingName = v; }
    public void setState(String v)         { this.state = v; }
    public void setDistrict(String v)      { this.district = v; }
    public void setDate(String v)          { this.date = v; }
    public void setStatus(String v)        { this.status = v; }
    public void setEnrolledAt(String v)    { this.enrolledAt = v; }

    public static class Builder {
        private final Enrollment obj = new Enrollment();
        public Builder enrollmentId(String v)  { obj.enrollmentId = v; return this; }
        public Builder trainingId(String v)    { obj.trainingId = v; return this; }
        public Builder userEmail(String v)     { obj.userEmail = v; return this; }
        public Builder userName(String v)      { obj.userName = v; return this; }
        public Builder trainingName(String v)  { obj.trainingName = v; return this; }
        public Builder state(String v)         { obj.state = v; return this; }
        public Builder district(String v)      { obj.district = v; return this; }
        public Builder date(String v)          { obj.date = v; return this; }
        public Builder status(String v)        { obj.status = v; return this; }
        public Builder enrolledAt(String v)    { obj.enrolledAt = v; return this; }
        public Enrollment build()              { return obj; }
    }
}
