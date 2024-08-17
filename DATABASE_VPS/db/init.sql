CREATE DATABASE IF NOT EXISTS db_keps_assistant_[client_id];
CREATE DATABASE IF NOT EXISTS db_keps_assistant_logging_[client_id];

CREATE USER 'kepsAssistantUserDB123@#%__'@'%' IDENTIFIED BY 'kepsAssistantPassDB123@#%__';

GRANT ALL PRIVILEGES ON *.* TO 'kepsAssistantRootDB123@#%__'@'%' IDENTIFIED BY 'kepsAssistantDatabasePassword123@#%__';

USE db_keps_assistant_[client_id];
SOURCE /initial_database/db_keps_assistant_initial.sql;

USE db_keps_assistant_logging_[client_id];
SOURCE /initial_database/db_logging_keps_assistant_initial.sql;

GRANT INSERT, SELECT, UPDATE ON db_keps_assistant_[client_id].jurnal_umum_tab TO 'kepsAssistantUserDB123@#%__'@'%' IDENTIFIED BY 'kepsAssistantPassDB123@#%__';
GRANT INSERT, SELECT, UPDATE ON db_keps_assistant_[client_id].kode_akun_perkiraan_tab TO 'kepsAssistantUserDB123@#%__'@'%' IDENTIFIED BY 'kepsAssistantPassDB123@#%__';
GRANT SELECT ON db_keps_assistant_[client_id].user_tab TO 'kepsAssistantUserDB123@#%__'@'%' IDENTIFIED BY 'kepsAssistantPassDB123@#%__';
GRANT SELECT, INSERT, DELETE ON db_keps_assistant_[client_id].neraca_tab TO 'kepsAssistantUserDB123@#%__'@'%' IDENTIFIED BY 'kepsAssistantPassDB123@#%__';
GRANT INSERT ON db_keps_assistant_logging_[client_id].logger_tab TO 'kepsAssistantUserDB123@#%__'@'%' IDENTIFIED BY 'kepsAssistantPassDB123@#%__';


GRANT INSERT, SELECT, UPDATE ON db_keps_assistant_[client_id].aktivitas_dokumen_tab TO 'kepsAssistantUserDB123@#%__'@'%' IDENTIFIED BY 'kepsAssistantPassDB123@#%__';
GRANT INSERT, SELECT, UPDATE ON db_keps_assistant_[client_id].dokumen_klien_tab TO 'kepsAssistantUserDB123@#%__'@'%' IDENTIFIED BY 'kepsAssistantPassDB123@#%__';
GRANT INSERT, SELECT, UPDATE ON db_keps_assistant_[client_id].riwayat_aktivitas_dokumen_tab TO 'kepsAssistantUserDB123@#%__'@'%' IDENTIFIED BY 'kepsAssistantPassDB123@#%__';
GRANT INSERT, SELECT, UPDATE ON db_keps_assistant_[client_id].riwayat_pembayaran_aktivitas_dokumen_tab TO 'kepsAssistantUserDB123@#%__'@'%' IDENTIFIED BY 'kepsAssistantPassDB123@#%__';
GRANT INSERT, SELECT, UPDATE ON db_keps_assistant_[client_id].status_riwayat_aktivitas_dokumen_keterangan_tab TO 'kepsAssistantUserDB123@#%__'@'%' IDENTIFIED BY 'kepsAssistantPassDB123@#%__';
GRANT INSERT, SELECT, UPDATE ON db_keps_assistant_[client_id].status_riwayat_aktivitas_dokumen_pegawai_pelaksana_tab TO 'kepsAssistantUserDB123@#%__'@'%' IDENTIFIED BY 'kepsAssistantPassDB123@#%__';
GRANT INSERT, SELECT, UPDATE ON db_keps_assistant_[client_id].status_riwayat_aktivitas_dokumen_tab TO 'kepsAssistantUserDB123@#%__'@'%' IDENTIFIED BY 'kepsAssistantPassDB123@#%__';

FLUSH PRIVILEGES;