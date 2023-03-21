import { databaseSIRS } from "../config/Database.js";
import {
  rlTigaTitikTujuh,
  rlTigaTitikTujuhDetail,
  jenisGroupKegiatanHeader,
} from "../models/RLTigaTitikTujuh.js";
import Joi from "joi";
import { jenisKegiatan } from "../models/JenisKegiatan.js";

export const getDataRLTigaTitikTujuh = (req, res) => {
  rlTigaTitikTujuhDetail
    .findAll({
      attributes: ["id", "tahun", "jumlah"],
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

export const getDataRLTigaTitikTujuhDetail = (req, res) => {
  rlTigaTitikTujuhDetail
    .findAll({
      attributes: [
        "id",
        "rl_tiga_titik_tujuh_id",
        "user_id",
        "jenis_kegiatan_id",
        "jumlah",
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

export const getRLTigaTitikTujuhById = async (req, res) => {
  rlTigaTitikTujuhDetail
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

export const updateDataRLTigaTitikTujuh = async (req, res) => {
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
    let upd = await rlTigaTitikTujuhDetail.update(req.body, {
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

export const deleteDataRLTigaTitikTujuh = async (req, res) => {
  try {
    await rlTigaTitikTujuhDetail.destroy({
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
    res.status(404).send({
      status: false,
      message: error,
    });
  }
};

export const insertDataRLTigaTitikTujuh = async (req, res) => {
  const currentYear = new Date().getFullYear();
  const schema = Joi.object({
    tahun: Joi.number()
      .min(currentYear - 1)
      .required(),
    data: Joi.array()
      .items(
        Joi.object().keys({
          jenisKegiatanId: Joi.number().min(0).max(9999999).required(),
          jumlah: Joi.number().min(0).max(9999999).required(),
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

  let jenKeg = [
    338, 339, 340, 341, 342, 343, 344, 345, 346, 347, 348, 349, 350, 351, 352,
    353, 354, 405,
  ];

  const transaction = await databaseSIRS.transaction();
  try {
    const resultInsertHeader = await rlTigaTitikTujuh.create(
      {
        rs_id: req.user.rsId,
        tahun: req.body.tahun,
        user_id: req.user.id,
      },
      { transaction: transaction }
    );

    const dataDetail = req.body.data.map((value, index) => {
      if (jenKeg.includes(value.jenisKegiatanId) == false) {
        console.log("Jenis Kegiatan Salah");
        throw new SyntaxError("0");
      }
      return {
        rl_tiga_titik_tujuh_id: resultInsertHeader.id,
        jenis_kegiatan_id: value.jenisKegiatanId,
        jumlah: value.jumlah,
        rs_id: req.user.rsId,
        tahun: req.body.tahun,
        user_id: req.user.id,
      };
    });

    const resultInsertDetail = await rlTigaTitikTujuhDetail.bulkCreate(
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
    console.log(error.code);
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
        message: "error",
      });
    }
  }
};
