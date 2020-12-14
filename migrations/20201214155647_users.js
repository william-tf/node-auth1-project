
exports.up = function(knex) {
  return knex.schema
  .createTable("users", t => {
      t.increments()
      t.string("username", 15).notNullable().unique().index()
      t.string("password", 100).notNullable()

  })
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists("users")
};
