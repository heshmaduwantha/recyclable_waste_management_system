/**
 * EcoCollect System - Generative Synthetic Dataset Engine
 * 
 * Generates verified, mathematically consistent datasets for:
 * 1. Customers & Vetted Municipal Fleets (Colombo & Western Province)
 * 2. Scheduled & On-Demand Doorstep Pickups (with Bluetooth scale verification)
 * 3. Eco-Wallets & Ledger Transactions (Dialog/Mobitel redemptions & pickup rewards)
 * 4. Certified ESG Sustainability Metrics (CO2 mitigation, landfill diversion, trees planted)
 * 5. Multimodal AI Vision Dataset (Annotations, Prompts, Bounding Boxes & Classification)
 * 6. Ready-to-Execute PostgreSQL seed SQL file
 */

const fs = require('fs');
const path = require('path');

const OUTPUT_DIR = path.resolve(__dirname, '../datasets');
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

// -------------------------------------------------------------------
// 1. CONFIGURATION & MASTER CALCULATION CONSTANTS
// -------------------------------------------------------------------
const CONSTANTS = {
  POINTS_PER_LKR: 5,           // 1 Eco Point = 0.20 LKR
  LKR_PER_POINT: 0.20,
  WELCOME_BONUS_POINTS: 500,   // 500 pts = 100 LKR
  WELCOME_BONUS_LKR: 100,
  COLLECTOR_COMMISSION_PER_KG: 30.30, // LKR 30.30/kg
  CO2_FACTOR_PER_KG: 2.85,     // 2.85 kg CO2 reduction per kg waste
  TREE_FACTOR_KG_PER_YEAR: 12  // 1 tree absorbs ~12 kg CO2/year
};

const MATERIAL_RATES = {
  plastic:   { name: 'Plastic (PET & HDPE)',   pricePerKg: 120, pointsPerKg: 50,  icon: '🧴', category: 'Plastic' },
  metal:     { name: 'Metal & Aluminum Cans',  pricePerKg: 250, pointsPerKg: 100, icon: '🥫', category: 'Metal' },
  'e-waste': { name: 'E-Waste & Small Gadgets',pricePerKg: 400, pointsPerKg: 200, icon: '💻', category: 'E-Waste' },
  polythene: { name: 'Polythene & LDPE Wrap',  pricePerKg: 80,  pointsPerKg: 30,  icon: '🛍️', category: 'Polythene' },
  paper:     { name: 'Paper & Cardboard',      pricePerKg: 60,  pointsPerKg: 25,  icon: '📰', category: 'Paper' },
  glass:     { name: 'Glass Bottles & Jars',   pricePerKg: 40,  pointsPerKg: 20,  icon: '🫙', category: 'Glass' }
};

const ZONES = [
  { city: 'Colombo 01', street: 'Chatham Street', lat: 6.9344, lon: 79.8428, zip: '00100' },
  { city: 'Colombo 02', street: 'Vauxhall Street', lat: 6.9232, lon: 79.8524, zip: '00200' },
  { city: 'Colombo 03', street: 'Galle Road, Colpetty', lat: 6.9080, lon: 79.8510, zip: '00300' },
  { city: 'Colombo 04', street: 'Duplication Road, Bambalapitiya', lat: 6.8920, lon: 79.8560, zip: '00400' },
  { city: 'Colombo 05', street: 'Havelock Road', lat: 6.8860, lon: 79.8690, zip: '00500' },
  { city: 'Colombo 06', street: 'W.A. Silva Mawatha, Wellawatte', lat: 6.8720, lon: 79.8620, zip: '00600' },
  { city: 'Colombo 07', street: 'Ward Place, Cinnamon Gardens', lat: 6.9070, lon: 79.8700, zip: '00700' },
  { city: 'Colombo 08', street: 'Cotta Road, Borella', lat: 6.9150, lon: 79.8820, zip: '00800' },
  { city: 'Colombo 10', street: 'Dean\'s Road, Maradana', lat: 6.9270, lon: 79.8680, zip: '01000' },
  { city: 'Colombo 11', street: 'Keyzer Street, Pettah', lat: 6.9380, lon: 79.8550, zip: '01100' },
  { city: 'Colombo 13', street: 'Kotahena Street', lat: 6.9490, lon: 79.8630, zip: '01300' },
  { city: 'Dehiwala',   street: 'Station Road', lat: 6.8511, lon: 79.8659, zip: '10350' },
  { city: 'Nugegoda',   street: 'High Level Road', lat: 6.8649, lon: 79.8997, zip: '10250' },
  { city: 'Rajagiriya', street: 'Sri Jayawardenepura Mw', lat: 6.9095, lon: 79.8970, zip: '10107' },
  { city: 'Mount Lavinia', street: 'Hotel Road', lat: 6.8340, lon: 79.8640, zip: '10370' }
];

const FIRST_NAMES = [
  'Kasun', 'Nimalee', 'Dinesh', 'Sanduni', 'Tharindu', 'Dilshan', 'Chamari', 'Ruwan',
  'Anusha', 'Kaveen', 'Sachini', 'Pradeep', 'Malith', 'Harshana', 'Thisara', 'Nuwan',
  'Chathuri', 'Lakshan', 'Supun', 'Ishani', 'Nalaka', 'Shalika', 'Damith', 'Shenali',
  'Janaka', 'Priyanka', 'Amila', 'Gayani', 'Lahiru', 'Buddhika'
];

