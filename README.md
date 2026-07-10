# Limna AI Water Microplastic Checker

Aplikasi web untuk memprediksi risiko kontaminasi mikroplastik pada air minum berdasarkan:
- Sumber air utama
- Lokasi geografis
- Metode filtrasi

Project ini menggunakan arsitektur JavaScript murni (HTML, CSS, JavaScript) dan dipisah per domain agar maintenance lebih mudah.

## Fitur Utama

- Form analisis risiko mikroplastik berbasis input pengguna
- Integrasi server-side ke Gemini API
- Hasil analisis terstruktur (tingkat risiko, estimasi partikel, mitigasi, disclaimer)
- UI frontend ringan tanpa framework frontend

## Arsitektur

- front: layer presentasi (UI dan interaksi browser)
- backend: Express server, routing, validasi request, static serving
- ai: inisialisasi Gemini client dan logika analisis AI

## Struktur Folder

```text
.
|-- front/
|   |-- index.html
|   |-- styles.css
|   `-- app.js
|-- backend/
|   `-- server.js
|-- ai/
|   |-- geminiClient.js
|   `-- analyzeWater.js
|-- .env.example
|-- metadata.json
`-- package.json
```

## Prasyarat

- Node.js 18 atau lebih baru

## Setup dan Menjalankan

1. Install dependency

```bash
npm install
```

2. Buat file .env (atau sesuaikan env di platform Anda), lalu isi:

```env
GEMINI_API_KEY="YOUR_GEMINI_API_KEY"
```

3. Jalankan server

```bash
npm run dev
```

4. Akses aplikasi

```text
http://localhost:3000
```

## Script NPM

- npm run dev: menjalankan server aplikasi
- npm start: menjalankan server aplikasi (alias production sederhana)

## API

### POST /api/analyze

Request body (JSON):

```json
{
  "sumberAir": "Air Keran (PDAM)",
  "lokasi": "Bandung, Jawa Barat",
  "filtrasi": "Filter Karbon / UV"
}
```

Response body (JSON):

```json
{
  "riskLevel": "Sedang",
  "particleRange": "20-80 partikel/L",
  "riskColor": "yellow",
  "analysisTitle": "Risiko Moderat dengan Filtrasi Menengah",
  "analysisSummary": "...",
  "mitigationSteps": ["...", "...", "..."],
  "alternatives": "...",
  "disclaimer": "..."
}
```
