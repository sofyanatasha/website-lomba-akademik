// Data lomba yang tersedia
const daftarLomba = {
    'matematika-smp': { nama: 'Matematika Tingkat SMP', biaya: 50000 },
    'matematika-sma': { nama: 'Matematika Tingkat SMA', biaya: 75000 },
    'kimia-smp': { nama: 'Kimia Tingkat SMP', biaya: 50000 },
    'kimia-sma': { nama: 'Kimia Tingkat SMA', biaya: 75000 },
    'biologi-smp': { nama: 'Biologi Tingkat SMP', biaya: 50000 },
    'biologi-sma': { nama: 'Biologi Tingkat SMA', biaya: 75000 },
    'fisika-smp': { nama: 'Fisika Tingkat SMP', biaya: 50000 },
    'fisika-sma': { nama: 'Fisika Tingkat SMA', biaya: 75000 },
    'coding': { nama: 'Coding & Programming', biaya: 100000 },
    'komprehensif': { nama: 'Olimpiade Sains Komprehensif', biaya: 150000 }
};

// Simpan data pendaftaran di localStorage
let peserta = JSON.parse(localStorage.getItem('peserta')) || [];

// Handle form pendaftaran dengan logic lomba
document.addEventListener('DOMContentLoaded', function() {
    const formPendaftaran = document.getElementById('formPendaftaran');
    const selectLomba = document.getElementById('mataLomba');
    const lombaInfo = document.getElementById('lombaInfo');
    const namaLombaSpan = document.getElementById('namaLomba');
    const biayaLombaSpan = document.getElementById('biayaLomba');
    
    // Handle parameter URL untuk pre-select lomba
    const urlParams = new URLSearchParams(window.location.search);
    const lombaFromUrl = urlParams.get('lomba');
    
    if (lombaFromUrl && daftarLomba[lombaFromUrl]) {
        if (selectLomba) {
            selectLomba.value = lombaFromUrl;
            updateLombaInfo(lombaFromUrl);
        }
    }
    
    // Event listener untuk perubahan pilihan lomba
    if (selectLomba) {
        selectLomba.addEventListener('change', function() {
            if (this.value) {
                updateLombaInfo(this.value);
            } else {
                lombaInfo.style.display = 'none';
            }
        });
    }
    
    function updateLombaInfo(jenisLomba) {
        const lomba = daftarLomba[jenisLomba];
        if (lomba) {
            namaLombaSpan.textContent = lomba.nama;
            biayaLombaSpan.textContent = `Rp ${lomba.biaya.toLocaleString('id-ID')}`;
            lombaInfo.style.display = 'block';
        }
    }
    
    if (formPendaftaran) {
        formPendaftaran.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const jenisLomba = document.getElementById('mataLomba').value;
            const lomba = daftarLomba[jenisLomba];
            
            if (!lomba) {
                alert('Silakan pilih jenis lomba terlebih dahulu!');
                return;
            }
            
            const formData = {
                id: Date.now(),
                nama: document.getElementById('nama').value,
                email: document.getElementById('email').value,
                sekolah: document.getElementById('sekolah').value,
                kelas: document.getElementById('kelas').value,
                mataLomba: lomba.nama,
                jenisLomba: jenisLomba,
                biaya: lomba.biaya,
                alamat: document.getElementById('alamat').value,
                noHP: document.getElementById('noHP').value,
                tanggalDaftar: new Date().toLocaleDateString('id-ID'),
                status: 'Menunggu Verifikasi'
            };
            
            // Simpan ke localStorage
            peserta.push(formData);
            localStorage.setItem('peserta', JSON.stringify(peserta));
            
            alert(`Pendaftaran ${lomba.nama} berhasil!\nBiaya: Rp ${lomba.biaya.toLocaleString('id-ID')}\nSilakan lakukan pembayaran dan upload bukti.`);
            formPendaftaran.reset();
            lombaInfo.style.display = 'none';
            
            // Redirect ke halaman beranda setelah 2 detik
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 2000);
        });
    }
    
    loadDataAdmin();
});

