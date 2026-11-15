CREATE TABLE IF NOT EXISTS users (
 id UUID PRIMARY KEY, name TEXT NOT NULL, phone TEXT UNIQUE NOT NULL, email TEXT UNIQUE,
 password_hash TEXT NOT NULL, role TEXT NOT NULL CHECK(role IN ('customer','picker','admin')),
 address TEXT NOT NULL DEFAULT '', latitude DOUBLE PRECISION, longitude DOUBLE PRECISION,
 active BOOLEAN NOT NULL DEFAULT true, created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS materials (
 category TEXT PRIMARY KEY CHECK(category IN ('plastic','glass','polythene','metal')),
 name TEXT NOT NULL, points_per_kg NUMERIC(12,2) NOT NULL CHECK(points_per_kg>=0), updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS pickups (
 id UUID PRIMARY KEY, customer_id UUID NOT NULL REFERENCES users(id), picker_id UUID REFERENCES users(id),
 address TEXT NOT NULL, latitude DOUBLE PRECISION NOT NULL CHECK(latitude BETWEEN -90 AND 90),
 longitude DOUBLE PRECISION NOT NULL CHECK(longitude BETWEEN -180 AND 180),
 status TEXT NOT NULL DEFAULT 'pending' CHECK(status IN ('pending','assigned','in_progress','review_required','completed','cancelled')),
 notes TEXT NOT NULL DEFAULT '', earned_points NUMERIC(14,2) NOT NULL DEFAULT 0,
 gps_latitude DOUBLE PRECISION, gps_longitude DOUBLE PRECISION, gps_accuracy DOUBLE PRECISION,
 distance_meters DOUBLE PRECISION, review_reason TEXT, reviewed_by UUID REFERENCES users(id),
 review_note TEXT, created_at TIMESTAMPTZ NOT NULL DEFAULT now(), completed_at TIMESTAMPTZ
);
CREATE INDEX IF NOT EXISTS pickups_customer_idx ON pickups(customer_id,created_at DESC);
CREATE INDEX IF NOT EXISTS pickups_picker_idx ON pickups(picker_id,status);
CREATE TABLE IF NOT EXISTS pickup_items (
 pickup_id UUID NOT NULL REFERENCES pickups(id), category TEXT NOT NULL REFERENCES materials(category),
 estimated_weight NUMERIC(10,2) NOT NULL CHECK(estimated_weight>0),
 actual_weight NUMERIC(10,2) CHECK(actual_weight>=0), rate_snapshot NUMERIC(12,2), points NUMERIC(14,2),
 PRIMARY KEY(pickup_id,category)
);
CREATE TABLE IF NOT EXISTS evidence (
 id UUID PRIMARY KEY, pickup_id UUID NOT NULL REFERENCES pickups(id), uploaded_by UUID NOT NULL REFERENCES users(id),
 filename TEXT NOT NULL, mime_type TEXT NOT NULL, created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS wallets (
 user_id UUID PRIMARY KEY REFERENCES users(id), balance NUMERIC(14,2) NOT NULL DEFAULT 0 CHECK(balance>=0)
);
CREATE TABLE IF NOT EXISTS wallet_transactions (
 id UUID PRIMARY KEY, user_id UUID NOT NULL REFERENCES users(id), pickup_id UUID UNIQUE NOT NULL REFERENCES pickups(id),
 points NUMERIC(14,2) NOT NULL CHECK(points>0), created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS badges (
 id UUID PRIMARY KEY, name TEXT NOT NULL, criterion TEXT NOT NULL CHECK(criterion IN ('weight','collections','diversity')),
 threshold NUMERIC(12,2) NOT NULL CHECK(threshold>0), description TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS user_badges (
 user_id UUID NOT NULL REFERENCES users(id), badge_id UUID NOT NULL REFERENCES badges(id),
 awarded_at TIMESTAMPTZ NOT NULL DEFAULT now(), PRIMARY KEY(user_id,badge_id)
);
CREATE TABLE IF NOT EXISTS notifications (
 id UUID PRIMARY KEY, user_id UUID NOT NULL REFERENCES users(id), pickup_id UUID REFERENCES pickups(id),
 title TEXT NOT NULL, message TEXT NOT NULL, is_read BOOLEAN NOT NULL DEFAULT false, created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS device_tokens (
 token TEXT PRIMARY KEY, user_id UUID NOT NULL REFERENCES users(id), updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS settings (key TEXT PRIMARY KEY, value TEXT NOT NULL);
INSERT INTO settings VALUES ('gps_radius_meters','150') ON CONFLICT DO NOTHING;
INSERT INTO materials(category,name,points_per_kg) VALUES ('plastic','Plastic',50),('glass','Glass',15),('polythene','Polythene',20),('metal','Metal',70) ON CONFLICT DO NOTHING;
