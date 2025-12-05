# @newustechnology/bpjs-bridging

Library resmi untuk bridging BPJS Kesehatan (PCare, VClaim, Antrean, iCare, Rekam Medis)
yang sudah modular, type-safe, dan mudah diintegrasikan.

## Installation

```bash
npm install @newustechnology/bpjs-bridging
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
});

const dokter = await pcare.getDokter(0, 10);
console.log(dokter);
```

---

Features

🔐 Auto enkripsi/dekripsi AES BPJS

🔄 Auto generate header signature

📦 Modular service: PCare, VClaim, Antrean, iCare

🧪 Fully tested with Jest

⚡ Fast, clean, and simple

---
