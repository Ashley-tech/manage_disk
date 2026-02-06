CREATE TABLE utilisateur (
    id bigserial PRIMARY KEY,
    nom VARCHAR(50) NOT NULL,
    prenom VARCHAR(25) NOT NULL,
    email VARCHAR(100) NOT NULL,
    password VARCHAR(175) NOT NULL,
    password_crypted VARCHAR(350) NOT NULL
);

CREATE TABLE disque (
    id bigserial PRIMARY KEY,
    nom VARCHAR(50),
    espace_imaginaire NUMERIC(5,2) NOT NULL DEFAULT 0,  -- type décimal pour avoir des valeurs avec virgule
    utilisateur BIGINT REFERENCES utilisateur(id),
    CONSTRAINT eic CHECK (espace_imaginaire >= 0)
);
