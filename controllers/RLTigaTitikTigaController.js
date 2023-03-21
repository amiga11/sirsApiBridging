import { databaseSIRS } from "../config/Database.js";
import {
  rlTigaTitikTigaHeader,
  rlTigaTitikTigaDetail,
  jenisKegiatan,
} from "../models/RLTigaTitikTiga.js";
import Joi from "joi";

export const getDataRLTigaTitikTiga = (req, res) => {
  rlTigaTitikTigaDetail
    .findAll({
      attributes: ["id", "tahun", "jumlah"],
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

export const getDataRLTigaTitikTigaDetail = (req, res) => {
  rlTigaTitikTigaDetail
    .findAll({
      attributes: [
        "id",
        "rl_tiga_titik_tiga_id",
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

export const getRLTigaTitikTigaById = async (req, res) => {
  rlTigaTitikTigaDetail
    .findOne({
      where: {
        // rs_id: req.user.rsId,
        // tahun: req.query.tahun
        id: req.params.id,
      },
      include: {
        model: jenisKegiatan,
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

export const insertDataRLTigaTitikTiga = async (req, res) => {
  const currentYear = new Date().getFullYear();
  const schema = Joi.object({
    tahun: Joi.number()
      .min(currentYear - 1)
      .required(),
    data: Joi.array()
      .items(
        Joi.object()
          .keys({
            jenisKegiatanId: Joi.number().min(1).max(9999999).required(),
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
  let jenKeg = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 402];
  const transaction = await databaseSIRS.transaction();
  try {
    const resultInsertHeader = await rlTigaTitikTigaHeader.create(
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
      if (jenKeg.includes(value.jenisKegiatanId) == false) {
        console.log("Jenis Kegiatan Salah");
        throw new SyntaxError("0");
      }
      return {
        rs_id: req.user.rsId,
        tahun: req.body.tahun,
        rl_tiga_titik_tiga_id: resultInsertHeader.id,
        jenis_kegiatan_id: value.jenisKegiatanId,
        jumlah: value.jumlah,
        user_id: req.user.id,
      };
    });

    const resultInsertDetail = await rlTigaTitikTigaDetail.bulkCreate(
      dataDetail,
      {
        transaction: transaction,
        // updateOnDuplicate:['jumlah']
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
export const deleteDataRLTigaTitikTiga = async (req, res) => {
  try {
    const count = await rlTigaTitikTigaDetail.destroy({
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

export const updateDataRLTigaTitikTiga = async (req, res) => {
  const schema = Joi.object({
    jumlah: Joi.number().min(0).max(9999999).required(),
  }).required();
  try {
    const data = req.body;
    try {
      const upd = await rlTigaTitikTigaDetail.update(data, {
        where: {
          id: req.params.id,
          rs_id: req.user.rsId,
        },
      });
      res.status(201).send({
        status: true,
        message: "Data Diperbaharui",
        data: {
          updated_row: upd,
        },
      });
    } catch (error) {
      res.status(400).send({
        status: false,
        message: "Gagal Memperbaharui Data",
      });
    }
  } catch (error) {
    console.log(error.message);
    res.status(400).send({
      status: false,
      message: "Gagal Memperbaharui Data",
    });
  }
};
