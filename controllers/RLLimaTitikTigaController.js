import { databaseSIRS } from "../config/Database.js";
import {
  rlLimaTitikTiga,
  rlLimaTitikTigaDetail,
  noUrut,
} from "../models/RLLimaTitikTiga.js";
import Joi from "joi";
import { request } from "http";
// import { getIcd10 } from "./Icd10Controller.js";
// import { icd10 } from "../models/Icd10.js";

export const getDataRLLimaTitikTiga = (req, res) => {
  rlLimaTitikTigaDetail
    .findAll({
      attributes: [
        "id",
        "tahun",
        "kode_icd_10",
        "deskripsi",
        "pasien_keluar_hidup_menurut_jeniskelamin_lk",
        "pasien_keluar_hidup_menurut_jeniskelamin_pr",
        "pasien_keluar_mati_menurut_jeniskelamin_lk",
        "pasien_keluar_mati_menurut_jeniskelamin_pr",
      ],

      where: {
        rs_id: req.user.rsId,
        tahun: req.query.tahun,
      },
      include: {
        model: noUrut,
      },
      subQuery: false,
      limit: 10,
      offset: (1 - 1) * 10,
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

export const getDataRLLimaTitikTigaDetail = (req, res) => {
  rlLimaTitikTigaDetail
    .findAll({
      attributes: [
        "id",
        "rl_lima_titik_tiga_id",
        "user_id",
        "no_urut_id",
        "kode_icd_10",
        "deskripsi",
        "pasien_keluar_hidup_menurut_jeniskelamin_lk",
        "pasien_keluar_hidup_menurut_jeniskelamin_pr",
        "pasien_keluar_mati_menurut_jeniskelamin_lk",
        "pasien_keluar_mati_menurut_jeniskelamin_pr",
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

export const getRLLimaTitikTigaById = async (req, res) => {
  rlLimaTitikTigaDetail
    .findOne({
      where: {
        // rs_id: req.user.rsId,
        // tahun: req.query.tahun
        id: req.params.id,
      },
      include: {
        model: noUrut,
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

export const updateDataRLLimaTitikTiga = async (req, res) => {
  const schema = Joi.object({
    pasienKeluarHidupLK: Joi.number().min(0).max(9999999).required(),
    pasienKeluarHidupPR: Joi.number().min(0).max(9999999).required(),
    pasienKeluarMatiLK: Joi.number().min(0).max(9999999).required(),
    pasienKeluarMatiPR: Joi.number().min(0).max(9999999).required(),
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
    const dataUpdate = {
      pasien_keluar_hidup_menurut_jeniskelamin_lk: req.body.pasienKeluarHidupLK,
      pasien_keluar_hidup_menurut_jeniskelamin_pr: req.body.pasienKeluarHidupPR,
      pasien_keluar_mati_menurut_jeniskelamin_lk: req.body.pasienKeluarMatiLK,
      pasien_keluar_mati_menurut_jeniskelamin_pr: req.body.pasienKeluarMatiPR,
    };
    const upDat = await rlLimaTitikTigaDetail.update(dataUpdate, {
      where: {
        id: req.params.id,
        rs_id: req.user.rsId,
      },
    });
    //  console.log(res)
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

export const deleteDataRLLimaTitikTiga = async (req, res) => {
  try {
    let count = await rlLimaTitikTigaDetail.destroy({
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

export const insertDataRLLimaTitikTiga = async (req, res) => {
  const currentYear = new Date().getFullYear();
  const schema = Joi.object({
    tahun: Joi.number()
      .min(currentYear - 1)
      .required(),
    bulan: Joi.number().min(1).max(12).required(),
    data: Joi.array()
      .items(
        Joi.object().keys({
          noUrutId: Joi.number().required(),
          kodeIcd10: Joi.string().required(),
          deskripsi: Joi.string().required(),
          pasienKeluarHidupLK: Joi.number().min(0).max(9999999).required(),
          pasienKeluarHidupPR: Joi.number().min(0).max(9999999).required(),
          pasienKeluarMatiLK: Joi.number().min(0).max(9999999).required(),
          pasienKeluarMatiPR: Joi.number().min(0).max(9999999).required(),
        })
      )
      .required(),
  });
  //console.log(req);
  const { error, value } = schema.validate(req.body);
  if (error) {
    res.status(404).send({
      status: false,
      message: error.details[0].message,
    });
    return;
  }

  const bulan = [
    "01",
    "02",
    "03",
    "04",
    "05",
    "06",
    "07",
    "08",
    "09",
    "10",
    "11",
    "12",
  ];

  let aricd = [];
  req.body.data.map((value, index) => {
    aricd.push(value.kodeIcd10);
  });

  const transaction = await databaseSIRS.transaction();
  try {
    //checking length of parameters inserted
    if (req.body.data.length > 10) {
      console.log("Inputan Lebih dari 10");
      throw new SyntaxError("2");
    }
    //checking duplicate icd
    let resultToReturn = false;
    resultToReturn = aricd.some((element, index) => {
      return aricd.indexOf(element) !== index;
    });
    if (resultToReturn) {
      console.log("Duplicate elements exist");
      throw new SyntaxError("0");
    }

    bulan.map((value, index) => {
      if (req.body.bulan - 1 == index) {
        req.body.bulan = req.body.tahun + "-" + value + "-01";
      }
    });

    const resultInsertHeader = await rlLimaTitikTiga.create(
      {
        rs_id: req.user.rsId,
        tahun: req.body.bulan,
        user_id: req.user.id,
      },
      { transaction: transaction }
    );

    const dataDetail = req.body.data.map((value, index) => {
      return {
        rl_lima_titik_tiga_id: resultInsertHeader.id,
        no_urut_id: value.noUrutId,
        kode_icd_10: value.kodeIcd10,
        deskripsi: value.deskripsi,
        pasien_keluar_hidup_menurut_jeniskelamin_lk: value.pasienKeluarHidupLK,
        pasien_keluar_hidup_menurut_jeniskelamin_pr: value.pasienKeluarHidupPR,
        pasien_keluar_mati_menurut_jeniskelamin_lk: value.pasienKeluarMatiLK,
        pasien_keluar_mati_menurut_jeniskelamin_pr: value.pasienKeluarMatiPR,
        rs_id: req.user.rsId,
        tahun: req.body.bulan,
        user_id: req.user.id,
      };
    });

    const resultInsertDetail = await rlLimaTitikTigaDetail.bulkCreate(
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
    if (error.message == "2") {
      res.status(400).send({
        status: false,
        message: "Inputan Lebih dari 10",
      });
    } else if (error.message == "0") {
      res.status(400).send({
        status: false,
        message: "Ada Kode ICD yang Sama",
      });
    } else if (error.name === "SequelizeUniqueConstraintError") {
      res.status(400).send({
        status: false,
        message: "Duplicate Entry",
      });
    } else if (error.name === "SequelizeForeignKeyConstraintError") {
      res.status(400).send({
        status: false,
        message: "Kode ICD 10 Salah",
      });
    } else {
      res.status(400).send({
        status: false,
        message: error,
      });
    }
  }
};
