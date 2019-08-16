SELECT * FROM projects_users 
JOIN projects ON projects.id = projects_users.project_id 
JOIN users ON users.id = projects_users.user_id 
WHERE project_id = $1;