# RecipeVault Database Safety

This document explains the rules for protecting RecipeVault production data.

RecipeVault uses:

- PostgreSQL for app data
- Prisma for schema and migrations
- Docker for the PostgreSQL container
- `pg_dump` for database backups

## What the database contains

The PostgreSQL database stores app data such as:

- Recipes
- Ingredients
- Steps
- Folders
- Favorites
- Reminders
- Saved AI-imported recipe data

Code is protected by Git/GitHub.  
App data is protected by PostgreSQL backups.

## Golden Rule

Always create a PostgreSQL backup before running any production database migration.

## Backup command

Run this on the Raspberry Pi before production migrations:

```bash
/srv/storage/recipevault/scripts/backup-recipevault-db.sh
```
