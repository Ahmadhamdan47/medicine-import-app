const { Sequelize, DataTypes } = require('sequelize');
const sequelize = new Sequelize('ommal_medapiv2', 'root', '', {
  host: 'localhost',
  dialect: 'mysql'
});

async function modifyForeignKeyConstraints(tableName) {
  try {
    const [results] = await sequelize.query(`
      SELECT
        table_name,
        constraint_name,
        column_name,
        referenced_table_name,
        referenced_column_name
      FROM
        information_schema.key_column_usage
      WHERE
        referenced_table_name = '${tableName}' AND
        constraint_schema = DATABASE();
    `);

    for (const row of results) {
      const { table_name, constraint_name, column_name, referenced_table_name, referenced_column_name } = row;

      await sequelize.query(`
        ALTER TABLE ${table_name}
        DROP FOREIGN KEY ${constraint_name};
      `);

      await sequelize.query(`
        ALTER TABLE ${table_name}
        ADD CONSTRAINT ${constraint_name}
        FOREIGN KEY (${column_name}) REFERENCES ${referenced_table_name}(${referenced_column_name})
        ON DELETE CASCADE;
      `);

      console.log(`Modified foreign key ${constraint_name} on table ${table_name}`);
    }

    console.log('All foreign key constraints modified to ON DELETE CASCADE');
  } catch (error) {
    console.error('Error modifying foreign key constraints:', error);
  } finally {
    await sequelize.close();
  }
}


modifyForeignKeyConstraints('drugpresentation');

