import { databaseSIRS } from "../config/Database.js";
import {
  rlTigaTitikLimaBelasHeader,
  rlTigaTitikLimaBelasDetail,
  caraPembayaran,
} from "../models/RLTigaTitikLimaBelas.js";
import Joi from "joi";

export const getDataRLTigaTitikLimaBelas = (req, res) => {
  rlTigaTitikLimaBelasDetail
    .findAll({
      attributes: [
        "id",
        "tahun",
        "pasien_rawat_inap_jpk",
        "pasien_rawat_inap_jld",
        "jumlah_pasien_rawat_jalan",
        "jumlah_pasien_rawat_jalan_lab",
        "jumlah_pasien_rawat_jalan_rad",
        "jumlah_pasien_rawat_jalan_ll",
      ],
      where: {
        rs_id: req.user.rsId,
        tahun: req.query.tahun,
      },
      include: {
        model: caraPembayaran,
      },
      order: [["cara_pembayaran_id", "ASC"]],
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

export const getDataRLTigaTitikLimaBelasDetail = (req, res) => {
  rlTigaTitikLimaBelasDetail
    .findAll({
      attributes: [
        "id",
        "rl_tiga_titik_lima_belas_id",
        "user_id",
        "cara_pembayaran_id",
        "pasien_rawat_inap_jpk",
        "pasien_rawat_inap_jld",
        "jumlah_pasien_rawat_jalan",
        "jumlah_pasien_rawat_jalan_lab",
        "jumlah_pasien_rawat_jalan_rad",
        "jumlah_pasien_rawat_jalan_ll",
      ],
      where: {
        id: req.params.id,
      },
      include: {
        model: caraPembayaran,
        attributes: ["nama"],
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

export const getRLTigaTitikLimaBelasById = async (req, res) => {
  rlTigaTitikLimaBelasDetail
    .findOne({
      where: {
        // rs_id: req.user.rsId,
        // tahun: req.query.tahun
        id: req.params.id,
      },
      include: {
        model: caraPembayaran,
        // include: {
        //     model: caraPembayaran
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

export const updateDataRLTigaTitikLimaBelas = async (req, res) => {
  const schema = Joi.object({
    pasienRawatInapJpk: Joi.number().min(0).max(9999999).required(),
    pasienRawatInapJld: Joi.number().min(0).max(9999999).required(),
    jumlahPasienRawatJalanLab: Joi.number().min(0).max(9999999).required(),
    jumlahPasienRawatJalanRad: Joi.number().min(0).max(9999999).required(),
    jumlahPasienRawatJalanLl: Joi.number().min(0).max(9999999).required(),
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
    let jmlPasRwtJln =
      req.body.jumlahPasienRawatJalanLab +
      req.body.jumlahPasienRawatJalanRad +
      req.body.jumlahPasienRawatJalanLl;
    const dataDetail = {
      pasien_rawat_inap_jpk: req.body.pasienRawatInapJpk,
      pasien_rawat_inap_jld: req.body.pasienRawatInapJld,
      jumlah_pasien_rawat_jalan: jmlPasRwtJln,
      jumlah_pasien_rawat_jalan_lab: req.body.jumlahPasienRawatJalanLab,
      jumlah_pasien_rawat_jalan_rad: req.body.jumlahPasienRawatJalanRad,
      jumlah_pasien_rawat_jalan_ll: req.body.jumlahPasienRawatJalanLl,
    };

    const upDat = await rlTigaTitikLimaBelasDetail.update(dataDetail, {
      where: {
        id: req.params.id,
        rs_id: req.user.rsId,
      },
    });
    res.status(201).send({
      status: true,
      message: "Data Diperbaharui",
      data: {
        updated_row: upDat,
      },
    });
  } catch (error) {
    console.log(error.message);
    res.status(400).send({
      status: false,
      message: "Gagal Memperbaharui Data",
    });
  }
};

export const insertDataRLTigaTitikLimaBelas = async (req, res) => {
  const currentYear = new Date().getFullYear();
  const schema = Joi.object({
    tahun: Joi.number()
      .min(currentYear - 1)
      .required(),
    data: Joi.array()
      .items(
        Joi.object()
          .keys({
            caraPembayaranId: Joi.number().required(),
            pasienRawatInapJpk: Joi.number().min(0).max(9999999).required(),
            pasienRawatInapJld: Joi.number().min(0).max(9999999).required(),
            jumlahPasienRawatJalanLab: Joi.number()
              .min(0)
              .max(9999999)
              .required(),
            jumlahPasienRawatJalanRad: Joi.number()
              .min(0)
              .max(9999999)
              .required(),
            jumlahPasienRawatJalanLl: Joi.number()
              .min(0)
              .max(9999999)
              .required(),
          })
          .required()
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
  let jenPem = [1, 3, 4, 5, 6, 7, 9, 10, 11];
  try {
    const resultInsertHeader = await rlTigaTitikLimaBelasHeader.create(
      {
        rs_id: req.user.rsId,
        tahun: req.body.tahun,
        user_id: req.user.id,
      },
      {
        transaction: transaction,
      }
    );

    const dataDetail = req.body.data.map((value, index) => {
      if (jenPem.includes(value.caraPembayaranId) == false) {
        console.log("Cara Pembayaran Id Salah");
        throw new SyntaxError("0");
      }
      let jmlPasRwtJln =
        value.jumlahPasienRawatJalanLab +
        value.jumlahPasienRawatJalanRad +
        value.jumlahPasienRawatJalanLl;
      return {
        rs_id: req.user.rsId,
        tahun: req.body.tahun,
        rl_tiga_titik_lima_belas_id: resultInsertHeader.id,
        cara_pembayaran_id: value.caraPembayaranId,
        pasien_rawat_inap_jpk: value.pasienRawatInapJpk,
        pasien_rawat_inap_jld: value.pasienRawatInapJld,
        jumlah_pasien_rawat_jalan: jmlPasRwtJln,
        jumlah_pasien_rawat_jalan_lab: value.jumlahPasienRawatJalanLab,
        jumlah_pasien_rawat_jalan_rad: value.jumlahPasienRawatJalanRad,
        jumlah_pasien_rawat_jalan_ll: value.jumlahPasienRawatJalanLl,
        user_id: req.user.id,
      };
    });

    const resultInsertDetail = await rlTigaTitikLimaBelasDetail.bulkCreate(
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
    if (error.message == "0") {
      res.status(400).send({
        status: false,
        message: "data not created",
        error: "Cara Pembayaran Id Salah",
      });
    } else if (error.name === "SequelizeUniqueConstraintError") {
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

export const deleteDataRLTigaTitikLimaBelas = async (req, res) => {
  try {
    const count = await rlTigaTitikLimaBelasDetail.destroy({
      where: {
        id: req.params.id,
        rs_id: req.user.rsId,
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
