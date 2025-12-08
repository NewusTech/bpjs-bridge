export interface AntreanFktpReferensiPoliType {
  namapoli: string;
  nmsubspesialis?: string;
  kdsubspesialis?: string;
  kodepoli: string;
}

export interface AntreanFktpReferensiDokterType {
  namadokter: string;
  kodedokter: number;
  jampraktek: string;
  kapasitas: number;
}

export interface AntreanFktpPayload {
  nomorkartu: string;
  nik: string;
  nohp: string;
  kodepoli: string;
  namapoli: string;
  norm: string;
  tanggalperiksa: string;
  kodedokter: number;
  namadokter: string;
  jampraktek: string;
  nomorantrean: string;
  angkaantrean: number;
  keterangan: string;
}

export interface AntreanFktpStatusPayload {
  tanggalperiksa: string;
  kodepoli: string;
  nomorkartu: string;
  status: 1 | 2;
  waktu: number;
}

export interface AntreanFktpBatalPayload {
  tanggalperiksa: string;
  kodepoli: string;
  nomorkartu: string;
  alasan: string;
}
