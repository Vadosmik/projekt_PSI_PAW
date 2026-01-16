CREATE SCHEMA project_php;

-- Tabela użytkowników
CREATE TABLE project_php.users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Tabela kategorii (powiązana z użytkownikiem)
CREATE TABLE project_php.categories (
  id SERIAL PRIMARY KEY,
  user_id INT NOT NULL REFERENCES project_php.users(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL
);

-- Tabela wyjazdów
CREATE TABLE project_php.trips (
  id SERIAL PRIMARY KEY,
  author_id INT NOT NULL REFERENCES project_php.users(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  departure_date DATE,
  is_visited BOOLEAN DEFAULT TRUE, -- Status wyjazdu (aktywny/archiwalny)
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Tabela przedmiotów
CREATE TABLE project_php.items (
  id SERIAL PRIMARY KEY,
  trip_id INT NOT NULL REFERENCES project_php.trips(id) ON DELETE CASCADE,
  category_id INT NOT NULL REFERENCES project_php.categories(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  is_packed BOOLEAN DEFAULT FALSE -- Status: spakowane (true) lub nie (false)
);

-- Tabela miejsc do odwiedzenia
CREATE TABLE project_php.placestovisit (
  id SERIAL PRIMARY KEY,
  trip_id INT NOT NULL REFERENCES project_php.trips(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  img VARCHAR(255),
  description TEXT,
  is_visited BOOLEAN DEFAULT FALSE -- Status: odwiedzone (true) lub nie (false)
);
