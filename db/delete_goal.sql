DELETE FROM notes
WHERE goal_id = $1;

DELETE FROM tasks
WHERE goal_id = $1;

DELETE FROM goals
WHERE id = $1;