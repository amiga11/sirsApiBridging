import { databaseSIRS } from "../config/Database.js";
import {
  rlTigaTitikDelapan,
  rlTigaTitikDelapanDetail,
} from "../models/RLTigaTitikDelapan.js";
import Joi from "joi";
import {
  groupJenisKegiatan,
  groupJenisKegiatanHeader,
  jenisKegiatan,
} from "../models/JenisKegiatan.js";

export const getDataRLTigaTitikDelapan = (req, res) => {
  rlTigaTitikDelapan
    .findAll({
      attributes: ["id", "tahun"],
      where: {
        rs_id: req.user.rsId,
        tahun: req.query.tahun,
      },
      include: {
        model: rlTigaTitikDelapanDetail,
        include: {
          model: jenisKegiatan,
        },
      },
      order: [[rlTigaTitikDelapanDetail, jenisKegiatan, "no", "ASC"]],
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

export const getDataRLTigaTitikDelapanDetailKegiatan = (req, res) => {
  rlTigaTitikDelapanDetail
    .findAll({
      attributes: ["id", "tahun", "jumlah"],
      where: {
        rs_id: req.user.rsId,
        tahun: req.query.tahun,
      },
      include: {
        model: jenisKegiatan,
        attributes: ["id", "no", "nama"],
        order: [[jenisKegiatan, "no", "ASC"]],
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

export const getDataRLTigaTitikDelapanById = (req, res) => {
  rlTigaTitikDelapanDetail
    .findOne({
      where: {
        id: req.params.id,
      },
      include: {
        model: jenisKegiatan,
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

export const getDataRLTigaTitikDelapanDetails = (req, res) => {
  rlTigaTitikDelapan
    .findAll({
      include: [{ model: rlTigaTitikDelapanDetail, include: [jenisKegiatan] }],
      attributes: ["id", "tahun"],
      where: {
        rs_id: req.user.rsId,
        user_id: req.user.id,
        tahun: req.param.tahun,
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

export const insertDataRLTigaTitikDelapan = async (req, res) => {
  const currentYear = new Date().getFullYear();
  const schema = Joi.object({
    tahun: Joi.number()
      .min(currentYear - 1)
      .required(),
    data: Joi.array()
      .items(
        Joi.object().keys({
          jenisKegiatanId: Joi.number().min(0).required(),
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
    17, 18, 19, 20, 21, 22, 23, 24, 26, 27, 28, 29, 30, 31, 33, 34, 35, 37, 38,
    39, 40, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58,
    59, 60, 61, 62, 63, 65, 66, 67, 68, 69, 70, 71, 72, 75, 76, 77, 78, 79, 80,
    81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 91, 92, 93, 94, 95, 97, 98, 99, 100,
    101, 103, 104, 105, 106, 107, 108, 109, 110, 111, 113, 114, 115, 116, 117,
    118, 119, 120, 121, 122, 123, 124, 125, 126, 127, 128, 130, 131, 132, 133,
    134, 135, 136, 137, 138, 139, 140, 141, 142, 143, 144, 145, 146, 147, 148,
    149, 150, 152, 153, 154, 155, 156, 157, 159, 160, 161, 162, 163, 164, 165,
    166, 167, 169, 170, 171, 172, 173, 174, 175, 176, 177, 178, 179, 180, 181,
    182, 183, 184, 185, 186, 187, 188, 189, 190, 191, 192, 193, 194, 195, 196,
    197, 198, 199, 200, 202, 203, 204, 205, 206, 207, 208, 209, 210, 211, 212,
    213, 214, 215, 406,
  ];

  const transaction = await databaseSIRS.transaction();

  try {
    const rlInsertHeader = await rlTigaTitikDelapan.create(
      {
        rs_id: req.user.rsId,
        user_id: req.user.id,
        tahun: req.body.tahun,
      },
      { transaction: transaction }
    );

    const dataDetail = req.body.data.map((value, index) => {
      if (jenKeg.includes(value.jenisKegiatanId) == false) {
        console.log("Jenis Kegiatan Salah");
        throw new SyntaxError("0");
      }
      return {
        tahun: req.body.tahun,
        rs_id: req.user.rsId,
        rl_tiga_titik_delapan_id: rlInsertHeader.id,
        jenis_kegiatan_id: value.jenisKegiatanId,
        jumlah: value.jumlah,
        user_id: req.user.id,
      };
    });

    await rlTigaTitikDelapanDetail.bulkCreate(dataDetail, {
      transaction: transaction,
    });


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
    await transaction.rollback();
    console.log(error);
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

export const updateDataRLTigaTitikDelapan = async (req, res) => {
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
    const upDat = await rlTigaTitikDelapanDetail.update(req.body, {
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

export const deleteDataRLTigaTitikDelapan = async (req, res) => {
  try {
    const count = await rlTigaTitikDelapanDetail.destroy({
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
