import express from "express";

// Token
import {
  getDataUser,
  insertDataUser,
  login,
  logout,
  changePassword,
  insertDataUserBridging,
  loginUserBridging,
} from "../controllers/UsersController.js";
import { verifyToken } from "../middleware/VerifyToken.js";
import { refreshToken } from "../controllers/RefreshToken.js";

// References
import { getDataRumahSakit } from "../controllers/RumahSakitController.js";
import { getDataJenisPelayanan } from "../controllers/JenisPelayananController.js";
import {
  getDataCaraPembayaran,
  getDataCaraPembayaranInput,
} from "../controllers/CaraPembayaranController.js";
import { getDataJenisSpesialis } from "../controllers/JenisSpesialisController.js";
import {
  getDataJenisKegiatan,
  getDataJenisKegiatanLab,
  getDataJenisKegiatanRl35,
} from "../controllers/JenisKegiatanController.js";
import {
  getDataJenisTindakan,
  getDataGroupJenisTindakan,
} from "../controllers/JenisGroupTindakanController.js";
import { getMetoda } from "../controllers/MetodaController.js";
import { getGolonganObat } from "../controllers/GolonganObatController.js";
import { getNoUrut } from "../controllers/NoUrutController.js";
import { getIcd10 } from "../controllers/Icd10Controller.js";
import {
  getDataJenisGolSebabPenyakit,
  getDataJenisGolSebabPenyakitA,
  getDataJenisGolSebabPenyakitAbyId,
  getDataJenisGolSebabPenyakitASebab,
} from "../controllers/JenisGolSebabPenyakitController.js";
import {
  getDataJenisGolonganSebabPenyakit,
  getDataJenisGolonganSebabPenyakitB,
  getDataJenisGolonganSebabPenyakitBId,
} from "../controllers/JenisGolonganSebabPenyakitController.js";
import {
  getDataJenisGolonganPenyakitB,
  getDataJenisGolonganPenyakitBId,
} from "../controllers/JenisGolonganPenyakitController.js";

// RL 1.2
import {
  getDatarlSatuTitikDua,
  insertDataRLSatuTitikDua,
  updateDatarlSatuTitikDua,
  getrlSatuTitikDuaById,
  deleteDataRLSatuTitikDua,
} from "../controllers/RLSatuTitikDuaController.js";

// RL 1.3
import {
  getDataRLSatuTitikTiga,
  getDataRLSatuTitikTigaDetailById,
  insertDataRLSatuTitikTiga,
  updateDataRLSatuTitikTiga,
  deleteDataRLSatuTitikTiga,
} from "../controllers/RLSatuTitikTigaController.js";

// RL 3.1
import {
  getDataRLTigaTitikSatu,
  getDataRLTigaTitikSatuDetailById,
  insertDataRLTigaTitikSatu,
  updateDataRLTigaTitikSatu,
  deleteDataRLTigaTitikSatu,
} from "../controllers/RLTigaTitikSatuController.js";

// RL 3.2
import {
  getDataRLTigaTitikDua,
  insertDataRLTigaTitikDua,
  deleteDataRLTigaTitikDua,
  getDataRLTigaTitikDuaDetail,
  updateDataRLTigaTitikDua,
} from "../controllers/RLTigaTitikDuaController.js";

// RL 3.3
import {
  getDataRLTigaTitikTiga,
  insertDataRLTigaTitikTiga,
  getDataRLTigaTitikTigaDetail,
  getRLTigaTitikTigaById,
  updateDataRLTigaTitikTiga,
  deleteDataRLTigaTitikTiga,
} from "../controllers/RLTigaTitikTigaController.js";

// RL 3.4
import {
  getDataRLTigaTitikEmpat,
  getRLTigaTitikEmpatById,
  insertDataRLTigaTitikEmpat,
  updateDataRLTigaTitikEmpat,
  deleteDataRLTigaTitikEmpat,
} from "../controllers/RLTigaTitikEmpatController.js";

// RL 3.5
import {
  getDataRLTigaTitikLima,
  getRLTigaTitikLimaById,
  insertDataRLTigaTitikLima,
  updateDataRLTigaTitikLima,
  deleteDataRLTigaTitikLima,
} from "../controllers/RLTigaTitikLimaController.js";

// RL 3.6
import {
  getDataRLTigaTitikEnamIdTahun,
  getDataRLTigaTitikEnamId,
  insertDataRLTigaTitikEnam,
  deleteDataRLTigaTitikEnamId,
  updateDataRLTigaTitikEnamId,
} from "../controllers/RLTigaTitikEnamController.js";

