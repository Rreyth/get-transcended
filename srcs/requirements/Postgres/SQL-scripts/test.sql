CREATE TABLE users (
	id SERIAL PRIMARY KEY,
	pseudo VARCHAR(25) NOT NULL,
	avatar TEXT,
	email VARCHAR(255) NOT NULL
);

INSERT INTO users (pseudo, email) VALUES ('TEST_USER', 'TEST_EMAIL');

CREATE FUNCTION get_all_user() RETURN TABLE (users_pseudo VARCHAR) AS $$
	BEGIN
		RETURN QUERY SELECT pseudo FROM user;
	END;
$$ LANGUAGE plpgsql;
