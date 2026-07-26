# Backup and restore

Back up D1 before every migration. Encrypt exported material, record SHA-256 checksums,
restrict access, and test restoration in a separate non-production database. A backup is
not considered valid until a restore test succeeds.
