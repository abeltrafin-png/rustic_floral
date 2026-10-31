/* ============================================================
   TEMPLATE-ENGINE.JS — MESIN INJEKSI DATA (DOM HYDRATION)
   ------------------------------------------------------------
   Membaca atribut semantik pada index.html dan menginjeksikan
   data dari WEDDING_CONFIG (config.js).

   ATRIBUT YANG DIDUKUNG
   data-template="path"          → mengganti textContent
   data-template-src="path"      → mengganti atribut src
   data-template-href="path"     → mengganti atribut href
   data-template-alt="path"      → mengganti atribut alt
   data-template-title="path"    → mengganti atribut title
   data-template-content="path" → mengganti atribut content (<meta>)
   data-template-if="path"       → elemen DISEMBUNYIKAN bila data kosong
                                   (null, undefined, "", false, [])

   FALLBACK DATA KOSONG
   Elemen yang nilainya kosong otomatis diberi atribut [hidden],
   sehingga seksi/blok terkait hilang tanpa merusak layout.

   URUTAN MUAT (index.html):
   config.js → template-engine.js → script.js
   ============================================================ */

(function () {
    "use strict";

    /* =========================================================
       1. HELPER
    ========================================================= */

    // Ambil nilai properti bersarang: "mempelai.pria.namaLengkap",
    // juga mendukung indeks array: "cerita.0.judul"
    const getNestedValue = (obj, path) => {
        return path.split(".").reduce((acc, part) => {
            return acc !== null && acc !== undefined ? acc[part] : undefined;
        }, obj);
    };

    // Data dianggap kosong bila null / undefined / false / "" / []
    const isEmpty = (value) => {
        if (value === null || value === undefined || value === false) return true;
        if (typeof value === "string") return value.trim() === "";
        if (Array.isArray(value)) return value.length === 0;
        return false;
    };

    const deepClone = (obj) => JSON.parse(JSON.stringify(obj));

    const pad2 = (n) => String(n).padStart(2, "0");

    /* =========================================================
       2. DATA TURUNAN (dihitung otomatis dari config)
       Supaya nama & tanggal tidak perlu ditulis berulang kali.
    ========================================================= */

    const NAMA_HARI = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
    const NAMA_BULAN = [
        "Januari", "Februari", "Maret", "April", "Mei", "Juni",
        "Juli", "Agustus", "September", "Oktober", "November", "Desember"
    ];

    // "2027-02-21" → { hari, tanggal, bulan, tahun, lengkap, ... }
    function formatTanggal(isoDate) {
        const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(isoDate || "");
        if (!match) return null;

        const [, y, m, d] = match.map(Number);
        const date = new Date(Date.UTC(y, m - 1, d));

        // Tolak tanggal tidak valid (mis. 2027-02-31)
        if (date.getUTCFullYear() !== y || date.getUTCMonth() !== m - 1 || date.getUTCDate() !== d) {
            return null;
        }

        const hari = NAMA_HARI[date.getUTCDay()];
        const bulan = NAMA_BULAN[m - 1];

        return {
            hari,
            hariKapital: hari.toUpperCase(),
            tanggal: String(d),
            bulan,
            bulanKapital: bulan.toUpperCase(),
            tahun: String(y),
            lengkap: `${d} ${bulan} ${y}`,
            lengkapDenganHari: `${hari}, ${d} ${bulan} ${y}`,
            lengkapKapital: `${hari}, ${d} ${bulan} ${y}`.toUpperCase()
        };
    }

    // Konversi waktu lokal + offset → format UTC Google Calendar (YYYYMMDDTHHMMSSZ)
    function keFormatKalenderUTC(tanggal, jam, offset) {
        const time = Date.parse(`${tanggal}T${jam}:00${offset}`);
        if (Number.isNaN(time)) return "";
        return new Date(time).toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
    }

    function turunanAcara(acara, config, nama) {
        if (!acara || !acara.tanggal) return {};

        const tgl = formatTanggal(acara.tanggal);
        const zona = config.acara.zonaWaktu || "";
        const offset = config.acara.offsetUTC || "+07:00";
        const jamTitik = (jam) => String(jam || "").replace(":", ".");

        const waktuParts = [jamTitik(acara.mulai)];
        if (acara.selesai) waktuParts.push(jamTitik(acara.selesai));
        const waktu = `${waktuParts.join(" — ")} ${zona}`.trim();

        const awal = keFormatKalenderUTC(acara.tanggal, acara.mulai || "00:00", offset);
        const akhir = keFormatKalenderUTC(acara.tanggal, acara.selesai || acara.mulai || "00:00", offset);

        // Tanda "/" pada parameter dates dibiarkan apa adanya (format Google Calendar)
        const enc = encodeURIComponent;
        const query = [
            "action=TEMPLATE",
            `text=${enc(`${acara.judul} ${nama.pasangan}`)}`,
            `dates=${awal}/${akhir}`,
            `details=${enc(`${acara.judul} ${nama.pasanganLengkap}`)}`,
            `location=${enc(acara.tempat || "")}`
        ].join("&");

        return {
            tanggalLengkap: tgl ? tgl.lengkapDenganHari : "",
            waktu,
            mulaiISO: `${acara.tanggal}T${acara.mulai || "00:00"}:00${offset}`,
            selesaiISO: `${acara.tanggal}T${acara.selesai || acara.mulai || "00:00"}:00${offset}`,
            kalenderUrl: awal && akhir
                ? `https://calendar.google.com/calendar/render?${query}`
                : ""
        };
    }

    function buatDataTurunan(config) {
        const pria = (config.mempelai && config.mempelai.pria) || {};
        const wanita = (config.mempelai && config.mempelai.wanita) || {};
        const acara = config.acara || {};

        const pPria = pria.namaPanggilan || "";
        const pWanita = wanita.namaPanggilan || "";

        const nama = {
            pasangan: `${pPria} & ${pWanita}`,
            pasanganDan: `${pPria} dan ${pWanita}`,
            pasanganLengkap: `${pria.namaLengkapTanpaGelar || pPria} & ${wanita.namaLengkapTanpaGelar || pWanita}`
        };

        const tanggalUtama = formatTanggal(acara.tanggalUtama);
        if (!tanggalUtama) {
            console.warn("[TemplateEngine] acara.tanggalUtama tidak valid. Gunakan format YYYY-MM-DD.");
        }

        const turunan = {
            nama,
            inisial: {
                pria: pPria.charAt(0).toUpperCase(),
                wanita: pWanita.charAt(0).toUpperCase()
            },
            tanggalUtama: tanggalUtama || {},
            akad: turunanAcara(acara.akad, config, nama),
            resepsi: turunanAcara(acara.resepsi, config, nama)
        };

        // Target countdown: mulai akad; jika tidak ada, tengah malam tanggal utama.
        turunan.countdownTarget =
            turunan.akad.mulaiISO ||
            (acara.tanggalUtama ? `${acara.tanggalUtama}T00:00:00${acara.offsetUTC || "+07:00"}` : "");

        return turunan;
    }

    /* =========================================================
       3. PLACEHOLDER {{path}} DI DALAM STRING CONFIG
       Dijalankan beberapa putaran agar referensi berantai terselesaikan.
    ========================================================= */

    const PLACEHOLDER = /\{\{\s*([\w.]+)\s*\}\}/g;

    function resolvePlaceholders(node, root) {
        if (typeof node === "string") {
            return node.replace(PLACEHOLDER, (full, path) => {
                const value = getNestedValue(root, path);
                if (value === undefined || value === null) {
                    console.warn(`[TemplateEngine] Placeholder tidak ditemukan: ${full}`);
                    return "";
                }
                return String(value);
            });
        }
        if (Array.isArray(node)) {
            return node.map((item) => resolvePlaceholders(item, root));
        }
        if (node && typeof node === "object") {
            const result = {};
            Object.keys(node).forEach((key) => {
                result[key] = resolvePlaceholders(node[key], root);
            });
            return result;
        }
        return node;
    }

    function buildViewData(config) {
        const data = deepClone(config);
        data.turunan = buatDataTurunan(data);

        let resolved = data;
        for (let pass = 0; pass < 3; pass++) {
            resolved = resolvePlaceholders(resolved, resolved);
        }
        return resolved;
    }

    /* =========================================================
       4. HYDRATION DOM
    ========================================================= */

    const ATTRIBUTE_TARGETS = ["src", "href", "alt", "title", "content"];

    // Sembunyikan elemen (kecuali elemen <head>, agar <title>/<meta> tidak terganggu)
    function hideElement(el) {
        if (el.closest("head")) return;
        el.hidden = true;
    }

    function readValue(data, path, el) {
        const value = getNestedValue(data, path);
        if (value === undefined) {
            console.warn(`[TemplateEngine] Path tidak ditemukan di config: "${path}"`, el);
        }
        return value;
    }

    function render(data, root = document) {
        // 1) Kondisi tampil / sembunyi seksi
        root.querySelectorAll("[data-template-if]").forEach((el) => {
            const value = readValue(data, el.getAttribute("data-template-if"), el);
            el.hidden = isEmpty(value);
        });

        // 2) Injeksi teks
        root.querySelectorAll("[data-template]").forEach((el) => {
            const value = readValue(data, el.getAttribute("data-template"), el);
            if (isEmpty(value)) {
                el.textContent = "";
                hideElement(el);
                return;
            }
            el.textContent = String(value);
        });

        // 3) Injeksi atribut (src, href, alt, title, content)
        ATTRIBUTE_TARGETS.forEach((attr) => {
            root.querySelectorAll(`[data-template-${attr}]`).forEach((el) => {
                const value = readValue(data, el.getAttribute(`data-template-${attr}`), el);

                if (isEmpty(value)) {
                    el.removeAttribute(attr);
                    // Tanpa src/href, elemen tidak berguna → sembunyikan
                    if (attr === "src" || attr === "href") hideElement(el);
                    return;
                }

                el.setAttribute(attr, String(value));
            });
        });

        // 4) <source> di dalam <audio>/<video> perlu dimuat ulang
        root.querySelectorAll("source[data-template-src]").forEach((source) => {
            const media = source.parentElement;
            if (media && typeof media.load === "function") media.load();
        });
    }

    /* =========================================================
       5. INISIALISASI
    ========================================================= */

    function init() {
        const config = window.WEDDING_CONFIG;

        if (!config) {
            console.error("[TemplateEngine] WEDDING_CONFIG tidak ditemukan. Pastikan config.js dimuat sebelum template-engine.js.");
            return;
        }

        const data = buildViewData(config);
        window.WEDDING_DATA = data;
        render(data);
        document.dispatchEvent(new CustomEvent("template:ready", { detail: data }));
    }

    window.TemplateEngine = { getNestedValue, isEmpty, buildViewData, render, init };

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", init);
    } else {
        init();
    }
})();
