// ─────────────────────────────────────────────────────
//  DisasterTrain360 AI – State-wise GIS Demo Data
//  API-ready: set MOCK_MODE=false to consume GET /insights
// ─────────────────────────────────────────────────────

export const getColor = (score) => {
  if (score > 80) return '#10b981'
  if (score >= 50) return '#f59e0b'
  return '#ef4444'
}

export const getRiskLevel = (score) => {
  if (score > 80) return 'Low'
  if (score >= 65) return 'Moderate'
  if (score >= 50) return 'High'
  return 'Critical'
}

export const getCoverageStatus = (score) => {
  if (score > 80) return 'Well Covered'
  if (score >= 65) return 'Adequately Covered'
  if (score >= 50) return 'Partially Covered'
  return 'Under-Covered'
}

export const getRiskBadge = (level) => {
  const map = {
    Low:      'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    Moderate: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    High:     'bg-amber-500/20 text-amber-400 border-amber-500/30',
    Critical: 'bg-red-500/20 text-red-400 border-red-500/30',
  }
  return map[level] || map.Moderate
}

// ── State-level data ──────────────────────────────────
export const INDIA_STATES = [
  { id:'TN', name:'Tamil Nadu',         lat:11.1271, lng:78.6569, score:88, trainings:312, districts:38, capital:'Chennai',           primaryRisk:'Cyclone, Flood' },
  { id:'KL', name:'Kerala',             lat:10.8505, lng:76.2711, score:84, trainings:278, districts:14, capital:'Thiruvananthapuram', primaryRisk:'Flood, Landslide' },
  { id:'KA', name:'Karnataka',          lat:15.3173, lng:75.7139, score:81, trainings:265, districts:31, capital:'Bengaluru',          primaryRisk:'Flood, Drought' },
  { id:'MH', name:'Maharashtra',        lat:19.7515, lng:75.7139, score:79, trainings:298, districts:36, capital:'Mumbai',             primaryRisk:'Flood, Cyclone' },
  { id:'GJ', name:'Gujarat',            lat:22.2587, lng:71.1924, score:76, trainings:241, districts:33, capital:'Gandhinagar',        primaryRisk:'Earthquake, Cyclone' },
  { id:'TG', name:'Telangana',          lat:18.1124, lng:79.0193, score:74, trainings:198, districts:33, capital:'Hyderabad',          primaryRisk:'Flood, Drought' },
  { id:'AP', name:'Andhra Pradesh',     lat:15.9129, lng:79.7400, score:72, trainings:187, districts:26, capital:'Amaravati',          primaryRisk:'Cyclone, Flood' },
  { id:'OD', name:'Odisha',             lat:20.9517, lng:85.0985, score:77, trainings:212, districts:30, capital:'Bhubaneswar',        primaryRisk:'Cyclone, Flood' },
  { id:'WB', name:'West Bengal',        lat:22.9868, lng:87.8550, score:70, trainings:196, districts:23, capital:'Kolkata',            primaryRisk:'Cyclone, Flood' },
  { id:'GA', name:'Goa',                lat:15.2993, lng:74.1240, score:82, trainings:76,  districts:2,  capital:'Panaji',             primaryRisk:'Cyclone, Flood' },
  { id:'DL', name:'Delhi',              lat:28.7041, lng:77.1025, score:78, trainings:98,  districts:11, capital:'New Delhi',          primaryRisk:'Flood, Earthquake' },
  { id:'PB', name:'Punjab',             lat:31.1471, lng:75.3412, score:73, trainings:142, districts:23, capital:'Chandigarh',         primaryRisk:'Flood, Fog' },
  { id:'HR', name:'Haryana',            lat:29.0588, lng:76.0856, score:69, trainings:134, districts:22, capital:'Chandigarh',         primaryRisk:'Flood, Drought' },
  { id:'RJ', name:'Rajasthan',          lat:27.0238, lng:74.2179, score:65, trainings:178, districts:33, capital:'Jaipur',             primaryRisk:'Drought, Heat Wave' },
  { id:'HP', name:'Himachal Pradesh',   lat:31.1048, lng:77.1734, score:66, trainings:112, districts:12, capital:'Shimla',             primaryRisk:'Landslide, Earthquake' },
  { id:'UK', name:'Uttarakhand',        lat:30.0668, lng:79.0193, score:63, trainings:118, districts:13, capital:'Dehradun',           primaryRisk:'Landslide, Flood' },
  { id:'SK', name:'Sikkim',             lat:27.5330, lng:88.5122, score:67, trainings:48,  districts:6,  capital:'Gangtok',            primaryRisk:'Earthquake, Landslide' },
  { id:'MP', name:'Madhya Pradesh',     lat:22.9734, lng:78.6569, score:62, trainings:164, districts:55, capital:'Bhopal',             primaryRisk:'Flood, Drought' },
  { id:'CG', name:'Chhattisgarh',       lat:21.2787, lng:81.8661, score:52, trainings:108, districts:33, capital:'Raipur',             primaryRisk:'Flood, Industrial Hazard' },
  { id:'AS', name:'Assam',              lat:26.2006, lng:92.9376, score:61, trainings:143, districts:35, capital:'Dispur',             primaryRisk:'Flood, Earthquake' },
  { id:'ML', name:'Meghalaya',          lat:25.4670, lng:91.3662, score:60, trainings:68,  districts:12, capital:'Shillong',           primaryRisk:'Landslide, Flood' },
  { id:'MN', name:'Manipur',            lat:24.6637, lng:93.9063, score:55, trainings:64,  districts:16, capital:'Imphal',             primaryRisk:'Earthquake, Flood' },
  { id:'TR', name:'Tripura',            lat:23.9408, lng:91.9882, score:57, trainings:61,  districts:8,  capital:'Agartala',           primaryRisk:'Flood, Earthquake' },
  { id:'MZ', name:'Mizoram',            lat:23.1645, lng:92.9376, score:58, trainings:58,  districts:11, capital:'Aizawl',             primaryRisk:'Earthquake, Landslide' },
  { id:'NL', name:'Nagaland',           lat:26.1584, lng:94.5624, score:53, trainings:52,  districts:12, capital:'Kohima',             primaryRisk:'Earthquake, Flood' },
  { id:'UP', name:'Uttar Pradesh',      lat:26.8467, lng:80.9462, score:58, trainings:203, districts:75, capital:'Lucknow',            primaryRisk:'Flood, Earthquake' },
  { id:'BR', name:'Bihar',              lat:25.0961, lng:85.3131, score:46, trainings:124, districts:38, capital:'Patna',              primaryRisk:'Flood, Drought' },
  { id:'JH', name:'Jharkhand',          lat:23.6102, lng:85.2799, score:44, trainings:96,  districts:24, capital:'Ranchi',             primaryRisk:'Flood, Industrial Hazard' },
  { id:'AR', name:'Arunachal Pradesh',  lat:28.2180, lng:94.7278, score:49, trainings:43,  districts:25, capital:'Itanagar',           primaryRisk:'Earthquake, Flood' },
  { id:'JK', name:'Jammu & Kashmir',    lat:33.7782, lng:76.5762, score:54, trainings:87,  districts:20, capital:'Srinagar / Jammu',   primaryRisk:'Earthquake, Flood' },
  { id:'LA', name:'Ladakh',             lat:34.1526, lng:77.5770, score:48, trainings:34,  districts:2,  capital:'Leh',                primaryRisk:'Earthquake, Avalanche' },
]

