<p align="center">
  <img src="https://img.shields.io/badge/Newus%20BPJS%20Bridge-FKTP-blue?style=for-the-badge" />
</p>

<h1 align="center">BPJS Bridge FKTP Service</h1>

<p align="center">
  Integrasi BPJS PCare, Antrean FKTP, VClaim, dan iCare dengan dukungan Redis Cache, Logging, dan Modular Service Architecture. 
  <br />
  Repository resmi: <a href="https://github.com/NewusTech/bpjs-bridge">NewusTech/bpjs-bridge</a>
</p>

<div align="center">

![npm version](https://img.shields.io/npm/v/@newustechnology/bpjs-bridge?color=%2300aaff&label=npm%20version)
![npm downloads](https://img.shields.io/npm/dm/@newustechnology/bpjs-bridge?color=%23ffaa00&label=downloads)
![npm license](https://img.shields.io/npm/l/@newustechnology/bpjs-bridge)

![GitHub Package Version](https://img.shields.io/github/v/release/newustechnology/bpjs-bridge?label=github%20packages)
![GitHub Actions](https://img.shields.io/github/actions/workflow/status/newustechnology/bpjs-bridge/publish.yml?label=publish%20status)
![GitHub Repo stars](https://img.shields.io/github/stars/newustechnology/bpjs-bridge?style=social)

</div>

## Installation

```bash
npm i bpjs-bridge
```

## Usage

```
import { PcareService } from "@newustechnology/bpjs-bridging";

const pcare = new PcareService({
consId: "...",
secretKey: "...",
userKey: "...",
username: "...",
password: "..."
},redist);

const dokter = await pcare.dokter.get(0, 10);
console.log(dokter);
```

---

## 📌 **Fitur Utama**

- ⚡ **Redis Caching** untuk mempercepat response BPJS
- 🔐 Request signing otomatis (X-Signature, Authorization, Timestamp)
- 🧩 Arsitektur service modular (PcareService, FktpService, AntrolService)
- 📚 Auto-retry request & error handling kuat
- 🧵 Prefix Redis per fasilitas kesehatan
- 🧼 Pattern deletion & flush cache
- 📦 Endpoints BPJS terstruktur via config JSON
- 🚀 Support transaksi BPJS GET/POST/PUT/DELETE

---

# Dokumentasi Fitur Redis Cache pada `FktpService`

Dokumentasi ini menjelaskan cara kerja sistem caching Redis yang diimplementasikan pada class `FktpService`. Tujuannya adalah mempercepat respons API BPJS, mengurangi beban request berulang, serta meningkatkan performa aplikasi.

---

## 🚀 1. Overview Arsitektur

Class **`FktpService`** berfungsi sebagai service utama untuk memanggil endpoint BPJS (PCare, Antrean, VClaim, iCare) dengan fitur tambahan berupa:

- Redis caching
- Prefix key dinamis per fasyankes/puskesmas
- Otomatis menyimpan dan mengambil cache berdasarkan parameter API
- TTL (kadaluarsa cache) otomatis
- Penghapusan berdasarkan pola (pattern deletion)
- Flush semua cache

---

## 🧩 2. Cara Kerja Redis Cache

### **a. Inisialisasi Redis**

```ts
constructor(config, redisClient, chachePrefix) {
  this.client = createBpjsClient(config);

  if (redisClient) {
    this.redisClient = redisClient;

    this.redisClient.on("connect", () => console.info("Redis connected"));
    this.redisClient.on("error", err => console.error("Redis error:", err));

    if (chachePrefix) {
      this.defaultRedisKeyPrefix =
        this.defaultRedisKeyPrefix + "_" + chachePrefix + ":";
    }
  }
}
```

Fitur ini memungkinkan:

- Menggunakan Redis secara opsional
- Menghasilkan prefix unik untuk setiap instansi faskes
- Mempermudah isolasi cache antar puskesmas

---

## 📦 3. Menyimpan Data ke Redis (`set`)

```ts
private async set(key, value, expInSecond = 3600)
```

### Fungsi ini:

- Menerima key dan value
- Mengubah value menjadi JSON string
- Menyimpan ke Redis dengan TTL default **3600 detik** (1 jam)

Flow:

1. Serialize → JSON.stringify
2. Redis SET key with **EXPIRE**

---

## 🔍 4. Mengambil Data dari Redis (`get`)

```ts
private async get(key)
```

Fungsi:

- Mencari key di Redis
- Mengembalikan string JSON atau `null` jika tidak ada
- Logging otomatis jika cache ditemukan

Jika data ditemukan:

- System **tidak memanggil API BPJS**
- Mengembalikan data sebagai **fake AxiosResponse**

---

## 🗑️ 5. Menghapus Cache (`del`)

```ts
private async del(key)
```

Menghapus satu cache berdasarkan key lengkap.

---

## 🧹 6. Hapus Banyak Key Berdasarkan Pola (`deleteKeysByPattern`)

```ts
private async deleteKeysByPattern(pattern)
```

Contoh:

- Menghapus semua cache endpoint PCare:  
  `deleteKeysByPattern("pcare_*")`

Fitur ini sangat berguna ketika:

- Fasyankes update mapping
- Data referensi berubah
- Harus invalidasi cache massal

---

## 💣 7. Flush Semua Cache

```ts
private async flushAll()
```

Membersihkan seluruh isi Redis.

---

## 🔥 8. Mekanisme utama caching di `callEndpoint`

### **Langkah-langkah lengkap:**

#### 1️⃣ Generate cacheKey

```ts
const cacheKey = `${name}:${JSON.stringify(params)}`;
```

#### 2️⃣ Cek apakah data sudah ada di Redis

```ts
const cachedData = await this.get(cacheKey);
```

Jika ada → langsung return:

```ts
return {
  data: parsed,
  status: 200,
  statusText: "OK",
  headers: {},
  config: client.defaults,
};
```

Tanpa memanggil API BPJS!

#### 3️⃣ Jika tidak ada cache → BPJS request dijalankan

```ts
const res = await this.client({ url: endpoint, method: "GET" });
```

#### 4️⃣ Data response yang bukan string disimpan ke Redis

```ts
await this.set(cacheKey, res.data);
```

---

## 📘 9. Keuntungan Implementasi Cache

| Fitur                | Manfaat                                           |
| -------------------- | ------------------------------------------------- |
| Redis TTL            | Otomatis invalidasi cache usang                   |
| Prefix per puskesmas | Cache tidak saling tercampur                      |
| Fake AxiosResponse   | Kompatibel dengan semua service yang expect Axios |
| Pattern deletion     | Mudah invalidasi cache masal                      |
| Response lebih cepat | Hemat request ke BPJS                             |

---

## 📝 10. Contoh Struktur Key Redis

```
bpjs_bridge_fktp_puskesmasA:pcare_diagnosa:{"kode":"A00"}
bpjs_bridge_fktp_puskesmasA:pcare_obat:{"kdObat":"40102"}
bpjs_bridge_fktp_puskesmasB:vclaim_peserta:{"nokartu":"000123"}
```

Prefix → per instansi  
Suffix → berdasarkan endpoint + parameter

---

## 🧪 11. Cara Menggunakan dalam Service PCare / Antrean

```ts
const res = await fktpService.callEndpoint("pcare_diagnosa", { kode: "A00" });
```

Jika sudah pernah dipanggil → langsung ambil dari Redis.

---

## 📄 12. Catatan Penting

- Cache **hanya berjalan untuk request GET**, sesuai pola:
  ```ts
  if (method === "GET") save to Redis
  ```
- Untuk POST/PUT/DELETE → tidak disimpan agar tidak membuat konflik data.
- TTL default bisa diganti sesuai kebutuhan.

---

#### ✅ Penutup

Dokumentasi ini menjelaskan seluruh mekanisme internal caching Redis yang digunakan pada sistem BPJS Bridge.  
Implementasi ini membuat aplikasi lebih cepat, efisien, dan hemat pemanggilan API.

---

🧑‍💻 Kontributor

Terima kasih kepada semua kontributor yang telah membantu pengembangan project ini 🙏

<br> <!-- Contrib rocks --> <p align="center"> <img src="https://contrib.rocks/image?repo=NewusTech/bpjs-bridge" /> </p>

<!-- readme: contributors -start -->
<!-- readme: contributors -end -->

📄 Lisensi

## MIT License © Newus Teknologi

❤️ Dukungan

Jika project ini bermanfaat, jangan lupa:

⭐ Star repository
🍴 Fork bila ingin modifikasi
🐛 Open issue untuk bug/fitur baru
