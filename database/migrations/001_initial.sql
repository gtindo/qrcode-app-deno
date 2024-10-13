CREATE TABLE users (
    id INTEGER NOT NULL PRIMARY KEY ASC,
    username TEXT NOT NULL,
    first_name TEXT,
    last_name TEXT,
    email TEXT,
    password_hash TEXT NOT NULL,
    password_salt TEXT NOT NULL,
    is_admin BOOLEAN NOT NULL DEFAULT false,
    max_api_keys INTEGER DEFAULT 5,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL
);

CREATE TABLE api_keys (
    id INTEGER NOT NULL PRIMARY KEY ASC,
    name TEXT,
    value TEXT NOT NULL,
    max_usage INTEGER DEFAULT 2000,
    current_usage INTEGER NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL,
    
    owner_id INTEGER NOT NULL,
    CONSTRAINT api_keys_owner_id_fkey FOREIGN KEY (owner_id) REFERENCES users (id) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE UNIQUE INDEX user_username_key ON users(username);

CREATE UNIQUE INDEX user_email_key ON users(email);

CREATE UNIQUE INDEX api_keys_value_key ON api_keys(value);
