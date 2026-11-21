-- ===================================================================
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
INSERT INTO users (id, name, email, phone, role, avatar_url, street, city, zip_code, eco_rating_tag, city_rank, created_at)
VALUES ('CUST-0001', 'Dinesh Mendis', 'dinesh.mendis29@gmail.com', '+94 76 210 4200', 'customer', 'https://images.unsplash.com/photo-1530000000001?w=150&auto=format&fit=crop&q=80', '28, Keyzer Street, Pettah', 'Colombo 11', '01100', 'Eco Rookie', 1, '2026-05-15T15:20:01.106Z')
ON CONFLICT (email) DO NOTHING;
INSERT INTO users (id, name, email, phone, role, avatar_url, street, city, zip_code, eco_rating_tag, city_rank, created_at)
VALUES ('CUST-0002', 'Supun de Silva', 'supun.de silva39@gmail.com', '+94 75 824 3603', 'customer', 'https://images.unsplash.com/photo-1530000000002?w=150&auto=format&fit=crop&q=80', '138/A, Sri Jayawardenepura Mw', 'Rajagiriya', '10107', 'Eco Rookie', 2, '2026-05-29T15:20:01.111Z')
ON CONFLICT (email) DO NOTHING;
INSERT INTO users (id, name, email, phone, role, avatar_url, street, city, zip_code, eco_rating_tag, city_rank, created_at)
VALUES ('CUST-0003', 'Nimalee Silva', 'nimalee.silva52@gmail.com', '+94 76 562 2651', 'customer', 'https://images.unsplash.com/photo-1530000000003?w=150&auto=format&fit=crop&q=80', '2, Chatham Street', 'Colombo 01', '00100', 'Eco Rookie', 3, '2026-08-23T15:20:01.112Z')
ON CONFLICT (email) DO NOTHING;
INSERT INTO users (id, name, email, phone, role, avatar_url, street, city, zip_code, eco_rating_tag, city_rank, created_at)
VALUES ('CUST-0004', 'Sachini Rajapaksa', 'sachini.rajapaksa36@gmail.com', '+94 77 839 4611', 'customer', 'https://images.unsplash.com/photo-1530000000004?w=150&auto=format&fit=crop&q=80', '137, Ward Place, Cinnamon Gardens', 'Colombo 07', '00700', 'Eco Rookie', 4, '2026-10-19T15:20:01.112Z')
ON CONFLICT (email) DO NOTHING;
INSERT INTO users (id, name, email, phone, role, avatar_url, street, city, zip_code, eco_rating_tag, city_rank, created_at)
VALUES ('CUST-0005', 'Chamari Abeysekera', 'chamari.abeysekera96@gmail.com', '+94 76 991 8937', 'customer', 'https://images.unsplash.com/photo-1530000000005?w=150&auto=format&fit=crop&q=80', '138, Hotel Road', 'Mount Lavinia', '10370', 'Eco Rookie', 5, '2026-05-28T15:20:01.112Z')
ON CONFLICT (email) DO NOTHING;
INSERT INTO users (id, name, email, phone, role, avatar_url, street, city, zip_code, eco_rating_tag, city_rank, created_at)
VALUES ('CUST-0006', 'Lahiru Wijesinghe', 'lahiru.wijesinghe71@gmail.com', '+94 76 868 7731', 'customer', 'https://images.unsplash.com/photo-1530000000006?w=150&auto=format&fit=crop&q=80', '46/B, Havelock Road', 'Colombo 05', '00500', 'Eco Rookie', 6, '2026-08-29T15:20:01.112Z')
ON CONFLICT (email) DO NOTHING;
INSERT INTO users (id, name, email, phone, role, avatar_url, street, city, zip_code, eco_rating_tag, city_rank, created_at)
VALUES ('CUST-0007', 'Amila Gunasekara', 'amila.gunasekara72@gmail.com', '+94 71 430 7624', 'customer', 'https://images.unsplash.com/photo-1530000000007?w=150&auto=format&fit=crop&q=80', '28, High Level Road', 'Nugegoda', '10250', 'Eco Rookie', 7, '2026-10-04T15:20:01.112Z')
ON CONFLICT (email) DO NOTHING;
INSERT INTO users (id, name, email, phone, role, avatar_url, street, city, zip_code, eco_rating_tag, city_rank, created_at)
VALUES ('CUST-0008', 'Nalaka de Silva', 'nalaka.de silva79@gmail.com', '+94 72 576 8415', 'customer', 'https://images.unsplash.com/photo-1530000000008?w=150&auto=format&fit=crop&q=80', '127, High Level Road', 'Nugegoda', '10250', 'Eco Rookie', 8, '2026-06-27T15:20:01.112Z')
ON CONFLICT (email) DO NOTHING;
INSERT INTO users (id, name, email, phone, role, avatar_url, street, city, zip_code, eco_rating_tag, city_rank, created_at)
VALUES ('CUST-0009', 'Shalika Senanayake', 'shalika.senanayake97@gmail.com', '+94 78 726 3353', 'customer', 'https://images.unsplash.com/photo-1530000000009?w=150&auto=format&fit=crop&q=80', '91, Keyzer Street, Pettah', 'Colombo 11', '01100', 'Eco Rookie', 9, '2026-07-17T15:20:01.112Z')
ON CONFLICT (email) DO NOTHING;
INSERT INTO users (id, name, email, phone, role, avatar_url, street, city, zip_code, eco_rating_tag, city_rank, created_at)
VALUES ('CUST-0010', 'Priyanka Wickramasinghe', 'priyanka.wickramasinghe99@gmail.com', '+94 74 390 1653', 'customer', 'https://images.unsplash.com/photo-1530000000010?w=150&auto=format&fit=crop&q=80', '16, Dean''s Road, Maradana', 'Colombo 10', '01000', 'Eco Rookie', 10, '2026-07-08T15:20:01.112Z')
ON CONFLICT (email) DO NOTHING;
INSERT INTO users (id, name, email, phone, role, avatar_url, street, city, zip_code, eco_rating_tag, city_rank, created_at)
VALUES ('CUST-0011', 'Supun Fernando', 'supun.fernando50@gmail.com', '+94 70 789 1181', 'customer', 'https://images.unsplash.com/photo-1530000000011?w=150&auto=format&fit=crop&q=80', '113, Station Road', 'Dehiwala', '10350', 'Eco Rookie', 11, '2026-06-28T15:20:01.112Z')
ON CONFLICT (email) DO NOTHING;
INSERT INTO users (id, name, email, phone, role, avatar_url, street, city, zip_code, eco_rating_tag, city_rank, created_at)
VALUES ('CUST-0012', 'Buddhika Mendis', 'buddhika.mendis73@gmail.com', '+94 75 388 3402', 'customer', 'https://images.unsplash.com/photo-1530000000012?w=150&auto=format&fit=crop&q=80', '101, Dean''s Road, Maradana', 'Colombo 10', '01000', 'Eco Rookie', 12, '2026-08-21T15:20:01.112Z')
ON CONFLICT (email) DO NOTHING;
INSERT INTO users (id, name, email, phone, role, avatar_url, street, city, zip_code, eco_rating_tag, city_rank, created_at)
VALUES ('CUST-0013', 'Dinesh Gunasekara', 'dinesh.gunasekara11@gmail.com', '+94 72 242 4853', 'customer', 'https://images.unsplash.com/photo-1530000000013?w=150&auto=format&fit=crop&q=80', '146, Havelock Road', 'Colombo 05', '00500', 'Eco Rookie', 13, '2026-08-26T15:20:01.112Z')
ON CONFLICT (email) DO NOTHING;
INSERT INTO users (id, name, email, phone, role, avatar_url, street, city, zip_code, eco_rating_tag, city_rank, created_at)
VALUES ('CUST-0014', 'Supun de Silva', 'supun.de silva53@gmail.com', '+94 71 245 4506', 'customer', 'https://images.unsplash.com/photo-1530000000014?w=150&auto=format&fit=crop&q=80', '121, Chatham Street', 'Colombo 01', '00100', 'Eco Rookie', 14, '2026-10-19T15:20:01.112Z')
ON CONFLICT (email) DO NOTHING;
INSERT INTO users (id, name, email, phone, role, avatar_url, street, city, zip_code, eco_rating_tag, city_rank, created_at)
VALUES ('CUST-0015', 'Shalika Mendis', 'shalika.mendis91@gmail.com', '+94 71 794 9335', 'customer', 'https://images.unsplash.com/photo-1530000000015?w=150&auto=format&fit=crop&q=80', '4, Duplication Road, Bambalapitiya', 'Colombo 04', '00400', 'Eco Rookie', 15, '2026-09-06T15:20:01.112Z')
ON CONFLICT (email) DO NOTHING;
INSERT INTO users (id, name, email, phone, role, avatar_url, street, city, zip_code, eco_rating_tag, city_rank, created_at)
VALUES ('CUST-0016', 'Shalika Rajapaksa', 'shalika.rajapaksa73@gmail.com', '+94 76 933 4340', 'customer', 'https://images.unsplash.com/photo-1530000000016?w=150&auto=format&fit=crop&q=80', '37, Kotahena Street', 'Colombo 13', '01300', 'Eco Rookie', 16, '2026-09-15T15:20:01.112Z')
ON CONFLICT (email) DO NOTHING;
INSERT INTO users (id, name, email, phone, role, avatar_url, street, city, zip_code, eco_rating_tag, city_rank, created_at)
VALUES ('CUST-0017', 'Priyanka Alwis', 'priyanka.alwis36@gmail.com', '+94 72 290 1589', 'customer', 'https://images.unsplash.com/photo-1530000000017?w=150&auto=format&fit=crop&q=80', '5, Chatham Street', 'Colombo 01', '00100', 'Eco Rookie', 17, '2026-09-11T15:20:01.112Z')
ON CONFLICT (email) DO NOTHING;
INSERT INTO users (id, name, email, phone, role, avatar_url, street, city, zip_code, eco_rating_tag, city_rank, created_at)
VALUES ('CUST-0018', 'Nimalee Hettiarachchi', 'nimalee.hettiarachchi41@gmail.com', '+94 75 617 4967', 'customer', 'https://images.unsplash.com/photo-1530000000018?w=150&auto=format&fit=crop&q=80', '125, Station Road', 'Dehiwala', '10350', 'Eco Rookie', 18, '2026-06-27T15:20:01.112Z')
ON CONFLICT (email) DO NOTHING;
INSERT INTO users (id, name, email, phone, role, avatar_url, street, city, zip_code, eco_rating_tag, city_rank, created_at)
VALUES ('CUST-0019', 'Gayani Dissanayake', 'gayani.dissanayake97@gmail.com', '+94 72 574 1133', 'customer', 'https://images.unsplash.com/photo-1530000000019?w=150&auto=format&fit=crop&q=80', '32, Vauxhall Street', 'Colombo 02', '00200', 'Eco Rookie', 19, '2026-08-22T15:20:01.112Z')
ON CONFLICT (email) DO NOTHING;
INSERT INTO users (id, name, email, phone, role, avatar_url, street, city, zip_code, eco_rating_tag, city_rank, created_at)
VALUES ('CUST-0020', 'Thisara Wickramasinghe', 'thisara.wickramasinghe23@gmail.com', '+94 71 451 1457', 'customer', 'https://images.unsplash.com/photo-1530000000020?w=150&auto=format&fit=crop&q=80', '12/B, W.A. Silva Mawatha, Wellawatte', 'Colombo 06', '00600', 'Eco Rookie', 20, '2026-09-08T15:20:01.112Z')
ON CONFLICT (email) DO NOTHING;
INSERT INTO users (id, name, email, phone, role, avatar_url, street, city, zip_code, eco_rating_tag, city_rank, created_at)
VALUES ('CUST-0021', 'Dilshan Jayasinghe', 'dilshan.jayasinghe14@gmail.com', '+94 72 679 6258', 'customer', 'https://images.unsplash.com/photo-1530000000021?w=150&auto=format&fit=crop&q=80', '113/A, Sri Jayawardenepura Mw', 'Rajagiriya', '10107', 'Green Warrior', 21, '2026-06-24T15:20:01.112Z')
ON CONFLICT (email) DO NOTHING;
INSERT INTO users (id, name, email, phone, role, avatar_url, street, city, zip_code, eco_rating_tag, city_rank, created_at)
VALUES ('CUST-0022', 'Gayani Jayasinghe', 'gayani.jayasinghe15@gmail.com', '+94 77 242 7438', 'customer', 'https://images.unsplash.com/photo-1530000000022?w=150&auto=format&fit=crop&q=80', '93, Hotel Road', 'Mount Lavinia', '10370', 'Green Warrior', 22, '2026-05-25T15:20:01.112Z')
ON CONFLICT (email) DO NOTHING;
INSERT INTO users (id, name, email, phone, role, avatar_url, street, city, zip_code, eco_rating_tag, city_rank, created_at)
VALUES ('CUST-0023', 'Dilshan Dissanayake', 'dilshan.dissanayake81@gmail.com', '+94 74 147 4370', 'customer', 'https://images.unsplash.com/photo-1530000000023?w=150&auto=format&fit=crop&q=80', '131/A, Hotel Road', 'Mount Lavinia', '10370', 'Green Warrior', 23, '2026-09-06T15:20:01.112Z')
ON CONFLICT (email) DO NOTHING;
INSERT INTO users (id, name, email, phone, role, avatar_url, street, city, zip_code, eco_rating_tag, city_rank, created_at)
VALUES ('CUST-0024', 'Damith Fernando', 'damith.fernando26@gmail.com', '+94 72 850 8801', 'customer', 'https://images.unsplash.com/photo-1530000000024?w=150&auto=format&fit=crop&q=80', '29, Duplication Road, Bambalapitiya', 'Colombo 04', '00400', 'Green Warrior', 24, '2026-10-02T15:20:01.112Z')
ON CONFLICT (email) DO NOTHING;
INSERT INTO users (id, name, email, phone, role, avatar_url, street, city, zip_code, eco_rating_tag, city_rank, created_at)
VALUES ('CUST-0025', 'Ruwan Perera', 'ruwan.perera95@gmail.com', '+94 78 773 1142', 'customer', 'https://images.unsplash.com/photo-1530000000025?w=150&auto=format&fit=crop&q=80', '86, W.A. Silva Mawatha, Wellawatte', 'Colombo 06', '00600', 'Green Warrior', 25, '2026-08-23T15:20:01.112Z')
ON CONFLICT (email) DO NOTHING;
INSERT INTO users (id, name, email, phone, role, avatar_url, street, city, zip_code, eco_rating_tag, city_rank, created_at)
VALUES ('CUST-0026', 'Malith Rathnayake', 'malith.rathnayake40@gmail.com', '+94 74 594 1635', 'customer', 'https://images.unsplash.com/photo-1530000000026?w=150&auto=format&fit=crop&q=80', '46, Chatham Street', 'Colombo 01', '00100', 'Green Warrior', 26, '2026-07-18T15:20:01.112Z')
ON CONFLICT (email) DO NOTHING;
INSERT INTO users (id, name, email, phone, role, avatar_url, street, city, zip_code, eco_rating_tag, city_rank, created_at)
VALUES ('CUST-0027', 'Kasun Alwis', 'kasun.alwis99@gmail.com', '+94 75 199 4953', 'customer', 'https://images.unsplash.com/photo-1530000000027?w=150&auto=format&fit=crop&q=80', '106, Havelock Road', 'Colombo 05', '00500', 'Green Warrior', 27, '2026-08-28T15:20:01.112Z')
ON CONFLICT (email) DO NOTHING;
INSERT INTO users (id, name, email, phone, role, avatar_url, street, city, zip_code, eco_rating_tag, city_rank, created_at)
VALUES ('CUST-0028', 'Amila Jayawardena', 'amila.jayawardena78@gmail.com', '+94 74 494 8429', 'customer', 'https://images.unsplash.com/photo-1530000000028?w=150&auto=format&fit=crop&q=80', '121, Duplication Road, Bambalapitiya', 'Colombo 04', '00400', 'Green Warrior', 28, '2026-09-04T15:20:01.112Z')
ON CONFLICT (email) DO NOTHING;
INSERT INTO users (id, name, email, phone, role, avatar_url, street, city, zip_code, eco_rating_tag, city_rank, created_at)
VALUES ('CUST-0029', 'Supun Wickramasinghe', 'supun.wickramasinghe74@gmail.com', '+94 70 308 5426', 'customer', 'https://images.unsplash.com/photo-1530000000029?w=150&auto=format&fit=crop&q=80', '94, W.A. Silva Mawatha, Wellawatte', 'Colombo 06', '00600', 'Green Warrior', 29, '2026-07-28T15:20:01.112Z')
ON CONFLICT (email) DO NOTHING;
INSERT INTO users (id, name, email, phone, role, avatar_url, street, city, zip_code, eco_rating_tag, city_rank, created_at)
VALUES ('CUST-0030', 'Sachini Samarasinghe', 'sachini.samarasinghe18@gmail.com', '+94 78 412 6820', 'customer', 'https://images.unsplash.com/photo-1530000000030?w=150&auto=format&fit=crop&q=80', '6, Ward Place, Cinnamon Gardens', 'Colombo 07', '00700', 'Green Warrior', 30, '2026-09-13T15:20:01.112Z')
ON CONFLICT (email) DO NOTHING;
INSERT INTO users (id, name, email, phone, role, avatar_url, street, city, zip_code, rating, vehicle_number, created_at)
VALUES ('PICK-001', 'Kasun Rathnayake', 'kasun.rathnayake@ecocollect.lk', '+94 71 780 1901', 'picker', 'https://images.unsplash.com/photo-1570000000001?w=150&auto=format&fit=crop&q=80', '48, Fleet Depot Road', 'Colombo 05', '00500', 4.8, 'WP AB-7129', '2026-07-14T15:20:01.113Z')
ON CONFLICT (email) DO NOTHING;
INSERT INTO users (id, name, email, phone, role, avatar_url, street, city, zip_code, rating, vehicle_number, created_at)
VALUES ('PICK-002', 'Nuwan Alwis', 'nuwan.alwis@ecocollect.lk', '+94 71 411 1544', 'picker', 'https://images.unsplash.com/photo-1570000000002?w=150&auto=format&fit=crop&q=80', '50, Fleet Depot Road', 'Dehiwala', '10350', 4.9, 'WP DA-1489', '2026-09-01T15:20:01.113Z')
ON CONFLICT (email) DO NOTHING;
INSERT INTO users (id, name, email, phone, role, avatar_url, street, city, zip_code, rating, vehicle_number, created_at)
VALUES ('PICK-003', 'Dilshan Bandara', 'dilshan.bandara@ecocollect.lk', '+94 71 453 7132', 'picker', 'https://images.unsplash.com/photo-1570000000003?w=150&auto=format&fit=crop&q=80', '23, Fleet Depot Road', 'Nugegoda', '10250', 4.7, 'WP AA-5096', '2026-08-18T15:20:01.113Z')
ON CONFLICT (email) DO NOTHING;
INSERT INTO users (id, name, email, phone, role, avatar_url, street, city, zip_code, rating, vehicle_number, created_at)
VALUES ('PICK-004', 'Gayani Jayasinghe', 'gayani.jayasinghe@ecocollect.lk', '+94 71 209 2103', 'picker', 'https://images.unsplash.com/photo-1570000000004?w=150&auto=format&fit=crop&q=80', '70, Fleet Depot Road', 'Colombo 08', '00800', 4.7, 'WP DA-9389', '2026-03-21T15:20:01.113Z')
ON CONFLICT (email) DO NOTHING;
INSERT INTO users (id, name, email, phone, role, avatar_url, street, city, zip_code, rating, vehicle_number, created_at)
VALUES ('PICK-005', 'Kaveen Mendis', 'kaveen.mendis@ecocollect.lk', '+94 71 758 3856', 'picker', 'https://images.unsplash.com/photo-1570000000005?w=150&auto=format&fit=crop&q=80', '23, Fleet Depot Road', 'Colombo 10', '01000', 4.9, 'WP DB-3336', '2026-03-14T15:20:01.113Z')
ON CONFLICT (email) DO NOTHING;
INSERT INTO users (id, name, email, phone, role, avatar_url, street, city, zip_code, rating, vehicle_number, created_at)
VALUES ('PICK-006', 'Kasun Wickramasinghe', 'kasun.wickramasinghe@ecocollect.lk', '+94 71 640 9232', 'picker', 'https://images.unsplash.com/photo-1570000000006?w=150&auto=format&fit=crop&q=80', '45, Fleet Depot Road', 'Colombo 11', '01100', 5, 'WP DB-5752', '2026-06-26T15:20:01.113Z')
ON CONFLICT (email) DO NOTHING;
INSERT INTO users (id, name, email, phone, role, avatar_url, street, city, zip_code, rating, vehicle_number, created_at)
VALUES ('PICK-007', 'Malith Dissanayake', 'malith.dissanayake@ecocollect.lk', '+94 71 892 6645', 'picker', 'https://images.unsplash.com/photo-1570000000007?w=150&auto=format&fit=crop&q=80', '66, Fleet Depot Road', 'Colombo 05', '00500', 4.9, 'WP AB-2159', '2026-07-04T15:20:01.113Z')
ON CONFLICT (email) DO NOTHING;
INSERT INTO users (id, name, email, phone, role, avatar_url, street, city, zip_code, rating, vehicle_number, created_at)
VALUES ('PICK-008', 'Lakshan Jayasinghe', 'lakshan.jayasinghe@ecocollect.lk', '+94 71 754 4760', 'picker', 'https://images.unsplash.com/photo-1570000000008?w=150&auto=format&fit=crop&q=80', '36, Fleet Depot Road', 'Colombo 07', '00700', 4.8, 'WP AB-5027', '2026-08-07T15:20:01.113Z')
ON CONFLICT (email) DO NOTHING;
INSERT INTO users (id, name, email, phone, role, avatar_url, street, city, zip_code, rating, vehicle_number, created_at)
VALUES ('PICK-009', 'Shalika Samarasinghe', 'shalika.samarasinghe@ecocollect.lk', '+94 71 534 8841', 'picker', 'https://images.unsplash.com/photo-1570000000009?w=150&auto=format&fit=crop&q=80', '74, Fleet Depot Road', 'Colombo 11', '01100', 5, 'WP DA-6006', '2026-03-22T15:20:01.113Z')
ON CONFLICT (email) DO NOTHING;
INSERT INTO users (id, name, email, phone, role, avatar_url, street, city, zip_code, rating, vehicle_number, created_at)
VALUES ('PICK-010', 'Priyanka Alwis', 'priyanka.alwis@ecocollect.lk', '+94 71 545 2684', 'picker', 'https://images.unsplash.com/photo-1570000000010?w=150&auto=format&fit=crop&q=80', '63, Fleet Depot Road', 'Colombo 11', '01100', 4.8, 'WP DB-6481', '2026-06-02T15:20:01.113Z')
ON CONFLICT (email) DO NOTHING;
INSERT INTO users (id, name, email, phone, role, avatar_url, street, city, zip_code, rating, vehicle_number, created_at)
VALUES ('PICK-011', 'Dinesh Karunaratne', 'dinesh.karunaratne@ecocollect.lk', '+94 71 672 2014', 'picker', 'https://images.unsplash.com/photo-1570000000011?w=150&auto=format&fit=crop&q=80', '31, Fleet Depot Road', 'Colombo 07', '00700', 4.8, 'WP DB-3979', '2026-07-22T15:20:01.113Z')
ON CONFLICT (email) DO NOTHING;
INSERT INTO users (id, name, email, phone, role, avatar_url, street, city, zip_code, rating, vehicle_number, created_at)
VALUES ('PICK-012', 'Nimalee Rathnayake', 'nimalee.rathnayake@ecocollect.lk', '+94 71 556 6423', 'picker', 'https://images.unsplash.com/photo-1570000000012?w=150&auto=format&fit=crop&q=80', '38, Fleet Depot Road', 'Colombo 02', '00200', 4.7, 'WP DB-8085', '2026-08-21T15:20:01.113Z')
ON CONFLICT (email) DO NOTHING;
INSERT INTO users (id, name, email, phone, role, avatar_url, street, city, zip_code, rating, vehicle_number, created_at)
VALUES ('PICK-013', 'Nuwan Silva', 'nuwan.silva@ecocollect.lk', '+94 71 674 9984', 'picker', 'https://images.unsplash.com/photo-1570000000013?w=150&auto=format&fit=crop&q=80', '80, Fleet Depot Road', 'Dehiwala', '10350', 4.7, 'WP DB-5969', '2026-06-29T15:20:01.113Z')
ON CONFLICT (email) DO NOTHING;
INSERT INTO users (id, name, email, phone, role, avatar_url, street, city, zip_code, rating, vehicle_number, created_at)
VALUES ('PICK-014', 'Chamari Wijesinghe', 'chamari.wijesinghe@ecocollect.lk', '+94 71 870 6967', 'picker', 'https://images.unsplash.com/photo-1570000000014?w=150&auto=format&fit=crop&q=80', '72, Fleet Depot Road', 'Colombo 02', '00200', 4.7, 'WP AB-3881', '2026-08-01T15:20:01.113Z')
ON CONFLICT (email) DO NOTHING;
INSERT INTO users (id, name, email, phone, role, avatar_url, street, city, zip_code, rating, vehicle_number, created_at)
VALUES ('PICK-015', 'Thisara Wijesinghe', 'thisara.wijesinghe@ecocollect.lk', '+94 71 737 5667', 'picker', 'https://images.unsplash.com/photo-1570000000015?w=150&auto=format&fit=crop&q=80', '62, Fleet Depot Road', 'Colombo 04', '00400', 4.8, 'WP AA-5836', '2026-07-09T15:20:01.113Z')
ON CONFLICT (email) DO NOTHING;
INSERT INTO users (id, name, email, phone, role, avatar_url, street, city, zip_code, rating, vehicle_number, created_at)
VALUES ('PICK-016', 'Shenali Alwis', 'shenali.alwis@ecocollect.lk', '+94 71 281 1702', 'picker', 'https://images.unsplash.com/photo-1570000000016?w=150&auto=format&fit=crop&q=80', '54, Fleet Depot Road', 'Nugegoda', '10250', 5, 'WP DB-9115', '2026-09-06T15:20:01.113Z')
ON CONFLICT (email) DO NOTHING;
INSERT INTO users (id, name, email, phone, role, avatar_url, street, city, zip_code, rating, vehicle_number, created_at)
VALUES ('PICK-017', 'Thisara Wickramasinghe', 'thisara.wickramasinghe@ecocollect.lk', '+94 71 514 1974', 'picker', 'https://images.unsplash.com/photo-1570000000017?w=150&auto=format&fit=crop&q=80', '62, Fleet Depot Road', 'Dehiwala', '10350', 4.7, 'WP AB-5712', '2026-06-07T15:20:01.113Z')
ON CONFLICT (email) DO NOTHING;
INSERT INTO users (id, name, email, phone, role, avatar_url, street, city, zip_code, rating, vehicle_number, created_at)
VALUES ('PICK-018', 'Nalaka Gunasekara', 'nalaka.gunasekara@ecocollect.lk', '+94 71 896 8092', 'picker', 'https://images.unsplash.com/photo-1570000000018?w=150&auto=format&fit=crop&q=80', '36, Fleet Depot Road', 'Colombo 05', '00500', 5, 'WP DA-7163', '2026-05-02T15:20:01.113Z')
ON CONFLICT (email) DO NOTHING;
INSERT INTO users (id, name, email, phone, role, avatar_url, street, city, zip_code, rating, vehicle_number, created_at)
VALUES ('PICK-019', 'Malith Bandara', 'malith.bandara@ecocollect.lk', '+94 71 695 9320', 'picker', 'https://images.unsplash.com/photo-1570000000019?w=150&auto=format&fit=crop&q=80', '31, Fleet Depot Road', 'Mount Lavinia', '10370', 4.8, 'WP DB-4333', '2026-07-01T15:20:01.113Z')
ON CONFLICT (email) DO NOTHING;
INSERT INTO users (id, name, email, phone, role, avatar_url, street, city, zip_code, rating, vehicle_number, created_at)
VALUES ('PICK-020', 'Lahiru Senanayake', 'lahiru.senanayake@ecocollect.lk', '+94 71 510 5246', 'picker', 'https://images.unsplash.com/photo-1570000000020?w=150&auto=format&fit=crop&q=80', '60, Fleet Depot Road', 'Colombo 01', '00100', 4.8, 'WP AA-9899', '2026-06-27T15:20:01.113Z')
ON CONFLICT (email) DO NOTHING;
INSERT INTO users (id, name, email, phone, role, avatar_url, street, city, zip_code, rating, vehicle_number, created_at)
VALUES ('PICK-021', 'Nuwan Mendis', 'nuwan.mendis@ecocollect.lk', '+94 71 230 7352', 'picker', 'https://images.unsplash.com/photo-1570000000021?w=150&auto=format&fit=crop&q=80', '63, Fleet Depot Road', 'Colombo 03', '00300', 4.8, 'WP DB-4599', '2026-04-17T15:20:01.113Z')
ON CONFLICT (email) DO NOTHING;
INSERT INTO users (id, name, email, phone, role, avatar_url, street, city, zip_code, rating, vehicle_number, created_at)
VALUES ('PICK-022', 'Buddhika de Silva', 'buddhika.de silva@ecocollect.lk', '+94 71 252 7185', 'picker', 'https://images.unsplash.com/photo-1570000000022?w=150&auto=format&fit=crop&q=80', '69, Fleet Depot Road', 'Colombo 05', '00500', 4.7, 'WP AA-3162', '2026-08-26T15:20:01.113Z')
ON CONFLICT (email) DO NOTHING;
INSERT INTO users (id, name, email, phone, role, avatar_url, street, city, zip_code, rating, vehicle_number, created_at)
VALUES ('PICK-023', 'Buddhika Perera', 'buddhika.perera@ecocollect.lk', '+94 71 773 3050', 'picker', 'https://images.unsplash.com/photo-1570000000023?w=150&auto=format&fit=crop&q=80', '43, Fleet Depot Road', 'Dehiwala', '10350', 4.9, 'WP DB-1515', '2026-03-15T15:20:01.113Z')
ON CONFLICT (email) DO NOTHING;
INSERT INTO users (id, name, email, phone, role, avatar_url, street, city, zip_code, rating, vehicle_number, created_at)
VALUES ('PICK-024', 'Harshana Jayasinghe', 'harshana.jayasinghe@ecocollect.lk', '+94 71 221 9176', 'picker', 'https://images.unsplash.com/photo-1570000000024?w=150&auto=format&fit=crop&q=80', '80, Fleet Depot Road', 'Colombo 01', '00100', 4.8, 'WP AA-6752', '2026-07-29T15:20:01.113Z')
ON CONFLICT (email) DO NOTHING;
INSERT INTO users (id, name, email, phone, role, avatar_url, street, city, zip_code, rating, vehicle_number, created_at)
VALUES ('PICK-025', 'Damith Bandara', 'damith.bandara@ecocollect.lk', '+94 71 207 5322', 'picker', 'https://images.unsplash.com/photo-1570000000025?w=150&auto=format&fit=crop&q=80', '46, Fleet Depot Road', 'Colombo 03', '00300', 4.9, 'WP DA-5445', '2026-03-27T15:20:01.113Z')
ON CONFLICT (email) DO NOTHING;