// RL 3.8
import {
  deleteDataRLTigaTitikDelapan,
  getDataRLTigaTitikDelapan,
  getDataRLTigaTitikDelapanById,
  getDataRLTigaTitikDelapanDetailKegiatan,
  insertDataRLTigaTitikDelapan,
  updateDataRLTigaTitikDelapan,
} from "../controllers/RLTigaTitikDelapanController.js";

// RL 3.9
import {
  deleteDataRLTigaTitikSembilanId,
  getDataRLTigaTitikSembilanId,
  getDataRLTigaTitikSembilanIdTahun,
  insertDataRLTigaTitikSembilan,
  updateDataRLTigaTitikSembilanId,
} from "../controllers/RLTigaTitikSembilanController.js";

// RL 3.10
import {
  getDatarlTigaTitikSepuluh,
  insertDataRLTigaTitikSepuluh,
  getDatarlTigaTitikSepuluhDetail,
  getrlTigaTitikSepuluhById,
  updateDatarlTigaTitikSepuluh,
  deleteDataRLTigaTitikSepuluh,
} from "../controllers/RLTigaTitikSepuluhController.js";

// RL 3.11
import {
  getDatarlTigaTitikSebelas,
  insertDataRLTigaTitikSebelas,
  getDatarlTigaTitikSebelasDetail,
  getrlTigaTitikSebelasById,
  updateDatarlTigaTitikSebelas,
  deleteDataRLTigaTitikSebelas,
} from "../controllers/RLTigaTitikSebelasController.js";
// RL 3.7
import {
  insertDataRLTigaTitikTujuh,
  getDataRLTigaTitikTujuh,
  getRLTigaTitikTujuhById,
  getDataRLTigaTitikTujuhDetail,
  updateDataRLTigaTitikTujuh,
  deleteDataRLTigaTitikTujuh,
} from "../controllers/RLTigaTitikTujuhController.js";

// RL 3.12
import {
  insertDataRLTigaTitikDuaBelas,
  getDataRLTigaTitikDuaBelas,
  getRLTigaTitikDuaBelasById,
  getDataRLTigaTitikDuaBelasDetail,
  updateDataRLTigaTitikDuaBelas,
  deleteDataRLTigaTitikDuaBelas,
} from "../controllers/RLTigaTitikDuaBelasController.js";

// RL 3.13A
import {
  insertDataRLTigaTitikTigaBelasA,
  getDataRLTigaTitikTigaBelasA,
  getRLTigaTitikTigaBelasAById,
  getDataRLTigaTitikTigaBelasADetail,
  updateDataRLTigaTitikTigaBelasA,
  deleteDataRLTigaTitikTigaBelasA,
} from "../controllers/RLTigaTitikTigaBelasAController.js";

// RL 3.13B
import {
  insertDataRLTigaTitikTigaBelasB,
  getDataRLTigaTitikTigaBelasB,
  getRLTigaTitikTigaBelasBById,
  getDataRLTigaTitikTigaBelasBDetail,
  updateDataRLTigaTitikTigaBelasB,
  deleteDataRLTigaTitikTigaBelasB,
} from "../controllers/RLTigaTitikTigaBelasBController.js";

// RL 3.14
import {
  getDataRLTigaTitikEmpatBelas,
  insertDataRLTigaTitikEmpatBelas,
  getDataRLTigaTitikEmpatBelasDetail,
  getRLTigaTitikEmpatBelasById,
  updateDataRLTigaTitikEmpatBelas,
  deleteDataRLTigaTitikEmpatBelas,
} from "../controllers/RLTigaTitikEmpatBelasController.js";

// RL 3.15
import {
  getDataRLTigaTitikLimaBelas,
  insertDataRLTigaTitikLimaBelas,
  getDataRLTigaTitikLimaBelasDetail,
  getRLTigaTitikLimaBelasById,
  updateDataRLTigaTitikLimaBelas,
  deleteDataRLTigaTitikLimaBelas,
} from "../controllers/RLTigaTitikLimaBelasController.js";

// RL 4a
import {
  deleteDataRLEmpatA,
  getDataRLEmpatA,
  getDataRLEmpatAById,
  insertDataRLEmpatA,
  updateDataRLEmpatA,
} from "../controllers/RLEmpatAController.js";

