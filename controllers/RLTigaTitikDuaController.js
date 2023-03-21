import { databaseSIRS } from "../config/Database.js";
import {
  rlTigaTitikDuaHeader,
  rlTigaTitikDuaDetail,
  jenisPelayanan,
} from "../models/RLTigaTitikDua.js";
import Joi from "joi";

export const getDataRLTigaTitikDua = (req, res) => {
  rlTigaTitikDuaDetail
    .findAll({
      attributes: [
        "id",
        "tahun",
        "total_pasien_rujukan",
        "total_pasien_non_rujukan",
        "tindak_lanjut_pelayanan_dirawat",
        "tindak_lanjut_pelayanan_dirujuk",
        "tindak_lanjut_pelayanan_pulang",
        "mati_di_ugd",
        "doa",
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

export const insertDataRLTigaTitikDua = async (req, res) => {
  const currentYear = new Date().getFullYear();
  const schema = Joi.object({
    tahun: Joi.number()
      .min(currentYear - 1)
      .required(),
    data: Joi.array()
      .items(
        Joi.object()
          .keys({
            jenisPelayananId: Joi.number().min(11).required(),
            totalPasienRujukan: Joi.number().min(0).max(9999999).required(),
            totalPasienNonRujukan: Joi.number().min(0).max(9999999).required(),
            tindakLanjutPelayananDirawat: Joi.number()
              .min(0)
              .max(9999999)
              .required(),
            tindakLanjutPelayananDirujuk: Joi.number()
              .min(0)
              .max(9999999)
              .required(),
            // tindakLanjutPelayananPulang: Joi.number().min(0).max(9999999).required(),
            matiDiUGD: Joi.number().min(0).max(9999999).required(),
            doa: Joi.number().min(0).max(9999999).required(),
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

  let transaction = await databaseSIRS.transaction();
  try {
    const resultInsertHeader = await rlTigaTitikDuaHeader.create(
      {
        rs_id: req.user.rsId,
        tahun: req.body.tahun,
        user_id: req.user.id,
      },
      { transaction: transaction }
    );

    let total;
    let totaltindakan;
    let jumlahPelayananPulang;
    const dataDetail = req.body.data.map((value, index) => {
      if (value.jenisPelayananId > 15) {
        console.log("Jenis Pelayanan Salah");
        throw new SyntaxError("0");
      }

      total = value.totalPasienRujukan + value.totalPasienNonRujukan;
      totaltindakan =
        value.tindakLanjutPelayananDirawat +
        value.tindakLanjutPelayananDirujuk +
        value.matiDiUGD +
        value.doa;
      jumlahPelayananPulang = total - totaltindakan;
      if (total < totaltindakan) {
        console.log("Jumlah Tindak Lanjut Pelayanan Pulang Tidak Sesuai");
        throw new SyntaxError("1");
      }

      return {
        rs_id: req.user.rsId,
        tahun: req.body.tahun,
        rl_tiga_titik_dua_id: resultInsertHeader.id,
        jenis_pelayanan_id: value.jenisPelayananId,
        total_pasien_rujukan: value.totalPasienRujukan,
        total_pasien_non_rujukan: value.totalPasienNonRujukan,
        tindak_lanjut_pelayanan_dirawat: value.tindakLanjutPelayananDirawat,
        tindak_lanjut_pelayanan_dirujuk: value.tindakLanjutPelayananDirujuk,
        tindak_lanjut_pelayanan_pulang: jumlahPelayananPulang,
        mati_di_ugd: value.matiDiUGD,
        doa: value.doa,
        user_id: req.user.id,
      };
    });

    const resultInsertDetail = await rlTigaTitikDuaDetail.bulkCreate(
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
    if (error.message == "0") {
      res.status(400).send({
        status: false,
        message: "Jenis Pelayanan Salah",
      });
    } else if (error.message == "1") {
      res.status(400).send({
        status: false,
        message: "Jumlah Tindak Lanjut Pelayanan Pulang Tidak Sesuai",
      });
    } else if (error.name === "SequelizeUniqueConstraintError") {
      res.status(400).send({
        status: false,
        message: error,
      });
    } else {
      res.status(400).send({
        status: false,
        message: error,
      });
    }

    await transaction.rollback();
  }
};

export const deleteDataRLTigaTitikDua = async (req, res) => {
  try {
    const count = await rlTigaTitikDuaDetail.destroy({
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

export const getDataRLTigaTitikDuaDetail = (req, res) => {
  rlTigaTitikDuaDetail
    .findAll({
      attributes: [
        "id",
        "rl_tiga_titik_dua_id",
        "user_id",
        "jenis_pelayanan_id",
        "total_pasien_rujukan",
        "total_pasien_non_rujukan",
        "tindak_lanjut_pelayanan_dirawat",
        "tindak_lanjut_pelayanan_dirujuk",
        "tindak_lanjut_pelayanan_pulang",
        "mati_di_ugd",
        "doa",
      ],
      where: {
        id: req.params.id,
      },
      include: {
        model: jenisPelayanan,
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

export const getRLTigaTitikDuaById = async (req, res) => {
  rlTigaTitikDuaDetail
    .findOne({
      where: {
        // rs_id: req.user.rsId,
        // tahun: req.query.tahun
        id: req.params.id,
      },
      include: {
        model: jenisPelayanan,
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

export const updateDataRLTigaTitikDua = async (req, res) => {
  const schema = Joi.object()
    .keys({
      totalPasienRujukan: Joi.number().min(0).max(9999999).required(),
      totalPasienNonRujukan: Joi.number().min(0).max(9999999).required(),
      tindakLanjutPelayananDirawat: Joi.number().min(0).max(9999999).required(),
      tindakLanjutPelayananDirujuk: Joi.number().min(0).max(9999999).required(),
      matiDiUGD: Joi.number().min(0).max(9999999).required(),
      doa: Joi.number().min(0).max(9999999).required(),
    })
    .required();

  try {
    const data = req.body;
    let total = data.totalPasienNonRujukan + data.totalPasienNonRujukan;
    let totaltindakan =
      data.tindakLanjutPelayananDirawat +
      data.tindakLanjutPelayananDirujuk +
      data.matiDiUGD +
      data.doa;
    let jumlahPelayananPulang = total - totaltindakan;
    const dataUPdate = {
      total_pasien_rujukan: data.totalPasienRujukan,
      total_pasien_non_rujukan: data.totalPasienNonRujukan,
      tindak_lanjut_pelayanan_dirawat: data.tindakLanjutPelayananDirawat,
      tindak_lanjut_pelayanan_dirujuk: data.tindakLanjutPelayananDirujuk,
      tindak_lanjut_pelayanan_pulang: jumlahPelayananPulang,
      mati_di_ugd: data.matiDiUGD,
      doa: data.doa,
    };

    if (total >= totaltindakan) {
      const update = await rlTigaTitikDuaDetail.update(dataUPdate, {
        where: {
          id: req.params.id,
          rs_id: req.user.rsId,
        },
      });
      res.status(201).send({
        status: true,
        message: "Data Diperbaharui",
        data: {
          updated_row: update,
        },
      });
    } else {
      res.status(400).send({
        status: false,
        message: "Jumlah Tindak Lanjut Pelayanan Pulang Tidak Sesuai",
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
