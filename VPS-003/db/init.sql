CREATE DATABASE IF NOT EXISTS db_keps_assistant_duta_multi_computer;
CREATE DATABASE IF NOT EXISTS db_keps_assistant_logging_duta_multi_computer;

CREATE USER 'kepsAssistantUserDB123@#%__'@'%' IDENTIFIED BY 'kepsAssistantPassDB123@#%__';

GRANT ALL PRIVILEGES ON *.* TO 'kepsAssistantRootDB123@#%__'@'%' IDENTIFIED BY 'kepsAssistantDatabasePassword123@#%__';

USE db_keps_assistant_duta_multi_computer;
SOURCE /initial_database/db_keps_assistant_initial.sql;

USE db_keps_assistant_logging_duta_multi_computer;
SOURCE /initial_database/db_logging_keps_assistant_initial.sql;

GRANT INSERT, SELECT, UPDATE ON db_keps_assistant_duta_multi_computer.jurnal_umum_tab TO 'kepsAssistantUserDB123@#%__'@'%' IDENTIFIED BY 'kepsAssistantPassDB123@#%__';
GRANT INSERT, SELECT, UPDATE ON db_keps_assistant_duta_multi_computer.kode_akun_perkiraan_tab TO 'kepsAssistantUserDB123@#%__'@'%' IDENTIFIED BY 'kepsAssistantPassDB123@#%__';
GRANT SELECT ON db_keps_assistant_duta_multi_computer.user_tab TO 'kepsAssistantUserDB123@#%__'@'%' IDENTIFIED BY 'kepsAssistantPassDB123@#%__';
GRANT SELECT, DELETE ON db_keps_assistant_duta_multi_computer.neraca_tab TO 'kepsAssistantUserDB123@#%__'@'%' IDENTIFIED BY 'kepsAssistantPassDB123@#%__';
GRANT INSERT ON db_keps_assistant_logging_duta_multi_computer.logger_tab TO 'kepsAssistantUserDB123@#%__'@'%' IDENTIFIED BY 'kepsAssistantPassDB123@#%__';

FLUSH PRIVILEGES;