// RL 4a sebab
import {
  deleteDataRLEmpatASebab,
  getDataRLEmpatASebab,
  getDataRLEmpatASebabById,
  insertDataRLEmpatASebab,
  updateDataRLEmpatASebab,
} from "../controllers/RLEmpatASebabController.js";

// RL.4b
import {
  insertDataRLEmpatB,
  getDataRLEmpatB,
  deleteDataRLEmpatBId,
  getDataRLEmpatBId,
  updateDataRLEmpatId,
} from "../controllers/RLEmpatBController.js";

// RL. 4b sebab
import {
  insertDataRLEmpatBSebab,
  getDataRLEmpatBSebab,
  deleteDataRLEmpatBSebabId,
  getDataRLEmpatBSebabId,
  updateDataRLEmpatSebabId,
} from "../controllers/RLEmpatBSebabController.js";

// RL 5.1
import {
  getDataRLLimaTitikSatu,
  getRLLimaTitikSatuById,
  insertDataRLLimaTitikSatu,
  updateDataRLLimaTitikSatu,
  deleteDataRLLimaTitikSatu,
} from "../controllers/RLLimaTitikSatuController.js";

// RL 5.2
import {
  getDataRLLimaTitikDua,
  getRLLimaTitikDuaById,
  insertDataRLLimaTitikDua,
  updateDataRLLimaTitikDua,
  deleteDataRLLimaTitikDua,
} from "../controllers/RLLimaTitikDuaController.js";

// RL 5.3
import {
  insertDataRLLimaTitikTiga,
  getDataRLLimaTitikTiga,
  getRLLimaTitikTigaById,
  getDataRLLimaTitikTigaDetail,
  updateDataRLLimaTitikTiga,
  deleteDataRLLimaTitikTiga,
} from "../controllers/RLLimaTitikTigaController.js";

// RL 5.4
import {
  insertDataRLLimaTitikEmpat,
  getDataRLLimaTitikEmpat,
  getRLLimaTitikEmpatById,
  getDataRLLimaTitikEmpatDetail,
  updateDataRLLimaTitikEmpat,
  deleteDataRLLimaTitikEmpat,
} from "../controllers/RLLimaTitikEmpatController.js";

const router = express.Router();

// Rumah Sakit
router.get("/apisirs6ext/rumahsakit/:id", verifyToken, getDataRumahSakit);

// User
router.get("/apisirs6ext/users", verifyToken, getDataUser);
router.post("/apisirs6ext/users", insertDataUser);
router.post("/apisirs6ext/users/bridging", verifyToken, insertDataUserBridging);
router.patch("/apisirs6ext/users/:id/admin", verifyToken, changePassword);

// Token
router.post("/apisirs6ext/login/lama", login);
router.post("/apisirs6ext/login", loginUserBridging);
router.delete("/apisirs6ext/logout", logout);
router.get("/apisirs6ext/token", refreshToken);

// Jenis Pelayanan
router.get("/apisirs6ext/jenispelayanan", verifyToken, getDataJenisPelayanan);

// Cara Pembayaran
router.get(
  "/apisirs6ext/carapembayaran",
  verifyToken,
  getDataCaraPembayaranInput
);

// Jenis Kegiatan
router.get("/apisirs6ext/jeniskegiatan", verifyToken, getDataJenisKegiatan);
router.get(
  "/apisirs6ext/jeniskegiatanrl35",
  verifyToken,
  getDataJenisKegiatanRl35
);
//Jenis Kegiatan Lab 3.8
router.get(
  "/apisirs6ext/jeniskegiatanlab",
  verifyToken,
  getDataJenisKegiatanLab
);

// Jenis Spesialis
router.get("/apisirs6ext/jenisspesialis", verifyToken, getDataJenisSpesialis);

// Group Jenis Tindakan
router.get(
  "/apisirs6ext/jenisgrouptindakan",
  verifyToken,
  getDataGroupJenisTindakan
);

// Jenis Golongan Sebab Penyakit
router.get(
  "/apisirs6ext/jenisgolsebabpenyakit",
  verifyToken,
  getDataJenisGolSebabPenyakit
);
router.get(
  "/apisirs6ext/jenisgolsebabpenyakita/cari",
  verifyToken,
  getDataJenisGolSebabPenyakitA
);
router.get(
  "/apisirs6ext/jenisgolsebabpenyakitasebab/cari",
  verifyToken,
  getDataJenisGolSebabPenyakitASebab
);
router.get(
  "/apisirs6ext/jenisgolsebabpenyakita/id",
  verifyToken,
  getDataJenisGolSebabPenyakitAbyId
);

