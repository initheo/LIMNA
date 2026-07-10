/**
 * =========================================================================
 * LIMNA AI - LOGIKA APLIKASI UTAMA (JAVASCRIPT)
 * =========================================================================
 * File ini berisi seluruh interaksi frontend, integrasi API Gemini secara 
 * server-side melalui Express backend, serta sistem simulasi offline untuk 
 * pengujian lokal menggunakan VS Code Live Server.
 * 
 * DAFTAR FITUR JAVASCRIPT UTAMA (Untuk Penilaian Proyek Akhir):
 * 1. Animasi Latar Belakang (Particles.js): Animasi partikel mengambang untuk visual futuristik.
 * 2. Tombol Scroll-to-Top: Membantu navigasi meluncur kembali ke atas secara mulus (smooth scroll).
 * 3. Navigasi Scroll Halus (Smooth Scrolling): Perpindahan menu navigasi dengan animasi mulus.
 * 4. Pilihan Cepat Kota (Quick City Selector): Mengisi input lokasi secara instan saat diklik.
 * 5. Kartu Wawasan Riset Interaktif: Membuka modal popup detail riset secara dinamis berdasarkan data array.
 * 6. Panel Sisi Informasi Dinamis (Side Panel): Menampilkan Kebijakan Privasi & Dokumen Penelitian.
 * 7. Integrasi Gemini API & Simulator Kualitas Air: Memanggil Express backend (yang menggunakan API Key 
 *    dari .env) sebagai prioritas utama, dengan fallback otomatis ke simulasi pintar offline saat offline.
 * =========================================================================
 */

// State internal aplikasi untuk melacak modal dan panel yang aktif
const state = {
  selectedInsight: null,
  activePanel: null,
};

// Referensi elemen-elemen DOM utama di halaman web
const elements = {
  scrollTopBtn: document.getElementById("scrollTopBtn"),
  getStartedBtn: document.getElementById("getStartedBtn"),
  heroCheckBtn: document.getElementById("heroCheckBtn"),
  heroLearnBtn: document.getElementById("heroLearnBtn"),
  form: document.getElementById("analysisForm"),
  submitBtn: document.getElementById("submitBtn"),
  resetBtn: document.getElementById("resetBtn"),
  statusBox: document.getElementById("statusBox"),
  errorBox: document.getElementById("errorBox"),
  resultSection: document.getElementById("resultSection"),
  riskBadge: document.getElementById("riskBadge"),
  analysisRiskLevel: document.getElementById("analysisRiskLevel"),
  analysisTitle: document.getElementById("analysisTitle"),
  analysisSummary: document.getElementById("analysisSummary"),
  particleRange: document.getElementById("particleRange"),
  mitigationSteps: document.getElementById("mitigationSteps"),
  alternatives: document.getElementById("alternatives"),
  disclaimer: document.getElementById("disclaimer"),
  quickCityWrap: document.getElementById("quickCityWrap"),
  insightModal: document.getElementById("insightModal"),
  insightModalIcon: document.getElementById("insightModalIcon"),
  insightModalTitle: document.getElementById("insightModalTitle"),
  insightModalDesc: document.getElementById("insightModalDesc"),
  insightModalText: document.getElementById("insightModalText"),
  insightModalSource: document.getElementById("insightModalSource"),
  modalGoToChecker: document.getElementById("modalGoToChecker"),
  sidePanel: document.getElementById("sidePanel"),
  panelTitle: document.getElementById("panelTitle"),
  panelContent: document.getElementById("panelContent"),
  panelCloseBtn: document.getElementById("panelCloseBtn"),
};

// Frasa loading bergantian untuk memberikan umpan balik interaktif saat AI memproses data
const loadingPhrases = [
  "Menghubungkan ke Limna AI engine...",
  "Menganalisis data hidrologis lokal di wilayah Anda...",
  "Memetakan potensi kontaminasi mikropartikel...",
  "Menghitung efektivitas filtrasi yang dipakai...",
  "Merumuskan rekomendasi mitigasi personal...",
];

// Daftar kota rekomendasi cepat untuk mempermudah pengguna mengisi data
const quickCities = ["Surabaya", "Gresik", "Jakarta", "Bandung", "Medan", "Makassar", "Yogyakarta"];

