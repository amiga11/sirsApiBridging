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
router.get("/sirs6/rumahsakit/:id", verifyToken, getDataRumahSakit);

// User
router.get("/sirs6/users", verifyToken, getDataUser);
router.post("/sirs6/users", insertDataUser);
router.post("/sirs6/users/bridging", verifyToken, insertDataUserBridging);
router.patch("/sirs6/users/:id/admin", verifyToken, changePassword);

// Token
router.post("/sirs6/login/lama", login);
router.post("/sirs6/login", loginUserBridging);
router.delete("/sirs6/logout", logout);
router.get("/sirs6/token", refreshToken);

// Jenis Pelayanan
router.get("/sirs6/jenispelayanan", verifyToken, getDataJenisPelayanan);

// Cara Pembayaran
router.get(
  "/sirs6/carapembayaran",
  verifyToken,
  getDataCaraPembayaranInput
);

// Jenis Kegiatan
router.get("/sirs6/jeniskegiatan", verifyToken, getDataJenisKegiatan);
router.get(
  "/sirs6/jeniskegiatanrl35",
  verifyToken,
  getDataJenisKegiatanRl35
);
//Jenis Kegiatan Lab 3.8
router.get(
  "/sirs6/jeniskegiatanlab",
  verifyToken,
  getDataJenisKegiatanLab
);

// Jenis Spesialis
router.get("/sirs6/jenisspesialis", verifyToken, getDataJenisSpesialis);

// Group Jenis Tindakan
router.get(
  "/sirs6/jenisgrouptindakan",
  verifyToken,
  getDataGroupJenisTindakan
);

// Jenis Golongan Sebab Penyakit
router.get(
  "/sirs6/jenisgolsebabpenyakit",
  verifyToken,
  getDataJenisGolSebabPenyakit
);
router.get(
  "/sirs6/jenisgolsebabpenyakita/cari",
  verifyToken,
  getDataJenisGolSebabPenyakitA
);
router.get(
  "/sirs6/jenisgolsebabpenyakitasebab/cari",
  verifyToken,
  getDataJenisGolSebabPenyakitASebab
);
router.get(
  "/sirs6/jenisgolsebabpenyakita/id",
  verifyToken,
  getDataJenisGolSebabPenyakitAbyId
);

router.get(
  "/sirs6/jenisgolongansebabpenyakit",
  verifyToken,
  getDataJenisGolonganSebabPenyakit
);

// RL 1.2
router.post(
  "/sirs6/rlsatutitikdua",
  verifyToken,
  insertDataRLSatuTitikDua
);
router.get("/sirs6/rlsatutitikdua", verifyToken, getDatarlSatuTitikDua);
router.get(
  "/sirs6/rlsatutitikduadetail/:id",
  verifyToken,
  getrlSatuTitikDuaById
);
router.delete(
  "/sirs6/rlsatutitikdua/:id",
  verifyToken,
  deleteDataRLSatuTitikDua
);
router.patch(
  "/sirs6/rlsatutitikdua/:id",
  verifyToken,
  updateDatarlSatuTitikDua
);

// RL 1.3
router.post(
  "/sirs6/rlsatutitiktiga",
  verifyToken,
  insertDataRLSatuTitikTiga
);
router.get("/sirs6/rlsatutitiktiga", verifyToken, getDataRLSatuTitikTiga);
router.get(
  "/sirs6/rlsatutitiktigadetail/:id",
  verifyToken,
  getDataRLSatuTitikTigaDetailById
);
router.patch(
  "/sirs6/rlsatutitiktiga/:id",
  verifyToken,
  updateDataRLSatuTitikTiga
);
router.delete(
  "/sirs6/rlsatutitiktiga/:id",
  verifyToken,
  deleteDataRLSatuTitikTiga
);

// RL 3.1
router.post(
  "/sirs6/rltigatitiksatu",
  verifyToken,
  insertDataRLTigaTitikSatu
);
router.get("/sirs6/rltigatitiksatu", verifyToken, getDataRLTigaTitikSatu);
router.get(
  "/sirs6/rltigatitiksatudetail/:id",
  verifyToken,
  getDataRLTigaTitikSatuDetailById
);
router.patch(
  "/sirs6/rltigatitiksatu/:id",
  verifyToken,
  updateDataRLTigaTitikSatu
);
router.delete(
  "/sirs6/rltigatitiksatu/:id",
  verifyToken,
  deleteDataRLTigaTitikSatu
);