router.get(
  "/apisirs6ext/jenisgolongansebabpenyakit",
  verifyToken,
  getDataJenisGolonganSebabPenyakit
);

// RL 1.2
router.post(
  "/apisirs6ext/rlsatutitikdua",
  verifyToken,
  insertDataRLSatuTitikDua
);
router.get("/apisirs6ext/rlsatutitikdua", verifyToken, getDatarlSatuTitikDua);
router.get(
  "/apisirs6ext/rlsatutitikduadetail/:id",
  verifyToken,
  getrlSatuTitikDuaById
);
router.delete(
  "/apisirs6ext/rlsatutitikdua/:id",
  verifyToken,
  deleteDataRLSatuTitikDua
);
router.patch(
  "/apisirs6ext/rlsatutitikdua/:id",
  verifyToken,
  updateDatarlSatuTitikDua
);

// RL 1.3
router.post(
  "/apisirs6ext/rlsatutitiktiga",
  verifyToken,
  insertDataRLSatuTitikTiga
);
router.get("/apisirs6ext/rlsatutitiktiga", verifyToken, getDataRLSatuTitikTiga);
router.get(
  "/apisirs6ext/rlsatutitiktigadetail/:id",
  verifyToken,
  getDataRLSatuTitikTigaDetailById
);
router.patch(
  "/apisirs6ext/rlsatutitiktiga/:id",
  verifyToken,
  updateDataRLSatuTitikTiga
);
router.delete(
  "/apisirs6ext/rlsatutitiktiga/:id",
  verifyToken,
  deleteDataRLSatuTitikTiga
);

// RL 3.1
router.post(
  "/apisirs6ext/rltigatitiksatu",
  verifyToken,
  insertDataRLTigaTitikSatu
);
router.get("/apisirs6ext/rltigatitiksatu", verifyToken, getDataRLTigaTitikSatu);
router.get(
  "/apisirs6ext/rltigatitiksatudetail/:id",
  verifyToken,
  getDataRLTigaTitikSatuDetailById
);
router.patch(
  "/apisirs6ext/rltigatitiksatu/:id",
  verifyToken,
  updateDataRLTigaTitikSatu
);
router.delete(
  "/apisirs6ext/rltigatitiksatu/:id",
  verifyToken,
  deleteDataRLTigaTitikSatu
);

// RL 3.2
router.post(
  "/apisirs6ext/rltigatitikdua",
  verifyToken,
  insertDataRLTigaTitikDua
);
router.get("/apisirs6ext/rltigatitikdua", verifyToken, getDataRLTigaTitikDua);
router.delete(
  "/apisirs6ext/rltigatitikdua/:id",
  verifyToken,
  deleteDataRLTigaTitikDua
);
router.get(
  "/apisirs6ext/rltigatitikduadetail/:id",
  verifyToken,
  getDataRLTigaTitikDuaDetail
);
router.patch(
  "/apisirs6ext/rltigatitikduadetail/:id",
  verifyToken,
  updateDataRLTigaTitikDua
);

// RL 3.3
router.post(
  "/apisirs6ext/rltigatitiktiga",
  verifyToken,
  insertDataRLTigaTitikTiga
);
router.get("/apisirs6ext/rltigatitiktiga", verifyToken, getDataRLTigaTitikTiga);
router.delete(
  "/apisirs6ext/rltigatitiktigadetail/:id",
  verifyToken,
  deleteDataRLTigaTitikTiga
);
router.get(
  "/apisirs6ext/rltigatitiktigadetail",
  verifyToken,
  getDataRLTigaTitikTigaDetail
);
router.get(
  "/apisirs6ext/rltigatitiktigadetail/:id",
  verifyToken,
  getRLTigaTitikTigaById
);
router.patch(
  "/apisirs6ext/rltigatitiktigadetail/:id",
  verifyToken,
  updateDataRLTigaTitikTiga
);

// RL 3.4
router.post(
  "/apisirs6ext/rltigatitikempat",
  verifyToken,
  insertDataRLTigaTitikEmpat
);
router.get(
  "/apisirs6ext/rltigatitikempat",
  verifyToken,
  getDataRLTigaTitikEmpat
);
router.get(
  "/apisirs6ext/rltigatitikempatdetail/:id",
  verifyToken,
  getRLTigaTitikEmpatById
);
router.delete(
  "/apisirs6ext/rltigatitikempat/:id",
  verifyToken,
  deleteDataRLTigaTitikEmpat
);
router.patch(
  "/apisirs6ext/rltigatitikempatdetail/:id",
  verifyToken,
  updateDataRLTigaTitikEmpat
);

