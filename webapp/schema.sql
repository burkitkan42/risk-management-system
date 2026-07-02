-- СУР: схема для PostgreSQL (production). Выполните один раз на пустой базе.

CREATE TABLE IF NOT EXISTS risks (
  id TEXT PRIMARY KEY,
  category TEXT NOT NULL,
  name TEXT NOT NULL,
  cause TEXT NOT NULL,
  consequence TEXT NOT NULL,
  owner TEXT NOT NULL,
  date_found DATE NOT NULL,
  inherent_probability INTEGER NOT NULL CHECK (inherent_probability BETWEEN 1 AND 5),
  inherent_impact INTEGER NOT NULL CHECK (inherent_impact BETWEEN 1 AND 5),
  existing_controls TEXT NOT NULL DEFAULT '',
  control_effectiveness TEXT NOT NULL,
  residual_probability INTEGER NOT NULL CHECK (residual_probability BETWEEN 1 AND 5),
  residual_impact INTEGER NOT NULL CHECK (residual_impact BETWEEN 1 AND 5),
  strategy TEXT NOT NULL,
  status TEXT NOT NULL,
  next_review_date DATE NOT NULL
);

CREATE TABLE IF NOT EXISTS treatment_actions (
  id TEXT PRIMARY KEY,
  risk_id TEXT NOT NULL REFERENCES risks(id) ON DELETE CASCADE,
  action TEXT NOT NULL,
  owner TEXT NOT NULL,
  resources TEXT NOT NULL DEFAULT '',
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  kri TEXT NOT NULL DEFAULT '',
  target_residual_level INTEGER NOT NULL,
  status TEXT NOT NULL,
  progress_pct INTEGER NOT NULL DEFAULT 0,
  comment TEXT NOT NULL DEFAULT ''
);

CREATE INDEX IF NOT EXISTS idx_treatment_actions_risk_id ON treatment_actions(risk_id);
