import { DataSource, DataSourceOptions } from "typeorm";
import { Member, Report, GroupTg } from "./entities";
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

export default class DataSourceConnect {
    private static initDataSource: DataSource | undefined = undefined;
    private static dataSourceOptions: DataSourceOptions = {
        type: "postgres",
        host: "hattie.db.elephantsql.com",
        port: 5432,
        username: "gyzxxvsr",
        password: "QULh8YIL6kW6EdJir2ouqk36QNE8EdKw",
        database: "gyzxxvsr",
        entities: [Member, Report, GroupTg],
        namingStrategy: new SnakeNamingStrategy(),
        synchronize: true
    }
    
    static async connect(): Promise<DataSource> {
        const AppDataSource = new DataSource(this.dataSourceOptions);
        
        if(this.initDataSource === undefined) {
            try {
                let initDataSource = await AppDataSource.initialize();
                console.log("Data Source has been initialized!")
                this.initDataSource = initDataSource;
                return this.initDataSource;
            } catch (error) {
                console.error("Error during Data Source initialization", error)
            }
        }
        else {
            return this.initDataSource;
        }
    }

    static getConnection(): DataSource {
        return this.initDataSource;
    }
}