// RL 3.5
router.post(
  "/apisirs6ext/rltigatitiklima",
  verifyToken,
  insertDataRLTigaTitikLima
);
router.get("/apisirs6ext/rltigatitiklima", verifyToken, getDataRLTigaTitikLima);
router.get(
  "/apisirs6ext/rltigatitiklimadetail/:id",
  verifyToken,
  getRLTigaTitikLimaById
);
router.delete(
  "/apisirs6ext/rltigatitiklima/:id",
  verifyToken,
  deleteDataRLTigaTitikLima
);
router.patch(
  "/apisirs6ext/rltigatitiklimadetail/:id",
  verifyToken,
  updateDataRLTigaTitikLima
);

// RL 3.6
router.post(
  "/apisirs6ext/rltigatitikenam",
  verifyToken,
  insertDataRLTigaTitikEnam
);
router.get(
  "/apisirs6ext/rltigatitikenam",
  verifyToken,
  getDataRLTigaTitikEnamIdTahun
);
router.get(
  "/apisirs6ext/rltigatitikenam/update/:id",
  verifyToken,
  getDataRLTigaTitikEnamId
);
router.patch(
  "/apisirs6ext/rltigatitikenam/:id",
  verifyToken,
  updateDataRLTigaTitikEnamId
);
router.delete(
  "/apisirs6ext/rltigatitikenam/:id",
  verifyToken,
  deleteDataRLTigaTitikEnamId
);

// RL 3.7
router.post(
  "/apisirs6ext/rltigatitiktujuh",
  verifyToken,
  insertDataRLTigaTitikTujuh
);
router.get(
  "/apisirs6ext/rltigatitiktujuh",
  verifyToken,
  getDataRLTigaTitikTujuh
);
router.get(
  "/apisirs6ext/rltigatitiktujuhdetail",
  verifyToken,
  getDataRLTigaTitikTujuhDetail
);
router.get(
  "/apisirs6ext/rltigatitiktujuhdetail/:id",
  verifyToken,
  getRLTigaTitikTujuhById
);
router.patch(
  "/apisirs6ext/rltigatitiktujuhdetail/:id",
  verifyToken,
  updateDataRLTigaTitikTujuh
);
router.delete(
  "/apisirs6ext/rltigatitiktujuhdetail/:id",
  verifyToken,
  deleteDataRLTigaTitikTujuh
);

// RL 3.8
router.post(
  "/apisirs6ext/rltigatitikdelapan",
  verifyToken,
  insertDataRLTigaTitikDelapan
);
router.get(
  "/apisirs6ext/rltigatitikdelapan",
  verifyToken,
  getDataRLTigaTitikDelapanDetailKegiatan
);
router.get(
  "/apisirs6ext/rltigatitikdelapan/:id",
  verifyToken,
  getDataRLTigaTitikDelapanById
);
router.delete(
  "/apisirs6ext/rltigatitikdelapan/:id",
  verifyToken,
  deleteDataRLTigaTitikDelapan
);
router.patch(
  "/apisirs6ext/rltigatitikdelapan/:id",
  verifyToken,
  updateDataRLTigaTitikDelapan
);

// RL 3.9
router.post(
  "/apisirs6ext/rltigatitiksembilan",
  verifyToken,
  insertDataRLTigaTitikSembilan
);
// router.get('/apisirs6ext/rltigatitiksembilan', getDataRLTigaTitikSembilan)
router.get(
  "/apisirs6ext/rltigatitiksembilan",
  verifyToken,
  getDataRLTigaTitikSembilanIdTahun
);
router.get(
  "/apisirs6ext/rltigatitiksembilan/update/:id",
  verifyToken,
  getDataRLTigaTitikSembilanId
);
router.patch(
  "/apisirs6ext/rltigatitiksembilan/:id",
  verifyToken,
  updateDataRLTigaTitikSembilanId
);
router.delete(
  "/apisirs6ext/rltigatitiksembilan/:id",
  verifyToken,
  deleteDataRLTigaTitikSembilanId
);

