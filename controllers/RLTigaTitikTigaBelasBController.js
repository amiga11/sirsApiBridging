import { databaseSIRS } from "../config/Database.js";
import {
  rlTigaTitikTigaBelasB,
  rlTigaTitikTigaBelasBDetail,
  golonganObat,
} from "../models/RLTigaTitikTigaBelasB.js";
import Joi from "joi";

export const getDataRLTigaTitikTigaBelasB = (req, res) => {
  rlTigaTitikTigaBelasBDetail
    .findAll({
      attributes: ["id", "tahun", "rawat_jalan", "igd", "rawat_inap"],
      where: {
        rs_id: req.user.rsId,
        tahun: req.query.tahun,
      },
      include: {
        model: golonganObat,
      },
      order: [["golongan_obat_id", "ASC"]],
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

export const getDataRLTigaTitikTigaBelasBDetail = (req, res) => {
  rlTigaTitikTigaBelasBDetail
    .findAll({
      attributes: [
        "id",
        "rl_tiga_titik_tiga_belas_a_id",
        "user_id",
        "golongan_obat_id",
        "rawat_jalan",
        "igd",
        "rawat_inap",
      ],
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

export const getRLTigaTitikTigaBelasBById = async (req, res) => {
  rlTigaTitikTigaBelasBDetail
    .findOne({
      where: {
        // rs_id: req.user.rsId,
        // tahun: req.query.tahun
        id: req.params.id,
      },
      include: {
        model: golonganObat,
        // include: {
        //     model: jenisKegiatan
        // }
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

export const updateDataRLTigaTitikTigaBelasB = async (req, res) => {
  const schema = Joi.object({
    jumlahItemObat: Joi.number().min(0).max(9999999).required(),
    jumlahItemObatRs: Joi.number().min(0).max(9999999).required(),
    jumlahItemObatFormulatorium: Joi.number().min(0).max(9999999).required(),
  }).required();
  const { error, value } = schema.validate(req.body);
  if (error) {
    res.status(404).send({
      status: false,
      message: error.details[0].message,
    });
    return;
  }
  try {
    const upDat = await rlTigaTitikTigaBelasBDetail.update(req.body, {
      where: {
        id: req.params.id,
        rs_id: req.user.rsId,
      },
    });
    res.status(200).json({
      status: true,
      message: "data update successfully",
      data: {
        updated_row: upDat,
      },
    });
  } catch (error) {
    console.log(error.message);
  }
};

export const deleteDataRLTigaTitikTigaBelasB = async (req, res) => {
  try {
    const count = await rlTigaTitikTigaBelasBDetail.destroy({
      where: {
        id: req.params.id,
        rs_id: req.user.rsId,
      },
    });

    res.status(200).json({
      status: true,
      message: "data deleted successfully",
      data: {
        deleted_rows: count,
      },
    });
  } catch (error) {
    console.log(error.message);
  }
};

export const insertDataRLTigaTitikTigaBelasB = async (req, res) => {
  const currentYear = new Date().getFullYear();
  const schema = Joi.object({
    tahun: Joi.number()
      .min(currentYear - 1)
      .required(),
    data: Joi.array()
      .items(
        Joi.object().keys({
          golonganObatId: Joi.number().min(1).max(3).required(),
          rawatJalan: Joi.number().min(0).max(9999999).required(),
          igd: Joi.number().min(0).max(9999999).required(),
          rawatInap: Joi.number().min(0).max(9999999).required(),
        })
      )
      .required(),
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
    const resultInsertHeader = await rlTigaTitikTigaBelasB.create(
      {
        rs_id: req.user.rsId,
        tahun: req.body.tahun,
        user_id: req.user.id,
      },
      { transaction: transaction }
    );

    const dataDetail = req.body.data.map((value, index) => {
      return {
        rl_tiga_titik_tiga_belas_b_id: resultInsertHeader.id,
        golongan_obat_id: value.golonganObatId,
        rawat_jalan: value.rawatJalan,
        igd: value.igd,
        rawat_inap: value.rawatInap,
        rs_id: req.user.rsId,
        tahun: req.body.tahun,
        user_id: req.user.id,
      };
    });

    const resultInsertDetail = await rlTigaTitikTigaBelasBDetail.bulkCreate(
      dataDetail,
      {
        transaction: transaction,
      }
    );

    await transaction.commit();
    res.status(201).send({
      status: true,
      message: "data created",
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
