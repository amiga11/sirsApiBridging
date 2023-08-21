import { databaseSIRS } from "../config/Database.js";
import {
  rlTigaTitikSebelasHeader,
  rlTigaTitikSebelasDetail,
  jenisPelayanan,
} from "../models/RLTigaTitikSebelas.js";
import Joi from "joi";

export const getDatarlTigaTitikSebelas = (req, res) => {
  rlTigaTitikSebelasDetail
    .findAll({
      attributes: ["id", "tahun", "jumlah"],
      where: {
        rs_id: req.user.rsId,
        tahun: req.query.tahun,
      },
      include: {
        model: jenisPelayanan,
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

export const getDatarlTigaTitikSebelasDetail = (req, res) => {
  rlTigaTitikSebelasDetail
    .findAll({
      attributes: [
        "id",
        "rl_tiga_titik_sebelas_id",
        "user_id",
        "jenis_pelayanan_id",
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

export const getrlTigaTitikSebelasById = async (req, res) => {
  rlTigaTitikSebelasDetail
    .findOne({
      where: {
        // rs_id: req.user.rsId,
        // tahun: req.query.tahun
        id: req.params.id,
      },
      include: {
        model: jenisPelayanan,
        // include: {
        //     model: jenisPelayanan
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

export const updateDatarlTigaTitikSebelas = async (req, res) => {
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
    const upDat = await rlTigaTitikSebelasDetail.update(req.body, {
      where: {
        id: req.params.id,
        rs_id: req.user.rsId,
      },
    });
    // console.log(req.body);
    res.status(200).json({
      message: "data update successfully",
      data: {
        updated_row: upDat,
      },
    });
  } catch (error) {
    console.log(error.message);
  }
};

export const insertDataRLTigaTitikSebelas = async (req, res) => {
  const currentYear = new Date().getFullYear();
  const schema = Joi.object({
    tahun: Joi.number()
      .min(currentYear - 1)
      .required(),
    data: Joi.array()
      .items(
        Joi.object()
          .keys({
            jenisPelayananId: Joi.number().required(),
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

  let jenPel = [16, 17, 18, 19, 20, 21, 22, 73];

  let transaction = await databaseSIRS.transaction();
  try {
    const resultInsertHeader = await rlTigaTitikSebelasHeader.create(
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
      return {
        rs_id: req.user.rsId,
        tahun: req.body.tahun,
        rl_tiga_titik_sebelas_id: resultInsertHeader.id,
        jenis_pelayanan_id: value.jenisPelayananId,
        jumlah: value.jumlah,
        user_id: req.user.id,
      };
    });

    const resultInsertDetail = await rlTigaTitikSebelasDetail.bulkCreate(
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

export const deleteDataRLTigaTitikSebelas = async (req, res) => {
  try {
    const count = await rlTigaTitikSebelasDetail.destroy({
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