-- 3. CUSTOMER WALLETS (500 WELCOME BONUS + EARNINGS)
INSERT INTO wallets (id, user_id, total_points, cash_equivalent_lkr, total_earned_points, total_redeemed_points)
VALUES ('WAL-0001', 'CUST-0001', 5590, 1118, 6340, 750)
ON CONFLICT (user_id) DO UPDATE SET
  total_points = EXCLUDED.total_points,
  cash_equivalent_lkr = EXCLUDED.cash_equivalent_lkr,
  total_earned_points = EXCLUDED.total_earned_points,
  total_redeemed_points = EXCLUDED.total_redeemed_points;
INSERT INTO wallets (id, user_id, total_points, cash_equivalent_lkr, total_earned_points, total_redeemed_points)
VALUES ('WAL-0002', 'CUST-0002', 5022, 1004.4, 6022, 1000)
ON CONFLICT (user_id) DO UPDATE SET
  total_points = EXCLUDED.total_points,
  cash_equivalent_lkr = EXCLUDED.cash_equivalent_lkr,
  total_earned_points = EXCLUDED.total_earned_points,
  total_redeemed_points = EXCLUDED.total_redeemed_points;
INSERT INTO wallets (id, user_id, total_points, cash_equivalent_lkr, total_earned_points, total_redeemed_points)
VALUES ('WAL-0003', 'CUST-0003', 1232, 246.4, 2732, 1500)
ON CONFLICT (user_id) DO UPDATE SET
  total_points = EXCLUDED.total_points,
  cash_equivalent_lkr = EXCLUDED.cash_equivalent_lkr,
  total_earned_points = EXCLUDED.total_earned_points,
  total_redeemed_points = EXCLUDED.total_redeemed_points;
