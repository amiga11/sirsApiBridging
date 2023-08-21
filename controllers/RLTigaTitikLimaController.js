import { databaseSIRS } from "../config/Database.js";
import {
  rlTigaTitikLimaHeader,
  rlTigaTitikLimaDetail,
  jenisKegiatan,
  jenisGroupKegiatanHeader,
} from "../models/RLTigaTitikLima.js";
import Joi from "joi";
import { Sequelize } from "sequelize";
let jenKeg = [324, 325, 327, 328, 330, 331, 332, 333, 334, 335, 336, 337, 404];
export const getDataRLTigaTitikLima = (req, res) => {
  rlTigaTitikLimaDetail
    .findAll({
      attributes: [
        "id",
        "tahun",
        "rmRumahSakit",
        "rmBidan",
        "rmPuskesmas",
        "rmFaskesLainnya",
        "rmMati",
        "rmTotal",
        "rnmMati",
        "rnmTotal",
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
        attributes: ["id", "no", "nama"],
        order: [[{ model: jenisGroupKegiatanHeader }, "no", "DESC"]],
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

export const insertDataRLTigaTitikLima = async (req, res) => {
  const currentYear = new Date().getFullYear();
  const schema = Joi.object({
    tahun: Joi.number()
      .min(currentYear - 1)
      .required(),
    data: Joi.array()
      .items(
        Joi.object()
          .keys({
            jenisKegiatanId: Joi.number().required(),
            rmRumahSakit: Joi.number().min(0).max(9999999).required(),
            rmBidan: Joi.number().min(0).max(9999999).required(),
            rmPuskesmas: Joi.number().min(0).max(9999999).required(),
            rmFaskesLainnya: Joi.number().min(0).max(9999999).required(),
            rmMati: Joi.number().min(0).max(9999999).required(),
            rnmMati: Joi.number().min(0).max(9999999).required(),
            rnmTotal: Joi.number().min(0).max(9999999).required(),
            nrMati: Joi.number().min(0).max(9999999).required(),
            nrTotal: Joi.number().min(0).max(9999999).required(),
            dirujuk: Joi.number().min(0).max(9999999).required(),
          })
          .required()
      )
      .required(),
  });

  let varRmTotal;

  let varTotal;

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
    const resultInsertHeader = await rlTigaTitikLimaHeader.create(
      {
        rs_id: req.user.rsId,
        tahun: req.body.tahun,
        user_id: req.user.id,
      },
      { transaction: transaction }
    );
    let dataDetail = req.body.data.map((value, index) => {
      if (jenKeg.includes(value.jenisKegiatanId) == false) {
        console.log("Jenis Kegiatan Salah");
        throw new SyntaxError("0");
      }
      if (value.jenisKegiatanId !== 324 && value.jenisKegiatanId !== 325) {
        value.dirujuk = 0;
      }
      varRmTotal =
        value.rmRumahSakit +
        value.rmBidan +
        value.rmPuskesmas +
        value.rmFaskesLainnya;

      return {
        rs_id: req.user.rsId,
        tahun: req.body.tahun,
        rl_tiga_titik_lima_id: resultInsertHeader.id,
        jenis_kegiatan_id: value.jenisKegiatanId,
        rmRumahSakit: value.rmRumahSakit,
        rmBidan: value.rmBidan,
        rmPuskesmas: value.rmPuskesmas,
        rmFaskesLainnya: value.rmFaskesLainnya,
        rmMati: value.rmMati,
        rmTotal: varRmTotal,
        rnmMati: value.rnmMati,
        rnmTotal: value.rnmTotal,
        nrMati: value.nrMati,
        nrTotal: value.nrTotal,
        dirujuk: value.dirujuk,
        user_id: req.user.id,
      };
    });

    // console.log(dataDetail);

    dataDetail.map((value, index) => {
      varTotal = value.rmTotal + value.rnmTotal + value.nrTotal;
      if (value.rmMati > value.rmTotal) {
        console.log("Jumlah Rujuk Medis Total Salah");
        throw new SyntaxError("1");
      } else if (value.rnmMati > value.rnmTotal) {
        console.log("Jumlah Rujuk Non Medis Mati Salah");
        throw new SyntaxError("2");
      } else if (value.nrMati > value.nrTotal) {
        console.log("Jumlah Non Rujuk Medis Mati Salah");
        throw new SyntaxError("3");
      } else if (value.dirujuk > varTotal) {
        console.log("Jumlah Dirujuk Salah");
        throw new SyntaxError("4");
      }
    });

    const resultInsertDetail = await rlTigaTitikLimaDetail.bulkCreate(
      dataDetail,
      {
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
    console.log(error.message);
    if (error.message == "0") {
      res.status(400).send({
        status: false,
        message: "data not created",
        error: "Jenis Kegiatan Salah",
      });
    } else if (error.message == "1") {
      res.status(400).send({
        status: false,
        message: "data not created",
        error:
          "Total Rujuk Medis Mati Tidak Boleh Lebih Dari Jumlah Rujukan Medis Rumah Sakit + Rujukan Medis Bidan + Rujukan Medis Puskesmas + Rujukan Medis Faskes Lainnya",
      });
    } else if (error.message == "2") {
      res.status(400).send({
        status: false,
        message: "data not created",
        error:
          "Jumlah Rujuk Non Medis Mati Tidak Boleh Lebih Dari Rujukan Non Medis Total",
      });
    } else if (error.message == "3") {
      res.status(400).send({
        status: false,
        message: "data not created",
        error:
          "Jumlah Non Rujuk Mati Tidak Boleh Lebih Dari Jumlah Non Rujukan Total",
      });
    } else if (error.message == "4") {
      res.status(400).send({
        status: false,
        message: "data not created",
        error:
          "Jumlah Dirujuk Tidak Boleh Lebih Dari Jumlah Rujukan Medis Rumah Sakit + Rujukan Medis Bidan + Rujukan Medis Puskesmas + Rujukan Medis Faskes Lainnya + Rujukan Non Medis Total + Non Rujukan Total",
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
    if (transaction) {
      await transaction.rollback();
    }
  }
};

export const updateDataRLTigaTitikLima = async (req, res) => {
  const schema = Joi.object({
    jenisKegiatanId: Joi.number().required(),
    rmRumahSakit: Joi.number().min(0).max(9999999).required(),
    rmBidan: Joi.number().min(0).max(9999999).required(),
    rmPuskesmas: Joi.number().min(0).max(9999999).required(),
    rmFaskesLainnya: Joi.number().min(0).max(9999999).required(),
    rmMati: Joi.number().min(0).max(9999999).required(),
    // rmTotal: Joi.number().min(0).max(9999999).required(),
    rnmMati: Joi.number().min(0).max(9999999).required(),
    rnmTotal: Joi.number().min(0).max(9999999).required(),
    nrMati: Joi.number().min(0).max(9999999).required(),
    nrTotal: Joi.number().min(0).max(9999999).required(),
    dirujuk: Joi.number().min(0).max(9999999).required(),
  }).required();

  const { error, value } = schema.validate(req.body);
  if (error) {
    res.status(404).send({
      status: false,
      message: error.details[0].message,
    });
    return;
  }
  let varRmTotal =
    req.body.rmRumahSakit +
    req.body.rmBidan +
    req.body.rmPuskesmas +
    req.body.rmFaskesLainnya;

  let varTotal = varRmTotal + req.body.rnmTotal + req.body.nrTotal;

  try {
    if (jenKeg.includes(req.body.jenisKegiatanId) == false) {
      console.log("Jenis Kegiatan Salah");
      throw new SyntaxError("0");
    }

    if (req.body.jenisKegiatanId !== 324 && req.body.jenisKegiatanId !== 325) {
      req.body.dirujuk = 0;
    }
    let dataUpdate = {
      rmRumahSakit: req.body.rmRumahSakit,
      rmBidan: req.body.rmBidan,
      rmPuskesmas: req.body.rmPuskesmas,
      rmFaskesLainnya: req.body.rmFaskesLainnya,
      rmMati: req.body.rmMati,
      rmTotal: varRmTotal,
      rnmMati: req.body.rnmMati,
      rnmTotal: req.body.rnmTotal,
      nrMati: req.body.nrMati,
      nrTotal: req.body.nrTotal,
      dirujuk: req.body.dirujuk,
    };

    if (dataUpdate.rmTotal < dataUpdate.rmMati) {
      console.log("Jumlah Rujuk Medis Total Salah");
      throw new SyntaxError("1");
    } else if (dataUpdate.rnmTotal < dataUpdate.rnmMati) {
      console.log("Jumlah Rujuk Non Medis Mati Salah");
      throw new SyntaxError("2");
    } else if (dataUpdate.nrTotal < dataUpdate.nrMati) {
      console.log("Jumlah Non Rujuk Medis Mati Salah");
      throw new SyntaxError("3");
    } else if (varTotal < dataUpdate.dirujuk) {
      console.log("Jumlah Dirujuk Salah");
      throw new SyntaxError("4");
    } else {
      const upDat = await rlTigaTitikLimaDetail.update(dataUpdate, {
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
    }
  } catch (error) {
    console.log(error.message);
    if (error.message == "0") {
      res.status(404).send({
        status: false,
        message: "jenis kegiatan id salah",
      });
    } else if (error.message == "1") {
      res.status(400).send({
        status: false,
        message: "data not updated",
        error:
          "Total Rujuk Medis Mati Tidak Boleh Lebih Dari Jumlah Rujukan Medis Rumah Sakit + Rujukan Medis Bidan + Rujukan Medis Puskesmas + Rujukan Medis Faskes Lainnya",
      });
    } else if (error.message == "2") {
      res.status(400).send({
        status: false,
        message: "data not updated",
        error:
          "Jumlah Rujuk Non Medis Mati Tidak Boleh Lebih Dari Rujukan Non Medis Total",
      });
    } else if (error.message == "3") {
      res.status(400).send({
        status: false,
        message: "data not updated",
        error:
          "Jumlah Non Rujuk Mati Tidak Boleh Lebih Dari Jumlah Non Rujukan Total",
      });
    } else if (error.message == "4") {
      res.status(400).send({
        status: false,
        message: "data not updated",
        error:
          "Jumlah Dirujuk Tidak Boleh Lebih Dari Jumlah Rujukan Medis Rumah Sakit + Rujukan Medis Bidan + Rujukan Medis Puskesmas + Rujukan Medis Faskes Lainnya + Rujukan Non Medis Total + Non Rujukan Total",
      });
    } else {
      res.status(400).send({
        status: false,
        message: "data not updated",
        error: error.message,
      });
    }
  }
};

export const deleteDataRLTigaTitikLima = async (req, res) => {
  try {
    const count = await rlTigaTitikLimaDetail.destroy({
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
      message: error.message,
    });
  }
};

export const getRLTigaTitikLimaById = async (req, res) => {
  rlTigaTitikLimaDetail
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
