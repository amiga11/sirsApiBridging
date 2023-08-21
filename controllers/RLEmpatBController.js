import { databaseSIRS } from "../config/Database.js";
import {
  rlEmpatBDetail,
  rlEmpatBHeader,
  rlEmpatJenisGolPenyakit,
} from "../models/RLEmpatB.js";
import joi from "joi";

export const insertDataRLEmpatB = async (req, res) => {
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
          jenisGolId: joi.number().min(0).max(1100).required(),
          jmlhPasKasusUmurSex0hr6hrL: joi
            .number()
            .min(0)
            .max(9999999)
            .required(),
          jmlhPasKasusUmurSex0hr6hrP: joi
            .number()
            .min(0)
            .max(9999999)
            .required(),
          jmlhPasKasusUmurSex6hr28hrL: joi
            .number()
            .min(0)
            .max(9999999)
            .required(),
          jmlhPasKasusUmurSex6hr28hrP: joi
            .number()
            .min(0)
            .max(9999999)
            .required(),
          jmlhPasKasusUmurSex28hr1thL: joi
            .number()
            .min(0)
            .max(9999999)
            .required(),
          jmlhPasKasusUmurSex28hr1thP: joi
            .number()
            .min(0)
            .max(9999999)
            .required(),
          jmlhPasKasusUmurSex1th4thL: joi
            .number()
            .min(0)
            .max(9999999)
            .required(),
          jmlhPasKasusUmurSex1th4thP: joi
            .number()
            .min(0)
            .max(9999999)
            .required(),
          jmlhPasKasusUmurSex4th14thL: joi
            .number()
            .min(0)
            .max(9999999)
            .required(),
          jmlhPasKasusUmurSex4th14thP: joi
            .number()
            .min(0)
            .max(9999999)
            .required(),
          jmlhPasKasusUmurSex14th24thL: joi
            .number()
            .min(0)
            .max(9999999)
            .required(),
          jmlhPasKasusUmurSex14th24thP: joi
            .number()
            .min(0)
            .max(9999999)
            .required(),
          jmlhPasKasusUmurSex24th44thL: joi
            .number()
            .min(0)
            .max(9999999)
            .required(),
          jmlhPasKasusUmurSex24th44thP: joi
            .number()
            .min(0)
            .max(9999999)
            .required(),
          jmlhPasKasusUmurSex44th64L: joi
            .number()
            .min(0)
            .max(9999999)
            .required(),
          jmlhPasKasusUmurSex44th64P: joi
            .number()
            .min(0)
            .max(9999999)
            .required(),
          jmlhPasKasusUmurSexLebih64L: joi
            .number()
            .min(0)
            .max(9999999)
            .required(),
          jmlhPasKasusUmurSexLebih64P: joi
            .number()
            .min(0)
            .max(9999999)
            .required(),
          jmlhKunjungan: joi.number().min(0).max(9999999).required(),
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

  let jenGol = [
    581, 582, 583, 584, 585, 586, 587, 588, 589, 590, 591, 592, 593, 594, 595,
    596, 597, 598, 599, 600, 601, 602, 603, 604, 605, 606, 607, 608, 609, 610,
    611, 612, 613, 614, 615, 616, 617, 618, 619, 620, 621, 622, 623, 624, 625,
    626, 627, 628, 629, 630, 631, 632, 633, 634, 635, 636, 637, 638, 639, 640,
    641, 642, 643, 644, 645, 646, 647, 648, 649, 650, 651, 652, 653, 654, 655,
    656, 657, 658, 659, 660, 661, 662, 663, 664, 665, 666, 667, 668, 669, 670,
    671, 672, 673, 674, 675, 676, 677, 678, 679, 680, 681, 682, 683, 684, 685,
    686, 687, 688, 689, 690, 691, 692, 693, 694, 695, 696, 697, 698, 699, 700,
    701, 702, 703, 704, 705, 706, 707, 708, 709, 710, 711, 712, 713, 714, 715,
    716, 717, 718, 719, 720, 721, 722, 723, 724, 725, 726, 727, 728, 729, 730,
    731, 732, 733, 734, 735, 736, 737, 738, 739, 740, 741, 742, 743, 744, 745,
    746, 747, 748, 749, 750, 751, 752, 753, 754, 755, 756, 757, 758, 759, 760,
    761, 762, 763, 764, 765, 766, 767, 768, 769, 770, 771, 772, 773, 774, 775,
    776, 777, 778, 779, 780, 781, 782, 783, 784, 785, 786, 787, 788, 789, 790,
    791, 792, 793, 794, 795, 796, 797, 798, 799, 800, 801, 802, 803, 804, 805,
    806, 807, 808, 809, 810, 811, 812, 813, 814, 815, 816, 817, 818, 819, 820,
    821, 822, 823, 824, 825, 826, 827, 828, 829, 830, 831, 832, 833, 834, 835,
    836, 837, 838, 839, 840, 841, 842, 843, 844, 845, 846, 847, 848, 849, 850,
    851, 852, 853, 854, 855, 856, 857, 858, 859, 860, 861, 862, 863, 864, 865,
    866, 867, 868, 869, 870, 871, 872, 873, 874, 875, 876, 877, 878, 879, 880,
    881, 882, 883, 884, 885, 886, 887, 888, 889, 890, 891, 892, 893, 894, 895,
    896, 897, 898, 899, 900, 901, 902, 903, 904, 905, 906, 907, 908, 909, 910,
    911, 912, 913, 914, 915, 916, 917, 918, 919, 920, 921, 922, 923, 924, 925,
    926, 927, 928, 929, 930, 931, 932, 933, 934, 935, 936, 937, 938, 939, 940,
    941, 942, 943, 944, 945, 946, 947, 948, 949, 950, 951, 952, 953, 954, 955,
    956, 957, 958, 959, 960, 961, 962, 963, 964, 965, 966, 967, 968, 969, 970,
    971, 972, 973, 974, 975, 976, 977, 978, 979, 980, 981, 982, 983, 984, 985,
    986, 987, 988, 989, 990, 991, 992, 993, 994, 995, 996, 997, 998, 999, 1000,
    1001, 1002, 1003, 1004, 1005, 1006, 1007, 1008, 1009, 1010, 1011, 1012,
    1013, 1014, 1015, 1016, 1017, 1018, 1019, 1020, 1021, 1022, 1023, 1024,
    1025, 1026, 1027, 1028, 1029, 1030, 1031, 1032, 1033, 1034, 1035, 1036,
    1037, 1038, 1039, 1040, 1041, 1042, 1043, 1044, 1045, 1046, 1047, 1048,
    1049, 1050, 1051, 1052, 1053, 1054, 1055, 1056, 1057, 1058, 1059, 1060,
    1061, 1062, 1063, 1064, 1065, 1066, 1067, 1068, 1069, 1070, 1071, 1072,
    1073, 1074, 1075, 1076, 1077, 1078, 1079, 1080, 1081, 1082, 1083, 1084,
    1085, 1086, 1087, 1088, 1089, 1090, 1091, 1092, 1093, 1094, 1095, 1096,
    1097, 1098, 1099, 1100, 1101,
  ];

  try {
    const resultInsertHeader = await rlEmpatBHeader.create(
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
      if (jenGol.includes(value.jenisGolSebabId) == false) {
        console.log("Jenis Golongan Sebab Penyakit Salah");
        throw new SyntaxError("0");
      }
      let jumlahL =
        value.jmlhPasKasusUmurSex0hr6hrL +
        value.jmlhPasKasusUmurSex6hr28hrL +
        value.jmlhPasKasusUmurSex28hr1thL +
        value.jmlhPasKasusUmurSex1th4thL +
        value.jmlhPasKasusUmurSex4th14thL +
        value.jmlhPasKasusUmurSex14th24thL +
        value.jmlhPasKasusUmurSex24th44thL +
        value.jmlhPasKasusUmurSex44th64L +
        value.jmlhPasKasusUmurSexLebih64L;
      let jumlahP =
        value.jmlhPasKasusUmurSex0hr6hrP +
        value.jmlhPasKasusUmurSex6hr28hrP +
        value.jmlhPasKasusUmurSex28hr1thP +
        value.jmlhPasKasusUmurSex1th4thP +
        value.jmlhPasKasusUmurSex4th14thP +
        value.jmlhPasKasusUmurSex14th24thP +
        value.jmlhPasKasusUmurSex24th44thP +
        value.jmlhPasKasusUmurSex44th64P +
        value.jmlhPasKasusUmurSexLebih64P;
      let jumlahall = jumlahL + jumlahP;

      if (jumlahall >= value.jmlhKunjungan) {
        console.log(
          "Jumlah Data Jumlah Kunjungan kurang dari jumlah kasus baru"
        );
        throw new SyntaxError("1");
      }

      return {
        rl_empat_b_id: resultInsertHeader.id,
        rs_id: req.user.rsId,
        tahun: req.body.tahun,
        jenis_golongan_penyakit_id: value.jenisGolId,
        jmlh_pas_kasus_umur_sex_0_6hr_l: value.jmlhPasKasusUmurSex0hr6hrL,
        jmlh_pas_kasus_umur_sex_0_6hr_p: value.jmlhPasKasusUmurSex0hr6hrP,
        jmlh_pas_kasus_umur_sex_6_28hr_l: value.jmlhPasKasusUmurSex6hr28hrL,
        jmlh_pas_kasus_umur_sex_6_28hr_p: value.jmlhPasKasusUmurSex6hr28hrP,
        jmlh_pas_kasus_umur_sex_28hr_1th_l: value.jmlhPasKasusUmurSex28hr1thL,
        jmlh_pas_kasus_umur_sex_28hr_1th_p: value.jmlhPasKasusUmurSex28hr1thP,
        jmlh_pas_kasus_umur_sex_1_4th_l: value.jmlhPasKasusUmurSex1th4thL,
        jmlh_pas_kasus_umur_sex_1_4th_p: value.jmlhPasKasusUmurSex1th4thP,
        jmlh_pas_kasus_umur_sex_4_14th_l: value.jmlhPasKasusUmurSex4th14thL,
        jmlh_pas_kasus_umur_sex_4_14th_p: value.jmlhPasKasusUmurSex4th14thP,
        jmlh_pas_kasus_umur_sex_14_24th_l: value.jmlhPasKasusUmurSex14th24thL,
        jmlh_pas_kasus_umur_sex_14_24th_p: value.jmlhPasKasusUmurSex14th24thP,
        jmlh_pas_kasus_umur_sex_24_44th_l: value.jmlhPasKasusUmurSex24th44thL,
        jmlh_pas_kasus_umur_sex_24_44th_p: value.jmlhPasKasusUmurSex24th44thP,
        jmlh_pas_kasus_umur_sex_44_64th_l: value.jmlhPasKasusUmurSex44th64L,
        jmlh_pas_kasus_umur_sex_44_64th_p: value.jmlhPasKasusUmurSex44th64P,
        jmlh_pas_kasus_umur_sex_lebih_64th_l: value.jmlhPasKasusUmurSexLebih64L,
        jmlh_pas_kasus_umur_sex_lebih_64th_p: value.jmlhPasKasusUmurSexLebih64P,
        kasus_baru_l: jumlahL,
        kasus_baru_p: jumlahP,
        jumlah_kasus_baru: jumlahall,
        jumlah_kunjungan: value.jmlhKunjungan,
        user_id: req.user.id,
      };
    });
    const resultInsertDetail = await rlEmpatBDetail.bulkCreate(dataDetail, {
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
    console.log(error);
    await transaction.rollback();
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
        error: "Terdapat Data Jumlah Kunjungan Kurang Dari Jumlah Kasus Baru",
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

export const getDataRLEmpatB = (req, res) => {
  rlEmpatBDetail
    .findAll({
      attributes: [
        "id",
        "tahun",
        "jmlh_pas_kasus_umur_sex_0_6hr_l",
        "jmlh_pas_kasus_umur_sex_0_6hr_p",
        "jmlh_pas_kasus_umur_sex_6_28hr_l",
        "jmlh_pas_kasus_umur_sex_6_28hr_p",
        "jmlh_pas_kasus_umur_sex_28hr_1th_l",
        "jmlh_pas_kasus_umur_sex_28hr_1th_p",
        "jmlh_pas_kasus_umur_sex_1_4th_l",
        "jmlh_pas_kasus_umur_sex_1_4th_p",
        "jmlh_pas_kasus_umur_sex_4_14th_l",
        "jmlh_pas_kasus_umur_sex_4_14th_p",
        "jmlh_pas_kasus_umur_sex_14_24th_l",
        "jmlh_pas_kasus_umur_sex_14_24th_p",
        "jmlh_pas_kasus_umur_sex_24_44th_l",
        "jmlh_pas_kasus_umur_sex_24_44th_p",
        "jmlh_pas_kasus_umur_sex_44_64th_l",
        "jmlh_pas_kasus_umur_sex_44_64th_p",
        "jmlh_pas_kasus_umur_sex_lebih_64th_l",
        "jmlh_pas_kasus_umur_sex_lebih_64th_p",
        "kasus_baru_l",
        "kasus_baru_p",
        "jumlah_kasus_baru",
        "jumlah_kunjungan",
      ],
      where: {
        rs_id: req.user.rsId,
        tahun: req.query.tahun,
      },
      include: {
        model: rlEmpatJenisGolPenyakit,
        attributes: ["id", "no_dtd", "no_daftar_terperinci", "nama"],
      },
      order: [[rlEmpatJenisGolPenyakit, "no", "ASC"]],
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

export const deleteDataRLEmpatBId = async (req, res) => {
  try {
    await rlEmpatBDetail.destroy({
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
    console.log(error.message);
  }
};

export const getDataRLEmpatBId = async (req, res) => {
  rlEmpatBDetail
    .findOne({
      where: {
        id: req.params.id,
      },
      include: {
        model: rlEmpatJenisGolPenyakit,
        attributes: ["no_dtd", "no_daftar_terperinci", "nama"],
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

export const updateDataRLEmpatId = async (req, res) => {
  try {
    const schema = joi.object({
      jmlhPasKasusUmurSex0hr6hrL: joi.number().min(0).max(9999999).required(),
      jmlhPasKasusUmurSex0hr6hrP: joi.number().min(0).max(9999999).required(),
      jmlhPasKasusUmurSex6hr28hrL: joi.number().min(0).max(9999999).required(),
      jmlhPasKasusUmurSex6hr28hrP: joi.number().min(0).max(9999999).required(),
      jmlhPasKasusUmurSex28hr1thL: joi.number().min(0).max(9999999).required(),
      jmlhPasKasusUmurSex28hr1thP: joi.number().min(0).max(9999999).required(),
      jmlhPasKasusUmurSex1th4thL: joi.number().min(0).max(9999999).required(),
      jmlhPasKasusUmurSex1th4thP: joi.number().min(0).max(9999999).required(),
      jmlhPasKasusUmurSex4th14thL: joi.number().min(0).max(9999999).required(),
      jmlhPasKasusUmurSex4th14thP: joi.number().min(0).max(9999999).required(),
      jmlhPasKasusUmurSex14th24thL: joi.number().min(0).max(9999999).required(),
      jmlhPasKasusUmurSex14th24thP: joi.number().min(0).max(9999999).required(),
      jmlhPasKasusUmurSex24th44thL: joi.number().min(0).max(9999999).required(),
      jmlhPasKasusUmurSex24th44thP: joi.number().min(0).max(9999999).required(),
      jmlhPasKasusUmurSex44th64L: joi.number().min(0).max(9999999).required(),
      jmlhPasKasusUmurSex44th64P: joi.number().min(0).max(9999999).required(),
      jmlhPasKasusUmurSexLebih64L: joi.number().min(0).max(9999999).required(),
      jmlhPasKasusUmurSexLebih64P: joi.number().min(0).max(9999999).required(),
      jmlhKunjungan: joi.number().min(0).max(9999999).required(),
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
      // console.log(req.body.jmlhPasKasusUmurSex0hr6hrL)
      let jumlahL =
        req.body.jmlhPasKasusUmurSex0hr6hrL +
        req.body.jmlhPasKasusUmurSex6hr28hrL +
        req.body.jmlhPasKasusUmurSex28hr1thL +
        req.body.jmlhPasKasusUmurSex1th4thL +
        req.body.jmlhPasKasusUmurSex4th14thL +
        req.body.jmlhPasKasusUmurSex14th24thL +
        req.body.jmlhPasKasusUmurSex24th44thL +
        req.body.jmlhPasKasusUmurSex44th64L +
        req.body.jmlhPasKasusUmurSexLebih64L;
      let jumlahP =
        req.body.jmlhPasKasusUmurSex0hr6hrP +
        req.body.jmlhPasKasusUmurSex6hr28hrP +
        req.body.jmlhPasKasusUmurSex28hr1thP +
        req.body.jmlhPasKasusUmurSex1th4thP +
        req.body.jmlhPasKasusUmurSex4th14thP +
        req.body.jmlhPasKasusUmurSex14th24thP +
        req.body.jmlhPasKasusUmurSex24th44thP +
        req.body.jmlhPasKasusUmurSex44th64P +
        req.body.jmlhPasKasusUmurSexLebih64P;
      let jumlahall = jumlahL + jumlahP;

      if (req.body.jmlhKunjungan >= jumlahall) {
        const update = await rlEmpatBDetail.update(
          {
            jmlh_pas_kasus_umur_sex_0_6hr_l:
              req.body.jmlhPasKasusUmurSex0hr6hrL,
            jmlh_pas_kasus_umur_sex_0_6hr_p:
              req.body.jmlhPasKasusUmurSex0hr6hrP,
            jmlh_pas_kasus_umur_sex_6_28hr_l:
              req.body.jmlhPasKasusUmurSex6hr28hrL,
            jmlh_pas_kasus_umur_sex_6_28hr_p:
              req.body.jmlhPasKasusUmurSex6hr28hrP,
            jmlh_pas_kasus_umur_sex_28hr_1th_l:
              req.body.jmlhPasKasusUmurSex28hr1thL,
            jmlh_pas_kasus_umur_sex_28hr_1th_p:
              req.body.jmlhPasKasusUmurSex28hr1thP,
            jmlh_pas_kasus_umur_sex_1_4th_l:
              req.body.jmlhPasKasusUmurSex1th4thL,
            jmlh_pas_kasus_umur_sex_1_4th_p:
              req.body.jmlhPasKasusUmurSex1th4thP,
            jmlh_pas_kasus_umur_sex_4_14th_l:
              req.body.jmlhPasKasusUmurSex4th14thL,
            jmlh_pas_kasus_umur_sex_4_14th_p:
              req.body.jmlhPasKasusUmurSex4th14thP,
            jmlh_pas_kasus_umur_sex_14_24th_l:
              req.body.jmlhPasKasusUmurSex14th24thL,
            jmlh_pas_kasus_umur_sex_14_24th_p:
              req.body.jmlhPasKasusUmurSex14th24thP,
            jmlh_pas_kasus_umur_sex_24_44th_l:
              req.body.jmlhPasKasusUmurSex24th44thL,
            jmlh_pas_kasus_umur_sex_24_44th_p:
              req.body.jmlhPasKasusUmurSex24th44thP,
            jmlh_pas_kasus_umur_sex_44_64th_l:
              req.body.jmlhPasKasusUmurSex44th64L,
            jmlh_pas_kasus_umur_sex_44_64th_p:
              req.body.jmlhPasKasusUmurSex44th64P,
            jmlh_pas_kasus_umur_sex_lebih_64th_l:
              req.body.jmlhPasKasusUmurSexLebih64L,
            jmlh_pas_kasus_umur_sex_lebih_64th_p:
              req.body.jmlhPasKasusUmurSexLebih64P,
            kasus_baru_l: jumlahL,
            kasus_baru_p: jumlahP,
            jumlah_kasus_baru: jumlahall,
            jumlah_kunjungan: req.body.jmlhKunjungan,
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
          message: "Success Update Data",
          data: {
            updated_rows: update,
          },
        });
      } else {
        res.status(400).send({
          status: false,
          message: "Data Jumlah Kunjungan kurang dari jumlah kasus",
        });
      }
    } catch (error) {
      res.status(400).send({
        status: false,
        message: "Update Data Fail",
      });
    }
  } catch (error) {
    console.log(error.message);
  }
};