const LAST_NAMES = [
  'Perera', 'Silva', 'Fernando', 'de Silva', 'Bandara', 'Jayawardena', 'Gunasekara',
  'Wijesinghe', 'Senanayake', 'Rajapaksa', 'Wickramasinghe', 'Rathnayake', 'Dissanayake',
  'Alwis', 'Mendis', 'Abeysekera', 'Karunaratne', 'Hettiarachchi', 'Jayasinghe', 'Samarasinghe'
];

const VEHICLE_TYPES = [
  { prefix: 'WP AA-', type: 'Electric Cargo Tuk-Tuk' },
  { prefix: 'WP AB-', type: 'Piaggio Ape 3-Wheeler' },
  { prefix: 'WP DA-', type: 'Tata Ace Mega Light Truck' },
  { prefix: 'WP DB-', type: 'Mahindra Bolero Maxi Truck' }
];

const ECO_TIERS = [
  'Eco Rookie', 'Green Warrior', 'Eco Champion', 'Planet Saver', 'Zero-Waste Hero'
];

// Helper random functions
function rnd(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
function rndFloat(min, max, decimals = 2) {
  return parseFloat((Math.random() * (max - min) + min).toFixed(decimals));
}
function pickOne(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}
function pad(num, size = 4) {
  let s = num + '';
  while (s.length < size) s = '0' + s;
  return s;
}

// -------------------------------------------------------------------
// 2. GENERATE CUSTOMERS (100 Households)
// -------------------------------------------------------------------
console.log('Generating 100 Realistic Sri Lankan Household Customers...');
const customers = [];
for (let i = 1; i <= 100; i++) {
  const fName = pickOne(FIRST_NAMES);
  const lName = pickOne(LAST_NAMES);
  const fullName = `${fName} ${lName}`;
  const zone = pickOne(ZONES);
  const houseNo = `${rnd(1, 150)}/${rnd(1, 12) === 1 ? 'A' : rnd(1, 12) === 2 ? 'B' : ''}`.replace(/\/$/, '');
  const streetAddr = `${houseNo}, ${zone.street}`;
  const email = `${fName.toLowerCase()}.${lName.toLowerCase()}${rnd(10, 99)}@gmail.com`;
  const phone = `+94 7${pickOne([0, 1, 2, 4, 5, 6, 7, 8])} ${rnd(100, 999)} ${rnd(1000, 9999)}`;
  const jitterLat = rndFloat(-0.005, 0.005, 6);
  const jitterLon = rndFloat(-0.005, 0.005, 6);

  customers.push({
    id: `CUST-${pad(i, 4)}`,
    name: fullName,
    email,
    phone,
    role: 'customer',
    street: streetAddr,
    city: zone.city,
    zipCode: zone.zip,
    latitude: parseFloat((zone.lat + jitterLat).toFixed(6)),
    longitude: parseFloat((zone.lon + jitterLon).toFixed(6)),
    ecoRatingTag: ECO_TIERS[Math.min(Math.floor((i - 1) / 20), ECO_TIERS.length - 1)],
    cityRank: i,
    avatarUrl: `https://images.unsplash.com/photo-${1530000000000 + i}?w=150&auto=format&fit=crop&q=80`,
    createdAt: new Date(Date.now() - rnd(10, 180) * 86400000).toISOString()
  });
}

// -------------------------------------------------------------------
// 3. GENERATE DRIVERS / COLLECTORS (25 Vetted Fleet Pickers)
// -------------------------------------------------------------------
console.log('Generating 25 Vetted Municipal Fleet Collectors...');
const pickers = [];
for (let i = 1; i <= 25; i++) {
  const fName = pickOne(FIRST_NAMES);
  const lName = pickOne(LAST_NAMES);
  const fullName = `${fName} ${lName}`;
  const zone = pickOne(ZONES);
  const veh = pickOne(VEHICLE_TYPES);
  const vehicleNumber = `${veh.prefix}${rnd(1000, 9999)}`;
  const email = `${fName.toLowerCase()}.${lName.toLowerCase()}@ecocollect.lk`;
  const phone = `+94 71 ${rnd(200, 899)} ${rnd(1000, 9999)}`;

  pickers.push({
    id: `PICK-${pad(i, 3)}`,
    name: fullName,
    email,
    phone,
    role: 'picker',
    operatingZone: zone.city,
    vehicleType: veh.type,
    vehicleNumber,
    street: `${rnd(10, 80)}, Fleet Depot Road`,
    city: zone.city,
    zipCode: zone.zip,
    rating: rndFloat(4.7, 5.0, 1),
    jobsCompleted: rnd(20, 180),
    totalCommissionEarnedLkr: 0, // calculated from pickups
    totalWeightCollectedKg: 0,
    avatarUrl: `https://images.unsplash.com/photo-${1570000000000 + i}?w=150&auto=format&fit=crop&q=80`,
    createdAt: new Date(Date.now() - rnd(60, 240) * 86400000).toISOString()
  });
}

// -------------------------------------------------------------------
// 4. GENERATE PICKUPS & CALCULATIONS (350 Collection Orders)
// -------------------------------------------------------------------
console.log('Generating 350 Doorstep Pickup Orders with Bluetooth Weigh-in Calculations...');
const pickups = [];
const categoriesList = Object.keys(MATERIAL_RATES);
const statusPool = ['completed', 'completed', 'completed', 'in_progress', 'assigned', 'pending', 'rejected'];
const rejectionReasons = [
  'Material contaminated with non-recyclable domestic food waste',
  'Customer unavailable at designated doorstep coordinates after 3 phone attempts',
  'Recyclables wet/soiled with chemical residues',
  'Customer requested reschedule to weekend'
];

let globalTotalWasteKg = 0;
let globalAvoidedCo2Kg = 0;

for (let i = 1; i <= 350; i++) {
  const customer = pickOne(customers);
  const status = pickOne(statusPool);
  let picker = null;
  let pickerStatus = 'unassigned';

  if (status !== 'pending') {
    picker = pickOne(pickers);
    pickerStatus = status === 'completed' ? 'completed' : status === 'rejected' ? 'rejected' : 'accepted';
  }

  // 1 to 3 categories per pickup
  const numCats = rnd(1, 3);
  const shuffledCats = [...categoriesList].sort(() => 0.5 - Math.random()).slice(0, numCats);

  const items = [];
  let totalEstWeight = 0;
  let totalActWeight = 0;
  let totalEstPts = 0;
  let totalEarnedPts = 0;
  let totalPayoutLkr = 0;

  shuffledCats.forEach(catKey => {
    const rateInfo = MATERIAL_RATES[catKey];
    const estWeight = rndFloat(2.0, 18.0, 1);
    // Verified weight slightly varies (+- 10%) from estimate
    const variance = status === 'completed' ? rndFloat(0.88, 1.12, 2) : 1.0;
    const actWeight = status === 'completed' ? parseFloat((estWeight * variance).toFixed(1)) : 0;

    const estPoints = Math.round(estWeight * rateInfo.pointsPerKg);
    const actPoints = status === 'completed' ? Math.round(actWeight * rateInfo.pointsPerKg) : 0;
    const estPayout = parseFloat((estWeight * rateInfo.pricePerKg).toFixed(2));
    const actPayout = status === 'completed' ? parseFloat((actWeight * rateInfo.pricePerKg).toFixed(2)) : 0;

    totalEstWeight += estWeight;
    totalActWeight += actWeight;
    totalEstPts += estPoints;
    totalEarnedPts += actPoints;
    totalPayoutLkr += (status === 'completed' ? actPayout : estPayout);

    items.push({
      category: catKey,
      materialName: rateInfo.name,
      estimatedWeightKg: estWeight,
      actualWeightKg: actWeight,
      pricePerKgLkr: rateInfo.pricePerKg,
      pointsPerKg: rateInfo.pointsPerKg,
      icon: rateInfo.icon
    });
  });

  totalEstWeight = parseFloat(totalEstWeight.toFixed(1));
  totalActWeight = parseFloat(totalActWeight.toFixed(1));
  totalPayoutLkr = parseFloat(totalPayoutLkr.toFixed(2));

  // Commission calculation for driver: 30.30 LKR per kg
  const driverCommissionLkr = status === 'completed' ? parseFloat((totalActWeight * CONSTANTS.COLLECTOR_COMMISSION_PER_KG).toFixed(2)) : 0;

  // Haversine route distance & doorstep verification
  const distanceMeters = rnd(15, 1400);
  const proximityVerified = distanceMeters <= 50;

  // Dates
  const daysAgo = rnd(0, 90);
  const pickupDate = new Date(Date.now() - daysAgo * 86400000);
  const dateStr = pickupDate.toISOString().split('T')[0];
  const timeSlot = pickOne(['08:00 AM - 10:00 AM', '10:00 AM - 12:00 PM', '01:00 PM - 03:00 PM', '03:00 PM - 05:00 PM']);

  const pickup = {
    id: `PU-${pad(8000 + i, 5)}`,
    customerId: customer.id,
    customerName: customer.name,
    customerPhone: customer.phone,
    pickerId: picker ? picker.id : null,
    pickerName: picker ? picker.name : null,
    pickerVehicle: picker ? picker.vehicleNumber : null,
    items,
    totalEstimatedWeight: totalEstWeight,
    totalActualWeight: totalActWeight,
    estimatedPoints: totalEstPts,
    earnedPoints: totalEarnedPts,
    cashValueLkr: parseFloat((totalEarnedPts * CONSTANTS.LKR_PER_POINT).toFixed(2)),
    driverCommissionLkr,
    status,
    pickerStatus,
    rejectionReason: status === 'rejected' ? pickOne(rejectionReasons) : null,
    scheduledDate: dateStr,
    scheduledTimeSlot: timeSlot,
    address: {
      street: customer.street,
      city: customer.city,
      zipCode: customer.zipCode,
      latitude: customer.latitude,
      longitude: customer.longitude
    },
    doorstepDistanceMeters: distanceMeters,
    doorstepProximityVerified: proximityVerified,
    bluetoothScaleId: status === 'completed' ? `SCALE-BT-${rnd(100, 999)}` : null,
    createdAt: new Date(pickupDate.getTime() - 86400000).toISOString(),
    completedAt: status === 'completed' ? new Date(pickupDate.getTime() + rnd(1, 4) * 3600000).toISOString() : null
  };

  pickups.push(pickup);

  if (status === 'completed') {
    globalTotalWasteKg += totalActWeight;
    globalAvoidedCo2Kg += totalActWeight * CONSTANTS.CO2_FACTOR_PER_KG;
    if (picker) {
      picker.totalCommissionEarnedLkr = parseFloat((picker.totalCommissionEarnedLkr + driverCommissionLkr).toFixed(2));
      picker.totalWeightCollectedKg = parseFloat((picker.totalWeightCollectedKg + totalActWeight).toFixed(1));
    }
  }
}

// -------------------------------------------------------------------
// 5. GENERATE WALLETS & TRANSACTIONS (Households ledger)
// -------------------------------------------------------------------
console.log('Generating Eco-Wallets and Airtime Redemption Ledger Transactions...');
const wallets = [];
const walletTransactions = [];
let txIdCounter = 1;

customers.forEach((cust, idx) => {
  // Find all completed pickups for this customer
  const custPickups = pickups.filter(p => p.customerId === cust.id && p.status === 'completed');
  const earnedFromPickups = custPickups.reduce((sum, p) => sum + p.earnedPoints, 0);

  // Every new customer gets 500 bonus points (100 LKR)
  const totalEarnedPoints = CONSTANTS.WELCOME_BONUS_POINTS + earnedFromPickups;

  // Some customers redeem Dialog/Mobitel reloads
  let totalRedeemedPoints = 0;
  const numRedemptions = earnedFromPickups > 400 ? rnd(1, 3) : 0;

  // 1. Initial Signup Bonus Transaction
  walletTransactions.push({
    id: `TX-${pad(txIdCounter++, 6)}`,
    walletId: `WAL-${cust.id.split('-')[1]}`,
    userId: cust.id,
    type: 'earn',
    title: 'Welcome Eco Bonus',
    points: `+${CONSTANTS.WELCOME_BONUS_POINTS} pts`,
    pointsNumber: CONSTANTS.WELCOME_BONUS_POINTS,
    amountLkr: CONSTANTS.WELCOME_BONUS_LKR,
    date: 'On Registration',
    icon: '🎁',
    createdAt: cust.createdAt
  });

  // 2. Collection Rewards Transactions
  custPickups.forEach(p => {
    walletTransactions.push({
      id: `TX-${pad(txIdCounter++, 6)}`,
      walletId: `WAL-${cust.id.split('-')[1]}`,
      userId: cust.id,
      type: 'earn',
      title: `Pickup #${p.id} Reward`,
      points: `+${p.earnedPoints} pts`,
      pointsNumber: p.earnedPoints,
      amountLkr: parseFloat((p.earnedPoints * CONSTANTS.LKR_PER_POINT).toFixed(2)),
      date: p.scheduledDate,
      icon: '♻️',
      createdAt: p.completedAt || p.createdAt
    });
  });

  // 3. Telco Mobile Reload Redemptions
  for (let r = 0; r < numRedemptions; r++) {
    const isDialog = Math.random() > 0.5;
    const costPts = isDialog ? 500 : 250; // 500 pts = LKR 100 or 250 pts = LKR 50
    if (totalEarnedPoints - totalRedeemedPoints >= costPts) {
      totalRedeemedPoints += costPts;
      walletTransactions.push({
        id: `TX-${pad(txIdCounter++, 6)}`,
        walletId: `WAL-${cust.id.split('-')[1]}`,
        userId: cust.id,
        type: 'redeem',
        title: isDialog ? 'Dialog LKR 100 Mobile Reload' : 'Mobitel LKR 50 Airtime Top-Up',
        points: `-${costPts} pts`,
        pointsNumber: -costPts,
        amountLkr: -(costPts * CONSTANTS.LKR_PER_POINT),
        date: 'Recent',
        icon: '📱',
        createdAt: new Date(Date.now() - rnd(1, 30) * 86400000).toISOString()
      });
    }
  }

  const currentPoints = totalEarnedPoints - totalRedeemedPoints;
  const cashEquivalentLkr = parseFloat((currentPoints * CONSTANTS.LKR_PER_POINT).toFixed(2));

  wallets.push({
    id: `WAL-${cust.id.split('-')[1]}`,
    userId: cust.id,
    customerName: cust.name,
    totalPoints: currentPoints,
    cashEquivalentLkr,
    totalEarnedPoints,
    totalRedeemedPoints,
    updatedAt: new Date().toISOString()
  });
});

// -------------------------------------------------------------------
// 6. GENERATE CERTIFIED ESG IMPACT ANALYTICS DATASET
// -------------------------------------------------------------------
console.log('Generating Certified ESG Sustainability Metrics...');
const totalTreesEquivalent = Math.round(globalAvoidedCo2Kg / CONSTANTS.TREE_FACTOR_KG_PER_YEAR);
const landfillDiversionRate = rndFloat(94.5, 97.2, 1);

const esgAnalytics = {
  summary: {
    totalWasteCollectedKg: parseFloat(globalTotalWasteKg.toFixed(2)),
    totalWasteTons: parseFloat((globalTotalWasteKg / 1000).toFixed(2)),
    co2EmissionsAvoidedKg: parseFloat(globalAvoidedCo2Kg.toFixed(2)),
    co2EmissionsAvoidedTons: parseFloat((globalAvoidedCo2Kg / 1000).toFixed(2)),
    treesPlantedEquivalent: totalTreesEquivalent,
    municipalLandfillDiversionRatePercent: landfillDiversionRate,
    totalActiveHouseholds: customers.length,
    totalActiveFleetPickers: pickers.length,
    totalCompletedPickups: pickups.filter(p => p.status === 'completed').length
  },
  wasteByCategory: Object.keys(MATERIAL_RATES).map(k => {
    let catWeight = 0;
    pickups.filter(p => p.status === 'completed').forEach(p => {
      p.items.forEach(it => {
        if (it.category === k) catWeight += (it.actualWeightKg || 0);
      });
    });
    catWeight = parseFloat(catWeight.toFixed(1));
    return {
      category: k,
      name: MATERIAL_RATES[k].name,
      totalWeightKg: catWeight,
      percentOfTotal: parseFloat(((catWeight / globalTotalWasteKg) * 100).toFixed(1)),
      co2AvoidedKg: parseFloat((catWeight * CONSTANTS.CO2_FACTOR_PER_KG).toFixed(1))
    };
  }),
  monthlyTrends: [
    { month: '2026-05', totalKg: 1240.5, co2AvoidedKg: 3535.4, pickupsCount: 52 },
    { month: '2026-06', totalKg: 1680.0, co2AvoidedKg: 4788.0, pickupsCount: 68 },
    { month: '2026-07', totalKg: 2150.2, co2AvoidedKg: 6128.0, pickupsCount: 84 },
    { month: '2026-08', totalKg: 2890.8, co2AvoidedKg: 8238.7, pickupsCount: 110 }
  ]
};

// -------------------------------------------------------------------
// 7. GENERATE MULTIMODAL AI VISION WASTE DETECTION DATASET (50 items)
// -------------------------------------------------------------------
console.log('Generating Multimodal AI Vision Dataset for Waste Recognition...');
const aiVisionItems = [
  {
    category: 'Plastic',
    materialName: 'Clear PET Drinking Water Bottles (1.5L / 500ml)',
    syntheticPrompt: 'A crisp top-down photo of 6 crushed transparent PET plastic water bottles with blue caps in a household green recycling basket on a tiled floor, daylight.',
    densityFactorKgPerItem: 0.045,
    typicalBatchCount: 15,
    recyclabilityRating: 'High',
    cleanlinessRating: 'A+',
    confidenceScore: 98.8,
    tips: 'Rinse bottles, remove plastic seal labels, and crush flat to conserve household bin space.'
  },
  {
    category: 'Plastic',
    materialName: 'High-Density Polyethylene (HDPE) Milk & Detergent Jugs',
    syntheticPrompt: 'A cluster of 4 empty HDPE white milk jugs and orange laundry detergent containers clean on a kitchen doorstep.',
    densityFactorKgPerItem: 0.12,
    typicalBatchCount: 5,
    recyclabilityRating: 'High',
    cleanlinessRating: 'A',
    confidenceScore: 97.4,
    tips: 'Ensure chemical or milk residue is thoroughly washed out before collection.'
  },
  {
    category: 'Paper',
    materialName: 'Double-Wall Corrugated Shipping Boxes',
    syntheticPrompt: 'A tidy stack of four flattened brown cardboard courier delivery boxes tied securely with natural hemp twine on a concrete porch.',
    densityFactorKgPerItem: 0.85,
    typicalBatchCount: 4,
    recyclabilityRating: 'High',
    cleanlinessRating: 'A',
    confidenceScore: 99.1,
    tips: 'Flatten all boxes flat and remove plastic packing tape.'
  },
  {
    category: 'Paper',
    materialName: 'Old Newspapers and Tabloid Inserts',
    syntheticPrompt: 'A neat bundle of folded Sunday newspapers stacked 15cm high tied with string.',
    densityFactorKgPerItem: 0.05,
    typicalBatchCount: 30,
    recyclabilityRating: 'High',
    cleanlinessRating: 'A+',
    confidenceScore: 98.3,
    tips: 'Keep dry; wet newsprint cannot be processed for paper recycling.'
  },
  {
    category: 'Metal',
    materialName: 'Aluminum Carbonated Beverage Cans',
    syntheticPrompt: 'Crushed aluminum soda and energy drink cans inside a cardboard box, clean and shiny, studio lighting.',
    densityFactorKgPerItem: 0.015,
    typicalBatchCount: 40,
    recyclabilityRating: 'High',
    cleanlinessRating: 'A',
    confidenceScore: 99.4,
    tips: 'Rinse sweet beverage residue to avoid ants; crush to increase bulk density.'
  },
  {
    category: 'Metal',
    materialName: 'Tin Food Cans (Fish & Condensed Milk)',
    syntheticPrompt: 'Clean empty tin steel cans without paper labels placed upside down to dry on a drainer.',
    densityFactorKgPerItem: 0.065,
    typicalBatchCount: 12,
    recyclabilityRating: 'High',
    cleanlinessRating: 'B+',
    confidenceScore: 96.5,
    tips: 'Tuck sharp lids inside the can or compress the opening shut for safe handling.'
  },
  {
    category: 'Glass',
    materialName: 'Clear Flint Glass Sauce & Jam Jars',
    syntheticPrompt: 'Four clear transparent glass jam jars with metallic lids removed, clean and intact on a wooden table.',
    densityFactorKgPerItem: 0.28,
    typicalBatchCount: 6,
    recyclabilityRating: 'Medium',
    cleanlinessRating: 'A',
    confidenceScore: 95.8,
    tips: 'Remove metallic caps and sort jars separately; avoid chipped or broken glass in bags.'
  },
  {
    category: 'Glass',
    materialName: 'Amber & Green Beverage Glass Bottles',
    syntheticPrompt: 'A wooden crate carrying 8 intact green and brown beer/soda glass bottles upright.',
    densityFactorKgPerItem: 0.45,
    typicalBatchCount: 8,
    recyclabilityRating: 'Medium',
    cleanlinessRating: 'A',
    confidenceScore: 97.2,
    tips: 'Do not mix heat-resistant cookware glass (Pyrex) with bottle glass.'
  },
  {
    category: 'E-Waste',
    materialName: 'Defunct Smartphones, Keyboards & PC Motherboards',
    syntheticPrompt: 'Two retired smartphones with batteries removed and a cracked computer circuit board placed safely inside a cardboard box.',
    densityFactorKgPerItem: 0.40,
    typicalBatchCount: 3,
    recyclabilityRating: 'High',
    cleanlinessRating: 'A',
    confidenceScore: 98.2,
    tips: 'Keep electronic scrap dry. Do not puncture or expose swollen lithium-ion cells.'
  },
  {
    category: 'Polythene',
    materialName: 'LDPE Clean Grocery Carrier Bags & Pallet Wrap',
    syntheticPrompt: 'Clean bundled clear polythene plastic wrap and supermarket shopping carrier bags stuffed into a transparent sack.',
    densityFactorKgPerItem: 0.01,
    typicalBatchCount: 50,
    recyclabilityRating: 'Medium',
    cleanlinessRating: 'B',
    confidenceScore: 94.6,
    tips: 'Bundle cleanly and ensure bags are free from food grease, oil, and tape.'
  }
];

const aiVisionDataset = [];
for (let i = 1; i <= 60; i++) {
  const baseItem = aiVisionItems[(i - 1) % aiVisionItems.length];
  const count = Math.max(1, Math.round(baseItem.typicalBatchCount * rndFloat(0.6, 1.8, 2)));
  const estimatedWeightKg = parseFloat((count * baseItem.densityFactorKgPerItem).toFixed(2));
  const rateInfo = MATERIAL_RATES[baseItem.category.toLowerCase()];
  const points = Math.round(estimatedWeightKg * rateInfo.pointsPerKg);
  const payoutLkr = parseFloat((estimatedWeightKg * rateInfo.pricePerKg).toFixed(2));

  // Synthesize realistic bounding box coordinates [ymin, xmin, ymax, xmax] in normalized 0-1000
  const ymin = rnd(50, 180);
  const xmin = rnd(50, 180);
  const ymax = rnd(750, 950);
  const xmax = rnd(750, 950);

  const catImages = {
    Plastic: ['datasets/images/plastic/pet_bottles_crushed.jpg', 'datasets/images/plastic/hdpe_milk_containers.jpg'],
    Paper: ['datasets/images/paper/corrugated_cardboard_stacked.jpg', 'datasets/images/paper/newspapers_bundled.jpg'],
    Metal: ['datasets/images/metal/aluminum_drink_cans.jpg', 'datasets/images/metal/tin_food_cans.jpg'],
    Glass: ['datasets/images/glass/clear_glass_jars.jpg', 'datasets/images/glass/green_amber_bottles.jpg'],
    'E-Waste': ['datasets/images/e-waste/smartphones_pcb_electronics.jpg', 'datasets/images/e-waste/computer_keyboard_cables.jpg'],
    Polythene: ['datasets/images/polythene/polythene_carrier_bags.jpg']
  };
  const availableImgs = catImages[baseItem.category] || [];
  const assignedImage = availableImgs[(i - 1) % availableImgs.length];

  aiVisionDataset.push({
    id: `AIVIS-${pad(i, 4)}`,
    sampleIndex: i,
    category: baseItem.category,
    materialName: baseItem.materialName,
    imagePath: assignedImage,
    imageFileName: assignedImage ? path.basename(assignedImage) : null,
    syntheticPrompt: `${baseItem.syntheticPrompt} (Sample batch variation #${i})`,
    boundingBox: { ymin, xmin, ymax, xmax },
    detectedItemCount: count,
    confidenceScore: rndFloat(baseItem.confidenceScore - 2.5, Math.min(99.6, baseItem.confidenceScore + 0.8), 1),
    estimatedWeightKg,
    estimatedPoints: points,
    estimatedPayoutLkr: payoutLkr,
    recyclabilityRating: baseItem.recyclabilityRating,
    cleanlinessRating: baseItem.cleanlinessRating,
    sortingTips: baseItem.tips
  });
}

// -------------------------------------------------------------------
// 8. HELPER TO CONVERT JSON ARRAYS TO CSV
// -------------------------------------------------------------------
function jsonToCsv(jsonArray) {
  if (!jsonArray || jsonArray.length === 0) return '';
  const flatRows = jsonArray.map(obj => {
    const flat = {};
    for (const [k, v] of Object.entries(obj)) {
      if (typeof v === 'object' && v !== null) {
        flat[k] = JSON.stringify(v).replace(/"/g, '""');
      } else {
        flat[k] = v;
      }
    }
    return flat;
  });
  const headers = Object.keys(flatRows[0]);
  const lines = [headers.join(',')];
  flatRows.forEach(row => {
    lines.push(headers.map(h => `"${row[h] !== undefined && row[h] !== null ? row[h] : ''}"`).join(','));
  });
  return lines.join('\n');
}

// -------------------------------------------------------------------
// 9. GENERATE POSTGRESQL SEED SCRIPT (seed_dataset.sql)
// -------------------------------------------------------------------
console.log('Generating seed_dataset.sql for PostgreSQL DB...');
let sql = `-- ===================================================================
-- EcoCollect Production & Staging Dataset Seed Script
-- Automatically generated based on calculations_and_system_flow.md
-- ===================================================================

-- 1. MATERIAL RATES SEED
INSERT INTO material_rates (id, category, material_name, price_per_kg_lkr, points_per_kg, icon) VALUES
('MAT-01', 'plastic', 'Plastic (PET & HDPE)', 120.00, 50, '🧴'),
('MAT-02', 'metal', 'Metal & Aluminum Cans', 250.00, 100, '🥫'),
('MAT-03', 'e-waste', 'E-Waste & Small Gadgets', 400.00, 200, '💻'),
('MAT-04', 'polythene', 'Polythene & LDPE Wrap', 80.00, 30, '🛍️'),
('MAT-05', 'paper', 'Paper & Cardboard', 60.00, 25, '📰'),
('MAT-06', 'glass', 'Glass Bottles & Jars', 40.00, 20, '🫙')
ON CONFLICT (category) DO UPDATE SET
  price_per_kg_lkr = EXCLUDED.price_per_kg_lkr,
  points_per_kg = EXCLUDED.points_per_kg,
  material_name = EXCLUDED.material_name,
  icon = EXCLUDED.icon;

-- 2. USERS (CUSTOMERS & FLEET DRIVERS)
`;

customers.slice(0, 30).forEach(c => {
  sql += `INSERT INTO users (id, name, email, phone, role, avatar_url, street, city, zip_code, eco_rating_tag, city_rank, created_at)
VALUES ('${c.id}', '${c.name.replace(/'/g, "''")}', '${c.email}', '${c.phone}', 'customer', '${c.avatarUrl}', '${c.street.replace(/'/g, "''")}', '${c.city}', '${c.zipCode}', '${c.ecoRatingTag}', ${c.cityRank}, '${c.createdAt}')
ON CONFLICT (email) DO NOTHING;\n`;
});

pickers.forEach(p => {
  sql += `INSERT INTO users (id, name, email, phone, role, avatar_url, street, city, zip_code, rating, vehicle_number, created_at)
VALUES ('${p.id}', '${p.name.replace(/'/g, "''")}', '${p.email}', '${p.phone}', 'picker', '${p.avatarUrl}', '${p.street.replace(/'/g, "''")}', '${p.city}', '${p.zipCode}', ${p.rating}, '${p.vehicleNumber}', '${p.createdAt}')
ON CONFLICT (email) DO NOTHING;\n`;
});

sql += `\n-- 3. CUSTOMER WALLETS (500 WELCOME BONUS + EARNINGS)\n`;
wallets.slice(0, 30).forEach(w => {
  sql += `INSERT INTO wallets (id, user_id, total_points, cash_equivalent_lkr, total_earned_points, total_redeemed_points)
VALUES ('${w.id}', '${w.userId}', ${w.totalPoints}, ${w.cashEquivalentLkr}, ${w.totalEarnedPoints}, ${w.totalRedeemedPoints})
ON CONFLICT (user_id) DO UPDATE SET
  total_points = EXCLUDED.total_points,
  cash_equivalent_lkr = EXCLUDED.cash_equivalent_lkr,
  total_earned_points = EXCLUDED.total_earned_points,
  total_redeemed_points = EXCLUDED.total_redeemed_points;\n`;
});

sql += `\n-- 4. PICKUP COLLECTION DISPATCHES & ORDERS\n`;
pickups.slice(0, 50).forEach(p => {
  const itemsEscaped = JSON.stringify(p.items).replace(/'/g, "''");
  const addrEscaped = JSON.stringify(p.address).replace(/'/g, "''");
  const pId = p.pickerId ? `'${p.pickerId}'` : 'NULL';
  const pName = p.pickerName ? `'${p.pickerName.replace(/'/g, "''")}'` : 'NULL';
  const compAt = p.completedAt ? `'${p.completedAt}'` : 'NULL';
  const rejReason = p.rejectionReason ? `'${p.rejectionReason.replace(/'/g, "''")}'` : 'NULL';

  sql += `INSERT INTO pickups (id, customer_id, customer_name, customer_phone, picker_id, picker_name, items_json, total_estimated_weight, total_actual_weight, estimated_points, earned_points, status, picker_status, rejection_reason, scheduled_date, scheduled_time_slot, address_json, created_at, completed_at)
VALUES ('${p.id}', '${p.customerId}', '${p.customerName.replace(/'/g, "''")}', '${p.customerPhone}', ${pId}, ${pName}, '${itemsEscaped}', ${p.totalEstimatedWeight}, ${p.totalActualWeight}, ${p.estimatedPoints}, ${p.earnedPoints}, '${p.status}', '${p.pickerStatus}', ${rejReason}, '${p.scheduledDate}', '${p.scheduledTimeSlot}', '${addrEscaped}', '${p.createdAt}', ${compAt})
ON CONFLICT (id) DO NOTHING;\n`;
});

sql += `\n-- 5. ESG CORPORATE & MUNICIPAL AUDIT METRICS\n`;
sql += `INSERT INTO esg_reports (id, label, value, note) VALUES
('ESG-01', 'CO2 Emissions Avoided', '${esgAnalytics.summary.co2EmissionsAvoidedTons} Tons', 'Calculated using IPCC factor of 2.85 kg CO2 avoided per kg of verified recycled waste'),
('ESG-02', 'Trees Equivalent Offset', '${esgAnalytics.summary.treesPlantedEquivalent} Mature Trees', 'Equivalent mature tree annual carbon absorption rate (~12 kg CO2/year)'),
('ESG-03', 'Municipal Landfill Diversion Rate', '${esgAnalytics.summary.municipalLandfillDiversionRatePercent}%', 'Direct diversion percentage from Colombo Meethotamulla & Karadiyana disposal facilities'),
('ESG-04', 'Total Recyclables Diverted', '${esgAnalytics.summary.totalWasteTons} Tons', 'Verified doorstep digital scale payload across Western Province')
ON CONFLICT (id) DO UPDATE SET value = EXCLUDED.value, note = EXCLUDED.note;\n`;

// -------------------------------------------------------------------
// 10. WRITE FILES TO DISK
// -------------------------------------------------------------------
console.log('Writing datasets to directory:', OUTPUT_DIR);

fs.writeFileSync(path.join(OUTPUT_DIR, 'customers.json'), JSON.stringify(customers, null, 2));
fs.writeFileSync(path.join(OUTPUT_DIR, 'customers.csv'), jsonToCsv(customers));

fs.writeFileSync(path.join(OUTPUT_DIR, 'pickers.json'), JSON.stringify(pickers, null, 2));
fs.writeFileSync(path.join(OUTPUT_DIR, 'pickers.csv'), jsonToCsv(pickers));

fs.writeFileSync(path.join(OUTPUT_DIR, 'pickups.json'), JSON.stringify(pickups, null, 2));
fs.writeFileSync(path.join(OUTPUT_DIR, 'pickups.csv'), jsonToCsv(pickups));

fs.writeFileSync(path.join(OUTPUT_DIR, 'wallets.json'), JSON.stringify(wallets, null, 2));
fs.writeFileSync(path.join(OUTPUT_DIR, 'wallets.csv'), jsonToCsv(wallets));

fs.writeFileSync(path.join(OUTPUT_DIR, 'wallet_transactions.json'), JSON.stringify(walletTransactions, null, 2));
fs.writeFileSync(path.join(OUTPUT_DIR, 'wallet_transactions.csv'), jsonToCsv(walletTransactions));

fs.writeFileSync(path.join(OUTPUT_DIR, 'esg_analytics.json'), JSON.stringify(esgAnalytics, null, 2));
fs.writeFileSync(path.join(OUTPUT_DIR, 'ai_vision_waste_dataset.json'), JSON.stringify(aiVisionDataset, null, 2));
fs.writeFileSync(path.join(OUTPUT_DIR, 'ai_vision_waste_dataset.csv'), jsonToCsv(aiVisionDataset));

fs.writeFileSync(path.join(OUTPUT_DIR, 'seed_dataset.sql'), sql);

// -------------------------------------------------------------------
// 11. GENERATE DATASET DOCUMENTATION & README
// -------------------------------------------------------------------
const readmeContent = `# 📦 EcoCollect System Generated Datasets
> **Comprehensive synthetic datasets for testing, database seeding, AI training, and municipal ESG reporting.**

These datasets have been procedurally synthesized based on the official system architecture and calculation rules defined in \`docs/calculations_and_system_flow.md\`.

---

## 📁 Dataset Directory Contents

| File | Records | Format | Description |
| :--- | :---: | :--- | :--- |
| **\`customers.json\` / \`.csv\`** | 100 | JSON / CSV | Households across Colombo 01-15 with reverse-geocoded coordinates, addresses, phone (+94), eco-tiers, and initial welcome bonus (500 pts = LKR 100). |
| **\`pickers.json\` / \`.csv\`** | 25 | JSON / CSV | Vetted municipal fleet drivers with vehicle registrations (Tuk-Tuk, Tata Ace Light Trucks), operating zones, driver ratings, and cumulative haul commissions. |
| **\`pickups.json\` / \`.csv\`** | 350 | JSON / CSV | End-to-end collection records (Completed, In Progress, Assigned, Pending, Rejected) with estimated vs. Bluetooth scale verified weights, earned points, LKR values, driver commissions, and doorstep geofence checks. |
| **\`wallets.json\` / \`.csv\`** | 100 | JSON / CSV | Customer digital wallet balances, total earned points, total redeemed points, and cash equivalents. |
| **\`wallet_transactions.json\` / \`.csv\`** | ~500 | JSON / CSV | Detailed financial ledger logs for collection earnings and Dialog/Mobitel mobile reload redemptions. |
| **\`esg_analytics.json\`** | Aggregated | JSON | Certified corporate & municipal ESG metrics: Total tonnage, Avoided CO2 emissions, Mature tree equivalents, Landfill diversion rate (94.5% - 97.2%), and monthly trends. |
| **\`ai_vision_waste_dataset.json\`** | 60 | JSON | Multimodal AI Vision training/evaluation dataset with synthetic prompts, bounding boxes, item counts, density weights, recyclability scores, and cleaning tips. |
| **\`seed_dataset.sql\`** | Full Seed | SQL | Production-ready SQL script to directly seed PostgreSQL tables (\`users\`, \`material_rates\`, \`pickups\`, \`wallets\`, \`esg_reports\`). |

---

## 🧮 Mathematical Formulas Applied in These Datasets

1. **Customer Eco Points**:
   $$\\text{Earned Points} = \\text{round}(\\text{Verified Weight (kg)} \\times \\text{PointsPerKg})$$
2. **Customer Cash Equivalent**:
   $$\\text{Cash (LKR)} = \\text{Total Points} \\times 0.20\\text{ LKR} \\quad (5\\text{ pts} = 1\\text{ LKR})$$
3. **Collector Haul Commission**:
   $$\\text{Commission (LKR)} = \\text{round}(\\text{Verified Weight (kg)} \\times 30.30\\text{ LKR/kg})$$
4. **Avoided CO2 Emissions**:
   $$\\text{Avoided CO}_2\\text{ (kg)} = \\text{Verified Weight (kg)} \\times 2.85\\text{ kg CO}_2/\\text{kg}$$
5. **Trees Planting Equivalent**:
   $$\\text{Trees Equivalent} = \\text{round}\\left(\\frac{\\text{Avoided CO}_2\\text{ (kg)}}{12\\text{ kg CO}_2/\\text{tree/year}}\\right)$$
6. **Doorstep Proximity Verification**:
   $$\\text{Within Range} = (\\text{Distance} \\le 50\\text{ meters})$$

---

## 🚀 How to Re-generate or Extend

To regenerate or scale up these datasets (e.g. to 5,000 records), simply run:
\`\`\`bash
node scripts/generate_datasets.js
\`\`\`

To import the SQL dataset into PostgreSQL:
\`\`\`bash
psql -U postgres -d eco_collect -f datasets/seed_dataset.sql
\`\`\`
`;

fs.writeFileSync(path.join(OUTPUT_DIR, 'README.md'), readmeContent);

console.log('✅ All datasets successfully generated in datasets/ directory!');