// ── District-level data per state ────────────────────
export const STATE_DISTRICTS = {
  TN: [
    { id:'TN-CHN', name:'Chennai',         score:92, trainings:84 },
    { id:'TN-COI', name:'Coimbatore',      score:78, trainings:62 },
    { id:'TN-MAD', name:'Madurai',         score:74, trainings:54 },
    { id:'TN-TRI', name:'Tiruchirappalli', score:71, trainings:48 },
    { id:'TN-SAL', name:'Salem',           score:68, trainings:44 },
    { id:'TN-TIR', name:'Tirunelveli',     score:66, trainings:40 },
    { id:'TN-VEL', name:'Vellore',         score:63, trainings:36 },
    { id:'TN-ERP', name:'Erode',           score:70, trainings:46 },
  ],
  KL: [
    { id:'KL-TVM', name:'Thiruvananthapuram', score:88, trainings:72 },
    { id:'KL-KOC', name:'Ernakulam',          score:86, trainings:68 },
    { id:'KL-KOZ', name:'Kozhikode',          score:82, trainings:60 },
    { id:'KL-TRS', name:'Thrissur',           score:79, trainings:54 },
    { id:'KL-WAY', name:'Wayanad',            score:68, trainings:38 },
    { id:'KL-IDU', name:'Idukki',             score:64, trainings:34 },
  ],
  KA: [
    { id:'KA-BLR', name:'Bengaluru',          score:88, trainings:78 },
    { id:'KA-MYS', name:'Mysuru',             score:76, trainings:58 },
    { id:'KA-HUB', name:'Dharwad',            score:72, trainings:50 },
    { id:'KA-MNG', name:'Dakshina Kannada',   score:78, trainings:56 },
    { id:'KA-BLG', name:'Belagavi',           score:68, trainings:44 },
    { id:'KA-KLP', name:'Kalaburagi',         score:62, trainings:38 },
  ],
  MH: [
    { id:'MH-MUM', name:'Mumbai',    score:92, trainings:84 },
    { id:'MH-PUN', name:'Pune',      score:86, trainings:72 },
    { id:'MH-NAG', name:'Nagpur',    score:74, trainings:56 },
    { id:'MH-NSK', name:'Nashik',    score:70, trainings:50 },
    { id:'MH-AUR', name:'Aurangabad',score:64, trainings:42 },
    { id:'MH-SOL', name:'Solapur',   score:60, trainings:36 },
  ],
  GJ: [
    { id:'GJ-AMD', name:'Ahmedabad', score:82, trainings:70 },
    { id:'GJ-SUR', name:'Surat',     score:76, trainings:60 },
    { id:'GJ-VAD', name:'Vadodara',  score:74, trainings:56 },
    { id:'GJ-RJK', name:'Rajkot',    score:70, trainings:50 },
    { id:'GJ-BHJ', name:'Kutch',     score:62, trainings:40 },
    { id:'GJ-GAN', name:'Gandhinagar',score:78, trainings:58 },
  ],
  TG: [
    { id:'TG-HYD', name:'Hyderabad', score:84, trainings:68 },
    { id:'TG-WAR', name:'Warangal',  score:72, trainings:50 },
    { id:'TG-NZB', name:'Nizamabad', score:68, trainings:44 },
    { id:'TG-KRM', name:'Karimnagar',score:65, trainings:40 },
    { id:'TG-KHM', name:'Khammam',   score:62, trainings:36 },
  ],
  AP: [
    { id:'AP-VIZ', name:'Visakhapatnam', score:80, trainings:64 },
    { id:'AP-VJW', name:'Vijayawada',    score:76, trainings:56 },
    { id:'AP-GUN', name:'Guntur',        score:72, trainings:50 },
    { id:'AP-TIR', name:'Tirupati',      score:70, trainings:46 },
    { id:'AP-KUR', name:'Kurnool',       score:62, trainings:38 },
  ],
  OD: [
    { id:'OD-BHU', name:'Bhubaneswar', score:82, trainings:66 },
    { id:'OD-CUT', name:'Cuttack',     score:78, trainings:58 },
    { id:'OD-SAM', name:'Sambalpur',   score:68, trainings:44 },
    { id:'OD-PUR', name:'Puri',        score:72, trainings:50 },
    { id:'OD-BER', name:'Berhampur',   score:64, trainings:38 },
  ],
  WB: [
    { id:'WB-KOL', name:'Kolkata',    score:78, trainings:62 },
    { id:'WB-HOW', name:'Howrah',     score:72, trainings:52 },
    { id:'WB-DAR', name:'Darjeeling', score:66, trainings:40 },
    { id:'WB-SIL', name:'Siliguri',   score:68, trainings:44 },
    { id:'WB-DUR', name:'Durgapur',   score:64, trainings:36 },
  ],
  GA: [
    { id:'GA-NGA', name:'North Goa', score:84, trainings:42 },
    { id:'GA-SGA', name:'South Goa', score:80, trainings:34 },
  ],
  DL: [
    { id:'DL-NDL', name:'North Delhi',   score:76, trainings:42 },
    { id:'DL-SDL', name:'South Delhi',   score:80, trainings:46 },
    { id:'DL-CDL', name:'Central Delhi', score:78, trainings:44 },
    { id:'DL-EDL', name:'East Delhi',    score:74, trainings:38 },
    { id:'DL-WDL', name:'West Delhi',    score:76, trainings:40 },
  ],
  PB: [
    { id:'PB-LDH', name:'Ludhiana',  score:76, trainings:52 },
    { id:'PB-AMR', name:'Amritsar',  score:74, trainings:48 },
    { id:'PB-JLD', name:'Jalandhar', score:70, trainings:42 },
    { id:'PB-PTL', name:'Patiala',   score:72, trainings:44 },
  ],
  HR: [
    { id:'HR-GGN', name:'Gurugram',  score:76, trainings:48 },
    { id:'HR-FBD', name:'Faridabad', score:72, trainings:44 },
    { id:'HR-AMB', name:'Ambala',    score:66, trainings:36 },
    { id:'HR-KRN', name:'Karnal',    score:62, trainings:32 },
  ],
  RJ: [
    { id:'RJ-JAI', name:'Jaipur',   score:74, trainings:56 },
    { id:'RJ-JOD', name:'Jodhpur',  score:62, trainings:42 },
    { id:'RJ-UDA', name:'Udaipur',  score:68, trainings:46 },
    { id:'RJ-KOT', name:'Kota',     score:60, trainings:38 },
    { id:'RJ-AJM', name:'Ajmer',    score:58, trainings:34 },
  ],
  HP: [
    { id:'HP-SML', name:'Shimla', score:70, trainings:44 },
    { id:'HP-MCL', name:'Mandi',  score:62, trainings:34 },
    { id:'HP-KNG', name:'Kangra', score:60, trainings:30 },
    { id:'HP-KLU', name:'Kullu',  score:58, trainings:28 },
  ],
  UK: [
    { id:'UK-DDN', name:'Dehradun',          score:70, trainings:50 },
    { id:'UK-HRD', name:'Haridwar',          score:64, trainings:40 },
    { id:'UK-NNT', name:'Nainital',          score:58, trainings:32 },
    { id:'UK-UDH', name:'Udham Singh Nagar', score:62, trainings:36 },
  ],
  SK: [
    { id:'SK-GTK', name:'Gangtok', score:72, trainings:26 },
    { id:'SK-MAL', name:'Mangan',  score:60, trainings:16 },
  ],
  MP: [
    { id:'MP-BHO', name:'Bhopal',    score:70, trainings:52 },
    { id:'MP-IND', name:'Indore',    score:68, trainings:48 },
    { id:'MP-GWL', name:'Gwalior',   score:62, trainings:40 },
    { id:'MP-JAB', name:'Jabalpur',  score:60, trainings:36 },
    { id:'MP-SAG', name:'Sagar',     score:54, trainings:28 },
  ],
  CG: [
    { id:'CG-RAI', name:'Raipur',    score:60, trainings:42 },
    { id:'CG-BIL', name:'Bilaspur',  score:54, trainings:34 },
    { id:'CG-DRG', name:'Durg',      score:50, trainings:30 },
    { id:'CG-JGD', name:'Jagdalpur', score:46, trainings:24 },
  ],
  AS: [
    { id:'AS-GUW', name:'Guwahati',   score:68, trainings:52 },
    { id:'AS-DIS', name:'Dibrugarh',  score:58, trainings:38 },
    { id:'AS-SIL', name:'Silchar',    score:54, trainings:34 },
    { id:'AS-TIN', name:'Tinsukia',   score:56, trainings:36 },
  ],
  ML: [
    { id:'ML-SHL', name:'Shillong',        score:65, trainings:32 },
    { id:'ML-JNT', name:'Jaintia Hills',   score:54, trainings:20 },
    { id:'ML-GAR', name:'East Garo Hills', score:52, trainings:18 },
  ],
  MN: [
    { id:'MN-IMP', name:'Imphal West',    score:60, trainings:30 },
    { id:'MN-IME', name:'Imphal East',    score:56, trainings:26 },
    { id:'MN-CHU', name:'Churachandpur', score:48, trainings:18 },
  ],
  TR: [
    { id:'TR-AGA', name:'Agartala', score:62, trainings:28 },
    { id:'TR-DHR', name:'Dhalai',   score:50, trainings:18 },
  ],
  MZ: [
    { id:'MZ-AIZ', name:'Aizawl',  score:62, trainings:28 },
    { id:'MZ-LNG', name:'Lunglei', score:54, trainings:20 },
  ],
  NL: [
    { id:'NL-KOH', name:'Kohima',  score:58, trainings:24 },
    { id:'NL-DIM', name:'Dimapur', score:52, trainings:18 },
  ],
  UP: [
    { id:'UP-LKO', name:'Lucknow',    score:66, trainings:54 },
    { id:'UP-AGR', name:'Agra',       score:58, trainings:42 },
    { id:'UP-VAR', name:'Varanasi',   score:54, trainings:36 },
    { id:'UP-KNP', name:'Kanpur',     score:56, trainings:38 },
    { id:'UP-PRY', name:'Prayagraj',  score:52, trainings:32 },
    { id:'UP-GZB', name:'Ghaziabad',  score:60, trainings:42 },
  ],
  BR: [
    { id:'BR-PAT', name:'Patna',        score:52, trainings:38 },
    { id:'BR-GAY', name:'Gaya',         score:42, trainings:26 },
    { id:'BR-MUZ', name:'Muzaffarpur',  score:44, trainings:28 },
    { id:'BR-BHG', name:'Bhagalpur',    score:46, trainings:30 },
    { id:'BR-DAR', name:'Darbhanga',    score:40, trainings:22 },
  ],
  JH: [
    { id:'JH-RAN', name:'Ranchi',     score:48, trainings:32 },
    { id:'JH-JAM', name:'Jamshedpur', score:52, trainings:36 },
    { id:'JH-DHA', name:'Dhanbad',    score:44, trainings:26 },
    { id:'JH-BOK', name:'Bokaro',     score:46, trainings:28 },
  ],
  AR: [
    { id:'AR-ITA', name:'Itanagar',   score:54, trainings:18 },
    { id:'AR-NAH', name:'Naharlagun', score:46, trainings:12 },
  ],
  JK: [
    { id:'JK-SRN', name:'Srinagar',  score:58, trainings:36 },
    { id:'JK-JAM', name:'Jammu',     score:56, trainings:32 },
    { id:'JK-ANT', name:'Anantnag',  score:50, trainings:24 },
    { id:'JK-BAR', name:'Baramulla', score:48, trainings:22 },
  ],
  LA: [
    { id:'LA-LEH', name:'Leh',    score:50, trainings:20 },
    { id:'LA-KAR', name:'Kargil', score:46, trainings:14 },
  ],
}

// ── Derived national summary ──────────────────────────
export const getNationalSummary = (states) => {
  const totalDistricts = Object.values(STATE_DISTRICTS)
    .reduce((sum, d) => sum + d.length, 0)
  const avgScore = Math.round(
    states.reduce((s, st) => s + st.score, 0) / states.length
  )
  const highRisk = states.filter(s => s.score < 50).length
  return {
    totalStates: states.length,
    totalDistricts,
    avgScore,
    highRiskStates: highRisk,
  }
}
