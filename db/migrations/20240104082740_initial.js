const tableNames = require("../../src/constants/tableNames");

function addDefaultColumns(table) {
    table.increments("id").primary().notNullable();
    table.timestamps(false, true);
    table.datetime("deleted_at");
}

function createSimpleTable(knex, tableName) {
    return knex.schema.createTable(tableName, (table) => {
        table.string("name").notNullable().unique();
        addDefaultColumns(table);
    });
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */

exports.up = async (knex) => {
    await knex.schema.createTable(tableNames.user.name, (table) => {
        table.string("email", 254).notNullable().unique();
        table.string("name").notNullable();
        table.string("password").notNullable();
        table.datetime("last_login");
        addDefaultColumns(table);
    });

    await createSimpleTable(knex, tableNames.item_type.name);
    await createSimpleTable(knex, tableNames.country.name);
    await createSimpleTable(knex, tableNames.state.name);
    await createSimpleTable(knex, tableNames.shape.name);

    await knex.schema.createTable(tableNames.location.name, (table) => {
        table.string("name").notNullable().unique();
        table.string("description", 1000).notNullable();
        table.string("image_url", 2000);
        addDefaultColumns(table);
    });

    await knex.schema.createTable(tableNames.address.name, (table) => {
        table.string("street_address_1", 50).notNullable();
        table.string("street_address_2", 50);
        table.string("city", 100).notNullable();
        table.string("zipcode", 15).notNullable();
        table.float("latitude").notNullable();
        table.float("longitude").notNullable();
        table
            .integer("state_id")
            .unsigned()
            .references("id")
            .inTable("state")
            .onDelete("cascade");
        table
            .integer("country_id")
            .unsigned()
            .references("id")
            .inTable("country")
            .onDelete("cascade");
        addDefaultColumns(table);
    });

    await knex.schema.createTable(tableNames.company.name, (table) => {
        table.string("name").notNullable().unique();
        table.string("email", 254).notNullable().unique();
        table.string("logo_url").notNullable();
        table.string("description", 2000);
        table.string("type");
        table.string("website_url").notNullable();
        table
            .integer("address_id")
            .unsigned()
            .references("id")
            .inTable("address")
            .onDelete("cascade");
        addDefaultColumns(table);
    });

    // [tableNames.state, tableNames.country, tableNames.item_type].forEach(
    //     (tableName) => createSimpleTable(knex, tableName)
    // );
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async (knex) => {
    await Promise.all(
        Object.keys(tableNames).map((name) => knex.schema.dropTable(name))
    );
    // return knex.schema.dropTable(tableNames.user);
};
