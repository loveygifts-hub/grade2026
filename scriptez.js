const CORRECT_PASSWORD = "Grad2026";
const bgMusic = document.getElementById('bg-music');
let currentPage = 1;

// حدث الضغط لفتح قفل المجلة
document.getElementById('unlock-btn').addEventListener('click', function() {
    const input = document.getElementById('password-input').value;
    const error = document.getElementById('error-message');
    const lockScreen = document.getElementById('lock-screen');

    if (input === CORRECT_PASSWORD) {
        // تشغيل الموسيقى فوراً استجابةً لتفاعل المستخدم (متوافق مع الهواتف)
        bgMusic.play().catch(e => console.log("المتصفح منع التشغيل التلقائي"));
        
        // حركات التلاشي والصعود لشاشة الحماية
        lockScreen.style.transform = 'translateY(-100%) scale(0.9)';
        lockScreen.style.opacity = '0';
        
        setTimeout(() => {
            lockScreen.style.display = 'none';
            document.getElementById('main-header').style.display = 'block';
            document.getElementById('magazine-wrapper').style.display = 'block';
            document.getElementById('nav-controls').style.display = 'block';
            
            setTimeout(() => {
                document.getElementById('main-header').style.opacity = '1';
                document.getElementById('magazine-wrapper').style.opacity = '1';
                document.getElementById('nav-controls').style.opacity = '1';
            }, 50);

            // جلب وعرض البيانات المخزنة مسبقاً
            loadGallery();
            loadMessages();
        }, 1000);
    } else {
        error.style.display = 'block';
    }
});

// تشغيل وإيقاف الصوت
document.getElementById('music-toggle-btn').addEventListener('click', function() {
    if (bgMusic.paused) { bgMusic.play(); } else { bgMusic.pause(); }
});

// منطق التنقل ثلاثي الأبعاد بين الصفحات
document.getElementById('next-btn').addEventListener('click', function() {
    if (currentPage === 1) {
        document.getElementById('page1').classList.add('flipped');
        document.getElementById('page2').classList.add('flipped');
        
        document.getElementById('page1').style.zIndex = '1';
        document.getElementById('page2').style.zIndex = '1';
        document.getElementById('page3').style.zIndex = '4';
        document.getElementById('page4').style.zIndex = '3';
        currentPage = 2;
    }
});

document.getElementById('prev-btn').addEventListener('click', function() {
    if (currentPage === 2) {
        document.getElementById('page1').classList.remove('flipped');
        document.getElementById('page2').classList.remove('flipped');
        
        document.getElementById('page1').style.zIndex = '4';
        document.getElementById('page2').style.zIndex = '3';
        document.getElementById('page3').style.zIndex = '2';
        document.getElementById('page4').style.zIndex = '1';
        currentPage = 1;
    }
});

/* --- إدارة ألبوم الصور (LocalStorage) --- */
document.getElementById('image-input').addEventListener('change', function() {
    const file = this.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            let images = JSON.parse(localStorage.getItem('mag_images')) || [];
            images.push(e.target.result);
            localStorage.setItem('mag_images', JSON.stringify(images));
            loadGallery();
        };
        reader.readAsDataURL(file);
    }
});

function loadGallery() {
    const container = document.getElementById('gallery-container');
    container.innerHTML = '';
    let images = JSON.parse(localStorage.getItem('mag_images')) || [];
    
    for(let i=0; i<4; i++) {
        if(images[i]) {
            container.innerHTML += `
                <div style="position:relative;">
                    <img src="${images[i]}" alt="ذكريات">
                    <button class="del-btn" onclick="deleteImage(${i})">×</button>
                </div>`;
        } else {
            container.innerHTML += `<div style="border:2px dashed #cbd5e0; height:120px; border-radius:5px; display:flex; align-items:center; justify-content:center; color:#a0aec0; font-size:12px;">مساحة خالية</div>`;
        }
    }
}

function deleteImage(index) {
    let images = JSON.parse(localStorage.getItem('mag_images')) || [];
    images.splice(index, 1);
    localStorage.setItem('mag_images', JSON.stringify(images));
    loadGallery();
}

/* --- إدارة سجل التهاني والكلمات (LocalStorage) --- */
document.getElementById('submit-wish-btn').addEventListener('click', function() {
    const nameInput = document.getElementById('sender-name');
    const textInput = document.getElementById('message-text');
    
    if (nameInput.value.trim() === '' || textInput.value.trim() === '') {
        alert('فضلاً، اكتب اسمك ونص الكلمة لتوثيقها بالمجلة ✨');
        return;
    }
    
    const newMessage = { sender: nameInput.value, text: textInput.value };
    let messages = JSON.parse(localStorage.getItem('mag_messages')) || [];
    messages.push(newMessage);
    localStorage.setItem('mag_messages', JSON.stringify(messages));
    
    nameInput.value = ''; 
    textInput.value = '';
    loadMessages();
});

function loadMessages() {
    const container = document.getElementById('wishes-container');
    container.innerHTML = '';
    let messages = JSON.parse(localStorage.getItem('mag_messages')) || [];
    
    if(messages.length === 0) {
        container.innerHTML = `<p style="text-align:center; color:#a0aec0; font-size:13px; margin-top:5px;">سجل الكلمات فارغ.. اكتب تهنئتك الآن لتظهر بالصفحة المقابلة!</p>`;
        return;
    }
    
    messages.forEach((msg, index) => {
        container.innerHTML += `
            <div class="wish-card">
                <h5>من: ${msg.sender} ✨</h5>
                <p>${msg.text}</p>
                <button class="del-btn" onclick="deleteMessage(${index})">×</button>
            </div>`;
    });
}

function deleteMessage(index) {
    let messages = JSON.parse(localStorage.getItem('mag_messages')) || [];
    messages.splice(index, 1);
    localStorage.setItem('mag_messages', JSON.stringify(messages));
    loadMessages();
}