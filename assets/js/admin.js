// ==========================================
// LOGIKA ADMIN DASHBOARD (SIMULASI FRONTEND)
// ==========================================

document.addEventListener('DOMContentLoaded', () => {
    
    // 1. Logika Perpindahan Tab Menu Sidebar
    const navItems = document.querySelectorAll('.sidebar-nav .nav-item');
    const sections = document.querySelectorAll('.admin-section');
    const pageTitle = document.getElementById('page-title');

    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            // Abaikan tombol logout
            if(item.classList.contains('logout-btn')) return;
            
            e.preventDefault();
            
            // Hapus class active dari semua menu dan section
            navItems.forEach(nav => nav.classList.remove('active'));
            sections.forEach(sec => sec.style.display = 'none');
            
            // Tambahkan active ke menu yang diklik
            item.classList.add('active');
            
            // Tampilkan section yang sesuai
            const targetId = item.getAttribute('data-target');
            const targetSection = document.getElementById(targetId);
            if (targetSection) {
                targetSection.style.display = 'block';
            }

            // Ubah Judul Topbar
            pageTitle.innerText = "Manajemen " + item.innerText;
        });
    });

    // 2. Logika Form Tambah Proyek Work Experience
    const btnAddProject = document.getElementById('btn-add-project');
    const formAddProject = document.getElementById('form-add-project');
    const btnCancelProject = document.getElementById('btn-cancel-project');

    if(btnAddProject && formAddProject && btnCancelProject) {
        // Tampilkan Form
        btnAddProject.addEventListener('click', () => {
            formAddProject.style.display = 'block';
            btnAddProject.style.display = 'none'; // Sembunyikan tombol tambah
        });

        // Sembunyikan Form
        btnCancelProject.addEventListener('click', () => {
            formAddProject.style.display = 'none';
            btnAddProject.style.display = 'inline-flex'; // Munculkan kembali tombol
            document.getElementById('projectForm').reset(); // Reset isi form
        });
    }

    // 3. Simulasi Submit Data Proyek ke LocalStorage (Mockup Database)
    const projectForm = document.getElementById('projectForm');
    
    if(projectForm) {
        projectForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Mengambil nilai input
            const name = document.getElementById('projName').value;
            const client = document.getElementById('projClient').value;
            const category = document.getElementById('projCategory').value;
            const year = document.getElementById('projYear').value;
            
            alert(`Simulasi Sukses!\nProyek "${name}" untuk klien ${client} berhasil ditambahkan.\n(Pada tahap produksi, data ini akan dikirim ke Backend API / Database).`);
            
            // Reset form dan tutup
            projectForm.reset();
            formAddProject.style.display = 'none';
            btnAddProject.style.display = 'inline-flex';
        });
    }

});