// RL 3.2
router.post(
  "/sirs6/rltigatitikdua",
  verifyToken,
  insertDataRLTigaTitikDua
);
router.get("/sirs6/rltigatitikdua", verifyToken, getDataRLTigaTitikDua);
router.delete(
  "/sirs6/rltigatitikdua/:id",
  verifyToken,
  deleteDataRLTigaTitikDua
);
router.get(
  "/sirs6/rltigatitikduadetail/:id",
  verifyToken,
  getDataRLTigaTitikDuaDetail
);
router.patch(
  "/sirs6/rltigatitikduadetail/:id",
  verifyToken,
  updateDataRLTigaTitikDua
);

// RL 3.3
router.post(
  "/sirs6/rltigatitiktiga",
  verifyToken,
  insertDataRLTigaTitikTiga
);
router.get("/sirs6/rltigatitiktiga", verifyToken, getDataRLTigaTitikTiga);
router.delete(
  "/sirs6/rltigatitiktigadetail/:id",
  verifyToken,
  deleteDataRLTigaTitikTiga
);
router.get(
  "/sirs6/rltigatitiktigadetail",
  verifyToken,
  getDataRLTigaTitikTigaDetail
);
router.get(
  "/sirs6/rltigatitiktigadetail/:id",
  verifyToken,
  getRLTigaTitikTigaById
);
router.patch(
  "/sirs6/rltigatitiktigadetail/:id",
  verifyToken,
  updateDataRLTigaTitikTiga
);

// RL 3.4
router.post(
  "/sirs6/rltigatitikempat",
  verifyToken,
  insertDataRLTigaTitikEmpat
);
router.get(
  "/sirs6/rltigatitikempat",
  verifyToken,
  getDataRLTigaTitikEmpat
);
router.get(
  "/sirs6/rltigatitikempatdetail/:id",
  verifyToken,
  getRLTigaTitikEmpatById
);
router.delete(
  "/sirs6/rltigatitikempat/:id",
  verifyToken,
  deleteDataRLTigaTitikEmpat
);
router.patch(
  "/sirs6/rltigatitikempatdetail/:id",
  verifyToken,
  updateDataRLTigaTitikEmpat
);

// RL 3.5
router.post(
  "/sirs6/rltigatitiklima",
  verifyToken,
  insertDataRLTigaTitikLima
);
router.get("/sirs6/rltigatitiklima", verifyToken, getDataRLTigaTitikLima);
router.get(
  "/sirs6/rltigatitiklimadetail/:id",
  verifyToken,
  getRLTigaTitikLimaById
);
router.delete(
  "/sirs6/rltigatitiklima/:id",
  verifyToken,
  deleteDataRLTigaTitikLima
);
router.patch(
  "/sirs6/rltigatitiklimadetail/:id",
  verifyToken,
  updateDataRLTigaTitikLima
);

// RL 3.6
router.post(
  "/sirs6/rltigatitikenam",
  verifyToken,
  insertDataRLTigaTitikEnam
);
router.get(
  "/sirs6/rltigatitikenam",
  verifyToken,
  getDataRLTigaTitikEnamIdTahun
);
router.get(
  "/sirs6/rltigatitikenam/update/:id",
  verifyToken,
  getDataRLTigaTitikEnamId
);
router.patch(
  "/sirs6/rltigatitikenam/:id",
  verifyToken,
  updateDataRLTigaTitikEnamId
);
router.delete(
  "/sirs6/rltigatitikenam/:id",
  verifyToken,
  deleteDataRLTigaTitikEnamId
);

// RL 3.7
router.post(
  "/sirs6/rltigatitiktujuh",
  verifyToken,
  insertDataRLTigaTitikTujuh
);
router.get(
  "/sirs6/rltigatitiktujuh",
  verifyToken,
  getDataRLTigaTitikTujuh
);
router.get(
  "/sirs6/rltigatitiktujuhdetail",
  verifyToken,
  getDataRLTigaTitikTujuhDetail
);
router.get(
  "/sirs6/rltigatitiktujuhdetail/:id",
  verifyToken,
  getRLTigaTitikTujuhById
);
router.patch(
  "/sirs6/rltigatitiktujuhdetail/:id",
  verifyToken,
  updateDataRLTigaTitikTujuh
);
router.delete(
  "/sirs6/rltigatitiktujuhdetail/:id",
  verifyToken,
  deleteDataRLTigaTitikTujuh
);

// RL 3.8
router.post(
  "/sirs6/rltigatitikdelapan",
  verifyToken,
  insertDataRLTigaTitikDelapan
);
router.get(
  "/sirs6/rltigatitikdelapan",
  verifyToken,
  getDataRLTigaTitikDelapanDetailKegiatan
);
router.get(
  "/sirs6/rltigatitikdelapan/:id",
  verifyToken,
  getDataRLTigaTitikDelapanById
);
router.delete(
  "/sirs6/rltigatitikdelapan/:id",
  verifyToken,
  deleteDataRLTigaTitikDelapan
);
router.patch(
  "/sirs6/rltigatitikdelapan/:id",
  verifyToken,
  updateDataRLTigaTitikDelapan
);

