-- name: GetStatus :one
SELECT reading, message, reading_updated_at, message_updated_at FROM status WHERE id = 1;

-- name: UpdateReading :exec
UPDATE status SET reading = ?, reading_updated_at = CURRENT_TIMESTAMP WHERE id = 1;

-- name: UpdateMessage :exec
UPDATE status SET message = ?, message_updated_at = CURRENT_TIMESTAMP WHERE id = 1;
