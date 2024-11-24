CREATE DATABASE IF NOT EXISTS db_keps_assistant_[cliet_id];
CREATE DATABASE IF NOT EXISTS db_keps_assistant_logging_[cliet_id];

CREATE USER 'kepsAssistantUserDB123@#%__'@'%' IDENTIFIED BY 'kepsAssistantPassDB123@#%__';

GRANT ALL PRIVILEGES ON *.* TO 'kepsAssistantRootDB123@#%__'@'%' IDENTIFIED BY 'kepsAssistantDatabasePassword123@#%__';

USE db_keps_assistant_[cliet_id];
SOURCE /initial_database/db_keps_assistant_initial.sql;

USE db_keps_assistant_logging_[cliet_id];
SOURCE /initial_database/db_logging_keps_assistant_initial.sql;


GRANT INSERT ON db_keps_assistant_logging_[cliet_id].logger_tab TO 'kepsAssistantUserDB123@#%__'@'%' IDENTIFIED BY 'kepsAssistantPassDB123@#%__';
GRANT INSERT, SELECT, UPDATE ON db_keps_assistant_[cliet_id].* TO 'kepsAssistantUserDB123@#%__'@'%' IDENTIFIED BY 'kepsAssistantPassDB123@#%__';

FLUSH PRIVILEGES;