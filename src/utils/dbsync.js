const db = require("../models");

const init = () => {
    return new Promise(async (resolve, reject) => {
        try {
            await db.sequelize.sync({ force: true })
            resolve()
        } catch (err) {
            reject(err)
        }
    })
}

module.exports = init