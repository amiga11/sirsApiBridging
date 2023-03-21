import { databaseSIRS } from "../config/Database.js";
import {
  rlTigaTitikSatuHeader,
  rlTigaTitikSatuDetail,
  jenisPelayanan,
} from "../models/RLTigaTitikSatu.js";
import Joi from "joi";

export const getDataRLTigaTitikSatu = (req, res) => {
  rlTigaTitikSatuDetail
    .findAll({
      attributes: [
        "id",
        "tahun",
        "jumlah_pasien_awal_tahun",
        "jumlah_pasien_masuk",
        "pasien_keluar_hidup",
        "kurang_dari_48_Jam",
        "lebih_dari_atau_sama_dengan_48_jam",
        "jumlah_lama_dirawat",
        "jumlah_pasien_akhir_tahun",
        "jumlah_hari_perawatan",
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

export const getDataRLTigaTitikSatuDetail = (req, res) => {
  rlTigaTitikSatuDetail
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

export const getDataRLTigaTitikSatuDetailById = async (req, res) => {
  rlTigaTitikSatuDetail
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

export const insertDataRLTigaTitikSatu = async (req, res) => {
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
            jumlahPasienAwalTahun: Joi.number().min(0).max(9999999).required(),
            jumlahPasienMasuk: Joi.number().min(0).max(9999999).required(),
            pasienKeluarHidup: Joi.number().min(0).max(9999999).required(),
            kurangDari48Jam: Joi.number().min(0).max(9999999).required(),
            lebihDariAtauSamaDengan48Jam: Joi.number()
              .min(0)
              .max(9999999)
              .required(),
            jumlahLamaDirawat: Joi.number().min(0).max(9999999).required(),
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

  let jmlhPasienAkhir;
  let jmlHariPerawatan;
  let jenPel = [
    1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33,
    34, 35, 36, 37, 38, 39, 40, 41, 42,
  ];

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
    const resultInsertHeader = await rlTigaTitikSatuHeader.create(
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
      jmlhPasienAkhir =
        value.jumlahPasienAwalTahun +
        value.jumlahPasienMasuk -
        value.pasienKeluarHidup -
        value.kurangDari48Jam -
        value.lebihDariAtauSamaDengan48Jam;
      jmlHariPerawatan =
        value.kelasVVIP +
        value.kelasVIP +
        value.kelas1 +
        value.kelas2 +
        value.kelas3 +
        value.kelasKhusus;
      if (jmlhPasienAkhir < 0) {
        console.log("Jumlah Pasien Akhir Tahun Minus");
        throw new SyntaxError("1");
      }
      return {
        rs_id: req.user.rsId,
        tahun: req.body.tahun,
        rl_tiga_titik_satu_id: resultInsertHeader.id,
        jenis_pelayanan_id: value.jenisPelayananId,
        jumlah_pasien_awal_tahun: value.jumlahPasienAwalTahun,
        jumlah_pasien_masuk: value.jumlahPasienMasuk,
        pasien_keluar_hidup: value.pasienKeluarHidup,
        kurang_dari_48_Jam: value.kurangDari48Jam,
        lebih_dari_atau_sama_dengan_48_jam: value.lebihDariAtauSamaDengan48Jam,
        jumlah_lama_dirawat: value.jumlahLamaDirawat,
        jumlah_pasien_akhir_tahun: jmlhPasienAkhir,
        jumlah_hari_perawatan: jmlHariPerawatan,
        kelas_VVIP: value.kelasVVIP,
        kelas_VIP: value.kelasVIP,
        kelas_1: value.kelas1,
        kelas_2: value.kelas2,
        kelas_3: value.kelas3,
        kelas_khusus: value.kelasKhusus,
        user_id: req.user.id,
      };
    });

    await rlTigaTitikSatuDetail.bulkCreate(dataDetail, {
      transaction: transaction,
    });

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
        error: "Jenis Pelayanan Salah",
      });
    } else if (error.message == "1") {
      res.status(400).send({
        status: false,
        message: "data not created",
        error: "Jumlah Pasien Akhir Tahun Minus",
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

export const updateDataRLTigaTitikSatu = async (req, res) => {
  const schema = Joi.object({
    jumlahPasienAwalTahun: Joi.number().min(0).max(9999999).required(),
    jumlahPasienMasuk: Joi.number().min(0).max(9999999).required(),
    pasienKeluarHidup: Joi.number().min(0).max(9999999).required(),
    kurangDari48Jam: Joi.number().min(0).max(9999999).required(),
    lebihDariAtauSamaDengan48Jam: Joi.number().min(0).max(9999999).required(),
    jumlahLamaDirawat: Joi.number().min(0).max(9999999).required(),
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
  let jmlhPasienAkhir =
    req.body.jumlahPasienAwalTahun +
    req.body.jumlahPasienMasuk -
    req.body.pasienKeluarHidup -
    req.body.kurangDari48Jam -
    req.body.lebihDariAtauSamaDengan48Jam;
  let jmlHariPerawatan =
    req.body.kelasVVIP +
    req.body.kelasVIP +
    req.body.kelas1 +
    req.body.kelas2 +
    req.body.kelas3 +
    req.body.kelasKhusus;
  try {
    if (jmlhPasienAkhir < 0) {
      console.log("Jumlah Pasien Akhir Tahun Minus");
      throw new SyntaxError("0");
    }
    const update = await rlTigaTitikSatuDetail.update(
      {
        jumlah_pasien_awal_tahun: req.body.jumlahPasienAwalTahun,
        jumlah_pasien_masuk: req.body.jumlahPasienMasuk,
        pasien_keluar_hidup: req.body.pasienKeluarHidup,
        kurang_dari_48_Jam: req.body.kurangDari48Jam,
        lebih_dari_atau_sama_dengan_48_jam:
          req.body.lebihDariAtauSamaDengan48Jam,
        jumlah_lama_dirawat: req.body.jumlahLamaDirawat,
        jumlah_pasien_akhir_tahun: jmlhPasienAkhir,
        jumlah_hari_perawatan: jmlHariPerawatan,
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
    if (error.message == "0") {
      res.status(400).send({
        status: false,
        message: "data not updated",
        error: "Jumlah Pasien Akhir Tahun Minus",
      });
    } else {
      console.log(error.message);
    }
  }
};

export const deleteDataRLTigaTitikSatu = async (req, res) => {
  try {
    const count = await rlTigaTitikSatuDetail.destroy({
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
