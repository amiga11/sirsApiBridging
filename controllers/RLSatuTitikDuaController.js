import { databaseSIRS } from "../config/Database.js";
import {
  rlSatuTitikDuaHeader,
  rlSatuTitikDuaDetail,
} from "../models/RLSatuTitikDua.js";
import Joi from "joi";

export const getDatarlSatuTitikDua = (req, res) => {
  rlSatuTitikDuaDetail
    .findAll({
      attributes: [
        "id",
        "tahun",
        "bor",
        "los",
        "bto",
        "toi",
        "ndr",
        "gdr",
        "rata_kunjungan",
      ],
      where: {
        rs_id: req.user.rsId,
        tahun: req.query.tahun,
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
export const getDatarlSatuTitikDuaDetail = (req, res) => {
  rlSatuTitikDuaDetail
    .findAll({
      attributes: ["id", "rl_satu_titik_dua_id", "user_id", "bor"],
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

export const getrlSatuTitikDuaById = async (req, res) => {
  rlSatuTitikDuaDetail
    .findOne({
      where: {
        id: req.params.id,
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
export const updateDatarlSatuTitikDua = async (req, res) => {
  const schema = Joi.object({
    los: Joi.number().min(0).max(999).required(),
    bor: Joi.number().min(0.0).max(999.999).required(),
    toi: Joi.number().min(0.0).max(999.999).required(),
    bto: Joi.number().min(0.0).max(999.999).required(),
    ndr: Joi.number().min(0.0).max(999.999).required(),
    gdr: Joi.number().min(0.0).max(999.999).required(),
    rataKunjungan: Joi.number().min(0.0).max(999.999).required(),
  });
  const { error, value } = schema.validate(req.body);
  if (error) {
    res.status(404).send({
      status: false,
      message: error.details[0].message,
    });
    return;
  }

  const dataDetail = {
    bor: req.body.bor,
    los: req.body.los,
    bto: req.body.bto,
    toi: req.body.toi,
    ndr: req.body.ndr,
    gdr: req.body.gdr,
    rata_kunjungan: req.body.rataKunjungan,
  };

  try {
    const count = await rlSatuTitikDuaDetail.update(dataDetail, {
      where: {
        id: req.params.id,
        rs_id: req.user.rsId,
      },
    });
    res.status(200).json({
      status: true,
      message: "data update successfully",
      data: {
        updated_row: count,
      },
    });
  } catch (error) {
    console.log(error.message);
  }
};

export const insertDataRLSatuTitikDua = async (req, res) => {
  const schema = Joi.object({
    tahun: Joi.number().required(),
    los: Joi.number().min(0).max(999).required(),
    bor: Joi.number().min(0.0).max(999.999).required(),
    toi: Joi.number().min(0.0).max(999.999).required(),
    bto: Joi.number().min(0.0).max(999.999).required(),
    ndr: Joi.number().min(0.0).max(999.999).required(),
    gdr: Joi.number().min(0.0).max(999.999).required(),
    rataKunjungan: Joi.number().min(0.0).max(999.999).required(),
  });

  const { error, value } = schema.validate(req.body);
  if (error) {
    res.status(404).send({
      status: false,
      message: error.details[0].message,
    });
    return;
  }

  const transaction = await databaseSIRS.transaction();
  try {
    const resultInsertHeader = await rlSatuTitikDuaHeader.create(
      {
        rs_id: req.user.rsId,
        tahun: req.body.tahun,
        user_id: req.user.id,
      },
      {
        transaction: transaction,
      }
    );

    const dataDetail = {
      rs_id: req.user.rsId,
      rl_satu_titik_dua_id: resultInsertHeader.id,
      user_id: req.user.id,
      tahun: req.body.tahun,
      bor: req.body.bor,
      los: req.body.los,
      bto: req.body.bto,
      toi: req.body.toi,
      ndr: req.body.ndr,
      gdr: req.body.gdr,
      rata_kunjungan: req.body.rataKunjungan,
    };

    const resultInsertDetail = await rlSatuTitikDuaDetail.create(dataDetail, {
      transaction: transaction,
      // updateOnDuplicate: ['bor', 'los', 'bto', 'toi', 'ndr', 'gdr', 'rata_kunjungan']
    });
    console.log(dataDetail);
    await transaction.commit();
    res.status(201).send({
      status: true,
      message: "data created",
      data: resultInsertDetail.id
    });
  } catch (error) {
    console.log(error);
    await transaction.rollback();
    if (error.name === "SequelizeUniqueConstraintError") {
      res.status(400).send({
        status: false,
        message: "Duplicate Entry",
      });
    } else {
      res.status(400).send({
        status: false,
        message: error,
      });
    }
  }
};

export const deleteDataRLSatuTitikDua = async (req, res) => {
  try {
    const count = await rlSatuTitikDuaDetail.destroy({
      where: {
        id: req.params.id,
      },
    });
    res.status(201).send({
      status: true,
      message: "data deleted successfully",
      data: {
        deleted_rows: count,
      },
    });
  } catch (error) {
    res.status(404).send({
      status: false,
      message: error,
    });
  }
};
