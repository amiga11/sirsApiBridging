import { databaseSIRS } from "../config/Database.js";
import {
  rlLimaTitikDuaHeader,
  rlLimaTitikDuaDetail,
  jenisKegiatan,
} from "../models/RLLimaTitikDua.js";
import Joi from "joi";

export const getDataRLLimaTitikDua = (req, res) => {
  //   console.log(req.user);
  rlLimaTitikDuaDetail
    .findAll({
      attributes: ["id", "tahun", "jumlah"],
      where: {
        rs_id: req.user.rsId,
        tahun: req.query.tahun,
      },
      include: {
        model: jenisKegiatan,
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

export const insertDataRLLimaTitikDua = async (req, res) => {
  const currentYear = new Date().getFullYear();
  const schema = Joi.object({
    tahun: Joi.number()
      .min(currentYear - 1)
      .required(),
    bulan: Joi.number().min(1).max(12).required(),
    data: Joi.array()
      .items(
        Joi.object()
          .keys({
            jenisKegiatanId: Joi.number().required(),
            jumlah: Joi.number().min(0).max(9999999).required(),
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

  const transaction = await databaseSIRS.transaction();
  let jenKeg = [
    358, 359, 360, 361, 362, 363, 364, 365, 366, 367, 368, 369, 370, 371, 372,
    373, 374, 375, 376, 377, 378, 379, 380, 381, 382, 383, 384, 385, 386, 387,
    411,
  ];
  try {
    bulan.map((value, index) => {
      if (req.body.bulan - 1 == index) {
        req.body.bulan = req.body.tahun + "-" + value + "-01";
      }
    });
    const resultInsertHeader = await rlLimaTitikDuaHeader.create(
      {
        rs_id: req.user.rsId,
        tahun: req.body.bulan,
        user_id: req.user.id,
      },
      { transaction: transaction }
    );

    const dataDetail = req.body.data.map((value, index) => {
      if (jenKeg.includes(value.jenisKegiatanId) == false) {
        console.log("Jenis Kegiatan Id Salah");
        throw new SyntaxError("0");
      }
      return {
        rs_id: req.user.rsId,
        tahun: req.body.bulan,
        rl_lima_titik_dua_id: resultInsertHeader.id,
        jenis_kegiatan_id: value.jenisKegiatanId,
        jumlah: value.jumlah,
        user_id: req.user.id,
      };
    });

    const resultInsertDetail = await rlLimaTitikDuaDetail.bulkCreate(
      dataDetail,
      {
        transaction: transaction,
      }
    );
    // console.log(resultInsertDetail[0].id)
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
        message: "data not created",
        error: "Jenis Kegiatan Salah",
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

export const updateDataRLLimaTitikDua = async (req, res) => {
  const schema = Joi.object({
    jumlah: Joi.number().min(0).max(9999999).required(),
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
    const upDat = await rlLimaTitikDuaDetail.update(req.body, {
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

export const deleteDataRLLimaTitikDua = async (req, res) => {
  try {
    const count = await rlLimaTitikDuaDetail.destroy({
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

export const getRLLimaTitikDuaById = async (req, res) => {
  rlLimaTitikDuaDetail
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