INSERT INTO wallets (id, user_id, total_points, cash_equivalent_lkr, total_earned_points, total_redeemed_points)
VALUES ('WAL-0004', 'CUST-0004', 2330, 466, 2830, 500)
ON CONFLICT (user_id) DO UPDATE SET
  total_points = EXCLUDED.total_points,
  cash_equivalent_lkr = EXCLUDED.cash_equivalent_lkr,
  total_earned_points = EXCLUDED.total_earned_points,
  total_redeemed_points = EXCLUDED.total_redeemed_points;
INSERT INTO wallets (id, user_id, total_points, cash_equivalent_lkr, total_earned_points, total_redeemed_points)
VALUES ('WAL-0005', 'CUST-0005', 2710, 542, 3210, 500)
ON CONFLICT (user_id) DO UPDATE SET
  total_points = EXCLUDED.total_points,
  cash_equivalent_lkr = EXCLUDED.cash_equivalent_lkr,
  total_earned_points = EXCLUDED.total_earned_points,
  total_redeemed_points = EXCLUDED.total_redeemed_points;
INSERT INTO wallets (id, user_id, total_points, cash_equivalent_lkr, total_earned_points, total_redeemed_points)
VALUES ('WAL-0006', 'CUST-0006', 4455, 891, 4705, 250)
ON CONFLICT (user_id) DO UPDATE SET
  total_points = EXCLUDED.total_points,
  cash_equivalent_lkr = EXCLUDED.cash_equivalent_lkr,
  total_earned_points = EXCLUDED.total_earned_points,
  total_redeemed_points = EXCLUDED.total_redeemed_points;
INSERT INTO wallets (id, user_id, total_points, cash_equivalent_lkr, total_earned_points, total_redeemed_points)
VALUES ('WAL-0007', 'CUST-0007', 2591, 518.2, 3591, 1000)
ON CONFLICT (user_id) DO UPDATE SET
  total_points = EXCLUDED.total_points,
  cash_equivalent_lkr = EXCLUDED.cash_equivalent_lkr,
  total_earned_points = EXCLUDED.total_earned_points,
  total_redeemed_points = EXCLUDED.total_redeemed_points;
INSERT INTO wallets (id, user_id, total_points, cash_equivalent_lkr, total_earned_points, total_redeemed_points)
VALUES ('WAL-0008', 'CUST-0008', 500, 100, 500, 0)
ON CONFLICT (user_id) DO UPDATE SET
  total_points = EXCLUDED.total_points,
  cash_equivalent_lkr = EXCLUDED.cash_equivalent_lkr,
  total_earned_points = EXCLUDED.total_earned_points,
  total_redeemed_points = EXCLUDED.total_redeemed_points;
INSERT INTO wallets (id, user_id, total_points, cash_equivalent_lkr, total_earned_points, total_redeemed_points)
VALUES ('WAL-0009', 'CUST-0009', 514, 102.8, 2014, 1500)
ON CONFLICT (user_id) DO UPDATE SET
  total_points = EXCLUDED.total_points,
  cash_equivalent_lkr = EXCLUDED.cash_equivalent_lkr,
  total_earned_points = EXCLUDED.total_earned_points,
  total_redeemed_points = EXCLUDED.total_redeemed_points;
INSERT INTO wallets (id, user_id, total_points, cash_equivalent_lkr, total_earned_points, total_redeemed_points)
VALUES ('WAL-0010', 'CUST-0010', 1987, 397.4, 2487, 500)
ON CONFLICT (user_id) DO UPDATE SET
  total_points = EXCLUDED.total_points,
  cash_equivalent_lkr = EXCLUDED.cash_equivalent_lkr,
  total_earned_points = EXCLUDED.total_earned_points,
  total_redeemed_points = EXCLUDED.total_redeemed_points;
INSERT INTO wallets (id, user_id, total_points, cash_equivalent_lkr, total_earned_points, total_redeemed_points)
VALUES ('WAL-0011', 'CUST-0011', 600, 120, 600, 0)
ON CONFLICT (user_id) DO UPDATE SET
  total_points = EXCLUDED.total_points,
  cash_equivalent_lkr = EXCLUDED.cash_equivalent_lkr,
  total_earned_points = EXCLUDED.total_earned_points,
  total_redeemed_points = EXCLUDED.total_redeemed_points;
INSERT INTO wallets (id, user_id, total_points, cash_equivalent_lkr, total_earned_points, total_redeemed_points)
VALUES ('WAL-0012', 'CUST-0012', 1278, 255.6, 1528, 250)
ON CONFLICT (user_id) DO UPDATE SET
  total_points = EXCLUDED.total_points,
  cash_equivalent_lkr = EXCLUDED.cash_equivalent_lkr,
  total_earned_points = EXCLUDED.total_earned_points,
  total_redeemed_points = EXCLUDED.total_redeemed_points;
INSERT INTO wallets (id, user_id, total_points, cash_equivalent_lkr, total_earned_points, total_redeemed_points)
VALUES ('WAL-0013', 'CUST-0013', 554, 110.8, 554, 0)
ON CONFLICT (user_id) DO UPDATE SET
  total_points = EXCLUDED.total_points,
  cash_equivalent_lkr = EXCLUDED.cash_equivalent_lkr,
  total_earned_points = EXCLUDED.total_earned_points,
  total_redeemed_points = EXCLUDED.total_redeemed_points;
INSERT INTO wallets (id, user_id, total_points, cash_equivalent_lkr, total_earned_points, total_redeemed_points)
VALUES ('WAL-0014', 'CUST-0014', 4344, 868.8, 5094, 750)
ON CONFLICT (user_id) DO UPDATE SET
  total_points = EXCLUDED.total_points,
  cash_equivalent_lkr = EXCLUDED.cash_equivalent_lkr,
  total_earned_points = EXCLUDED.total_earned_points,
  total_redeemed_points = EXCLUDED.total_redeemed_points;
INSERT INTO wallets (id, user_id, total_points, cash_equivalent_lkr, total_earned_points, total_redeemed_points)
VALUES ('WAL-0015', 'CUST-0015', 3109, 621.8, 3359, 250)
ON CONFLICT (user_id) DO UPDATE SET
  total_points = EXCLUDED.total_points,
  cash_equivalent_lkr = EXCLUDED.cash_equivalent_lkr,
  total_earned_points = EXCLUDED.total_earned_points,
  total_redeemed_points = EXCLUDED.total_redeemed_points;
INSERT INTO wallets (id, user_id, total_points, cash_equivalent_lkr, total_earned_points, total_redeemed_points)
VALUES ('WAL-0016', 'CUST-0016', 658, 131.6, 658, 0)
ON CONFLICT (user_id) DO UPDATE SET
  total_points = EXCLUDED.total_points,
  cash_equivalent_lkr = EXCLUDED.cash_equivalent_lkr,
  total_earned_points = EXCLUDED.total_earned_points,
  total_redeemed_points = EXCLUDED.total_redeemed_points;
INSERT INTO wallets (id, user_id, total_points, cash_equivalent_lkr, total_earned_points, total_redeemed_points)
VALUES ('WAL-0017', 'CUST-0017', 895, 179, 2145, 1250)
ON CONFLICT (user_id) DO UPDATE SET
  total_points = EXCLUDED.total_points,
  cash_equivalent_lkr = EXCLUDED.cash_equivalent_lkr,
  total_earned_points = EXCLUDED.total_earned_points,
  total_redeemed_points = EXCLUDED.total_redeemed_points;
INSERT INTO wallets (id, user_id, total_points, cash_equivalent_lkr, total_earned_points, total_redeemed_points)
VALUES ('WAL-0018', 'CUST-0018', 500, 100, 500, 0)
ON CONFLICT (user_id) DO UPDATE SET
  total_points = EXCLUDED.total_points,
  cash_equivalent_lkr = EXCLUDED.cash_equivalent_lkr,
  total_earned_points = EXCLUDED.total_earned_points,
  total_redeemed_points = EXCLUDED.total_redeemed_points;
