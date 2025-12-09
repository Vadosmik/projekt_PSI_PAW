CREATE SCHEMA project_java;
CREATE SCHEMA project_php;


CREATE TABLE project_java.users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE project_java.trips (
  id SERIAL PRIMARY KEY,
  author_id INT NOT NULL REFERENCES project_java.users(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  departure_date DATE,
  status VARCHAR(50),
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE project_java.categories (
  id SERIAL PRIMARY KEY,
  trip_id INT NOT NULL REFERENCES project_java.trips(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  status VARCHAR(50)
);

CREATE TABLE project_java.items (
  id SERIAL PRIMARY KEY,
  category_id INT NOT NULL REFERENCES project_java.categories(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  status VARCHAR(50)
);

CREATE TABLE project_java.placestovisit (
  id SERIAL PRIMARY KEY,
  trip_id INT NOT NULL REFERENCES project_java.trips(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  img VARCHAR(255),
  description TEXT,
  status VARCHAR(50)
);