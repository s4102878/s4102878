document.addEventListener('DOMContentLoaded', () => {
    // =================================================================
    // PART A: XỬ LÝ LỆNH TRANG LANDING (NÚT ABOUT & OVERLAY POP-UP)
    // =================================================================
    const aboutBtn = document.getElementById('aboutBtn');
    const aboutOverlay = document.getElementById('aboutOverlay');
    const closeOverlayBtn = document.getElementById('closeOverlayBtn');

    // Mở hộp thông tin khi click vào nút ABOUT
    aboutBtn?.addEventListener('click', () => {
        aboutOverlay?.classList.add('active');
    });

    // Đóng hộp thông tin khi click vào dấu X
    closeOverlayBtn?.addEventListener('click', () => {
        aboutOverlay?.classList.remove('active');
    });

    // Click ra vùng nền đen bên ngoài cũng tự đóng hộp
    aboutOverlay?.addEventListener('click', (e) => {
        if (e.target === aboutOverlay) {
            aboutOverlay.classList.remove('active');
        }
    });

    // =================================================================
    // PART B: XỬ LÝ ĐIỀU KHIỂN VIDEO VÀ PHỤ ĐỀ (TRANG HOME)
    // =================================================================
    const video = document.getElementById('mainVideo');
    const playPauseBtn = document.getElementById('playPauseBtn');
    const resumeBtn = document.getElementById('resumeBtn');
    const skipBtn = document.getElementById('skipBtn');
    const seekSlider = document.getElementById('seekSlider');
    const currentTimeText = document.getElementById('currentTime');
    const backBtn = document.getElementById('btn-back');
    const fullscreenBtn = document.getElementById('fullscreenBtn');
    const volumeBtn = document.getElementById('volumeBtn');
    const volumeSlider = document.getElementById('volumeSlider');
    const progressItems = document.querySelectorAll('.progress-bar li');

    const speedSlider = document.getElementById('speedSlider');
    const speedValue = document.getElementById('speedValue');
    const subtitleBox = document.getElementById('subtitleBox');
    const previewBox = document.getElementById('previewBox');

    const stepTimes = [0, 28, 71, 126, 178, 240]; 

    // SVGs Volume
    const iconVolumeOn = `<svg width="38" height="39" viewBox="0 0 38 39" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M20.5293 0V39L8.2557 28.3811H0V10.6189H8.2557L20.5293 0ZM32.4157 5.89115C34.1861 7.67801 35.5905 9.79939 36.5487 12.1342C37.5068 14.4689 38 16.9713 38 19.4985C38 22.0257 37.5068 24.5281 36.5487 26.8629C35.5905 29.1976 34.1861 31.319 32.4157 33.1059L30.3423 31.0129C33.3671 27.9594 35.0664 23.8181 35.0664 19.5C35.0664 15.1819 33.3671 11.0406 30.3423 7.9871L32.4157 5.89115ZM26.3215 12.1731C27.2747 13.1352 28.0309 14.2775 28.5468 15.5347C29.0627 16.7918 29.3283 18.1392 29.3283 19.5C29.3283 20.8608 29.0627 22.2082 28.5468 23.4653C28.0309 24.7225 27.2747 25.8648 26.3215 26.8269L24.248 24.7339C24.929 24.0467 25.4693 23.2307 25.8378 22.3327C26.2064 21.4346 26.3961 20.4721 26.3961 19.5C26.3961 18.5279 26.2064 17.5654 25.8378 16.6673C25.4693 15.7693 24.929 14.9533 24.248 14.2661L26.3215 12.1731Z" fill="#F4F4F4"/></svg>`;
    const iconVolumeOff = `<svg width="39" height="40" viewBox="0 0 39 40" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M21.4375 0.858643V39.8586L9.1639 29.2398H0.908203V11.4775H9.1639L21.4375 0.858643ZM33.3239 6.74979C35.0943 8.53665 36.4987 10.658 37.4569 12.9928C38.415 15.3276 38.9082 17.83 38.9082 20.3572C38.9082 22.8843 38.415 25.3868 37.4569 27.7215C36.4987 30.0563 35.0943 32.1777 33.3239 33.9645L31.2505 31.8715C34.2753 28.8181 35.9746 24.6768 35.9746 20.3586C35.9746 16.0405 34.2753 11.8992 31.2505 8.84574L33.3239 6.74979ZM27.2297 13.0317C28.1829 13.9939 28.9391 15.1361 29.455 16.3933C29.9709 17.6505 30.2365 18.9979 30.2365 20.3586C30.2365 21.7194 29.9709 23.0668 29.455 24.324C28.9391 25.5812 28.1829 26.7234 27.2297 27.6856L25.1562 25.5926C25.8372 24.9053 26.3775 24.0894 26.746 23.1913C27.1146 22.2933 27.3043 21.3307 27.3043 20.3586C30.2365 19.3866 27.1146 18.424 26.746 17.526C26.3775 16.6279 25.8372 15.812 25.1562 15.1247L27.2297 13.0317Z" fill="#F4F4F4"/><path d="M0.908203 0.858643L35.4082 37.3586" stroke="#F4F4F4" stroke-width="2.5"/></svg>`;

    function updateProgressBar() {
        if (!video || !progressItems.length) return;
        const currentTime = video.currentTime;
        let currentStepIndex = 0;
        for (let i = stepTimes.length - 1; i >= 0; i--) {
            if (currentTime >= stepTimes[i]) {
                currentStepIndex = i;
                break;
            }
        }
        progressItems.forEach((li, index) => {
            li.classList.remove('active', 'completed');
            if (index < currentStepIndex) {
                li.classList.add('completed');
            } else if (index === currentStepIndex) {
                li.classList.add('active');
            }
        });
    }

    function updateUI() {
        if (!video || !playPauseBtn) return;
        const btnText = playPauseBtn.querySelector('.btn-text');
        if (video.paused || video.ended) {
            playPauseBtn.classList.remove('playing');
            if (btnText) btnText.textContent = "PLAY";
        } else {
            playPauseBtn.classList.add('playing');
            if (btnText) btnText.textContent = "PAUSE";
        }
    }

    // Chỉ thực thi lệnh video nếu tìm thấy thẻ video trên trang
    if (video) {
        playPauseBtn?.addEventListener('click', () => {
            video.paused ? video.play() : video.pause();
            updateProgressBar();
        });

        resumeBtn?.addEventListener('click', () => { 
            video.currentTime = 0; 
            video.play(); 
            updateUI(); 
            updateProgressBar(); 
        });

        skipBtn?.addEventListener('click', () => {
            video.currentTime = Math.min(video.currentTime + 5, video.duration);
            updateProgressBar();
        });

        if (speedSlider) {
            speedSlider.addEventListener('input', (e) => {
                const val = parseFloat(e.target.value);
                video.playbackRate = val; 
                if (speedValue) speedValue.textContent = val + 'x'; 
            });
        }

        video.addEventListener('play', updateUI);
        video.addEventListener('pause', () => { updateUI(); });
        
        // Sự kiện thời gian và cập nhật phụ đề bằng mảng đối tượng phẳng
        video.addEventListener('timeupdate', () => {
            if (video.duration && seekSlider) {
                seekSlider.value = (video.currentTime / video.duration) * 100;
                let mins = Math.floor(video.currentTime / 60);
                let secs = Math.floor(video.currentTime % 60);
                if (currentTimeText) currentTimeText.textContent = `${mins}:${secs < 10 ? '0' + secs : secs}`;
                
                updateProgressBar();

                if (subtitleBox) {
                    const subtitleData = [
                        { start: 2, end: 14, text: "So for today art time we gonna make this really cool handheld windmill which is really easy to make you don’t need lots of things." },
                        { start: 14, end: 28, text: "We have got some sheet of foam, pair of scissor, glue, a ruler, pen, paper straw and some of these." },
                        { start: 28, end: 42, text: "This is what you start with. We make a 12 and a half centimeter square and we got to this." },
                        { start: 42, end: 50, text: "The next thing we did is fold it in half to make a triangle, press that down and then turn it around to the other way." },
                        { start: 50, end: 61, text: "And what we need to do is to make a hole right in the middle where the crease is met." },
                        { start: 61, end: 71, text: "Then we make some cut about half way long here and each side has some more holes and we end up with something like this." },
                        { start: 71, end: 95, text: "We got a hole in the middle, a hole in every other side. This slit are about half distance from the end to the middle. So we got 5 holes." },
                        { start: 95, end: 106, text: "And here we go, this is what we have to do. You bring this into the middle. So the hole meets the hole. So you can get the pipe cleaner through when finished." },
                        { start: 106, end: 119, text: "The next one - bring it into the middle, match the hole up, stick it down; bring the next one in - stick it down. And the next one - stick it down." },
                        { start: 119, end: 126, text: "We are not quite finished but what you need to do is easily get a pipe cleaner through. So you join all the holes together. " },
                        { start: 126, end: 142, text: "And what we will do if we have some off cut of foam left over. Using a glue stick we press down really hard, and it made an impression." },
                        { start: 142, end: 155, text: "We cut around this circle and we put a hole straight in the middle. We gonna need two of these, I'm gonna have the red one and the blue one. " },
                        { start: 155, end: 168, text: "I’ll take a blue straw, and I got a yellow pipe cleaner, two pieces of circle foam with hole in the middle and here is my windmill sail." },
                        { start: 168, end: 178, text: "You take the pipe cleaner and the straw, and wrap the pipe cleaner around the straw so it’s fairly tight." },
                        { start: 178, end: 192, text: "You pop on one of this all the way till the end. Then you fill the pipe cleaner through the back through the front and you just push that down so that now on the straw ready." },
                        { start: 192, end: 204, text: "The next thing we have to do is put another washer on top, push down like that and we are nearly there." },
                        { start: 204, end: 216, text: "Now what we do is using a pair of scissor, we cut a little of the pipe cleaner off - we don’t need all of that." },
                        { start: 216, end: 226, text: "And all we have to do is wrap it around to make it something that holds it all together." },
                        { start: 226, end: 285, text: "And if it’s not spin around for first then you have to tweak it a little bit of work. But eventually, you end up with what we make a little bit earlier on, which spins around" },
                        { start: 285, end: 296, text: "What little trick tip we found if its isn’t spinning when you start, it might be that you squash it all a bit too tight on the straw, there’s no gap in there and there is no gap in here." },
                        { start: 296, end: 313, text: " So what you want to do is just push it out a little bit, so it’s a little bit more gap. Too much of the gap gonna hits that so you just need to play around but eventually, you got a windmill." }
                    ];

                    const now = parseFloat(video.currentTime);
                    const activeSubtitle = subtitleData.find(item => now >= item.start && now <= item.end);

                    if (activeSubtitle) {
                        subtitleBox.textContent = activeSubtitle.text;
                        subtitleBox.classList.add('show');
                    } else {
                        subtitleBox.classList.remove('show');
                    }
                }
            }
        });

        // Xử lý sự kiện di chuột (Hover) hiện thời gian xem trước trên timeline
        seekSlider?.addEventListener('mousemove', (e) => {
            if (!video.duration || !previewBox) return;
            const rect = seekSlider.getBoundingClientRect();
            const offsetX = e.clientX - rect.left;
            let percentage = offsetX / rect.width;
            
            if (percentage < 0) percentage = 0;
            if (percentage > 1) percentage = 1;
            
            const hoverTime = percentage * video.duration;
            const mins = Math.floor(hoverTime / 60);
            const secs = Math.floor(hoverTime % 60);
            
            previewBox.textContent = `${mins}:${secs < 10 ? '0' + secs : secs}`;
            previewBox.style.left = `${offsetX}px`;
        });

        seekSlider?.addEventListener('input', () => {
            video.currentTime = (seekSlider.value / 100) * video.duration;
            updateProgressBar();
        });

        if (volumeSlider) {
            volumeSlider.addEventListener('input', (e) => {
                const val = e.target.value;
                video.volume = val;
                video.muted = (val == 0);
                volumeBtn.innerHTML = (val == 0) ? iconVolumeOff : iconVolumeOn;
            });
        }

        progressItems.forEach((item, index) => {
            item.addEventListener('click', () => {
                video.currentTime = stepTimes[index];
                video.play();
                updateProgressBar();
            });
        });

        fullscreenBtn?.addEventListener('click', () => {
            if (video.requestFullscreen) video.requestFullscreen();
            else if (video.webkitRequestFullscreen) video.webkitRequestFullscreen();
            else if (video.msRequestFullscreen) video.msRequestFullscreen();
        });

        volumeBtn?.addEventListener('click', () => {
            video.muted = !video.muted;
            volumeBtn.innerHTML = video.muted ? iconVolumeOff : iconVolumeOn;
            if (volumeSlider) volumeSlider.value = video.muted ? 0 : video.volume;
        });
    }

    // Logic nút quay lại Back
    if (backBtn) {
        backBtn.addEventListener('click', () => {
            document.body.style.opacity = '0';
            document.body.style.transition = 'opacity 0.5s ease';
            setTimeout(() => window.location.href = 'index.html', 500);
        });
    }

    // Logic kéo thả (Drag) hộp Transcript tự do khắp màn hình
    const dragTarget = document.getElementById('startTutorialBtn'); 
    if (dragTarget) {
        let isDragging = false;
        let offsetX = 0;
        let offsetY = 0;

        dragTarget.addEventListener('mousedown', (e) => {
            if (e.target.tagName === 'BUTTON' && e.target !== dragTarget) return;

            isDragging = true;
            const rect = dragTarget.getBoundingClientRect();
            offsetX = e.clientX - rect.left;
            offsetY = e.clientY - rect.top;

            dragTarget.style.position = 'fixed';
            dragTarget.style.margin = '0'; 
            dragTarget.style.left = rect.left + 'px';
            dragTarget.style.top = rect.top + 'px';
            dragTarget.style.opacity = '0.9';
        });

        document.addEventListener('mousemove', (e) => {
            if (!isDragging) return;

            let newX = e.clientX - offsetX;
            let newY = e.clientY - offsetY;

            if (newX < 0) newX = 0;
            if (newY < 0) newY = 0;
            if (newX + dragTarget.offsetWidth > window.innerWidth) {
                newX = window.innerWidth - dragTarget.offsetWidth;
            }
            if (newY + dragTarget.offsetHeight > window.innerHeight) {
                newY = window.innerHeight - dragTarget.offsetHeight;
            }

            dragTarget.style.left = newX + 'px';
            dragTarget.style.top = newY + 'px';
        });

        document.addEventListener('mouseup', () => {
            if (isDragging) {
                isDragging = false;
                dragTarget.style.opacity = '1';
            }
        });
    }

    updateProgressBar();
});

