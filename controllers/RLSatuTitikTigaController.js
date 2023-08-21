import { databaseSIRS } from "../config/Database.js";
import {
  rlSatuTitikTigaHeader,
  rlSatuTitikTigaDetail,
  jenisPelayanan,
} from "../models/RLSatuTitikTiga.js";
import Joi from "joi";

export const getDataRLSatuTitikTiga = (req, res) => {
  rlSatuTitikTigaDetail
    .findAll({
      attributes: [
        "id",
        "tahun",
        "jumlah_tempat_tidur",
        "kelas_VVIP",
        "kelas_VIP",
        "kelas_1",
        "kelas_2",
        "kelas_3",
        "kelas_khusus",
      ],
      where: {
        rs_id: req.user.rsId,
        tahun: req.query.tahun,
      },
      include: {
        model: jenisPelayanan,
        attributes: ["id", "nama"],
      },
      order: [["jenis_pelayanan_id", "ASC"]],
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

export const getDataRLSatuTitikTigaDetail = (req, res) => {
  rlSatuTitikTigaDetail
    .findAll({
      attributes: ["id", "rl_tiga_titik_satu_id"],
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

export const getDataRLSatuTitikTigaDetailById = async (req, res) => {
  rlSatuTitikTigaDetail
    .findOne({
      where: {
        id: req.params.id,
      },
      include: {
        model: jenisPelayanan,
      },
    })
    .then((results) => {
      if (!results) {
        res.status(200).send({
          status: true,
          message: "data not found",
          data: results,
        });
        return;
      }
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

export const insertDataRLSatuTitikTiga = async (req, res) => {
  const currentYear = new Date().getFullYear();
  const schema = Joi.object({
    tahun: Joi.number()
      .min(currentYear - 1)
      .required(),
    data: Joi.array()
      .items(
        Joi.object()
          .keys({
            jenisPelayananId: Joi.number().min(0).max(9999999).required(),
            // jumlahTempatTidur: Joi.number().min(0).max(9999999).required(),
            kelasVVIP: Joi.number().min(0).max(9999999).required(),
            kelasVIP: Joi.number().min(0).max(9999999).required(),
            kelas1: Joi.number().min(0).max(9999999).required(),
            kelas2: Joi.number().min(0).max(9999999).required(),
            kelas3: Joi.number().min(0).max(9999999).required(),
            kelasKhusus: Joi.number().min(0).max(9999999).required(),
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
  let jenPel = [
    43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61,
    62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72,
  ];

  let jumlahTempatTidur;

  const transaction = await databaseSIRS.transaction();
  try {
    const resultInsertHeader = await rlSatuTitikTigaHeader.create(
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
      if (jenPel.includes(value.jenisPelayananId) == false) {
        console.log("Jenis Pelayanan Salah");
        throw new SyntaxError("0");
      }

      jumlahTempatTidur =
        value.kelasVVIP +
        value.kelasVIP +
        value.kelas1 +
        value.kelas2 +
        value.kelas3 +
        value.kelasKhusus;
      return {
        rs_id: req.user.rsId,
        tahun: req.body.tahun,
        rl_satu_titik_tiga_id: resultInsertHeader.id,
        jenis_pelayanan_id: value.jenisPelayananId,
        jumlah_tempat_tidur: jumlahTempatTidur,
        kelas_VVIP: value.kelasVVIP,
        kelas_VIP: value.kelasVIP,
        kelas_1: value.kelas1,
        kelas_2: value.kelas2,
        kelas_3: value.kelas3,
        kelas_khusus: value.kelasKhusus,
        user_id: req.user.id,
      };
    });

    const resultInsertDetail = await rlSatuTitikTigaDetail.bulkCreate(
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
        error: "Jenis Pelayanan Salah",
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

export const updateDataRLSatuTitikTiga = async (req, res) => {
  const schema = Joi.object({
    kelasVVIP: Joi.number().min(0).max(9999999).required(),
    kelasVIP: Joi.number().min(0).max(9999999).required(),
    kelas1: Joi.number().min(0).max(9999999).required(),
    kelas2: Joi.number().min(0).max(9999999).required(),
    kelas3: Joi.number().min(0).max(9999999).required(),
    kelasKhusus: Joi.number().min(0).max(9999999).required(),
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
    const update = await rlSatuTitikTigaDetail.update(
      {
        kelas_VVIP: req.body.kelasVVIP,
        kelas_VIP: req.body.kelasVIP,
        kelas_1: req.body.kelas1,
        kelas_2: req.body.kelas2,
        kelas_3: req.body.kelas3,
        kelas_khusus: req.body.kelasKhusus,
        user_id: req.user.id,
      },
      {
        where: {
          id: req.params.id,
          rs_id: req.user.rsId,
        },
      }
    );
    res.status(200).json({
      status: true,
      message: "data update successfully",
      data: {
        updated_row: update,
      },
    });
  } catch (error) {
    console.log(error.message);
  }
};

export const deleteDataRLSatuTitikTiga = async (req, res) => {
  try {
    const count = await rlSatuTitikTigaDetail.destroy({
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
