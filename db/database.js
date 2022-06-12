export default class DB {
    
    constructor(uri, Sequelize) {
        this.Sequelize = Sequelize;
        this.sequelize = new Sequelize(uri);
        this.#createRealtion();
        this.#createAssociations();

        this.sequelize.sync();
    }

    #createAssociations() {
        this.Member.hasMany(this.Report);
    }

    #createRealtion() {
        /**********************************************************************/
        this.Member = this.sequelize.define('member', {
            id: {
                type: this.Sequelize.INTEGER,
                allowNull: false,
                primaryKey: true,
                autoIncrement: true,
            },
            telegram_id: {
                type: this.Sequelize.INTEGER,
                allowNull: false,
            },
            group_id: {
                type: this.Sequelize.INTEGER,
                allowNull: false,
            },
            name: {
                type: this.Sequelize.STRING,
                allowNull: false,
            },
            username: {
              type: this.Sequelize.STRING,
              allowNull: false,
            },
            position: {
                type: this.Sequelize.STRING,
                allowNull: false,
            }
        });
        /**********************************************************************/
        this.Report = this.sequelize.define('report', {
            id: {
                type: this.Sequelize.INTEGER,
                allowNull: false,
                primaryKey: true,
                autoIncrement: true,
            },
            report: {
                type: this.Sequelize.STRING,
                allowNull: false,
            }
        });
    }
}