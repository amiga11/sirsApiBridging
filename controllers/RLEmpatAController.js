import { databaseSIRS } from "../config/Database.js";
import {
  rlEmpatAHeader,
  rlEmpatADetail,
  jenisGolSebabPenyakitId,
} from "../models/RLEmpatA.js";
import Joi from "joi";
import { jenisGolSebabPenyakit } from "../models/JenisGolSebabPenyakit.js";

export const getDataRLEmpatA = (req, res) => {
  rlEmpatADetail
    .findAll({
      attributes: [
        "id",
        "tahun",
        "jmlh_pas_hidup_mati_umur_sex_0_6hr_l",
        "jmlh_pas_hidup_mati_umur_sex_0_6hr_p",
        "jmlh_pas_hidup_mati_umur_sex_6_28hr_l",
        "jmlh_pas_hidup_mati_umur_sex_6_28hr_p",
        "jmlh_pas_hidup_mati_umur_sex_28hr_1th_l",
        "jmlh_pas_hidup_mati_umur_sex_28hr_1th_p",
        "jmlh_pas_hidup_mati_umur_sex_1_4th_l",
        "jmlh_pas_hidup_mati_umur_sex_1_4th_p",
        "jmlh_pas_hidup_mati_umur_sex_4_14th_l",
        "jmlh_pas_hidup_mati_umur_sex_4_14th_p",
        "jmlh_pas_hidup_mati_umur_sex_14_24th_l",
        "jmlh_pas_hidup_mati_umur_sex_14_24th_p",
        "jmlh_pas_hidup_mati_umur_sex_24_44th_l",
        "jmlh_pas_hidup_mati_umur_sex_24_44th_p",
        "jmlh_pas_hidup_mati_umur_sex_44_64th_l",
        "jmlh_pas_hidup_mati_umur_sex_44_64th_p",
        "jmlh_pas_hidup_mati_umur_sex_lebih_64th_l",
        "jmlh_pas_hidup_mati_umur_sex_lebih_64th_p",
        "jmlh_pas_keluar_hidup_mati_sex_l",
        "jmlh_pas_keluar_hidup_mati_sex_p",
        "jmlh_pas_keluar_hidup_mati_lp",
        "jmlh_pas_keluar_mati",
      ],
      where: {
        rs_id: req.user.rsId,
        tahun: req.query.tahun,
      },
      include: {
        model: jenisGolSebabPenyakitId,
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

export const getDataRLEmpatAById = (req, res) => {
  rlEmpatADetail
    .findOne({
      where: {
        id: req.params.id,
      },
      include: {
        model: jenisGolSebabPenyakit,
        attributes: ["no", "no_dtd", "nama"],
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

export const insertDataRLEmpatA = async (req, res) => {
  const currentYear = new Date().getFullYear();
  const schema = Joi.object({
    tahun: Joi.number()
      .min(currentYear - 1)
      .required(),
    data: Joi.array()
      .items(
        Joi.object().keys({
          jenisGolSebabPenyakitId: Joi.number().min(1).required(),
          jmlhPasHidupMatiUmurSex6hrL: Joi.number()
            .min(0)
            .max(9999999)
            .required(),
          jmlhPasHidupMatiUmurSex6hrP: Joi.number()
            .min(0)
            .max(9999999)
            .required(),
          jmlhPasHidupMatiUmurSex28hrL: Joi.number()
            .min(0)
            .max(9999999)
            .required(),
          jmlhPasHidupMatiUmurSex28hrP: Joi.number()
            .min(0)
            .max(9999999)
            .required(),
          jmlhPasHidupMatiUmurSex28hr1thL: Joi.number()
            .min(0)
            .max(9999999)
            .required(),
          jmlhPasHidupMatiUmurSex28hr1thP: Joi.number()
            .min(0)
            .max(9999999)
            .required(),
          jmlhPasHidupMatiUmurSex14thL: Joi.number()
            .min(0)
            .max(9999999)
            .required(),
          jmlhPasHidupMatiUmurSex14thP: Joi.number()
            .min(0)
            .max(9999999)
            .required(),
          jmlhPasHidupMatiUmurSex414thL: Joi.number()
            .min(0)
            .max(9999999)
            .required(),
          jmlhPasHidupMatiUmurSex414thP: Joi.number()
            .min(0)
            .max(9999999)
            .required(),
          jmlhPasHidupMatiUmurSex1424thL: Joi.number()
            .min(0)
            .max(9999999)
            .required(),
          jmlhPasHidupMatiUmurSex1424thP: Joi.number()
            .min(0)
            .max(9999999)
            .required(),
          jmlhPasHidupMatiUmurSex2444thL: Joi.number()
            .min(0)
            .max(9999999)
            .required(),
          jmlhPasHidupMatiUmurSex2444thP: Joi.number()
            .min(0)
            .max(9999999)
            .required(),
          jmlhPasHidupMatiUmurSex4464thL: Joi.number()
            .min(0)
            .max(9999999)
            .required(),
          jmlhPasHidupMatiUmurSex4464thP: Joi.number()
            .min(0)
            .max(9999999)
            .required(),
          jmlhPasHidupMatiUmurSexLebih64thL: Joi.number()
            .min(0)
            .max(9999999)
            .required(),
          jmlhPasHidupMatiUmurSexLebih64thP: Joi.number()
            .min(0)
            .max(9999999)
            .required(),
          // jmlhPasKeluarHidupMatiLP: Joi.number().min(0).max(9999999).required(),
          // jmlhPasKeluarHidupMatiSexL: Joi.number().min(0).max(9999999).required(),
          // jmlhPasKeluarHidupMatiSexP: Joi.number().min(0).max(9999999).required(),
          jmlhPasKeluarMati: Joi.number().min(0).max(9999999).required(),
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
    const resultInsertHeader = await rlEmpatAHeader.create(
      {
        rs_id: req.user.rsId,
        tahun: req.body.tahun,
        user_id: req.user.id,
      },
      { transaction }
    );

    const dataDetail = req.body.data.map((value, index) => {
      if (value.jenisGolSebabPenyakitId > 520) {
        console.log(value.jenisGolSebabPenyakitId);
        console.log("Jenis Golongan Sebab Penyakit Salah");
        throw new SyntaxError("0");
      }
      let jumlahL =
        value.jmlhPasHidupMatiUmurSex6hrL +
        value.jmlhPasHidupMatiUmurSex28hrL +
        value.jmlhPasHidupMatiUmurSex28hr1thL +
        value.jmlhPasHidupMatiUmurSex14thL +
        value.jmlhPasHidupMatiUmurSex414thL +
        value.jmlhPasHidupMatiUmurSex1424thL +
        value.jmlhPasHidupMatiUmurSex2444thL +
        value.jmlhPasHidupMatiUmurSex4464thL +
        value.jmlhPasHidupMatiUmurSexLebih64thL;

      let jumlahP =
        value.jmlhPasHidupMatiUmurSex6hrP +
        value.jmlhPasHidupMatiUmurSex28hrP +
        value.jmlhPasHidupMatiUmurSex28hr1thP +
        value.jmlhPasHidupMatiUmurSex14thP +
        value.jmlhPasHidupMatiUmurSex414thP +
        value.jmlhPasHidupMatiUmurSex1424thP +
        value.jmlhPasHidupMatiUmurSex2444thP +
        value.jmlhPasHidupMatiUmurSex4464thP +
        value.jmlhPasHidupMatiUmurSexLebih64thP;
      let temp = index + 1;
      let jumlahall = jumlahL + jumlahP;
      if (jumlahall <= value.jmlhPasKeluarMati) {
        console.log(
          "Jumlah Pasien Mati Lebih Dari Jumlah Pasien Hidup/Mati Data Ke-" +
            temp
        );
        throw new SyntaxError("1");
      }
      return {
        rl_empat_a_id: resultInsertHeader.id,
        rs_id: req.user.rsId,
        tahun: req.body.tahun,
        jenis_gol_sebab_penyakit_id: value.jenisGolSebabPenyakitId,
        jmlh_pas_hidup_mati_umur_sex_0_6hr_l: value.jmlhPasHidupMatiUmurSex6hrL,
        jmlh_pas_hidup_mati_umur_sex_0_6hr_p: value.jmlhPasHidupMatiUmurSex6hrP,
        jmlh_pas_hidup_mati_umur_sex_6_28hr_l:
          value.jmlhPasHidupMatiUmurSex28hrL,
        jmlh_pas_hidup_mati_umur_sex_6_28hr_p:
          value.jmlhPasHidupMatiUmurSex28hrP,
        jmlh_pas_hidup_mati_umur_sex_28hr_1th_l:
          value.jmlhPasHidupMatiUmurSex28hr1thL,
        jmlh_pas_hidup_mati_umur_sex_28hr_1th_p:
          value.jmlhPasHidupMatiUmurSex28hr1thP,
        jmlh_pas_hidup_mati_umur_sex_1_4th_l:
          value.jmlhPasHidupMatiUmurSex14thL,
        jmlh_pas_hidup_mati_umur_sex_1_4th_p:
          value.jmlhPasHidupMatiUmurSex14thP,
        jmlh_pas_hidup_mati_umur_sex_4_14th_l:
          value.jmlhPasHidupMatiUmurSex414thL,
        jmlh_pas_hidup_mati_umur_sex_4_14th_p:
          value.jmlhPasHidupMatiUmurSex414thP,
        jmlh_pas_hidup_mati_umur_sex_14_24th_l:
          value.jmlhPasHidupMatiUmurSex1424thL,
        jmlh_pas_hidup_mati_umur_sex_14_24th_p:
          value.jmlhPasHidupMatiUmurSex1424thP,
        jmlh_pas_hidup_mati_umur_sex_24_44th_l:
          value.jmlhPasHidupMatiUmurSex2444thL,
        jmlh_pas_hidup_mati_umur_sex_24_44th_p:
          value.jmlhPasHidupMatiUmurSex2444thP,
        jmlh_pas_hidup_mati_umur_sex_44_64th_l:
          value.jmlhPasHidupMatiUmurSex4464thL,
        jmlh_pas_hidup_mati_umur_sex_44_64th_p:
          value.jmlhPasHidupMatiUmurSex4464thP,
        jmlh_pas_hidup_mati_umur_sex_lebih_64th_l:
          value.jmlhPasHidupMatiUmurSexLebih64thL,
        jmlh_pas_hidup_mati_umur_sex_lebih_64th_p:
          value.jmlhPasHidupMatiUmurSexLebih64thP,
        jmlh_pas_keluar_hidup_mati_sex_l: jumlahL,
        jmlh_pas_keluar_hidup_mati_sex_p: jumlahP,
        jmlh_pas_keluar_hidup_mati_lp: jumlahall,
        jmlh_pas_keluar_mati: value.jmlhPasKeluarMati,
        user_id: req.user.id,
      };
    });
    const resultInsertDetail = await rlEmpatADetail.bulkCreate(dataDetail, {
      transaction: transaction,
    });
    await transaction.commit();
    res.status(201).send({
      status: true,
      message: "data created",
    });
  } catch (error) {
    // console.log(error.message);
    if (error.message == "0") {
      res.status(400).send({
        status: false,
        message: "data not created",
        error: "Jenis Golongan Sebab Penyakit salah",
      });
    } else if (error.message == "1") {
      res.status(400).send({
        status: false,
        message: "data not created",
        error:
          "Terdapat Data Jumlah Pasien Mati Lebih Dari Jumlah Pasien Hidup/Mati",
      });
    } else if (error.name === "SequelizeUniqueConstraintError") {
      res.status(400).send({
        status: false,
        message: "Duplicate Entry",
      });
    } else {
      console.log(error.message);
      res.status(400).send({
        status: false,
        message: "data not created",
        error: error.message,
      });
    }
    if (transaction) {
      await transaction.rollback();
    }
  }
};

export const updateDataRLEmpatA = async (req, res) => {
  const schema = Joi.object({
    par6hrL: Joi.number().min(0).max(9999999).required(),
    par6hrP: Joi.number().min(0).max(9999999).required(),
    par14thL: Joi.number().min(0).max(9999999).required(),
    par14thP: Joi.number().min(0).max(9999999).required(),
    par28hr1thL: Joi.number().min(0).max(9999999).required(),
    par28hr1thP: Joi.number().min(0).max(9999999).required(),
    par28hrL: Joi.number().min(0).max(9999999).required(),
    par28hrP: Joi.number().min(0).max(9999999).required(),
    par414thL: Joi.number().min(0).max(9999999).required(),
    par414thP: Joi.number().min(0).max(9999999).required(),
    par1424thL: Joi.number().min(0).max(9999999).required(),
    par1424thP: Joi.number().min(0).max(9999999).required(),
    par2444thL: Joi.number().min(0).max(9999999).required(),
    par2444thP: Joi.number().min(0).max(9999999).required(),
    par4464thL: Joi.number().min(0).max(9999999).required(),
    par4464thP: Joi.number().min(0).max(9999999).required(),
    parLebih64thL: Joi.number().min(0).max(9999999).required(),
    parLebih64thP: Joi.number().min(0).max(9999999).required(),
    jmlhPasKeluarMati: Joi.number().min(0).max(9999999).required(),
  });
  const { error, value } = schema.validate(req.body);
  if (error) {
    res.status(404).send({
      status: false,
      message: error.details[0].message,
    });
    return;
  }
  try {
    let jumlahL =
      req.body.par6hrL +
      req.body.par14thL +
      req.body.par28hr1thL +
      req.body.par28hrL +
      req.body.par414thL +
      req.body.par1424thL +
      req.body.par2444thL +
      req.body.par4464thL +
      req.body.parLebih64thL;

    let jumlahP =
      req.body.par6hrP +
      req.body.par14thP +
      req.body.par28hr1thP +
      req.body.par28hrP +
      req.body.par414thP +
      req.body.par1424thP +
      req.body.par2444thP +
      req.body.par4464thP +
      req.body.parLebih64thP;

    let jumlahall = jumlahL + jumlahP;
    const dataUpdate = {
      jmlh_pas_hidup_mati_umur_sex_0_6hr_l: req.body.par6hrL,
      jmlh_pas_hidup_mati_umur_sex_0_6hr_p: req.body.par6hrP,
      jmlh_pas_hidup_mati_umur_sex_6_28hr_l: req.body.par28hrL,
      jmlh_pas_hidup_mati_umur_sex_6_28hr_p: req.body.par28hrP,
      jmlh_pas_hidup_mati_umur_sex_28hr_1th_l: req.body.par28hr1thL,
      jmlh_pas_hidup_mati_umur_sex_28hr_1th_p: req.body.par28hr1thP,
      jmlh_pas_hidup_mati_umur_sex_1_4th_l: req.body.par14thL,
      jmlh_pas_hidup_mati_umur_sex_1_4th_p: req.body.par14thP,
      jmlh_pas_hidup_mati_umur_sex_4_14th_l: req.body.par414thL,
      jmlh_pas_hidup_mati_umur_sex_4_14th_p: req.body.par414thP,
      jmlh_pas_hidup_mati_umur_sex_14_24th_l: req.body.par1424thL,
      jmlh_pas_hidup_mati_umur_sex_14_24th_p: req.body.par1424thP,
      jmlh_pas_hidup_mati_umur_sex_24_44th_l: req.body.par2444thL,
      jmlh_pas_hidup_mati_umur_sex_24_44th_p: req.body.par2444thP,
      jmlh_pas_hidup_mati_umur_sex_44_64th_l: req.body.par4464thL,
      jmlh_pas_hidup_mati_umur_sex_44_64th_p: req.body.par4464thP,
      jmlh_pas_hidup_mati_umur_sex_lebih_64th_l: req.body.parLebih64thL,
      jmlh_pas_hidup_mati_umur_sex_lebih_64th_p: req.body.parLebih64thP,
      jmlh_pas_keluar_hidup_mati_sex_l: jumlahL,
      jmlh_pas_keluar_hidup_mati_sex_p: jumlahP,
      jmlh_pas_keluar_hidup_mati_lp: jumlahall,
      jmlh_pas_keluar_mati: req.body.jmlhPasKeluarMati,
    };

    if (
      dataUpdate.jmlh_pas_keluar_mati <=
      dataUpdate.jmlh_pas_keluar_hidup_mati_lp
    ) {
      const upDat = await rlEmpatADetail.update(dataUpdate, {
        where: {
          id: req.params.id,
          rs_id: req.user.rsId,
        },
      });
      res.status(200).json({
        status: true,
        message: "data update successfully",
        data: {
          updated_rows: upDat,
        },
      });
    } else {
      res.status(400).send({
        status: false,
        message: "Data Jumlah Pasien Mati Lebih Dari Jumlah Pasien Hidup/Mati",
      });
    }
  } catch (error) {
    console.log(error.message);
  }
};

export const deleteDataRLEmpatA = async (req, res) => {
  try {
    const count = await rlEmpatADetail.destroy({
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
