# 📦 EcoCollect System Generated Datasets
> **Comprehensive synthetic datasets for testing, database seeding, AI training, and municipal ESG reporting.**

These datasets have been procedurally synthesized based on the official system architecture and calculation rules defined in `docs/calculations_and_system_flow.md`.

---

## 📁 Dataset Directory Contents

| File | Records | Format | Description |
| :--- | :---: | :--- | :--- |
| **`customers.json` / `.csv`** | 100 | JSON / CSV | Households across Colombo 01-15 with reverse-geocoded coordinates, addresses, phone (+94), eco-tiers, and initial welcome bonus (500 pts = LKR 100). |
| **`pickers.json` / `.csv`** | 25 | JSON / CSV | Vetted municipal fleet drivers with vehicle registrations (Tuk-Tuk, Tata Ace Light Trucks), operating zones, driver ratings, and cumulative haul commissions. |
| **`pickups.json` / `.csv`** | 350 | JSON / CSV | End-to-end collection records (Completed, In Progress, Assigned, Pending, Rejected) with estimated vs. Bluetooth scale verified weights, earned points, LKR values, driver commissions, and doorstep geofence checks. |
| **`wallets.json` / `.csv`** | 100 | JSON / CSV | Customer digital wallet balances, total earned points, total redeemed points, and cash equivalents. |
| **`wallet_transactions.json` / `.csv`** | ~500 | JSON / CSV | Detailed financial ledger logs for collection earnings and Dialog/Mobitel mobile reload redemptions. |
| **`esg_analytics.json`** | Aggregated | JSON | Certified corporate & municipal ESG metrics: Total tonnage, Avoided CO2 emissions, Mature tree equivalents, Landfill diversion rate (94.5% - 97.2%), and monthly trends. |
| **`ai_vision_waste_dataset.json` / `.csv`** | 60 | JSON / CSV | Multimodal AI Vision training/evaluation dataset with image file paths, synthetic prompts, bounding boxes, item counts, density weights, recyclability scores, and cleaning tips. |
| **`images/`** | 11+ | JPG / PNG | Curated photographic recyclable waste images organized by category (`plastic/`, `paper/`, `metal/`, `glass/`, `e-waste/`, `polythene/`) for training, evaluation, and mobile app scanner testing. |
| **`seed_dataset.sql`** | Full Seed | SQL | Production-ready SQL script to directly seed PostgreSQL tables (`users`, `material_rates`, `pickups`, `wallets`, `esg_reports`). |

---

## 🧮 Mathematical Formulas Applied in These Datasets

1. **Customer Eco Points**:
   $$\text{Earned Points} = \text{round}(\text{Verified Weight (kg)} \times \text{PointsPerKg})$$
2. **Customer Cash Equivalent**:
   $$\text{Cash (LKR)} = \text{Total Points} \times 0.20\text{ LKR} \quad (5\text{ pts} = 1\text{ LKR})$$
3. **Collector Haul Commission**:
   $$\text{Commission (LKR)} = \text{round}(\text{Verified Weight (kg)} \times 30.30\text{ LKR/kg})$$
4. **Avoided CO2 Emissions**:
   $$\text{Avoided CO}_2\text{ (kg)} = \text{Verified Weight (kg)} \times 2.85\text{ kg CO}_2/\text{kg}$$
5. **Trees Planting Equivalent**:
   $$\text{Trees Equivalent} = \text{round}\left(\frac{\text{Avoided CO}_2\text{ (kg)}}{12\text{ kg CO}_2/\text{tree/year}}\right)$$
6. **Doorstep Proximity Verification**:
   $$\text{Within Range} = (\text{Distance} \le 50\text{ meters})$$

---

## 🚀 How to Re-generate or Extend

To regenerate or scale up these datasets (e.g. to 5,000 records), simply run:
```bash
node scripts/generate_datasets.js
```

To import the SQL dataset into PostgreSQL:
```bash
psql -U postgres -d eco_collect -f datasets/seed_dataset.sql
```