// RL 3.9
router.post(
  "/sirs6/rltigatitiksembilan",
  verifyToken,
  insertDataRLTigaTitikSembilan
);
// router.get('/sirs6/rltigatitiksembilan', getDataRLTigaTitikSembilan)
router.get(
  "/sirs6/rltigatitiksembilan",
  verifyToken,
  getDataRLTigaTitikSembilanIdTahun
);
router.get(
  "/sirs6/rltigatitiksembilan/update/:id",
  verifyToken,
  getDataRLTigaTitikSembilanId
);
router.patch(
  "/sirs6/rltigatitiksembilan/:id",
  verifyToken,
  updateDataRLTigaTitikSembilanId
);
router.delete(
  "/sirs6/rltigatitiksembilan/:id",
  verifyToken,
  deleteDataRLTigaTitikSembilanId
);

// RL 3.10
router.post(
  "/sirs6/rltigatitiksepuluh",
  verifyToken,
  insertDataRLTigaTitikSepuluh
);
router.get(
  "/sirs6/rltigatitiksepuluh",
  verifyToken,
  getDatarlTigaTitikSepuluh
);
router.get(
  "/sirs6/rltigatitiksepuluhdetail",
  verifyToken,
  getDatarlTigaTitikSepuluhDetail
);
router.get(
  "/sirs6/rltigatitiksepuluhdetail/:id",
  verifyToken,
  getrlTigaTitikSepuluhById
);
router.patch(
  "/sirs6/rltigatitiksepuluhdetail/:id",
  verifyToken,
  updateDatarlTigaTitikSepuluh
);
router.delete(
  "/sirs6/rltigatitiksepuluhdetail/:id",
  verifyToken,
  deleteDataRLTigaTitikSepuluh
);

//Rl 3.11
router.post(
  "/sirs6/rltigatitiksebelas",
  verifyToken,
  insertDataRLTigaTitikSebelas
);
router.get(
  "/sirs6/rltigatitiksebelas",
  verifyToken,
  getDatarlTigaTitikSebelas
);
router.get(
  "/sirs6/rltigatitiksebelasdetail",
  verifyToken,
  getDatarlTigaTitikSebelasDetail
);
router.get(
  "/sirs6/rltigatitiksebelasdetail/:id",
  verifyToken,
  getrlTigaTitikSebelasById
);
router.patch(
  "/sirs6/rltigatitiksebelasdetail/:id",
  verifyToken,
  updateDatarlTigaTitikSebelas
);
router.delete(
  "/sirs6/rltigatitiksebelasdetail/:id",
  verifyToken,
  deleteDataRLTigaTitikSebelas
);

// RL 3.12
router.post(
  "/sirs6/rltigatitikduabelas",
  verifyToken,
  insertDataRLTigaTitikDuaBelas
);
router.get(
  "/sirs6/rltigatitikduabelas",
  verifyToken,
  getDataRLTigaTitikDuaBelas
);
router.get(
  "/sirs6/rltigatitikduabelasdetail",
  verifyToken,
  getDataRLTigaTitikDuaBelasDetail
);
router.get(
  "/sirs6/rltigatitikduabelasdetail/:id",
  verifyToken,
  getRLTigaTitikDuaBelasById
);
router.patch(
  "/sirs6/rltigatitikduabelasdetail/:id",
  verifyToken,
  updateDataRLTigaTitikDuaBelas
);
router.delete(
  "/sirs6/rltigatitikduabelasdetail/:id",
  verifyToken,
  deleteDataRLTigaTitikDuaBelas
);
router.get("/sirs6/getmetoda", verifyToken, getMetoda);

// RL 3.13a
router.post(
  "/sirs6/rltigatitiktigabelasa",
  verifyToken,
  insertDataRLTigaTitikTigaBelasA
);
router.get(
  "/sirs6/rltigatitiktigabelasa",
  verifyToken,
  getDataRLTigaTitikTigaBelasA
);
router.get(
  "/sirs6/rltigatitiktigabelasadetail",
  verifyToken,
  getDataRLTigaTitikTigaBelasADetail
);
router.get(
  "/sirs6/rltigatitiktigabelasadetail/:id",
  verifyToken,
  getRLTigaTitikTigaBelasAById
);
router.patch(
  "/sirs6/rltigatitiktigabelasadetail/:id",
  verifyToken,
  updateDataRLTigaTitikTigaBelasA
);
router.delete(
  "/sirs6/rltigatitiktigabelasadetail/:id",
  verifyToken,
  deleteDataRLTigaTitikTigaBelasA
);
router.get("/sirs6/getgolonganobat", verifyToken, getGolonganObat);