// Fungsi untuk load data admin
function loadDataAdmin() {
    const tableBody = document.getElementById('dataPeserta');
    if (!tableBody) return;
    
    tableBody.innerHTML = '';
    
    if (peserta.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="11" style="text-align: center;">Belum ada data pendaftar</td></tr>';
        return;
    }
    
    peserta.forEach((p, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${index + 1}</td>
            <td>${p.nama}</td>
            <td>${p.email}</td>
            <td>${p.sekolah}</td>
            <td>${p.kelas}</td>
            <td>${p.mataLomba}</td>
            <td>Rp ${p.biaya ? p.biaya.toLocaleString('id-ID') : '-'}</td>
            <td>${p.noHP}</td>
            <td>${p.tanggalDaftar}</td>
            <td>${p.status || 'Terdaftar'}</td>
            <td>
                <button class="delete-btn" onclick="hapusPeserta(${p.id})">Hapus</button>
            </td>
        `;
        tableBody.appendChild(row);
    });
}

// Fungsi untuk menghapus peserta
function hapusPeserta(id) {
    if (confirm('Apakah Anda yakin ingin menghapus data ini?')) {
        peserta = peserta.filter(p => p.id !== id);
        localStorage.setItem('peserta', JSON.stringify(peserta));
        loadDataAdmin();
        alert('Data berhasil dihapus!');
    }
}

// Fungsi untuk export ke Excel
function exportToExcel() {
    if (peserta.length === 0) {
        alert('Tidak ada data untuk diexport!');
        return;
    }
    
    let csv = 'No,Nama,Email,Sekolah,Kelas,Mata Lomba,Biaya,No HP,Tanggal Daftar,Status\n';
    
    peserta.forEach((p, index) => {
        csv += `${index + 1},${p.nama},${p.email},${p.sekolah},${p.kelas},${p.mataLomba},${p.biaya},${p.noHP},${p.tanggalDaftar},${p.status || 'Terdaftar'}\n`;
    });
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('hidden', '');
    a.setAttribute('href', url);
    a.setAttribute('download', 'data_peserta_lomba.csv');
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    alert('Data berhasil diexport!');
}

// Fungsi untuk membuka modal materi pembelajaran
function bukaMateri(jenis) {
    const modal = document.getElementById('modalMateri');
    const modalTitle = document.getElementById('modalTitle');
    const modalContent = document.getElementById('modalContent');
    
    if (jenis === 'matematika') {
        modalTitle.textContent = 'Materi dan Latihan Matematika';
        modalContent.innerHTML = `
            <h4>Sumber Belajar Matematika:</h4>
            <div class="materi-links">
                <a href="https://www.wardayacollege.com/bank-soal/olimpiade-sains-smp-biologi-fisika-kimia-summer-camp-persiapan-osn-2018/" 
                   target="_blank" class="materi-link">
                    <strong>Bank Soal Olimpiade</strong>
                    <p>Kumpulan soal matematika olimpiade</p>
                </a>
                <a href="https://online.anyflip.com/pewlg/ejjt/mobile/index.html" 
                   target="_blank" class="materi-link">
                    <strong>E-Book Matematika</strong>
                    <p>Materi pembelajaran interaktif</p>
                </a>
            </div>
            <div style="margin-top: 2rem;">
                <h4>Tips Belajar Matematika:</h4>
                <ul>
                    <li>Pelajari konsep dasar terlebih dahulu</li>
                    <li>Latihan soal secara bertahap</li>
                    <li>Pahami pola penyelesaian masalah</li>
                    <li>Gunakan waktu belajar yang konsisten</li>
                </ul>
            </div>
        `;
    } else if (jenis === 'sains') {
        modalTitle.textContent = 'Materi dan Latihan Sains';
        modalContent.innerHTML = `
            <h4>Sumber Belajar Sains (Fisika, Kimia, Biologi):</h4>
            <div class="materi-links">
                <a href="https://www.wardayacollege.com/bank-soal/olimpiade-sains-smp-biologi-fisika-kimia-summer-camp-persiapan-osn-2018/" 
                   target="_blank" class="materi-link">
                    <strong>Bank Soal Sains Olimpiade</strong>
                    <p>Soal fisika, kimia, dan biologi</p>
                </a>
                <a href="https://online.anyflip.com/pewlg/ejjt/mobile/index.html" 
                   target="_blank" class="materi-link">
                    <strong>E-Book Sains Lengkap</strong>
                    <p>Materi sains terintegrasi</p>
                </a>
            </div>
            <div style="margin-top: 2rem;">
                <h4>Tips Belajar Sains:</h4>
                <ul>
                    <li>Pahami konsep melalui eksperimen</li>
                    <li>Hubungkan teori dengan kehidupan sehari-hari</li>
                    <li>Buat catatan konsep penting</li>
                    <li>Latihan soal aplikatif</li>
                </ul>
            </div>
        `;
    }
    
    modal.style.display = 'block';
}

// Fungsi untuk menutup modal
function tutupModal() {
    document.getElementById('modalMateri').style.display = 'none';
}

// Tutup modal ketika klik di luar konten
window.onclick = function(event) {
    const modal = document.getElementById('modalMateri');
    if (event.target === modal) {
        modal.style.display = 'none';
    }
}