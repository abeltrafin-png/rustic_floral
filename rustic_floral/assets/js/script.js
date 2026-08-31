/* ============================================================
   WEDDING INVITATION — JAVASCRIPT
   File: script.jss

   Catatan:
   - File ini berisi interaksi website.
   - Tidak membutuhkan database/backend.
   - Data RSVP hanya ditampilkan sebagai simulasi lokal.
   - Jika ingin RSVP benar-benar tersimpan, nantinya bisa
     dihubungkan ke Google Sheets, Firebase, Supabase, dll.
   ============================================================ */

document.addEventListener("DOMContentLoaded", () => {
    /* =========================================================
       KONFIGURASI UTAMA
       Ubah tanggal/waktu di sini jika tanggal pernikahan berubah.

       Format:
       YYYY-MM-DDTHH:mm:ss
       Contoh: 2025-10-25T08:00:00+07:00
       ========================================================= */
    const WEDDING_DATE = "2025-10-25T08:00:00+07:00";

    /* =========================================================
       ELEMENT WEBSITE
       Mengambil elemen HTML yang akan dikontrol JavaScript.
       ========================================================= */
    const openingScreen = document.getElementById("openingScreen");
    const openInvitation = document.getElementById("openInvitation");
    const siteHeader = document.getElementById("siteHeader");

    const menuToggle = document.getElementById("menuToggle");
    const navLinks = document.querySelector(".nav-links");

    const daysEl = document.getElementById("days");
    const hoursEl = document.getElementById("hours");
    const minutesEl = document.getElementById("minutes");
    const secondsEl = document.getElementById("seconds");

    const calendarButton = document.getElementById("calendarButton");

    const rsvpForm = document.getElementById("rsvpForm");
    const formStatus = document.getElementById("formStatus");

    const lightbox = document.getElementById("lightbox");
    const lightboxImage = document.getElementById("lightboxImage");
    const lightboxClose = document.getElementById("lightboxClose");

    /* =========================================================
       1. PEMBUKA UNDANGAN
       Saat tombol ditekan:
       - overlay dibuat transparan
       - body bisa di-scroll
       - navbar ditampilkan
       ========================================================= */
    document.body.classList.add("locked");

    openInvitation.addEventListener("click", () => {
        openingScreen.classList.add("is-hidden");
        document.body.classList.remove("locked");
        siteHeader.classList.add("visible");

        /* Scroll ke bagian hero setelah animasi selesai. */
        setTimeout(() => {
            document.getElementById("hero").scrollIntoView({
                behavior: "smooth",
                block: "start"
            });
        }, 450);
    });

    /* =========================================================
       2. NAVBAR MUNCUL SETELAH USER SCROLL
       Jika halaman sudah dibuka, navbar tetap terlihat.
       ========================================================= */
    window.addEventListener("scroll", () => {
        if (openingScreen.classList.contains("is-hidden")) {
            siteHeader.classList.add("visible");
        }
    }, { passive: true });

    /* =========================================================
       3. MENU MOBILE
       Membuka/menutup menu navigasi pada layar kecil.
       ========================================================= */
    menuToggle.addEventListener("click", () => {
        navLinks.classList.toggle("open");
    });

    /* Setelah menu diklik, menu otomatis ditutup. */
    navLinks.querySelectorAll("a").forEach((link) => {
        link.addEventListener("click", () => {
            navLinks.classList.remove("open");
        });
    });

    /* =========================================================
       4. COUNTDOWN
       Menghitung sisa hari, jam, menit, dan detik.
       ========================================================= */
    function updateCountdown() {
        const target = new Date(WEDDING_DATE).getTime();
        const now = Date.now();
        const difference = target - now;

        /* Jika tanggal sudah lewat, tampilkan 0 semua. */
        if (difference <= 0) {
            daysEl.textContent = "000";
            hoursEl.textContent = "00";
            minutesEl.textContent = "00";
            secondsEl.textContent = "00";
            return;
        }

        const totalSeconds = Math.floor(difference / 1000);

        const days = Math.floor(totalSeconds / 86400);
        const hours = Math.floor((totalSeconds % 86400) / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;

        daysEl.textContent = String(days).padStart(3, "0");
        hoursEl.textContent = String(hours).padStart(2, "0");
        minutesEl.textContent = String(minutes).padStart(2, "0");
        secondsEl.textContent = String(seconds).padStart(2, "0");
    }

    updateCountdown();
    setInterval(updateCountdown, 1000);

    /* =========================================================
       5. SIMPAN KE KALENDER
       Membuat file ICS langsung dari browser.
       File ICS bisa dibuka oleh Google Calendar, Apple Calendar,
       Outlook, dan aplikasi kalender lainnya.
       ========================================================= */
    calendarButton.addEventListener("click", () => {
        const icsContent = [
            "BEGIN:VCALENDAR",
            "VERSION:2.0",
            "PRODID:-//Andi & Sari Wedding//ID",
            "BEGIN:VEVENT",
            "UID:andi-sari-wedding-2025@example.com",
            "DTSTAMP:20250831T000000Z",
            "DTSTART:20251025T010000Z",
            "DTEND:20251025T090000Z",
            "SUMMARY:Pernikahan Andi & Sari",
            "LOCATION:Gedung Serbaguna Cempaka, Jakarta Selatan",
            "DESCRIPTION:Akad Nikah dan Resepsi Pernikahan Andi & Sari.",
            "END:VEVENT",
            "END:VCALENDAR"
        ].join("\r\n");

        const blob = new Blob([icsContent], {
            type: "text/calendar;charset=utf-8"
        });

        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");

        link.href = url;
        link.download = "andi-sari-wedding.ics";
        document.body.appendChild(link);
        link.click();
        link.remove();

        URL.revokeObjectURL(url);
    });

    /* =========================================================
       6. GALERI / LIGHTBOX
       Saat foto diklik, foto dibuka dalam tampilan besar.
       ========================================================= */
    const galleryItems = document.querySelectorAll(".gallery-item");

    galleryItems.forEach((item) => {
        item.addEventListener("click", () => {
            const fullImage = item.dataset.full;

            lightboxImage.src = fullImage;
            lightbox.classList.add("is-open");
            lightbox.setAttribute("aria-hidden", "false");
            document.body.classList.add("locked");
        });
    });

    function closeLightbox() {
        lightbox.classList.remove("is-open");
        lightbox.setAttribute("aria-hidden", "true");
        lightboxImage.src = "";
        document.body.classList.remove("locked");
    }

    lightboxClose.addEventListener("click", closeLightbox);

    /* Klik area gelap di luar foto juga menutup lightbox. */
    lightbox.addEventListener("click", (event) => {
        if (event.target === lightbox) {
            closeLightbox();
        }
    });

    /* Tombol Escape untuk menutup lightbox. */
    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape" && lightbox.classList.contains("is-open")) {
            closeLightbox();
        }
    });

    /* =========================================================
       7. FORM RSVP / UCAPAN
       Karena website ini statis, form tidak mengirim ke server.
       Kita tampilkan notifikasi sukses sebagai simulasi.

       Jika nanti ingin benar-benar menyimpan data, bagian ini
       bisa diganti dengan fetch() ke API/backend.
       ========================================================= */
    rsvpForm.addEventListener("submit", (event) => {
        event.preventDefault();

        const guestName = document.getElementById("guestName").value.trim();
        const attendance = document.getElementById("attendance").value;
        const message = document.getElementById("message").value.trim();

        if (!guestName || !attendance || !message) {
            formStatus.textContent = "Mohon lengkapi semua kolom terlebih dahulu.";
            return;
        }

        /* Simpan sementara di localStorage agar ucapan tidak hilang
           saat halaman di-refresh pada browser yang sama. */
        const rsvpData = {
            name: guestName,
            attendance: attendance,
            message: message,
            submittedAt: new Date().toISOString()
        };

        const previousData = JSON.parse(
            localStorage.getItem("andiSariRSVP") || "[]"
        );

        previousData.push(rsvpData);
        localStorage.setItem("andiSariRSVP", JSON.stringify(previousData));

        formStatus.textContent =
            `Terima kasih, ${guestName}. Ucapan Anda sudah tersimpan di browser ini.`;

        rsvpForm.reset();
    });
});
