CREATE TABLE auth_sessions (
  id TEXT NOT NULL PRIMARY KEY,
  expires_at DATETIME NOT NULL,
  
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

  user_id INTEGER NOT NULL,
  CONSTRAINT auth_sessions_user_id_fkey FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE
);

