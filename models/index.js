module.exports = (Sequelize, config) => {
  const options = {
    host: config.host,
    dialect: config.dialect,
    logging: false,
    port: config.port,
  };

  const sequelize = new Sequelize(config.db, config.login, config.password, options);

  const Turtle = require('../models/turtle')(Sequelize, sequelize);
  const Pizza = require('../models/pizza')(Sequelize, sequelize);
  const Weapon = require('../models/weapon')(Sequelize, sequelize);

  // Weapon.hasOne(Turtle);
  // Pizza.hasOne(Turtle, {as: 'favouritePizza'});
  // Pizza.hasOne(Turtle, {as: 'secondFavouritePizza'});

  Turtle.belongsTo(Weapon, {foreignKey: 'weaponId'});
  Turtle.belongsTo(Pizza, {as: 'favouritePizza', foreignKey: 'favouritePizzaId'});
  Turtle.belongsTo(Pizza, {as: 'secondFavouritePizza', foreignKey: 'secondFavouritePizzaId'});

  sequelize.sync({force: true});

  return {
    turtles: Turtle,
    pizzas: Pizza,
    weapons: Weapon,

    sequelize: sequelize,
    Sequelize: Sequelize,
    Op: Sequelize.Op,
  };
};