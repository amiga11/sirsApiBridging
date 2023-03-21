import { databaseSIRS } from "../config/Database.js";
import {
  rlTigaTitikEnamHeader,
  rlTigaTitikEnamDetail,
  rlTigaTItikEnamSpesialis,
} from "../models/RLTigaTitikEnam.js";
import joi from "joi";

export const getDataRLTigaTitikEnam = (req, res) => {
  rlTigaTitikEnamHeader
    .findAll({
      attributes: ["id", "tahun"],
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

export const getDataRLTigaTitikEnamIdTahun = (req, res) => {
  rlTigaTitikEnamDetail
    .findAll({
      attributes: [
        "id",
        "tahun",
        "khusus",
        "besar",
        "sedang",
        "kecil",
        "total",
      ],
      where: {
        rs_id: req.user.rsId,
        tahun: req.query.tahun,
      },
      include: {
        model: rlTigaTItikEnamSpesialis,
        attributes: ["id", "nama"],
      },
      // order: [
      //     [rlTigaTItikEnamSpesialis, 'no','ASC']
      // ]
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

export const getDataRLTigaTitikEnamId = (req, res) => {
  rlTigaTitikEnamDetail
    .findOne({
      where: {
        id: req.params.id,
      },
      include: {
        model: rlTigaTItikEnamSpesialis,
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

export const insertDataRLTigaTitikEnam = async (req, res) => {
  const currentYear = new Date().getFullYear();
  const schema = joi.object({
    tahun: joi
      .number()
      .min(currentYear - 1)
      .required(),
    data: joi
      .array()
      .items(
        joi.object().keys({
          jenisSpesialisId: joi.number().min(1),
          khusus: joi.number().min(0).max(9999999),
          besar: joi.number().min(0).max(9999999),
          sedang: joi.number().min(0).max(9999999),
          kecil: joi.number().min(0).max(9999999),
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
    const resultInsertHeader = await rlTigaTitikEnamHeader.create(
      {
        rs_id: req.user.rsId,
        tahun: req.body.tahun,
        user_id: req.user.id,
      },
      { transaction: transaction }
    );

    const dataDetail = req.body.data.map((value, index) => {
      if (value.jenisSpesialisId > 14) {
        console.log("Jenis Spesialis Salah");
        throw new SyntaxError("0");
      }
      let totalall = value.khusus + value.besar + value.sedang + value.kecil;
      return {
        tahun: req.body.tahun,
        rs_id: req.user.rsId,
        rl_tiga_titik_enam_id: resultInsertHeader.id,
        jenis_spesialis_id: value.jenisSpesialisId,
        total: totalall,
        khusus: value.khusus,
        besar: value.besar,
        sedang: value.sedang,
        kecil: value.kecil,
        user_id: req.user.id,
      };
    });

    const resultInsertDetail = await rlTigaTitikEnamDetail.bulkCreate(
      dataDetail,
      {
        transaction: transaction,
        // updateOnDuplicate: ['total', 'khusus', 'besar', 'sedang', 'kecil']
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
    if (error.message == "0") {
      res.status(400).send({
        status: false,
        message: "Jenis Spesialis Salah",
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

export const deleteDataRLTigaTitikEnamId = async (req, res) => {
  try {
    await rlTigaTitikEnamDetail.destroy({
      where: {
        id: req.params.id,
        rs_id: req.user.rsId,
      },
    });
    res.status(201).send({
      status: true,
      message: "data Deleted",
    });
  } catch (error) {
    console.log(error.message);
  }
  // console.log(req)
};

export const updateDataRLTigaTitikEnamId = async (req, res) => {
  const schema = joi
    .object({
      khusus: joi.number().min(0).max(9999999),
      besar: joi.number().min(0).max(9999999),
      sedang: joi.number().min(0).max(9999999),
      kecil: joi.number().min(0).max(9999999),
    })
    .required();
  try {
    const data = req.body;
    let totalall = data.khusus + data.besar + data.sedang + data.kecil;
    // console.log(data)
    let dataUpdate = {
      total: totalall,
      khusus: data.khusus,
      besar: data.besar,
      sedang: data.sedang,
      kecil: data.kecil,
    };
    try {
      const upDat = await rlTigaTitikEnamDetail.update(dataUpdate, {
        where: {
          id: req.params.id,
          rs_id: req.user.rsId,
        },
      });
      res.status(201).send({
        status: true,
        message: "data Updated",
        data: {
          updated_row: upDat,
        },
      });
    } catch (error) {
      res.status(400).send({
        status: false,
        message: error,
      });
    }
  } catch (error) {
    console.log(error.message);
  }
};
