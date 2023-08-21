import { databaseSIRS } from "../config/Database.js";
import {
  rlTigaTitikSepuluhHeader,
  rlTigaTitikSepuluhDetail,
  jenisKegiatan,
} from "../models/RLTigaTitikSepuluh.js";
import Joi from "joi";

export const getDatarlTigaTitikSepuluh = (req, res) => {
  rlTigaTitikSepuluhDetail
    .findAll({
      attributes: ["id", "tahun", "jumlah"],
      where: {
        rs_id: req.user.rsId,
        tahun: req.query.tahun,
      },
      include: {
        model: jenisKegiatan,
        order: [[rlTigaTitikSepuluhDetail, "jenis_kegiatan_id", "DESC"]],
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

export const getDatarlTigaTitikSepuluhDetail = (req, res) => {
  rlTigaTitikSepuluhDetail
    .findAll({
      attributes: [
        "id",
        "rl_tiga_titik_sepuluh_id",
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

export const getrlTigaTitikSepuluhById = async (req, res) => {
  rlTigaTitikSepuluhDetail
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

export const updateDatarlTigaTitikSepuluh = async (req, res) => {
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
    const upDat = await rlTigaTitikSepuluhDetail.update(req.body, {
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

export const insertDataRLTigaTitikSepuluh = async (req, res) => {
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

  let jenKeg = [
    388, 389, 390, 391, 392, 393, 394, 395, 396, 397, 398, 399, 400, 401, 407,
  ];

  const transaction = await databaseSIRS.transaction();
  try {
    const resultInsertHeader = await rlTigaTitikSepuluhHeader.create(
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
        rl_tiga_titik_sepuluh_id: resultInsertHeader.id,
        jenis_kegiatan_id: value.jenisKegiatanId,
        jumlah: value.jumlah,
        user_id: req.user.id,
      };
    });

    const resultInsertDetail = await rlTigaTitikSepuluhDetail.bulkCreate(
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
        error: "Jenis Kegiatan Salah",
      });
    } else if (error.name === "SequelizeUniqueConstraintError") {
      res.status(400).send({
        status: false,
        message: "Duplicate Entry",
      });
    } else {
      console.log(error);
      res.status(400).send({
        status: false,
        message: "data not created",
        error: error,
      });
    }
  }
};

export const deleteDataRLTigaTitikSepuluh = async (req, res) => {
  try {
    const count = await rlTigaTitikSepuluhDetail.destroy({
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