// RL 3.10
router.post(
  "/apisirs6ext/rltigatitiksepuluh",
  verifyToken,
  insertDataRLTigaTitikSepuluh
);
router.get(
  "/apisirs6ext/rltigatitiksepuluh",
  verifyToken,
  getDatarlTigaTitikSepuluh
);
router.get(
  "/apisirs6ext/rltigatitiksepuluhdetail",
  verifyToken,
  getDatarlTigaTitikSepuluhDetail
);
router.get(
  "/apisirs6ext/rltigatitiksepuluhdetail/:id",
  verifyToken,
  getrlTigaTitikSepuluhById
);
router.patch(
  "/apisirs6ext/rltigatitiksepuluhdetail/:id",
  verifyToken,
  updateDatarlTigaTitikSepuluh
);
router.delete(
  "/apisirs6ext/rltigatitiksepuluhdetail/:id",
  verifyToken,
  deleteDataRLTigaTitikSepuluh
);

//Rl 3.11
router.post(
  "/apisirs6ext/rltigatitiksebelas",
  verifyToken,
  insertDataRLTigaTitikSebelas
);
router.get(
  "/apisirs6ext/rltigatitiksebelas",
  verifyToken,
  getDatarlTigaTitikSebelas
);
router.get(
  "/apisirs6ext/rltigatitiksebelasdetail",
  verifyToken,
  getDatarlTigaTitikSebelasDetail
);
router.get(
  "/apisirs6ext/rltigatitiksebelasdetail/:id",
  verifyToken,
  getrlTigaTitikSebelasById
);
router.patch(
  "/apisirs6ext/rltigatitiksebelasdetail/:id",
  verifyToken,
  updateDatarlTigaTitikSebelas
);
router.delete(
  "/apisirs6ext/rltigatitiksebelasdetail/:id",
  verifyToken,
  deleteDataRLTigaTitikSebelas
);

// RL 3.12
router.post(
  "/apisirs6ext/rltigatitikduabelas",
  verifyToken,
  insertDataRLTigaTitikDuaBelas
);
router.get(
  "/apisirs6ext/rltigatitikduabelas",
  verifyToken,
  getDataRLTigaTitikDuaBelas
);
router.get(
  "/apisirs6ext/rltigatitikduabelasdetail",
  verifyToken,
  getDataRLTigaTitikDuaBelasDetail
);
router.get(
  "/apisirs6ext/rltigatitikduabelasdetail/:id",
  verifyToken,
  getRLTigaTitikDuaBelasById
);
router.patch(
  "/apisirs6ext/rltigatitikduabelasdetail/:id",
  verifyToken,
  updateDataRLTigaTitikDuaBelas
);
router.delete(
  "/apisirs6ext/rltigatitikduabelasdetail/:id",
  verifyToken,
  deleteDataRLTigaTitikDuaBelas
);
router.get("/apisirs6ext/getmetoda", verifyToken, getMetoda);

// RL 3.13a
router.post(
  "/apisirs6ext/rltigatitiktigabelasa",
  verifyToken,
  insertDataRLTigaTitikTigaBelasA
);
router.get(
  "/apisirs6ext/rltigatitiktigabelasa",
  verifyToken,
  getDataRLTigaTitikTigaBelasA
);
router.get(
  "/apisirs6ext/rltigatitiktigabelasadetail",
  verifyToken,
  getDataRLTigaTitikTigaBelasADetail
);
router.get(
  "/apisirs6ext/rltigatitiktigabelasadetail/:id",
  verifyToken,
  getRLTigaTitikTigaBelasAById
);
router.patch(
  "/apisirs6ext/rltigatitiktigabelasadetail/:id",
  verifyToken,
  updateDataRLTigaTitikTigaBelasA
);
router.delete(
  "/apisirs6ext/rltigatitiktigabelasadetail/:id",
  verifyToken,
  deleteDataRLTigaTitikTigaBelasA
);
router.get("/apisirs6ext/getgolonganobat", verifyToken, getGolonganObat);

// RL 3.13b
router.post(
  "/apisirs6ext/rltigatitiktigabelasb",
  verifyToken,
  insertDataRLTigaTitikTigaBelasB
);
router.get(
  "/apisirs6ext/rltigatitiktigabelasb",
  verifyToken,
  getDataRLTigaTitikTigaBelasB
);
router.get(
  "/apisirs6ext/rltigatitiktigabelasbdetail",
  verifyToken,
  getDataRLTigaTitikTigaBelasBDetail
);
router.get(
  "/apisirs6ext/rltigatitiktigabelasbdetail/:id",
  verifyToken,
  getRLTigaTitikTigaBelasBById
);
router.patch(
  "/apisirs6ext/rltigatitiktigabelasbdetail/:id",
  verifyToken,
  updateDataRLTigaTitikTigaBelasB
);
router.delete(
  "/apisirs6ext/rltigatitiktigabelasbdetail/:id",
  verifyToken,
  deleteDataRLTigaTitikTigaBelasB
);
router.get("/apisirs6ext/getgolonganobat", verifyToken, getGolonganObat);

