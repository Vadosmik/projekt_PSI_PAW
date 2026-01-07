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

-- data for test
-- 1. Dodanie Użytkowników
INSERT INTO project_php.users (username, email, password_hash) VALUES
('adam_podroznik', 'adam@example.com', 'hash_hasla_123'),
('ewa_travel', 'ewa@example.com', 'hash_hasla_456');

-- 2. Dodanie Kategorii (powiązanych z użytkownikami)
-- Przyjmujemy: ID 1 to Adam, ID 2 to Ewa
INSERT INTO project_php.categories (user_id, title) VALUES
(1, 'Dokumenty'),
(1, 'Elektronika'),
(2, 'Ubrania'),
(2, 'Kosmetyki');

-- 3. Dodanie Wyjazdów (Trips)
-- Przyjmujemy: Adam (ID 1) jedzie do Rzymu i Berlina, Ewa (ID 2) jedzie w Tatry
INSERT INTO project_php.trips (author_id, title, description, departure_date, is_visited) VALUES
(1, 'Majówka w Rzymie', 'Zwiedzanie zabytków i jedzenie pizzy', '2025-05-01', false),
(1, 'Weekend w Berlinie', 'Jarmark i muzea', '2025-12-10', false),
(2, 'Wędrówka Tatry', 'Wyjście na Rysy i Morskie Oko', '2025-08-15', false);

-- 4. Dodanie Miejsc do odwiedzenia (PlacesToVisit)
-- Powiązane z Trip ID 1 (Rzym) i Trip ID 3 (Tatry)
INSERT INTO project_php.placestovisit (trip_id, title, img, description, is_visited) VALUES
(1, 'Koloseum', 'koloseum.jpg', 'Antyczny amfiteatr', false),
(1, 'Fontanna di Trevi', 'trevi.jpg', 'Wrzucenie monety na szczęście', false),
(3, 'Morskie Oko', 'tatry1.jpg', 'Piękne jezioro w górach', false);

-- 5. Dodanie Przedmiotów (Items)
-- Powiązane z konkretnym wyjazdem i kategorią
-- Adam do Rzymu (Trip 1) bierze Paszport (Kat 1) i Ładowarkę (Kat 2)
-- Ewa w Tatry (Trip 3) bierze Kurtkę (Kat 3)
INSERT INTO project_php.items (trip_id, category_id, title, is_packed) VALUES
(1, 1, 'Paszport', true),
(1, 2, 'Ładowarka do telefonu', false),
(3, 3, 'Kurtka przeciwdeszczowa', true);