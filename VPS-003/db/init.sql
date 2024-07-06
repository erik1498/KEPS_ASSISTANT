CREATE DATABASE IF NOT EXISTS db_keps_assistant;
CREATE DATABASE IF NOT EXISTS db_logging_keps_assistant;

CREATE USER 'kepsAssistantUserDB123@#%__'@'%' IDENTIFIED BY 'kepsAssistantPassDB123@#%__';

GRANT ALL PRIVILEGES ON *.* TO 'root'@'%' IDENTIFIED BY 'kepsAssistantDatabasePassword123@#%__';

USE db_keps_assistant;
SOURCE /initial_database/db_keps_assistant_initial.sql;

USE db_logging_keps_assistant;
SOURCE /initial_database/db_logging_keps_assistant_initial.sql;

GRANT INSERT, SELECT, UPDATE ON db_keps_assistant.jurnal_umum_tab TO 'kepsAssistantUserDB123@#%__'@'%' IDENTIFIED BY 'kepsAssistantPassDB123@#%__';
GRANT INSERT, SELECT, UPDATE ON db_keps_assistant.kode_akun_perkiraan_tab TO 'kepsAssistantUserDB123@#%__'@'%' IDENTIFIED BY 'kepsAssistantPassDB123@#%__';
GRANT INSERT, SELECT, UPDATE ON db_keps_assistant.user_tab TO 'kepsAssistantUserDB123@#%__'@'%' IDENTIFIED BY 'kepsAssistantPassDB123@#%__';
GRANT SELECT, DELETE ON db_keps_assistant.neraca_tab TO 'kepsAssistantUserDB123@#%__'@'%' IDENTIFIED BY 'kepsAssistantPassDB123@#%__';
GRANT INSERT ON db_logging_keps_assistant.logger_tab TO 'kepsAssistantUserDB123@#%__'@'%' IDENTIFIED BY 'kepsAssistantPassDB123@#%__';

FLUSH PRIVILEGES;