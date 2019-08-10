DELETE FROM tasks
WHERE goal_id = ANY(${goalIds});

DELETE FROM notes
WHERE goal_id = ANY(${goalIds});

DELETE FROM goals
WHERE project_id = ${projectId};

DELETE FROM projects_users
WHERE project_id = ${projectId};

DELETE FROM projects
WHERE id = ${projectId};