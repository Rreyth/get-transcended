CREATE TABLE users (
	id SERIAL PRIMARY KEY,
	pseudo VARCHAR(25) NOT NULL,
	avatar TEXT,
	email VARCHAR(255) NOT NULL,
	password TEXT NOT NULL,
	bot boolean,
	create_at timestamp NOT NULL DEFAULT NOW(),
	updated_at timestamp NOT NULL DEFAULT NOW()
);

CREATE TYPE pub_users AS (
	id INT,
	pseudo VARCHAR(25),
	avatar TEXT,
	email VARCHAR(255),
	bot boolean,
	create_at timestamp
);

INSERT INTO users (pseudo, email, password, bot) VALUES ('TEST_USER', 'TEST_EMAIL', 'TEST_PASSWORD', true);