// RL 3.13b
router.post(
  "/sirs6/rltigatitiktigabelasb",
  verifyToken,
  insertDataRLTigaTitikTigaBelasB
);
router.get(
  "/sirs6/rltigatitiktigabelasb",
  verifyToken,
  getDataRLTigaTitikTigaBelasB
);
router.get(
  "/sirs6/rltigatitiktigabelasbdetail",
  verifyToken,
  getDataRLTigaTitikTigaBelasBDetail
);
router.get(
  "/sirs6/rltigatitiktigabelasbdetail/:id",
  verifyToken,
  getRLTigaTitikTigaBelasBById
);
router.patch(
  "/sirs6/rltigatitiktigabelasbdetail/:id",
  verifyToken,
  updateDataRLTigaTitikTigaBelasB
);
router.delete(
  "/sirs6/rltigatitiktigabelasbdetail/:id",
  verifyToken,
  deleteDataRLTigaTitikTigaBelasB
);
router.get("/sirs6/getgolonganobat", verifyToken, getGolonganObat);

// RL 3.14
router.post(
  "/sirs6/rltigatitikempatbelas",
  verifyToken,
  insertDataRLTigaTitikEmpatBelas
);
router.get(
  "/sirs6/rltigatitikempatbelas",
  verifyToken,
  getDataRLTigaTitikEmpatBelas
);
router.delete(
  "/sirs6/rltigatitikempatbelasdetail/:id",
  verifyToken,
  deleteDataRLTigaTitikEmpatBelas
);
router.get(
  "/sirs6/rltigatitikempatbelasdetail/:id",
  verifyToken,
  getDataRLTigaTitikEmpatBelasDetail
);
router.get(
  "/sirs6/rltigatitikempatbelasdetail/:id",
  verifyToken,
  getRLTigaTitikEmpatBelasById
);
router.patch(
  "/sirs6/rltigatitikempatbelasdetail/:id",
  verifyToken,
  updateDataRLTigaTitikEmpatBelas
);

// RL 3.15
router.post(
  "/sirs6/rltigatitiklimabelas",
  verifyToken,
  insertDataRLTigaTitikLimaBelas
);
router.get(
  "/sirs6/rltigatitiklimabelas",
  verifyToken,
  getDataRLTigaTitikLimaBelas
);
router.delete(
  "/sirs6/rltigatitiklimabelasdetail/:id",
  deleteDataRLTigaTitikLimaBelas
);
router.get(
  "/sirs6/rltigatitiklimabelasdetail/:id",
  verifyToken,
  getDataRLTigaTitikLimaBelasDetail
);
router.get(
  "/sirs6/rltigatitiklimabelasdetail/:id",
  verifyToken,
  getRLTigaTitikLimaBelasById
);
router.patch(
  "/sirs6/rltigatitiklimabelasdetail/:id",
  verifyToken,
  updateDataRLTigaTitikLimaBelas
);

// RL 4a
router.post("/sirs6/rlempata", verifyToken, insertDataRLEmpatA);
router.get("/sirs6/rlempata", verifyToken, getDataRLEmpatA);
router.delete("/sirs6/rlempata/:id", verifyToken, deleteDataRLEmpatA);
router.get("/sirs6/rlempata/:id", verifyToken, getDataRLEmpatAById);
router.patch("/sirs6/rlempata/:id", verifyToken, updateDataRLEmpatA);

// RL 4aSebab
router.post("/sirs6/rlempatasebab", verifyToken, insertDataRLEmpatASebab);
router.get("/sirs6/rlempatasebab", verifyToken, getDataRLEmpatASebab);
router.delete(
  "/sirs6/rlempatasebab/:id",
  verifyToken,
  deleteDataRLEmpatASebab
);
router.get(
  "/sirs6/rlempatasebab/:id",
  verifyToken,
  getDataRLEmpatASebabById
);
router.patch(
  "/sirs6/rlempatasebab/:id",
  verifyToken,
  updateDataRLEmpatASebab
);