INSERT INTO wallets (id, user_id, total_points, cash_equivalent_lkr, total_earned_points, total_redeemed_points)
VALUES ('WAL-0019', 'CUST-0019', 5077, 1015.4, 6327, 1250)
ON CONFLICT (user_id) DO UPDATE SET
  total_points = EXCLUDED.total_points,
  cash_equivalent_lkr = EXCLUDED.cash_equivalent_lkr,
  total_earned_points = EXCLUDED.total_earned_points,
  total_redeemed_points = EXCLUDED.total_redeemed_points;
INSERT INTO wallets (id, user_id, total_points, cash_equivalent_lkr, total_earned_points, total_redeemed_points)
VALUES ('WAL-0020', 'CUST-0020', 4580, 916, 5330, 750)
ON CONFLICT (user_id) DO UPDATE SET
  total_points = EXCLUDED.total_points,
  cash_equivalent_lkr = EXCLUDED.cash_equivalent_lkr,
  total_earned_points = EXCLUDED.total_earned_points,
  total_redeemed_points = EXCLUDED.total_redeemed_points;
INSERT INTO wallets (id, user_id, total_points, cash_equivalent_lkr, total_earned_points, total_redeemed_points)
VALUES ('WAL-0021', 'CUST-0021', 1890, 378, 2890, 1000)
ON CONFLICT (user_id) DO UPDATE SET
  total_points = EXCLUDED.total_points,
  cash_equivalent_lkr = EXCLUDED.cash_equivalent_lkr,
  total_earned_points = EXCLUDED.total_earned_points,
  total_redeemed_points = EXCLUDED.total_redeemed_points;
INSERT INTO wallets (id, user_id, total_points, cash_equivalent_lkr, total_earned_points, total_redeemed_points)
VALUES ('WAL-0022', 'CUST-0022', 1050, 210, 1300, 250)
ON CONFLICT (user_id) DO UPDATE SET
  total_points = EXCLUDED.total_points,
  cash_equivalent_lkr = EXCLUDED.cash_equivalent_lkr,
  total_earned_points = EXCLUDED.total_earned_points,
  total_redeemed_points = EXCLUDED.total_redeemed_points;
INSERT INTO wallets (id, user_id, total_points, cash_equivalent_lkr, total_earned_points, total_redeemed_points)
VALUES ('WAL-0023', 'CUST-0023', 500, 100, 500, 0)
ON CONFLICT (user_id) DO UPDATE SET
  total_points = EXCLUDED.total_points,
  cash_equivalent_lkr = EXCLUDED.cash_equivalent_lkr,
  total_earned_points = EXCLUDED.total_earned_points,
  total_redeemed_points = EXCLUDED.total_redeemed_points;
INSERT INTO wallets (id, user_id, total_points, cash_equivalent_lkr, total_earned_points, total_redeemed_points)
VALUES ('WAL-0024', 'CUST-0024', 3616, 723.2, 4616, 1000)
ON CONFLICT (user_id) DO UPDATE SET
  total_points = EXCLUDED.total_points,
  cash_equivalent_lkr = EXCLUDED.cash_equivalent_lkr,
  total_earned_points = EXCLUDED.total_earned_points,
  total_redeemed_points = EXCLUDED.total_redeemed_points;
INSERT INTO wallets (id, user_id, total_points, cash_equivalent_lkr, total_earned_points, total_redeemed_points)
VALUES ('WAL-0025', 'CUST-0025', 961, 192.2, 1211, 250)
ON CONFLICT (user_id) DO UPDATE SET
  total_points = EXCLUDED.total_points,
  cash_equivalent_lkr = EXCLUDED.cash_equivalent_lkr,
  total_earned_points = EXCLUDED.total_earned_points,
  total_redeemed_points = EXCLUDED.total_redeemed_points;
INSERT INTO wallets (id, user_id, total_points, cash_equivalent_lkr, total_earned_points, total_redeemed_points)
VALUES ('WAL-0026', 'CUST-0026', 1161, 232.2, 1411, 250)
ON CONFLICT (user_id) DO UPDATE SET
  total_points = EXCLUDED.total_points,
  cash_equivalent_lkr = EXCLUDED.cash_equivalent_lkr,
  total_earned_points = EXCLUDED.total_earned_points,
  total_redeemed_points = EXCLUDED.total_redeemed_points;
INSERT INTO wallets (id, user_id, total_points, cash_equivalent_lkr, total_earned_points, total_redeemed_points)
VALUES ('WAL-0027', 'CUST-0027', 1687, 337.4, 2437, 750)
ON CONFLICT (user_id) DO UPDATE SET
  total_points = EXCLUDED.total_points,
  cash_equivalent_lkr = EXCLUDED.cash_equivalent_lkr,
  total_earned_points = EXCLUDED.total_earned_points,
  total_redeemed_points = EXCLUDED.total_redeemed_points;
INSERT INTO wallets (id, user_id, total_points, cash_equivalent_lkr, total_earned_points, total_redeemed_points)
VALUES ('WAL-0028', 'CUST-0028', 2638, 527.6, 3138, 500)
ON CONFLICT (user_id) DO UPDATE SET
  total_points = EXCLUDED.total_points,
  cash_equivalent_lkr = EXCLUDED.cash_equivalent_lkr,
  total_earned_points = EXCLUDED.total_earned_points,
  total_redeemed_points = EXCLUDED.total_redeemed_points;
INSERT INTO wallets (id, user_id, total_points, cash_equivalent_lkr, total_earned_points, total_redeemed_points)
VALUES ('WAL-0029', 'CUST-0029', 2333, 466.6, 3083, 750)
ON CONFLICT (user_id) DO UPDATE SET
  total_points = EXCLUDED.total_points,
  cash_equivalent_lkr = EXCLUDED.cash_equivalent_lkr,
  total_earned_points = EXCLUDED.total_earned_points,
  total_redeemed_points = EXCLUDED.total_redeemed_points;
INSERT INTO wallets (id, user_id, total_points, cash_equivalent_lkr, total_earned_points, total_redeemed_points)
VALUES ('WAL-0030', 'CUST-0030', 463, 92.6, 1713, 1250)
ON CONFLICT (user_id) DO UPDATE SET
  total_points = EXCLUDED.total_points,
  cash_equivalent_lkr = EXCLUDED.cash_equivalent_lkr,
  total_earned_points = EXCLUDED.total_earned_points,
  total_redeemed_points = EXCLUDED.total_redeemed_points;

