import { DataSource, MigrationExecutor } from 'typeorm';

export class HealthcheckService {
    private db: DataSource;

    private migrationExecutor: MigrationExecutor;

    constructor(db: DataSource) {
        this.db = db;
        this.migrationExecutor = new MigrationExecutor(db, db.createQueryRunner('master'));
    }

    async isDBReady(): Promise<boolean> {
        if (!this.db.isInitialized) {
            return false;
        }

        const pendingMigrations = await this.migrationExecutor.getPendingMigrations();
        return pendingMigrations.length === 0;
    }
}
