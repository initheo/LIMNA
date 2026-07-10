import { Type } from "@google/genai";
import { getGeminiClient } from "./geminiClient.js";

const responseSchema = {
  type: Type.OBJECT,
  properties: {
    riskLevel: {
      type: Type.STRING,
      description: "Tingkat risiko: Rendah, Sedang, atau Tinggi",
    },
    particleRange: {
      type: Type.STRING,
      description: "Estimasi jumlah partikel per liter",
    },
    riskColor: {
      type: Type.STRING,
      description: "Warna risiko: green, yellow, atau red",
    },
    analysisTitle: {
      type: Type.STRING,
      description: "Judul analisis",
    },
    analysisSummary: {
      type: Type.STRING,
      description: "Ringkasan ilmiah kondisi air dan risiko lokal",
    },
    mitigationSteps: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "3-4 langkah mitigasi yang dapat dipraktikkan",
    },
    alternatives: {
      type: Type.STRING,
      description: "Saran filtrasi tambahan atau kebiasaan penyimpanan air",
    },
    disclaimer: {
      type: Type.STRING,
      description: "Pernyataan bahwa ini model edukasi, bukan hasil lab resmi",
    },
  },
  required: [
    "riskLevel",
    "particleRange",
    "riskColor",
    "analysisTitle",
    "analysisSummary",
    "mitigationSteps",
    "alternatives",
    "disclaimer",
  ],
};

export async function analyzeWaterQuality({ sumberAir, lokasi, filtrasi }) {
  const client = getGeminiClient();

  //const prompt = `Analisis kualitas air dengan parameter berikut:\n- Sumber Air Utama: ${sumberAir}\n- Lokasi Geografis: ${lokasi}\n- Metode Filtrasi: ${filtrasi}\n\nBerikan analisis ilmiah mengenai potensi kontaminasi mikroplastik dan kualitas air harian di wilayah tersebut. Sampaikan dalam Bahasa Indonesia yang formal, informatif, akademis namun mudah dipahami.`;
    const prompt = `Anda adalah seorang Ahli Hidrologi dan Ilmuwan Toksikologi Lingkungan senior. Tugas Anda adalah memberikan analisis ilmiah yang sangat akurat, berbasis data spasial, dan riset terkini mengenai kualitas air dan potensi kontaminasi mikroplastik/nanoplastik.

Lakukan analisis mendalam berdasarkan parameter input berikut:
- Sumber Air Utama: ${sumberAir}
- Lokasi Geografis: ${lokasi}
- Metode Filtrasi Saat Ini: ${filtrasi}

Instruksi Analisis (Chain of Thought):
1. Analisis Lokasi: Evaluasi kondisi hidrologis, tingkat polusi industri/domestik, dan kualitas tata kelola air secara umum di wilayah geografis yang disebutkan.
2. Analisis Sumber Air: Identifikasi kerentanan spesifik dari sumber air tersebut (misal: air PDAM rentan terhadap abrasi pipa PVC/distribusi; air sumur rentan rembesan limbah TPA; air kemasan rentan peluruhan botol PET akibat suhu).
3. Evaluasi Filtrasi: Hitung secara teoretis efektivitas metode filtrasi yang digunakan terhadap mikroplastik (ukuran <5mm) dan nanoplastik (<1 mikrometer). (Catatan sains: Merebus air TIDAK menghilangkan plastik, justru berpotensi memecah partikel jika wadah salah; Filter RO sangat efektif; Filter Karbon hanya efektif sebagian).
4. Sintesis: Gabungkan data di atas untuk menghasilkan kesimpulan risiko.

PENTING: Anda harus mengembalikan hasil HANYA dalam format JSON yang valid tanpa tambahan teks, markdown, atau pembuka/penutup apapun. Gunakan struktur persis seperti di bawah ini:

{
  "analysisTitle": "Berikan judul analisis ilmiah singkat (Maksimal 6 kata, contoh: Analisis Paparan Polimer Air PDAM)",
  "analysisSummary": "Berikan 3-4 kalimat ringkasan ilmiah yang padat, akademis, dan informatif mengenai kondisi air di lokasi tersebut berdasarkan sumber dan filtrasinya.",
  "riskLevel": "Tinggi | Sedang | Rendah (Pilih salah satu berdasarkan analisis)",
  "riskColor": "red | yellow | green (red untuk Tinggi, yellow untuk Sedang, green untuk Rendah)",
  "particleRange": "Berikan estimasi ilmiah rentang partikel per liter (contoh: 150 - 500 partikel/liter)",
  "mitigationSteps": [
    "Langkah mitigasi teknis 1 yang spesifik",
    "Langkah mitigasi teknis 2",
    "Langkah mitigasi teknis 3"
  ],
  "alternatives": "Berikan 1-2 kalimat saran alternatif sumber air atau upgrade sistem filtrasi yang paling masuk akal secara finansial dan teknis.",
  "disclaimer": "Analisis ini dihasilkan oleh model AI berdasarkan parameter lingkungan teoretis dan studi literatur hidrologi, bukan merupakan hasil uji laboratorium resmi tersertifikasi."
}`;
  const response = await client.models.generateContent({
    model: "gemini-3.5-flash",
    contents: prompt,
    config: {
      systemInstruction:
        "Anda adalah pakar sains lingkungan dan sanitasi air bersih dari Limna AI. Gunakan wawasan ilmiah tentang polusi mikroplastik dari beragam sumber air minum, sesuaikan dengan kondisi lokasi pengguna, dan kembalikan output JSON yang valid.",
      responseMimeType: "application/json",
      responseSchema,
    },
  });

  const responseText = response.text;
  if (!responseText) {
    throw new Error("No response from AI model");
  }

  const result = JSON.parse(responseText.trim());
  return result;
}
