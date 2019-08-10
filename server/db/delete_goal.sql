DELETE FROM notes
WHERE id = $1;

DELETE FROM tasks
WHERE id = $1;

DELETE FROM goals
WHERE id = $1;