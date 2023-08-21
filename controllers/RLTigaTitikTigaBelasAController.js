import { databaseSIRS } from "../config/Database.js";
import {
  rlTigaTitikTigaBelasA,
  rlTigaTitikTigaBelasADetail,
  golonganObat,
} from "../models/RLTigaTitikTigaBelasA.js";
import Joi from "joi";

export const getDataRLTigaTitikTigaBelasA = (req, res) => {
  rlTigaTitikTigaBelasADetail
    .findAll({
      attributes: [
        "id",
        "tahun",
        "jumlah_item_obat",
        "jumlah_item_obat_rs",
        "jumlah_item_obat_formulatorium",
      ],
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

export const getDataRLTigaTitikTigaBelasADetail = (req, res) => {
  rlTigaTitikTigaBelasADetail
    .findAll({
      attributes: [
        "id",
        "rl_tiga_titik_tiga_belas_a_id",
        "user_id",
        "golongan_obat_id",
        "jumlah_item_obat",
        "jumlah_item_obat_rs",
        "jumlah_item_obat_formulatorium",
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

export const getRLTigaTitikTigaBelasAById = async (req, res) => {
  rlTigaTitikTigaBelasADetail
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

export const updateDataRLTigaTitikTigaBelasA = async (req, res) => {
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
    const upDat = await rlTigaTitikTigaBelasADetail.update(req.body, {
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

export const deleteDataRLTigaTitikTigaBelasA = async (req, res) => {
  try {
    const count = await rlTigaTitikTigaBelasADetail.destroy({
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

export const insertDataRLTigaTitikTigaBelasA = async (req, res) => {
  const currentYear = new Date().getFullYear();
  const schema = Joi.object({
    tahun: Joi.number()
      .min(currentYear - 1)
      .required(),
    data: Joi.array()
      .items(
        Joi.object().keys({
          golonganObatId: Joi.number().min(1).max(3).required(),
          jumlahItemObat: Joi.number().min(0).max(9999999).required(),
          jumlahItemObatRs: Joi.number().min(0).max(9999999).required(),
          jumlahItemObatFormulatorium: Joi.number()
            .min(0)
            .max(9999999)
            .required(),
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
    const resultInsertHeader = await rlTigaTitikTigaBelasA.create(
      {
        rs_id: req.user.rsId,
        tahun: req.body.tahun,
        user_id: req.user.id,
      },
      { transaction: transaction }
    );

    const dataDetail = req.body.data.map((value, index) => {
      return {
        rl_tiga_titik_tiga_belas_a_id: resultInsertHeader.id,
        golongan_obat_id: value.golonganObatId,
        jumlah_item_obat: value.jumlahItemObat,
        jumlah_item_obat_rs: value.jumlahItemObatRs,
        jumlah_item_obat_formulatorium: value.jumlahItemObatFormulatorium,
        rs_id: req.user.rsId,
        tahun: req.body.tahun,
        user_id: req.user.id,
      };
    });

    const resultInsertDetail = await rlTigaTitikTigaBelasADetail.bulkCreate(
      dataDetail,
      {
        transaction: transaction,
      }
    );

    const dataid = resultInsertDetail.map((value, index) => {
      return {
        id: value.id,
      };
    });
    await transaction.commit();
    res.status(201).send({
      status: true,
      message: "data created",
      data: dataid
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