// Data statis untuk wawasan penelitian terbaru (terintegrasi dengan ikon FontAwesome)
const insights = [
  {
    title: "5 Gram Plastik per Minggu",
    description: "Manusia rata-rata mengonsumsi mikroplastik setara ukuran kartu kredit setiap minggunya melalui air minum.",
    fullText: "Penelitian global mengungkapkan bahwa partikel mikroplastik dapat masuk ke tubuh melalui air minum, baik air ledeng maupun air kemasan. Akumulasi yang terus-menerus dapat berpengaruh terhadap metabolisme dan kualitas kesehatan jangka panjang.",
    source: "Studi WWF, 2019",
    icon: "fa-solid fa-credit-card",
    color: "blue",
  },
  {
    title: "Air Kemasan Terkontaminasi",
    description: "Penelitian menemukan partikel plastik di hampir semua merek air kemasan yang diuji secara global.",
    fullText: "Sebuah studi komprehensif menemukan bahwa sebagian besar sampel air kemasan menunjukkan jejak mikroplastik. Sumbernya dapat berasal dari proses produksi, tutup botol, hingga sumber air baku yang terpapar limbah plastik.",
    source: "SUNY / Orb Media",
    icon: "fa-solid fa-bottle-water",
    color: "teal",
  },
  {
    title: "Masa Depan Ekosistem & Tubuh",
    description: "Akumulasi mikroplastik dapat memicu peradangan kronis dan gangguan endokrin bila dibiarkan.",
    fullText: "Partikel mikroplastik dan nanoplastik berpotensi menembus jaringan biologis. Senyawa tambahan dalam plastik juga dikenal sebagai pengganggu endokrin yang dapat memengaruhi tubuh secara perlahan.",
    source: "Laporan Kualitas Air WHO",
    icon: "fa-solid fa-dna",
    color: "rose",
  },
  {
    title: "Ratusan Ribu Nanoplastik",
    description: "Studi terbaru menemukan rata-rata 240.000 partikel nanoplastik dalam setiap liter air minum kemasan.",
    fullText: "Menggunakan teknologi pencitraan laser canggih, para peneliti menemukan bahwa jumlah partikel plastik mikroskopis (nanoplastik) di dalam air kemasan jauh lebih banyak dari perkiraan sebelumnya. Partikel berukuran nano ini cukup kecil untuk menembus sel manusia.",
    source: "Studi Universitas Columbia, 2024",
    icon: "fa-solid fa-atom",
    color: "purple",
  },
  {
    title: "Kontaminasi Sungai Lokal",
    description: "Sebagian besar sungai utama di Indonesia terdeteksi mengandung mikroplastik akibat limbah domestik.",
    fullText: "Riset komprehensif pada ekosistem sungai menunjukkan tingkat kontaminasi yang tinggi. Senyawa ini terakumulasi dalam tubuh organisme air, yang kemudian berpotensi masuk ke dalam rantai makanan masyarakat sekitar.",
    source: "Studi Lingkungan, 2022",
    icon: "fa-solid fa-water",
    color: "amber",
  },
  {
    title: "Efek Rantai Makanan",
    description: "Mikroplastik berpindah dari organisme kecil hingga ke predator puncak dan piring makan kita.",
    fullText: "Proses biomagnifikasi menyebabkan konsentrasi mikroplastik meningkat seiring bergeraknya partikel tersebut ke atas dalam rantai makanan. Manusia menghadapi risiko paparan akumulatif tertinggi dari konsumsi produk air tercemar.",
    source: "Laporan Polusi Laut FAO, 2020",
    icon: "fa-solid fa-fish",
    color: "emerald",
  }
];

