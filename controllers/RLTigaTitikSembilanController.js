import { databaseSIRS } from "../config/Database.js";
import {
  rlTigaTitikSembilanHeader,
  rlTigaTitikSembilanDetail,
  jenisGroupTindakanHeader,
  jenisGroupTindakan,
} from "../models/RLTigaTitikSembilan.js";
import joi from "joi";

export const getDataRLTigaTitikSembilan = (req, res) => {
  rlTigaTitikSembilanHeader
    .findAll({
      attributes: ["id", "tahun"],
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

export const insertDataRLTigaTitikSembilan = async (req, res) => {
  const currentYear = new Date().getFullYear();
  const schema = joi.object({
    tahun: joi
      .number()
      .min(currentYear - 1)
      .required(),
    data: joi
      .array()
      .items(
        joi.object().keys({
          jenisTindakanId: joi.number().required(),
          jumlah: joi.number().min(0).max(9999999).required(),
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

  let jenTind = [
    2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 13, 14, 15, 16, 17, 18, 20, 21, 22, 23, 24,
    25, 26, 27, 28, 30, 31, 32, 33, 35, 36, 37, 39, 40, 41, 42, 44, 45, 46, 47,
  ];

  const transaction = await databaseSIRS.transaction();

  try {
    const resultInsertHeader = await rlTigaTitikSembilanHeader.create(
      {
        rs_id: req.user.rsId,
        tahun: req.body.tahun,
        user_id: req.user.id,
      },
      { transaction: transaction }
    );

    const dataDetail = req.body.data.map((value, index) => {
      if (jenTind.includes(value.jenisTindakanId) == false) {
        console.log("Jenis Tindakan Salah");
        throw new SyntaxError("0");
      }
      return {
        rl_tiga_titik_sembilan_id: resultInsertHeader.id,
        jenis_tindakan_id: value.jenisTindakanId,
        jumlah: value.jumlah,
        user_id: req.user.id,
        tahun: req.body.tahun,
        rs_id: req.user.rsId,
      };
    });

    const resultInsertDetail = await rlTigaTitikSembilanDetail.bulkCreate(
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

    // console.log('Success')
  } catch (error) {
    console.log(error);
    await transaction.rollback();
    if (error.message == "0") {
      res.status(400).send({
        status: false,
        message: "data not created",
        error: "Jenis Tindakan Salah",
      });
    } else if (error.name === "SequelizeUniqueConstraintError") {
      res.status(400).send({
        status: false,
        message: "Fail Duplicate Entry",
      });
    } else {
      res.status(400).send({
        status: false,
        message: "error",
      });
    }
  }
};

export const getDataRLTigaTitikSembilanIdTahun = async (req, res) => {
  rlTigaTitikSembilanDetail
    .findAll({
      model: rlTigaTitikSembilanDetail,
      where: {
        rs_id: req.user.rsId,
        tahun: req.query.tahun,
      },
      include: {
        model: jenisGroupTindakan,
        // attributes: ['id', 'nama'],
        include: {
          model: jenisGroupTindakanHeader,
        },
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

export const getDataRLTigaTitikSembilanId = async (req, res) => {
  rlTigaTitikSembilanDetail
    .findOne({
      where: {
        id: req.params.id,
      },
      include: {
        model: jenisGroupTindakan,
        // attributes: ['id', 'nama'],
        include: {
          model: jenisGroupTindakanHeader,
        },
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

export const updateDataRLTigaTitikSembilanId = async (req, res) => {
  const schema = joi
    .object({
      jumlah: joi.number().min(0).max(9999999).required(),
    })
    .required();
  const { error, value } = schema.validate(req.body);
  if (error) {
    res.status(404).send({
      status: false,
      message: error.details[0].message,
    });
    return;
  }
  try {
    const data = req.body;
    try {
      const update = await rlTigaTitikSembilanDetail.update(data, {
        where: {
          id: req.params.id,
          rs_id: req.user.rsId,
        },
      });
      res.status(201).send({
        status: true,
        message: "data Updated",
        data: {
          updated_row: update,
        },
      });
    } catch (error) {
      res.status(400).send({
        status: false,
        message: "Update Data Fail",
      });
    }
  } catch (error) {
    console.log(error.message);
    res.status(400).send({
      status: false,
      message: "Update Data Fail",
    });
  }
};

export const deleteDataRLTigaTitikSembilanId = async (req, res) => {
  try {
    await rlTigaTitikSembilanDetail.destroy({
      where: {
        id: req.params.id,
        rs_id: req.user.rsId,
      },
    });
    res.status(201).send({
      status: true,
      message: "Delete Data Success",
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
