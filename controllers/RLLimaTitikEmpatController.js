import { databaseSIRS } from "../config/Database.js";
import {
  rlLimaTitikEmpat,
  rlLimaTitikEmpatDetail,
  noUrut,
} from "../models/RLLimaTitikEmpat.js";
import Joi from "joi";

export const getDataRLLimaTitikEmpat = (req, res) => {
  rlLimaTitikEmpatDetail
    .findAll({
      attributes: [
        "id",
        "tahun",
        "kode_icd_10",
        "deskripsi",
        "kasus_baru_Lk",
        "kasus_baru_Pr",
        "jumlah_kasus_baru",
        "jumlah_kunjungan",
      ],

      where: {
        rs_id: req.user.rsId,
        tahun: req.query.tahun,
      },
      include: {
        model: noUrut,
      },
      order: [["jumlah_kasus_baru", "DESC"]],
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

export const getDataRLLimaTitikEmpatDetail = (req, res) => {
  rlLimaTitikEmpatDetail
    .findAll({
      attributes: [
        "id",
        "rl_lima_titik_empat_id",
        "user_id",
        "no_urut_id",
        "kode_icd_10",
        "deskripsi",
        "kasus_baru_Lk",
        "kasus_baru_Pr",
        "jumlah_kasus_baru",
        "jumlah_kunjungan",
      ],
      order: [
        // ['id', 'DESC'],
        ["jumlah_kasus_baru", "ASC"],
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

export const getRLLimaTitikEmpatById = async (req, res) => {
  rlLimaTitikEmpatDetail
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

export const updateDataRLLimaTitikEmpat = async (req, res) => {
  const schema = Joi.object({
    kasusBaruLk: Joi.number().min(0).max(9999999).required(),
    kasusBaruPr: Joi.number().min(0).max(9999999).required(),
    jumlahKunjungan: Joi.number().min(0).max(9999999).required(),
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
    let jumlahKasusBaru = req.body.kasusBaruLk + req.body.kasusBaruPr;
    const dataUpdate = {
      kasus_baru_Lk: parseInt(req.body.kasusBaruLk),
      kasus_baru_Pr: parseInt(req.body.kasusBaruPr),
      jumlah_kasus_baru: jumlahKasusBaru,
      jumlah_kunjungan: req.body.jumlahKunjungan,
    };
    if (jumlahKasusBaru > req.body.jumlahKunjungan) {
      res.status(400).send({
        status: false,
        message:
          "Jumlah Kunjungan tidak boleh lebih kecil dari Jumlah Kasus Baru",
      });
    } else {
      const upDat = await rlLimaTitikEmpatDetail.update(dataUpdate, {
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
  }
};

export const deleteDataRLLimaTitikEmpat = async (req, res) => {
  try {
    let count = await rlLimaTitikEmpatDetail.destroy({
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

export const insertDataRLLimaTitikEmpat = async (req, res) => {
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
          kasusBaruLk: Joi.number().min(0).max(9999999).required(),
          kasusBaruPr: Joi.number().min(0).max(9999999).required(),
          jumlahKunjungan: Joi.number().min(0).max(9999999).required(),
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

    const resultInsertHeader = await rlLimaTitikEmpat.create(
      {
        rs_id: req.user.rsId,
        tahun: req.body.bulan,
        user_id: req.user.id,
      },
      { transaction: transaction }
    );

    const dataDetail = req.body.data.map((value, index) => {
      let jumlahKasusBaru = value.kasusBaruLk + value.kasusBaruPr;
      if (jumlahKasusBaru > value.jumlahKunjungan) {
        console.log(
          "Jumlah Kunjungan tidak boleh lebih kecil dari Jumlah Kasus Baru"
        );
        throw new SyntaxError("1");
      }

      return {
        rl_lima_titik_empat_id: resultInsertHeader.id,
        no_urut_id: value.noUrutId,
        kode_icd_10: value.kodeIcd10,
        deskripsi: value.deskripsi,
        kasus_baru_Lk: parseInt(value.kasusBaruLk),
        kasus_baru_Pr: parseInt(value.kasusBaruPr),
        jumlah_kasus_baru: jumlahKasusBaru,
        jumlah_kunjungan: value.jumlahKunjungan,
        rs_id: req.user.rsId,
        tahun: req.body.bulan,
        user_id: req.user.id,
      };
    });
    const resultInsertDetail = await rlLimaTitikEmpatDetail.bulkCreate(
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
    } else if (error.name === "SequelizeForeignKeyConstraintError") {
      res.status(400).send({
        status: false,
        message: "Kode ICD 10 Salah",
      });
    } else if (error.message == "1") {
      res.status(400).send({
        status: false,
        message:
          "Jumlah Kunjungan tidak boleh lebih kecil dari Jumlah Kasus Baru",
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
