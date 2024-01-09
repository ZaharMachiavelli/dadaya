

function addDefaultColumns(table) {
    table.increments("id").primary().notNullable();
    table.timestamps(false, true);
    table.datetime("deleted_at");
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */

function createSimpleTable(knex, tableName) {
    return knex.schema.createTable(tableName, (table) => {
        table.string("name").notNullable().unique();
        addDefaultColumns(table);
    });
}

module.exports = {
    addDefaultColumns,
    createSimpleTable,
};