// RL 3.14
router.post(
  "/apisirs6ext/rltigatitikempatbelas",
  verifyToken,
  insertDataRLTigaTitikEmpatBelas
);
router.get(
  "/apisirs6ext/rltigatitikempatbelas",
  verifyToken,
  getDataRLTigaTitikEmpatBelas
);
router.delete(
  "/apisirs6ext/rltigatitikempatbelasdetail/:id",
  verifyToken,
  deleteDataRLTigaTitikEmpatBelas
);
router.get(
  "/apisirs6ext/rltigatitikempatbelasdetail/:id",
  verifyToken,
  getDataRLTigaTitikEmpatBelasDetail
);
router.get(
  "/apisirs6ext/rltigatitikempatbelasdetail/:id",
  verifyToken,
  getRLTigaTitikEmpatBelasById
);
router.patch(
  "/apisirs6ext/rltigatitikempatbelasdetail/:id",
  verifyToken,
  updateDataRLTigaTitikEmpatBelas
);

// RL 3.15
router.post(
  "/apisirs6ext/rltigatitiklimabelas",
  verifyToken,
  insertDataRLTigaTitikLimaBelas
);
router.get(
  "/apisirs6ext/rltigatitiklimabelas",
  verifyToken,
  getDataRLTigaTitikLimaBelas
);
router.delete(
  "/apisirs6ext/rltigatitiklimabelasdetail/:id",
  deleteDataRLTigaTitikLimaBelas
);
router.get(
  "/apisirs6ext/rltigatitiklimabelasdetail/:id",
  verifyToken,
  getDataRLTigaTitikLimaBelasDetail
);
router.get(
  "/apisirs6ext/rltigatitiklimabelasdetail/:id",
  verifyToken,
  getRLTigaTitikLimaBelasById
);
router.patch(
  "/apisirs6ext/rltigatitiklimabelasdetail/:id",
  verifyToken,
  updateDataRLTigaTitikLimaBelas
);

// RL 4a
router.post("/apisirs6ext/rlempata", verifyToken, insertDataRLEmpatA);
router.get("/apisirs6ext/rlempata", verifyToken, getDataRLEmpatA);
router.delete("/apisirs6ext/rlempata/:id", verifyToken, deleteDataRLEmpatA);
router.get("/apisirs6ext/rlempata/:id", verifyToken, getDataRLEmpatAById);
router.patch("/apisirs6ext/rlempata/:id", verifyToken, updateDataRLEmpatA);

// RL 4aSebab
router.post("/apisirs6ext/rlempatasebab", verifyToken, insertDataRLEmpatASebab);
router.get("/apisirs6ext/rlempatasebab", verifyToken, getDataRLEmpatASebab);
router.delete(
  "/apisirs6ext/rlempatasebab/:id",
  verifyToken,
  deleteDataRLEmpatASebab
);
router.get(
  "/apisirs6ext/rlempatasebab/:id",
  verifyToken,
  getDataRLEmpatASebabById
);
router.patch(
  "/apisirs6ext/rlempatasebab/:id",
  verifyToken,
  updateDataRLEmpatASebab
);

// RL 4b
router.post("/apisirs6ext/rlempatb", verifyToken, insertDataRLEmpatB);
router.get("/apisirs6ext/rlempatb", verifyToken, getDataRLEmpatB);
router.delete("/apisirs6ext/rlempatb/:id", verifyToken, deleteDataRLEmpatBId);
router.get(
  "/apisirs6ext/rlempatb/penyakit",
  verifyToken,
  getDataJenisGolonganPenyakitB
);
router.get(
  "/apisirs6ext/rlempatb/idpenyakit",
  verifyToken,
  getDataJenisGolonganPenyakitBId
);
router.get("/apisirs6ext/rlempatb/update/:id", verifyToken, getDataRLEmpatBId);
router.patch("/apisirs6ext/rlempatb/:id", verifyToken, updateDataRLEmpatId);

