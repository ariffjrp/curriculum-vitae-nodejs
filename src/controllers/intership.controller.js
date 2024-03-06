const db = require('../models')
const { Intership } = db
const { logger } = require('../utils/logger');

class IntershipController{
    static async createIntership(req, res){
        const { companyName, role, startDate, endDate } = req.body;

        const userId = req.userId;

        Intership.create({
            companyName: companyName,
            role: role,
            startDate: startDate,
            endDate: endDate,
            userId: userId,
        })
        .then((data) => {
            res.status(200).send({
                data: data,
                Message: "Intership was created successfully!",
            })
        }).catch((err) => {
            logger.error(err)
            res.status(500).send({
                Message: "Failed to create Intership. Please check application log."
            })
        });
    }

    static async updateIntership(req, res){
        Intership.update(req.body, { where: {
            id: req.params.id,
        }})
        .then(() => {
            res.status(200).send({ message: "Intership successfully updated." });
        })
        .catch((err) => {
            logger.error(err.message);
            res.status(500).send({
                message: 'Failed to update Intership. Please check application log.',
            });
        })
    }

    static async deleteIntership(req, res){
        try {
            await Intership.destroy({ where: {
                id: req.params.id,
            }}).then(() => {
                res.status(200).send({ message: "Intership successfully deleted." });
            })
        } catch (err) {
            logger.error(err.message);
            res.status(500).send({
                message: 'Failed to delete Intership. Please check application log.',
            });
        }
    }
}

module.exports = IntershipController;