// RL 4b
router.post("/sirs6/rlempatb", verifyToken, insertDataRLEmpatB);
router.get("/sirs6/rlempatb", verifyToken, getDataRLEmpatB);
router.delete("/sirs6/rlempatb/:id", verifyToken, deleteDataRLEmpatBId);
router.get(
  "/sirs6/rlempatb/penyakit",
  verifyToken,
  getDataJenisGolonganPenyakitB
);
router.get(
  "/sirs6/rlempatb/idpenyakit",
  verifyToken,
  getDataJenisGolonganPenyakitBId
);
router.get("/sirs6/rlempatb/update/:id", verifyToken, getDataRLEmpatBId);
router.patch("/sirs6/rlempatb/:id", verifyToken, updateDataRLEmpatId);

// RL 4b sebab
router.post("/sirs6/rlempatbsebab", verifyToken, insertDataRLEmpatBSebab);
router.get("/sirs6/rlempatbsebab", verifyToken, getDataRLEmpatBSebab);
router.get(
  "/sirs6/rlempatbsebab/penyakit",
  verifyToken,
  getDataJenisGolonganSebabPenyakitB
);
router.get(
  "/sirs6/rlempatbsebab/idpenyakit",
  verifyToken,
  getDataJenisGolonganSebabPenyakitBId
);
router.delete(
  "/sirs6/rlempatbsebab/:id",
  verifyToken,
  deleteDataRLEmpatBSebabId
);
router.get(
  "/sirs6/rlempatbsebab/update/:id",
  verifyToken,
  getDataRLEmpatBSebabId
);
router.patch(
  "/sirs6/rlempatbsebab/:id",
  verifyToken,
  updateDataRLEmpatSebabId
);

// RL 5.1
router.post(
  "/sirs6/rllimatitiksatu",
  verifyToken,
  insertDataRLLimaTitikSatu
);
router.get("/sirs6/rllimatitiksatu", verifyToken, getDataRLLimaTitikSatu);
router.get(
  "/sirs6/rllimatitiksatudetail/:id",
  verifyToken,
  getRLLimaTitikSatuById
);
router.delete(
  "/sirs6/rllimatitiksatu/:id",
  verifyToken,
  deleteDataRLLimaTitikSatu
);
router.patch(
  "/sirs6/rllimatitiksatudetail/:id",
  verifyToken,
  updateDataRLLimaTitikSatu
);

// RL 5.2
router.post(
  "/sirs6/rllimatitikdua",
  verifyToken,
  insertDataRLLimaTitikDua
);
router.get("/sirs6/rllimatitikdua", verifyToken, getDataRLLimaTitikDua);
router.get(
  "/sirs6/rllimatitikduadetail/:id",
  verifyToken,
  getRLLimaTitikDuaById
);
router.delete(
  "/sirs6/rllimatitikdua/:id",
  verifyToken,
  deleteDataRLLimaTitikDua
);
router.patch(
  "/sirs6/rllimatitikduadetail/:id",
  verifyToken,
  updateDataRLLimaTitikDua
);

// RL 5.3
router.post(
  "/sirs6/rllimatitiktiga",
  verifyToken,
  insertDataRLLimaTitikTiga
);
router.get("/sirs6/rllimatitiktiga", verifyToken, getDataRLLimaTitikTiga);
router.get(
  "/sirs6/rllimatitiktigadetail",
  verifyToken,
  getDataRLLimaTitikTigaDetail
);
router.get(
  "/sirs6/rllimatitiktigadetail/:id",
  verifyToken,
  getRLLimaTitikTigaById
);
router.patch(
  "/sirs6/rllimatitiktigadetail/:id",
  verifyToken,
  updateDataRLLimaTitikTiga
);
router.delete(
  "/sirs6/rllimatitiktigadetail/:id",
  deleteDataRLLimaTitikTiga
);
router.get("/sirs6/getnourut", verifyToken, getNoUrut);
router.get("/sirs6/geticd10", verifyToken, getIcd10);

// RL 5.4
router.post(
  "/sirs6/rllimatitikempat",
  verifyToken,
  insertDataRLLimaTitikEmpat
);
router.get(
  "/sirs6/rllimatitikempat",
  verifyToken,
  getDataRLLimaTitikEmpat
);
router.get(
  "/sirs6/rllimatitikempatdetail",
  verifyToken,
  getDataRLLimaTitikEmpatDetail
);
router.get(
  "/sirs6/rllimatitikempatdetail/:id",
  verifyToken,
  getRLLimaTitikEmpatById
);
router.patch(
  "/sirs6/rllimatitikempatdetail/:id",
  verifyToken,
  updateDataRLLimaTitikEmpat
);
router.delete(
  "/sirs6/rllimatitikempatdetail/:id",
  verifyToken,
  deleteDataRLLimaTitikEmpat
);
router.get("/sirs6/getnourut", verifyToken, getNoUrut);
router.get("/sirs6/geticd10", verifyToken, getIcd10);

export default router;
