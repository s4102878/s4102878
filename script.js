// Đợi HTML tải xong rồi mới thực thi
document.addEventListener('DOMContentLoaded', () => {
    const backBtn = document.getElementById('btn-back');

    // Kiểm tra xem nút có tồn tại trên trang này không (để tránh lỗi)
    if (backBtn) {
        backBtn.addEventListener('click', () => {
            // Bạn có thể thêm hiệu ứng Fade out ở đây trước khi chuyển trang
            document.body.style.opacity = '0';
            document.body.style.transition = 'opacity 0.5s ease';

            setTimeout(() => {
                window.location.href = 'index.html';
            }, 500);
        });
    }
});

document.addEventListener('mousemove', (e) => {
    const trail = document.querySelector('.background-trail');
    if (!trail) return;

    // Lấy vị trí chuột
    const mouseX = e.clientX;
    const mouseY = e.clientY;

    // Tính toán độ lệch (càng nhỏ thì chuyển động càng nhẹ)
    const moveX = (mouseX - window.innerWidth / 2) * 0.02;
    const moveY = (mouseY - window.innerHeight / 2) * 0.02;

    // Di chuyển nhẹ dải màu theo chuột
    trail.style.marginLeft = `${moveX}px`;
    trail.style.marginTop = `${moveY}px`;
});

document.addEventListener('DOMContentLoaded', () => {
    const video = document.getElementById('mainVideo');
    const playPauseBtn = document.getElementById('playPauseBtn');
    const resumeBtn = document.getElementById('resumeBtn'); // Khai báo nút Resume
    const seekSlider = document.getElementById('seekSlider');
    const currentTimeText = document.getElementById('currentTime');

    // --- 2. HÀM CẬP NHẬT GIAO DIỆN NÚT (SỬA ĐỂ CHẠY 2 CHIỀU) ---
    function updateUI() {
        if (!video || !playPauseBtn) return;
        const btnText = playPauseBtn.querySelector('.btn-text');

        if (video.paused || video.ended) {
            // Trạng thái DỪNG: Xóa class để CSS hiện Play
            playPauseBtn.classList.remove('playing');
            if (btnText) btnText.textContent = "PLAY";
        } else {
            // Trạng thái CHẠY: Thêm class để CSS hiện Pause
            playPauseBtn.classList.add('playing');
            if (btnText) btnText.textContent = "PAUSE";
        }
    }

    // --- 3. SỰ KIỆN CLICK NÚT PLAY/PAUSE ---
    if (playPauseBtn && video) {
        playPauseBtn.addEventListener('click', () => {
            if (video.paused || video.ended) {
                video.play();
            } else {
                video.pause();
            }
        });
    }

    // --- MỚI: SỰ KIỆN NÚT RESUME (PLAY LẠI TỪ ĐẦU) ---
    if (resumeBtn && video) {
        resumeBtn.addEventListener('click', () => {
            video.currentTime = 0; // Đưa về 0 giây
            video.play();          // Chạy video
            updateUI();            // Cập nhật giao diện nút sang trạng thái đang chạy
        });
    }

    // --- 4. CÁC SỰ KIỆN VIDEO (Đảm bảo đồng bộ 2 chiều) ---
    if (video) {
        // Lắng nghe trực tiếp từ video để cập nhật UI
        video.addEventListener('play', updateUI);
        video.addEventListener('pause', updateUI);
        video.addEventListener('ended', () => {
            updateUI();
            if (seekSlider) seekSlider.value = 0;
        });

        // Thanh timeline
        video.addEventListener('timeupdate', () => {
            if (video.duration && seekSlider) {
                const value = (video.currentTime / video.duration) * 100;
                seekSlider.value = value;

                let mins = Math.floor(video.currentTime / 60);
                let secs = Math.floor(video.currentTime % 60);
                if (secs < 10) secs = '0' + secs;
                if (currentTimeText) currentTimeText.textContent = `${mins}:${secs}`;
            }
        });

        // Tua video
        seekSlider?.addEventListener('input', () => {
            const time = (seekSlider.value / 100) * video.duration;
            video.currentTime = time;
        });
    }
});

