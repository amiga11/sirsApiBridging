import { caraPembayaran } from "../models/CaraPembayaran.js";
import { Op } from "sequelize";

export const getDataCaraPembayaran = (req, res) => {
  caraPembayaran
    .findAll({
      attributes: ["id", "no", "nama"],
      where: {
        rl_id: req.query.rlid,
      },
    })
    .then((results) => {
      res.status(200).send({
        status: true,
        message: "data found",
        data: results,
      });
    })
    .catch((err) => {
      res.status(422).send({
        status: false,
        message: err,
      });
      return;
    });
};

export const getDataCaraPembayaranInput = (req, res) => {
  caraPembayaran
    .findAll({
      attributes: ["id", "no", "nama"],
      where: {
        rl_id: req.query.rlid,
        no: {
          [Op.notIn]: ["2", "4"],
        },
      },
    })
    .then((results) => {
      res.status(200).send({
        status: true,
        message: "data found",
        data: results,
      });
    })
    .catch((err) => {
      res.status(422).send({
        status: false,
        message: err,
      });
      return;
    });
};