// Data untuk panel informasi samping (Side Panel) di bagian footer
const panelContentMap = {
  privacy: {
    title: "Kebijakan Privasi",
    content: [
      "Kami menghargai privasi data harian Anda. Input seperti sumber air, lokasi, dan metode filtrasi diproses secara server-side menggunakan Gemini AI.",
      "Limna AI tidak menyimpan lokasi GPS detail atau data pribadi jangka panjang pada database eksternal.",
      "Semua data dipakai hanya untuk edukasi sains kualitas air dan tidak dipakai untuk iklan atau penjualan data.",
    ],
  },
  terms: {
    title: "Ketentuan Layanan",
    content: [
      "Analisis ini berbasis model prediksi AI dan parameter lingkungan teoretis, bukan tes laboratorium resmi.",
      "Limna AI tidak bertanggung jawab atas keputusan kesehatan atau pemasangan filter yang diambil tanpa pengujian resmi.",
      "Untuk hasil kuantitatif yang akurat, tetap gunakan uji laboratorium bersertifikat.",
    ],
  },
  research: {
    title: "Dokumentasi Penelitian",
    content: [
      "1. Synthetic Polymer Contamination in Bottled Water - Frontiers in Chemistry (2018).",
      "2. Human Consumption of Microplastics - Environmental Science & Technology (2019).",
      "3. Polusi Mikroplastik Ekosistem Air Tawar (2022).",
    ],
  },
  contact: {
    title: "Hubungi Kami & Diskusi",
    content: [
      "Apakah Anda tertarik untuk berdiskusi lebih lanjut mengenai isu mikroplastik, berkolaborasi dalam penelitian kualitas air, atau memiliki gagasan kolaboratif mengenai proyek LIMNA AI?",
      "Kami sangat terbuka untuk berbagi wawasan dan bekerja sama demi mewujudkan lingkungan hidup yang lebih bersih dan aman bagi masyarakat.",
      "Silakan hubungi kami langsung melalui surel di: <a href=\"mailto:sustrisimamora0413@gmail.com\" style=\"color: #4df3ff; text-decoration: underline;\">sustrisimamora0413@gmail.com</a>",
      "Kami menyambut baik setiap ide, saran kemitraan, maupun ruang diskusi ilmiah demi masa depan ekosistem kita yang lebih baik."
    ],
  },
};

let loadingTimer = null;

/**
 * FITUR JS 1: Menampilkan kotak status proses analisis
 */
function showStatus(text) {
  if (elements.statusBox) {
    elements.statusBox.textContent = text;
    elements.statusBox.classList.remove("hidden");
  }
}

function hideStatus() {
  if (elements.statusBox) {
    elements.statusBox.classList.add("hidden");
    elements.statusBox.textContent = "";
  }
}

/**
 * FITUR JS 2: Menampilkan pesan kesalahan/error di formulir
 */
function showError(text) {
  if (elements.errorBox) {
    elements.errorBox.textContent = text;
    elements.errorBox.classList.remove("hidden");
  }
}

function hideError() {
  if (elements.errorBox) {
    elements.errorBox.classList.add("hidden");
    elements.errorBox.textContent = "";
  }
}

/**
 * FITUR JS 3: Mengelola status tombol submit dan animasi loading teks berkala
 */
function setLoading(isLoading) {
  if (elements.submitBtn) {
    elements.submitBtn.disabled = isLoading;
    elements.submitBtn.textContent = isLoading ? "Sedang Menganalisis..." : "Analisis dengan AI";
  }

  if (!isLoading) {
    if (loadingTimer) {
      clearInterval(loadingTimer);
      loadingTimer = null;
    }
    hideStatus();
    return;
  }

  let index = 0;
  showStatus(`> ${loadingPhrases[index]}`);
  loadingTimer = setInterval(() => {
    index = (index + 1) % loadingPhrases.length;
    showStatus(`> ${loadingPhrases[index]}`);
  }, 1200);
}

/**
 * FITUR JS 4: Penentuan kelas warna CSS berdasarkan tingkat risiko
 */
function getRiskClass(color) {
  if (color === "green") return "risk-green";
  if (color === "yellow") return "risk-yellow";
  return "risk-red";
}

/**
 * FITUR JS 5: Scroll halus ke bagian pengujian kualitas air
 */
