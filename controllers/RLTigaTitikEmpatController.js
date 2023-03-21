import { databaseSIRS } from "../config/Database.js";
import {
  rlTigaTitikEmpatHeader,
  rlTigaTitikEmpatDetail,
  jenisKegiatan,
} from "../models/RLTigaTitikEmpat.js";
import Joi from "joi";

export const getDataRLTigaTitikEmpat = (req, res) => {
  rlTigaTitikEmpatDetail
    .findAll({
      attributes: [
        "id",
        "tahun",
        "rmRumahSakit",
        "rmBidan",
        "rmPuskesmas",
        "rmFaskesLainnya",
        "rmHidup",
        "rmMati",
        "rmTotal",
        "rnmHidup",
        "rnmMati",
        "rnmTotal",
        "nrHidup",
        "nrMati",
        "nrTotal",
        "dirujuk",
      ],
      where: {
        rs_id: req.user.rsId,
        tahun: req.query.tahun,
      },
      include: {
        model: jenisKegiatan,
        attributes: ["id", "nama"],
      },
      order: [["jenis_kegiatan_id", "ASC"]],
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

export const insertDataRLTigaTitikEmpat = async (req, res) => {
  const currentYear = new Date().getFullYear();
  const schema = Joi.object({
    tahun: Joi.number()
      .min(currentYear - 1)
      .required(),
    data: Joi.array()
      .items(
        Joi.object()
          .keys({
            jenisKegiatanId: Joi.number().min(0).max(9999999).required(),
            rmRumahSakit: Joi.number().min(0).max(9999999).required(),
            rmBidan: Joi.number().min(0).max(9999999).required(),
            rmPuskesmas: Joi.number().min(0).max(9999999).required(),
            rmFaskesLainnya: Joi.number().min(0).max(9999999).required(),
            rmMati: Joi.number().min(0).max(9999999).required(),
            rnmHidup: Joi.number().min(0).max(9999999).required(),
            rnmMati: Joi.number().min(0).max(9999999).required(),
            nrHidup: Joi.number().min(0).max(9999999).required(),
            nrMati: Joi.number().min(0).max(9999999).required(),
            dirujuk: Joi.number().min(0).max(9999999).required(),
          })
          .required()
      )
      .required(),
  });

  let jenKeg = [
    286, 287, 288, 289, 290, 291, 292, 293, 294, 295, 296, 297, 403,
  ];
  let varRmTotal;
  let varRmHidup;
  let varRnmTotal;
  let varNrTotal;
  let totalKebidanan;

  const { error, value } = schema.validate(req.body);
  if (error) {
    res.status(404).send({
      status: false,
      message: error.details[0].message,
    });
    return;
  }
  let temp;
  let transaction;
  try {
    transaction = await databaseSIRS.transaction();
    const resultInsertHeader = await rlTigaTitikEmpatHeader.create(
      {
        rs_id: req.user.rsId,
        tahun: req.body.tahun,
        user_id: req.user.id,
      },
      { transaction }
    );

    const dataDetail = req.body.data.map((value, index) => {
      if (jenKeg.includes(value.jenisKegiatanId) == false) {
        console.log("Jenis Kegiatan Salah");
        throw new SyntaxError("0");
      }

      varRmTotal =
        value.rmRumahSakit +
        value.rmBidan +
        value.rmPuskesmas +
        value.rmFaskesLainnya;
      varRmHidup = varRmTotal - value.rmMati;
      varRnmTotal = value.rnmMati + value.rnmHidup;
      varNrTotal = value.nrHidup + value.nrMati;

      return {
        rs_id: req.user.rsId,
        tahun: req.body.tahun,
        rl_tiga_titik_empat_id: resultInsertHeader.id,
        jenis_kegiatan_id: value.jenisKegiatanId,
        rmRumahSakit: value.rmRumahSakit,
        rmBidan: value.rmBidan,
        rmPuskesmas: value.rmPuskesmas,
        rmFaskesLainnya: value.rmFaskesLainnya,
        rmHidup: varRmHidup,
        rmMati: value.rmMati,
        rmTotal: varRmTotal,
        rnmHidup: value.rnmHidup,
        rnmMati: value.rnmMati,
        rnmTotal: varRnmTotal,
        nrHidup: value.nrHidup,
        nrMati: value.nrMati,
        nrTotal: varNrTotal,
        dirujuk: value.dirujuk,
        user_id: req.user.id,
      };
    });

    dataDetail.map((value, index) => {
      totalKebidanan = value.rmTotal + value.rnmTotal + value.nrTotal;
      temp = index + 1;
      if (totalKebidanan < value.dirujuk) {
        console.log("Jumlah Dirujuk Salah");
        throw new SyntaxError("911");
      }
    });

    await rlTigaTitikEmpatDetail.bulkCreate(dataDetail, {
      transaction,
      updateOnDuplicate: [
        "rmRumahSakit",
        "rmBidan",
        "rmPuskesmas",
        "rmFaskesLainnya",
        "rmHidup",
        "rmMati",
        "rmTotal",
        "rnmHidup",
        "rnmMati",
        "rnmTotal",
        "nrHidup",
        "nrMati",
        "nrTotal",
        "dirujuk",
      ],
    });
    await transaction.commit();
    res.status(201).send({
      status: true,
      message: "data created",
    });
  } catch (error) {
    if (transaction) {
      await transaction.rollback();
    }
    if (error.message == "0") {
      res.status(400).send({
        status: false,
        message: "Jenis Kegiatan Salah",
      });
    } else if (error.message == "911") {
      res.status(400).send({
        status: false,
        message: "data not created",
        error:
          "Jumlah Dirujuk pada Data Ke-" +
          temp +
          " Tidak Boleh Lebih Dari  RM Total + RNM Total + NR TOTAL",
      });
    } else if (error.name === "SequelizeUniqueConstraintError") {
      res.status(400).send({
        status: false,
        message: "Fail Duplicate Entry",
        // reason: 'Duplicate Entry'
      });
    } else {
      res.status(400).send({
        status: false,
        message: "data not created",
        error: error,
      });
    }
  }
};

export const updateDataRLTigaTitikEmpat = async (req, res) => {
  const schema = Joi.object({
    rmRumahSakit: Joi.number().min(0).max(9999999).required(),
    rmBidan: Joi.number().min(0).max(9999999).required(),
    rmPuskesmas: Joi.number().min(0).max(9999999).required(),
    rmFaskesLainnya: Joi.number().min(0).max(9999999).required(),
    rmMati: Joi.number().min(0).max(9999999).required(),
    rnmHidup: Joi.number().min(0).max(9999999).required(),
    rnmMati: Joi.number().min(0).max(9999999).required(),
    nrHidup: Joi.number().min(0).max(9999999).required(),
    nrMati: Joi.number().min(0).max(9999999).required(),
    dirujuk: Joi.number().min(0).max(9999999).required(),
  }).required();

  let varRmTotal =
    req.body.rmRumahSakit +
    req.body.rmBidan +
    req.body.rmPuskesmas +
    req.body.rmFaskesLainnya;
  let varRmHidup = varRmTotal - req.body.rmMati;
  let varRnmTotal = req.body.rnmMati + req.body.rnmHidup;
  let varNrTotal = req.body.nrHidup + req.body.nrMati;
  let totalKebidanan = varRmTotal + varRnmTotal + varNrTotal;

  const { error, value } = schema.validate(req.body);
  if (error) {
    res.status(404).send({
      status: false,
      message: error.details[0].message,
    });
    return;
  }
  if (totalKebidanan < req.body.dirujuk) {
    res.status(400).send({
      status: false,
      message: "data not created",
      error:
        "Jumlah Dirujuk Tidak Boleh Lebih Dari  RM Total + RNM Total + NR TOTAL",
    });
  }

  try {
    let dataUpdate = {
      rmRumahSakit: req.body.rmRumahSakit,
      rmBidan: req.body.rmBidan,
      rmPuskesmas: req.body.rmPuskesmas,
      rmFaskesLainnya: req.body.rmFaskesLainnya,
      rmHidup: varRmHidup,
      rmMati: req.body.rmMati,
      rmTotal: varRmTotal,
      rnmHidup: req.body.rnmHidup,
      rnmMati: req.body.rnmMati,
      rnmTotal: varRnmTotal,
      nrHidup: req.body.nrHidup,
      nrMati: req.body.nrMati,
      nrTotal: varNrTotal,
      dirujuk: req.body.dirujuk,
    };

    const upDat = await rlTigaTitikEmpatDetail.update(dataUpdate, {
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

export const deleteDataRLTigaTitikEmpat = async (req, res) => {
  try {
    const count = await rlTigaTitikEmpatDetail.destroy({
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

export const getRLTigaTitikEmpatById = async (req, res) => {
  rlTigaTitikEmpatDetail
    .findOne({
      where: {
        id: req.params.id,
      },
      include: {
        model: jenisKegiatan,
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
