// Simpan data pendaftaran di localStorage
let peserta = JSON.parse(localStorage.getItem('peserta')) || [];

// Handle form pendaftaran
document.addEventListener('DOMContentLoaded', function() {
    const formPendaftaran = document.getElementById('formPendaftaran');
    
    if (formPendaftaran) {
        formPendaftaran.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = {
                id: Date.now(),
                nama: document.getElementById('nama').value,
                email: document.getElementById('email').value,
                sekolah: document.getElementById('sekolah').value,
                kelas: document.getElementById('kelas').value,
                mataLomba: document.getElementById('mataLomba').value,
                alamat: document.getElementById('alamat').value,
                noHP: document.getElementById('noHP').value,
                tanggalDaftar: new Date().toLocaleDateString('id-ID')
            };
            
            // Simpan ke localStorage
            peserta.push(formData);
            localStorage.setItem('peserta', JSON.stringify(peserta));
            
            alert('Pendaftaran berhasil! Terima kasih telah mendaftar.');
            formPendaftaran.reset();
        });
    }
    
    // Load data untuk admin page
    loadDataAdmin();
});

function loadDataAdmin() {
    const tableBody = document.getElementById('dataPeserta');
    if (!tableBody) return;
    
    tableBody.innerHTML = '';
    
    if (peserta.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="9" style="text-align: center;">Belum ada data pendaftar</td></tr>';
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
            <td>${p.noHP}</td>
            <td>${p.tanggalDaftar}</td>
            <td>
                <button class="delete-btn" onclick="hapusPeserta(${p.id})">Hapus</button>
            </td>
        `;
        tableBody.appendChild(row);
    });
}

function hapusPeserta(id) {
    if (confirm('Apakah Anda yakin ingin menghapus data ini?')) {
        peserta = peserta.filter(p => p.id !== id);
        localStorage.setItem('peserta', JSON.stringify(peserta));
        loadDataAdmin();
        alert('Data berhasil dihapus!');
    }
}

function exportToExcel() {
    if (peserta.length === 0) {
        alert('Tidak ada data untuk diexport!');
        return;
    }
    
    let csv = 'No,Nama,Email,Sekolah,Kelas,Mata Lomba,No HP,Tanggal Daftar\n';
    
    peserta.forEach((p, index) => {
        csv += `${index + 1},${p.nama},${p.email},${p.sekolah},${p.kelas},${p.mataLomba},${p.noHP},${p.tanggalDaftar}\n`;
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