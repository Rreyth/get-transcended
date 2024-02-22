CREATE OR REPLACE FUNCTION create_users(p_pseudo VARCHAR(25), p_email VARCHAR(255), p_password TEXT) RETURNS void AS $$
	BEGIN
		INSERT INTO users (pseudo, email, password, create_at, updated_at) VALUES (p_pseudo, p_email, p_password);
	END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION change_users(p_user_id INT, p_pseudo VARCHAR(25), p_email VARCHAR(255), p_password TEXT) RETURNS void AS $$
	BEGIN
		UPDATE users
		SET pseudo = p_pseudo, email = p_email, password = p_password, updated_at = NOW()
		WHERE id = p_user_id;
	END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION get_users(p_user_id INT) RETURNS pub_users AS $$
	DECLARE
		result pub_users;
		temp users;
	BEGIN
		SELECT id, pseudo, avatar, email, bot, create_at INTO result FROM users WHERE id = p_user_id;
		RETURN result;
	END;
$$ LANGUAGE plpgsql;

