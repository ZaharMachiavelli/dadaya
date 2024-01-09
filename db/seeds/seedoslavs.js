const bcrypt = require("bcrypt");
const crypto = require("crypto");

const tableNames = require("../../src/constants/tableNames");
const ordered = [...Object.values(tableNames)]
    .sort((a, b) => a.order - b.order)
    .map((el) => el.name);

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function (knex) {
    await Promise.all(ordered.map((el) => knex(el).del()));
    // Deletes ALL existing entries

    const password = crypto.randomBytes(15).toString("hex");

    const user = {
        name: "Катя Холодарева",
        email: "papichessa@ya.ru",
        password: bcrypt.hashSync(password, 12),
        last_login: new Date(),
    };

    const createdUser = await knex(tableNames.user.name).insert(user).returning("*");

    await knex(tableNames.country.name).insert({name: 'Российская Федерация'});
    await knex(tableNames.state.name).insert({name: 'Свердловская область'});

    const address = {
        street_address_1: 'Циолковского',
        city: 'Екатеринбург',
        zipcode: '620000',
        latitude: 5,
        longitude: 7,
        state_id: 1,
        country_id: 1,
    }

    await knex(tableNames.address.name).insert(address)
};
