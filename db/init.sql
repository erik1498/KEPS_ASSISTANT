CREATE DATABASE IF NOT EXISTS db_keps_assistant_initial;
CREATE DATABASE IF NOT EXISTS db_keps_assistant_alor;
CREATE DATABASE IF NOT EXISTS db_keps_assistant_keps;

CREATE USER 'kepsAssistantUserDB123@#%__'@'172.30.0.3' IDENTIFIED BY 'kepsAssistantPassDB123@#%__';

GRANT ALL PRIVILEGES ON *.* TO 'root'@'%' IDENTIFIED BY 'kepsAssistantDatabasePassword123@#%__';

GRANT SELECT, UPDATE ON db_keps_assistant_initial.* TO 'kepsAssistantUserDB123@#%__'@'172.30.0.3' IDENTIFIED BY 'kepsAssistantPassDB123@#%__';
GRANT SELECT, UPDATE ON db_keps_assistant_alor.* TO 'kepsAssistantUserDB123@#%__'@'172.30.0.3' IDENTIFIED BY 'kepsAssistantPassDB123@#%__';
GRANT SELECT, UPDATE ON db_keps_assistant_keps.* TO 'kepsAssistantUserDB123@#%__'@'172.30.0.3' IDENTIFIED BY 'kepsAssistantPassDB123@#%__';

FLUSH PRIVILEGES;