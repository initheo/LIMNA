const state = {
  selectedInsight: null,
  activePanel: null,
};

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

const loadingPhrases = [
  "Menghubungkan ke Limna AI engine...",
  "Menganalisis data hidrologis lokal di wilayah Anda...",
  "Memetakan potensi kontaminasi mikropartikel...",
  "Menghitung efektivitas filtrasi yang dipakai...",
  "Merumuskan rekomendasi mitigasi personal...",
];

// Menggunakan data array kota-kota utama terkait
const quickCities = ["Surabaya", "Gresik", "Jakarta", "Bandung", "Medan", "Makassar", "Yogyakarta"];

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
    title: "Hubungi Dukungan",
    content: [
      "Email Dukungan: info@limna.ai / support@limna.ai",
      "Kemitraan Sains: research@limna.ai",
      "Kami berkomitmen untuk mendemokratisasi akses data polutan lingkungan demi kesehatan masyarakat.",
    ],
  },
};

let loadingTimer = null;

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

function getRiskClass(color) {
  if (color === "green") return "risk-green";
  if (color === "yellow") return "risk-yellow";
  return "risk-red";
}

function scrollToChecker() {
  const checkerSection = document.getElementById("checker-section");
  if (checkerSection) {
    checkerSection.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}

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

function resetForm() {
  if (!elements.form) return;
  elements.form.reset();
  if (elements.resultSection) elements.resultSection.classList.add("hidden");
  if (elements.statusBox) elements.statusBox.classList.add("hidden");
  hideError();
  document.querySelectorAll(".quick-city-wrap button").forEach((item) => item.classList.remove("active"));
}

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

// Event Listeners Dasar
if (elements.scrollTopBtn) {
  window.addEventListener('scroll', () => {
    if (window.scrollY > 300) elements.scrollTopBtn.classList.remove('hidden');
    else elements.scrollTopBtn.classList.add('hidden');
  });
  elements.scrollTopBtn.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
}

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

// Submit Form API
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
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sumberAir, lokasi, filtrasi }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Terjadi kesalahan pada server AI.");
      }

      renderResult(data);
    } catch (error) {
      showError(error?.message || "Gagal menghubungi mesin AI. Periksa koneksi atau pastikan server berjalan.");
    } finally {
      setLoading(false);
    }
  });
}

// Tutup modal dengan mengklik di luar kontennya
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

// Inisialisasi awal
renderQuickCities();
renderInsights();

// =========================================================================
// KONFIGURASI ANIMASI BACKGROUND (PARTICLES.JS)
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