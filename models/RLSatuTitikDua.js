import { DataTypes, QueryTypes } from "sequelize";
import { databaseSIRS } from "../config/Database.js";

export const rlSatuTitikDuaHeader = databaseSIRS.define("rl_satu_titik_dua", {
  rs_id: {
    type: DataTypes.STRING,
  },
  tahun: {
    type: DataTypes.INTEGER,
  },
  user_id: {
    type: DataTypes.INTEGER,
  },
});

export const rlSatuTitikDuaDetail = databaseSIRS.define(
  "rl_satu_titik_dua_detail",
  {
    rl_satu_titik_dua_id: {
      type: DataTypes.INTEGER,
    },
    tahun: {
      type: DataTypes.INTEGER,
    },
    bor: {
      type: DataTypes.DECIMAL(10, 3),
    },
    los: {
      type: DataTypes.INTEGER,
    },
    bto: {
      type: DataTypes.DECIMAL(10, 3),
    },
    toi: {
      type: DataTypes.DECIMAL(10, 3),
    },
    ndr: {
      type: DataTypes.DECIMAL(10, 3),
    },
    gdr: {
      type: DataTypes.DECIMAL(10, 3),
    },
    rata_kunjungan: {
      type: DataTypes.DECIMAL(10, 3),
    },
    rs_id: {
      type: DataTypes.STRING,
    },
    user_id: {
      type: DataTypes.INTEGER,
    },
  }
);
rlSatuTitikDuaHeader.hasMany(rlSatuTitikDuaDetail, {
  foreignKey: "rl_satu_titik_dua_id",
});

rlSatuTitikDuaDetail.belongsTo(rlSatuTitikDuaHeader, {
  foreignKey: "id",
});
