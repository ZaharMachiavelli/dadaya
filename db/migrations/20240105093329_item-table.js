const {
    addDefaultColumns,
    createSimpleTable,
} = require("../../src/utils/table");
const tableNames = require("../../src/constants/tableNames");

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async (knex) => {
    await knex.schema.table(tableNames.address.name, (table) => {
        table.dropColumn("country_id");
    });

    await knex.schema.table(tableNames.state.name, (table) => {
        table.string("code");
        table
            .integer("country_id")
            .unsigned()
            .references("id")
            .inTable("country")
            .onDelete("cascade");
    });

    await knex.schema.table(tableNames.country.name, (table) => {
        table.string("code");
    });

    await knex.schema.createTable(tableNames.size.name, (table) => {
        table.string("name").notNullable();
        table.float("length");
        table.float("width");
        table.float("height");
        table.float("volume");
        table
            .integer("shape_id")
            .unsigned()
            .references("id")
            .inTable("shape")
            .onDelete("cascade");
        addDefaultColumns(table);
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async (knex) => {
    await Promise.all([
        knex.schema.dropTable(tableNames.size.name),
        knex.schema.table(tableNames.address.name, (table) => {
            table
                .integer("country_id")
                .unsigned()
                .references("id")
                .inTable("country")
                .onDelete("cascade");
        }),
        knex.schema.table(tableNames.state.name, (table) => {
            table.dropColumn("country_id");
            table.dropColumn("code");
        }),

        knex.schema.table(tableNames.country.name, (table) => {
            table.dropColumn("code");
        }),
    ]);
};
