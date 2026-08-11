CREATE TABLE customers (
    id SERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    birth_date DATE,
    active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO customers (
    name,
    email,
    birth_date,
    active
)
VALUES
(
    'Ana Souza',
    'ANA.SOUZA@EMAIL.COM',
    '1995-04-12',
    TRUE
),
(
    'Carlos Oliveira',
    'carlos@email.com',
    '1988-11-23',
    TRUE
),
(
    'Mariana Lima',
    '  mariana lima  ',
    '2000-07-05',
    FALSE
);