function scrollToChecker() {
  const checkerSection = document.getElementById("checker-section");
  if (checkerSection) {
    checkerSection.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}

/**
 * FITUR JS 6: Render tombol pemilihan cepat kota dan pengisian form otomatis
 */
function renderQuickCities() {
  if (!elements.quickCityWrap) return;
  elements.quickCityWrap.innerHTML = "";

  quickCities.forEach((city) => {
    const button = document.createElement("button");
    button.type = "button";
    button.textContent = city;
    button.addEventListener("click", () => {
      document.getElementById("lokasi").value = city;
      document.querySelectorAll(".quick-city-wrap button").forEach((item) => item.classList.remove("active"));
      button.classList.add("active");
    });
    elements.quickCityWrap.appendChild(button);
  });
}

/**
 * FITUR JS 7: Penyiapan event listener klik untuk kartu wawasan riset
 */
function renderInsights() {
  document.querySelectorAll(".insight-card").forEach((card) => {
    card.addEventListener("click", () => {
      const index = Number(card.dataset.insight);
      if (!isNaN(index) && insights[index]) {
        openInsightModal(insights[index]);
      }
    });
  });
}

/**
 * FITUR JS 8: Membuka modal wawasan riset dinamis dengan visual ikon FontAwesome
 */
function openInsightModal(insight) {
  if (!elements.insightModal) return;
  state.selectedInsight = insight;
  elements.insightModalIcon.innerHTML = `<i class="${insight.icon}"></i>`;
  elements.insightModalIcon.className = `insight-icon-large insight-icon ${insight.color}`;
  elements.insightModalTitle.textContent = insight.title;
  elements.insightModalDesc.textContent = insight.description;
  elements.insightModalText.textContent = insight.fullText;
  elements.insightModalSource.textContent = `Sumber: ${insight.source}`;
  elements.insightModal.classList.remove("hidden");
  elements.insightModal.setAttribute("aria-hidden", "false");
}

function closeInsightModal() {
  if (!elements.insightModal) return;
  state.selectedInsight = null;
  elements.insightModal.classList.add("hidden");
  elements.insightModal.setAttribute("aria-hidden", "true");
}

/**
 * FITUR JS 9: Mengelola pembukaan panel samping informasi hukum/riset
 */
function openPanel(panelKey) {
  const panel = panelContentMap[panelKey];
  if (!panel || !elements.sidePanel) return;

  state.activePanel = panelKey;
  elements.panelTitle.textContent = panel.title;
  elements.panelContent.innerHTML = panel.content.map((text) => `<p>${text}</p>`).join("");
  elements.sidePanel.classList.remove("hidden");
  elements.sidePanel.setAttribute("aria-hidden", "false");
}

function closePanel() {
  if (!elements.sidePanel) return;
  state.activePanel = null;
  elements.sidePanel.classList.add("hidden");
  elements.sidePanel.setAttribute("aria-hidden", "true");
}

/**
 * FITUR JS 10: Merender data hasil analisis air ke dalam kartu hasil visual
 */
function renderResult(data) {
  if (!elements.resultSection) return;
  
  elements.riskBadge.className = `risk-badge ${getRiskClass(data.riskColor)}`;
  elements.riskBadge.textContent = `Risiko ${data.riskLevel}`;
  elements.analysisRiskLevel.textContent = data.riskLevel;
  elements.analysisTitle.textContent = data.analysisTitle;
  elements.analysisSummary.textContent = data.analysisSummary;
  elements.particleRange.textContent = data.particleRange;

  elements.mitigationSteps.innerHTML = "";
  if (data.mitigationSteps && data.mitigationSteps.length > 0) {
      data.mitigationSteps.forEach((step) => {
        const item = document.createElement("div");
        item.className = "mitigation-item";
        item.textContent = step;
        elements.mitigationSteps.appendChild(item);
      });
  }

  elements.alternatives.textContent = data.alternatives;
  elements.disclaimer.textContent = data.disclaimer;
  elements.resultSection.classList.remove("hidden");
  elements.resultSection.scrollIntoView({ behavior: "smooth", block: "start" });
}

/**
 * FITUR JS 11: Mengosongkan form dan menyembunyikan hasil lama saat tombol reset diklik
 */
function resetForm() {
  if (!elements.form) return;
  elements.form.reset();
  if (elements.resultSection) elements.resultSection.classList.add("hidden");
  if (elements.statusBox) elements.statusBox.classList.add("hidden");
  hideError();
  document.querySelectorAll(".quick-city-wrap button").forEach((item) => item.classList.remove("active"));
}

/**
 * FITUR JS 12: Simulasi analisis offline (Fallback) saat tidak terhubung ke backend
 * Menghasilkan data prediksi ilmiah realistis berdasarkan parameter inputan pengguna.
 */
function getMockAnalysis({ sumberAir, lokasi, filtrasi }) {
  let riskLevel = "Sedang";
  let riskColor = "yellow";
  let particleRange = "50 - 150 partikel/liter";
  let analysisTitle = `Analisis Paparan ${sumberAir} di ${lokasi}`;
  
  if (sumberAir.includes("PDAM")) {
    riskLevel = filtrasi === "Tidak Ada" ? "Tinggi" : "Sedang";
    riskColor = riskLevel === "Tinggi" ? "red" : "yellow";
    particleRange = filtrasi === "Tidak Ada" ? "200 - 450 partikel/liter" : "50 - 120 partikel/liter";
  } else if (sumberAir.includes("Sumur")) {
    riskLevel = filtrasi === "Tidak Ada" ? "Tinggi" : "Sedang";
    riskColor = riskLevel === "Tinggi" ? "red" : "yellow";
    particleRange = filtrasi === "Tidak Ada" ? "150 - 350 partikel/liter" : "40 - 100 partikel/liter";
  } else if (sumberAir.includes("Galon")) {
    riskLevel = filtrasi.includes("Osmosis") ? "Rendah" : "Sedang";
    riskColor = riskLevel === "Rendah" ? "green" : "yellow";
    particleRange = "30 - 80 partikel/liter";
  } else {
    riskLevel = "Sedang";
    riskColor = "yellow";
    particleRange = "10 - 50 partikel/liter";
  }

  const summary = `Hasil analisis teoretis untuk wilayah ${lokasi} dengan sumber ${sumberAir} menunjukkan tingkat risiko ${riskLevel}. Penggunaan metode filtrasi "${filtrasi}" memberikan dampak tertentu terhadap reduksi polimer plastik. Secara geografis, tingkat pencemaran domestik dan mikropartikel di area pemukiman ${lokasi} berpengaruh pada potensi akumulasi plastik mikro harian dalam tubuh.`;

  const mitigation = [
    `Gunakan wadah penyimpanan berbahan kaca atau stainless steel food-grade guna mengurangi peluruhan mikroplastik tambahan.`,
    `Tingkatkan sistem filtrasi di rumah Anda dengan filter bertahap (karbon aktif + reverse osmosis jika memungkinkan).`,
    `Hindari memanaskan air menggunakan wadah plastik atau meminum air dari botol kemasan yang telah terpapar suhu panas matahari.`
  ];

  const alternatives = `Disarankan untuk mempertimbangkan upgrade filtrasi ke sistem Reverse Osmosis (RO) untuk mereduksi mikropartikel secara maksimal.`;

  return {
    riskLevel,
    riskColor,
    particleRange,
    analysisTitle,
    analysisSummary: summary,
    mitigationSteps: mitigation,
    alternatives,
    disclaimer: "Mode Simulasi: Hasil ini dihasilkan secara lokal untuk keperluan demonstrasi/penilaian. Jalankan Express server proyek untuk analisis AI langsung menggunakan API Key."
  };
}

// =========================================================================
// REGISTER EVENT LISTENERS DAN INTERAKSI DOM
// =========================================================================

// Event listener global untuk mendeteksi klik penutup modal atau pembuka side-panel
document.addEventListener("click", (event) => {
  const target = event.target;
  if (!(target instanceof HTMLElement)) return;

  const closeTarget = target.dataset.close;
  if (closeTarget === "insight") closeInsightModal();
  if (closeTarget === "panel") closePanel();

  if (target.matches("[data-panel]")) {
      event.preventDefault();
      openPanel(target.dataset.panel);
  }
});

// Fitur Tombol Scroll Ke Atas yang muncul saat scroll melebihi 300px
if (elements.scrollTopBtn) {
  window.addEventListener('scroll', () => {
    if (window.scrollY > 300) elements.scrollTopBtn.classList.remove('hidden');
    else elements.scrollTopBtn.classList.add('hidden');
  });
  elements.scrollTopBtn.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
}

// Event listener untuk tombol navigasi hero
if (elements.getStartedBtn) elements.getStartedBtn.addEventListener("click", scrollToChecker);
if (elements.heroCheckBtn) elements.heroCheckBtn.addEventListener("click", scrollToChecker);
if (elements.heroLearnBtn) elements.heroLearnBtn.addEventListener("click", () => {
    const targetSection = document.getElementById("insights");
    if (targetSection) targetSection.scrollIntoView({ behavior: "smooth" });
});

if (elements.modalGoToChecker) {
  elements.modalGoToChecker.addEventListener("click", () => {
    closeInsightModal();
    scrollToChecker();
  });
}
if (elements.panelCloseBtn) elements.panelCloseBtn.addEventListener("click", closePanel);
if (elements.resetBtn) elements.resetBtn.addEventListener("click", resetForm);

// Handle Submit Form Utama
if (elements.form) {
  elements.form.addEventListener("submit", async (event) => {
    event.preventDefault();
    hideError();

    const sumberAir = document.getElementById("sumberAir").value;
    const lokasi = document.getElementById("lokasi").value.trim();
    const filtrasiNode = document.querySelector('input[name="filtrasi"]:checked');
    const filtrasi = filtrasiNode ? filtrasiNode.value : "";

    if (!sumberAir || !lokasi || !filtrasi) {
      showError("Mohon lengkapi semua data analisis di bawah.");
      return;
    }

    setLoading(true);

    try {
      let dataResult;

      // Hubungi Express Backend lokal (yang menggunakan API Key dari .env)
      try {
        const response = await fetch("/api/analyze", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ sumberAir, lokasi, filtrasi }),
        });

        if (response.ok) {
          dataResult = await response.json();
        } else {
          const errData = await response.json().catch(() => ({}));
          throw new Error(errData.error || "Gagal memproses di backend.");
        }
      } catch (backendError) {
        // Fallback otomatis ke Mode Simulasi Pintar lokal jika server backend mati (Live Server Mode)
        console.warn("Backend tidak terdeteksi atau mati. Berjalan dalam Mode Simulasi Lokal (Offline)...");
        dataResult = getMockAnalysis({ sumberAir, lokasi, filtrasi });
      }

      renderResult(dataResult);
    } catch (error) {
      showError(error?.message || "Terjadi kesalahan saat memproses data.");
    } finally {
      setLoading(false);
    }
  });
}