// RL 4b sebab
router.post("/apisirs6ext/rlempatbsebab", verifyToken, insertDataRLEmpatBSebab);
router.get("/apisirs6ext/rlempatbsebab", verifyToken, getDataRLEmpatBSebab);
router.get(
  "/apisirs6ext/rlempatbsebab/penyakit",
  verifyToken,
  getDataJenisGolonganSebabPenyakitB
);
router.get(
  "/apisirs6ext/rlempatbsebab/idpenyakit",
  verifyToken,
  getDataJenisGolonganSebabPenyakitBId
);
router.delete(
  "/apisirs6ext/rlempatbsebab/:id",
  verifyToken,
  deleteDataRLEmpatBSebabId
);
router.get(
  "/apisirs6ext/rlempatbsebab/update/:id",
  verifyToken,
  getDataRLEmpatBSebabId
);
router.patch(
  "/apisirs6ext/rlempatbsebab/:id",
  verifyToken,
  updateDataRLEmpatSebabId
);

// RL 5.1
router.post(
  "/apisirs6ext/rllimatitiksatu",
  verifyToken,
  insertDataRLLimaTitikSatu
);
router.get("/apisirs6ext/rllimatitiksatu", verifyToken, getDataRLLimaTitikSatu);
router.get(
  "/apisirs6ext/rllimatitiksatudetail/:id",
  verifyToken,
  getRLLimaTitikSatuById
);
router.delete(
  "/apisirs6ext/rllimatitiksatu/:id",
  verifyToken,
  deleteDataRLLimaTitikSatu
);
router.patch(
  "/apisirs6ext/rllimatitiksatudetail/:id",
  verifyToken,
  updateDataRLLimaTitikSatu
);

// RL 5.2
router.post(
  "/apisirs6ext/rllimatitikdua",
  verifyToken,
  insertDataRLLimaTitikDua
);
router.get("/apisirs6ext/rllimatitikdua", verifyToken, getDataRLLimaTitikDua);
router.get(
  "/apisirs6ext/rllimatitikduadetail/:id",
  verifyToken,
  getRLLimaTitikDuaById
);
router.delete(
  "/apisirs6ext/rllimatitikdua/:id",
  verifyToken,
  deleteDataRLLimaTitikDua
);
router.patch(
  "/apisirs6ext/rllimatitikduadetail/:id",
  verifyToken,
  updateDataRLLimaTitikDua
);

// RL 5.3
router.post(
  "/apisirs6ext/rllimatitiktiga",
  verifyToken,
  insertDataRLLimaTitikTiga
);
router.get("/apisirs6ext/rllimatitiktiga", verifyToken, getDataRLLimaTitikTiga);
router.get(
  "/apisirs6ext/rllimatitiktigadetail",
  verifyToken,
  getDataRLLimaTitikTigaDetail
);
router.get(
  "/apisirs6ext/rllimatitiktigadetail/:id",
  verifyToken,
  getRLLimaTitikTigaById
);
router.patch(
  "/apisirs6ext/rllimatitiktigadetail/:id",
  verifyToken,
  updateDataRLLimaTitikTiga
);
router.delete(
  "/apisirs6ext/rllimatitiktigadetail/:id",
  deleteDataRLLimaTitikTiga
);
router.get("/apisirs6ext/getnourut", verifyToken, getNoUrut);
router.get("/apisirs6ext/geticd10", verifyToken, getIcd10);

// RL 5.4
router.post(
  "/apisirs6ext/rllimatitikempat",
  verifyToken,
  insertDataRLLimaTitikEmpat
);
router.get(
  "/apisirs6ext/rllimatitikempat",
  verifyToken,
  getDataRLLimaTitikEmpat
);
router.get(
  "/apisirs6ext/rllimatitikempatdetail",
  verifyToken,
  getDataRLLimaTitikEmpatDetail
);
router.get(
  "/apisirs6ext/rllimatitikempatdetail/:id",
  verifyToken,
  getRLLimaTitikEmpatById
);
router.patch(
  "/apisirs6ext/rllimatitikempatdetail/:id",
  verifyToken,
  updateDataRLLimaTitikEmpat
);
router.delete(
  "/apisirs6ext/rllimatitikempatdetail/:id",
  verifyToken,
  deleteDataRLLimaTitikEmpat
);
router.get("/apisirs6ext/getnourut", verifyToken, getNoUrut);
router.get("/apisirs6ext/geticd10", verifyToken, getIcd10);

export default router;
