import { databaseSIRS } from "../config/Database.js";
import {
  rlTigaTitikDuaBelas,
  rlTigaTitikDuaBelasDetail,
  metoda,
} from "../models/RLTigaTitikDuaBelas.js";
import Joi from "joi";

export const getDataRLTigaTitikDuaBelas = (req, res) => {
  rlTigaTitikDuaBelasDetail
    .findAll({
      attributes: [
        "id",
        "tahun",
        "konseling_anc",
        "konseling_pasca_persalinan",
        "kb_baru_bukan_rujukan",
        "kb_baru_rujukan_inap",
        "kb_baru_rujukan_jalan",
        "kb_baru_total",
        "kb_baru_pasca_persalinan",
        "kb_baru_abortus",
        "kb_baru_lainnya",
        "kunjungan_ulang",
        "keluhan_efek_samping_jumlah",
        "keluhan_efek_samping_dirujuk",
      ],
      where: {
        rs_id: req.user.rsId,
        tahun: req.query.tahun,
      },
      include: {
        model: metoda,
      },
      order: [["metoda_id", "ASC"]],
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

export const getDataRLTigaTitikDuaBelasDetail = (req, res) => {
  rlTigaTitikDuaBelasDetail
    .findAll({
      attributes: [
        "id",
        "rl_tiga_titik_dua_belas_id",
        "user_id",
        "metoda_id",
        "konseling_anc",
        "konseling_pasca_persalinan",
        "kb_baru_bukan_rujukan",
        "kb_baru_rujukan_inap",
        "kb_baru_rujukan_jalan",
        "kb_baru_total",
        "kb_baru_pasca_persalinan",
        "kb_baru_abortus",
        "kb_baru_lainnya",
        "kunjungan_ulang",
        "keluhan_efek_samping_jumlah",
        "keluhan_efek_samping_dirujuk",
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

export const getRLTigaTitikDuaBelasById = async (req, res) => {
  rlTigaTitikDuaBelasDetail
    .findOne({
      where: {
        // rs_id: req.user.rsId,
        // tahun: req.query.tahun
        id: req.params.id,
      },
      include: {
        model: metoda,
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

export const updateDataRLTigaTitikDuaBelas = async (req, res) => {
  const schema = Joi.object({
    konselingAnc: Joi.number().min(0).max(9999999).required(),
    konselingPascaPersalinan: Joi.number().min(0).max(9999999).required(),
    kbBaruBukanRujukan: Joi.number().min(0).max(9999999).required(),
    kbBaruRujukanInap: Joi.number().min(0).max(9999999).required(),
    kbBaruRujukanJalan: Joi.number().min(0).max(9999999).required(),
    kbBaruPascaPersalinan: Joi.number().min(0).max(9999999).required(),
    kbBaruAbortus: Joi.number().min(0).max(9999999).required(),
    kbBaruLainnya: Joi.number().min(0).max(9999999).required(),
    kunjunganUlang: Joi.number().min(0).max(9999999).required(),
    keluhanEfekSampingJumlah: Joi.number().min(0).max(9999999).required(),
    keluhanEfekSampingDirujuk: Joi.number().min(0).max(9999999).required(),
  }).required();
  const { error, value } = schema.validate(req.body);
  if (error) {
    res.status(404).send({
      status: false,
      message: error.details[0].message,
    });
    return;
  }
  let jumlahKbBaruTotal =
    req.body.kbBaruBukanRujukan +
    req.body.kbBaruRujukanInap +
    req.body.kbBaruRujukanJalan;
  try {
    const dataUpd = {
      konseling_anc: req.body.konselingAnc,
      konseling_pasca_persalinan: req.body.konselingPascaPersalinan,
      kb_baru_bukan_rujukan: req.body.kbBaruBukanRujukan,
      kb_baru_rujukan_inap: req.body.kbBaruRujukanInap,
      kb_baru_rujukan_jalan: req.body.kbBaruRujukanJalan,
      kb_baru_total: jumlahKbBaruTotal,
      kb_baru_pasca_persalinan: req.body.kbBaruPascaPersalinan,
      kb_baru_abortus: req.body.kbBaruAbortus,
      kb_baru_lainnya: req.body.kbBaruLainnya,
      kunjungan_ulang: req.body.kunjunganUlang,
      keluhan_efek_samping_jumlah: req.body.keluhanEfekSampingJumlah,
      keluhan_efek_samping_dirujuk: req.body.keluhanEfekSampingDirujuk,
    };

    const upDat = await rlTigaTitikDuaBelasDetail.update(dataUpd, {
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

export const deleteDataRLTigaTitikDuaBelas = async (req, res) => {
  try {
    await rlTigaTitikDuaBelasDetail.destroy({
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

export const insertDataRLTigaTitikDuaBelas = async (req, res) => {
  const currentYear = new Date().getFullYear();
  const schema = Joi.object({
    tahun: Joi.number()
      .min(currentYear - 1)
      .required(),
    data: Joi.array()
      .items(
        Joi.object().keys({
          metodaId: Joi.number().min(1).max(9).required(),
          konselingAnc: Joi.number().min(0).max(9999999).required(),
          konselingPascaPersalinan: Joi.number().min(0).max(9999999).required(),
          kbBaruBukanRujukan: Joi.number().min(0).max(9999999).required(),
          kbBaruRujukanInap: Joi.number().min(0).max(9999999).required(),
          kbBaruRujukanJalan: Joi.number().min(0).max(9999999).required(),
          kbBaruPascaPersalinan: Joi.number().min(0).max(9999999).required(),
          kbBaruAbortus: Joi.number().min(0).max(9999999).required(),
          kbBaruLainnya: Joi.number().min(0).max(9999999).required(),
          kunjunganUlang: Joi.number().min(0).max(9999999).required(),
          keluhanEfekSampingJumlah: Joi.number().min(0).max(9999999).required(),
          keluhanEfekSampingDirujuk: Joi.number()
            .min(0)
            .max(9999999)
            .required(),
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
    const resultInsertHeader = await rlTigaTitikDuaBelas.create(
      {
        rs_id: req.user.rsId,
        tahun: req.body.tahun,
        user_id: req.user.id,
      },
      { transaction: transaction }
    );

    const dataDetail = req.body.data.map((value, index) => {
      let jumlahKbBaruTotal =
        value.kbBaruBukanRujukan +
        value.kbBaruRujukanInap +
        value.kbBaruRujukanJalan;
      return {
        rl_tiga_titik_dua_belas_id: resultInsertHeader.id,
        metoda_id: value.metodaId,
        konseling_anc: value.konselingAnc,
        konseling_pasca_persalinan: value.konselingPascaPersalinan,
        kb_baru_bukan_rujukan: value.kbBaruBukanRujukan,
        kb_baru_rujukan_inap: value.kbBaruRujukanInap,
        kb_baru_rujukan_jalan: value.kbBaruRujukanJalan,
        kb_baru_total: jumlahKbBaruTotal,
        kb_baru_pasca_persalinan: value.kbBaruPascaPersalinan,
        kb_baru_abortus: value.kbBaruAbortus,
        kb_baru_lainnya: value.kbBaruLainnya,
        kunjungan_ulang: value.kunjunganUlang,
        keluhan_efek_samping_jumlah: value.keluhanEfekSampingJumlah,
        keluhan_efek_samping_dirujuk: value.keluhanEfekSampingDirujuk,
        rs_id: req.user.rsId,
        tahun: req.body.tahun,
        user_id: req.user.id,
      };
    });

    const resultInsertDetail = await rlTigaTitikDuaBelasDetail.bulkCreate(
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
    if (error.name === "SequelizeUniqueConstraintError") {
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
