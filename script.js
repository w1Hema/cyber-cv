/* ========================================================
   ENG. IBRAHIM FATHY PORTFOLIO - ADVANCED INTERACTIONS
   ======================================================== */

document.addEventListener("DOMContentLoaded", () => {
    
    // 0. DYNAMIC NAVBAR HEIGHT CALCULATION ENGINE
    const navbarElement = document.querySelector('.navbar');
    function updateNavbarHeight() {
        if (navbarElement) {
            const height = navbarElement.offsetHeight;
            document.documentElement.style.setProperty('--navbar-height', `${height}px`);
        }
    }
    // Run immediately and setup multiple trigger events for 100% responsiveness
    updateNavbarHeight();
    window.addEventListener('resize', updateNavbarHeight);
    window.addEventListener('scroll', updateNavbarHeight);
    window.addEventListener('load', updateNavbarHeight);
    // Continuous integrity check to ensure changes in padding/sticky states are tracked
    setInterval(updateNavbarHeight, 300);

    // 0.5 MOBILE SIDEBAR MENU LOGIC
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const navLinksContainer = document.getElementById('nav-links');
    const navLinkItems = document.querySelectorAll('.nav-link-item');

    if (mobileMenuBtn && navLinksContainer) {
        mobileMenuBtn.addEventListener('click', () => {
            navLinksContainer.classList.toggle('active');
            const icon = mobileMenuBtn.querySelector('i');
            if (navLinksContainer.classList.contains('active')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-xmark');
            } else {
                icon.classList.remove('fa-xmark');
                icon.classList.add('fa-bars');
            }
        });

        // Close sidebar when a link is clicked
        navLinkItems.forEach(item => {
            item.addEventListener('click', () => {
                navLinksContainer.classList.remove('active');
                const icon = mobileMenuBtn.querySelector('i');
                if (icon) {
                    icon.classList.remove('fa-xmark');
                    icon.classList.add('fa-bars');
                }
            });
        });
    }

    // 1. PREMIUM WELCOME INTRO MODAL DISMISS
    const welcomeModal = document.getElementById("welcome-modal");
    if (welcomeModal) {
        // Wait 2.5 seconds (matching the CSS loading line) then trigger the slide-up curtain effect
        setTimeout(() => {
            welcomeModal.classList.add("hidden");
        }, 2600);
    }


    // 2. AUTOMATIC ACCENT COLOR CYCLE ENGINE (Every 3 seconds)
    // Morphs colors between: Orange, Purple, Blue, and Red dynamically!
    const colorThemes = [
        { accent: '#ff6600', bright: '#ff8800', glow: 'rgba(255, 102, 0, 0.4)' },  // Neon Orange
        { accent: '#8a2be2', bright: '#a020f0', glow: 'rgba(138, 43, 226, 0.4)' }, // Electric Purple
        { accent: '#0080ff', bright: '#00bfff', glow: 'rgba(0, 128, 255, 0.4)' },  // Deep Cyber Blue
        { accent: '#ff3333', bright: '#ff5555', glow: 'rgba(255, 51, 51, 0.4)' }   // Crimson Red
    ];
    let activeThemeIdx = 0;

    function cycleAccentColors() {
        activeThemeIdx = (activeThemeIdx + 1) % colorThemes.length;
        const theme = colorThemes[activeThemeIdx];
        
        // Dynamically shift CSS custom properties at the document root level
        document.documentElement.style.setProperty('--accent', theme.accent);
        document.documentElement.style.setProperty('--accent-bright', theme.bright);
        document.documentElement.style.setProperty('--accent-glow', theme.glow);
    }
    
    // Trigger every 3 seconds
    setInterval(cycleAccentColors, 3000);


    // 3. INITIALIZE AOS (Animate On Scroll)
    AOS.init({
        once: false,
        mirror: true,
        offset: 50,
        easing: 'ease-out-cubic',
        duration: 1000
    });


    // 4. THEME TOGGLE (Light / Dark Mode)
    const themeToggleBtn = document.getElementById("theme-toggle");
    const body = document.body;
    const themeIcon = themeToggleBtn.querySelector("i");

    const savedTheme = localStorage.getItem("portfolio-theme") || "dark-mode";
    body.className = savedTheme;
    updateThemeIcon(savedTheme);

    themeToggleBtn.addEventListener("click", () => {
        if (body.classList.contains("dark-mode")) {
            body.classList.replace("dark-mode", "light-mode");
            localStorage.setItem("portfolio-theme", "light-mode");
            updateThemeIcon("light-mode");
        } else {
            body.classList.replace("light-mode", "dark-mode");
            localStorage.setItem("portfolio-theme", "dark-mode");
            updateThemeIcon("dark-mode");
        }
    });

    function updateThemeIcon(theme) {
        if (theme === "light-mode") {
            themeIcon.className = "fa-solid fa-sun";
            themeIcon.style.color = "#ff9900";
        } else {
            themeIcon.className = "fa-solid fa-moon";
            themeIcon.style.color = "var(--accent)";
        }
    }


    // 5. SPECIAL NAME TYPEWRITER (English <=> Arabic)
    const nameTypewriter = document.getElementById("name-typewriter");
    const names = [
        "ENG. IBRAHIM FATHY IBRAHIM",
        "المهندس إبراهيم فتحي إبراهيم"
    ];
    let nameIdx = 0;
    let nameCharIdx = 0;
    let nameDeleting = false;

    function animateName() {
        if (!nameTypewriter) return;
        const currentName = names[nameIdx];
        
        // Dynamically adjust font sizes & spacing to give the Arabic name perfect visual freedom
        if (nameIdx === 1) {
            nameTypewriter.style.fontSize = "0.75em"; // Slightly smaller for perfect Arabic rendering
            nameTypewriter.style.letterSpacing = "0px";
            nameTypewriter.style.fontWeight = "900";
        } else {
            nameTypewriter.style.fontSize = "0.95em"; // Fits the English name perfectly
            nameTypewriter.style.letterSpacing = "-2px";
            nameTypewriter.style.fontWeight = "900";
        }

        if (!nameDeleting) {
            nameTypewriter.textContent = currentName.substring(0, nameCharIdx + 1);
            nameCharIdx++;
            if (nameCharIdx === currentName.length) {
                nameDeleting = true;
                setTimeout(animateName, 3500); // Hold full name
                return;
            }
        } else {
            nameTypewriter.textContent = currentName.substring(0, nameCharIdx - 1);
            nameCharIdx--;
            if (nameCharIdx === 0) {
                nameDeleting = false;
                nameIdx = (nameIdx + 1) % names.length;
            }
        }
        setTimeout(animateName, nameDeleting ? 30 : 60);
    }
    animateName();


    // 6. ELEGANT SKILLS TYPEWRITER EFFECT
    const typewriter = document.getElementById("typewriter-txt");
    const phrases = [
        "هندسة وتأمين البرمجيات",
        "تطوير الويب باستخدام TypeScript",
        "الأمن السيبراني المتقدم",
        "تقنيات الذكاء الاصطناعي",
        "أتمتة الأعمال والأنظمة"
    ];
    let phraseIdx = 0;
    let charIdx = 0;
    let deleting = false;

    function typeEffect() {
        if (!typewriter) return;
        const currentPhrase = phrases[phraseIdx];
        
        if (!deleting) {
            typewriter.textContent = currentPhrase.substring(0, charIdx + 1);
            charIdx++;
            if (charIdx === currentPhrase.length) {
                deleting = true;
                setTimeout(typeEffect, 3000); // Long pause
                return;
            }
        } else {
            typewriter.textContent = currentPhrase.substring(0, charIdx - 1);
            charIdx--;
            if (charIdx === 0) {
                deleting = false;
                phraseIdx = (phraseIdx + 1) % phrases.length;
            }
        }
        setTimeout(typeEffect, deleting ? 40 : 80);
    }
    typeEffect();


    // 7. 3D VANILLA JS TILT EFFECT FOR CARDS & IMAGES
    const tiltElements = document.querySelectorAll('.tilt-effect');

    tiltElements.forEach(el => {
        el.addEventListener('mousemove', (e) => {
            const rect = el.getBoundingClientRect();
            const x = e.clientX - rect.left; 
            const y = e.clientY - rect.top;  
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            // Calculate rotation (max 12 degrees)
            const rotateX = ((y - centerY) / centerY) * -12; 
            const rotateY = ((x - centerX) / centerX) * 12;
            
            el.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.03, 1.03, 1.03)`;
        });

        el.addEventListener('mouseleave', () => {
            el.style.transform = `perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)`;
            el.style.transition = 'transform 0.6s cubic-bezier(0.23, 1, 0.32, 1)';
        });

        el.addEventListener('mouseenter', () => {
            el.style.transition = 'none'; // Remove transition for smooth tracking
        });
    });

    
    // 8. NAVBAR STICKY EFFECT
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.style.boxShadow = '0 10px 30px rgba(0,0,0,0.2)';
            navbar.style.padding = '10px 0';
        } else {
            navbar.style.boxShadow = 'none';
            navbar.style.padding = '0';
        }
    });


    // 9. CONTACT FORM SUBMISSION
    const contactForm = document.getElementById("contact-form");
    if(contactForm) {
        contactForm.addEventListener("submit", (e) => {
            e.preventDefault();
            const btn = contactForm.querySelector('button');
            const originalText = btn.innerHTML;
            btn.innerHTML = 'جاري المعالجة والإرسال... <i class="fa-solid fa-circle-notch fa-spin"></i>';
            
            setTimeout(() => {
                btn.innerHTML = 'تم الإرسال بنجاح! <i class="fa-solid fa-check"></i>';
                btn.style.background = '#00e676';
                btn.style.boxShadow = '0 10px 25px rgba(0, 230, 118, 0.5)';
                contactForm.reset();
                
                setTimeout(() => {
                    btn.innerHTML = originalText;
                    btn.style = '';
                }, 3000);
            }, 2000);
        });
    }

    // 10. SMART FAB MENU & AI CHATBOT LOGIC
    const fabMain = document.getElementById("fab-main");
    const fabMenu = document.getElementById("fab-menu");
    const aiChatBtn = document.getElementById("open-ai-chat");
    const aiChatWindow = document.getElementById("ai-chat-window");
    const aiChatClose = document.getElementById("close-ai-chat");
    const aiSendBtn = document.getElementById("ai-send");
    const aiInput = document.getElementById("ai-input");
    const aiMessages = document.getElementById("ai-chat-messages");

    // Toggle FAB Menu
    if (fabMain && fabMenu) {
        fabMain.addEventListener("click", () => {
            fabMain.classList.toggle("active");
            fabMenu.classList.toggle("active");
            if (!fabMenu.classList.contains("active")) {
                aiChatWindow.classList.remove("active"); // close chat if menu closed
            }
        });
    }

    // Toggle AI Chat Window
    if (aiChatBtn && aiChatWindow) {
        aiChatBtn.addEventListener("click", () => {
            aiChatWindow.classList.toggle("active");
            if (aiChatWindow.classList.contains("active")) aiInput.focus();
        });
    }
    if (aiChatClose) {
        aiChatClose.addEventListener("click", () => {
            aiChatWindow.classList.remove("active");
        });
    }

    // AI Chatbot Simple Engine -> Upgraded to REAL GEMINI 2.5 API
    const GEMINI_API_KEY = "AIzaSyD7DXwvsV49K3PIktewsx6LLn8TWsJ2BYU";
    const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`;

    const systemPrompt = `أنت المساعد الذكي "Hema-AI" الخاص بالمهندس إبراهيم فتحي.
مهامك هي الرد على استفسارات الزوار عن المهندس إبراهيم بأسلوب احترافي وودود وقصير جداً.
معلومات عن المهندس إبراهيم:
- هو مهندس برمجيات، خبير أمن سيبراني، ومطور ويب متميز.
- يصمم تطبيقات ويب احترافية، تطبيقات أندرويد و iOS، أنظمة SaaS، برامج محاسبية، وأنظمة أتمتة متقدمة.
- يدمج الذكاء الاصطناعي في مشاريعه ويبني أنظمة Chatbots و AI Agents.
- رقم الهاتف: 01093922945
- رقم الواتساب: 01202060839
- البريد الإلكتروني: ibrahimfathyibrahim39@gmail.com
قواعد هامة:
- اجعل إجابتك قصيرة جداً (لا تتجاوز سطرين أو ثلاثة).
- تحدث بصيغة اللباقة كأنك مدير أعماله.
- إذا لم تفهم السؤال أو كان خارج التخصص، اطلب منه التواصل المباشر مع المهندس.

سؤال الزائر هو: `;

    async function handleChat() {
        const text = aiInput.value.trim();
        if (!text) return;

        // 1. Render User Message
        const userMsg = document.createElement("div");
        userMsg.className = "ai-message user";
        userMsg.innerHTML = `<p>${text}</p>`;
        aiMessages.appendChild(userMsg);
        aiInput.value = "";
        aiMessages.scrollTop = aiMessages.scrollHeight;

        // 2. Render Loading/Typing Indicator
        const botMsg = document.createElement("div");
        botMsg.className = "ai-message bot";
        botMsg.innerHTML = `<p><i class="fa-solid fa-ellipsis fa-fade"></i> جاري التفكير...</p>`;
        aiMessages.appendChild(botMsg);
        aiMessages.scrollTop = aiMessages.scrollHeight;

        // 3. Call Gemini API
        try {
            const response = await fetch(GEMINI_URL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    contents: [{ parts: [{ text: systemPrompt + text }] }]
                })
            });

            const data = await response.json();
            
            let replyText = "عذراً، حدث خطأ في الاتصال بالخادم.";
            
            if (!response.ok) {
                console.error("API Error Response:", data);
                replyText = `خطأ (${response.status}): ${data?.error?.message || "مشكلة في مفتاح الـ API"}. يرجى مراجعة الكونسول.`;
            } else if (data && data.candidates && data.candidates.length > 0) {
                replyText = data.candidates[0].content.parts[0].text;
            }

            // Clean up markdown bold asterisks for clean HTML
            replyText = replyText.replace(/\*\*/g, '');

            botMsg.innerHTML = `<p>${replyText}</p>`;
        } catch (error) {
            console.error("Gemini Fetch Error:", error);
            botMsg.innerHTML = `<p>عذراً، الخادم لا يستجيب. تأكد من اتصال الإنترنت أو مفتاح الـ API. (تفاصيل: ${error.message})</p>`;
        }
        
        aiMessages.scrollTop = aiMessages.scrollHeight;
    }

    if (aiSendBtn) {
        aiSendBtn.addEventListener("click", handleChat);
        aiInput.addEventListener("keypress", (e) => {
            if (e.key === "Enter") handleChat();
        });
    }

});
