CREATE DATABASE chatling;

-- 'sessions' table is created by 'express-session' package...
-- 'sid' is its primary key, which is used as foreign key in following 'chats' table

CREATE TABLE chats(
  sid VARCHAR(64) NOT NULL,
  message TEXT NOT NULL,
  epoch_time BIGINT NOT NULL,
  is_admin BOOLEAN DEFAULT FALSE,
  FOREIGN KEY(sid)
  REFERENCES sessions(sid)
  ON DELETE CASCADE
);