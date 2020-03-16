set -e

psql -U $POSTGRES_USER $POSTGRES_USER << EOSQL
//DROP DATABASE IF EXISTS $POSTGRES_DB;
CREATE DATABASE $POSTGRES_DB;
EOSQL

psql -U $POSTGRES_USER -d $POSTGRES_DB << EOSQL
CREATE TABLE users(
  account_id        SERIAL PRIMARY KEY,
  account_name      VARCHAR(20),
  email             VARCHAR(100),
  password    CHAR(64)
);
EOSQL

# CREATE TABLE user_status(
#   status            VARCHAR(20) PRIMARY KEY
# );
# EOSQL
