CREATE DATABASE IF NOT EXISTS db_keps_assistant_initial;
CREATE DATABASE IF NOT EXISTS db_keps_assistant_alor;
CREATE DATABASE IF NOT EXISTS db_keps_assistant_keps;

GRANT ALL PRIVILEGES ON db_keps_assistant_initial.* TO 'root'@'localhost' IDENTIFIED BY 'kepsAssistantDatabase123@#%__';
GRANT ALL PRIVILEGES ON db_keps_assistant_alor.* TO 'root'@'localhost' IDENTIFIED BY 'kepsAssistantDatabase123@#%__';
GRANT ALL PRIVILEGES ON db_keps_assistant_keps.* TO 'root'@'localhost' IDENTIFIED BY 'kepsAssistantDatabase123@#%__';

FLUSH PRIVILEGES;