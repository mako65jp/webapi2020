CREATE TABLE users(
  account_id        SERIAL PRIMARY KEY,
  account_name      VARCHAR(20),
  email             VARCHAR(100),
  password    CHAR(64)
);
