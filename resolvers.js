module.exports = db => ({
    Query: {
        turtles(_, { filter }) {
            if (!filter) return db.turtles.findAll({ raw: true });

            return db.turtles.findAll({
                where: {
                    $or: [
                        {
                            '$favouritePizza.name$': {
                                $eq: filter
                            }
                        },
                        {
                            '$secondFavouritePizza.name$': {
                                $eq: filter
                            }
                        }
                    ]
                },
                include: [
                    {
                        model: db.pizzas,
                        as: 'favouritePizza'
                    },
                    {
                        model: db.pizzas,
                        as: 'secondFavouritePizza'
                    }
                ]
            })
        },
        turtle(_, { id }) {
            return db.turtles.findById(id, { raw: true });
        },
        weapons(_, { limit, order }) {
            return db.weapons.findAll({
                limit: limit,
                order: order,
                raw: true
            });
        },
        weapon(_, { id }) {
            return db.weapons.findById(id, { raw: true });
        },
        pizzas(_, { limit, order }) {
            return db.pizzas.findAll({
                limit: limit,
                order: order,
            });
        },
        pizza(_, { id }) {
            return db.pizzas.findById(id, { raw: true });
        },
    },

    Turtle: {
        weapon(turtle) {
            return db.weapons.findById(turtle.weaponId, { raw: true });
        },
        favouritePizza(turtle) {
            return db.pizzas.findById(turtle.favouritePizzaId, { raw: true });
        },
        secondFavouritePizza(turtle) {
            return db.pizzas.findById(turtle.secondFavouritePizzaId, { raw: true });
        }
    },

    Mutation: {
        createTurtle(obj, context) {
            return db.turtles.create(context.turtle);
        },
        updateTurtle(obj, context) {
            return db.turtles.update(context.turtle, { where: {id: context.id} });
        },
        deleteTurtle(obj, context) {
            return db.turtles.destroy({ where: {id: context.id} });
        },

        async changeFavouritePizza(obj, { turtleId, pizzaId, pizza }) {
            const turtle = await db.turtles.findById(turtleId);

            if (pizza == 2) {
                turtle.secondFavouritePizzaId = pizzaId;
            } else {
                turtle.favouritePizzaId = pizzaId;
            }

            return turtle.save();
        },

        async changeFavouriteWeapon(obj, { turtleId, weaponId }) {
            const turtle = await db.turtles.findById(turtleId);

            turtle.weaponId = weaponId;

            return turtle.save();
        }
    }
});