import { databaseSIRS } from "../config/Database.js";
import {
  rlTigaTitikEmpatBelasHeader,
  rlTigaTitikEmpatBelasDetail,
  jenisSpesialis,
} from "../models/RLTigaTitikEmpatBelas.js";
import Joi from "joi";

export const getDataRLTigaTitikEmpatBelas = (req, res) => {
  rlTigaTitikEmpatBelasDetail
    .findAll({
      attributes: [
        "id",
        "tahun",
        "rujukan_diterima_dari_puskesmas",
        "rujukan_diterima_dari_fasilitas_kesehatan_lain",
        "rujukan_diterima_dari_rs_lain",
        "rujukan_dikembalikan_ke_puskesmas",
        "rujukan_dikembalikan_ke_fasilitas_kesehatan_lain",
        "rujukan_dikembalikan_ke_rs_asal",
        "dirujukan_pasien_rujukan",
        "dirujuk_pasien_datang_sendiri",
        "dirujuk_diterima_kembali",
      ],
      where: {
        rs_id: req.user.rsId,
        tahun: req.query.tahun,
      },
      include: {
        model: jenisSpesialis,
      },
      order: [["jenis_spesialis_id", "ASC"]],
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

export const insertDataRLTigaTitikEmpatBelas = async (req, res) => {
  const currentYear = new Date().getFullYear();
  const schema = Joi.object({
    tahun: Joi.number()
      .min(currentYear - 1)
      .required(),
    data: Joi.array()
      .items(
        Joi.object()
          .keys({
            jenisSpesialisId: Joi.number().required(),
            rujukanDiterimaDariPuskesmas: Joi.number()
              .min(0)
              .max(9999999)
              .required(),
            rujukanDiterimaDariFasilitasKesehatanLain: Joi.number()
              .min(0)
              .max(9999999)
              .required(),
            rujukanDiterimaDariRsLain: Joi.number()
              .min(0)
              .max(9999999)
              .required(),
            rujukanDikembalikanKePuskesmas: Joi.number()
              .min(0)
              .max(9999999)
              .required(),
            rujukanDikembalikanKeFasilitasKesehatanLain: Joi.number()
              .min(0)
              .max(9999999)
              .required(),
            rujukanDikembalikanKeRsAsal: Joi.number()
              .min(0)
              .max(9999999)
              .required(),
            dirujukanPasienRujukan: Joi.number().min(0).max(9999999).required(),
            dirujukPasienDatangSendiri: Joi.number()
              .min(0)
              .max(9999999)
              .required(),
            dirujukDiterimaKembali: Joi.number().min(0).max(9999999).required(),
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

  let jenSp = [15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28];

  try {
    const resultInsertHeader = await rlTigaTitikEmpatBelasHeader.create(
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
      if (jenSp.includes(value.jenisSpesialisId) == false) {
        console.log("Jenis Spesialis Salah");
        throw new SyntaxError("0");
      }
      return {
        rs_id: req.user.rsId,
        tahun: req.body.tahun,
        rl_tiga_titik_empat_belas_id: resultInsertHeader.id,
        jenis_spesialis_id: value.jenisSpesialisId,
        rujukan_diterima_dari_puskesmas: value.rujukanDiterimaDariPuskesmas,
        rujukan_diterima_dari_fasilitas_kesehatan_lain:
          value.rujukanDiterimaDariFasilitasKesehatanLain,
        rujukan_diterima_dari_rs_lain: value.rujukanDiterimaDariRsLain,
        rujukan_dikembalikan_ke_puskesmas: value.rujukanDikembalikanKePuskesmas,
        rujukan_dikembalikan_ke_fasilitas_kesehatan_lain:
          value.rujukanDikembalikanKeFasilitasKesehatanLain,
        rujukan_dikembalikan_ke_rs_asal: value.rujukanDikembalikanKeRsAsal,
        dirujukan_pasien_rujukan: value.dirujukanPasienRujukan,
        dirujuk_pasien_datang_sendiri: value.dirujukPasienDatangSendiri,
        dirujuk_diterima_kembali: value.dirujukDiterimaKembali,
        user_id: req.user.id,
      };
    });

    const resultInsertDetail = await rlTigaTitikEmpatBelasDetail.bulkCreate(
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
    console.log(error.code);
    await transaction.rollback();
    if (error.message == "0") {
      res.status(400).send({
        status: false,
        message: "data not created",
        error: "Jenis Spesialis Salah",
      });
    } else if (error.name === "SequelizeUniqueConstraintError") {
      res.status(400).send({
        status: false,
        message: "Duplicate Entry",
      });
    } else {
      res.status(400).send({
        status: false,
        message: "error",
      });
    }
  }
};

export const deleteDataRLTigaTitikEmpatBelas = async (req, res) => {
  try {
    const count = await rlTigaTitikEmpatBelasDetail.destroy({
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

export const getDataRLTigaTitikEmpatBelasDetail = (req, res) => {
  rlTigaTitikEmpatBelasDetail
    .findAll({
      attributes: [
        "id",
        "rl_tiga_titik_empat_belas_id",
        "user_id",
        "jenis_spesialis_id",
        "rujukan_diterima_dari_puskesmas",
        "rujukan_diterima_dari_fasilitas_kesehatan_lain",
        "rujukan_diterima_dari_rs_lain",
        "rujukan_dikembalikan_ke_puskesmas",
        "rujukan_dikembalikan_ke_fasilitas_kesehatan_lain",
        "rujukan_dikembalikan_ke_rs_asal",
        "dirujukan_pasien_rujukan",
        "dirujuk_pasien_datang_sendiri",
        "dirujuk_diterima_kembali",
      ],
      where: {
        id: req.params.id,
      },
      include: {
        model: jenisSpesialis,
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

export const updateDataRLTigaTitikEmpatBelas = async (req, res) => {
  const schema = Joi.object({
    rujukanDiterimaDariPuskesmas: Joi.number().min(0).max(9999999).required(),
    rujukanDiterimaDariFasilitasKesehatanLain: Joi.number()
      .min(0)
      .max(9999999)
      .required(),
    rujukanDiterimaDariRsLain: Joi.number().min(0).max(9999999).required(),
    rujukanDikembalikanKePuskesmas: Joi.number().min(0).max(9999999).required(),
    rujukanDikembalikanKeFasilitasKesehatanLain: Joi.number()
      .min(0)
      .max(9999999)
      .required(),
    rujukanDikembalikanKeRsAsal: Joi.number().min(0).max(9999999).required(),
    dirujukanPasienRujukan: Joi.number().min(0).max(9999999).required(),
    dirujukPasienDatangSendiri: Joi.number().min(0).max(9999999).required(),
    dirujukDiterimaKembali: Joi.number().min(0).max(9999999).required(),
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
    let upd = await rlTigaTitikEmpatBelasDetail.update(req.body, {
      where: {
        id: req.params.id,
        rs_id: req.user.rsId,
      },
    });
    res.status(200).json({
      status: true,
      message: "data update successfully",
      data: {
        updated_row: upd,
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

export const getRLTigaTitikEmpatBelasById = async (req, res) => {
  rlTigaTitikEmpatBelasDetail
    .findOne({
      where: {
        // rs_id: req.user.rsId,
        // tahun: req.query.tahun
        id: req.params.id,
      },
      include: {
        model: jenisSpesialis,
        // include: {
        //     model: jenisSpesialis
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
