-- EcoCollect PostgreSQL schema
-- Applied by `npm run db:migrate` (drops and recreates every table).

DROP TABLE IF EXISTS redemptions, wallet_transactions, wallets, notifications, saved_addresses,
  pickups, badges, rewards, material_rates, esg_reports, users CASCADE;

CREATE TABLE users (
  id               VARCHAR(50)  PRIMARY KEY,
  name             VARCHAR(100) NOT NULL,
  email            VARCHAR(150) NOT NULL UNIQUE,
  phone            VARCHAR(30),
  role             VARCHAR(20)  NOT NULL CHECK (role IN ('customer', 'picker', 'admin')),
  password_hash    TEXT         NOT NULL,
  avatar_url       TEXT,
  street           VARCHAR(255),
  city             VARCHAR(100),
  zip_code         VARCHAR(20),
  latitude         NUMERIC(9, 6),
  longitude        NUMERIC(9, 6),
  rating           NUMERIC(3, 2) DEFAULT 5.00,
  vehicle_number   VARCHAR(50),
  vehicle_type     VARCHAR(50),
  is_active        BOOLEAN      NOT NULL DEFAULT TRUE,
  created_at       TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_users_role ON users(role);

CREATE TABLE material_rates (
  id                VARCHAR(50)   PRIMARY KEY,
  category          VARCHAR(50)   NOT NULL UNIQUE,
  material_name     VARCHAR(100)  NOT NULL,
  price_per_kg_lkr  NUMERIC(10, 2) NOT NULL CHECK (price_per_kg_lkr >= 0),
  points_per_kg     INT           NOT NULL CHECK (points_per_kg >= 0),
  icon              VARCHAR(20)   NOT NULL DEFAULT '♻️',
  updated_at        TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

CREATE TABLE pickups (
  id                      VARCHAR(50)   PRIMARY KEY,
  customer_id             VARCHAR(50)   NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  picker_id               VARCHAR(50)   REFERENCES users(id) ON DELETE SET NULL,
  items_json              JSONB         NOT NULL,
  total_estimated_weight  NUMERIC(10, 2) NOT NULL CHECK (total_estimated_weight > 0),
  total_actual_weight     NUMERIC(10, 2) NOT NULL DEFAULT 0,
  estimated_points        INT           NOT NULL DEFAULT 0,
  earned_points           INT           NOT NULL DEFAULT 0,
  estimated_value_lkr     NUMERIC(10, 2) NOT NULL DEFAULT 0,
  picker_commission_lkr   NUMERIC(10, 2) NOT NULL DEFAULT 0,
  status                  VARCHAR(30)   NOT NULL DEFAULT 'pending'
                          CHECK (status IN ('pending', 'assigned', 'in_progress', 'completed', 'cancelled')),
  picker_status           VARCHAR(30)   CHECK (picker_status IN ('assigned', 'accepted', 'rejected', 'completed')),
  rejection_reason        TEXT,
  scheduled_date          DATE          NOT NULL,
  scheduled_time_slot     VARCHAR(50)   NOT NULL,
  address_json            JSONB         NOT NULL,
  notes                   TEXT,
  created_at              TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
  assigned_at             TIMESTAMPTZ,
  accepted_at             TIMESTAMPTZ,
  completed_at            TIMESTAMPTZ
);
CREATE INDEX idx_pickups_customer ON pickups(customer_id);
CREATE INDEX idx_pickups_picker   ON pickups(picker_id);
CREATE INDEX idx_pickups_status   ON pickups(status);

CREATE TABLE wallets (
  id                     VARCHAR(50) PRIMARY KEY,
  user_id                VARCHAR(50) NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  total_points           INT NOT NULL DEFAULT 0 CHECK (total_points >= 0),
  total_earned_points    INT NOT NULL DEFAULT 0,
  total_redeemed_points  INT NOT NULL DEFAULT 0
);

CREATE TABLE rewards (
  id               VARCHAR(50)  PRIMARY KEY,
  title            VARCHAR(255) NOT NULL,
  description      TEXT,
  points_required  INT          NOT NULL CHECK (points_required > 0),
  category         VARCHAR(30)  NOT NULL DEFAULT 'voucher',
  partner_name     VARCHAR(100) NOT NULL,
  icon             VARCHAR(20)  NOT NULL DEFAULT '🎁',
  color            VARCHAR(20)  NOT NULL DEFAULT '#10B981',
  expiry_date      DATE         NOT NULL,
  is_active        BOOLEAN      NOT NULL DEFAULT TRUE,
  created_at       TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE TABLE wallet_transactions (
  id          VARCHAR(60)  PRIMARY KEY,
  wallet_id   VARCHAR(50)  NOT NULL REFERENCES wallets(id) ON DELETE CASCADE,
  user_id     VARCHAR(50)  NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type        VARCHAR(20)  NOT NULL CHECK (type IN ('earn', 'redeem', 'bonus')),
  title       VARCHAR(255) NOT NULL,
  points      INT          NOT NULL,
  icon        VARCHAR(20)  NOT NULL DEFAULT '♻️',
  pickup_id   VARCHAR(50)  REFERENCES pickups(id) ON DELETE SET NULL,
  reward_id   VARCHAR(50)  REFERENCES rewards(id) ON DELETE SET NULL,
  created_at  TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_tx_user ON wallet_transactions(user_id, created_at DESC);

CREATE TABLE redemptions (
  id             VARCHAR(60) PRIMARY KEY,
  user_id        VARCHAR(50) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  reward_id      VARCHAR(50) NOT NULL REFERENCES rewards(id),
  points_spent   INT         NOT NULL,
  mobile_number  VARCHAR(30),
  status         VARCHAR(20) NOT NULL DEFAULT 'completed',
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE badges (
  id                     VARCHAR(50)  PRIMARY KEY,
  name                   VARCHAR(100) NOT NULL,
  description            TEXT,
  icon                   VARCHAR(20)  NOT NULL DEFAULT '🏅',
  required_recycled_kg   NUMERIC(10, 2) NOT NULL DEFAULT 0,
  criteria               TEXT,
  perks_and_multipliers  TEXT,
  created_at             TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE TABLE saved_addresses (
  id          VARCHAR(50)  PRIMARY KEY,
  user_id     VARCHAR(50)  NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title       VARCHAR(100) NOT NULL,
  street      VARCHAR(255) NOT NULL,
  city        VARCHAR(100) NOT NULL,
  latitude    NUMERIC(9, 6),
  longitude   NUMERIC(9, 6),
  is_default  BOOLEAN      NOT NULL DEFAULT FALSE
);

CREATE TABLE notifications (
  id          VARCHAR(60)  PRIMARY KEY,
  user_id     VARCHAR(50)  NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title       VARCHAR(255) NOT NULL,
  message     TEXT         NOT NULL,
  is_read     BOOLEAN      NOT NULL DEFAULT FALSE,
  created_at  TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_notif_user ON notifications(user_id, created_at DESC);

CREATE TABLE esg_reports (
  id     VARCHAR(50)  PRIMARY KEY,
  label  VARCHAR(255) NOT NULL,
  value  VARCHAR(100) NOT NULL,
  note   TEXT         NOT NULL,
  sort   INT          NOT NULL DEFAULT 0
);