-- 4. PICKUP COLLECTION DISPATCHES & ORDERS
INSERT INTO pickups (id, customer_id, customer_name, customer_phone, picker_id, picker_name, items_json, total_estimated_weight, total_actual_weight, estimated_points, earned_points, status, picker_status, rejection_reason, scheduled_date, scheduled_time_slot, address_json, created_at, completed_at)
VALUES ('PU-08001', 'CUST-0087', 'Anusha Dissanayake', '+94 78 560 2853', 'PICK-019', 'Malith Bandara', '[{"category":"polythene","materialName":"Polythene & LDPE Wrap","estimatedWeightKg":10.3,"actualWeightKg":0,"pricePerKgLkr":80,"pointsPerKg":30,"icon":"🛍️"}]', 10.3, 0, 309, 0, 'rejected', 'rejected', 'Recyclables wet/soiled with chemical residues', '2026-08-25', '01:00 PM - 03:00 PM', '{"street":"105, Chatham Street","city":"Colombo 01","zipCode":"00100","latitude":6.936314,"longitude":79.845001}', '2026-08-24T15:20:01.113Z', NULL)
ON CONFLICT (id) DO NOTHING;
INSERT INTO pickups (id, customer_id, customer_name, customer_phone, picker_id, picker_name, items_json, total_estimated_weight, total_actual_weight, estimated_points, earned_points, status, picker_status, rejection_reason, scheduled_date, scheduled_time_slot, address_json, created_at, completed_at)
VALUES ('PU-08002', 'CUST-0020', 'Thisara Wickramasinghe', '+94 71 451 1457', 'PICK-020', 'Lahiru Senanayake', '[{"category":"plastic","materialName":"Plastic (PET & HDPE)","estimatedWeightKg":9.8,"actualWeightKg":0,"pricePerKgLkr":120,"pointsPerKg":50,"icon":"🧴"}]', 9.8, 0, 490, 0, 'rejected', 'rejected', 'Customer requested reschedule to weekend', '2026-10-16', '10:00 AM - 12:00 PM', '{"street":"12/B, W.A. Silva Mawatha, Wellawatte","city":"Colombo 06","zipCode":"00600","latitude":6.873167,"longitude":79.857893}', '2026-10-15T15:20:01.114Z', NULL)
ON CONFLICT (id) DO NOTHING;
INSERT INTO pickups (id, customer_id, customer_name, customer_phone, picker_id, picker_name, items_json, total_estimated_weight, total_actual_weight, estimated_points, earned_points, status, picker_status, rejection_reason, scheduled_date, scheduled_time_slot, address_json, created_at, completed_at)
VALUES ('PU-08003', 'CUST-0049', 'Tharindu Samarasinghe', '+94 77 550 9907', 'PICK-010', 'Priyanka Alwis', '[{"category":"paper","materialName":"Paper & Cardboard","estimatedWeightKg":6.9,"actualWeightKg":0,"pricePerKgLkr":60,"pointsPerKg":25,"icon":"📰"}]', 6.9, 0, 173, 0, 'rejected', 'rejected', 'Recyclables wet/soiled with chemical residues', '2026-09-28', '08:00 AM - 10:00 AM', '{"street":"102, Station Road","city":"Dehiwala","zipCode":"10350","latitude":6.85126,"longitude":79.867589}', '2026-09-27T15:20:01.114Z', NULL)
ON CONFLICT (id) DO NOTHING;
INSERT INTO pickups (id, customer_id, customer_name, customer_phone, picker_id, picker_name, items_json, total_estimated_weight, total_actual_weight, estimated_points, earned_points, status, picker_status, rejection_reason, scheduled_date, scheduled_time_slot, address_json, created_at, completed_at)
VALUES ('PU-08004', 'CUST-0015', 'Shalika Mendis', '+94 71 794 9335', NULL, NULL, '[{"category":"plastic","materialName":"Plastic (PET & HDPE)","estimatedWeightKg":12.7,"actualWeightKg":0,"pricePerKgLkr":120,"pointsPerKg":50,"icon":"🧴"},{"category":"metal","materialName":"Metal & Aluminum Cans","estimatedWeightKg":17,"actualWeightKg":0,"pricePerKgLkr":250,"pointsPerKg":100,"icon":"🥫"},{"category":"e-waste","materialName":"E-Waste & Small Gadgets","estimatedWeightKg":15.6,"actualWeightKg":0,"pricePerKgLkr":400,"pointsPerKg":200,"icon":"💻"}]', 45.3, 0, 5455, 0, 'pending', 'unassigned', NULL, '2026-09-15', '10:00 AM - 12:00 PM', '{"street":"4, Duplication Road, Bambalapitiya","city":"Colombo 04","zipCode":"00400","latitude":6.888662,"longitude":79.851957}', '2026-09-14T15:20:01.114Z', NULL)
ON CONFLICT (id) DO NOTHING;
INSERT INTO pickups (id, customer_id, customer_name, customer_phone, picker_id, picker_name, items_json, total_estimated_weight, total_actual_weight, estimated_points, earned_points, status, picker_status, rejection_reason, scheduled_date, scheduled_time_slot, address_json, created_at, completed_at)
VALUES ('PU-08005', 'CUST-0005', 'Chamari Abeysekera', '+94 76 991 8937', 'PICK-012', 'Nimalee Rathnayake', '[{"category":"polythene","materialName":"Polythene & LDPE Wrap","estimatedWeightKg":17.4,"actualWeightKg":0,"pricePerKgLkr":80,"pointsPerKg":30,"icon":"🛍️"}]', 17.4, 0, 522, 0, 'rejected', 'rejected', 'Customer unavailable at designated doorstep coordinates after 3 phone attempts', '2026-10-25', '08:00 AM - 10:00 AM', '{"street":"138, Hotel Road","city":"Mount Lavinia","zipCode":"10370","latitude":6.832274,"longitude":79.860819}', '2026-10-24T15:20:01.114Z', NULL)
ON CONFLICT (id) DO NOTHING;
INSERT INTO pickups (id, customer_id, customer_name, customer_phone, picker_id, picker_name, items_json, total_estimated_weight, total_actual_weight, estimated_points, earned_points, status, picker_status, rejection_reason, scheduled_date, scheduled_time_slot, address_json, created_at, completed_at)
VALUES ('PU-08006', 'CUST-0035', 'Priyanka Silva', '+94 77 603 4401', 'PICK-001', 'Kasun Rathnayake', '[{"category":"plastic","materialName":"Plastic (PET & HDPE)","estimatedWeightKg":6,"actualWeightKg":0,"pricePerKgLkr":120,"pointsPerKg":50,"icon":"🧴"},{"category":"polythene","materialName":"Polythene & LDPE Wrap","estimatedWeightKg":14,"actualWeightKg":0,"pricePerKgLkr":80,"pointsPerKg":30,"icon":"🛍️"}]', 20, 0, 720, 0, 'in_progress', 'accepted', NULL, '2026-10-06', '08:00 AM - 10:00 AM', '{"street":"79, Dean''s Road, Maradana","city":"Colombo 10","zipCode":"01000","latitude":6.927552,"longitude":79.863276}', '2026-10-05T15:20:01.114Z', NULL)
ON CONFLICT (id) DO NOTHING;
INSERT INTO pickups (id, customer_id, customer_name, customer_phone, picker_id, picker_name, items_json, total_estimated_weight, total_actual_weight, estimated_points, earned_points, status, picker_status, rejection_reason, scheduled_date, scheduled_time_slot, address_json, created_at, completed_at)
VALUES ('PU-08007', 'CUST-0048', 'Janaka Bandara', '+94 75 719 2859', 'PICK-005', 'Kaveen Mendis', '[{"category":"paper","materialName":"Paper & Cardboard","estimatedWeightKg":10.5,"actualWeightKg":0,"pricePerKgLkr":60,"pointsPerKg":25,"icon":"📰"},{"category":"glass","materialName":"Glass Bottles & Jars","estimatedWeightKg":9.4,"actualWeightKg":0,"pricePerKgLkr":40,"pointsPerKg":20,"icon":"🫙"},{"category":"plastic","materialName":"Plastic (PET & HDPE)","estimatedWeightKg":5.8,"actualWeightKg":0,"pricePerKgLkr":120,"pointsPerKg":50,"icon":"🧴"}]', 25.7, 0, 741, 0, 'assigned', 'accepted', NULL, '2026-09-02', '08:00 AM - 10:00 AM', '{"street":"12, Keyzer Street, Pettah","city":"Colombo 11","zipCode":"01100","latitude":6.941387,"longitude":79.85659}', '2026-09-01T15:20:01.114Z', NULL)
ON CONFLICT (id) DO NOTHING;
INSERT INTO pickups (id, customer_id, customer_name, customer_phone, picker_id, picker_name, items_json, total_estimated_weight, total_actual_weight, estimated_points, earned_points, status, picker_status, rejection_reason, scheduled_date, scheduled_time_slot, address_json, created_at, completed_at)
VALUES ('PU-08008', 'CUST-0095', 'Shalika Perera', '+94 74 416 5124', 'PICK-016', 'Shenali Alwis', '[{"category":"plastic","materialName":"Plastic (PET & HDPE)","estimatedWeightKg":8.1,"actualWeightKg":0,"pricePerKgLkr":120,"pointsPerKg":50,"icon":"🧴"},{"category":"metal","materialName":"Metal & Aluminum Cans","estimatedWeightKg":12.1,"actualWeightKg":0,"pricePerKgLkr":250,"pointsPerKg":100,"icon":"🥫"}]', 20.2, 0, 1615, 0, 'assigned', 'accepted', NULL, '2026-10-24', '10:00 AM - 12:00 PM', '{"street":"105, Keyzer Street, Pettah","city":"Colombo 11","zipCode":"01100","latitude":6.94112,"longitude":79.857953}', '2026-10-23T15:20:01.114Z', NULL)
ON CONFLICT (id) DO NOTHING;
INSERT INTO pickups (id, customer_id, customer_name, customer_phone, picker_id, picker_name, items_json, total_estimated_weight, total_actual_weight, estimated_points, earned_points, status, picker_status, rejection_reason, scheduled_date, scheduled_time_slot, address_json, created_at, completed_at)
VALUES ('PU-08009', 'CUST-0085', 'Supun Alwis', '+94 74 532 2816', 'PICK-024', 'Harshana Jayasinghe', '[{"category":"polythene","materialName":"Polythene & LDPE Wrap","estimatedWeightKg":17.4,"actualWeightKg":0,"pricePerKgLkr":80,"pointsPerKg":30,"icon":"🛍️"},{"category":"e-waste","materialName":"E-Waste & Small Gadgets","estimatedWeightKg":10.8,"actualWeightKg":0,"pricePerKgLkr":400,"pointsPerKg":200,"icon":"💻"},{"category":"metal","materialName":"Metal & Aluminum Cans","estimatedWeightKg":4.6,"actualWeightKg":0,"pricePerKgLkr":250,"pointsPerKg":100,"icon":"🥫"}]', 32.8, 0, 3142, 0, 'rejected', 'rejected', 'Customer unavailable at designated doorstep coordinates after 3 phone attempts', '2026-10-27', '10:00 AM - 12:00 PM', '{"street":"99, Kotahena Street","city":"Colombo 13","zipCode":"01300","latitude":6.950751,"longitude":79.866532}', '2026-10-26T15:20:01.114Z', NULL)
ON CONFLICT (id) DO NOTHING;
INSERT INTO pickups (id, customer_id, customer_name, customer_phone, picker_id, picker_name, items_json, total_estimated_weight, total_actual_weight, estimated_points, earned_points, status, picker_status, rejection_reason, scheduled_date, scheduled_time_slot, address_json, created_at, completed_at)
VALUES ('PU-08010', 'CUST-0003', 'Nimalee Silva', '+94 76 562 2651', 'PICK-011', 'Dinesh Karunaratne', '[{"category":"plastic","materialName":"Plastic (PET & HDPE)","estimatedWeightKg":5.8,"actualWeightKg":6.4,"pricePerKgLkr":120,"pointsPerKg":50,"icon":"🧴"}]', 5.8, 6.4, 290, 320, 'completed', 'completed', NULL, '2026-10-17', '08:00 AM - 10:00 AM', '{"street":"2, Chatham Street","city":"Colombo 01","zipCode":"00100","latitude":6.932031,"longitude":79.847762}', '2026-10-16T15:20:01.114Z', '2026-10-17T18:20:01.114Z')
ON CONFLICT (id) DO NOTHING;
INSERT INTO pickups (id, customer_id, customer_name, customer_phone, picker_id, picker_name, items_json, total_estimated_weight, total_actual_weight, estimated_points, earned_points, status, picker_status, rejection_reason, scheduled_date, scheduled_time_slot, address_json, created_at, completed_at)
VALUES ('PU-08011', 'CUST-0048', 'Janaka Bandara', '+94 75 719 2859', 'PICK-015', 'Thisara Wijesinghe', '[{"category":"plastic","materialName":"Plastic (PET & HDPE)","estimatedWeightKg":3.7,"actualWeightKg":3.3,"pricePerKgLkr":120,"pointsPerKg":50,"icon":"🧴"}]', 3.7, 3.3, 185, 165, 'completed', 'completed', NULL, '2026-09-08', '03:00 PM - 05:00 PM', '{"street":"12, Keyzer Street, Pettah","city":"Colombo 11","zipCode":"01100","latitude":6.941387,"longitude":79.85659}', '2026-09-07T15:20:01.114Z', '2026-09-08T18:20:01.114Z')
ON CONFLICT (id) DO NOTHING;
INSERT INTO pickups (id, customer_id, customer_name, customer_phone, picker_id, picker_name, items_json, total_estimated_weight, total_actual_weight, estimated_points, earned_points, status, picker_status, rejection_reason, scheduled_date, scheduled_time_slot, address_json, created_at, completed_at)
VALUES ('PU-08012', 'CUST-0074', 'Dilshan Alwis', '+94 72 115 4829', NULL, NULL, '[{"category":"metal","materialName":"Metal & Aluminum Cans","estimatedWeightKg":5.7,"actualWeightKg":0,"pricePerKgLkr":250,"pointsPerKg":100,"icon":"🥫"},{"category":"glass","materialName":"Glass Bottles & Jars","estimatedWeightKg":13.7,"actualWeightKg":0,"pricePerKgLkr":40,"pointsPerKg":20,"icon":"🫙"}]', 19.4, 0, 844, 0, 'pending', 'unassigned', NULL, '2026-08-17', '03:00 PM - 05:00 PM', '{"street":"90, W.A. Silva Mawatha, Wellawatte","city":"Colombo 06","zipCode":"00600","latitude":6.871019,"longitude":79.862069}', '2026-08-16T15:20:01.114Z', NULL)
ON CONFLICT (id) DO NOTHING;
INSERT INTO pickups (id, customer_id, customer_name, customer_phone, picker_id, picker_name, items_json, total_estimated_weight, total_actual_weight, estimated_points, earned_points, status, picker_status, rejection_reason, scheduled_date, scheduled_time_slot, address_json, created_at, completed_at)
VALUES ('PU-08013', 'CUST-0040', 'Tharindu Dissanayake', '+94 76 373 9009', 'PICK-014', 'Chamari Wijesinghe', '[{"category":"e-waste","materialName":"E-Waste & Small Gadgets","estimatedWeightKg":16.2,"actualWeightKg":0,"pricePerKgLkr":400,"pointsPerKg":200,"icon":"💻"},{"category":"metal","materialName":"Metal & Aluminum Cans","estimatedWeightKg":3.5,"actualWeightKg":0,"pricePerKgLkr":250,"pointsPerKg":100,"icon":"🥫"}]', 19.7, 0, 3590, 0, 'assigned', 'accepted', NULL, '2026-10-26', '10:00 AM - 12:00 PM', '{"street":"48, Ward Place, Cinnamon Gardens","city":"Colombo 07","zipCode":"00700","latitude":6.909667,"longitude":79.867405}', '2026-10-25T15:20:01.114Z', NULL)
ON CONFLICT (id) DO NOTHING;
INSERT INTO pickups (id, customer_id, customer_name, customer_phone, picker_id, picker_name, items_json, total_estimated_weight, total_actual_weight, estimated_points, earned_points, status, picker_status, rejection_reason, scheduled_date, scheduled_time_slot, address_json, created_at, completed_at)
VALUES ('PU-08014', 'CUST-0090', 'Lakshan Gunasekara', '+94 75 658 2553', 'PICK-021', 'Nuwan Mendis', '[{"category":"e-waste","materialName":"E-Waste & Small Gadgets","estimatedWeightKg":10,"actualWeightKg":10.5,"pricePerKgLkr":400,"pointsPerKg":200,"icon":"💻"},{"category":"polythene","materialName":"Polythene & LDPE Wrap","estimatedWeightKg":10.2,"actualWeightKg":10,"pricePerKgLkr":80,"pointsPerKg":30,"icon":"🛍️"}]', 20.2, 20.5, 2306, 2400, 'completed', 'completed', NULL, '2026-09-20', '03:00 PM - 05:00 PM', '{"street":"40, W.A. Silva Mawatha, Wellawatte","city":"Colombo 06","zipCode":"00600","latitude":6.873426,"longitude":79.858366}', '2026-09-19T15:20:01.114Z', '2026-09-20T19:20:01.114Z')
ON CONFLICT (id) DO NOTHING;
INSERT INTO pickups (id, customer_id, customer_name, customer_phone, picker_id, picker_name, items_json, total_estimated_weight, total_actual_weight, estimated_points, earned_points, status, picker_status, rejection_reason, scheduled_date, scheduled_time_slot, address_json, created_at, completed_at)
VALUES ('PU-08015', 'CUST-0070', 'Dilshan Alwis', '+94 78 596 5003', 'PICK-024', 'Harshana Jayasinghe', '[{"category":"plastic","materialName":"Plastic (PET & HDPE)","estimatedWeightKg":11.4,"actualWeightKg":11.7,"pricePerKgLkr":120,"pointsPerKg":50,"icon":"🧴"}]', 11.4, 11.7, 570, 585, 'completed', 'completed', NULL, '2026-08-26', '01:00 PM - 03:00 PM', '{"street":"77, Havelock Road","city":"Colombo 05","zipCode":"00500","latitude":6.887129,"longitude":79.864313}', '2026-08-25T15:20:01.114Z', '2026-08-26T16:20:01.114Z')
ON CONFLICT (id) DO NOTHING;
INSERT INTO pickups (id, customer_id, customer_name, customer_phone, picker_id, picker_name, items_json, total_estimated_weight, total_actual_weight, estimated_points, earned_points, status, picker_status, rejection_reason, scheduled_date, scheduled_time_slot, address_json, created_at, completed_at)
VALUES ('PU-08016', 'CUST-0091', 'Buddhika Fernando', '+94 75 232 1556', 'PICK-015', 'Thisara Wijesinghe', '[{"category":"glass","materialName":"Glass Bottles & Jars","estimatedWeightKg":6.9,"actualWeightKg":7.6,"pricePerKgLkr":40,"pointsPerKg":20,"icon":"🫙"},{"category":"plastic","materialName":"Plastic (PET & HDPE)","estimatedWeightKg":7,"actualWeightKg":6.9,"pricePerKgLkr":120,"pointsPerKg":50,"icon":"🧴"}]', 13.9, 14.5, 488, 497, 'completed', 'completed', NULL, '2026-09-24', '03:00 PM - 05:00 PM', '{"street":"88/B, Havelock Road","city":"Colombo 05","zipCode":"00500","latitude":6.881483,"longitude":79.872845}', '2026-09-23T15:20:01.114Z', '2026-09-24T18:20:01.114Z')
ON CONFLICT (id) DO NOTHING;
INSERT INTO pickups (id, customer_id, customer_name, customer_phone, picker_id, picker_name, items_json, total_estimated_weight, total_actual_weight, estimated_points, earned_points, status, picker_status, rejection_reason, scheduled_date, scheduled_time_slot, address_json, created_at, completed_at)
VALUES ('PU-08017', 'CUST-0005', 'Chamari Abeysekera', '+94 76 991 8937', 'PICK-022', 'Buddhika de Silva', '[{"category":"polythene","materialName":"Polythene & LDPE Wrap","estimatedWeightKg":15.3,"actualWeightKg":15.6,"pricePerKgLkr":80,"pointsPerKg":30,"icon":"🛍️"},{"category":"plastic","materialName":"Plastic (PET & HDPE)","estimatedWeightKg":5.9,"actualWeightKg":6,"pricePerKgLkr":120,"pointsPerKg":50,"icon":"🧴"}]', 21.2, 21.6, 754, 768, 'completed', 'completed', NULL, '2026-08-16', '01:00 PM - 03:00 PM', '{"street":"138, Hotel Road","city":"Mount Lavinia","zipCode":"10370","latitude":6.832274,"longitude":79.860819}', '2026-08-15T15:20:01.114Z', '2026-08-16T18:20:01.114Z')
ON CONFLICT (id) DO NOTHING;
INSERT INTO pickups (id, customer_id, customer_name, customer_phone, picker_id, picker_name, items_json, total_estimated_weight, total_actual_weight, estimated_points, earned_points, status, picker_status, rejection_reason, scheduled_date, scheduled_time_slot, address_json, created_at, completed_at)
VALUES ('PU-08018', 'CUST-0001', 'Dinesh Mendis', '+94 76 210 4200', 'PICK-014', 'Chamari Wijesinghe', '[{"category":"e-waste","materialName":"E-Waste & Small Gadgets","estimatedWeightKg":17.1,"actualWeightKg":0,"pricePerKgLkr":400,"pointsPerKg":200,"icon":"💻"}]', 17.1, 0, 3420, 0, 'assigned', 'accepted', NULL, '2026-09-29', '08:00 AM - 10:00 AM', '{"street":"28, Keyzer Street, Pettah","city":"Colombo 11","zipCode":"01100","latitude":6.939855,"longitude":79.850588}', '2026-09-28T15:20:01.114Z', NULL)
ON CONFLICT (id) DO NOTHING;
INSERT INTO pickups (id, customer_id, customer_name, customer_phone, picker_id, picker_name, items_json, total_estimated_weight, total_actual_weight, estimated_points, earned_points, status, picker_status, rejection_reason, scheduled_date, scheduled_time_slot, address_json, created_at, completed_at)
VALUES ('PU-08019', 'CUST-0038', 'Buddhika de Silva', '+94 76 854 7368', 'PICK-021', 'Nuwan Mendis', '[{"category":"metal","materialName":"Metal & Aluminum Cans","estimatedWeightKg":11.1,"actualWeightKg":12.4,"pricePerKgLkr":250,"pointsPerKg":100,"icon":"🥫"},{"category":"plastic","materialName":"Plastic (PET & HDPE)","estimatedWeightKg":7.6,"actualWeightKg":6.8,"pricePerKgLkr":120,"pointsPerKg":50,"icon":"🧴"},{"category":"polythene","materialName":"Polythene & LDPE Wrap","estimatedWeightKg":7.4,"actualWeightKg":7,"pricePerKgLkr":80,"pointsPerKg":30,"icon":"🛍️"}]', 26.1, 26.2, 1712, 1790, 'completed', 'completed', NULL, '2026-10-24', '08:00 AM - 10:00 AM', '{"street":"108, Keyzer Street, Pettah","city":"Colombo 11","zipCode":"01100","latitude":6.941975,"longitude":79.85969}', '2026-10-23T15:20:01.114Z', '2026-10-24T17:20:01.114Z')
ON CONFLICT (id) DO NOTHING;
INSERT INTO pickups (id, customer_id, customer_name, customer_phone, picker_id, picker_name, items_json, total_estimated_weight, total_actual_weight, estimated_points, earned_points, status, picker_status, rejection_reason, scheduled_date, scheduled_time_slot, address_json, created_at, completed_at)
VALUES ('PU-08020', 'CUST-0070', 'Dilshan Alwis', '+94 78 596 5003', 'PICK-005', 'Kaveen Mendis', '[{"category":"plastic","materialName":"Plastic (PET & HDPE)","estimatedWeightKg":11.7,"actualWeightKg":0,"pricePerKgLkr":120,"pointsPerKg":50,"icon":"🧴"},{"category":"paper","materialName":"Paper & Cardboard","estimatedWeightKg":3.5,"actualWeightKg":0,"pricePerKgLkr":60,"pointsPerKg":25,"icon":"📰"},{"category":"glass","materialName":"Glass Bottles & Jars","estimatedWeightKg":17.9,"actualWeightKg":0,"pricePerKgLkr":40,"pointsPerKg":20,"icon":"🫙"}]', 33.1, 0, 1031, 0, 'in_progress', 'accepted', NULL, '2026-08-11', '03:00 PM - 05:00 PM', '{"street":"77, Havelock Road","city":"Colombo 05","zipCode":"00500","latitude":6.887129,"longitude":79.864313}', '2026-08-10T15:20:01.114Z', NULL)
ON CONFLICT (id) DO NOTHING;
INSERT INTO pickups (id, customer_id, customer_name, customer_phone, picker_id, picker_name, items_json, total_estimated_weight, total_actual_weight, estimated_points, earned_points, status, picker_status, rejection_reason, scheduled_date, scheduled_time_slot, address_json, created_at, completed_at)
VALUES ('PU-08021', 'CUST-0088', 'Thisara Karunaratne', '+94 77 819 7213', 'PICK-008', 'Lakshan Jayasinghe', '[{"category":"glass","materialName":"Glass Bottles & Jars","estimatedWeightKg":6,"actualWeightKg":0,"pricePerKgLkr":40,"pointsPerKg":20,"icon":"🫙"},{"category":"e-waste","materialName":"E-Waste & Small Gadgets","estimatedWeightKg":15.4,"actualWeightKg":0,"pricePerKgLkr":400,"pointsPerKg":200,"icon":"💻"}]', 21.4, 0, 3200, 0, 'rejected', 'rejected', 'Customer requested reschedule to weekend', '2026-09-11', '10:00 AM - 12:00 PM', '{"street":"145, Keyzer Street, Pettah","city":"Colombo 11","zipCode":"01100","latitude":6.936515,"longitude":79.851056}', '2026-09-10T15:20:01.114Z', NULL)
ON CONFLICT (id) DO NOTHING;
INSERT INTO pickups (id, customer_id, customer_name, customer_phone, picker_id, picker_name, items_json, total_estimated_weight, total_actual_weight, estimated_points, earned_points, status, picker_status, rejection_reason, scheduled_date, scheduled_time_slot, address_json, created_at, completed_at)
VALUES ('PU-08022', 'CUST-0022', 'Gayani Jayasinghe', '+94 77 242 7438', 'PICK-001', 'Kasun Rathnayake', '[{"category":"plastic","materialName":"Plastic (PET & HDPE)","estimatedWeightKg":15.8,"actualWeightKg":16,"pricePerKgLkr":120,"pointsPerKg":50,"icon":"🧴"}]', 15.8, 16, 790, 800, 'completed', 'completed', NULL, '2026-08-25', '01:00 PM - 03:00 PM', '{"street":"93, Hotel Road","city":"Mount Lavinia","zipCode":"10370","latitude":6.832285,"longitude":79.865333}', '2026-08-24T15:20:01.114Z', '2026-08-25T19:20:01.114Z')
ON CONFLICT (id) DO NOTHING;
INSERT INTO pickups (id, customer_id, customer_name, customer_phone, picker_id, picker_name, items_json, total_estimated_weight, total_actual_weight, estimated_points, earned_points, status, picker_status, rejection_reason, scheduled_date, scheduled_time_slot, address_json, created_at, completed_at)
VALUES ('PU-08023', 'CUST-0014', 'Supun de Silva', '+94 71 245 4506', 'PICK-019', 'Malith Bandara', '[{"category":"plastic","materialName":"Plastic (PET & HDPE)","estimatedWeightKg":16.3,"actualWeightKg":0,"pricePerKgLkr":120,"pointsPerKg":50,"icon":"🧴"}]', 16.3, 0, 815, 0, 'assigned', 'accepted', NULL, '2026-08-30', '01:00 PM - 03:00 PM', '{"street":"121, Chatham Street","city":"Colombo 01","zipCode":"00100","latitude":6.937977,"longitude":79.841351}', '2026-08-29T15:20:01.114Z', NULL)
ON CONFLICT (id) DO NOTHING;
INSERT INTO pickups (id, customer_id, customer_name, customer_phone, picker_id, picker_name, items_json, total_estimated_weight, total_actual_weight, estimated_points, earned_points, status, picker_status, rejection_reason, scheduled_date, scheduled_time_slot, address_json, created_at, completed_at)
VALUES ('PU-08024', 'CUST-0052', 'Nimalee Karunaratne', '+94 75 306 1203', NULL, NULL, '[{"category":"plastic","materialName":"Plastic (PET & HDPE)","estimatedWeightKg":12,"actualWeightKg":0,"pricePerKgLkr":120,"pointsPerKg":50,"icon":"🧴"},{"category":"glass","materialName":"Glass Bottles & Jars","estimatedWeightKg":14.8,"actualWeightKg":0,"pricePerKgLkr":40,"pointsPerKg":20,"icon":"🫙"},{"category":"metal","materialName":"Metal & Aluminum Cans","estimatedWeightKg":9.9,"actualWeightKg":0,"pricePerKgLkr":250,"pointsPerKg":100,"icon":"🥫"}]', 36.7, 0, 1886, 0, 'pending', 'unassigned', NULL, '2026-09-10', '10:00 AM - 12:00 PM', '{"street":"28, Galle Road, Colpetty","city":"Colombo 03","zipCode":"00300","latitude":6.90512,"longitude":79.846281}', '2026-09-09T15:20:01.114Z', NULL)
ON CONFLICT (id) DO NOTHING;
INSERT INTO pickups (id, customer_id, customer_name, customer_phone, picker_id, picker_name, items_json, total_estimated_weight, total_actual_weight, estimated_points, earned_points, status, picker_status, rejection_reason, scheduled_date, scheduled_time_slot, address_json, created_at, completed_at)
VALUES ('PU-08025', 'CUST-0006', 'Lahiru Wijesinghe', '+94 76 868 7731', NULL, NULL, '[{"category":"e-waste","materialName":"E-Waste & Small Gadgets","estimatedWeightKg":4.4,"actualWeightKg":0,"pricePerKgLkr":400,"pointsPerKg":200,"icon":"💻"}]', 4.4, 0, 880, 0, 'pending', 'unassigned', NULL, '2026-08-14', '01:00 PM - 03:00 PM', '{"street":"46/B, Havelock Road","city":"Colombo 05","zipCode":"00500","latitude":6.88866,"longitude":79.864331}', '2026-08-13T15:20:01.114Z', NULL)
ON CONFLICT (id) DO NOTHING;
INSERT INTO pickups (id, customer_id, customer_name, customer_phone, picker_id, picker_name, items_json, total_estimated_weight, total_actual_weight, estimated_points, earned_points, status, picker_status, rejection_reason, scheduled_date, scheduled_time_slot, address_json, created_at, completed_at)
VALUES ('PU-08026', 'CUST-0005', 'Chamari Abeysekera', '+94 76 991 8937', NULL, NULL, '[{"category":"e-waste","materialName":"E-Waste & Small Gadgets","estimatedWeightKg":7.7,"actualWeightKg":0,"pricePerKgLkr":400,"pointsPerKg":200,"icon":"💻"},{"category":"polythene","materialName":"Polythene & LDPE Wrap","estimatedWeightKg":13.8,"actualWeightKg":0,"pricePerKgLkr":80,"pointsPerKg":30,"icon":"🛍️"},{"category":"metal","materialName":"Metal & Aluminum Cans","estimatedWeightKg":12.7,"actualWeightKg":0,"pricePerKgLkr":250,"pointsPerKg":100,"icon":"🥫"}]', 34.2, 0, 3224, 0, 'pending', 'unassigned', NULL, '2026-09-02', '01:00 PM - 03:00 PM', '{"street":"138, Hotel Road","city":"Mount Lavinia","zipCode":"10370","latitude":6.832274,"longitude":79.860819}', '2026-09-01T15:20:01.114Z', NULL)
ON CONFLICT (id) DO NOTHING;
INSERT INTO pickups (id, customer_id, customer_name, customer_phone, picker_id, picker_name, items_json, total_estimated_weight, total_actual_weight, estimated_points, earned_points, status, picker_status, rejection_reason, scheduled_date, scheduled_time_slot, address_json, created_at, completed_at)
VALUES ('PU-08027', 'CUST-0052', 'Nimalee Karunaratne', '+94 75 306 1203', 'PICK-009', 'Shalika Samarasinghe', '[{"category":"plastic","materialName":"Plastic (PET & HDPE)","estimatedWeightKg":16.3,"actualWeightKg":17.1,"pricePerKgLkr":120,"pointsPerKg":50,"icon":"🧴"},{"category":"polythene","materialName":"Polythene & LDPE Wrap","estimatedWeightKg":15.9,"actualWeightKg":15.9,"pricePerKgLkr":80,"pointsPerKg":30,"icon":"🛍️"},{"category":"metal","materialName":"Metal & Aluminum Cans","estimatedWeightKg":9.2,"actualWeightKg":9.8,"pricePerKgLkr":250,"pointsPerKg":100,"icon":"🥫"}]', 41.4, 42.8, 2212, 2312, 'completed', 'completed', NULL, '2026-09-20', '03:00 PM - 05:00 PM', '{"street":"28, Galle Road, Colpetty","city":"Colombo 03","zipCode":"00300","latitude":6.90512,"longitude":79.846281}', '2026-09-19T15:20:01.114Z', '2026-09-20T16:20:01.114Z')
ON CONFLICT (id) DO NOTHING;
INSERT INTO pickups (id, customer_id, customer_name, customer_phone, picker_id, picker_name, items_json, total_estimated_weight, total_actual_weight, estimated_points, earned_points, status, picker_status, rejection_reason, scheduled_date, scheduled_time_slot, address_json, created_at, completed_at)
VALUES ('PU-08028', 'CUST-0040', 'Tharindu Dissanayake', '+94 76 373 9009', 'PICK-007', 'Malith Dissanayake', '[{"category":"polythene","materialName":"Polythene & LDPE Wrap","estimatedWeightKg":4.1,"actualWeightKg":0,"pricePerKgLkr":80,"pointsPerKg":30,"icon":"🛍️"}]', 4.1, 0, 123, 0, 'in_progress', 'accepted', NULL, '2026-09-04', '03:00 PM - 05:00 PM', '{"street":"48, Ward Place, Cinnamon Gardens","city":"Colombo 07","zipCode":"00700","latitude":6.909667,"longitude":79.867405}', '2026-09-03T15:20:01.114Z', NULL)
ON CONFLICT (id) DO NOTHING;
INSERT INTO pickups (id, customer_id, customer_name, customer_phone, picker_id, picker_name, items_json, total_estimated_weight, total_actual_weight, estimated_points, earned_points, status, picker_status, rejection_reason, scheduled_date, scheduled_time_slot, address_json, created_at, completed_at)
VALUES ('PU-08029', 'CUST-0085', 'Supun Alwis', '+94 74 532 2816', 'PICK-023', 'Buddhika Perera', '[{"category":"plastic","materialName":"Plastic (PET & HDPE)","estimatedWeightKg":8.6,"actualWeightKg":0,"pricePerKgLkr":120,"pointsPerKg":50,"icon":"🧴"}]', 8.6, 0, 430, 0, 'rejected', 'rejected', 'Recyclables wet/soiled with chemical residues', '2026-11-03', '01:00 PM - 03:00 PM', '{"street":"99, Kotahena Street","city":"Colombo 13","zipCode":"01300","latitude":6.950751,"longitude":79.866532}', '2026-11-02T15:20:01.114Z', NULL)
ON CONFLICT (id) DO NOTHING;
INSERT INTO pickups (id, customer_id, customer_name, customer_phone, picker_id, picker_name, items_json, total_estimated_weight, total_actual_weight, estimated_points, earned_points, status, picker_status, rejection_reason, scheduled_date, scheduled_time_slot, address_json, created_at, completed_at)
VALUES ('PU-08030', 'CUST-0076', 'Amila de Silva', '+94 77 440 2917', 'PICK-008', 'Lakshan Jayasinghe', '[{"category":"e-waste","materialName":"E-Waste & Small Gadgets","estimatedWeightKg":15.2,"actualWeightKg":15.7,"pricePerKgLkr":400,"pointsPerKg":200,"icon":"💻"}]', 15.2, 15.7, 3040, 3140, 'completed', 'completed', NULL, '2026-08-17', '10:00 AM - 12:00 PM', '{"street":"87, Hotel Road","city":"Mount Lavinia","zipCode":"10370","latitude":6.838394,"longitude":79.859177}', '2026-08-16T15:20:01.114Z', '2026-08-17T17:20:01.114Z')
ON CONFLICT (id) DO NOTHING;
INSERT INTO pickups (id, customer_id, customer_name, customer_phone, picker_id, picker_name, items_json, total_estimated_weight, total_actual_weight, estimated_points, earned_points, status, picker_status, rejection_reason, scheduled_date, scheduled_time_slot, address_json, created_at, completed_at)
VALUES ('PU-08031', 'CUST-0021', 'Dilshan Jayasinghe', '+94 72 679 6258', 'PICK-004', 'Gayani Jayasinghe', '[{"category":"plastic","materialName":"Plastic (PET & HDPE)","estimatedWeightKg":3.5,"actualWeightKg":3.4,"pricePerKgLkr":120,"pointsPerKg":50,"icon":"🧴"}]', 3.5, 3.4, 175, 170, 'completed', 'completed', NULL, '2026-10-01', '10:00 AM - 12:00 PM', '{"street":"113/A, Sri Jayawardenepura Mw","city":"Rajagiriya","zipCode":"10107","latitude":6.905111,"longitude":79.895745}', '2026-09-30T15:20:01.114Z', '2026-10-01T17:20:01.114Z')
ON CONFLICT (id) DO NOTHING;
INSERT INTO pickups (id, customer_id, customer_name, customer_phone, picker_id, picker_name, items_json, total_estimated_weight, total_actual_weight, estimated_points, earned_points, status, picker_status, rejection_reason, scheduled_date, scheduled_time_slot, address_json, created_at, completed_at)
VALUES ('PU-08032', 'CUST-0066', 'Buddhika Alwis', '+94 75 694 4200', NULL, NULL, '[{"category":"plastic","materialName":"Plastic (PET & HDPE)","estimatedWeightKg":4.3,"actualWeightKg":0,"pricePerKgLkr":120,"pointsPerKg":50,"icon":"🧴"},{"category":"metal","materialName":"Metal & Aluminum Cans","estimatedWeightKg":10,"actualWeightKg":0,"pricePerKgLkr":250,"pointsPerKg":100,"icon":"🥫"},{"category":"glass","materialName":"Glass Bottles & Jars","estimatedWeightKg":9.5,"actualWeightKg":0,"pricePerKgLkr":40,"pointsPerKg":20,"icon":"🫙"}]', 23.8, 0, 1405, 0, 'pending', 'unassigned', NULL, '2026-10-10', '01:00 PM - 03:00 PM', '{"street":"19, Cotta Road, Borella","city":"Colombo 08","zipCode":"00800","latitude":6.911481,"longitude":79.879392}', '2026-10-09T15:20:01.114Z', NULL)
ON CONFLICT (id) DO NOTHING;
INSERT INTO pickups (id, customer_id, customer_name, customer_phone, picker_id, picker_name, items_json, total_estimated_weight, total_actual_weight, estimated_points, earned_points, status, picker_status, rejection_reason, scheduled_date, scheduled_time_slot, address_json, created_at, completed_at)
VALUES ('PU-08033', 'CUST-0091', 'Buddhika Fernando', '+94 75 232 1556', 'PICK-022', 'Buddhika de Silva', '[{"category":"plastic","materialName":"Plastic (PET & HDPE)","estimatedWeightKg":7.2,"actualWeightKg":7.6,"pricePerKgLkr":120,"pointsPerKg":50,"icon":"🧴"},{"category":"metal","materialName":"Metal & Aluminum Cans","estimatedWeightKg":15.9,"actualWeightKg":14,"pricePerKgLkr":250,"pointsPerKg":100,"icon":"🥫"},{"category":"e-waste","materialName":"E-Waste & Small Gadgets","estimatedWeightKg":10.9,"actualWeightKg":10.2,"pricePerKgLkr":400,"pointsPerKg":200,"icon":"💻"}]', 34, 31.8, 4130, 3820, 'completed', 'completed', NULL, '2026-08-18', '10:00 AM - 12:00 PM', '{"street":"88/B, Havelock Road","city":"Colombo 05","zipCode":"00500","latitude":6.881483,"longitude":79.872845}', '2026-08-17T15:20:01.114Z', '2026-08-18T16:20:01.114Z')
ON CONFLICT (id) DO NOTHING;
INSERT INTO pickups (id, customer_id, customer_name, customer_phone, picker_id, picker_name, items_json, total_estimated_weight, total_actual_weight, estimated_points, earned_points, status, picker_status, rejection_reason, scheduled_date, scheduled_time_slot, address_json, created_at, completed_at)
VALUES ('PU-08034', 'CUST-0023', 'Dilshan Dissanayake', '+94 74 147 4370', 'PICK-016', 'Shenali Alwis', '[{"category":"plastic","materialName":"Plastic (PET & HDPE)","estimatedWeightKg":9.6,"actualWeightKg":0,"pricePerKgLkr":120,"pointsPerKg":50,"icon":"🧴"},{"category":"metal","materialName":"Metal & Aluminum Cans","estimatedWeightKg":12.8,"actualWeightKg":0,"pricePerKgLkr":250,"pointsPerKg":100,"icon":"🥫"}]', 22.4, 0, 1760, 0, 'rejected', 'rejected', 'Customer unavailable at designated doorstep coordinates after 3 phone attempts', '2026-08-27', '10:00 AM - 12:00 PM', '{"street":"131/A, Hotel Road","city":"Mount Lavinia","zipCode":"10370","latitude":6.83196,"longitude":79.864718}', '2026-08-26T15:20:01.114Z', NULL)
ON CONFLICT (id) DO NOTHING;
INSERT INTO pickups (id, customer_id, customer_name, customer_phone, picker_id, picker_name, items_json, total_estimated_weight, total_actual_weight, estimated_points, earned_points, status, picker_status, rejection_reason, scheduled_date, scheduled_time_slot, address_json, created_at, completed_at)
VALUES ('PU-08035', 'CUST-0099', 'Chamari Dissanayake', '+94 77 493 1752', 'PICK-018', 'Nalaka Gunasekara', '[{"category":"plastic","materialName":"Plastic (PET & HDPE)","estimatedWeightKg":2.3,"actualWeightKg":0,"pricePerKgLkr":120,"pointsPerKg":50,"icon":"🧴"}]', 2.3, 0, 115, 0, 'rejected', 'rejected', 'Recyclables wet/soiled with chemical residues', '2026-10-23', '08:00 AM - 10:00 AM', '{"street":"27, Kotahena Street","city":"Colombo 13","zipCode":"01300","latitude":6.946808,"longitude":79.861447}', '2026-10-22T15:20:01.114Z', NULL)
ON CONFLICT (id) DO NOTHING;
INSERT INTO pickups (id, customer_id, customer_name, customer_phone, picker_id, picker_name, items_json, total_estimated_weight, total_actual_weight, estimated_points, earned_points, status, picker_status, rejection_reason, scheduled_date, scheduled_time_slot, address_json, created_at, completed_at)
VALUES ('PU-08036', 'CUST-0017', 'Priyanka Alwis', '+94 72 290 1589', 'PICK-005', 'Kaveen Mendis', '[{"category":"plastic","materialName":"Plastic (PET & HDPE)","estimatedWeightKg":9.6,"actualWeightKg":0,"pricePerKgLkr":120,"pointsPerKg":50,"icon":"🧴"}]', 9.6, 0, 480, 0, 'rejected', 'rejected', 'Customer requested reschedule to weekend', '2026-10-24', '01:00 PM - 03:00 PM', '{"street":"5, Chatham Street","city":"Colombo 01","zipCode":"00100","latitude":6.93442,"longitude":79.839465}', '2026-10-23T15:20:01.114Z', NULL)
ON CONFLICT (id) DO NOTHING;
INSERT INTO pickups (id, customer_id, customer_name, customer_phone, picker_id, picker_name, items_json, total_estimated_weight, total_actual_weight, estimated_points, earned_points, status, picker_status, rejection_reason, scheduled_date, scheduled_time_slot, address_json, created_at, completed_at)
VALUES ('PU-08037', 'CUST-0039', 'Nimalee de Silva', '+94 70 917 7551', 'PICK-025', 'Damith Bandara', '[{"category":"glass","materialName":"Glass Bottles & Jars","estimatedWeightKg":11.1,"actualWeightKg":0,"pricePerKgLkr":40,"pointsPerKg":20,"icon":"🫙"}]', 11.1, 0, 222, 0, 'rejected', 'rejected', 'Customer requested reschedule to weekend', '2026-10-05', '03:00 PM - 05:00 PM', '{"street":"139, Galle Road, Colpetty","city":"Colombo 03","zipCode":"00300","latitude":6.908918,"longitude":79.853311}', '2026-10-04T15:20:01.114Z', NULL)
ON CONFLICT (id) DO NOTHING;
INSERT INTO pickups (id, customer_id, customer_name, customer_phone, picker_id, picker_name, items_json, total_estimated_weight, total_actual_weight, estimated_points, earned_points, status, picker_status, rejection_reason, scheduled_date, scheduled_time_slot, address_json, created_at, completed_at)
VALUES ('PU-08038', 'CUST-0064', 'Dinesh Hettiarachchi', '+94 71 821 3651', 'PICK-024', 'Harshana Jayasinghe', '[{"category":"glass","materialName":"Glass Bottles & Jars","estimatedWeightKg":4.5,"actualWeightKg":4,"pricePerKgLkr":40,"pointsPerKg":20,"icon":"🫙"}]', 4.5, 4, 90, 80, 'completed', 'completed', NULL, '2026-08-26', '10:00 AM - 12:00 PM', '{"street":"94, Duplication Road, Bambalapitiya","city":"Colombo 04","zipCode":"00400","latitude":6.891992,"longitude":79.852644}', '2026-08-25T15:20:01.114Z', '2026-08-26T16:20:01.114Z')
ON CONFLICT (id) DO NOTHING;
INSERT INTO pickups (id, customer_id, customer_name, customer_phone, picker_id, picker_name, items_json, total_estimated_weight, total_actual_weight, estimated_points, earned_points, status, picker_status, rejection_reason, scheduled_date, scheduled_time_slot, address_json, created_at, completed_at)
VALUES ('PU-08039', 'CUST-0014', 'Supun de Silva', '+94 71 245 4506', 'PICK-012', 'Nimalee Rathnayake', '[{"category":"plastic","materialName":"Plastic (PET & HDPE)","estimatedWeightKg":5.9,"actualWeightKg":5.9,"pricePerKgLkr":120,"pointsPerKg":50,"icon":"🧴"},{"category":"glass","materialName":"Glass Bottles & Jars","estimatedWeightKg":15,"actualWeightKg":13.7,"pricePerKgLkr":40,"pointsPerKg":20,"icon":"🫙"},{"category":"metal","materialName":"Metal & Aluminum Cans","estimatedWeightKg":7.7,"actualWeightKg":7.4,"pricePerKgLkr":250,"pointsPerKg":100,"icon":"🥫"}]', 28.6, 27, 1365, 1309, 'completed', 'completed', NULL, '2026-09-21', '01:00 PM - 03:00 PM', '{"street":"121, Chatham Street","city":"Colombo 01","zipCode":"00100","latitude":6.937977,"longitude":79.841351}', '2026-09-20T15:20:01.114Z', '2026-09-21T19:20:01.114Z')
ON CONFLICT (id) DO NOTHING;
INSERT INTO pickups (id, customer_id, customer_name, customer_phone, picker_id, picker_name, items_json, total_estimated_weight, total_actual_weight, estimated_points, earned_points, status, picker_status, rejection_reason, scheduled_date, scheduled_time_slot, address_json, created_at, completed_at)
VALUES ('PU-08040', 'CUST-0019', 'Gayani Dissanayake', '+94 72 574 1133', NULL, NULL, '[{"category":"polythene","materialName":"Polythene & LDPE Wrap","estimatedWeightKg":14.2,"actualWeightKg":0,"pricePerKgLkr":80,"pointsPerKg":30,"icon":"🛍️"},{"category":"e-waste","materialName":"E-Waste & Small Gadgets","estimatedWeightKg":4.4,"actualWeightKg":0,"pricePerKgLkr":400,"pointsPerKg":200,"icon":"💻"}]', 18.6, 0, 1306, 0, 'pending', 'unassigned', NULL, '2026-10-28', '08:00 AM - 10:00 AM', '{"street":"32, Vauxhall Street","city":"Colombo 02","zipCode":"00200","latitude":6.922617,"longitude":79.854493}', '2026-10-27T15:20:01.114Z', NULL)
ON CONFLICT (id) DO NOTHING;
INSERT INTO pickups (id, customer_id, customer_name, customer_phone, picker_id, picker_name, items_json, total_estimated_weight, total_actual_weight, estimated_points, earned_points, status, picker_status, rejection_reason, scheduled_date, scheduled_time_slot, address_json, created_at, completed_at)
VALUES ('PU-08041', 'CUST-0027', 'Kasun Alwis', '+94 75 199 4953', 'PICK-003', 'Dilshan Bandara', '[{"category":"e-waste","materialName":"E-Waste & Small Gadgets","estimatedWeightKg":14.9,"actualWeightKg":0,"pricePerKgLkr":400,"pointsPerKg":200,"icon":"💻"}]', 14.9, 0, 2980, 0, 'in_progress', 'accepted', NULL, '2026-08-31', '08:00 AM - 10:00 AM', '{"street":"106, Havelock Road","city":"Colombo 05","zipCode":"00500","latitude":6.884609,"longitude":79.873811}', '2026-08-30T15:20:01.114Z', NULL)
ON CONFLICT (id) DO NOTHING;
INSERT INTO pickups (id, customer_id, customer_name, customer_phone, picker_id, picker_name, items_json, total_estimated_weight, total_actual_weight, estimated_points, earned_points, status, picker_status, rejection_reason, scheduled_date, scheduled_time_slot, address_json, created_at, completed_at)
VALUES ('PU-08042', 'CUST-0055', 'Shenali Abeysekera', '+94 75 973 9865', 'PICK-025', 'Damith Bandara', '[{"category":"polythene","materialName":"Polythene & LDPE Wrap","estimatedWeightKg":7.3,"actualWeightKg":0,"pricePerKgLkr":80,"pointsPerKg":30,"icon":"🛍️"}]', 7.3, 0, 219, 0, 'assigned', 'accepted', NULL, '2026-11-01', '08:00 AM - 10:00 AM', '{"street":"6/A, Vauxhall Street","city":"Colombo 02","zipCode":"00200","latitude":6.920932,"longitude":79.852384}', '2026-10-31T15:20:01.114Z', NULL)
ON CONFLICT (id) DO NOTHING;
INSERT INTO pickups (id, customer_id, customer_name, customer_phone, picker_id, picker_name, items_json, total_estimated_weight, total_actual_weight, estimated_points, earned_points, status, picker_status, rejection_reason, scheduled_date, scheduled_time_slot, address_json, created_at, completed_at)
VALUES ('PU-08043', 'CUST-0032', 'Lahiru Silva', '+94 72 484 4172', 'PICK-019', 'Malith Bandara', '[{"category":"glass","materialName":"Glass Bottles & Jars","estimatedWeightKg":2.2,"actualWeightKg":2,"pricePerKgLkr":40,"pointsPerKg":20,"icon":"🫙"},{"category":"e-waste","materialName":"E-Waste & Small Gadgets","estimatedWeightKg":10.6,"actualWeightKg":10,"pricePerKgLkr":400,"pointsPerKg":200,"icon":"💻"},{"category":"metal","materialName":"Metal & Aluminum Cans","estimatedWeightKg":15.1,"actualWeightKg":16,"pricePerKgLkr":250,"pointsPerKg":100,"icon":"🥫"}]', 27.9, 28, 3674, 3640, 'completed', 'completed', NULL, '2026-09-07', '01:00 PM - 03:00 PM', '{"street":"138, Keyzer Street, Pettah","city":"Colombo 11","zipCode":"01100","latitude":6.93686,"longitude":79.859913}', '2026-09-06T15:20:01.114Z', '2026-09-07T19:20:01.114Z')
ON CONFLICT (id) DO NOTHING;
INSERT INTO pickups (id, customer_id, customer_name, customer_phone, picker_id, picker_name, items_json, total_estimated_weight, total_actual_weight, estimated_points, earned_points, status, picker_status, rejection_reason, scheduled_date, scheduled_time_slot, address_json, created_at, completed_at)
VALUES ('PU-08044', 'CUST-0004', 'Sachini Rajapaksa', '+94 77 839 4611', NULL, NULL, '[{"category":"polythene","materialName":"Polythene & LDPE Wrap","estimatedWeightKg":8.1,"actualWeightKg":0,"pricePerKgLkr":80,"pointsPerKg":30,"icon":"🛍️"}]', 8.1, 0, 243, 0, 'pending', 'unassigned', NULL, '2026-09-19', '03:00 PM - 05:00 PM', '{"street":"137, Ward Place, Cinnamon Gardens","city":"Colombo 07","zipCode":"00700","latitude":6.906937,"longitude":79.865283}', '2026-09-18T15:20:01.114Z', NULL)
ON CONFLICT (id) DO NOTHING;
INSERT INTO pickups (id, customer_id, customer_name, customer_phone, picker_id, picker_name, items_json, total_estimated_weight, total_actual_weight, estimated_points, earned_points, status, picker_status, rejection_reason, scheduled_date, scheduled_time_slot, address_json, created_at, completed_at)
VALUES ('PU-08045', 'CUST-0002', 'Supun de Silva', '+94 75 824 3603', 'PICK-024', 'Harshana Jayasinghe', '[{"category":"e-waste","materialName":"E-Waste & Small Gadgets","estimatedWeightKg":8.5,"actualWeightKg":8.2,"pricePerKgLkr":400,"pointsPerKg":200,"icon":"💻"},{"category":"polythene","materialName":"Polythene & LDPE Wrap","estimatedWeightKg":11.9,"actualWeightKg":11.2,"pricePerKgLkr":80,"pointsPerKg":30,"icon":"🛍️"}]', 20.4, 19.4, 2057, 1976, 'completed', 'completed', NULL, '2026-09-12', '10:00 AM - 12:00 PM', '{"street":"138/A, Sri Jayawardenepura Mw","city":"Rajagiriya","zipCode":"10107","latitude":6.905787,"longitude":79.900301}', '2026-09-11T15:20:01.114Z', '2026-09-12T18:20:01.114Z')
ON CONFLICT (id) DO NOTHING;
INSERT INTO pickups (id, customer_id, customer_name, customer_phone, picker_id, picker_name, items_json, total_estimated_weight, total_actual_weight, estimated_points, earned_points, status, picker_status, rejection_reason, scheduled_date, scheduled_time_slot, address_json, created_at, completed_at)
VALUES ('PU-08046', 'CUST-0052', 'Nimalee Karunaratne', '+94 75 306 1203', 'PICK-008', 'Lakshan Jayasinghe', '[{"category":"paper","materialName":"Paper & Cardboard","estimatedWeightKg":13.7,"actualWeightKg":0,"pricePerKgLkr":60,"pointsPerKg":25,"icon":"📰"},{"category":"e-waste","materialName":"E-Waste & Small Gadgets","estimatedWeightKg":13.4,"actualWeightKg":0,"pricePerKgLkr":400,"pointsPerKg":200,"icon":"💻"}]', 27.1, 0, 3023, 0, 'in_progress', 'accepted', NULL, '2026-10-02', '01:00 PM - 03:00 PM', '{"street":"28, Galle Road, Colpetty","city":"Colombo 03","zipCode":"00300","latitude":6.90512,"longitude":79.846281}', '2026-10-01T15:20:01.114Z', NULL)
ON CONFLICT (id) DO NOTHING;
INSERT INTO pickups (id, customer_id, customer_name, customer_phone, picker_id, picker_name, items_json, total_estimated_weight, total_actual_weight, estimated_points, earned_points, status, picker_status, rejection_reason, scheduled_date, scheduled_time_slot, address_json, created_at, completed_at)
VALUES ('PU-08047', 'CUST-0010', 'Priyanka Wickramasinghe', '+94 74 390 1653', 'PICK-019', 'Malith Bandara', '[{"category":"metal","materialName":"Metal & Aluminum Cans","estimatedWeightKg":12.8,"actualWeightKg":0,"pricePerKgLkr":250,"pointsPerKg":100,"icon":"🥫"},{"category":"e-waste","materialName":"E-Waste & Small Gadgets","estimatedWeightKg":4.3,"actualWeightKg":0,"pricePerKgLkr":400,"pointsPerKg":200,"icon":"💻"}]', 17.1, 0, 2140, 0, 'rejected', 'rejected', 'Recyclables wet/soiled with chemical residues', '2026-11-03', '10:00 AM - 12:00 PM', '{"street":"16, Dean''s Road, Maradana","city":"Colombo 10","zipCode":"01000","latitude":6.9311,"longitude":79.872313}', '2026-11-02T15:20:01.114Z', NULL)
ON CONFLICT (id) DO NOTHING;
INSERT INTO pickups (id, customer_id, customer_name, customer_phone, picker_id, picker_name, items_json, total_estimated_weight, total_actual_weight, estimated_points, earned_points, status, picker_status, rejection_reason, scheduled_date, scheduled_time_slot, address_json, created_at, completed_at)
VALUES ('PU-08048', 'CUST-0028', 'Amila Jayawardena', '+94 74 494 8429', 'PICK-010', 'Priyanka Alwis', '[{"category":"paper","materialName":"Paper & Cardboard","estimatedWeightKg":4.7,"actualWeightKg":4.3,"pricePerKgLkr":60,"pointsPerKg":25,"icon":"📰"},{"category":"plastic","materialName":"Plastic (PET & HDPE)","estimatedWeightKg":7,"actualWeightKg":6.9,"pricePerKgLkr":120,"pointsPerKg":50,"icon":"🧴"}]', 11.7, 11.2, 468, 453, 'completed', 'completed', NULL, '2026-10-28', '01:00 PM - 03:00 PM', '{"street":"121, Duplication Road, Bambalapitiya","city":"Colombo 04","zipCode":"00400","latitude":6.896282,"longitude":79.851762}', '2026-10-27T15:20:01.114Z', '2026-10-28T18:20:01.114Z')
ON CONFLICT (id) DO NOTHING;
INSERT INTO pickups (id, customer_id, customer_name, customer_phone, picker_id, picker_name, items_json, total_estimated_weight, total_actual_weight, estimated_points, earned_points, status, picker_status, rejection_reason, scheduled_date, scheduled_time_slot, address_json, created_at, completed_at)
VALUES ('PU-08049', 'CUST-0039', 'Nimalee de Silva', '+94 70 917 7551', NULL, NULL, '[{"category":"paper","materialName":"Paper & Cardboard","estimatedWeightKg":13.7,"actualWeightKg":0,"pricePerKgLkr":60,"pointsPerKg":25,"icon":"📰"},{"category":"polythene","materialName":"Polythene & LDPE Wrap","estimatedWeightKg":6.5,"actualWeightKg":0,"pricePerKgLkr":80,"pointsPerKg":30,"icon":"🛍️"}]', 20.2, 0, 538, 0, 'pending', 'unassigned', NULL, '2026-10-31', '08:00 AM - 10:00 AM', '{"street":"139, Galle Road, Colpetty","city":"Colombo 03","zipCode":"00300","latitude":6.908918,"longitude":79.853311}', '2026-10-30T15:20:01.114Z', NULL)
ON CONFLICT (id) DO NOTHING;
INSERT INTO pickups (id, customer_id, customer_name, customer_phone, picker_id, picker_name, items_json, total_estimated_weight, total_actual_weight, estimated_points, earned_points, status, picker_status, rejection_reason, scheduled_date, scheduled_time_slot, address_json, created_at, completed_at)
VALUES ('PU-08050', 'CUST-0071', 'Dilshan de Silva', '+94 75 469 8322', 'PICK-006', 'Kasun Wickramasinghe', '[{"category":"metal","materialName":"Metal & Aluminum Cans","estimatedWeightKg":6.5,"actualWeightKg":0,"pricePerKgLkr":250,"pointsPerKg":100,"icon":"🥫"}]', 6.5, 0, 650, 0, 'assigned', 'accepted', NULL, '2026-09-10', '03:00 PM - 05:00 PM', '{"street":"32, Chatham Street","city":"Colombo 01","zipCode":"00100","latitude":6.936333,"longitude":79.84486}', '2026-09-09T15:20:01.114Z', NULL)
ON CONFLICT (id) DO NOTHING;

-- 5. ESG CORPORATE & MUNICIPAL AUDIT METRICS
INSERT INTO esg_reports (id, label, value, note) VALUES
('ESG-01', 'CO2 Emissions Avoided', '8.44 Tons', 'Calculated using IPCC factor of 2.85 kg CO2 avoided per kg of verified recycled waste'),
('ESG-02', 'Trees Equivalent Offset', '703 Mature Trees', 'Equivalent mature tree annual carbon absorption rate (~12 kg CO2/year)'),
('ESG-03', 'Municipal Landfill Diversion Rate', '96.7%', 'Direct diversion percentage from Colombo Meethotamulla & Karadiyana disposal facilities'),
('ESG-04', 'Total Recyclables Diverted', '2.96 Tons', 'Verified doorstep digital scale payload across Western Province')
ON CONFLICT (id) DO UPDATE SET value = EXCLUDED.value, note = EXCLUDED.note;