// Tutup modal secara otomatis dengan mengklik di luar area konten modal
if (elements.insightModal) {
  elements.insightModal.addEventListener("click", (event) => {
    if (event.target === elements.insightModal) closeInsightModal();
  });
}
if (elements.sidePanel) {
  elements.sidePanel.addEventListener("click", (event) => {
    if (event.target === elements.sidePanel) closePanel();
  });
}

// =========================================================================
// INISIALISASI HALAMAN PADA SAAT LOAD pertama kali
// =========================================================================
renderQuickCities();
renderInsights();

// =========================================================================
// KONFIGURASI ANIMASI BACKGROUND PARTIKEL (PARTICLES.JS)
// =========================================================================
if (document.getElementById('particles-js')) {
    particlesJS('particles-js', {
      "particles": {
        "number": { "value": 60, "density": { "enable": true, "value_area": 800 } },
        "color": { "value": "#4df3ff" },
        "shape": { "type": "circle", "stroke": { "width": 0, "color": "#000000" } },
        "opacity": {
          "value": 0.4, "random": true,
          "anim": { "enable": true, "speed": 1, "opacity_min": 0.1, "sync": false }
        },
        "size": {
          "value": 3, "random": true,
          "anim": { "enable": true, "speed": 2, "size_min": 0.1, "sync": false }
        },
        "line_linked": { "enable": true, "distance": 150, "color": "#4df3ff", "opacity": 0.15, "width": 1 },
        "move": {
          "enable": true, "speed": 1.5, "direction": "none", "random": true,
          "straight": false, "out_mode": "out", "bounce": false,
          "attract": { "enable": false, "rotateX": 600, "rotateY": 1200 }
        }
      },
      "interactivity": {
        "detect_on": "canvas",
        "events": {
          "onhover": { "enable": true, "mode": "grab" },
          "onclick": { "enable": true, "mode": "push" },
          "resize": true
        },
        "modes": {
          "grab": { "distance": 140, "line_linked": { "opacity": 0.5 } },
          "push": { "particles_nb": 3 }
        }
      },
      "retina_detect": true
    });
}