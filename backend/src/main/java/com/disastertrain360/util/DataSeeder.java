package com.disastertrain360.util;

import com.disastertrain360.model.*;
import com.disastertrain360.repository.InMemoryStore;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.UUID;

@Component
public class DataSeeder implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(DataSeeder.class);

    private final InMemoryStore store;
    private final PasswordEncoder passwordEncoder;

    public DataSeeder(InMemoryStore store, PasswordEncoder passwordEncoder) {
        this.store = store;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        seedUsers();
        seedTrainings();
        seedInsights();
        seedReports();
        seedNotifications();
        log.info("DisasterTrain360 AI - Mock data seeded successfully.");
    }

    private String uid()  { return UUID.randomUUID().toString(); }
    private String now()  { return LocalDateTime.now().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME); }

    // ── Users ─────────────────────────────────────────────────────────────────
    private void seedUsers() {
        String pw = passwordEncoder.encode("password");
        List.of(
            User.builder().userId(uid()).name("Rajiv Sharma").email("admin@test.com")
                .password(pw).role(UserRole.NDMA_ADMIN).department("NDMA HQ").createdAt(now()).build(),
            User.builder().userId(uid()).name("Priya Mehta").email("provider@test.com")
                .password(pw).role(UserRole.TRAINING_PROVIDER).department("ATI Maharashtra").createdAt(now()).build(),
            User.builder().userId(uid()).name("Arjun Singh").email("user@test.com")
                .password(pw).role(UserRole.PUBLIC_USER).department("Public").createdAt(now()).build()
        ).forEach(store::saveUser);
        log.info("  Seeded 3 users");
    }

    // ── Trainings ─────────────────────────────────────────────────────────────
    private void seedTrainings() {
        List.of(
            t("Flood Response & Rescue Operations","Flood Management","Bihar","Patna","SDRF Training Centre","2026-07-15",120,"Scheduled"),
            t("Earthquake Preparedness Workshop","Seismic Disaster","Gujarat","Ahmedabad","GSDMA HQ","2026-07-20",200,"Completed"),
            t("Cyclone Early Warning Drill","Cyclone Management","Odisha","Bhubaneswar","OSDMA Hall","2026-08-02",350,"Ongoing"),
            t("Urban Search & Rescue USAR","Urban Disaster","Maharashtra","Mumbai","NDRF 4th Battalion","2026-07-28",80,"Scheduled"),
            t("Community First Responder Training","Community Resilience","Kerala","Thiruvananthapuram","KILA Centre","2026-06-30",450,"Completed"),
            t("Industrial Hazard Response","Industrial Disaster","Tamil Nadu","Chennai","TNSCDRC Hub","2026-08-10",150,"Scheduled"),
            t("Landslide Risk Reduction Workshop","Landslide Management","Uttarakhand","Dehradun","USDMA Complex","2026-07-05",90,"Ongoing"),
            t("Drought & Water Security Training","Drought Management","Rajasthan","Jaipur","SDM Academy","2026-09-01",200,"Scheduled"),
            t("Fire Safety & Prevention Drill","Fire Safety","Karnataka","Bengaluru","Karnataka Fire HQ","2026-07-12",180,"Completed"),
            t("Chemical Hazard Training","Hazmat Response","Telangana","Hyderabad","TSDMA Centre","2026-08-20",100,"Scheduled"),
            t("Coastal Evacuation Preparedness","Cyclone Management","Andhra Pradesh","Visakhapatnam","APSDMA Beach HQ","2026-07-25",320,"Scheduled"),
            t("Heat Wave Mitigation Program","Climate Adaptation","Rajasthan","Jodhpur","District Collectorate","2026-07-10",250,"Ongoing"),
            t("First Aid & Medical Triage","Medical Response","West Bengal","Kolkata","WBDMD Centre","2026-08-05",140,"Scheduled"),
            t("Flash Flood Community Alert Training","Flood Management","Assam","Guwahati","ASDMA HQ","2026-06-25",280,"Completed"),
            t("Mountain Search & Rescue Training","Search & Rescue","Himachal Pradesh","Shimla","HPSDMA Field Base","2026-08-15",60,"Scheduled"),
            t("Urban Flood Preparedness Workshop","Flood Management","Maharashtra","Pune","MSRDC Hall","2026-07-18",190,"Completed"),
            t("Nuclear & Radiological Safety","CBRN Response","Delhi","Central Delhi","NDMA CBRN Division","2026-09-10",45,"Scheduled"),
            t("Drought Response for Farmers","Drought Management","Madhya Pradesh","Bhopal","MPSDMA Rural Extension","2026-08-28",400,"Scheduled"),
            t("Cyclone Shelter Management","Cyclone Management","West Bengal","Kolkata","Cyclone Shelter HQ","2026-07-30",220,"Ongoing"),
            t("Community Disaster Risk Reduction","Community Resilience","Tamil Nadu","Coimbatore","TNSDMA Office","2026-08-08",310,"Scheduled"),
            t("Pandemic Preparedness Response","Biological Hazards","Karnataka","Mysuru","KSNDMC Centre","2026-09-05",175,"Scheduled"),
            t("Earthquake Drill School Program","Seismic Disaster","Gujarat","Surat","GSDMA School Wing","2026-07-22",500,"Completed"),
            t("Industrial Fire Safety Training","Fire Safety","Maharashtra","Nagpur","MIDC Safety Wing","2026-08-12",130,"Scheduled"),
            t("River Flood Monitoring Workshop","Flood Management","Bihar","Muzaffarpur","CWC Sub-Division","2026-07-08",160,"Ongoing"),
            t("Tribal Community Disaster Training","Community Resilience","Jharkhand","Ranchi","JSDMA Tribal Cell","2026-09-15",280,"Scheduled"),
            t("Coastal Community Resilience","Community Resilience","Kerala","Kochi","KSCZMA Hub","2026-08-18",195,"Scheduled"),
            t("Air Pollution Emergency Response","Industrial Disaster","Delhi","East Delhi","DPCC Training Wing","2026-08-25",85,"Scheduled"),
            t("Mine Disaster Response Training","Industrial Disaster","Jharkhand","Dhanbad","DGMS Safety Institute","2026-09-20",70,"Scheduled"),
            t("Glacier Lake Outburst Preparedness","Flood Management","Uttarakhand","Dehradun","GBPIHED Base","2026-09-25",40,"Scheduled"),
            t("Cyclone Response Coordination","Cyclone Management","Odisha","Cuttack","OSDMA Field Camp","2026-10-01",260,"Scheduled"),
            t("Earthquake Preparedness NE India","Seismic Disaster","Assam","Guwahati","NESAC Campus","2026-10-10",230,"Scheduled"),
            t("Rural Emergency Response Training","Community Resilience","Rajasthan","Udaipur","RSDMA Rural Wing","2026-10-15",350,"Scheduled"),
            t("Hazmat Spill Response Workshop","Hazmat Response","Gujarat","Vadodara","GIDC Safety Institute","2026-10-20",110,"Scheduled"),
            t("Landslide Early Warning Training","Landslide Management","Manipur","Imphal West","MSRDC Field Office","2026-10-25",75,"Scheduled"),
            t("Urban Heat Island Mitigation","Climate Adaptation","Telangana","Hyderabad","GHMC Emergency Wing","2026-11-01",195,"Scheduled"),
            t("Disaster Nursing & Triage Training","Medical Response","Tamil Nadu","Madurai","DMHMS Medical College","2026-11-05",220,"Scheduled"),
            t("Flood Mapping & GIS Training","Flood Management","West Bengal","Howrah","NATMO Training Cell","2026-11-10",140,"Scheduled"),
            t("School Safety Earthquake Drills","Seismic Disaster","Himachal Pradesh","Kangra","HPBOSE District Office","2026-11-15",600,"Scheduled"),
            t("Disaster Volunteer Coordination","Community Resilience","Kerala","Kozhikode","KSDMA Hub","2026-11-20",300,"Scheduled"),
            t("Dam Safety & Flood Response","Flood Management","Karnataka","Belagavi","CWC Dam Division","2026-11-25",170,"Scheduled"),
            t("Multi-Hazard Preparedness Summit","Community Resilience","Maharashtra","Aurangabad","MSDMA Centre","2026-12-01",450,"Scheduled"),
            t("Arctic Response Training Ladakh","Seismic Disaster","Ladakh","Leh","Army Mountain Base","2026-12-05",50,"Scheduled"),
            t("Coastal Erosion Response","Community Resilience","Goa","North Goa","Goa Coastal Guard","2026-12-10",140,"Scheduled"),
            t("Border Disaster Coordination","Community Resilience","Jammu & Kashmir","Srinagar","J&K SDMA HQ","2026-12-15",120,"Scheduled"),
            t("Industrial Accident Mass Casualty","Medical Response","Chhattisgarh","Raipur","CSIR Safety Division","2026-12-20",200,"Scheduled"),
            t("Cyclone Season Readiness Bootcamp","Cyclone Management","Andhra Pradesh","Guntur","APSDMA Coastal Base","2026-12-28",380,"Scheduled"),
            t("Disaster Debris Management","Urban Disaster","Maharashtra","Nashik","PWD Training Centre","2027-01-05",165,"Scheduled"),
            t("Community Health Emergency Response","Medical Response","Uttar Pradesh","Lucknow","UPSDMA Medical Wing","2027-01-10",290,"Scheduled"),
            t("Flash Flood Evacuation Simulation","Flood Management","Meghalaya","Shillong","MSDDMA Ground","2027-01-15",230,"Scheduled"),
            t("Earthquake Response Himalayan Belt","Seismic Disaster","Sikkim","Gangtok","SDMA Himalayan Institute","2027-01-20",185,"Scheduled")
        ).forEach(store::saveTraining);
        log.info("  Seeded 50 trainings");
    }

    private Training t(String name, String theme, String state, String district,
                       String venue, String date, int participants, String status) {
        return Training.builder().trainingId(uid()).trainingName(name).theme(theme)
                .state(state).district(district).venue(venue).date(date)
                .participants(participants).status(status).photoUrl("")
                .createdBy("system").createdAt(now()).build();
    }

    // ── Insights ──────────────────────────────────────────────────────────────
    private void seedInsights() {
        List.of(
            i("Tamil Nadu","Chennai",88,"LOW","WELL_COVERED","Strong multi-hazard coverage across urban zones.","Maintain training; expand coastal migrant inclusion."),
            i("Tamil Nadu","Coimbatore",78,"MODERATE","ADEQUATELY_COVERED","Industrial zones lack chemical disaster training.","Partner with SIPCOT for HAZMAT module rollout."),
            i("Tamil Nadu","Madurai",74,"MODERATE","ADEQUATELY_COVERED","Rural blocks below flood training threshold.","Deploy 2 mobile units before monsoon season."),
            i("Tamil Nadu","Tirunelveli",66,"HIGH","PARTIALLY_COVERED","Coastal cyclone awareness below national average.","Accelerate cyclone preparedness in coastal blocks."),
            i("Kerala","Thiruvananthapuram",88,"LOW","WELL_COVERED","Excellent flood and landslide preparedness.","Add annual refresher for healthcare workers."),
            i("Kerala","Ernakulam",86,"LOW","WELL_COVERED","Strong urban preparedness; minor industrial gaps.","Include petrochemical zone workers in quarterly drills."),
            i("Kerala","Wayanad",68,"MODERATE","ADEQUATELY_COVERED","High landslide risk with coverage gaps in tribal areas.","Fast-track tribal community landslide training."),
            i("Kerala","Idukki",64,"HIGH","PARTIALLY_COVERED","Dam safety preparedness insufficient for Idukki dam zone.","Conduct dam failure simulation for 50,000 downstream residents."),
            i("Karnataka","Bengaluru",88,"LOW","WELL_COVERED","Strong urban preparedness; migrant zone gaps minor.","Include migrant labor communities in quarterly drills."),
            i("Karnataka","Mysuru",76,"MODERATE","ADEQUATELY_COVERED","Rural flood coverage improving; industrial gaps remain.","Expand industrial safety module to Mysuru KIADB zones."),
            i("Karnataka","Kalaburagi",62,"HIGH","PARTIALLY_COVERED","Drought preparedness critically below national average.","Urgently deploy drought resilience training teams."),
            i("Maharashtra","Mumbai",92,"LOW","WELL_COVERED","Top-performing district; excellent multi-hazard readiness.","Pilot AI-driven early warning integration."),
            i("Maharashtra","Pune",86,"LOW","WELL_COVERED","Strong preparedness; chemical zone training improving.","Conduct annual HAZMAT simulation in Pune industrial corridor."),
            i("Maharashtra","Aurangabad",64,"HIGH","PARTIALLY_COVERED","Industrial and flood training gaps identified.","Partner with MIDC for industrial safety module."),
            i("Maharashtra","Solapur",60,"HIGH","PARTIALLY_COVERED","Drought preparedness below state average.","Deploy drought and heat-wave mitigation program urgently."),
            i("Gujarat","Ahmedabad",82,"LOW","WELL_COVERED","Strong earthquake preparedness post-2001 reforms.","Expand cyclone awareness to semi-urban areas."),
            i("Gujarat","Surat",76,"MODERATE","ADEQUATELY_COVERED","Flood preparedness good; chemical zone gaps noted.","Integrate HAZMAT training in Surat textile industrial clusters."),
            i("Gujarat","Kutch",62,"HIGH","PARTIALLY_COVERED","Remote area training coverage critically low.","Deploy satellite-based training units to Kutch border areas."),
            i("Telangana","Hyderabad",84,"LOW","WELL_COVERED","Urban preparedness strong; rural gaps in peri-urban zones.","Extend metro model to Ranga Reddy peri-urban zones."),
            i("Telangana","Warangal",72,"MODERATE","ADEQUATELY_COVERED","Flood preparedness adequate; drought training low.","Launch drought resilience program in Warangal rural blocks."),
            i("Andhra Pradesh","Visakhapatnam",80,"LOW","WELL_COVERED","Good cyclone preparedness; port zone needs upgrade.","Coordinate with port trust for industrial drills."),
            i("Andhra Pradesh","Guntur",72,"MODERATE","ADEQUATELY_COVERED","Flood preparedness moderate; cyclone training improving.","Increase cyclone shelter management training frequency."),
            i("Odisha","Bhubaneswar",82,"LOW","WELL_COVERED","Best practice cyclone preparedness model nationally.","Document and share Odisha model with coastal states."),
            i("Odisha","Puri",72,"MODERATE","ADEQUATELY_COVERED","Good cyclone coverage; flash flood gaps in rural areas.","Add flash flood module to existing cyclone training."),
            i("Odisha","Berhampur",64,"HIGH","PARTIALLY_COVERED","Southern coastal blocks undertrained.","Deploy rapid cyclone response training units immediately."),
            i("West Bengal","Kolkata",78,"MODERATE","ADEQUATELY_COVERED","Urban flood coverage good; slum areas undercovered.","Target slum communities with flood-specific drills."),
            i("West Bengal","Darjeeling",66,"HIGH","PARTIALLY_COVERED","Landslide risk very high; training coverage lagging.","Fast-track landslide preparedness for hill communities."),
            i("Rajasthan","Jaipur",74,"MODERATE","ADEQUATELY_COVERED","Heat wave training below target; industrial gaps noted.","Launch heat wave preparedness campaign before April."),
            i("Rajasthan","Jodhpur",62,"HIGH","PARTIALLY_COVERED","Extreme drought zone; community resilience critically low.","Immediate deployment of drought resilience training."),
            i("Rajasthan","Ajmer",58,"HIGH","PARTIALLY_COVERED","Flood and drought dual-risk preparedness inadequate.","Dual-hazard training program deployment needed urgently."),
            i("Madhya Pradesh","Bhopal",70,"MODERATE","ADEQUATELY_COVERED","Industrial disaster memory from 1984 fading.","Renew industrial HAZMAT training annually."),
            i("Madhya Pradesh","Jabalpur",60,"HIGH","PARTIALLY_COVERED","Flood preparedness for Narmada basin insufficient.","Deploy river flood monitoring training for Narmada zones."),
            i("Madhya Pradesh","Sagar",54,"HIGH","PARTIALLY_COVERED","Rural flood preparedness for Sone basin inadequate.","Deploy flood preparedness mobile units urgently."),
            i("Uttar Pradesh","Lucknow",66,"MODERATE","ADEQUATELY_COVERED","18 rural blocks below minimum threshold.","Deploy NGO partners to rural healthcare facilities."),
            i("Uttar Pradesh","Agra",58,"HIGH","PARTIALLY_COVERED","Flood and industrial preparedness below average.","Partner with industrial associations for safety drills."),
            i("Uttar Pradesh","Varanasi",54,"HIGH","PARTIALLY_COVERED","Ganga flood preparedness inadequate for dense population.","Fast-track Ganga flood evacuation drills."),
            i("Uttar Pradesh","Prayagraj",52,"HIGH","PARTIALLY_COVERED","Mass gathering disaster management training insufficient.","Conduct Kumbh-scale mass casualty simulation."),
            i("Bihar","Patna",52,"HIGH","UNDER_COVERED","Only 41% target population reached for flood training.","Deploy 3 mobile training units to Patna rural zones."),
            i("Bihar","Gaya",42,"CRITICAL","SEVERELY_UNDER_COVERED","Flood and drought preparedness near zero in rural blocks.","Emergency mobilization - coordinate with NDRF."),
            i("Bihar","Muzaffarpur",44,"CRITICAL","SEVERELY_UNDER_COVERED","Annual flood zone with critically low training coverage.","Immediate emergency training deployment needed."),
            i("Bihar","Darbhanga",40,"CRITICAL","SEVERELY_UNDER_COVERED","Highest flood risk with lowest coverage nationally.","CRITICAL - Immediate state-level emergency deployment."),
            i("Jharkhand","Ranchi",48,"CRITICAL","SEVERELY_UNDER_COVERED","No recent drills; industrial disaster preparedness absent.","Escalate to state emergency - deploy NDRF within 7 days."),
            i("Jharkhand","Dhanbad",44,"CRITICAL","SEVERELY_UNDER_COVERED","Mining disaster preparedness critically low.","Coordinate with DGMS for immediate mine safety training."),
            i("Chhattisgarh","Raipur",60,"HIGH","PARTIALLY_COVERED","Industrial accident preparedness below standard.","Industrial corridor safety training deployment needed."),
            i("Chhattisgarh","Jagdalpur",46,"CRITICAL","SEVERELY_UNDER_COVERED","Tribal area flood preparedness critically low.","Emergency tribal community training mobilization."),
            i("Assam","Guwahati",68,"MODERATE","ADEQUATELY_COVERED","Annual floods continue to outpace training coverage.","Pre-monsoon flood drill mandatory for all urban wards."),
            i("Assam","Tinsukia",56,"HIGH","PARTIALLY_COVERED","Oil field disaster training absent in high-risk zones.","Coordinate with OIL India for industrial disaster drills."),
            i("Assam","Silchar",54,"HIGH","PARTIALLY_COVERED","Flash flood preparedness low; earthquake risk growing.","Dual-hazard earthquake and flood training needed urgently."),
            i("Delhi","South Delhi",80,"LOW","WELL_COVERED","Strong urban preparedness; seismic training can improve.","Integrate seismic awareness in school curriculum."),
            i("Delhi","East Delhi",74,"MODERATE","ADEQUATELY_COVERED","Flood preparedness adequate; industrial gaps noted.","Partner with industrial associations for HAZMAT drills."),
            i("Punjab","Amritsar",74,"MODERATE","ADEQUATELY_COVERED","Border area flood preparedness needs strengthening.","Coordinate with BSF for cross-border flood drill."),
            i("Himachal Pradesh","Shimla",70,"MODERATE","ADEQUATELY_COVERED","Landslide coverage good; remote village gap exists.","Deploy helicopter-based awareness units to remote zones."),
            i("Uttarakhand","Dehradun",70,"MODERATE","ADEQUATELY_COVERED","Landslide and flash flood risk high; coverage improving.","Fast-track GLOF training for Himalayan communities."),
            i("Goa","North Goa",84,"LOW","WELL_COVERED","Tourism zone preparedness adequate; rip current training low.","Add beach safety modules for tourism staff."),
            i("Sikkim","Gangtok",72,"MODERATE","ADEQUATELY_COVERED","Earthquake risk very high; GLOF training improving.","Mandatory school earthquake drills twice yearly."),
            i("Manipur","Imphal West",60,"HIGH","PARTIALLY_COVERED","Flood and earthquake coverage below NE average.","Deploy NE regional NDRF unit for rapid capacity building."),
            i("Meghalaya","Shillong",65,"MODERATE","ADEQUATELY_COVERED","Landslide risk high in mining zones.","Partner with Meghalaya Mines Safety for specialized drills."),
            i("Jammu & Kashmir","Srinagar",58,"HIGH","PARTIALLY_COVERED","Earthquake and avalanche preparedness improving slowly.","Accelerate avalanche preparedness in high-altitude zones.")
        ).forEach(store::addInsight);
        log.info("  Seeded {} insights", store.allInsights().size());
    }

    private DistrictInsight i(String state, String district, int score, String risk,
                               String coverage, String gap, String rec) {
        return DistrictInsight.builder().insightId(uid()).state(state).district(district)
                .preparednessScore(score).riskLevel(risk).coverageStatus(coverage)
                .gapAnalysis(gap).recommendation(rec)
                .aiConfidence(85 + (int)(Math.random() * 12))
                .lastUpdated(now()).build();
    }

    // ── Reports ───────────────────────────────────────────────────────────────
    private void seedReports() {
        List.of(
            r("Q2 2026 National Training Coverage Report","Quarterly Summary","2026-06-20","NDMA Analytics Engine","4.2 MB","Ready","Comprehensive Q2 training analysis and coverage metrics."),
            r("Bihar Flood Preparedness Assessment 2026","State Assessment","2026-06-18","AI Insights Engine","2.8 MB","Ready","Detailed flood preparedness analysis for Bihar state."),
            r("National Training Provider Performance Index","Performance Report","2026-06-15","NDMA Analytics Engine","3.1 MB","Ready","Ranking and evaluation of training providers across states."),
            r("Cyclone-Prone Coastal Districts Risk Matrix","Risk Analysis","2026-06-12","AI Risk Module","5.6 MB","Ready","Risk matrix for 82 coastal districts."),
            r("Community Resilience Index 2026 Annual","Annual Report","2026-06-01","NDMA Research Division","7.4 MB","Ready","Annual assessment of community resilience across 420 districts."),
            r("Under-Prepared Districts Action Plan June 2026","Action Plan","2026-06-22","AI Insights Engine","1.9 MB","Processing","Targeted action plans for 108 under-prepared districts."),
            r("Northeast India Disaster Preparedness Review","State Assessment","2026-05-28","AI Insights Engine","3.3 MB","Ready","Comprehensive NE India preparedness gap analysis."),
            r("Monsoon Season Readiness Report 2026","Risk Analysis","2026-05-15","NDMA Analytics Engine","2.1 MB","Ready","Pre-monsoon readiness assessment across 22 flood-prone states.")
        ).forEach(store::addReport);
        log.info("  Seeded 8 reports");
    }

    private Report r(String name, String type, String date, String by,
                     String size, String status, String desc) {
        return Report.builder().reportId(uid()).reportName(name).type(type)
                .generatedDate(date).generatedBy(by).size(size).format("PDF")
                .status(status).description(desc).reportUrl("").build();
    }

    // ── Notifications ─────────────────────────────────────────────────────────
    private void seedNotifications() {
        List.of(
            n("alert","Critical: Ranchi District Below Threshold","Preparedness score dropped to 44%. Immediate intervention required.","10 min ago",false,"critical"),
            n("warning","Training Scheduled: Bihar Flood Response","Mobile training unit deployment to Patna rural zones scheduled.","1 hour ago",false,"high"),
            n("success","Q2 Report Generated Successfully","Q2 2026 National Training Coverage Report is ready for download.","2 hours ago",false,"normal"),
            n("info","New AI Recommendations Available","6 new AI-generated recommendations for under-prepared districts.","4 hours ago",true,"normal"),
            n("success","Kerala Training Completed","Community First Responder Training in Thiruvananthapuram completed. 450 certified.","1 day ago",true,"normal"),
            n("warning","Monsoon Season Alert","IMD forecasts above-normal rainfall for 12 states. Training review initiated.","2 days ago",true,"high")
        ).forEach(store::addNotification);
        log.info("  Seeded 6 notifications");
    }

    private Notification n(String type, String title, String message,
                            String time, boolean read, String priority) {
        return Notification.builder().notificationId(uid()).type(type).title(title)
                .message(message).time(time).read(read).priority(priority).build();
    }
}
