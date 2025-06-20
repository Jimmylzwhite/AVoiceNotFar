// 游戏主页面交互逻辑
document.addEventListener('DOMContentLoaded', function() {
    // 获取所有标题图片元素和主角
    const titleImages = document.querySelectorAll('.title-img');
    const mainCharacter = document.querySelector('.main-character');
    let isGenerating = false;
    let generationInterval;
    let transitionTimer = null;
    
    // 为标题图片添加点击效果
    titleImages.forEach((img, index) => {
        img.addEventListener('click', function() {
            // 添加点击动画
            this.style.transform = 'scale(1.2) rotate(5deg)';
            setTimeout(() => {
                this.style.transform = 'scale(1)';
            }, 300);
            
            // 在字母上生成几朵花
            generateFlowersOnLetter(this);
            
            // 开始生成植物
            startPlantGeneration();
            
            // 播放音效（如果需要的话）
            playClickSound();
        });
        
        // 添加鼠标悬停效果
        img.addEventListener('mouseenter', function() {
            this.style.filter = 'brightness(0) saturate(100%) invert(85%) sepia(8%) saturate(1234%) hue-rotate(64deg) brightness(110%) contrast(89%) drop-shadow(0 0 10px #D5E6D4)';
        });
        
        img.addEventListener('mouseleave', function() {
            this.style.filter = 'brightness(0) saturate(100%) invert(85%) sepia(8%) saturate(1234%) hue-rotate(64deg) brightness(95%) contrast(89%)';
        });
    });
    
    // 在字母上生成花朵
    function generateFlowersOnLetter(letterElement) {
        const letterRect = letterElement.getBoundingClientRect();
        const containerRect = document.querySelector('.container').getBoundingClientRect();
        
        // 在字母周围生成3-5朵花
        const flowerCount = Math.floor(Math.random() * 3) + 3; // 3-5朵
        
        for (let i = 0; i < flowerCount; i++) {
            const flowerImg = document.createElement('img');
            
            // 随机选择1.png或2.png
            const flowerType = Math.random() > 0.5 ? '1.png' : '2.png';
            flowerImg.src = flowerType;
            flowerImg.alt = 'letter flower';
            flowerImg.className = 'letter-flower';
            
            // 在字母周围的随机位置
            const offsetX = (Math.random() - 0.5) * letterRect.width * 1.5; // 字母宽度1.5倍范围内
            const offsetY = (Math.random() - 0.5) * letterRect.height * 1.5; // 字母高度1.5倍范围内
            
            // 计算相对于容器的位置
            const letterCenterX = ((letterRect.left + letterRect.width / 2 - containerRect.left) / containerRect.width) * 100;
            const letterCenterY = ((letterRect.top + letterRect.height / 2 - containerRect.top) / containerRect.height) * 100;
            
            const flowerX = letterCenterX + (offsetX / containerRect.width) * 100;
            const flowerY = letterCenterY + (offsetY / containerRect.height) * 100;
            
            // 字母上的花朵稍小一些
            const flowerSize = Math.random() * 25 + 20;
            
            flowerImg.style.cssText = `
                position: absolute;
                left: ${flowerX}%;
                top: ${flowerY}%;
                height: ${flowerSize}px;
                width: auto;
                transform: scale(0);
                filter: brightness(0) saturate(100%) invert(85%) sepia(8%) saturate(1234%) hue-rotate(64deg) brightness(95%) contrast(89%);
                opacity: 0;
                transition: all 0.5s ease;
                pointer-events: none;
                z-index: 15;
            `;
            
            document.querySelector('.container').appendChild(flowerImg);
            
            // 延迟出现，创造花朵从字母长出的效果
            setTimeout(() => {
                flowerImg.style.transform = 'scale(1)';
                flowerImg.style.opacity = '0.8';
            }, i * 150 + 100); // 每朵花间隔150ms出现
        }
    }
    
    // 植物生成函数
    function startPlantGeneration() {
        if (isGenerating) {
            // 如果已经在生成，先停止
            stopPlantGeneration();
        }
        
        isGenerating = true;
        
        generationInterval = setInterval(() => {
            // 每200ms生成12朵花
            for (let i = 0; i < 12; i++) {
                generatePlant();
            }
        }, 200);
    }
    
    // 停止植物生成
    function stopPlantGeneration() {
        if (generationInterval) {
            clearInterval(generationInterval);
            generationInterval = null;
        }
        isGenerating = false;
    }
    
    // 生成单个植物
    function generatePlant() {
        const plantContainer = document.querySelector('.character-section');
        const plantImg = document.createElement('img');
        
        // 随机选择1.png或2.png
        const plantType = Math.random() > 0.5 ? '1.png' : '2.png';
        plantImg.src = plantType;
        plantImg.alt = 'generated plant';
        
        // 设置植物样式
        plantImg.className = 'generated-plant';
        
        // 获取主角位置信息以避免覆盖
        const characterRect = mainCharacter.getBoundingClientRect();
        const containerRect = plantContainer.getBoundingClientRect();
        
        let randomX, randomY;
        let attempts = 0;
        
        // 尝试生成不覆盖主角的位置，最多尝试10次
        do {
            randomX = Math.random() * 98 + 1; // 1% - 99%，最大化生成范围
            randomY = Math.random() * 94 + 3; // 3% - 97%，最大化生成范围
            attempts++;
        } while (attempts < 10 && isNearCharacter(randomX, randomY, containerRect, characterRect));
        
        // 根据垂直位置调整花朵大小：越下方越大，越上方越小
        // randomY 范围是3-97，将其映射到大小范围
        const sizeMultiplier = (randomY - 3) / 94; // 0到1的比例
        const minSize = 20; // 最小尺寸
        const maxSize = 80; // 最大尺寸
        const randomSize = minSize + sizeMultiplier * (maxSize - minSize);
        
        plantImg.style.cssText = `
            position: absolute;
            left: ${randomX}%;
            top: ${randomY}%;
            height: ${randomSize}px;
            width: auto;
            transform: scale(0);
            filter: brightness(0) saturate(100%) invert(85%) sepia(8%) saturate(1234%) hue-rotate(64deg) brightness(95%) contrast(89%);
            opacity: 0;
            transition: all 0.5s ease;
            pointer-events: none;
            z-index: 1;
        `;
        
        plantContainer.appendChild(plantImg);
        
        // 立即触发出现动画
        setTimeout(() => {
            plantImg.style.transform = `scale(1)`;
            plantImg.style.opacity = '0.8';
        }, 10);
    }
    
    // 检查位置是否接近主角
    function isNearCharacter(plantX, plantY, containerRect, characterRect) {
        const plantAbsoluteX = containerRect.left + (plantX / 100) * containerRect.width;
        const plantAbsoluteY = containerRect.top + (plantY / 100) * containerRect.height;
        
        const characterCenterX = characterRect.left + characterRect.width / 2;
        const characterCenterY = characterRect.top + characterRect.height / 2;
        
        const distance = Math.sqrt(
            Math.pow(plantAbsoluteX - characterCenterX, 2) + 
            Math.pow(plantAbsoluteY - characterCenterY, 2)
        );
        
        // 如果距离小于120px，认为太接近主角
        return distance < 120;
    }
    
    // 主角点击交互
    mainCharacter.addEventListener('click', function() {
        // 主角被点击时开始持续发光，保持浮动
        this.style.filter = 'brightness(0) saturate(100%) invert(85%) sepia(8%) saturate(1234%) hue-rotate(64deg) brightness(95%) contrast(89%)'; // 先设置为正常状态
        this.style.animation = 'float 2s ease-in-out infinite, glow-transition 2s ease-out forwards'; // 同时保持浮动和发光过渡
        
        // 2秒后切换到持续发光动画
        setTimeout(() => {
            this.style.animation = 'float 2s ease-in-out infinite, glow 1.5s ease-in-out infinite alternate';
        }, 2000);
        
        // 停止花朵生成
        stopPlantGeneration();
        
        // 让所有花朵飞散
        scatterAllFlowers();
        
        // 标题文字也有反应
        titleImages.forEach((img, index) => {
            setTimeout(() => {
                img.style.transform = 'scale(1.1) rotate(5deg)';
                setTimeout(() => {
                    img.style.transform = 'scale(1)';
                }, 300);
            }, index * 100);
        });
        
        // 5秒后自动切换到第二面
        if (transitionTimer) {
            clearTimeout(transitionTimer);
        }
        transitionTimer = setTimeout(() => {
            transitionToSecondScene();
        }, 5000);
    });
    
    // 切换到第二面的函数
    function transitionToSecondScene() {
        // 停止第一面的所有活动
        console.log('清理第一面活动');
        
        // 停止植物生成
        stopPlantGeneration();
        
        // 清除过渡计时器
        if (transitionTimer) {
            clearTimeout(transitionTimer);
            transitionTimer = null;
        }
        
        // 停止所有音频（除了背景音乐）
        const allAudios = document.querySelectorAll('audio');
        allAudios.forEach(audio => {
            if (audio !== backgroundMusic) { // 不停止背景音乐
                try {
                    audio.pause();
                    audio.currentTime = 0;
                } catch (e) {
                    console.log('停止音频失败:', e);
                }
            }
        });
        
        const container = document.querySelector('.container');
        
        // 添加下滑切换动画
        container.style.transition = 'transform 1.5s ease-in-out';
        container.style.transform = 'translateY(-100vh)';
        
        // 1.5秒后创建第二面
        setTimeout(() => {
            createSecondScene();
        }, 1500);
    }
    
    // 创建第二面
    function createSecondScene() {
        // 清除第一面内容
        document.body.innerHTML = '';
        
        // 创建第二面的HTML结构
        const secondSceneHTML = `
            <div class="scene-two-container">
                <div class="background-board">
                    <img src="3/背景板.png" alt="背景板" class="background-img">
                </div>
                
                <div class="character-area">
                    <img src="6.png" alt="主角" class="character-second">
                </div>
                
                <div class="text-area">
                    <img src="3/韩语1.png" alt="韩语1" class="korean-1">
                    <img src="3/韩语2.png" alt="韩语2" class="korean-2">
                    <img src="3/找到钥匙.png" alt="找到钥匙" class="find-key-text">
                </div>
                
                <div class="key-area">
                    <img src="3/key.png" alt="钥匙" class="key-icon">
                </div>
            </div>
        `;
        
        document.body.innerHTML = secondSceneHTML;
        
        // 添加第二面的CSS样式
        addSecondSceneStyles();
        
        // 初始化第二面的功能
        initSecondScene();
    }
    
    // 初始化第二面
    function initSecondScene() {
        // 初始化韩语1的交互
        initKorean1Interaction();
        
        // 初始化角色移动系统并保存清理函数
        window.secondSceneCleanup = initCharacterMovement();
        
        // 添加第二面的跳转按钮
        addSceneSkipButton(2, transitionToThirdScene);
    }
    
    // 初始化韩语1的交互
    function initKorean1Interaction() {
        const korean1 = document.querySelector('.korean-1');
        let hasClicked = false;
        let shakeTimeout = null;

        // 创建音频对象
        const audio = new Audio('3/1MUSIC.mp3');

        // 点击事件处理
        korean1.addEventListener('click', () => {
            hasClicked = true;
            // 移除剧烈晃动动画
            korean1.classList.remove('intense-shake');
            // 播放音频
            audio.play().catch(error => {
                console.log('音频播放失败:', error);
            });
        });

        // 7秒后如果还没点击，开始剧烈晃动
        shakeTimeout = setTimeout(() => {
            if (!hasClicked) {
                korean1.classList.add('intense-shake');
            }
        }, 7000);
    }
    
    // 添加第二面的CSS样式
    function addSecondSceneStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .scene-two-container {
                width: 100vw;
                height: 100vh;
                background-color: #322030;
                position: relative;
                overflow: hidden;
            }
            
            .background-board {
                position: absolute;
                top: 0;
                left: 0;
                width: 100vw;
                height: 100vh;
                z-index: 1;
            }
            
            .background-img {
                width: 100vw;
                height: 100vh;
                object-fit: cover;
            }
            
            .character-area {
                position: absolute;
                left: 5%;
                bottom: 5%;
                z-index: 10;
            }
            
            .character-second {
                height: 100px;
                width: auto;
                filter: brightness(0) saturate(100%) invert(85%) sepia(8%) saturate(1234%) hue-rotate(64deg) brightness(95%) contrast(89%);
                animation: float 2s ease-in-out infinite;
                transform-origin: bottom center;
            }

            .character-second.walking {
                animation: float 2s ease-in-out infinite, walk 0.6s ease-in-out infinite;
            }

            @keyframes walk {
                0%, 100% {
                    transform: rotate(-2deg);
                }
                50% {
                    transform: rotate(2deg);
                }
            }
            
            .text-area {
                position: absolute;
                left: 5%;
                bottom: 25%;
                z-index: 5;
                display: flex;
                flex-direction: column;
                gap: 10px;
            }
            
            .korean-1, .korean-2, .find-key-text {
                height: 35px;
                width: auto;
                filter: brightness(0) saturate(100%) invert(85%) sepia(8%) saturate(1234%) hue-rotate(64deg) brightness(95%) contrast(89%);
                display: block;
            }
            
            .key-area {
                position: absolute;
                right: 5%;
                top: 5%;
                z-index: 10;
            }
            
            .key-icon {
                height: 80px;
                width: auto;
                filter: brightness(0) saturate(100%) invert(85%) sepia(8%) saturate(1234%) hue-rotate(64deg) brightness(95%) contrast(89%);
                animation: float 2.5s ease-in-out infinite;
            }
            
            .korean-1 {
                height: 35px;
                width: auto;
                filter: brightness(0) saturate(100%) invert(85%) sepia(8%) saturate(1234%) hue-rotate(64deg) brightness(95%) contrast(89%);
                display: block;
                cursor: pointer;
                animation: korean1-float 3s ease-in-out infinite, korean1-swing 4s ease-in-out infinite;
            }
            
            .korean-1:hover {
                filter: brightness(0) saturate(100%) invert(85%) sepia(8%) saturate(1234%) hue-rotate(64deg) brightness(110%) contrast(89%) drop-shadow(0 0 5px #D5E6D4);
            }
            
            @keyframes korean1-float {
                0%, 100% {
                    transform: translateY(0px);
                }
                50% {
                    transform: translateY(-15px);
                }
            }
            
            @keyframes korean1-swing {
                0%, 100% {
                    transform: translateX(0px) rotate(0deg);
                }
                25% {
                    transform: translateX(4px) rotate(1.5deg);
                }
                50% {
                    transform: translateX(0px) rotate(0deg);
                }
                75% {
                    transform: translateX(-4px) rotate(-1.5deg);
                }
            }
            
            @keyframes intense-shake {
                0% {
                    transform: translateX(0px) translateY(0px) rotate(0deg);
                }
                10% {
                    transform: translateX(-8px) translateY(-5px) rotate(-3deg);
                }
                20% {
                    transform: translateX(8px) translateY(3px) rotate(3deg);
                }
                30% {
                    transform: translateX(-6px) translateY(-8px) rotate(-2deg);
                }
                40% {
                    transform: translateX(6px) translateY(5px) rotate(2deg);
                }
                50% {
                    transform: translateX(-10px) translateY(-3px) rotate(-4deg);
                }
                60% {
                    transform: translateX(10px) translateY(-6px) rotate(4deg);
                }
                70% {
                    transform: translateX(-5px) translateY(8px) rotate(-1deg);
                }
                80% {
                    transform: translateX(5px) translateY(-4px) rotate(1deg);
                }
                90% {
                    transform: translateX(-7px) translateY(6px) rotate(-2deg);
                }
                100% {
                    transform: translateX(0px) translateY(0px) rotate(0deg);
                }
            }
            
            .korean-1.intense-shake {
                animation: intense-shake 0.3s ease-in-out infinite;
            }
        `;
        document.head.appendChild(style);
    }
    
    // 初始化角色移动系统（第二面）
    function initCharacterMovement() {
        const character = document.querySelector('.character-area');
        const characterImg = character.querySelector('.character-second');
        let characterPos = { x: 5, y: 5 }; // 初始位置（百分比）
        const moveSpeed = 0.08; // 移动速度降低到0.08
        const moveKeys = { w: false, s: false, a: false, d: false };
        
        // 创建移动音效
        const moveSound = new Audio('角色移动声音.MP3');
        moveSound.loop = true; // 设置循环播放
        moveSound.playbackRate = 1.5; // 加速播放（1.5倍速）
        let isMoving = false; // 跟踪移动状态

        // 获取韩语1元素的位置
        const korean1 = document.querySelector('.korean-1');
        const korean1Rect = korean1.getBoundingClientRect();
        const korean1Center = {
            x: korean1Rect.left + korean1Rect.width / 2,
            y: korean1Rect.top + korean1Rect.height / 2
        };
        let hasPlayedKorean1Audio = false;

        // 语音识别相关变量
        let recognition = null;
        let isNearKey = false;
        let hasRecognizedPhrase = false;

        // 初始化语音识别
        function initSpeechRecognition() {
            if (!recognition && 'webkitSpeechRecognition' in window) {
                recognition = new webkitSpeechRecognition();
                recognition.continuous = true;
                recognition.interimResults = false;
                recognition.lang = 'en-US';

                recognition.onresult = function(event) {
                    const transcript = event.results[event.results.length - 1][0].transcript.toLowerCase().trim();
                    console.log('识别到:', transcript);

                    // 检查是否匹配目标短语
                    if (isNearKey && (
                        // 原有的短语
                        transcript.includes('you are swear') ||
                        transcript.includes('you a swear') ||
                        transcript.includes('your swear') ||
                        transcript.includes('you r swear') ||
                        transcript.includes('you are sweet') ||
                        transcript.includes('you a sweet') ||
                        transcript.includes('your sweet') ||
                        transcript.includes('you r sweet') ||
                        transcript.includes('you are') ||
                        transcript.includes('you r') ||
                        transcript.includes('your') ||
                        transcript.includes('you a') ||
                        transcript.includes('swear') ||
                        transcript.includes('sware') ||
                        transcript.includes('square') ||
                        transcript.includes('your sway') ||
                        transcript.includes('you are sway') ||
                        transcript.includes('you a sway') ||
                        transcript.includes('your way') ||
                        transcript.includes('you sway') ||
                        transcript.includes('ur sway') ||
                        transcript.includes('you swing') ||
                        transcript.includes('your swing') ||
                        transcript.includes('you say') ||
                        // "you say" 相关变体
                        transcript.includes('yoru say') ||
                        transcript.includes('your say') ||
                        transcript.includes("you're say") ||
                        transcript.includes('you say') ||
                        transcript.includes('u say') ||
                        transcript.includes('ur say') ||
                        transcript.includes('you se') ||
                        transcript.includes('you sa') ||
                        transcript.includes('you sei') ||
                        transcript.includes('you sai') ||
                        transcript.includes('you sae') ||
                        transcript.includes('you saye') ||
                        transcript.includes('you says') ||
                        transcript.includes('yoru se') ||
                        transcript.includes('yoru sa') ||
                        transcript.includes('yoru sei') ||
                        transcript.includes('yoru sai') ||
                        transcript.includes('yoru sae') ||
                        transcript.includes('yoru saye') ||
                        transcript.includes('yoru says') ||
                        transcript.includes('your se') ||
                        transcript.includes('your sa') ||
                        transcript.includes('your sei') ||
                        transcript.includes('your sai') ||
                        transcript.includes('your sae') ||
                        transcript.includes('your saye') ||
                        transcript.includes('your says') ||
                        // 新添加的短语及其变体
                        transcript.includes("you're sure") ||
                        transcript.includes("you're sad") ||
                        transcript.includes('you do say') ||
                        transcript.includes('you are sure') ||
                        transcript.includes('you are sad') ||
                        // 更多变体
                        transcript.includes('ur sure') ||
                        transcript.includes('ur sad') ||
                        transcript.includes('you r sure') ||
                        transcript.includes('you r sad') ||
                        transcript.includes('you a sure') ||
                        transcript.includes('you a sad') ||
                        transcript.includes('your sure') ||
                        transcript.includes('your sad') ||
                        transcript.includes('you were sad') ||
                        transcript.includes('you were sure') ||
                        transcript.includes('you seem sad') ||
                        transcript.includes('you seem sure') ||
                        transcript.includes('you so sad') ||
                        transcript.includes('you so sure') ||
                        transcript.includes('u r sure') ||
                        transcript.includes('u r sad') ||
                        transcript.includes('u are sure') ||
                        transcript.includes('u are sad') ||
                        // swear相关短语
                        transcript.includes("you're swear") ||
                        transcript.includes('you swear') ||
                        transcript.includes('u swear') ||
                        transcript.includes('ur swear') ||
                        transcript.includes('you are swear') ||
                        // 新增短语及其变体
                        // "use me" 相关
                        transcript.includes('use me') ||
                        transcript.includes('use my') ||
                        transcript.includes('you see me') ||
                        transcript.includes('you see my') ||
                        transcript.includes('you see') ||
                        transcript.includes('use') ||
                        transcript.includes('you say me') ||
                        transcript.includes('you say my') ||
                        // "you're smart" 相关
                        transcript.includes("you're smart") ||
                        transcript.includes('your smart') ||
                        transcript.includes('you are smart') ||
                        transcript.includes('you r smart') ||
                        transcript.includes('u r smart') ||
                        transcript.includes('ur smart') ||
                        transcript.includes('you smart') ||
                        transcript.includes('u smart') ||
                        // "where are you" 相关
                        transcript.includes('where are you') ||
                        transcript.includes('where r you') ||
                        transcript.includes('where you') ||
                        transcript.includes('where u') ||
                        transcript.includes('where are u') ||
                        transcript.includes('where r u') ||
                        transcript.includes('where you at') ||
                        transcript.includes('where u at') ||
                        // "on the sand" 相关
                        transcript.includes('on the sand') ||
                        transcript.includes('on sand') ||
                        transcript.includes('in the sand') ||
                        transcript.includes('in sand') ||
                        transcript.includes('on the stand') ||
                        transcript.includes('on stand') ||
                        transcript.includes('on the send') ||
                        transcript.includes('on send') ||
                        // "you must wait" 相关
                        transcript.includes('you must wait') ||
                        transcript.includes('you must weight') ||
                        transcript.includes('you must way') ||
                        transcript.includes('you must') ||
                        transcript.includes('u must wait') ||
                        transcript.includes('u must weight') ||
                        transcript.includes('u must way') ||
                        transcript.includes('u must') ||
                        // "with the phone" 相关
                        transcript.includes('with the phone') ||
                        transcript.includes('with phone') ||
                        transcript.includes('with the foam') ||
                        transcript.includes('with foam') ||
                        transcript.includes('with the tone') ||
                        transcript.includes('with tone') ||
                        // "hello" 相关
                        transcript.includes('hello') ||
                        transcript.includes('hallo') ||
                        transcript.includes('hullo') ||
                        transcript.includes('helo') ||
                        transcript.includes('hallo') ||
                        transcript.includes('hey low') ||
                        transcript.includes('hey lo') ||
                        transcript.includes('hi low') ||
                        transcript.includes('hi lo') ||
                        // 所有包含"you're"的语句
                        transcript.includes("you're") ||
                        // 新增的短语及其变体
                        // "eur where" 相关
                        transcript.includes('eur where') ||
                        transcript.includes('euro where') ||
                        transcript.includes('your where') ||
                        transcript.includes('you where') ||
                        transcript.includes('ear where') ||
                        transcript.includes('air where') ||
                        transcript.includes('are where') ||
                        transcript.includes('or where') ||
                        // "usway" 相关
                        transcript.includes('usway') ||
                        transcript.includes('us way') ||
                        transcript.includes('use way') ||
                        transcript.includes('you sway') ||
                        transcript.includes('you way') ||
                        transcript.includes('usa way') ||
                        transcript.includes('us away') ||
                        transcript.includes('use away') ||
                        // "euro cell" 相关
                        transcript.includes('euro cell') ||
                        transcript.includes('your cell') ||
                        transcript.includes('you cell') ||
                        transcript.includes('euro sale') ||
                        transcript.includes('euro sell') ||
                        transcript.includes('your sale') ||
                        transcript.includes('your sell') ||
                        transcript.includes('euro call') ||
                        transcript.includes('your call') ||
                        // "usa" 相关
                        transcript.includes('usa') ||
                        transcript.includes('u s a') ||
                        transcript.includes('you sa') ||
                        transcript.includes('you say') ||
                        transcript.includes('use a') ||
                        transcript.includes('us a') ||
                        transcript.includes('you see a') ||
                        transcript.includes('you are a')
                    )) {
                        hasRecognizedPhrase = true;
                        console.log('识别成功！准备切换场景');
                        transitionToThirdScene();
                    }
                };

                recognition.onerror = function(event) {
                    console.error('语音识别错误:', event.error);
                };

                recognition.onend = function() {
                    if (isNearKey && !hasRecognizedPhrase) {
                        try {
                            recognition.start();
                        } catch (e) {
                            console.log('重启语音识别失败:', e);
                        }
                    }
                };
            }
        }

        // 检查与韩语1的距离并触发音频
        function checkKorean1Distance() {
            if (hasPlayedKorean1Audio) return;

            const characterRect = character.getBoundingClientRect();
            const characterCenter = {
                x: characterRect.left + characterRect.width / 2,
                y: characterRect.top + characterRect.height / 2
            };

            // 计算距离
            const distance = Math.sqrt(
                Math.pow(characterCenter.x - korean1Center.x, 2) +
                Math.pow(characterCenter.y - korean1Center.y, 2)
            );

            // 如果距离小于150像素，触发音频
            if (distance < 150) {
                hasPlayedKorean1Audio = true;
                // 触发韩语1的音频播放
                const korean1Audio = new Audio('3/1MUSIC.mp3');
                korean1Audio.play().catch(error => {
                    console.log('音效播放失败:', error);
                });
                // 移除晃动效果
                korean1.classList.remove('intense-shake');
            }
        }

        // 检查与钥匙的距离并处理语音识别
        function checkKeyDistance() {
            const keyIcon = document.querySelector('.key-icon');
            if (!keyIcon) return;

            const keyRect = keyIcon.getBoundingClientRect();
            const characterRect = character.getBoundingClientRect();

            const distance = Math.sqrt(
                Math.pow(characterRect.left - keyRect.left, 2) +
                Math.pow(characterRect.top - keyRect.top, 2)
            );

            // 更新是否在钥匙旁边的状态
            const wasNearKey = isNearKey;
            isNearKey = distance < 150;

            // 状态改变时处理语音识别
            if (isNearKey !== wasNearKey) {
                if (isNearKey) {
                    console.log('靠近钥匙，开始语音识别');
                    // 初始化并启动语音识别
                    initSpeechRecognition();
                    if (recognition && !hasRecognizedPhrase) {
                        try {
                            recognition.start();
                        } catch (e) {
                            console.log('启动语音识别失败:', e);
                        }
                    }
                } else {
                    console.log('离开钥匙，停止语音识别');
                    if (recognition) {
                        try {
                            recognition.stop();
                        } catch (e) {
                            console.log('停止语音识别失败:', e);
                        }
                    }
                }
            }
        }

        // 切换到第三面的功能已移到全局作用域

        // 更新角色图片和动画
        function updateCharacterImage() {
            // 更新图片
            if (moveKeys.w) {
                characterImg.src = 'U/UW.png';
            } else if (moveKeys.a) {
                characterImg.src = 'U/UA.png';
            } else if (moveKeys.d) {
                characterImg.src = 'U/UD.png';
            } else {
                characterImg.src = '6.png';
            }

            // 更新走路动画
            if (moveKeys.w || moveKeys.a || moveKeys.s || moveKeys.d) {
                characterImg.classList.add('walking');
            } else {
                characterImg.classList.remove('walking');
            }
        }

        // 监听按键按下
        const keydownHandler = (event) => {
            let keyChanged = false;
            switch(event.key.toLowerCase()) {
                case 'w':
                    if (!moveKeys.w) {
                        moveKeys.w = true;
                        keyChanged = true;
                    }
                    break;
                case 's':
                    if (!moveKeys.s) {
                        moveKeys.s = true;
                        keyChanged = true;
                    }
                    break;
                case 'a':
                    if (!moveKeys.a) {
                        moveKeys.a = true;
                        keyChanged = true;
                    }
                    break;
                case 'd':
                    if (!moveKeys.d) {
                        moveKeys.d = true;
                        keyChanged = true;
                    }
                    break;
            }
            
            if (keyChanged) {
                updateCharacterImage();
            }
            
            if (!isMoving && (moveKeys.w || moveKeys.s || moveKeys.a || moveKeys.d)) {
                isMoving = true;
                moveSound.play().catch(error => {
                    console.log('音效播放失败:', error);
                });
            }
        };

        // 监听按键释放
        const keyupHandler = (event) => {
            let keyChanged = false;
            switch(event.key.toLowerCase()) {
                case 'w':
                    if (moveKeys.w) {
                        moveKeys.w = false;
                        keyChanged = true;
                    }
                    break;
                case 's':
                    if (moveKeys.s) {
                        moveKeys.s = false;
                        keyChanged = true;
                    }
                    break;
                case 'a':
                    if (moveKeys.a) {
                        moveKeys.a = false;
                        keyChanged = true;
                    }
                    break;
                case 'd':
                    if (moveKeys.d) {
                        moveKeys.d = false;
                        keyChanged = true;
                    }
                    break;
            }
            
            if (keyChanged) {
                updateCharacterImage();
            }
            
            if (isMoving && !moveKeys.w && !moveKeys.s && !moveKeys.a && !moveKeys.d) {
                isMoving = false;
                moveSound.pause();
                moveSound.currentTime = 0;
            }
        };

        // 添加事件监听器
        document.addEventListener('keydown', keydownHandler);
        document.addEventListener('keyup', keyupHandler);

        // 移动更新循环
        function updateMovement() {
            // 更新位置
            if (moveKeys.w && characterPos.y < 90) characterPos.y += moveSpeed;
            if (moveKeys.s && characterPos.y > 5) characterPos.y -= moveSpeed;
            if (moveKeys.a && characterPos.x > 0) characterPos.x -= moveSpeed;
            if (moveKeys.d && characterPos.x < 90) characterPos.x += moveSpeed;
            
            // 应用新位置
            character.style.left = `${characterPos.x}%`;
            character.style.bottom = `${characterPos.y}%`;

            // 检查与韩语1的距离
            checkKorean1Distance();
            
            // 检查与钥匙的距离
            checkKeyDistance();
            
            // 继续下一帧
            requestAnimationFrame(updateMovement);
        }
        
        // 开始移动循环
        updateMovement();

        // 返回清理函数
        return function cleanup() {
            document.removeEventListener('keydown', keydownHandler);
            document.removeEventListener('keyup', keyupHandler);
            if (moveSound) {
                moveSound.pause();
                moveSound.currentTime = 0;
            }
            if (recognition) {
                try {
                    recognition.stop();
                } catch (e) {
                    console.log('停止语音识别失败:', e);
                }
                recognition = null;
            }
        };
    }
    
    // 花朵飞散函数
    function scatterAllFlowers() {
        const allFlowers = document.querySelectorAll('.generated-plant, .letter-flower');
        const characterRect = mainCharacter.getBoundingClientRect();
        const characterCenterX = characterRect.left + characterRect.width / 2;
        const characterCenterY = characterRect.top + characterRect.height / 2;
        
        allFlowers.forEach((flower, index) => {
            const flowerRect = flower.getBoundingClientRect();
            const flowerCenterX = flowerRect.left + flowerRect.width / 2;
            const flowerCenterY = flowerRect.top + flowerRect.height / 2;
            
            // 计算花朵相对于主角的方向
            const deltaX = flowerCenterX - characterCenterX;
            const deltaY = flowerCenterY - characterCenterY;
            
            // 主要向左右上方飘散，模拟风的效果
            const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
            let baseDirectionX, baseDirectionY;
            
            if (distance < 10) {
                // 如果太接近主角，随机选择左上或右上方向
                baseDirectionX = Math.random() > 0.5 ? 1 : -1;
                baseDirectionY = -0.5;
            } else {
                // 正常化基础方向，但偏向上方
                baseDirectionX = deltaX / distance;
                baseDirectionY = (deltaY / distance) - 0.7; // 强制偏向上方
            }
            
            // 确保主要向左右上方飘散
            if (baseDirectionY > 0) baseDirectionY = -Math.abs(baseDirectionY);
            
            // 创建螺旋轨迹的动画
            createSpiralAnimation(flower, baseDirectionX, baseDirectionY, index);
        });
    }
    
    // 创建螺旋动画
    function createSpiralAnimation(flower, directionX, directionY, index) {
        let currentX = 0;
        let currentY = 0;
        let angle = 0;
        let spiralRadius = 20; // 螺旋半径
        let speed = 0.5; // 移动速度（更慢）
        let opacity = 1;
        let scale = 1;
        let rotation = 0;
        
        // 随机化一些参数
        const spiralDirection = Math.random() > 0.5 ? 1 : -1; // 螺旋方向
        const spiralSpeed = Math.random() * 0.03 + 0.02; // 螺旋速度
        const windStrength = Math.random() * 0.3 + 0.7; // 风力强度
        
        // 延迟开始，创造波浪效果
        setTimeout(() => {
            const animateFlower = () => {
                // 螺旋运动
                const spiralX = Math.cos(angle) * spiralRadius * spiralDirection;
                const spiralY = Math.sin(angle) * spiralRadius * 0.5; // 垂直螺旋幅度小一些
                
                // 主要移动方向
                currentX += directionX * speed * windStrength;
                currentY += directionY * speed * windStrength;
                
                // 增加螺旋范围随时间扩大
                spiralRadius += 0.3;
                angle += spiralSpeed;
                speed += 0.02; // 逐渐加速
                
                // 最终位置 = 主要移动 + 螺旋偏移
                const finalX = currentX + spiralX;
                const finalY = currentY + spiralY;
                
                // 旋转和缩放效果
                rotation += 3;
                scale = Math.max(0.1, scale - 0.004); // 逐渐缩小
                opacity = Math.max(0, opacity - 0.002); // 逐渐透明
                
                // 应用变换
                flower.style.transform = `translate(${finalX}px, ${finalY}px) rotate(${rotation}deg) scale(${scale})`;
                flower.style.opacity = opacity;
                
                // 检查是否需要继续动画
                const shouldContinue = opacity > 0 && 
                                     Math.abs(finalX) < window.innerWidth * 1.5 && 
                                     Math.abs(finalY) < window.innerHeight * 1.5;
                
                if (shouldContinue) {
                    requestAnimationFrame(animateFlower);
                } else {
                    // 移除花朵
                    if (flower.parentNode) {
                        flower.parentNode.removeChild(flower);
                    }
                }
            };
            
            // 开始动画
            animateFlower();
        }, index * 30); // 每朵花延迟30ms，创造更明显的波浪效果
    }
    
    // 键盘事件监听
    document.addEventListener('keydown', function(event) {
        switch(event.key) {
            case 'Enter':
            case ' ':
                // 空格键或回车键开始游戏
                startGame();
                break;
            case 'Escape':
                // ESC键重置动画并停止生成
                resetAnimations();
                stopPlantGeneration();
                
                // 清除过渡计时器
                if (transitionTimer) {
                    clearTimeout(transitionTimer);
                    transitionTimer = null;
                }
                break;
        }
    });
    
    // 页面加载动画
    function initializeAnimations() {
        // 标题逐个显示
        titleImages.forEach((img, index) => {
            img.style.opacity = '0';
            img.style.transform = 'translateY(-50px)';
            
            setTimeout(() => {
                img.style.transition = 'all 0.8s ease';
                img.style.opacity = '1';
                img.style.transform = 'translateY(0)';
            }, index * 200);
        });
        
        // 主角延迟出现
        mainCharacter.style.opacity = '0';
        mainCharacter.style.transform = 'scale(0)';
        setTimeout(() => {
            mainCharacter.style.transition = 'all 1s ease';
            mainCharacter.style.opacity = '1';
            mainCharacter.style.transform = 'scale(1)';
        }, 1000);
    }
    
    // 开始游戏函数（预留）
    function startGame() {
        console.log('游戏开始！');
        // 移除闪烁效果，避免贴图忽明忽暗
        startBackgroundMusic();
    }
    
    // 重置动画
    function resetAnimations() {
        titleImages.forEach(img => {
            img.style.animation = 'none';
            img.style.transform = 'scale(1)';
        });
        
        // 重置主角发光效果
        mainCharacter.style.filter = 'brightness(0) saturate(100%) invert(85%) sepia(8%) saturate(1234%) hue-rotate(64deg) brightness(95%) contrast(89%)';
        mainCharacter.style.animation = 'float 2s ease-in-out infinite';
        
        // 清除所有生成的植物和字母花朵
        const generatedPlants = document.querySelectorAll('.generated-plant');
        generatedPlants.forEach(plant => {
            if (plant.parentNode) {
                plant.parentNode.removeChild(plant);
            }
        });
        
        const letterFlowers = document.querySelectorAll('.letter-flower');
        letterFlowers.forEach(flower => {
            if (flower.parentNode) {
                flower.parentNode.removeChild(flower);
            }
        });
    }
    
    // 音效播放函数（预留）
    function playClickSound() {
        // 这里可以添加音效播放逻辑
        // const audio = new Audio('click.mp3');
        // audio.play();
    }

    // 背景音乐播放函数
    let backgroundMusic = null;
    
    function startBackgroundMusic() {
        if (backgroundMusic) {
            return; // 如果已经在播放，不重复创建
        }
        
        console.log('开始播放背景音乐');
        backgroundMusic = new Audio('背景音乐.mp3');
        backgroundMusic.loop = true; // 循环播放
        backgroundMusic.volume = 0.1397; // 调小音量到13.97%（14.7%再减5%）
        
        // 尝试播放背景音乐
        backgroundMusic.play().then(() => {
            console.log('背景音乐开始播放');
        }).catch(error => {
            console.log('背景音乐播放失败，可能需要用户交互:', error);
            
            // 如果自动播放失败，在用户第一次点击时播放
            const playOnFirstClick = () => {
                backgroundMusic.play().then(() => {
                    console.log('背景音乐在用户交互后开始播放');
                }).catch(e => {
                    console.error('背景音乐播放失败:', e);
                });
                document.removeEventListener('click', playOnFirstClick);
            };
            
            document.addEventListener('click', playOnFirstClick);
        });
    }
    
    function stopBackgroundMusic() {
        if (backgroundMusic) {
            backgroundMusic.pause();
            backgroundMusic.currentTime = 0;
            backgroundMusic = null;
            console.log('背景音乐已停止');
        }
    }

    // 添加场景跳转按钮
    function addSceneSkipButton(sceneNumber, nextSceneFunction) {
        // 移除已存在的跳转按钮
        const existingButton = document.querySelector('.scene-skip-button');
        if (existingButton) {
            existingButton.remove();
        }

        const skipButton = document.createElement('button');
        skipButton.className = 'scene-skip-button';
        skipButton.textContent = sceneNumber >= 9 ? '重新开始' : sceneNumber >= 8 ? '完成游戏' : sceneNumber >= 7 ? '跳转到第8面' : sceneNumber >= 6 ? '跳转到第7面' : `跳转到第${sceneNumber + 1}面`;
        skipButton.style.cssText = `
            position: fixed;
            top: 10px;
            right: 10px;
            z-index: 9999;
            padding: 8px 12px;
            background-color: rgba(213, 230, 212, 0.8);
            color: #322030;
            border: 2px solid #322030;
            border-radius: 5px;
            font-size: 12px;
            font-weight: bold;
            cursor: pointer;
            transition: all 0.3s ease;
        `;

        // 悬停效果
        skipButton.addEventListener('mouseenter', () => {
            skipButton.style.backgroundColor = '#D5E6D4';
            skipButton.style.transform = 'scale(1.05)';
        });

        skipButton.addEventListener('mouseleave', () => {
            skipButton.style.backgroundColor = 'rgba(213, 230, 212, 0.8)';
            skipButton.style.transform = 'scale(1)';
        });

        // 点击事件
        skipButton.addEventListener('click', () => {
            console.log(`跳转到第${sceneNumber + 1}面`);
            nextSceneFunction();
        });

        document.body.appendChild(skipButton);
    }
    
    // 添加发光动画样式
    const style = document.createElement('style');
    style.textContent = `
        @keyframes glow-transition {
            0% {
                filter: brightness(0) saturate(100%) invert(85%) sepia(8%) saturate(1234%) hue-rotate(64deg) brightness(95%) contrast(89%);
            }
            100% {
                filter: brightness(0) saturate(100%) invert(85%) sepia(8%) saturate(1234%) hue-rotate(64deg) brightness(120%) contrast(89%) drop-shadow(0 0 15px #D5E6D4) drop-shadow(0 0 30px #D5E6D4) drop-shadow(0 0 45px #D5E6D4);
            }
        }
        
        @keyframes glow {
            0% {
                filter: brightness(0) saturate(100%) invert(85%) sepia(8%) saturate(1234%) hue-rotate(64deg) brightness(120%) contrast(89%) drop-shadow(0 0 15px #D5E6D4) drop-shadow(0 0 30px #D5E6D4) drop-shadow(0 0 45px #D5E6D4);
            }
            100% {
                filter: brightness(0) saturate(100%) invert(85%) sepia(8%) saturate(1234%) hue-rotate(64deg) brightness(140%) contrast(89%) drop-shadow(0 0 25px #D5E6D4) drop-shadow(0 0 50px #D5E6D4) drop-shadow(0 0 75px #D5E6D4);
            }
        }
    `;
    document.head.appendChild(style);
    
    // 初始化页面动画
    initializeAnimations();
    
    // 启动背景音乐
    startBackgroundMusic();
    
    // 添加第一面的跳转按钮
    addSceneSkipButton(1, transitionToSecondScene);
    
    // 添加触摸设备支持
    if ('ontouchstart' in window) {
        // 为触摸设备添加特殊处理
        document.addEventListener('touchstart', function(event) {
            event.preventDefault();
        });
        
        // 触摸主角
        mainCharacter.addEventListener('touchstart', function(event) {
            event.preventDefault();
            this.click();
        });
    }

    // 切换到第三面
    function transitionToThirdScene() {
        console.log('开始切换到第三面');
        
        // 调用第二面的清理函数
        if (window.secondSceneCleanup) {
            console.log('调用第二面清理函数');
            window.secondSceneCleanup();
            window.secondSceneCleanup = null;
        }
        
        // 停止语音识别
        if (typeof recognition !== 'undefined' && recognition) {
            try {
                recognition.stop();
            } catch (e) {
                console.log('停止语音识别失败:', e);
            }
        }

        // 停止所有音频（除了背景音乐）
        const allAudios = document.querySelectorAll('audio');
        allAudios.forEach(audio => {
            if (audio !== backgroundMusic) { // 不停止背景音乐
                try {
                    audio.pause();
                    audio.currentTime = 0;
                } catch (e) {
                    console.log('停止音频失败:', e);
                }
            }
        });

        const container = document.querySelector('.scene-two-container');
        if (!container) {
            console.log('未找到第二面容器，直接创建第三面');
            createThirdScene();
            return;
        }
        
        // 添加下滑切换动画
        container.style.transition = 'transform 1.5s ease-in-out';
        container.style.transform = 'translateY(-100vh)';
        
        // 1.5秒后创建第三面
        setTimeout(() => {
            createThirdScene();
        }, 1500);
    }

    // 创建第三面
    function createThirdScene() {
        // 清除第二面内容
        document.body.innerHTML = '';
        
        // 创建第三面的HTML结构
        const thirdSceneHTML = `
            <div class="scene-three-container">
                <div class="left-circle"></div>
                <div class="left-sector">
                    <img src="关门.png" alt="关门" class="door-image">
                </div>
                <div class="character-area">
                    <img src="6.png" alt="主角" class="character-second">
                </div>
                <div class="georgian-text-area">
                    <img src="4/格鲁吉亚语1.png" alt="格鲁吉亚语1" class="georgian-1">
                    <img src="4/格鲁吉亚语2.png" alt="格鲁吉亚语2" class="georgian-2">
                </div>
            </div>
        `;
        
        document.body.innerHTML = thirdSceneHTML;
        
        // 添加第三面的样式
        addThirdSceneStyles();
        
        // 初始化第三面
        initThirdScene();
    }

    // 添加第三面的样式
    function addThirdSceneStyles() {
        // 先移除可能存在的旧样式
        const existingStyles = document.querySelectorAll('style');
        existingStyles.forEach(style => {
            if (style.textContent.includes('.left-sector') || style.textContent.includes('.right-sector')) {
                style.remove();
            }
        });
        
        const style = document.createElement('style');
        style.textContent = `
            .scene-three-container {
                width: 100vw;
                height: 100vh;
                background-color: #D5E6D4;
                position: relative;
                overflow: hidden;
            }

            .left-circle {
                position: absolute;
                left: 0;
                top: 50%;
                transform: translateY(-50%);
                width: 200px;
                height: 200px;
                background-color: #322030;
                border-radius: 50%;
                z-index: 10;
            }

            .left-sector {
                position: absolute !important;
                right: 0 !important;
                bottom: 0 !important;
                width: 300px !important;
                height: 300px !important;
                background-color: #322030 !important;
                border-radius: 300px 0 0 0 !important;
                display: flex !important;
                justify-content: center !important;
                align-items: center !important;
                overflow: hidden !important;
                z-index: 10 !important;
            }

            /* 确保没有右下角的扇形 */
            .right-sector {
                display: none !important;
            }

            .door-image {
                width: 50%;
                height: auto;
                object-fit: contain;
                filter: brightness(0) saturate(100%) invert(85%) sepia(8%) saturate(1234%) hue-rotate(64deg) brightness(95%) contrast(89%);
                transition: opacity 0.3s ease;
                z-index: 30;
            }

            .generated-circle {
                position: absolute;
                z-index: 5;
                transition: all 0.3s ease;
            }

            .character-area {
                z-index: 30;
            }

            .flower {
                position: absolute;
                width: 30px;
                height: 30px;
                z-index: 15;
                pointer-events: none;
            }

            .georgian-text-area {
                position: absolute;
                right: 20px;
                bottom: 20px;
                z-index: 20;
                display: flex;
                flex-direction: column;
                gap: 10px;
            }

            .georgian-1, .georgian-2 {
                height: 40px;
                width: auto;
                filter: brightness(0) saturate(100%) invert(85%) sepia(8%) saturate(1234%) hue-rotate(64deg) brightness(95%) contrast(89%);
                cursor: pointer;
                transition: all 0.3s ease;
            }

            .georgian-1:hover {
                transform: scale(1.1);
                filter: brightness(0) saturate(100%) invert(85%) sepia(8%) saturate(1234%) hue-rotate(64deg) brightness(120%) contrast(89%) drop-shadow(0 0 15px #D5E6D4) drop-shadow(0 0 30px #D5E6D4);
                transition: all 0.3s ease;
            }

            .georgian-2:hover {
                transform: scale(1.1);
            }
        `;
        document.head.appendChild(style);
        
        console.log('第三面样式已更新，门应该在右下角');
    }

    // 初始化第三面
    function initThirdScene() {
        // 初始化格鲁吉亚语交互
        initGeorgianInteraction();
        
        // 初始化主角移动系统并保存清理函数
        window.thirdSceneCleanup = initThirdSceneCharacterMovement();
        
        // 添加第三面的跳转按钮
        addSceneSkipButton(3, transitionToFourthScene);
    }

    // 初始化格鲁吉亚语交互
    function initGeorgianInteraction() {
        const georgian1 = document.querySelector('.georgian-1');
        
        if (georgian1) {
            georgian1.addEventListener('click', () => {
                console.log('点击了格鲁吉亚语1');
                
                // 播放格鲁吉亚语音频
                try {
                    const georgianAudio = new Audio('4/格鲁吉亚语.mp4');
                    georgianAudio.play().then(() => {
                        console.log('格鲁吉亚语音频播放成功');
                    }).catch(error => {
                        console.log('格鲁吉亚语音频播放失败:', error);
                        // 尝试其他可能的文件名
                        const georgianAudio2 = new Audio('4/georgian.mp4');
                        georgianAudio2.play().catch(error2 => {
                            console.log('备用格鲁吉亚语音频也播放失败:', error2);
                        });
                    });
                } catch (e) {
                    console.log('格鲁吉亚语音频播放异常:', e);
                }
            });
        }
    }

    // 初始化第三面的主角移动系统
    function initThirdSceneCharacterMovement() {
        const character = document.querySelector('.character-area');
        const characterImg = character.querySelector('.character-second');
        let characterPos = { x: 5, y: 50 }; // 初始位置：左边圆内
        const moveSpeed = 0.08;
        const moveKeys = { w: false, s: false, a: false, d: false };
        
        // 设置初始位置
        character.style.left = `${characterPos.x}%`;
        character.style.bottom = `${characterPos.y}%`;
        
        // 创建移动音效
        const moveSound = new Audio('角色移动声音.MP3');
        moveSound.loop = true;
        moveSound.playbackRate = 1.5; // 加速播放（1.5倍速）
        let isMoving = false;
        
        // 语音识别相关变量
        let recognition = null;
        let isRecognizing = false;

        // 重置所有按键状态
        function resetAllKeys() {
            moveKeys.w = false;
            moveKeys.s = false;
            moveKeys.a = false;
            moveKeys.d = false;
            console.log('重置所有按键状态');
        }

        // 生成圆形
        function generateCircle() {
            // 检查是否是第一次生成圆形
            const isFirstGeneration = document.querySelectorAll('.generated-circle').length === 0;
            
            // 生成更多圆形：40-60个圆
            const circleCount = Math.floor(Math.random() * 21) + 40; // 40-60个圆
            const existingCircles = [];
            
            // 角色初始位置（5%, 50%）
            const characterInitialX = 5;
            const characterInitialY = 50;
            
            for (let i = 0; i < circleCount; i++) {
                let attempts = 0;
                let validPosition = false;
                let x, y, size;
                
                // 尝试找到不重叠的位置，最多尝试50次
                while (!validPosition && attempts < 50) {
                    // 随机大小 (80px - 200px)
                    size = Math.random() * 120 + 80;
                    
                    // 如果是第一次生成且前30%的圆，优先在角色初始位置附近生成
                    if (isFirstGeneration && i < circleCount * 0.3) {
                        // 在角色初始位置周围30%的范围内生成圆形
                        const areaSize = 30; // 30%的区域范围
                        const margin = size / window.innerWidth * 100 / 2;
                        
                        x = Math.random() * areaSize + Math.max(0, characterInitialX - areaSize/2);
                        y = Math.random() * areaSize + Math.max(0, characterInitialY - areaSize/2);
                        
                        // 确保不超出边界
                        x = Math.min(x, 95 - margin);
                        y = Math.min(y, 95 - margin);
                        x = Math.max(x, 5 + margin);
                        y = Math.max(y, 5 + margin);
                    } else {
                        // 随机位置（全屏范围，考虑圆的大小）
                        const margin = size / window.innerWidth * 100 / 2; // 转换为百分比
                        x = Math.random() * (90 - margin * 2) + margin + 5; // 5% + margin 到 95% - margin
                        y = Math.random() * (90 - margin * 2) + margin + 5; // 5% + margin 到 95% - margin
                    }
                    
                    // 检查与现有圆的重叠
                    validPosition = true;
                    for (const existingCircle of existingCircles) {
                        const distance = Math.sqrt(
                            Math.pow(x - existingCircle.x, 2) + 
                            Math.pow(y - existingCircle.y, 2)
                        );
                        
                        // 计算最小距离（两个圆的半径之和 + 一些间距）
                        const minDistance = (size + existingCircle.size) / window.innerWidth * 100 / 2 + 1.5; // 减少间距以容纳更多圆
                        
                        if (distance < minDistance) {
                            validPosition = false;
                            break;
                        }
                    }
                    
                    attempts++;
                }
                
                // 如果找到了有效位置，或者尝试次数用完了，就创建圆
                if (validPosition || attempts >= 50) {
                    // 记录这个圆的位置和大小
                    existingCircles.push({ x, y, size });
                    
                    const circle = document.createElement('div');
                    circle.className = 'generated-circle';
                    circle.style.cssText = `
                        position: absolute;
                        left: ${x}%;
                        bottom: ${y}%;
                        width: ${size}px;
                        height: ${size}px;
                        background-color: #322030;
                        border-radius: 50%;
                        z-index: 5;
                        transition: all 0.3s ease;
                        opacity: 0;
                        transform: scale(0);
                    `;
                    
                    document.querySelector('.scene-three-container').appendChild(circle);

                    // 添加出现动画，每个圆有略微的延迟
                    setTimeout(() => {
                        requestAnimationFrame(() => {
                            circle.style.opacity = '1';
                            circle.style.transform = 'scale(1)';
                        });
                    }, i * 20); // 进一步减少延迟时间，因为圆更多了
                }
            }
            
            console.log(`生成了 ${existingCircles.length} 个圆形${isFirstGeneration ? '（第一次生成，优先角色区域）' : ''}`);
        }

        // 检查是否在安全区域（圆形内）
        function isInSafeArea(characterRect) {
            const circles = document.querySelectorAll('.generated-circle, .left-circle');
            let inSafeArea = false;

            // 获取角色中心点
            const characterCenter = {
                x: characterRect.left + characterRect.width / 2,
                y: characterRect.top + characterRect.height / 2
            };

            circles.forEach(circle => {
                const circleRect = circle.getBoundingClientRect();
                const circleCenter = {
                    x: circleRect.left + circleRect.width / 2,
                    y: circleRect.top + circleRect.height / 2
                };
                const radius = circleRect.width / 2;

                // 计算角色中心点到圆心的距离
                const distance = Math.sqrt(
                    Math.pow(characterCenter.x - circleCenter.x, 2) +
                    Math.pow(characterCenter.y - circleCenter.y, 2)
                );

                // 如果角色中心点在任何一个圆内，就是安全的
                if (distance <= radius) {
                    inSafeArea = true;
                }
            });

            // 检查是否在右下角扇形区域内（门的区域也是安全的）
            const leftSector = document.querySelector('.left-sector');
            if (leftSector) {
                const sectorRect = leftSector.getBoundingClientRect();
                
                // 简单的矩形检测，如果角色在扇形区域内也是安全的
                if (characterCenter.x >= sectorRect.left && 
                    characterCenter.x <= sectorRect.right && 
                    characterCenter.y >= sectorRect.top && 
                    characterCenter.y <= sectorRect.bottom) {
                    inSafeArea = true;
                }
            }

            return inSafeArea;
        }

        // 检查与圆形的碰撞
        function checkCircleCollision() {
            const characterRect = character.getBoundingClientRect();
            const circles = document.querySelectorAll('.generated-circle');

            circles.forEach(circle => {
                const circleRect = circle.getBoundingClientRect();
                
                // 简单的矩形碰撞检测
                if (!(characterRect.right < circleRect.left || 
                    characterRect.left > circleRect.right || 
                    characterRect.bottom < circleRect.top || 
                    characterRect.top > circleRect.bottom)) {
                    // 碰撞时添加发光效果
                    circle.style.boxShadow = '0 0 20px #D5E6D4, 0 0 40px #D5E6D4';
                    
                    // 如果这个圆还没有生成过花，就生成花
                    if (!circle.getAttribute('data-has-flower')) {
                        generateFlowerInCircle(circle);
                    }
                } else {
                    // 未碰撞时恢复正常
                    circle.style.boxShadow = 'none';
                }
            });
        }

        // 检查与门的碰撞并处理
        function checkDoorCollision() {
            // 检查第三面是否已经结束
            if (window.thirdSceneEnded) {
                return;
            }
            
            const characterRect = character.getBoundingClientRect();
            const doorImage = document.querySelector('.door-image');
            if (!doorImage) {
                console.log('门图片元素未找到');
                return;
            }

            const doorRect = doorImage.getBoundingClientRect();
            
            // 检查碰撞
            const isColliding = !(characterRect.right < doorRect.left || 
                characterRect.left > doorRect.right || 
                characterRect.bottom < doorRect.top || 
                characterRect.top > doorRect.bottom);
            
            // 获取或初始化上次碰撞状态
            if (!doorImage.hasAttribute('data-last-collision')) {
                doorImage.setAttribute('data-last-collision', 'false');
            }
            
            const wasColliding = doorImage.getAttribute('data-last-collision') === 'true';
            
            // 只在从非碰撞状态变为碰撞状态时触发
            if (isColliding && !wasColliding) {
                console.log('检测到新的门碰撞');
                
                // 防止重复触发 - 检查是否正在切换
                if (doorImage.getAttribute('data-switching') === 'true') {
                    console.log('门正在切换中，跳过');
                    doorImage.setAttribute('data-last-collision', isColliding.toString());
                    return;
                }
                
                // 标记正在切换
                doorImage.setAttribute('data-switching', 'true');
                console.log('开始门的切换动画');
                
                // 播放开门音效
                try {
                    const doorSound = new Audio('4/kaimen.mp3');
                    doorSound.play().then(() => {
                        console.log('开门音效播放成功');
                    }).catch(error => {
                        console.log('开门音效播放失败:', error);
                        // 如果kaimen.mp3失败，尝试其他可能的文件名
                        const doorSound2 = new Audio('4/door.mp3');
                        doorSound2.play().catch(error2 => {
                            console.log('备用音效也播放失败:', error2);
                        });
                    });
                } catch (e) {
                    console.log('音效播放异常:', e);
                }

                // 检查当前门的状态并切换
                const currentSrc = doorImage.src;
                console.log('当前门的图片:', currentSrc);
                
                // 解码URL以正确识别中文文件名
                const decodedSrc = decodeURIComponent(currentSrc);
                console.log('解码后的图片路径:', decodedSrc);
                
                // 判断当前是开门还是关门状态
                const isOpenDoor = decodedSrc.includes('开门') || currentSrc.includes('open') || currentSrc.includes('%E5%BC%80%E9%97%A8');
                const isClosedDoor = decodedSrc.includes('关门') || currentSrc.includes('close') || currentSrc.includes('%E5%85%B3%E9%97%A8');
                
                if (isOpenDoor) {
                    console.log('当前是开门状态，切换到关门状态');
                    // 切换图片为关门.png
                    doorImage.style.opacity = '0';
                    setTimeout(() => {
                        doorImage.src = '关门.png';
                        doorImage.style.opacity = '1';
                        console.log('门已切换为关门状态');
                        // 切换完成后移除标记
                        setTimeout(() => {
                            doorImage.removeAttribute('data-switching');
                            console.log('门切换完成，移除锁定');
                        }, 1000);
                    }, 300);
                }
                else if (isClosedDoor) {
                    console.log('当前是关门状态，切换到开门状态');
                    // 切换图片为开门.png
                    doorImage.style.opacity = '0';
                    setTimeout(() => {
                        doorImage.src = '开门.png';
                        doorImage.style.opacity = '1';
                        console.log('门已切换为开门状态');
                        // 切换完成后移除标记
                        setTimeout(() => {
                            doorImage.removeAttribute('data-switching');
                            console.log('门切换完成，移除锁定');
                        }, 1000);
                        
                        // 门打开后2秒进入第四面
                        setTimeout(() => {
                            console.log('门已打开2秒，准备进入第四面');
                            transitionToFourthScene();
                        }, 2000);
                    }, 300);
                }
                else {
                    console.log('无法识别门状态，默认切换到开门状态');
                    // 如果无法识别状态，默认设置为开门
                    doorImage.style.opacity = '0';
                    setTimeout(() => {
                        doorImage.src = '开门.png';
                        doorImage.style.opacity = '1';
                        console.log('门已设置为开门状态');
                        setTimeout(() => {
                            doorImage.removeAttribute('data-switching');
                            console.log('门切换完成，移除锁定');
                        }, 1000);
                        
                        // 门打开后2秒进入第四面
                        setTimeout(() => {
                            console.log('门已打开2秒，准备进入第四面');
                            transitionToFourthScene();
                        }, 2000);
                    }, 300);
                }
            }
            
            // 更新碰撞状态
            doorImage.setAttribute('data-last-collision', isColliding.toString());
        }

        // 更新角色图片和动画
        function updateCharacterImage() {
            if (moveKeys.w) {
                characterImg.src = 'U/UW.png';
            } else if (moveKeys.a) {
                characterImg.src = 'U/UA.png';
            } else if (moveKeys.d) {
                characterImg.src = 'U/UD.png';
            } else {
                characterImg.src = '6.png';
            }

            if (moveKeys.w || moveKeys.a || moveKeys.s || moveKeys.d) {
                characterImg.classList.add('walking');
            } else {
                characterImg.classList.remove('walking');
            }
        }

        // 键盘事件处理
        function keydownHandler(event) {
            const key = event.key.toLowerCase();
            let keyChanged = false;
            
            if ((key === 'w' || key === 'arrowup') && !moveKeys.w) {
                moveKeys.w = true;
                keyChanged = true;
            }
            if ((key === 's' || key === 'arrowdown') && !moveKeys.s) {
                moveKeys.s = true;
                keyChanged = true;
            }
            if ((key === 'a' || key === 'arrowleft') && !moveKeys.a) {
                moveKeys.a = true;
                keyChanged = true;
            }
            if ((key === 'd' || key === 'arrowright') && !moveKeys.d) {
                moveKeys.d = true;
                keyChanged = true;
            }
            
            if (keyChanged) {
                updateCharacterImage();
            }
            
            if (!isMoving && (moveKeys.w || moveKeys.s || moveKeys.a || moveKeys.d)) {
                isMoving = true;
                moveSound.play().catch(error => {
                    console.log('音效播放失败:', error);
                });
            }
        }

        function keyupHandler(event) {
            const key = event.key.toLowerCase();
            let keyChanged = false;
            
            if ((key === 'w' || key === 'arrowup') && moveKeys.w) {
                moveKeys.w = false;
                keyChanged = true;
            }
            if ((key === 's' || key === 'arrowdown') && moveKeys.s) {
                moveKeys.s = false;
                keyChanged = true;
            }
            if ((key === 'a' || key === 'arrowleft') && moveKeys.a) {
                moveKeys.a = false;
                keyChanged = true;
            }
            if ((key === 'd' || key === 'arrowright') && moveKeys.d) {
                moveKeys.d = false;
                keyChanged = true;
            }
            
            if (keyChanged) {
                updateCharacterImage();
            }
            
            if (isMoving && !moveKeys.w && !moveKeys.s && !moveKeys.a && !moveKeys.d) {
                isMoving = false;
                moveSound.pause();
                moveSound.currentTime = 0;
            }
        }

        // 窗口焦点事件处理
        function handleWindowBlur() {
            resetAllKeys();
            updateCharacterImage();
            // 确保发光效果保持
            if (character.dataset.uploadedImage && !character.classList.contains('glowing')) {
                character.classList.add('glowing');
            }
        }
        
        // 窗口获焦时重置按键
        function handleWindowFocus() {
            resetAllKeys();
            updateCharacterImage();
            // 确保发光效果保持
            if (character.dataset.uploadedImage && !character.classList.contains('glowing')) {
                character.classList.add('glowing');
            }
        }

        // 页面可见性变化时重置按键
        function handleVisibilityChange() {
            if (document.hidden) {
                resetAllKeys();
                updateCharacterImage();
            } else {
                // 页面重新可见时确保发光效果保持
                if (character.dataset.uploadedImage && !character.classList.contains('glowing')) {
                    character.classList.add('glowing');
                }
            }
        }

        // 添加事件监听器
        document.addEventListener('keydown', keydownHandler);
        document.addEventListener('keyup', keyupHandler);
        window.addEventListener('blur', handleWindowBlur);
        window.addEventListener('focus', handleWindowFocus);
        document.addEventListener('visibilitychange', handleVisibilityChange);

        // 初始化语音识别
        function initSpeechRecognition() {
            if (!recognition && 'webkitSpeechRecognition' in window) {
                recognition = new webkitSpeechRecognition();
                recognition.continuous = true;
                recognition.interimResults = false;
                recognition.lang = 'en-US';

                recognition.onstart = function() {
                    console.log('第三面语音识别开始');
                    // 语音识别开始时重置按键状态
                    resetAllKeys();
                    updateCharacterImage();
                };

                recognition.onresult = function(event) {
                    const transcript = event.results[event.results.length - 1][0].transcript.toLowerCase().trim();
                    console.log('第三面识别到:', transcript);

                    // 检查是否匹配目标短语
                    if (
                        transcript.includes('gail') ||
                        transcript.includes('gale') ||
                        transcript.includes('gel') ||
                        transcript.includes('girl') ||
                        transcript.includes('gal') ||
                        transcript.includes('gayle') ||
                        transcript.includes('gael') ||
                        transcript.includes('kale') ||
                        transcript.includes('scale') ||
                        // garlic及其变体
                        transcript.includes('garlic') ||
                        transcript.includes('garlick') ||
                        transcript.includes('garlik') ||
                        transcript.includes('garlique') ||
                        transcript.includes('gaelic') ||
                        transcript.includes('garling') ||
                        transcript.includes('garlit') ||
                        transcript.includes('garlex') ||
                        transcript.includes('garlec') ||
                        transcript.includes('golic') ||
                        transcript.includes('gallic') ||
                        // gully及其变体
                        transcript.includes('gully') ||
                        transcript.includes('gulley') ||
                        transcript.includes('gulli') ||
                        transcript.includes('galli') ||
                        transcript.includes('golly') ||
                        transcript.includes('gally') ||
                        transcript.includes('guli') ||
                        // Carly及其变体
                        transcript.includes('carly') ||
                        transcript.includes('carley') ||
                        transcript.includes('karli') ||
                        transcript.includes('karly') ||
                        transcript.includes('carlie') ||
                        transcript.includes('karley') ||
                        transcript.includes('carli') ||
                        transcript.includes('cali') ||
                        transcript.includes('calli') ||
                        // garley及其变体
                        transcript.includes('garley') ||
                        transcript.includes('garly') ||
                        transcript.includes('garli') ||
                        transcript.includes('garlay') ||
                        transcript.includes('girly') ||
                        transcript.includes('gurley') ||
                        transcript.includes('garlie') ||
                        transcript.includes('gahley') ||
                        transcript.includes('gawley') ||
                        // co开头的单词
                        transcript.includes('come') ||
                        transcript.includes('go') ||
                        transcript.includes('call') ||
                        transcript.includes('cool') ||
                        transcript.includes('cold') ||
                        transcript.includes('code') ||
                        transcript.includes('coat') ||
                        transcript.includes('coin') ||
                        transcript.includes('copy') ||
                        transcript.includes('core') ||
                        transcript.includes('cost') ||
                        transcript.includes('count') ||
                        transcript.includes('court') ||
                        transcript.includes('cover') ||
                        transcript.includes('color') ||
                        transcript.includes('could') ||
                        transcript.includes('course') ||
                        transcript.includes('coffee') ||
                        transcript.includes('corner') ||
                        transcript.includes('control') ||
                        transcript.includes('company') ||
                        transcript.includes('computer') ||
                        transcript.includes('complete') ||
                        transcript.includes('continue') ||
                        transcript.includes('consider') ||
                        // go开头的单词
                        transcript.includes('good') ||
                        transcript.includes('great') ||
                        transcript.includes('green') ||
                        transcript.includes('group') ||
                        transcript.includes('grow') ||
                        transcript.includes('ground') ||
                        transcript.includes('give') ||
                        transcript.includes('girl') ||
                        transcript.includes('game') ||
                        transcript.includes('get') ||
                        transcript.includes('god') ||
                        transcript.includes('gold') ||
                        transcript.includes('goal') ||
                        transcript.includes('gone') ||
                        transcript.includes('got') ||
                        transcript.includes('government') ||
                        transcript.includes('going') ||
                        transcript.includes('google') ||
                        transcript.includes('global') ||
                        transcript.includes('general') ||
                        transcript.includes('garden') ||
                        transcript.includes('glass') ||
                        transcript.includes('grade') ||
                        transcript.includes('grand') ||
                        transcript.includes('guess') ||
                        transcript.includes('guide') ||
                        transcript.includes('guitar') ||
                        transcript.includes('guy') ||
                        transcript.includes('gym') ||
                        // ga开头的单词
                        transcript.includes('game') ||
                        transcript.includes('garden') ||
                        transcript.includes('gas') ||
                        transcript.includes('gate') ||
                        transcript.includes('gather') ||
                        transcript.includes('gave') ||
                        transcript.includes('gap') ||
                        transcript.includes('garage') ||
                        transcript.includes('garbage') ||
                        transcript.includes('galaxy') ||
                        transcript.includes('gallery') ||
                        transcript.includes('gain') ||
                        transcript.includes('gang') ||
                        transcript.includes('gap') ||
                        transcript.includes('garage') ||
                        transcript.includes('garbage') ||
                        transcript.includes('garden') ||
                        transcript.includes('garlic') ||
                        transcript.includes('gas') ||
                        transcript.includes('gate') ||
                        transcript.includes('gather') ||
                        transcript.includes('gave') ||
                        transcript.includes('gay') ||
                        transcript.includes('gaze') ||
                        transcript.includes('gear') ||
                        transcript.includes('general') ||
                        transcript.includes('gentle') ||
                        transcript.includes('get') ||
                        transcript.includes('giant') ||
                        transcript.includes('gift') ||
                        transcript.includes('girl') ||
                        transcript.includes('give') ||
                        transcript.includes('glad') ||
                        transcript.includes('glass') ||
                        transcript.includes('global') ||
                        transcript.includes('glory') ||
                        transcript.includes('glove') ||
                        transcript.includes('goal') ||
                        transcript.includes('goat') ||
                        transcript.includes('god') ||
                        transcript.includes('gold') ||
                        transcript.includes('golf') ||
                        transcript.includes('gone') ||
                        transcript.includes('good') ||
                        transcript.includes('google') ||
                        transcript.includes('got') ||
                        transcript.includes('government') ||
                        transcript.includes('grab') ||
                        transcript.includes('grace') ||
                        transcript.includes('grade') ||
                        transcript.includes('grand') ||
                        transcript.includes('grant') ||
                        transcript.includes('grass') ||
                        transcript.includes('grave') ||
                        transcript.includes('gray') ||
                        transcript.includes('great') ||
                        transcript.includes('green') ||
                        transcript.includes('greet') ||
                        transcript.includes('grew') ||
                        transcript.includes('grid') ||
                        transcript.includes('grin') ||
                        transcript.includes('grip') ||
                        transcript.includes('gross') ||
                        transcript.includes('ground') ||
                        transcript.includes('group') ||
                        transcript.includes('grow') ||
                        transcript.includes('guard') ||
                        transcript.includes('guess') ||
                        transcript.includes('guest') ||
                        transcript.includes('guide') ||
                        transcript.includes('guilt') ||
                        transcript.includes('guitar') ||
                        transcript.includes('gun') ||
                        transcript.includes('guy') ||
                        transcript.includes('gym') ||
                        // ka开头的单词
                        transcript.includes('ka') ||
                        transcript.includes('can') ||
                        transcript.includes('car') ||
                        transcript.includes('cat') ||
                        transcript.includes('call') ||
                        transcript.includes('came') ||
                        transcript.includes('case') ||
                        transcript.includes('cash') ||
                        transcript.includes('cast') ||
                        transcript.includes('catch') ||
                        transcript.includes('cause') ||
                        transcript.includes('cave') ||
                        transcript.includes('cake') ||
                        transcript.includes('calm') ||
                        transcript.includes('camp') ||
                        transcript.includes('card') ||
                        transcript.includes('care') ||
                        transcript.includes('carry') ||
                        transcript.includes('cap') ||
                        transcript.includes('captain') ||
                        transcript.includes('camera') ||
                        transcript.includes('canada') ||
                        transcript.includes('cancel') ||
                        transcript.includes('cancer') ||
                        transcript.includes('candidate') ||
                        transcript.includes('candle') ||
                        transcript.includes('candy') ||
                        transcript.includes('canvas') ||
                        transcript.includes('capable') ||
                        transcript.includes('capacity') ||
                        transcript.includes('capital') ||
                        transcript.includes('capture') ||
                        transcript.includes('carbon') ||
                        transcript.includes('career') ||
                        transcript.includes('careful') ||
                        transcript.includes('carpet') ||
                        transcript.includes('carrot') ||
                        transcript.includes('cartoon') ||
                        transcript.includes('casual') ||
                        transcript.includes('catalog') ||
                        transcript.includes('category') ||
                        transcript.includes('cattle') ||
                        transcript.includes('caught') ||
                        transcript.includes('caution') ||
                        transcript.includes('ceiling') ||
                        transcript.includes('celebrate') ||
                        transcript.includes('cell') ||
                        transcript.includes('center') ||
                        transcript.includes('central') ||
                        transcript.includes('century') ||
                        transcript.includes('ceremony') ||
                        transcript.includes('certain') ||
                        transcript.includes('chain') ||
                        transcript.includes('chair') ||
                        transcript.includes('challenge') ||
                        transcript.includes('champion') ||
                        transcript.includes('chance') ||
                        transcript.includes('change') ||
                        transcript.includes('channel') ||
                        transcript.includes('chapter') ||
                        transcript.includes('character') ||
                        transcript.includes('charge') ||
                        transcript.includes('charity') ||
                        transcript.includes('chart') ||
                        transcript.includes('chase') ||
                        transcript.includes('cheap') ||
                        transcript.includes('check') ||
                        transcript.includes('cheese') ||
                        transcript.includes('chemical') ||
                        transcript.includes('chest') ||
                        transcript.includes('chicken') ||
                        transcript.includes('chief') ||
                        transcript.includes('child') ||
                        transcript.includes('choice') ||
                        transcript.includes('choose') ||
                        transcript.includes('church') ||
                        transcript.includes('circle') ||
                        transcript.includes('citizen') ||
                        transcript.includes('city') ||
                        transcript.includes('civil') ||
                        transcript.includes('claim') ||
                        transcript.includes('class') ||
                        transcript.includes('classic') ||
                        transcript.includes('clean') ||
                        transcript.includes('clear') ||
                        transcript.includes('click') ||
                        transcript.includes('client') ||
                        transcript.includes('climate') ||
                        transcript.includes('climb') ||
                        transcript.includes('clock') ||
                        transcript.includes('close') ||
                        transcript.includes('cloud') ||
                        transcript.includes('club') ||
                        transcript.includes('coach') ||
                        transcript.includes('coast') ||
                        transcript.includes('coat') ||
                        transcript.includes('code') ||
                        transcript.includes('coffee') ||
                        transcript.includes('coin') ||
                        transcript.includes('cold') ||
                        transcript.includes('collect') ||
                        transcript.includes('college') ||
                        transcript.includes('color') ||
                        transcript.includes('column') ||
                        transcript.includes('combine') ||
                        transcript.includes('come') ||
                        transcript.includes('comfort') ||
                        transcript.includes('command') ||
                        transcript.includes('comment') ||
                        transcript.includes('common') ||
                        transcript.includes('community') ||
                        transcript.includes('company') ||
                        transcript.includes('compare') ||
                        transcript.includes('compete') ||
                        transcript.includes('complete') ||
                        transcript.includes('computer') ||
                        transcript.includes('concept') ||
                        transcript.includes('concern') ||
                        transcript.includes('condition') ||
                        transcript.includes('conference') ||
                        transcript.includes('confirm') ||
                        transcript.includes('conflict') ||
                        transcript.includes('connect') ||
                        transcript.includes('consider') ||
                        transcript.includes('consist') ||
                        transcript.includes('constant') ||
                        transcript.includes('contact') ||
                        transcript.includes('contain') ||
                        transcript.includes('content') ||
                        transcript.includes('contest') ||
                        transcript.includes('context') ||
                        transcript.includes('continue') ||
                        transcript.includes('contract') ||
                        transcript.includes('control') ||
                        transcript.includes('convert') ||
                        transcript.includes('cook') ||
                        transcript.includes('cool') ||
                        transcript.includes('copy') ||
                        transcript.includes('core') ||
                        transcript.includes('corn') ||
                        transcript.includes('corner') ||
                        transcript.includes('correct') ||
                        transcript.includes('cost') ||
                        transcript.includes('cotton') ||
                        transcript.includes('could') ||
                        transcript.includes('council') ||
                        transcript.includes('count') ||
                        transcript.includes('country') ||
                        transcript.includes('county') ||
                        transcript.includes('couple') ||
                        transcript.includes('course') ||
                        transcript.includes('court') ||
                        transcript.includes('cover') ||
                        transcript.includes('create') ||
                        transcript.includes('credit') ||
                        transcript.includes('crime') ||
                        transcript.includes('crisis') ||
                        transcript.includes('critical') ||
                        transcript.includes('cross') ||
                        transcript.includes('crowd') ||
                        transcript.includes('crown') ||
                        transcript.includes('crucial') ||
                        transcript.includes('cry') ||
                        transcript.includes('culture') ||
                        transcript.includes('cup') ||
                        transcript.includes('current') ||
                        transcript.includes('curve') ||
                        transcript.includes('custom') ||
                        transcript.includes('customer') ||
                        transcript.includes('cut') ||
                        transcript.includes('cycle') ||
                        // k开头的单词
                        transcript.includes('k') ||
                        transcript.includes('key') ||
                        transcript.includes('keep') ||
                        transcript.includes('kept') ||
                        transcript.includes('kick') ||
                        transcript.includes('kid') ||
                        transcript.includes('kill') ||
                        transcript.includes('kind') ||
                        transcript.includes('king') ||
                        transcript.includes('kiss') ||
                        transcript.includes('kit') ||
                        transcript.includes('kitchen') ||
                        transcript.includes('knee') ||
                        transcript.includes('knife') ||
                        transcript.includes('knock') ||
                        transcript.includes('know') ||
                        transcript.includes('known') ||
                        transcript.includes('knowledge') ||
                        transcript.includes('keyboard') ||
                        transcript.includes('keyword') ||
                        transcript.includes('kick') ||
                        transcript.includes('kidney') ||
                        transcript.includes('kilometer') ||
                        transcript.includes('kingdom') ||
                        transcript.includes('kite') ||
                        transcript.includes('kitten') ||
                        transcript.includes('kneel') ||
                        transcript.includes('knit') ||
                        transcript.includes('knot') ||
                        transcript.includes('korea') ||
                        transcript.includes('korean')
                    ) {
                        generateCircle();
                    }
                };

                recognition.onerror = function(event) {
                    console.error('语音识别错误:', event.error);
                    // 发生错误时重置按键状态
                    resetAllKeys();
                    updateCharacterImage();
                    
                    if (event.error === 'not-allowed') {
                        console.log('麦克风权限被拒绝');
                        isRecognizing = false;
                    }
                };

                recognition.onend = function() {
                    console.log('语音识别结束');
                    
                    // 检查第三面是否已经结束
                    if (window.thirdSceneEnded) {
                        console.log('第三面已结束，不重启语音识别');
                        return;
                    }
                    
                    // 语音识别结束时重置按键状态
                    resetAllKeys();
                    updateCharacterImage();
                    
                    if (isRecognizing && !window.thirdSceneEnded) {
                        setTimeout(() => {
                            // 再次检查第三面是否已经结束
                            if (window.thirdSceneEnded) {
                                console.log('第三面已结束，取消重启语音识别');
                                return;
                            }
                            
                            try {
                                recognition.start();
                            } catch (e) {
                                console.log('重启语音识别失败:', e);
                                resetAllKeys();
                                updateCharacterImage();
                            }
                        }, 1000);
                    }
                };

                // 开始识别
                isRecognizing = true;
                try {
                    recognition.start();
                } catch (e) {
                    console.log('启动语音识别失败:', e);
                    resetAllKeys();
                    updateCharacterImage();
                }
            }
        }

        // 移动更新循环
        function updateMovement() {
            // 检查第三面是否已经结束
            if (window.thirdSceneEnded) {
                console.log('第三面已结束，停止移动循环');
                return;
            }

            let newX = characterPos.x;
            let newY = characterPos.y;

            // 计算新位置
            if (moveKeys.w && characterPos.y < 90) newY += moveSpeed;
            if (moveKeys.s && characterPos.y > 5) newY -= moveSpeed;
            if (moveKeys.a && characterPos.x > 0) newX -= moveSpeed;
            if (moveKeys.d && characterPos.x < 90) newX += moveSpeed;

            // 检查场景容器是否还存在
            const sceneContainer = document.querySelector('.scene-three-container');
            if (!sceneContainer) {
                console.log('第三面容器不存在，停止移动循环');
                return;
            }

            // 临时更新位置以检查安全区域
            const tempCharacter = character.cloneNode(true);
            tempCharacter.style.left = `${newX}%`;
            tempCharacter.style.bottom = `${newY}%`;
            tempCharacter.style.opacity = '0';
            sceneContainer.appendChild(tempCharacter);

            const tempRect = tempCharacter.getBoundingClientRect();
            sceneContainer.removeChild(tempCharacter);

            // 检查新位置是否安全
            if (isInSafeArea(tempRect)) {
                // 如果安全，更新位置
                characterPos.x = newX;
                characterPos.y = newY;
                character.style.left = `${characterPos.x}%`;
                character.style.bottom = `${characterPos.y}%`;
            } else {
                // 如果不安全，返回初始位置
                characterPos.x = 5;
                characterPos.y = 50;
                character.style.left = '5%';
                character.style.bottom = '50%';
            }

            // 检查圆形碰撞（视觉效果）
            checkCircleCollision();
            
            // 检查门的碰撞
            checkDoorCollision();
            
            // 继续循环，但先检查是否应该停止
            if (!window.thirdSceneEnded) {
                animationFrameId = requestAnimationFrame(updateMovement);
            }
        }
        
        // 开始移动循环
        updateMovement();

        // 初始化语音识别
        initSpeechRecognition();

        // 返回清理函数
        return function cleanup() {
            document.removeEventListener('keydown', keydownHandler);
            document.removeEventListener('keyup', keyupHandler);
            window.removeEventListener('blur', handleWindowBlur);
            window.removeEventListener('focus', handleWindowFocus);
            document.removeEventListener('visibilitychange', handleVisibilityChange);
            
            if (moveSound) {
                moveSound.pause();
                moveSound.currentTime = 0;
            }
            
            if (recognition) {
                isRecognizing = false;
                try {
                    recognition.stop();
                } catch (e) {
                    console.log('停止语音识别失败:', e);
                }
                recognition = null;
            }
            resetAllKeys();
        };
    }

    // 在圆形内生成花
    function generateFlowerInCircle(circle) {
        // 生成多朵花（5-10朵）
        const flowerCount = Math.floor(Math.random() * 6) + 5; // 5-10朵花
        
        for (let i = 0; i < flowerCount; i++) {
            // 随机选择1.png或2.png
            const flowerType = Math.random() < 0.5 ? '1.png' : '2.png';
            
            // 获取圆形的位置和大小
            const circleRect = circle.getBoundingClientRect();
            const containerRect = document.querySelector('.scene-three-container').getBoundingClientRect();
            
            // 计算圆形的中心点（相对于容器）
            const circleCenterX = (circleRect.left - containerRect.left + circleRect.width / 2) / containerRect.width * 100;
            const circleCenterY = (containerRect.bottom - circleRect.bottom + circleRect.height / 2) / containerRect.height * 100;
            
            // 在圆形内随机生成花的位置
            const radius = circleRect.width / 2;
            const angle = Math.random() * 2 * Math.PI;
            const distance = Math.random() * (radius - 20); // 留一些边距
            
            const flowerX = circleCenterX + (distance * Math.cos(angle)) / containerRect.width * 100;
            const flowerY = circleCenterY + (distance * Math.sin(angle)) / containerRect.height * 100;
            
            // 创建花的元素
            const flower = document.createElement('img');
            flower.src = flowerType;
            flower.className = 'flower';
            flower.style.cssText = `
                position: absolute;
                left: ${flowerX}%;
                bottom: ${flowerY}%;
                width: 30px;
                height: 30px;
                z-index: 15;
                pointer-events: none;
                opacity: 0;
                transform: scale(0);
                transition: all 0.3s ease;
            `;
            
            document.querySelector('.scene-three-container').appendChild(flower);
            
            // 添加出现动画，每朵花有略微的延迟
            setTimeout(() => {
                requestAnimationFrame(() => {
                    flower.style.opacity = '1';
                    flower.style.transform = 'scale(1)';
                });
            }, i * 100); // 每朵花延迟100ms出现
        }
        
        // 标记这个圆已经生成过花
        circle.setAttribute('data-has-flower', 'true');
    }

    // 转换到第四面
    function transitionToFourthScene() {
        console.log('开始转换到第四面');
        
        // 调用第三面的清理函数
        if (window.thirdSceneCleanup) {
            console.log('调用第三面清理函数');
            window.thirdSceneCleanup();
            window.thirdSceneCleanup = null;
        }
        
        // 立即清理第三面的所有活动
        cleanupThirdScene();
        
        // 添加下滑动画
        const sceneContainer = document.querySelector('.scene-three-container');
        if (sceneContainer) {
            sceneContainer.style.transition = 'transform 1s ease-in-out';
            sceneContainer.style.transform = 'translateY(100vh)';
            
            // 动画完成后创建第四面
            setTimeout(() => {
                createFourthScene();
            }, 1000);
        } else {
            // 如果没有找到容器，直接创建第四面
            createFourthScene();
        }
    }

    // 清理第三面的所有活动
    function cleanupThirdScene() {
        console.log('清理第三面的所有活动');
        
        // 停止语音识别
        if (typeof recognition !== 'undefined' && recognition) {
            try {
                recognition.stop();
                recognition.abort();
            } catch (e) {
                console.log('停止语音识别时出错:', e);
            }
            recognition = null;
        }
        
        // 清理全局变量
        if (typeof isRecognizing !== 'undefined') {
            isRecognizing = false;
        }
        
        // 停止所有音频
        const allAudios = document.querySelectorAll('audio');
        allAudios.forEach(audio => {
            try {
                audio.pause();
                audio.currentTime = 0;
                audio.src = '';
            } catch (e) {
                console.log('停止音频时出错:', e);
            }
        });
        
        // 清理所有定时器（通过重写setTimeout和setInterval的方式无法完全清理，但可以标记状态）
        // 设置一个全局标记，表示第三面已经结束
        window.thirdSceneEnded = true;
        
        // 移除所有事件监听器
        try {
            // 移除键盘事件
            document.removeEventListener('keydown', keydownHandler);
            document.removeEventListener('keyup', keyupHandler);
            
            // 移除窗口事件
            window.removeEventListener('blur', handleWindowBlur);
            window.removeEventListener('focus', handleWindowFocus);
            document.removeEventListener('visibilitychange', handleVisibilityChange);
            
            // 移除点击事件
            const georgian1 = document.querySelector('.georgian-1');
            if (georgian1) {
                georgian1.removeEventListener('click', georgian1.clickHandler);
            }
        } catch (e) {
            console.log('移除事件监听器时出错:', e);
        }
        
        // 停止requestAnimationFrame循环
        if (typeof animationFrameId !== 'undefined' && animationFrameId) {
            cancelAnimationFrame(animationFrameId);
        }
        
        // 清理所有动画和过渡
        const allElements = document.querySelectorAll('*');
        allElements.forEach(element => {
            try {
                element.style.transition = 'none';
                element.style.animation = 'none';
            } catch (e) {
                // 忽略错误
            }
        });
        
        console.log('第三面清理完成');
    }

    // 创建第四面
    function createFourthScene() {
        console.log('创建第四面');
        
        // 确保第三面完全结束
        window.thirdSceneEnded = true;
        
        // 清除第三面内容
        document.body.innerHTML = '';
        
        // 清理所有可能残留的样式
        const existingStyles = document.querySelectorAll('style');
        existingStyles.forEach(style => {
            if (style.textContent.includes('.scene-three-container') || 
                style.textContent.includes('.georgian-') || 
                style.textContent.includes('.generated-circle')) {
                style.remove();
            }
        });
        
        // 创建第四面的HTML结构
        const fourthSceneHTML = `
            <div class="scene-four-container">
                <div class="text-container">
                    <div class="arabic-text">لا تتحدث</div>
                    <div class="chinese-text">不要说话</div>
                </div>
                <div class="character-area">
                    <img src="6.png" alt="主角" class="character-fourth">
                </div>
            </div>
        `;
        
        document.body.innerHTML = fourthSceneHTML;
        
        // 添加第四面的样式
        addFourthSceneStyles();
        
        // 初始化第四面
        initFourthScene();
    }

    // 添加第四面的样式
    function addFourthSceneStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .scene-four-container {
                width: 100vw;
                height: 100vh;
                background-color: #322030;
                position: relative;
                overflow: hidden;
            }

            .character-area {
                position: absolute;
                z-index: 30;
            }

            .character-fourth {
                width: 60px;
                height: 95px;
                filter: brightness(0) saturate(100%) invert(85%) sepia(8%) saturate(1234%) hue-rotate(64deg) brightness(95%) contrast(89%);
                animation: float 2s ease-in-out infinite;
                transition: all 0.3s ease;
            }

            .character-fourth.walking {
                animation: walk 0.5s ease-in-out infinite;
            }

            @keyframes float {
                0%, 100% { transform: translateY(0px); }
                50% { transform: translateY(-10px); }
            }

            @keyframes walk {
                0%, 100% { transform: translateY(0px) scale(1); }
                50% { transform: translateY(-5px) scale(1.05); }
            }

            .text-container {
                position: absolute;
                top: 20%;
                left: 50%;
                transform: translateX(-50%);
                text-align: center;
                z-index: 10;
            }

            .arabic-text {
                font-size: 48px;
                color: #D5E6D4;
                font-weight: normal;
                margin-bottom: 20px;
                font-family: Arial, sans-serif;
                transition: all 0.3s ease;
                cursor: pointer;
            }

            .arabic-text:hover {
                text-shadow: 0 0 20px #D5E6D4, 0 0 40px #D5E6D4;
            }

            .chinese-text {
                font-size: 32px;
                color: #D5E6D4;
                font-weight: normal;
                font-family: Arial, sans-serif;
                opacity: 0;
                transition: opacity 0.5s ease;
            }

            .chinese-text.fade-in {
                opacity: 1;
            }
        `;
        document.head.appendChild(style);
        
        console.log('第四面样式已添加');
    }

    // 初始化第四面
    function initFourthScene() {
        console.log('第四面初始化完成');
        
        // 初始化主角移动系统并保存清理函数
        window.fourthSceneCleanup = initFourthSceneCharacterMovement();
        
        // 5秒后让中文文字淡入显示
        setTimeout(() => {
            const chineseText = document.querySelector('.chinese-text');
            if (chineseText) {
                chineseText.classList.add('fade-in');
                console.log('中文文字开始淡入显示');
            }
        }, 5000);
        
        // 初始化麦克风监听
        initMicrophoneMonitoring();
        
        // 添加第四面的跳转按钮
        addSceneSkipButton(4, transitionToFifthScene);
    }

    // 人声检测功能
    function initMicrophoneMonitoring() {
        let recognition;
        let speechTimer;
        let isRecognizing = false;
        const speechTimeout = 10000; // 10秒
        
        console.log('开始初始化人声检测');
        
        // 检查浏览器是否支持语音识别
        if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
            console.error('浏览器不支持语音识别，直接开始10秒倒计时');
            startSpeechTimer();
            return;
        }
        
        // 创建语音识别实例
        recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = 'zh-CN'; // 设置为中文，但会检测多种语言
        
        // 开始人声检测计时器
        startSpeechTimer();
        
        recognition.onstart = function() {
            console.log('人声检测已启动');
            isRecognizing = true;
        };
        
        recognition.onresult = function(event) {
            let hasResult = false;
            
            // 检查是否有任何识别结果（不论语言）
            for (let i = event.resultIndex; i < event.results.length; i++) {
                if (event.results[i][0].transcript.trim()) {
                    hasResult = true;
                    console.log('检测到人声:', event.results[i][0].transcript);
                    break;
                }
            }
            
            if (hasResult) {
                // 检测到人声，重置计时器
                resetSpeechTimer();
            }
        };
        
        recognition.onspeechstart = function() {
            console.log('检测到语音开始');
            resetSpeechTimer();
        };
        
        recognition.onspeechend = function() {
            console.log('语音结束');
        };
        
        recognition.onerror = function(event) {
            console.error('语音识别错误:', event.error);
            
            if (event.error === 'not-allowed') {
                console.log('麦克风权限被拒绝，直接开始10秒倒计时');
                isRecognizing = false;
                startSpeechTimer();
            } else if (event.error === 'no-speech') {
                console.log('未检测到语音');
                // 继续监听，不重置计时器
            }
        };
        
        recognition.onend = function() {
            console.log('语音识别结束');
            
            // 检查第四面是否已经结束
            if (window.fourthSceneEnded) {
                console.log('第四面已结束，不重启语音识别');
                return;
            }
            
            if (isRecognizing && !window.fourthSceneEnded) {
                setTimeout(() => {
                    // 再次检查第四面是否已经结束
                    if (window.fourthSceneEnded) {
                        console.log('第四面已结束，取消重启语音识别');
                        return;
                    }
                    
                    try {
                        recognition.start();
                    } catch (e) {
                        console.log('重启语音识别失败:', e);
                    }
                }, 1000);
            }
        };
        
        // 开始识别
        try {
            recognition.start();
        } catch (e) {
            console.log('启动语音识别失败:', e);
            startSpeechTimer();
        }
        
        // 开始人声检测计时器
        function startSpeechTimer() {
            console.log('开始10秒人声检测计时器');
            speechTimer = setTimeout(() => {
                console.log('10秒内未检测到人声，切换到第五面');
                transitionToFifthScene();
            }, speechTimeout);
        }
        
        // 重置人声检测计时器
        function resetSpeechTimer() {
            console.log('检测到人声，重置计时器');
            if (speechTimer) {
                clearTimeout(speechTimer);
            }
            startSpeechTimer();
        }
        
        // 停止监听
        function stopMonitoring() {
            console.log('开始停止第四面麦克风监听');
            isRecognizing = false;
            
            // 清理计时器
            if (speechTimer) {
                clearTimeout(speechTimer);
                speechTimer = null;
            }
            
            // 停止语音识别
            if (recognition) {
                try {
                    recognition.abort(); // 使用abort而不是stop，更强制
                    recognition.onstart = null;
                    recognition.onresult = null;
                    recognition.onspeechstart = null;
                    recognition.onspeechend = null;
                    recognition.onerror = null;
                    recognition.onend = null;
                } catch (e) {
                    console.log('停止语音识别失败:', e);
                }
                recognition = null;
            }
            
            console.log('第四面麦克风监听已完全停止');
        }
        
        // 将停止函数暴露给全局，以便在场景切换时调用
        window.stopMicrophoneMonitoring = stopMonitoring;
    }

    // 切换到第五面
    function transitionToFifthScene() {
        console.log('开始切换到第五面');
        
        // 标记第四面结束（优先设置，防止语音识别重启）
        window.fourthSceneEnded = true;
        
        // 停止麦克风监听
        if (window.stopMicrophoneMonitoring) {
            console.log('停止第四面麦克风监听');
            window.stopMicrophoneMonitoring();
            window.stopMicrophoneMonitoring = null;
        }
        
        // 调用第四面的清理函数
        if (window.fourthSceneCleanup) {
            console.log('调用第四面清理函数');
            window.fourthSceneCleanup();
            window.fourthSceneCleanup = null;
        }
        
        // 清理第四面相关的全局变量
        cleanupFourthScene();
        
        // 使用下滑切换动画
        const sceneContainer = document.querySelector('.scene-four-container');
        if (sceneContainer) {
            // 添加下滑切换动画
            sceneContainer.style.transition = 'transform 1.5s ease-in-out';
            sceneContainer.style.transform = 'translateY(-100vh)';
            
            // 1.5秒后创建第五面
            setTimeout(() => {
                createFifthScene();
            }, 1500);
        } else {
            // 如果容器不存在，直接创建第五面
            createFifthScene();
        }
    }

    // 清理第四面
    function cleanupFourthScene() {
        console.log('清理第四面资源');
        
        // 清理所有第四面相关的事件监听器
        document.removeEventListener('keydown', window.fourthSceneKeydownHandler);
        document.removeEventListener('keyup', window.fourthSceneKeyupHandler);
        window.removeEventListener('blur', window.fourthSceneBlurHandler);
        window.removeEventListener('focus', window.fourthSceneFocusHandler);
        document.removeEventListener('visibilitychange', window.fourthSceneVisibilityHandler);
        
        // 清理全局变量
        window.fourthSceneKeydownHandler = null;
        window.fourthSceneKeyupHandler = null;
        window.fourthSceneBlurHandler = null;
        window.fourthSceneFocusHandler = null;
        window.fourthSceneVisibilityHandler = null;
        
        // 清理第四面的样式
        const existingStyles = document.querySelectorAll('style');
        existingStyles.forEach(style => {
            if (style.textContent.includes('.scene-four-container') || 
                style.textContent.includes('.character-fourth') ||
                style.textContent.includes('.text-container') ||
                style.textContent.includes('.arabic-text') ||
                style.textContent.includes('.chinese-text')) {
                style.remove();
            }
        });
        
        console.log('第四面资源清理完成');
    }



    // 创建第五面
    function createFifthScene() {
        console.log('创建第五面');
        
        // 先添加第五面的样式
        addFifthSceneStyles();
        
        // 创建第五面的HTML结构，但先隐藏
        const fifthSceneHTML = `
            <div class="scene-five-container" style="opacity: 0;">
                <div class="character-area">
                    <img src="6.png" alt="主角" class="character-fifth">
                </div>
            </div>
        `;
        
        // 先创建第五面内容但保持隐藏
        document.body.insertAdjacentHTML('beforeend', fifthSceneHTML);
        
        // 短暂延迟后移除第四面内容并显示第五面
        setTimeout(() => {
            // 移除第四面容器
            const fourthContainer = document.querySelector('.scene-four-container');
            if (fourthContainer) {
                fourthContainer.remove();
            }
            
            // 显示第五面
            const fifthContainer = document.querySelector('.scene-five-container');
            if (fifthContainer) {
                fifthContainer.style.opacity = '1';
                fifthContainer.style.transition = 'opacity 0.5s ease-in-out';
            }
            
            // 添加泰语图片元素
            addThaiLanguageElements();
            
            // 添加定时显示的图片元素
            addTimedElements();
            
            // 初始化第五面的主角移动系统
            initFifthSceneCharacterMovement();
            
            // 初始化第五面的语音识别系统
            const fifthSceneVoiceCleanup = initFifthSceneVoiceRecognition();
            
            // 保存清理函数到全局变量
            window.fifthSceneVoiceCleanup = fifthSceneVoiceCleanup;
            
            // 添加第五面的跳转按钮
            addSceneSkipButton(5, transitionToSixthScene);
            
            console.log('第五面创建完成');
        }, 100);
    }

    // 添加泰语图片元素
    function addThaiLanguageElements() {
        const sceneContainer = document.querySelector('.scene-five-container');
        if (!sceneContainer) {
            console.log('第五面容器不存在，无法添加泰语元素');
            return;
        }

        // 先检查并移除已存在的泰语元素，防止重复创建
        const existingThai1 = document.getElementById('thai1');
        const existingThai2 = document.getElementById('thai2');
        if (existingThai1) {
            existingThai1.remove();
            console.log('移除了已存在的泰语1.png');
        }
        if (existingThai2) {
            existingThai2.remove();
            console.log('移除了已存在的泰语2.png');
        }

        // 创建泰语1图片
        const thai1 = document.createElement('img');
        thai1.src = '泰语1.png';
        thai1.style.position = 'absolute';
        thai1.style.top = '20px';
        thai1.style.left = '20px';
        thai1.style.width = 'auto';
        thai1.style.height = '40px';
        thai1.style.zIndex = '15';
        thai1.style.cursor = 'pointer';
        thai1.style.transition = 'all 0.3s ease';
        thai1.style.animation = 'thaiFloat1 3s ease-in-out infinite';
        thai1.className = 'thai-element';
        thai1.id = 'thai1';
        sceneContainer.appendChild(thai1);

        // 创建泰语2图片
        const thai2 = document.createElement('img');
        thai2.src = '泰语2.png';
        thai2.style.position = 'absolute';
        thai2.style.top = '20px';
        thai2.style.left = '120px';
        thai2.style.width = 'auto';
        thai2.style.height = '60px';
        thai2.style.zIndex = '15';
        thai2.style.cursor = 'pointer';
        thai2.style.transition = 'all 0.3s ease';
        thai2.style.animation = 'thaiFloat2 3.5s ease-in-out infinite';
        thai2.className = 'thai-element';
        thai2.id = 'thai2';
        sceneContainer.appendChild(thai2);

        // 添加悬停事件监听器
        thai1.addEventListener('mouseenter', function() {
            this.style.filter = 'drop-shadow(0 0 15px #D5E6D4) brightness(1.2)';
            this.style.transform = 'scale(1.1)';
        });

        thai1.addEventListener('mouseleave', function() {
            this.style.filter = 'none';
            this.style.transform = 'scale(1)';
        });

        thai2.addEventListener('mouseenter', function() {
            this.style.filter = 'drop-shadow(0 0 15px #D5E6D4) brightness(1.2)';
            this.style.transform = 'scale(1.1)';
        });

        thai2.addEventListener('mouseleave', function() {
            this.style.filter = 'none';
            this.style.transform = 'scale(1)';
        });

        // 添加点击事件监听器
        thai1.addEventListener('click', function() {
            console.log('点击了泰语1.png');
            
            // 点击动效
            this.style.transform = 'scale(0.9)';
            setTimeout(() => {
                this.style.transform = 'scale(1.1)';
                setTimeout(() => {
                    this.style.transform = 'scale(1)';
                }, 150);
            }, 100);
            
            const audio = new Audio('8MUSIC.mp3');
            audio.play().catch(error => {
                console.log('8MUSIC.mp3播放失败:', error);
            });
        });

        thai2.addEventListener('click', function() {
            console.log('点击了泰语2.png');
            
            // 点击动效
            this.style.transform = 'scale(0.9)';
            setTimeout(() => {
                this.style.transform = 'scale(1.1)';
                setTimeout(() => {
                    this.style.transform = 'scale(1)';
                }, 150);
            }, 100);
            
            const audio = new Audio('8MUSIC.mp3');
            audio.play().catch(error => {
                console.log('8MUSIC.mp3播放失败:', error);
            });
        });

        console.log('泰语图片元素已添加到第五面');
    }

    // 添加定时显示的图片元素
    function addTimedElements() {
        const sceneContainer = document.querySelector('.scene-five-container');
        if (!sceneContainer) {
            console.log('第五面容器不存在，无法添加定时元素');
            return;
        }

        // 创建心.png图片（位于泰语1.png正下方）
        const heartImg = document.createElement('img');
        heartImg.src = '心.png';
        heartImg.style.position = 'absolute';
        heartImg.style.top = '80px'; // 泰语1.png下方（20px + 40px + 20px间距）
        heartImg.style.left = '20px'; // 与泰语1.png左对齐
        heartImg.style.width = 'auto';
        heartImg.style.height = '50px';
        heartImg.style.zIndex = '15';
        heartImg.style.opacity = '0'; // 初始不可见
        heartImg.style.transition = 'opacity 1s ease-in-out';
        heartImg.style.filter = 'none'; // 移除任何滤镜效果，包括阴影
        heartImg.style.boxShadow = 'none'; // 确保没有盒子阴影
        heartImg.style.textShadow = 'none'; // 确保没有文字阴影
        heartImg.id = 'heart-img';
        sceneContainer.appendChild(heartImg);

        // 创建是你最重要的.png图片（与心.png并排）
        const importantImg = document.createElement('img');
        importantImg.src = '是你最重要的.png';
        importantImg.style.position = 'absolute';
        importantImg.style.top = '80px'; // 与心.png同一水平线
        importantImg.style.left = '90px'; // 心.png右侧，留一些间距
        importantImg.style.width = 'auto';
        importantImg.style.height = '40px'; // 比心.png稍小（从50px改为40px）
        importantImg.style.zIndex = '15';
        importantImg.style.opacity = '0'; // 初始不可见
        importantImg.style.transition = 'opacity 1s ease-in-out';
        importantImg.id = 'important-img';
        sceneContainer.appendChild(importantImg);

        // 3秒后开始按顺序显示
        setTimeout(() => {
            console.log('开始显示心.png');
            heartImg.style.opacity = '1';
            
            // 心.png显示1秒后显示是你最重要的.png
            setTimeout(() => {
                console.log('开始显示是你最重要的.png');
                importantImg.style.opacity = '1';
            }, 1000);
            
            // 20秒后心.png开始变红并晃动
            setTimeout(() => {
                console.log('心.png开始变红并晃动');
                heartImg.style.filter = 'hue-rotate(0deg) saturate(2) brightness(1.2)';
                heartImg.style.animation = 'heartShake 0.3s infinite';
                heartImg.style.cursor = 'pointer';
                
                // 添加点击事件
                heartImg.addEventListener('click', function() {
                    console.log('点击了变红的心.png');
                    generateTrueHeart();
                });
            }, 20000);
        }, 3000);

        console.log('定时显示元素已添加到第五面');
        
        // 生成真心.png的函数
        function generateTrueHeart() {
            const sceneContainer = document.querySelector('.scene-five-container');
            if (!sceneContainer) {
                console.log('第五面容器不存在，无法生成真心.png');
                return;
            }
            
            // 创建真心.png
            const trueHeart = document.createElement('img');
            trueHeart.src = '真心.png';
            trueHeart.style.position = 'absolute';
            trueHeart.style.width = '80px';
            trueHeart.style.height = '80px';
            trueHeart.style.zIndex = '20';
            trueHeart.className = 'true-heart'; // 使用class而不是id，允许多个元素
            
            // 随机位置（避免太靠近边缘）
            const randomX = Math.random() * (window.innerWidth - 100) + 50;
            const randomY = Math.random() * (window.innerHeight - 100) + 50;
            trueHeart.style.left = randomX + 'px';
            trueHeart.style.top = randomY + 'px';
            
            // 添加发光效果
            trueHeart.style.filter = 'drop-shadow(0 0 20px #ff6b6b)';
            trueHeart.style.animation = 'trueHeartGlow 2s ease-in-out infinite';
            
            sceneContainer.appendChild(trueHeart);
            
            // 添加淡入动画
            trueHeart.style.opacity = '0';
            trueHeart.style.transition = 'opacity 1s ease-in-out';
            setTimeout(() => {
                trueHeart.style.opacity = '1';
            }, 10);
            
            console.log('真心.png已生成在位置:', randomX, randomY);
        }
    }

    // 添加第五面的样式
    function addFifthSceneStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .scene-five-container {
                position: fixed;
                top: 0;
                left: 0;
                width: 100vw;
                height: 100vh;
                background-color: #D5E6D4;
                overflow: hidden;
                z-index: 1000;
            }

            .scene-five-container .character-area {
                position: absolute;
                left: 5%;
                bottom: 5%;
                z-index: 10;
            }
            
            .character-fifth {
                height: 100px;
                width: auto;
                filter: brightness(0) saturate(100%) invert(20%) sepia(20%) saturate(2000%) hue-rotate(240deg) brightness(30%) contrast(120%);
                animation: float 2s ease-in-out infinite;
                transform-origin: bottom center;
            }

            .character-fifth.walking {
                animation: float 2s ease-in-out infinite, walk 0.6s ease-in-out infinite;
            }

            @keyframes float {
                0%, 100% { transform: translateY(0px); }
                50% { transform: translateY(-10px); }
            }

            @keyframes walk {
                0%, 100% {
                    transform: rotate(-2deg);
                }
                50% {
                    transform: rotate(2deg);
                }
            }

            /* 泰语图片浮动动画 */
            @keyframes thaiFloat1 {
                0%, 100% { 
                    transform: translateY(0px); 
                }
                50% { 
                    transform: translateY(-8px); 
                }
            }

            @keyframes thaiFloat2 {
                0%, 100% { 
                    transform: translateY(0px); 
                }
                50% { 
                    transform: translateY(-10px); 
                }
            }

            /* 泰语元素样式 */
            .thai-element {
                transition: all 0.3s ease;
            }

            .thai-element:hover {
                filter: drop-shadow(0 0 15px #D5E6D4) brightness(1.2);
                transform: scale(1.1);
            }

            /* 心.png晃动动画 */
            @keyframes heartShake {
                0%, 100% { transform: translateX(0px); }
                25% { transform: translateX(-5px); }
                75% { transform: translateX(5px); }
            }

            /* 真心.png发光动画 */
            @keyframes trueHeartGlow {
                0%, 100% { 
                    filter: drop-shadow(0 0 20px #ff6b6b);
                    transform: scale(1);
                }
                50% { 
                    filter: drop-shadow(0 0 30px #ff1744);
                    transform: scale(1.1);
                }
            }

            /* 密集圆环样式 */
            .dense-ring {
                border: 2px solid rgba(50, 32, 48, 0.4);
                background-color: transparent;
                border-radius: 50%;
                position: absolute;
                pointer-events: none;
                transition: all 0.8s ease-out;
            }

            .dense-ring:nth-child(odd) {
                border-color: rgba(50, 32, 48, 0.3);
            }

            .dense-ring:nth-child(even) {
                border-color: rgba(50, 32, 48, 0.5);
            }


        `;
        document.head.appendChild(style);
        
        console.log('第五面样式已添加');
    }

    // 初始化第五面的主角移动系统（复制第二面的逻辑）
    function initFifthSceneCharacterMovement() {
        const character = document.querySelector('.scene-five-container .character-area');
        const characterImg = character.querySelector('.character-fifth');
        let characterPos = { x: 5, y: 5 }; // 初始位置（百分比）
        const moveSpeed = 0.08; // 移动速度
        const moveKeys = { w: false, s: false, a: false, d: false };
        
        // 创建移动音效
        const moveSound = new Audio('角色移动声音.MP3');
        moveSound.loop = true; // 设置循环播放
        moveSound.playbackRate = 1.5; // 加速播放（1.5倍速）
        let isMoving = false; // 跟踪移动状态

        // 重置所有按键状态
        function resetAllKeys() {
            moveKeys.w = false;
            moveKeys.s = false;
            moveKeys.a = false;
            moveKeys.d = false;
            console.log('重置所有按键状态');
        }

        // 更新角色图片和动画
        function updateCharacterImage() {
            // 更新图片
            if (moveKeys.w) {
                characterImg.src = 'U/UW1.png';
            } else if (moveKeys.s) {
                characterImg.src = 'U/US1.png';
            } else if (moveKeys.a) {
                characterImg.src = 'U/UA1.png';
            } else if (moveKeys.d) {
                characterImg.src = 'U/UD1.png';
            } else {
                characterImg.src = 'U/US1.png'; // 静止时也使用US1.png
            }

            // 更新走路动画
            if (moveKeys.w || moveKeys.a || moveKeys.s || moveKeys.d) {
                characterImg.classList.add('walking');
            } else {
                characterImg.classList.remove('walking');
            }
        }

        // 监听按键按下
        const keydownHandler = (event) => {
            let keyChanged = false;
            switch(event.key.toLowerCase()) {
                case 'w':
                    if (!moveKeys.w) {
                        moveKeys.w = true;
                        keyChanged = true;
                    }
                    break;
                case 's':
                    if (!moveKeys.s) {
                        moveKeys.s = true;
                        keyChanged = true;
                    }
                    break;
                case 'a':
                    if (!moveKeys.a) {
                        moveKeys.a = true;
                        keyChanged = true;
                    }
                    break;
                case 'd':
                    if (!moveKeys.d) {
                        moveKeys.d = true;
                        keyChanged = true;
                    }
                    break;
            }
            
            if (keyChanged) {
                updateCharacterImage();
            }
            
            if (!isMoving && (moveKeys.w || moveKeys.s || moveKeys.a || moveKeys.d)) {
                isMoving = true;
                moveSound.play().catch(error => {
                    console.log('音效播放失败:', error);
                });
            }
        };

        // 监听按键释放
        const keyupHandler = (event) => {
            let keyChanged = false;
            switch(event.key.toLowerCase()) {
                case 'w':
                    if (moveKeys.w) {
                        moveKeys.w = false;
                        keyChanged = true;
                    }
                    break;
                case 's':
                    if (moveKeys.s) {
                        moveKeys.s = false;
                        keyChanged = true;
                    }
                    break;
                case 'a':
                    if (moveKeys.a) {
                        moveKeys.a = false;
                        keyChanged = true;
                    }
                    break;
                case 'd':
                    if (moveKeys.d) {
                        moveKeys.d = false;
                        keyChanged = true;
                    }
                    break;
            }
            
            if (keyChanged) {
                updateCharacterImage();
            }
            
            if (isMoving && !moveKeys.w && !moveKeys.s && !moveKeys.a && !moveKeys.d) {
                isMoving = false;
                moveSound.pause();
                moveSound.currentTime = 0;
            }
        };

        // 窗口焦点事件处理
        function handleWindowBlur() {
            resetAllKeys();
            updateCharacterImage();
            // 确保发光效果保持
            if (character.dataset.uploadedImage && !character.classList.contains('glowing')) {
                character.classList.add('glowing');
            }
        }
        
        // 窗口获焦时重置按键
        function handleWindowFocus() {
            resetAllKeys();
            updateCharacterImage();
            // 确保发光效果保持
            if (character.dataset.uploadedImage && !character.classList.contains('glowing')) {
                character.classList.add('glowing');
            }
        }

        // 页面可见性变化时重置按键
        function handleVisibilityChange() {
            if (document.hidden) {
                resetAllKeys();
                updateCharacterImage();
            } else {
                // 页面重新可见时确保发光效果保持
                if (character.dataset.uploadedImage && !character.classList.contains('glowing')) {
                    character.classList.add('glowing');
                }
            }
        }

        // 添加事件监听器
        document.addEventListener('keydown', keydownHandler);
        document.addEventListener('keyup', keyupHandler);
        window.addEventListener('blur', handleWindowBlur);
        window.addEventListener('focus', handleWindowFocus);
        document.addEventListener('visibilitychange', handleVisibilityChange);

        // 生成密集圆环的函数
        function generateDenseRings() {
            const sceneContainer = document.querySelector('.scene-five-container');
            if (!sceneContainer) {
                console.log('第五面容器不存在，无法生成圆环');
                return;
            }

            console.log('开始生成密集圆环');
            
            // 生成50-80个圆环，主要分布在画面周围
            const ringCount = Math.floor(Math.random() * 31) + 50; // 50-80个
            
            for (let i = 0; i < ringCount; i++) {
                setTimeout(() => {
                    createSingleRing(sceneContainer);
                }, i * 20); // 每20ms生成一个，创造连续效果
            }
        }

        function createSingleRing(container) {
            const ring = document.createElement('div');
            ring.className = 'dense-ring';
            
            // 圆环大小（随机）
            const size = Math.random() * 30 + 15; // 15-45px
            ring.style.width = size + 'px';
            ring.style.height = size + 'px';
            ring.style.borderRadius = '50%';
            ring.style.position = 'absolute';
            ring.style.border = '2px solid rgba(50, 32, 48, 0.4)'; // #322030的淡化版本
            ring.style.backgroundColor = 'transparent';
            ring.style.zIndex = '8';
            ring.style.pointerEvents = 'none';
            
            // 位置分布：优先在画面周围
            let x, y;
            const screenWidth = window.innerWidth;
            const screenHeight = window.innerHeight;
            const edgeDistance = 100; // 边缘区域宽度
            
            const position = Math.random();
            if (position < 0.3) {
                // 左边缘
                x = Math.random() * edgeDistance;
                y = Math.random() * screenHeight;
            } else if (position < 0.6) {
                // 右边缘
                x = screenWidth - edgeDistance + Math.random() * edgeDistance;
                y = Math.random() * screenHeight;
            } else if (position < 0.8) {
                // 上边缘
                x = Math.random() * screenWidth;
                y = Math.random() * edgeDistance;
            } else if (position < 0.95) {
                // 下边缘
                x = Math.random() * screenWidth;
                y = screenHeight - edgeDistance + Math.random() * edgeDistance;
            } else {
                // 中央区域（少量）
                x = edgeDistance + Math.random() * (screenWidth - 2 * edgeDistance);
                y = edgeDistance + Math.random() * (screenHeight - 2 * edgeDistance);
            }
            
            ring.style.left = x + 'px';
            ring.style.top = y + 'px';
            
            // 添加淡入和扩散动画
            ring.style.opacity = '0';
            ring.style.transform = 'scale(0)';
            ring.style.transition = 'all 0.8s ease-out';
            
            container.appendChild(ring);
            
            // 触发动画
            setTimeout(() => {
                ring.style.opacity = '0.6';
                ring.style.transform = 'scale(1)';
            }, 10);
            
            // 圆环永久保留，不会消失
        }

        // 检查心形图片碰撞
        function checkHeartCollision() {
            const characterRect = character.getBoundingClientRect();
            const hearts = document.querySelectorAll('.scene-five-container img[src="心1.png"]');
            
            hearts.forEach(heart => {
                const heartRect = heart.getBoundingClientRect();
                
                // 检查碰撞（使用简单的矩形碰撞检测）
                if (characterRect.left < heartRect.right &&
                    characterRect.right > heartRect.left &&
                    characterRect.top < heartRect.bottom &&
                    characterRect.bottom > heartRect.top) {
                    
                    console.log('角色接触到心形图片');
                    
                    // 播放心碎音频
                    const heartBreakSound = new Audio('心碎.mp3');
                    heartBreakSound.play().catch(error => {
                        console.log('心碎音频播放失败:', error);
                    });
                    
                    // 生成密集圆环
                    generateDenseRings();
                    
                    // 切换为心2.png
                    heart.src = '心2.png';
                    
                    // 2秒后消失
                    setTimeout(() => {
                        heart.style.transition = 'opacity 0.5s ease-in-out';
                        heart.style.opacity = '0';
                        setTimeout(() => {
                            if (heart.parentNode) {
                                heart.parentNode.removeChild(heart);
                            }
                        }, 500);
                    }, 2000);
                }
            });
        }

        // 检查真心.png碰撞
        function checkTrueHeartCollision() {
            const characterRect = character.getBoundingClientRect();
            const trueHearts = document.querySelectorAll('.true-heart');
            
            trueHearts.forEach(trueHeart => {
                const trueHeartRect = trueHeart.getBoundingClientRect();
                
                // 检查碰撞
                if (characterRect.left < trueHeartRect.right &&
                    characterRect.right > trueHeartRect.left &&
                    characterRect.top < trueHeartRect.bottom &&
                    characterRect.bottom > trueHeartRect.top) {
                    
                    console.log('角色接触到真心.png，准备进入第六面');
                    transitionToSixthScene();
                }
            });
        }

        // 移动更新循环
        function updateMovement() {
            // 检查第五面容器是否还存在
            const sceneContainer = document.querySelector('.scene-five-container');
            if (!sceneContainer) {
                console.log('第五面容器不存在，停止移动循环');
                return;
            }

            // 更新位置
            if (moveKeys.w && characterPos.y < 90) characterPos.y += moveSpeed;
            if (moveKeys.s && characterPos.y > 5) characterPos.y -= moveSpeed;
            if (moveKeys.a && characterPos.x > 0) characterPos.x -= moveSpeed;
            if (moveKeys.d && characterPos.x < 90) characterPos.x += moveSpeed;
            
            // 应用新位置
            character.style.left = `${characterPos.x}%`;
            character.style.bottom = `${characterPos.y}%`;
            
            // 检查心形图片碰撞
            checkHeartCollision();
            
            // 检查真心.png碰撞
            checkTrueHeartCollision();
            
            // 继续下一帧
            requestAnimationFrame(updateMovement);
        }
        
        // 开始移动循环
        updateMovement();

        // 返回清理函数
        return function cleanup() {
            document.removeEventListener('keydown', keydownHandler);
            document.removeEventListener('keyup', keyupHandler);
            window.removeEventListener('blur', handleWindowBlur);
            window.removeEventListener('focus', handleWindowFocus);
            document.removeEventListener('visibilitychange', handleVisibilityChange);
            
            if (moveSound) {
                moveSound.pause();
                moveSound.currentTime = 0;
            }
            
            resetAllKeys();
        };
    }

    // 初始化第四面的主角移动系统
    function initFourthSceneCharacterMovement() {
        const character = document.querySelector('.character-area');
        const characterImg = character.querySelector('.character-fourth');
        let characterPos = { x: 50, y: 50 }; // 初始位置：屏幕正中心
        const moveSpeed = 0.08;
        const moveKeys = { w: false, s: false, a: false, d: false };
        
        // 设置初始位置（文字正下方，稍微往左）
        characterPos.x = 47; // 稍微往左移动
        character.style.left = `${characterPos.x}%`;
        character.style.bottom = `${characterPos.y}%`;
        
        // 创建移动音效
        const moveSound = new Audio('角色移动声音.MP3');
        moveSound.loop = true;
        moveSound.playbackRate = 1.5; // 加速播放（1.5倍速）
        let isMoving = false;

        // 重置所有按键状态
        function resetAllKeys() {
            moveKeys.w = false;
            moveKeys.s = false;
            moveKeys.a = false;
            moveKeys.d = false;
            console.log('重置所有按键状态');
        }

        // 更新角色图片和动画
        function updateCharacterImage() {
            if (moveKeys.w) {
                characterImg.src = 'U/UW.png';
            } else if (moveKeys.a) {
                characterImg.src = 'U/UA.png';
            } else if (moveKeys.d) {
                characterImg.src = 'U/UD.png';
            } else {
                characterImg.src = '6.png';
            }

            if (moveKeys.w || moveKeys.a || moveKeys.s || moveKeys.d) {
                characterImg.classList.add('walking');
            } else {
                characterImg.classList.remove('walking');
            }
        }

        // 键盘事件处理
        function keydownHandler(event) {
            const key = event.key.toLowerCase();
            let keyChanged = false;
            
            if ((key === 'w' || key === 'arrowup') && !moveKeys.w) {
                moveKeys.w = true;
                keyChanged = true;
            }
            if ((key === 's' || key === 'arrowdown') && !moveKeys.s) {
                moveKeys.s = true;
                keyChanged = true;
            }
            if ((key === 'a' || key === 'arrowleft') && !moveKeys.a) {
                moveKeys.a = true;
                keyChanged = true;
            }
            if ((key === 'd' || key === 'arrowright') && !moveKeys.d) {
                moveKeys.d = true;
                keyChanged = true;
            }
            
            if (keyChanged) {
                updateCharacterImage();
            }
            
            if (!isMoving && (moveKeys.w || moveKeys.s || moveKeys.a || moveKeys.d)) {
                isMoving = true;
                moveSound.play().catch(error => {
                    console.log('音效播放失败:', error);
                });
            }
        }

        function keyupHandler(event) {
            const key = event.key.toLowerCase();
            let keyChanged = false;
            
            if ((key === 'w' || key === 'arrowup') && moveKeys.w) {
                moveKeys.w = false;
                keyChanged = true;
            }
            if ((key === 's' || key === 'arrowdown') && moveKeys.s) {
                moveKeys.s = false;
                keyChanged = true;
            }
            if ((key === 'a' || key === 'arrowleft') && moveKeys.a) {
                moveKeys.a = false;
                keyChanged = true;
            }
            if ((key === 'd' || key === 'arrowright') && moveKeys.d) {
                moveKeys.d = false;
                keyChanged = true;
            }
            
            if (keyChanged) {
                updateCharacterImage();
            }
            
            if (isMoving && !moveKeys.w && !moveKeys.s && !moveKeys.a && !moveKeys.d) {
                isMoving = false;
                moveSound.pause();
                moveSound.currentTime = 0;
            }
        }

        // 窗口焦点事件处理
        function handleWindowBlur() {
            resetAllKeys();
            updateCharacterImage();
            // 确保发光效果保持
            if (character.dataset.uploadedImage && !character.classList.contains('glowing')) {
                character.classList.add('glowing');
            }
        }
        
        // 窗口获焦时重置按键
        function handleWindowFocus() {
            resetAllKeys();
            updateCharacterImage();
            // 确保发光效果保持
            if (character.dataset.uploadedImage && !character.classList.contains('glowing')) {
                character.classList.add('glowing');
            }
        }

        // 页面可见性变化时重置按键
        function handleVisibilityChange() {
            if (document.hidden) {
                resetAllKeys();
                updateCharacterImage();
            } else {
                // 页面重新可见时确保发光效果保持
                if (character.dataset.uploadedImage && !character.classList.contains('glowing')) {
                    character.classList.add('glowing');
                }
            }
        }

        // 将事件处理器存储为全局变量以便清理
        window.fourthSceneKeydownHandler = keydownHandler;
        window.fourthSceneKeyupHandler = keyupHandler;
        window.fourthSceneBlurHandler = handleWindowBlur;
        window.fourthSceneFocusHandler = handleWindowFocus;
        window.fourthSceneVisibilityHandler = handleVisibilityChange;

        // 添加事件监听器
        document.addEventListener('keydown', keydownHandler);
        document.addEventListener('keyup', keyupHandler);
        window.addEventListener('blur', handleWindowBlur);
        window.addEventListener('focus', handleWindowFocus);
        document.addEventListener('visibilitychange', handleVisibilityChange);

        // 移动更新循环
        function updateMovement() {
            // 检查第四面是否还存在
            const sceneContainer = document.querySelector('.scene-four-container');
            if (!sceneContainer) {
                console.log('第四面容器不存在，停止移动循环');
                return;
            }

            let newX = characterPos.x;
            let newY = characterPos.y;
            let moved = false;

            // 计算新位置
            if (moveKeys.w && characterPos.y < 90) {
                newY += moveSpeed;
                moved = true;
            }
            if (moveKeys.s && characterPos.y > 5) {
                newY -= moveSpeed;
                moved = true;
            }
            if (moveKeys.a && characterPos.x > 0) {
                newX -= moveSpeed;
                moved = true;
            }
            if (moveKeys.d && characterPos.x < 90) {
                newX += moveSpeed;
                moved = true;
            }

            // 更新位置
            characterPos.x = newX;
            characterPos.y = newY;
            character.style.left = `${characterPos.x}%`;
            character.style.bottom = `${characterPos.y}%`;
            
            requestAnimationFrame(updateMovement);
        }
        
        // 开始移动循环
        updateMovement();

        // 返回清理函数
        return function cleanup() {
            document.removeEventListener('keydown', keydownHandler);
            document.removeEventListener('keyup', keyupHandler);
            window.removeEventListener('blur', handleWindowBlur);
            window.removeEventListener('focus', handleWindowFocus);
            document.removeEventListener('visibilitychange', handleVisibilityChange);
            
            if (moveSound) {
                moveSound.pause();
                moveSound.currentTime = 0;
            }
            
            resetAllKeys();
        };
    }

    // 第五面语音识别系统
    function initFifthSceneVoiceRecognition() {
        console.log('初始化第五面语音识别系统');
        
        // 确保第四面已经结束
        if (!window.fourthSceneEnded) {
            console.log('第四面尚未结束，延迟启动第五面语音识别');
            setTimeout(() => {
                if (window.fourthSceneEnded) {
                    initFifthSceneVoiceRecognition();
                }
            }, 1000);
            return;
        }
        
        // 检查浏览器是否支持语音识别
        if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
            console.log('浏览器不支持语音识别');
            return;
        }

        // 检查是否已经请求过麦克风权限
        if (window.fifthSceneMicRequested) {
            console.log('已经请求过麦克风权限，不再重复请求');
            return;
        }

        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        const recognition = new SpeechRecognition();
        
        // 配置语音识别（优化响应速度）
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = 'en-US';
        
        // 优化语音识别响应速度的参数
        if ('maxAlternatives' in recognition) {
            recognition.maxAlternatives = 1; // 减少备选结果，提高速度
        }
        if ('serviceURI' in recognition) {
            recognition.serviceURI = ''; // 使用本地识别服务
        }
        
        // 设置更短的静音检测时间（如果支持）
        try {
            recognition.grammars = new (window.SpeechGrammarList || window.webkitSpeechGrammarList)();
        } catch (e) {
            console.log('语法列表不支持，跳过设置');
        }
        
        let isListening = false;
        let restartTimeout;
        let restartCount = 0;
        const maxRestarts = 5; // 最大重启次数
        
        // 语音识别成功次数计数器
        let recognitionCount = 0;

        // 目标词汇列表（包含变体）
        const targetWords = [
            // zai 开头的词汇
            'zai', 'zay', 'zye', 'zi', 'zie', 'zei',
            // ze 开头的词汇  
            'ze', 'zee', 'zeh', 'zea', 'zeo',
            // zhe 开头的词汇
            'zhe', 'zhey', 'zheh', 'zher', 'zhea',
            // cha 开头的词汇
            'cha', 'chah', 'char', 'chay', 'chai', 'chao',
            // ca 开头的词汇
            'ca', 'cah', 'car', 'cay', 'cao', 'cai',
            // cai 开头的词汇
            'cai', 'caiy', 'caih', 'cair', 'caio',
            // charlie 及其变体
            'charlie', 'charley', 'charly', 'charli', 'charlee',
            'charlie\'s', 'charlies', 'charliee', 'charlio',
            // charlie 的音节变体
            'char', 'charl', 'charle', 'charli', 'charlee',
            'shar', 'sharl', 'sharle', 'sharli', 'sharlee',
            'tchar', 'tcharl', 'tcharle', 'tcharli', 'tcharlee',
            // zhai le 及其变体
            'zhai le', 'zhaile', 'zhai-le', 'zhai_le',
            'zhai', 'zhay', 'zhy', 'zhayi', 'zhaye',
            'le', 'lei', 'lay', 'leh', 'lea',
            // zhai le 发音变体
            'zai le', 'zaile', 'zai-le', 'zai_le',
            'zay le', 'zayle', 'zay-le', 'zay_le',
            'zhe le', 'zhele', 'zhe-le', 'zhe_le',
            'chai le', 'chaile', 'chai-le', 'chai_le',
            // 相似发音
            'shy le', 'shyle', 'shy-le', 'shy_le',
            'try le', 'tryle', 'try-le', 'try_le',
            'fly le', 'flyle', 'fly-le', 'fly_le'
        ];

        // 生成心形图片（支持生成多个，且不会消失）
        function generateHeart() {
            // 增加识别次数
            recognitionCount++;
            
            // 计算本次应该生成的心1.png数量
            let heartCount;
            if (recognitionCount === 1) {
                heartCount = 15; // 第一次：15个
            } else if (recognitionCount === 2) {
                heartCount = 30; // 第二次：30个
            } else {
                // 第三次及以后：数量递增，基数为识别次数
                heartCount = Math.floor(Math.random() * recognitionCount) + recognitionCount;
            }
            
            console.log(`第${recognitionCount}次语音识别成功，生成${heartCount}个心1.png`);
            
            // 生成指定数量的心1.png
            for (let i = 0; i < heartCount; i++) {
                setTimeout(() => {
                    const heart = document.createElement('img');
                    heart.src = '心1.png';
                    heart.style.position = 'absolute';
                    heart.style.width = '80px';
                    heart.style.height = '80px';
                    heart.style.zIndex = '5';
                    heart.className = 'persistent-heart'; // 添加类名标识
                    
                    // 在主角可移动范围内生成随机位置
                    // 主角移动范围：水平0-90%，垂直5-90%
                    const screenWidth = window.innerWidth;
                    const screenHeight = window.innerHeight;
                    const randomX = Math.random() * (screenWidth * 0.9 - 80); // 0-90%范围，减去心的宽度
                    const randomY = Math.random() * (screenHeight * 0.85 - 80) + (screenHeight * 0.05); // 5-90%范围，减去心的高度
                    heart.style.left = randomX + 'px';
                    heart.style.top = randomY + 'px';
                    
                    // 添加到场景容器中
                    const sceneContainer = document.querySelector('.scene-five-container');
                    if (sceneContainer) {
                        sceneContainer.appendChild(heart);
                    } else {
                        document.body.appendChild(heart);
                    }
                    
                    // 播放心出现音频（只在第一个心出现时播放，避免音频重叠）
                    if (i === 0) {
                        const heartAppearSound = new Audio('心出现.mp4');
                        heartAppearSound.play().catch(error => {
                            console.log('心出现音频播放失败:', error);
                        });
                    }
                    
                    // 添加淡入动画
                    heart.style.opacity = '0';
                    heart.style.transition = 'opacity 0.5s ease-in-out';
                    setTimeout(() => {
                        heart.style.opacity = '1';
                    }, 10);
                    
                    // 心1.png不会消失，永久保留在屏幕上
                    console.log(`生成第${i + 1}个心形图片在位置:`, randomX, randomY);
                }, i * 100); // 每个心间隔100ms生成，创造连续出现效果
            }
        }

        // 检查是否包含目标词汇
        function checkForTargetWords(transcript) {
            const lowerTranscript = transcript.toLowerCase();
            const words = lowerTranscript.split(/\s+/);
            
            // 检查完整转录文本是否包含目标词汇
            for (let target of targetWords) {
                if (lowerTranscript.includes(target)) {
                    console.log('检测到目标词汇（完整匹配）:', target, '在文本:', transcript);
                    generateHeart();
                    return true;
                }
            }
            
            // 检查单个词汇是否包含目标音节
            for (let word of words) {
                for (let target of targetWords) {
                    if (word.includes(target) || word.startsWith(target)) {
                        console.log('检测到目标词汇（音节匹配）:', word, '包含:', target);
                        generateHeart();
                        return true;
                    }
                }
            }
            
            return false;
        }

        // 语音识别结果处理（优化响应速度）
        recognition.onresult = function(event) {
            let finalTranscript = '';
            let interimTranscript = '';

            for (let i = event.resultIndex; i < event.results.length; i++) {
                const transcript = event.results[i].transcript;
                if (event.results[i].isFinal) {
                    finalTranscript += transcript;
                } else {
                    interimTranscript += transcript;
                }
            }

            // 优先处理临时结果，提高响应速度
            if (interimTranscript) {
                console.log('控制台临时识别结果:', interimTranscript);
                // 立即检查临时结果，不等待最终结果
                if (checkForTargetWords(interimTranscript)) {
                    return; // 如果临时结果已经匹配，直接返回
                }
            } else {
                console.log('控制台临时识别结果:', interimTranscript);
                // 当临时识别结果为undefined或空字符串时，也触发心1.png生成
                generateHeart();
                return;
            }

            // 检查最终结果
            if (finalTranscript) {
                console.log('最终识别结果:', finalTranscript);
                checkForTargetWords(finalTranscript);
            }
        };

        // 开始语音识别
        function startListening() {
            // 检查第五面是否还存在
            const fifthSceneContainer = document.querySelector('.scene-five-container');
            if (!fifthSceneContainer) {
                console.log('第五面不存在，不启动语音识别');
                return;
            }
            
            if (!isListening) {
                try {
                    recognition.start();
                    isListening = true;
                    console.log('第五面语音识别开始');
                } catch (error) {
                    console.log('启动语音识别失败:', error);
                    // 快速重试
                    setTimeout(() => {
                        const container = document.querySelector('.scene-five-container');
                        if (container) {
                            startListening();
                        }
                    }, 200);
                }
            }
        }

        // 重启语音识别
        function restartListening() {
            // 检查重启次数
            if (restartCount >= maxRestarts) {
                console.log('语音识别重启次数过多，停止重启');
                return;
            }
            
            // 检查第五面是否还存在
            const fifthSceneContainer = document.querySelector('.scene-five-container');
            if (!fifthSceneContainer) {
                console.log('第五面不存在，不重启语音识别');
                return;
            }
            
            if (restartTimeout) {
                clearTimeout(restartTimeout);
            }
            
            restartCount++;
            console.log(`第五面语音识别重启次数: ${restartCount}/${maxRestarts}`);
            
            restartTimeout = setTimeout(() => {
                const container = document.querySelector('.scene-five-container');
                if (!container) {
                    console.log('第五面已不存在，取消重启语音识别');
                    return;
                }
                
                if (isListening) {
                    recognition.stop();
                }
                isListening = false;
                startListening();
            }, 100); // 快速重启
        }

        // 语音识别事件处理
        recognition.onstart = function() {
            console.log('第五面语音识别已启动');
            isListening = true;
            // 成功启动后重置重启计数器
            restartCount = 0;
            // 标记已经请求过麦克风权限
            window.fifthSceneMicRequested = true;
        };

        recognition.onend = function() {
            console.log('第五面语音识别结束');
            isListening = false;
            
            // 检查第五面是否还存在，以及是否应该重启
            const fifthSceneContainer = document.querySelector('.scene-five-container');
            if (!fifthSceneContainer) {
                console.log('第五面不存在，不重启语音识别');
                return;
            }
            
            // 快速重启，提高响应速度
            console.log('准备重启第五面语音识别');
            setTimeout(() => {
                restartListening();
            }, 300);
        };

        recognition.onerror = function(event) {
            console.log('第五面语音识别错误:', event.error);
            isListening = false;
            
            // 处理不同类型的错误
            if (event.error === 'not-allowed') {
                console.log('麦克风权限被拒绝，停止语音识别');
                window.fifthSceneMicRequested = true; // 标记已经请求过
                return; // 不重启
            } else if (event.error === 'no-speech') {
                console.log('未检测到语音，快速重启');
                // 对于无语音错误，快速重启
                setTimeout(() => {
                    const container = document.querySelector('.scene-five-container');
                    if (container) {
                        restartListening();
                    }
                }, 500);
            } else if (event.error === 'aborted') {
                console.log('语音识别被中止，不重启');
                return; // 不重启
            } else {
                console.log('其他语音识别错误，快速重启');
                setTimeout(() => {
                    const container = document.querySelector('.scene-five-container');
                    if (container) {
                        restartListening();
                    }
                }, 800);
            }
        };

        // 标记正在请求麦克风权限
        window.fifthSceneMicRequested = true;
        
        // 启动语音识别
        startListening();

        // 返回清理函数
        return function cleanup() {
            console.log('清理第五面语音识别系统');
            if (restartTimeout) {
                clearTimeout(restartTimeout);
            }
            if (isListening) {
                recognition.stop();
            }
            isListening = false;
            // 清理麦克风请求标志
            window.fifthSceneMicRequested = false;
        };
    }

    // 切换到第六面
    function transitionToSixthScene() {
        console.log('开始切换到第六面');
        
        // 清理第五面的语音识别
        if (window.fifthSceneVoiceCleanup) {
            window.fifthSceneVoiceCleanup();
            window.fifthSceneVoiceCleanup = null;
        }
        
        // 清理可能存在的摄像头流
        if (window.cameraStream) {
            window.cameraStream.getTracks().forEach(track => track.stop());
            window.cameraStream = null;
        }
        
        // 重置人脸识别初始化状态
        window.faceTrackingInitializing = false;
        
        // 重置嘴部校准状态
        window.mouthCalibrated = false;
        window.mouthOrigin = null;
        
        // 使用下滑切换动画
        const sceneContainer = document.querySelector('.scene-five-container');
        if (sceneContainer) {
            sceneContainer.style.transition = 'transform 1.5s ease-in-out';
            sceneContainer.style.transform = 'translateY(-100vh)';
            
            // 1.5秒后创建第六面
            setTimeout(() => {
                createSixthScene();
            }, 1500);
        } else {
            // 如果容器不存在，直接创建第六面
            createSixthScene();
        }
    }

    // 创建第六面
    function createSixthScene() {
        console.log('创建第六面');
        
        // 清除现有内容
        document.body.innerHTML = '';
        
        // 设置第六面背景
        document.body.style.backgroundColor = '#322030';
        document.body.style.margin = '0';
        document.body.style.padding = '0';
        document.body.style.overflow = 'hidden';
        
        // 创建第六面容器
        const sixthSceneHTML = `
            <div class="scene-six-container">
                <div class="sixth-scene-content">
                    <div class="sixth-scene-text-top">wako ni pamoja nami</div>
                    <div class="sixth-scene-text-bottom">我一直在你身边</div>
                    <img src="6.png" alt="左侧角色" class="sixth-scene-left-character">
                    
                    <!-- 摄像头显示区域 -->
                    <div class="camera-container">
                        <video id="camera-video" autoplay muted playsinline></video>
                        <canvas id="camera-canvas"></canvas>
                        <div class="calibration-button" onclick="recalibrateMouth()">重新校准</div>
                    </div>
                </div>
            </div>
            
            <!-- 嘴部追踪点（独立于场景容器） -->
            <div class="mouth-tracker-point"></div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', sixthSceneHTML);
        
        // 添加第六面样式
        addSixthSceneStyles();
        
        // 初始化第六面交互
        initSixthSceneInteraction();
        
        // 初始化人脸识别
        initFaceTracking();
        
        // 初始化拖拽游戏
        initDragGame();
        
        // 初始化躲避游戏
        initAvoidanceGame();
        
        // 添加第六面的跳转按钮
        addSceneSkipButton(6, transitionToSeventhScene);
        
        console.log('第六面创建完成');
    }

    // 添加第六面样式
    function addSixthSceneStyles() {
        // 添加Google Fonts链接
        const fontLink = document.createElement('link');
        fontLink.href = 'https://fonts.googleapis.com/css2?family=Irish+Grover&display=swap';
        fontLink.rel = 'stylesheet';
        document.head.appendChild(fontLink);
        
        const style = document.createElement('style');
        style.textContent = `
            .scene-six-container {
                position: fixed;
                top: 0;
                left: 0;
                width: 100vw;
                height: 100vh;
                background-color: #322030;
                overflow: hidden;
                z-index: 1000;
            }
            
            .sixth-scene-content {
                position: relative;
                width: 100%;
                height: 100%;
            }

            .sixth-scene-text-top {
                position: absolute;
                top: 50px;
                left: 50px;
                color: #D5E6D4;
                font-size: 32px;
                font-weight: normal;
                font-family: 'Irish Grover', Arial, sans-serif;
                z-index: 10;
                transition: all 0.3s ease;
                cursor: pointer;
            }

            .sixth-scene-text-top:hover {
                text-shadow: 0 0 20px #D5E6D4, 0 0 40px #D5E6D4;
                transform: scale(1.05);
            }

            .sixth-scene-text-bottom {
                position: absolute;
                top: 100px;
                left: 50px;
                color: #D5E6D4;
                font-size: 24px;
                font-weight: normal;
                font-family: Arial, sans-serif;
                z-index: 10;
                transition: all 0.3s ease;
            }

            .sixth-scene-left-character {
                position: absolute;
                left: 10%;
                top: 50%;
                transform: translateY(-50%);
                width: auto;
                height: 120px;
                z-index: 5;
                filter: brightness(0) saturate(100%) invert(85%) sepia(8%) saturate(1234%) hue-rotate(64deg) brightness(95%) contrast(89%);
                animation: float 2s ease-in-out infinite;
                transition: all 0.1s ease-out;
                cursor: pointer;
            }

            .sixth-scene-left-character.dragging {
                animation: none;
                z-index: 25;
                filter: brightness(0) saturate(100%) invert(85%) sepia(8%) saturate(1234%) hue-rotate(64deg) brightness(110%) contrast(89%) drop-shadow(0 0 15px #D5E6D4);
            }

            .sixth-scene-left-character.falling {
                animation: none;
                transition: all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94);
            }



            @keyframes float {
                0%, 100% { transform: translateY(-50%) translateY(0px); }
                50% { transform: translateY(-50%) translateY(-10px); }
            }

            .avoidance-ball {
                position: absolute;
                width: 20px;
                height: 20px;
                background-color: #98D996;
                border-radius: 50%;
                z-index: 10;
                box-shadow: 0 0 10px rgba(152, 217, 150, 0.6);
                transition: none;
                pointer-events: none;
            }

            .convergence-ball {
                position: absolute;
                width: 15px;
                height: 15px;
                background-color: #98D996;
                border-radius: 50%;
                z-index: 9998;
                box-shadow: 0 0 8px rgba(152, 217, 150, 0.8);
                transition: none;
                pointer-events: none;
            }

            .ball-trail {
                position: absolute;
                width: 8px;
                height: 8px;
                z-index: 9996;
                transition: none;
                pointer-events: none;
                opacity: 0.7;
                filter: brightness(0) saturate(100%) invert(85%) sepia(8%) saturate(1234%) hue-rotate(64deg) brightness(95%) contrast(89%);
            }

            .central-ball {
                position: absolute;
                background-color: #98D996;
                border-radius: 50%;
                z-index: 9999;
                box-shadow: 0 0 30px rgba(152, 217, 150, 1);
                transition: all 0.3s ease-out;
                pointer-events: none;
                left: 50%;
                top: 50%;
                transform: translate(-50%, -50%);
            }

            .scene-six-container.convergence-complete {
                background-color: #98D996 !important;
                transition: background-color 2s ease-in-out;
            }

            .camera-container {
                position: absolute;
                top: 20px;
                right: 20px;
                width: 300px;
                height: 225px;
                border: 2px solid #D5E6D4;
                border-radius: 10px;
                overflow: hidden;
                z-index: 15;
                background-color: rgba(0, 0, 0, 0.3);
            }

            #camera-video {
                width: 100%;
                height: 100%;
                object-fit: cover;
                transform: scaleX(-1) !important; /* 水平镜像显示 */
                -webkit-transform: scaleX(-1) !important; /* Safari兼容性 */
                -moz-transform: scaleX(-1) !important; /* Firefox兼容性 */
                -ms-transform: scaleX(-1) !important; /* IE兼容性 */
            }

            #camera-canvas {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                pointer-events: none;
            }

            .mouth-tracker-point {
                position: fixed;
                left: 50%;
                top: 50%;
                width: 20px;
                height: 20px;
                background-color: #ff6b6b;
                border: 3px solid #ffffff;
                border-radius: 50%;
                transform: translate(-50%, -50%);
                z-index: 9999;
                box-shadow: 0 0 20px rgba(255, 107, 107, 0.8);
                transition: all 0.1s ease-out;
                display: block;
                pointer-events: none;
            }

            .mouth-tracker-point.mouth-open {
                background-color: #4ecdc4;
                box-shadow: 0 0 20px rgba(78, 205, 196, 0.8);
                transform: translate(-50%, -50%) scale(1.3);
            }

            .calibration-button {
                position: absolute;
                bottom: 5px;
                right: 5px;
                background-color: rgba(213, 230, 212, 0.8);
                color: #322030;
                padding: 4px 8px;
                font-size: 10px;
                border-radius: 3px;
                cursor: pointer;
                transition: all 0.3s ease;
                z-index: 20;
            }

            .calibration-button:hover {
                background-color: #D5E6D4;
                transform: scale(1.05);
            }

            .spiral-image {
                position: absolute;
                width: 20px;
                height: 20px;
                z-index: 9995;
                pointer-events: none;
                opacity: 0.8;
                transition: none;
                filter: brightness(0) saturate(100%) invert(85%) sepia(8%) saturate(1234%) hue-rotate(64deg) brightness(95%) contrast(89%);
                animation: spiralGlow 2s ease-in-out infinite alternate;
            }

            @keyframes spiralGlow {
                0% { 
                    filter: brightness(0) saturate(100%) invert(85%) sepia(8%) saturate(1234%) hue-rotate(64deg) brightness(95%) contrast(89%);
                    opacity: 0.6;
                }
                100% { 
                    filter: brightness(0) saturate(100%) invert(85%) sepia(8%) saturate(1234%) hue-rotate(64deg) brightness(110%) contrast(89%) drop-shadow(0 0 8px #D5E6D4);
                    opacity: 0.9;
                }
            }
        `;
        document.head.appendChild(style);
        
        console.log('第六面样式已添加');
    }

    // 初始化第六面交互
    function initSixthSceneInteraction() {
        const topText = document.querySelector('.sixth-scene-text-top');
        
        if (topText) {
            topText.addEventListener('click', function() {
                console.log('点击了 wako ni pamoja nami 文字');
                
                // 点击动效
                this.style.transform = 'scale(0.95)';
                setTimeout(() => {
                    this.style.transform = 'scale(1.05)';
                    setTimeout(() => {
                        this.style.transform = 'scale(1)';
                    }, 150);
                }, 100);
                
                // 播放音频
                const audio = new Audio('斯瓦西里语.mp4');
                audio.play().then(() => {
                    console.log('斯瓦西里语.mp4 播放成功');
                }).catch(error => {
                    console.log('斯瓦西里语.mp4 播放失败:', error);
                });
            });
            
            console.log('第六面文字点击事件已添加');
        } else {
            console.log('未找到第六面顶部文字元素');
        }
    }

    // 初始化人脸识别和嘴部追踪
    function initFaceTracking() {
        console.log('开始初始化人脸识别');
        
        // 检查是否已经在初始化中
        if (window.faceTrackingInitializing) {
            console.log('人脸识别正在初始化中，跳过重复初始化');
            return;
        }
        
        window.faceTrackingInitializing = true;
        
        // 加载MediaPipe库
        loadMediaPipeLibraries().then(() => {
            console.log('MediaPipe库加载完成，开始设置摄像头');
            return setupCamera();
        }).then(() => {
            console.log('摄像头设置完成，开始设置FaceMesh');
            setupFaceMesh();
            window.faceTrackingInitializing = false;
        }).catch(error => {
            console.error('初始化失败:', error);
            window.faceTrackingInitializing = false;
        });
    }



    // 加载MediaPipe库
    function loadMediaPipeLibraries() {
        return new Promise((resolve, reject) => {
            // 检查是否已经加载
            if (window.FaceMesh) {
                resolve();
                return;
            }

            // 加载MediaPipe脚本
            const scripts = [
                'https://cdn.jsdelivr.net/npm/@mediapipe/camera_utils/camera_utils.js',
                'https://cdn.jsdelivr.net/npm/@mediapipe/control_utils/control_utils.js',
                'https://cdn.jsdelivr.net/npm/@mediapipe/drawing_utils/drawing_utils.js',
                'https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/face_mesh.js'
            ];

            let loadedCount = 0;
            
            scripts.forEach(src => {
                const script = document.createElement('script');
                script.src = src;
                script.onload = () => {
                    loadedCount++;
                    if (loadedCount === scripts.length) {
                        console.log('MediaPipe库加载完成');
                        resolve();
                    }
                };
                script.onerror = () => {
                    reject(new Error(`Failed to load script: ${src}`));
                };
                document.head.appendChild(script);
            });
        });
    }

    // 设置摄像头
    function setupCamera() {
        const video = document.getElementById('camera-video');
        
        if (!video) {
            console.error('摄像头视频元素未找到');
            return Promise.reject('视频元素未找到');
        }

        // 检查是否已经有摄像头流
        if (video.srcObject) {
            console.log('摄像头已经设置，跳过重复设置');
            return Promise.resolve();
        }

        // 检查摄像头权限状态
        return navigator.permissions.query({name: 'camera'}).then(permissionStatus => {
            console.log('摄像头权限状态:', permissionStatus.state);
            
            if (permissionStatus.state === 'denied') {
                throw new Error('摄像头权限被拒绝');
            }
            
            console.log('正在请求摄像头权限...');
            
            return navigator.mediaDevices.getUserMedia({
                video: {
                    width: { ideal: 640 },
                    height: { ideal: 480 },
                    facingMode: 'user'
                },
                audio: false
            });
        }).then(stream => {
            console.log('摄像头权限获取成功');
            video.srcObject = stream;
            
            // 保存流引用以便后续清理
            window.cameraStream = stream;
            
            return new Promise((resolve, reject) => {
                video.onloadedmetadata = () => {
                    video.play().then(() => {
                        console.log('摄像头视频播放成功');
                        console.log('视频尺寸:', video.videoWidth, 'x', video.videoHeight);
                        resolve();
                    }).catch(error => {
                        console.error('视频播放失败:', error);
                        reject(error);
                    });
                };
                
                video.onerror = (error) => {
                    console.error('视频加载错误:', error);
                    reject(error);
                };
                
                // 设置超时
                setTimeout(() => {
                    if (video.readyState < 2) {
                        console.error('视频加载超时');
                        reject(new Error('视频加载超时'));
                    }
                }, 10000);
            });
        }).catch(error => {
            console.error('摄像头设置失败:', error);
            
            // 显示用户友好的错误信息
            const errorMsg = error.name === 'NotAllowedError' ? 
                '摄像头权限被拒绝，请在浏览器设置中允许摄像头访问' :
                error.name === 'NotFoundError' ?
                '未找到摄像头设备' :
                '摄像头访问失败: ' + error.message;
                
            console.error(errorMsg);
            return Promise.reject(error);
        });
    }

    // 设置FaceMesh
    function setupFaceMesh() {
        const video = document.getElementById('camera-video');
        const canvas = document.getElementById('camera-canvas');
        const ctx = canvas.getContext('2d');
        const mouthPoint = document.querySelector('.mouth-tracker-point');
        
        if (!video || !canvas || !mouthPoint) {
            console.error('必要元素未找到');
            return;
        }

        // 等待MediaPipe库完全加载
        const checkMediaPipe = () => {
            if (typeof FaceMesh !== 'undefined' && typeof Camera !== 'undefined') {
                initializeFaceMesh();
            } else {
                console.log('等待MediaPipe库加载...');
                setTimeout(checkMediaPipe, 500);
            }
        };

        const initializeFaceMesh = () => {
            try {
                console.log('开始创建FaceMesh实例');
                const faceMesh = new FaceMesh({
                    locateFile: (file) => {
                        return `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`;
                    }
                });

                faceMesh.setOptions({
                    maxNumFaces: 1,
                    refineLandmarks: true,
                    minDetectionConfidence: 0.7,
                    minTrackingConfidence: 0.5
                });

                faceMesh.onResults(onFaceMeshResults);
                console.log('FaceMesh配置完成');

                // 创建摄像头实例
                console.log('开始创建Camera实例');
                const camera = new Camera(video, {
                    onFrame: async () => {
                        if (video.readyState === video.HAVE_ENOUGH_DATA) {
                            await faceMesh.send({image: video});
                        }
                    },
                    width: 640,
                    height: 480
                });

                camera.start();
                console.log('Camera启动完成');
                console.log('FaceMesh初始化完成');
            } catch (error) {
                console.error('FaceMesh初始化失败:', error);
            }
        };

        // 处理FaceMesh结果
        function onFaceMeshResults(results) {
            // 设置画布尺寸
            if (video.videoWidth && video.videoHeight) {
                canvas.width = video.videoWidth;
                canvas.height = video.videoHeight;
            }
            
            // 清除画布
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            if (results.multiFaceLandmarks && results.multiFaceLandmarks.length > 0) {
                const landmarks = results.multiFaceLandmarks[0];
                console.log('检测到人脸，关键点数量:', landmarks.length);
                
                // 使用更准确的嘴部关键点索引
                // MediaPipe Face Mesh 嘴部关键点
                const upperLipTop = landmarks[13];    // 上唇顶部
                const lowerLipBottom = landmarks[14]; // 下唇底部
                const leftMouthCorner = landmarks[61]; // 左嘴角
                const rightMouthCorner = landmarks[291]; // 右嘴角
                
                // 计算嘴部中心（唇珠位置）
                const lipCenterX = (leftMouthCorner.x + rightMouthCorner.x) / 2;
                const lipCenterY = (upperLipTop.y + lowerLipBottom.y) / 2;
                
                // 计算嘴部张开程度
                const mouthOpenness = Math.abs(upperLipTop.y - lowerLipBottom.y);
                const isOpen = mouthOpenness > 0.015; // 调整阈值
                
                console.log('嘴部张开程度:', mouthOpenness.toFixed(4), '状态:', isOpen ? '张开' : '闭合');
                
                // 更新嘴部状态
                if (isOpen) {
                    mouthPoint.classList.add('mouth-open');
                } else {
                    mouthPoint.classList.remove('mouth-open');
                }
                
                // 计算嘴部中心在屏幕上的位置
                const screenWidth = window.innerWidth;
                const screenHeight = window.innerHeight;
                
                // 嘴部位置校准逻辑
                if (!window.mouthCalibrated) {
                    // 第一次检测到人脸时，记录嘴部位置作为原点
                    window.mouthOrigin = { x: lipCenterX, y: lipCenterY };
                    window.mouthCalibrated = true;
                    console.log('嘴部位置已校准，原点:', window.mouthOrigin);
                }
                
                // 设置放大倍数，让屏幕上的点移动距离更大
                const amplificationFactor = 2.5; // 放大倍数，可以调整
                
                // 计算屏幕中心点
                const centerX = screenWidth / 2;
                const centerY = screenHeight / 2;
                
                // 将摄像头坐标转换为相对于校准原点的偏移量
                const offsetX = (window.mouthOrigin.x - lipCenterX) * screenWidth; // 镜像翻转
                const offsetY = (lipCenterY - window.mouthOrigin.y) * screenHeight;
                
                // 放大偏移量
                const amplifiedOffsetX = offsetX * amplificationFactor;
                const amplifiedOffsetY = offsetY * amplificationFactor;
                
                // 计算最终屏幕坐标
                let screenX = centerX + amplifiedOffsetX;
                let screenY = centerY + amplifiedOffsetY;
                
                // 确保点始终在屏幕范围内
                const pointSize = 20; // 点的大小
                const margin = pointSize / 2; // 边距
                
                screenX = Math.max(margin, Math.min(screenWidth - margin, screenX));
                screenY = Math.max(margin, Math.min(screenHeight - margin, screenY));
                
                // 更新追踪点位置
                mouthPoint.style.left = screenX + 'px';
                mouthPoint.style.top = screenY + 'px';
                mouthPoint.style.display = 'block'; // 确保点可见
                
                // 在摄像头画布上绘制嘴部点
                ctx.fillStyle = isOpen ? '#4ecdc4' : '#ff6b6b';
                ctx.beginPath();
                ctx.arc(
                    lipCenterX * canvas.width,
                    lipCenterY * canvas.height,
                    8, 0, 2 * Math.PI
                );
                ctx.fill();
                
                // 绘制嘴部轮廓点（调试用）
                ctx.fillStyle = '#ffffff';
                [upperLipTop, lowerLipBottom, leftMouthCorner, rightMouthCorner].forEach(point => {
                    ctx.beginPath();
                    ctx.arc(point.x * canvas.width, point.y * canvas.height, 3, 0, 2 * Math.PI);
                    ctx.fill();
                });
                
                console.log(`嘴部中心位置: (${screenX.toFixed(0)}, ${screenY.toFixed(0)})`);
            } else {
                console.log('未检测到人脸');
                // 未检测到人脸时，将点移回屏幕中心
                const centerX = window.innerWidth / 2;
                const centerY = window.innerHeight / 2;
                mouthPoint.style.left = centerX + 'px';
                mouthPoint.style.top = centerY + 'px';
                mouthPoint.style.display = 'block';
            }
        }

        checkMediaPipe();
    }

    // 初始化拖拽游戏
    function initDragGame() {
        console.log('初始化拖拽游戏');
        
        const character6 = document.querySelector('.sixth-scene-left-character');
        const mouthPoint = document.querySelector('.mouth-tracker-point');
        
        if (!character6 || !mouthPoint) {
            console.error('拖拽游戏初始化失败：找不到必要元素');
            return;
        }
        
        // 游戏状态
        let isDragging = false;
        let dragOffset = { x: 0, y: 0 };
        
        // 嘴部位置校准
        let mouthCalibrated = false;
        let mouthOrigin = { x: 0.5, y: 0.5 }; // 摄像头中的嘴部原点位置
        
        // 检查嘴部点是否在6.png范围内
        function isPointOverCharacter(pointX, pointY) {
            const characterRect = character6.getBoundingClientRect();
            return pointX >= characterRect.left && 
                   pointX <= characterRect.right && 
                   pointY >= characterRect.top && 
                   pointY <= characterRect.bottom;
        }
        
        // 开始拖拽
        function startDragging(pointX, pointY) {
            const characterRect = character6.getBoundingClientRect();
            dragOffset.x = pointX - (characterRect.left + characterRect.width / 2);
            dragOffset.y = pointY - (characterRect.top + characterRect.height / 2);
            
            isDragging = true;
            character6.classList.add('dragging');
            
            console.log('开始拖拽6.png');
        }
        
        // 停止拖拽，保持当前位置
        function stopDragging() {
            if (!isDragging) return;
            
            isDragging = false;
            character6.classList.remove('dragging');
            
            console.log('6.png停止拖拽，保持当前位置');
            
            // 立即重置状态，不需要等待动画
            setTimeout(() => {
                console.log('6.png位置固定完成');
            }, 100);
        }
        
        // 更新拖拽位置
        function updateDragPosition(pointX, pointY) {
            if (!isDragging) return;
            
            const containerRect = document.querySelector('.scene-six-container').getBoundingClientRect();
            
            // 计算新位置（减去偏移量）
            const newX = pointX - dragOffset.x;
            const newY = pointY - dragOffset.y;
            
            // 转换为相对于容器的百分比
            const relativeX = ((newX - containerRect.left) / containerRect.width) * 100;
            const relativeY = ((newY - containerRect.top) / containerRect.height) * 100;
            
            // 限制在容器范围内
            const clampedX = Math.max(0, Math.min(95, relativeX));
            const clampedY = Math.max(0, Math.min(90, relativeY));
            
            // 更新位置
            character6.style.left = clampedX + '%';
            character6.style.top = clampedY + '%';
            character6.style.bottom = 'auto';
            character6.style.transform = 'none';
        }
        
        // 监听嘴部状态变化
        let lastMouthState = null;
        let lastPointPosition = { x: 0, y: 0 };
        
        // 创建一个观察器来监听嘴部点的变化
        const observer = new MutationObserver(() => {
            const pointRect = mouthPoint.getBoundingClientRect();
            const pointX = pointRect.left + pointRect.width / 2;
            const pointY = pointRect.top + pointRect.height / 2;
            
            // 更新位置记录
            lastPointPosition.x = pointX;
            lastPointPosition.y = pointY;
            
            // 检查嘴部状态
            const isMouthClosed = !mouthPoint.classList.contains('mouth-open');
            
            if (isMouthClosed && lastMouthState !== 'closed') {
                // 嘴巴刚闭合
                if (isPointOverCharacter(pointX, pointY)) {
                    startDragging(pointX, pointY);
                }
                lastMouthState = 'closed';
            } else if (!isMouthClosed && lastMouthState !== 'open') {
                // 嘴巴刚张开
                if (isDragging) {
                    stopDragging();
                }
                lastMouthState = 'open';
            }
            
            // 如果正在拖拽，更新位置
            if (isDragging) {
                updateDragPosition(pointX, pointY);
            }
        });
        
        // 开始观察嘴部点的变化
        observer.observe(mouthPoint, {
            attributes: true,
            attributeFilter: ['class', 'style']
        });
        
        // 保存清理函数
        window.dragGameCleanup = () => {
            observer.disconnect();
            if (isDragging) {
                stopDragging();
            }
            // 重置校准状态
            window.mouthCalibrated = false;
            window.mouthOrigin = null;
        };
        
        console.log('拖拽游戏初始化完成');
    }

    // 全局函数：重新校准嘴部位置
    window.recalibrateMouth = function() {
        window.mouthCalibrated = false;
        window.mouthOrigin = null;
        console.log('嘴部位置校准已重置，下次检测到人脸时将重新校准');
        
        // 临时显示提示信息
        const button = document.querySelector('.calibration-button');
        if (button) {
            const originalText = button.textContent;
            button.textContent = '已重置';
            button.style.backgroundColor = '#4ecdc4';
            setTimeout(() => {
                button.textContent = originalText;
                button.style.backgroundColor = 'rgba(213, 230, 212, 0.8)';
            }, 1000);
        }
    }

    // 初始化躲避游戏
    function initAvoidanceGame() {
        console.log('初始化躲避游戏');
        
        const container = document.querySelector('.scene-six-container');
        const character6 = document.querySelector('.sixth-scene-left-character');
        
        if (!container || !character6) {
            console.error('躲避游戏初始化失败：找不到必要元素');
            return;
        }
        
        // 游戏状态
        let gameActive = false;
        let ballGenerationInterval = null;
        let activeBalls = [];
        let ballSpeed = 2; // 小球移动速度
        let ballGenerationRate = 800; // 小球生成间隔（毫秒）
        let gameStartTime = 0; // 游戏开始时间
        let survivalTime = 10000; // 生存时间（10秒）
        let convergenceActive = false; // 聚集动画是否激活
        let convergenceBalls = []; // 聚集的小球
        let centralBall = null; // 中心大球
        
        // 开始游戏
        function startAvoidanceGame() {
            if (gameActive || convergenceActive) return;
            
            gameActive = true;
            gameStartTime = Date.now();
            console.log('开始躲避游戏');
            
            // 开始生成小球
            ballGenerationInterval = setInterval(generateBall, ballGenerationRate);
            
            // 开始移动所有小球
            requestAnimationFrame(updateBalls);
        }
        
        // 停止游戏
        function stopAvoidanceGame() {
            if (!gameActive) return;
            
            gameActive = false;
            console.log('停止躲避游戏');
            
            // 停止生成小球
            if (ballGenerationInterval) {
                clearInterval(ballGenerationInterval);
                ballGenerationInterval = null;
            }
            
            // 清除所有小球
            clearAllBalls();
        }
        
        // 生成小球
        function generateBall() {
            if (!gameActive) return;
            
            const containerRect = container.getBoundingClientRect();
            const ball = document.createElement('div');
            ball.className = 'avoidance-ball';
            
            // 随机选择从哪个边缘射出
            const side = Math.floor(Math.random() * 4); // 0:上, 1:右, 2:下, 3:左
            let startX, startY, targetX, targetY;
            
            switch (side) {
                case 0: // 从上边射出
                    startX = Math.random() * containerRect.width;
                    startY = -20;
                    targetX = Math.random() * containerRect.width;
                    targetY = containerRect.height + 20;
                    break;
                case 1: // 从右边射出
                    startX = containerRect.width + 20;
                    startY = Math.random() * containerRect.height;
                    targetX = -20;
                    targetY = Math.random() * containerRect.height;
                    break;
                case 2: // 从下边射出
                    startX = Math.random() * containerRect.width;
                    startY = containerRect.height + 20;
                    targetX = Math.random() * containerRect.width;
                    targetY = -20;
                    break;
                case 3: // 从左边射出
                    startX = -20;
                    startY = Math.random() * containerRect.height;
                    targetX = containerRect.width + 20;
                    targetY = Math.random() * containerRect.height;
                    break;
            }
            
            // 设置小球初始位置
            ball.style.left = startX + 'px';
            ball.style.top = startY + 'px';
            
            // 计算移动方向
            const deltaX = targetX - startX;
            const deltaY = targetY - startY;
            const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
            const velocityX = (deltaX / distance) * ballSpeed;
            const velocityY = (deltaY / distance) * ballSpeed;
            
            // 存储小球数据
            const ballData = {
                element: ball,
                x: startX,
                y: startY,
                velocityX: velocityX,
                velocityY: velocityY,
                spiralImages: [], // 存储螺旋图片
                spiralAngle: 0,   // 螺旋角度
                spiralRadius: 30  // 螺旋半径
            };
            
            activeBalls.push(ballData);
            container.appendChild(ball);
            
            // 生成螺旋图片
            generateSpiralImages(ballData);
            
            console.log('生成小球，从边缘', side, '射出');
        }
        
        // 生成螺旋图片
        function generateSpiralImages(ballData) {
            // 随机生成2-4个螺旋图片
            const imageCount = Math.floor(Math.random() * 3) + 2;
            
            for (let i = 0; i < imageCount; i++) {
                const spiralImg = document.createElement('img');
                
                // 随机选择png.1或png.2
                const imageNumber = Math.random() < 0.5 ? '1' : '2';
                spiralImg.src = `png.${imageNumber}`;
                spiralImg.className = 'spiral-image';
                
                // 设置图片样式
                spiralImg.style.position = 'absolute';
                spiralImg.style.width = '20px';  // 和球差不多大小
                spiralImg.style.height = '20px';
                spiralImg.style.zIndex = '9995';
                spiralImg.style.pointerEvents = 'none';
                spiralImg.style.opacity = '0.8';
                
                // 初始角度偏移
                const angleOffset = (i * 2 * Math.PI) / imageCount;
                
                const spiralData = {
                    element: spiralImg,
                    angleOffset: angleOffset,
                    rotationSpeed: (Math.random() * 0.2 + 0.1) * (Math.random() < 0.5 ? 1 : -1) // 随机旋转速度和方向
                };
                
                ballData.spiralImages.push(spiralData);
                container.appendChild(spiralImg);
            }
                 }
        
        // 更新螺旋图片位置
        function updateSpiralImages(ballData) {
            ballData.spiralAngle += 0.15; // 螺旋旋转速度
            
            ballData.spiralImages.forEach(spiralData => {
                // 计算螺旋位置
                const angle = ballData.spiralAngle + spiralData.angleOffset;
                const spiralX = ballData.x + 10 + Math.cos(angle) * ballData.spiralRadius; // 10是球的半径偏移
                const spiralY = ballData.y + 10 + Math.sin(angle) * ballData.spiralRadius;
                
                // 更新螺旋图片位置
                spiralData.element.style.left = spiralX + 'px';
                spiralData.element.style.top = spiralY + 'px';
                
                // 添加旋转效果
                spiralData.element.style.transform = `rotate(${angle * spiralData.rotationSpeed * 180 / Math.PI}deg)`;
            });
        }
        
        // 更新所有小球位置
        function updateBalls() {
            if (!gameActive) return;
            
            const containerRect = container.getBoundingClientRect();
            const currentTime = Date.now();
            
            // 检查是否达到生存时间
            if (currentTime - gameStartTime >= survivalTime) {
                console.log('生存10秒成功！开始聚集动画');
                startConvergenceAnimation();
                return;
            }
            
            for (let i = activeBalls.length - 1; i >= 0; i--) {
                const ballData = activeBalls[i];
                
                // 更新位置
                ballData.x += ballData.velocityX;
                ballData.y += ballData.velocityY;
                
                ballData.element.style.left = ballData.x + 'px';
                ballData.element.style.top = ballData.y + 'px';
                
                // 更新螺旋图片位置
                updateSpiralImages(ballData);
                
                // 检查是否超出屏幕边界
                if (ballData.x < -50 || ballData.x > containerRect.width + 50 ||
                    ballData.y < -50 || ballData.y > containerRect.height + 50) {
                    // 移除小球和螺旋图片
                    removeBallAndSpirals(ballData);
                    activeBalls.splice(i, 1);
                    continue;
                }
                
                // 检查与6.png的碰撞
                if (checkCollisionWithCharacter(ballData)) {
                    console.log('碰撞检测：6.png被小球击中！');
                    restartGame();
                    return;
                }
            }
            
            // 继续更新
            if (gameActive) {
                requestAnimationFrame(updateBalls);
            }
        }
        
        // 检查与6.png的碰撞
        function checkCollisionWithCharacter(ballData) {
            const characterRect = character6.getBoundingClientRect();
            const containerRect = container.getBoundingClientRect();
            
            // 转换为相对于容器的坐标
            const characterX = characterRect.left - containerRect.left;
            const characterY = characterRect.top - containerRect.top;
            const characterWidth = characterRect.width;
            const characterHeight = characterRect.height;
            
            // 小球中心点
            const ballCenterX = ballData.x + 10; // 小球半径为10
            const ballCenterY = ballData.y + 10;
            
            // 检查碰撞（简单的矩形碰撞检测）
            return ballCenterX >= characterX && 
                   ballCenterX <= characterX + characterWidth &&
                   ballCenterY >= characterY && 
                   ballCenterY <= characterY + characterHeight;
        }
        
        // 移除单个小球和其螺旋图片
        function removeBallAndSpirals(ballData) {
            // 移除小球
                if (ballData.element.parentNode) {
                    container.removeChild(ballData.element);
            }
            
            // 移除螺旋图片
            ballData.spiralImages.forEach(spiralData => {
                if (spiralData.element.parentNode) {
                    container.removeChild(spiralData.element);
                }
            });
        }
        
        // 清除所有小球
        function clearAllBalls() {
            activeBalls.forEach(ballData => {
                removeBallAndSpirals(ballData);
            });
            activeBalls = [];
        }
        
        // 开始聚集动画
        function startConvergenceAnimation() {
            console.log('开始聚集动画');
            
            // 停止躲避游戏
            stopAvoidanceGame();
            convergenceActive = true;
            
            // 隐藏摄像头界面和其他UI元素，让聚集动画成为焦点
            const cameraContainer = document.querySelector('.camera-container');
            const sceneTexts = document.querySelectorAll('.sixth-scene-text-top, .sixth-scene-text-bottom');
            const skipButton = document.querySelector('.scene-skip-button');
            const mouthPoint = document.querySelector('.mouth-tracker-point');
            
            if (cameraContainer) {
                cameraContainer.style.opacity = '0.3';
                cameraContainer.style.zIndex = '1';
            }
            
            sceneTexts.forEach(text => {
                if (text) {
                    text.style.opacity = '0.3';
                    text.style.zIndex = '1';
                }
            });
            
            if (skipButton) {
                skipButton.style.opacity = '0.3';
                skipButton.style.zIndex = '1';
            }
            
            // 隐藏嘴部追踪小圆点
            if (mouthPoint) {
                mouthPoint.style.opacity = '0';
                mouthPoint.style.display = 'none';
            }
            
            // 6.png脱离控制，移动到中心
            character6.classList.remove('dragging');
            character6.style.left = '50%';
            character6.style.top = '50%';
            character6.style.transform = 'translate(-50%, -50%)';
            character6.style.transition = 'all 1s ease-out';
            character6.style.zIndex = '9997'; // 确保在聚集小球下方
            
            // 创建中心大球
            createCentralBall();
            
            // 开始生成聚集小球
            let convergenceInterval = 300; // 初始生成间隔（更快）
            let ballSize = 50; // 中心球初始大小
            let animationDuration = 15000; // 总动画时长15秒
            let startTime = Date.now();
            
            function generateConvergenceBalls() {
                if (!convergenceActive) return;
                
                const elapsed = Date.now() - startTime;
                const progress = Math.min(elapsed / animationDuration, 1);
                
                // 随着时间推移，生成速度越来越快
                convergenceInterval = Math.max(20, 300 * (1 - progress * 0.95));
                
                // 生成更多小球，数量随时间大幅增加
                const ballCount = Math.floor(2 + progress * 15); // 2-17个小球
                for (let i = 0; i < ballCount; i++) {
                    createConvergenceBall();
                }
                
                // 额外在高密度阶段生成更多小球
                if (progress > 0.5) {
                    const extraBalls = Math.floor((progress - 0.5) * 20); // 额外0-10个小球
                    for (let i = 0; i < extraBalls; i++) {
                        createConvergenceBall();
                    }
                }
                
                // 更新中心球大小
                ballSize = 50 + progress * (Math.max(window.innerWidth, window.innerHeight) * 1.5);
                updateCentralBallSize(ballSize);
                
                // 检查是否完成
                if (progress >= 1) {
                    completeConvergence();
                    return;
                }
                
                // 继续生成
                setTimeout(generateConvergenceBalls, convergenceInterval);
            }
            
            // 开始生成
            generateConvergenceBalls();
            
            // 添加额外的连续生成器，让小球更加密集
            let extraGeneratorInterval = setInterval(() => {
                if (!convergenceActive) {
                    clearInterval(extraGeneratorInterval);
                    return;
                }
                
                const elapsed = Date.now() - startTime;
                const progress = Math.min(elapsed / animationDuration, 1);
                
                // 在后半段时间增加额外的小球生成
                if (progress > 0.3) {
                    const extraCount = Math.floor((progress - 0.3) * 8); // 0-5个额外小球
                    for (let i = 0; i < extraCount; i++) {
                        createConvergenceBall();
                    }
                }
                
                if (progress >= 1) {
                    clearInterval(extraGeneratorInterval);
                }
            }, 100); // 每100毫秒额外生成
            
            // 开始更新聚集小球
            requestAnimationFrame(updateConvergenceBalls);
        }
        
        // 创建中心大球
        function createCentralBall() {
            centralBall = document.createElement('div');
            centralBall.className = 'central-ball';
            centralBall.style.width = '50px';
            centralBall.style.height = '50px';
            container.appendChild(centralBall);
        }
        
        // 更新中心球大小
        function updateCentralBallSize(size) {
            if (centralBall) {
                centralBall.style.width = size + 'px';
                centralBall.style.height = size + 'px';
            }
        }
        
        // 创建聚集小球
        function createConvergenceBall() {
            const containerRect = container.getBoundingClientRect();
            const ball = document.createElement('div');
            ball.className = 'convergence-ball';
            
            // 从屏幕边缘和角落随机位置开始，增加更多起始点
            const spawnType = Math.floor(Math.random() * 8); // 8种不同的生成位置
            let startX, startY;
            
            switch (spawnType) {
                case 0: // 上边
                    startX = Math.random() * containerRect.width;
                    startY = -15;
                    break;
                case 1: // 右边
                    startX = containerRect.width + 15;
                    startY = Math.random() * containerRect.height;
                    break;
                case 2: // 下边
                    startX = Math.random() * containerRect.width;
                    startY = containerRect.height + 15;
                    break;
                case 3: // 左边
                    startX = -15;
                    startY = Math.random() * containerRect.height;
                    break;
                case 4: // 左上角
                    startX = -15;
                    startY = -15;
                    break;
                case 5: // 右上角
                    startX = containerRect.width + 15;
                    startY = -15;
                    break;
                case 6: // 右下角
                    startX = containerRect.width + 15;
                    startY = containerRect.height + 15;
                    break;
                case 7: // 左下角
                    startX = -15;
                    startY = containerRect.height + 15;
                    break;
            }
            
            ball.style.left = startX + 'px';
            ball.style.top = startY + 'px';
            
            // 计算向中心的速度，增加速度变化范围
            const centerX = containerRect.width / 2;
            const centerY = containerRect.height / 2;
            const deltaX = centerX - startX;
            const deltaY = centerY - startY;
            const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
            const speed = 2 + Math.random() * 4; // 更大的速度范围：2-6
            
            const ballData = {
                element: ball,
                x: startX,
                y: startY,
                velocityX: (deltaX / distance) * speed,
                velocityY: (deltaY / distance) * speed,
                trail: [], // 存储拖尾元素
                trailPositions: [], // 存储历史位置
                spiralOffset: Math.random() * Math.PI * 2 // 螺旋起始角度
            };
            
            convergenceBalls.push(ballData);
            container.appendChild(ball);
        }
        
        // 更新聚集小球
        function updateConvergenceBalls() {
            if (!convergenceActive) return;
            
            const containerRect = container.getBoundingClientRect();
            const centerX = containerRect.width / 2;
            const centerY = containerRect.height / 2;
            
            for (let i = convergenceBalls.length - 1; i >= 0; i--) {
                const ballData = convergenceBalls[i];
                
                // 记录当前位置到历史轨迹
                ballData.trailPositions.push({ x: ballData.x, y: ballData.y });
                
                // 限制轨迹长度，避免内存过多占用
                if (ballData.trailPositions.length > 10) {
                    ballData.trailPositions.shift();
                }
                
                // 更新位置
                ballData.x += ballData.velocityX;
                ballData.y += ballData.velocityY;
                
                ballData.element.style.left = ballData.x + 'px';
                ballData.element.style.top = ballData.y + 'px';
                
                // 生成拖尾效果
                generateTrailEffect(ballData);
                
                // 更新现有拖尾
                updateTrailElements(ballData);
                
                // 检查是否到达中心
                const distanceToCenter = Math.sqrt(
                    Math.pow(ballData.x - centerX, 2) + Math.pow(ballData.y - centerY, 2)
                );
                
                if (distanceToCenter < 30) {
                    // 小球到达中心，清理拖尾并移除
                    cleanupTrail(ballData);
                    container.removeChild(ballData.element);
                    convergenceBalls.splice(i, 1);
                }
            }
            
            // 继续更新
            if (convergenceActive) {
                requestAnimationFrame(updateConvergenceBalls);
            }
        }
        
        // 生成拖尾效果
        function generateTrailEffect(ballData) {
            // 限制每个小球的最大拖尾数量
            if (ballData.trail.length >= 8) {
                return; // 如果拖尾数量已达上限，不再生成
            }
            
            // 减少拖尾生成频率以优化性能
            if (Math.random() < 0.1) { // 10%概率生成拖尾（从30%降低到10%）
                const trailElement = document.createElement('img');
                trailElement.className = 'ball-trail';
                
                // 随机选择1.png或2.png
                trailElement.src = Math.random() < 0.5 ? '1.png' : '2.png';
                
                // 在小球轨迹周围生成螺旋位置
                const spiralRadius = 5 + Math.random() * 10; // 螺旋半径5-15px
                const spiralAngle = ballData.spiralOffset + ballData.trailPositions.length * 0.3;
                
                const offsetX = Math.cos(spiralAngle) * spiralRadius;
                const offsetY = Math.sin(spiralAngle) * spiralRadius;
                
                const trailX = ballData.x + offsetX;
                const trailY = ballData.y + offsetY;
                
                trailElement.style.left = trailX + 'px';
                trailElement.style.top = trailY + 'px';
                
                // 随机旋转
                const rotation = Math.random() * 360;
                trailElement.style.transform = `rotate(${rotation}deg)`;
                
                // 添加到拖尾数组
                const trailData = {
                    element: trailElement,
                    x: trailX,
                    y: trailY,
                    life: 1.0, // 生命值，从1.0开始
                    maxLife: 1.0, // 最大生命值
                    age: 0, // 年龄（以帧为单位）
                    fadeStartAge: 120, // 2秒后开始消失（60fps * 2秒）
                    rotation: rotation,
                    rotationSpeed: (Math.random() - 0.5) * 10 // 旋转速度
                };
                
                ballData.trail.push(trailData);
                container.appendChild(trailElement);
            }
        }
        
        // 更新拖尾元素
        function updateTrailElements(ballData) {
            for (let j = ballData.trail.length - 1; j >= 0; j--) {
                const trailData = ballData.trail[j];
                
                // 增加年龄
                trailData.age++;
                
                // 检查是否开始消失阶段
                if (trailData.age >= trailData.fadeStartAge) {
                    // 2秒后开始衰减生命值
                    const fadeProgress = (trailData.age - trailData.fadeStartAge) / 45; // 0.75秒内完全消失
                    trailData.life = Math.max(0, trailData.maxLife - fadeProgress);
                }
                
                // 更新旋转
                trailData.rotation += trailData.rotationSpeed;
                
                // 更新样式
                const opacity = trailData.life * 0.7;
                const scale = 0.5 + (trailData.life * 0.5); // 缩放范围0.5-1.0
                
                trailData.element.style.opacity = opacity;
                trailData.element.style.transform = `rotate(${trailData.rotation}deg) scale(${scale})`;
                
                // 如果生命值耗尽，移除拖尾元素
                if (trailData.life <= 0) {
                    if (trailData.element.parentNode) {
                        container.removeChild(trailData.element);
                    }
                    ballData.trail.splice(j, 1);
                }
            }
        }
        
        // 清理拖尾
        function cleanupTrail(ballData) {
            ballData.trail.forEach(trailData => {
                if (trailData.element.parentNode) {
                    container.removeChild(trailData.element);
                }
            });
            ballData.trail = [];
        }
        
        // 完成聚集动画
        function completeConvergence() {
            console.log('聚集动画完成，画面变为绿色');
            
            // 画面变为绿色
            container.classList.add('convergence-complete');
            
            // 隐藏所有元素
            setTimeout(() => {
                character6.style.opacity = '0';
                if (centralBall) {
                    centralBall.style.opacity = '0';
                }
                
                // 清理剩余的聚集小球
                convergenceBalls.forEach(ballData => {
                    if (ballData.element.parentNode) {
                        ballData.element.style.opacity = '0';
                    }
                });
                
                // 2秒后开始下滑切换到第七面
                setTimeout(() => {
                    transitionToSeventhScene();
                }, 2000);
            }, 2000);
        }
        
        // 重新开始游戏
        function restartGame() {
            console.log('游戏重新开始！');
            
            // 停止当前游戏和聚集动画
            stopAvoidanceGame();
            stopConvergenceAnimation();
            
            // 恢复UI元素的显示
            const cameraContainer = document.querySelector('.camera-container');
            const sceneTexts = document.querySelectorAll('.sixth-scene-text-top, .sixth-scene-text-bottom');
            const skipButton = document.querySelector('.scene-skip-button');
            const mouthPoint = document.querySelector('.mouth-tracker-point');
            
            if (cameraContainer) {
                cameraContainer.style.opacity = '1';
                cameraContainer.style.zIndex = '15';
            }
            
            sceneTexts.forEach(text => {
                if (text) {
                    text.style.opacity = '1';
                    text.style.zIndex = '10';
                }
            });
            
            if (skipButton) {
                skipButton.style.opacity = '1';
                skipButton.style.zIndex = '1001';
            }
            
            // 恢复嘴部追踪小圆点的显示
            if (mouthPoint) {
                mouthPoint.style.opacity = '1';
                mouthPoint.style.display = 'block';
            }
            
            // 重置6.png位置到初始位置
            character6.style.left = '10%';
            character6.style.top = '50%';
            character6.style.bottom = 'auto';
            character6.style.transform = 'translateY(-50%)';
            character6.style.transition = 'all 0.1s ease-out';
            character6.style.opacity = '1';
            character6.style.zIndex = '5'; // 恢复原始z-index
            character6.classList.remove('dragging');
            
            // 重置容器背景
            container.classList.remove('convergence-complete');
            
            // 重置拖拽状态
            if (window.dragGameCleanup) {
                // 重置拖拽游戏状态但不断开观察器
                console.log('重置拖拽状态');
            }
            
            // 短暂延迟后重新开始
            setTimeout(() => {
                console.log('游戏重新开始完成');
            }, 500);
        }
        
        // 停止聚集动画
        function stopConvergenceAnimation() {
            convergenceActive = false;
            
            // 清理聚集小球和拖尾
            convergenceBalls.forEach(ballData => {
                // 清理拖尾
                cleanupTrail(ballData);
                // 清理小球
                if (ballData.element.parentNode) {
                    container.removeChild(ballData.element);
                }
            });
            convergenceBalls = [];
            
            // 清理中心球
            if (centralBall && centralBall.parentNode) {
                container.removeChild(centralBall);
                centralBall = null;
            }
        }
        
        // 监听拖拽状态变化
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                    const isDragging = character6.classList.contains('dragging');
                    
                    if (isDragging && !gameActive) {
                        startAvoidanceGame();
                    } else if (!isDragging && gameActive) {
                        stopAvoidanceGame();
                    }
                }
            });
        });
        
        // 开始观察6.png的class变化
        observer.observe(character6, {
            attributes: true,
            attributeFilter: ['class']
        });
        
        // 保存清理函数
        window.avoidanceGameCleanup = () => {
            observer.disconnect();
            stopAvoidanceGame();
            stopConvergenceAnimation();
        };
        
        console.log('躲避游戏初始化完成');
    }

    // 切换到第七面
    function transitionToSeventhScene() {
        console.log('开始切换到第七面');
        
        // 调用第六面的清理函数
        if (window.avoidanceGameCleanup) {
            console.log('调用第六面清理函数');
            window.avoidanceGameCleanup();
            window.avoidanceGameCleanup = null;
        }
        
        // 停止摄像头流
        if (window.cameraStream) {
            window.cameraStream.getTracks().forEach(track => track.stop());
            window.cameraStream = null;
        }

        const container = document.querySelector('.scene-six-container');
        if (!container) {
            console.log('未找到第六面容器，直接创建第七面');
            createSeventhScene();
            return;
        }
        
        // 添加下滑切换动画
        container.style.transition = 'transform 1.5s ease-in-out';
        container.style.transform = 'translateY(-100vh)';
        
        // 1.5秒后创建第七面
        setTimeout(() => {
            createSeventhScene();
        }, 1500);
    }

    // 创建第七面
    function createSeventhScene() {
        // 完全清理之前页面的影响
        cleanupAllPreviousScenes();
        
        // 清除第六面内容
        document.body.innerHTML = '';
        
        // 创建第七面的HTML结构
        const seventhSceneHTML = `
            <div class="scene-seven-container" id="seventhContainer">
                <div class="seventh-scene-content">
                    <!-- 亮光圈 -->
                    <div class="light-circle" id="lightCircle">
                        <!-- 上传图片窗口 -->
                        <div class="upload-window" id="uploadWindow">
                            <div class="upload-area" id="uploadArea">
                                <div class="upload-text">
                                    <p>拖拽图片到此处或点击上传</p>
                                    <p class="upload-hint">上传 U.png 来召唤主角</p>
                                </div>
                                <input type="file" id="fileInput" accept="image/*" style="display: none;">
                            </div>
                            <!-- 主角将在这里生成 -->
                            <img alt="主角" class="seventh-scene-character" id="seventhCharacter" style="display: none;">
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        document.body.innerHTML = seventhSceneHTML;
        
        // 添加第七面的样式
        addSeventhSceneStyles();
        
        // 初始化第七面
        initSeventhScene();
    }

    // 清理所有之前场景的影响
    function cleanupAllPreviousScenes() {
        console.log('开始清理所有之前场景的影响');
        
        // 1. 清理所有样式表
        const allStyles = document.querySelectorAll('style');
        allStyles.forEach(style => {
            if (style.textContent.includes('.scene-') || 
                style.textContent.includes('@keyframes') ||
                style.textContent.includes('.character') ||
                style.textContent.includes('.avoidance-ball') ||
                style.textContent.includes('.spiral-image')) {
                style.remove();
            }
        });
        
        // 2. 清理所有全局变量和清理函数
        if (window.secondSceneCleanup) {
            try { window.secondSceneCleanup(); } catch(e) {}
            window.secondSceneCleanup = null;
        }
        if (window.thirdSceneCleanup) {
            try { window.thirdSceneCleanup(); } catch(e) {}
            window.thirdSceneCleanup = null;
        }
        if (window.fourthSceneCleanup) {
            try { window.fourthSceneCleanup(); } catch(e) {}
            window.fourthSceneCleanup = null;
        }
        if (window.fifthSceneVoiceCleanup) {
            try { window.fifthSceneVoiceCleanup(); } catch(e) {}
            window.fifthSceneVoiceCleanup = null;
        }
        if (window.avoidanceGameCleanup) {
            try { window.avoidanceGameCleanup(); } catch(e) {}
            window.avoidanceGameCleanup = null;
        }
        if (window.dragGameCleanup) {
            try { window.dragGameCleanup(); } catch(e) {}
            window.dragGameCleanup = null;
        }
        
        // 3. 停止所有音频
        const allAudios = document.querySelectorAll('audio');
        allAudios.forEach(audio => {
            try {
                audio.pause();
                audio.currentTime = 0;
                audio.remove();
            } catch(e) {}
        });
        
        // 4. 停止摄像头流
        if (window.cameraStream) {
            try {
                window.cameraStream.getTracks().forEach(track => track.stop());
            } catch(e) {}
            window.cameraStream = null;
        }
        
        // 5. 清理语音识别
        if (typeof recognition !== 'undefined' && recognition) {
            try {
                recognition.stop();
                recognition = null;
            } catch(e) {}
        }
        
        // 6. 清理所有定时器和动画帧
        // 清理所有可能的定时器ID（暴力清理法）
        for (let i = 1; i < 10000; i++) {
            clearTimeout(i);
            clearInterval(i);
        }
        
        // 7. 清理事件监听器相关的全局变量
        window.faceTrackingInitializing = false;
        
        // 8. 重置body样式
        document.body.style.cssText = '';
        document.body.className = '';
        
        // 9. 重置html样式
        document.documentElement.style.cssText = '';
        document.documentElement.className = '';
        
        // 10. 清理可能残留的CSS类
        document.body.classList.remove('convergence-complete');
        
        console.log('所有之前场景的影响已清理完成');
    }

    // 添加第七面的样式
    function addSeventhSceneStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .scene-seven-container {
                width: 100vw;
                height: 100vh;
                background-color: #98D996;
                position: relative;
                overflow: hidden;
            }

            .seventh-scene-content {
                position: relative;
                width: 100%;
                height: 100%;
            }

            .light-circle {
                position: absolute;
                left: 50%;
                top: 50%;
                transform: translate(-50%, -50%);
                width: 500px;
                height: 500px;
                background: radial-gradient(circle, rgba(255, 255, 255, 0.3) 0%, rgba(255, 255, 255, 0.1) 40%, transparent 70%);
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                opacity: 0;
                transform: translate(-50%, -50%) scale(0);
                transition: all 2s ease-out;
            }

            .light-circle.show {
                opacity: 1;
                transform: translate(-50%, -50%) scale(1);
            }

            .upload-window {
                position: relative;
                width: 300px;
                height: 400px;
                background-color: rgba(255, 255, 255, 0.1);
                border: 2px dashed rgba(255, 255, 255, 0.3);
                border-radius: 15px;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                transition: all 0.3s ease;
                opacity: 0;
                transform: scale(0.8);
            }

            .upload-window.show {
                opacity: 1;
                transform: scale(1);
            }

            .upload-window:hover {
                background-color: rgba(255, 255, 255, 0.15);
                border-color: rgba(255, 255, 255, 0.5);
            }

            .upload-area {
                width: 100%;
                height: 100%;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                cursor: pointer;
                transition: all 0.3s ease;
            }

            .upload-area:hover {
                background-color: rgba(255, 255, 255, 0.05);
            }

            .upload-text {
                text-align: center;
                color: rgba(255, 255, 255, 0.8);
                font-size: 16px;
                line-height: 1.5;
            }

            .upload-hint {
                font-size: 14px !important;
                color: rgba(255, 255, 255, 0.6) !important;
                margin-top: 10px !important;
            }

            .seventh-scene-character {
                position: absolute;
                left: 50%;
                top: 50%;
                transform: translate(-50%, -50%);
                width: auto;
                height: 120px;
                z-index: 5;
                animation: float 2s ease-in-out infinite;
                transition: all 0.1s ease-out;
                cursor: pointer;
                opacity: 0;
            }

            .seventh-scene-character.show {
                opacity: 1 !important;
                visibility: visible !important;
                display: block !important;
                animation: characterAppear 2s ease-out forwards, float 2s ease-in-out infinite 2s;
            }

            @keyframes characterAppear {
                0% {
                    opacity: 0;
                    transform: translate(-50%, -50%) scale(0);
                }
                50% {
                    opacity: 0.5;
                    transform: translate(-50%, -50%) scale(0.5);
                }
                100% {
                    opacity: 1;
                    transform: translate(-50%, -50%) scale(1);
                }
            }

            @keyframes float {
                0%, 100% { transform: translate(-50%, -50%) translateY(0px); }
                50% { transform: translate(-50%, -50%) translateY(-10px); }
            }
            

            

        `;
        document.head.appendChild(style);
        
        console.log('第七面样式已添加');
    }

    // 初始化第七面
    function initSeventhScene() {
        console.log('初始化第七面');
        
        // 开始动画序列
        startSeventhSceneAnimation();
        
        // 添加第七面的跳转按钮
        addSceneSkipButton(7, transitionToEighthScene);
        
        console.log('第七面初始化完成');
    }

    // 开始第七面动画序列
    function startSeventhSceneAnimation() {
        const lightCircle = document.getElementById('lightCircle');
        const uploadWindow = document.getElementById('uploadWindow');
        
        console.log('开始第七面动画序列');
        
        // 直接显示光圈和上传窗口
        setTimeout(() => {
            console.log('显示光圈和上传窗口');
            lightCircle.classList.add('show');
            uploadWindow.classList.add('show');
            
            // 初始化功能
            setTimeout(() => {
                initSeventhSceneFunctions();
            }, 500);
            
        }, 100); // 立即开始
    }

    // 初始化第七面的所有功能
    function initSeventhSceneFunctions() {
        console.log('初始化第七面功能');
        
        // 自动下载U.png文件
        setTimeout(() => {
            downloadUPng();
        }, 1000); // 延迟1秒后开始下载
        
        // 初始化上传功能
        initUploadFunction();
        
        // 初始化主角控制系统
        initSeventhSceneCharacterMovement();
        
        console.log('第七面功能初始化完成');
    }

    // 初始化上传功能
    function initUploadFunction() {
        const uploadArea = document.getElementById('uploadArea');
        const fileInput = document.getElementById('fileInput');
        const character = document.getElementById('seventhCharacter');
        
        if (!uploadArea || !fileInput || !character) {
            console.error('上传元素未找到');
            return;
        }
        
        // 点击上传区域触发文件选择
        uploadArea.addEventListener('click', () => {
            fileInput.click();
        });
        
        // 文件选择事件
        fileInput.addEventListener('change', handleFileUpload);
        
        // 拖拽事件
        uploadArea.addEventListener('dragover', (e) => {
            e.preventDefault();
            uploadArea.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
        });
        
        uploadArea.addEventListener('dragleave', (e) => {
            e.preventDefault();
            uploadArea.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
        });
        
        uploadArea.addEventListener('drop', (e) => {
            e.preventDefault();
            uploadArea.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
            
            const files = e.dataTransfer.files;
            if (files.length > 0) {
                handleFileUpload({ target: { files: files } });
            }
        });
        
        console.log('上传功能初始化完成');
    }

    // 处理文件上传
    function handleFileUpload(event) {
        const file = event.target.files[0];
        if (!file) return;
        
        console.log('上传的文件:', file.name);
        
        // 检查文件名是否为U.png
        if (file.name === 'U.png') {
            console.log('检测到U.png文件，开始生成主角');
            
            // 读取文件并设置为主角图片
            const reader = new FileReader();
            reader.onload = function(e) {
                const character = document.getElementById('seventhCharacter');
                const uploadArea = document.getElementById('uploadArea');
                const uploadWindow = document.getElementById('uploadWindow');
                
                if (character && uploadArea && uploadWindow) {
                    // 存储上传的图片数据（优先存储）
                    character.dataset.uploadedImage = e.target.result;
                    
                    // 保存到localStorage供第八面使用
                    localStorage.setItem('uploadedCharacterImage', e.target.result);
                    
                    // 设置主角图片
                    character.src = e.target.result;
                    
                    // 隐藏整个上传窗口
                    uploadWindow.style.display = 'none';
                    
                    // 显示主角并播放出现动画
                    character.style.display = 'block';
                    character.style.visibility = 'visible';
                    character.style.opacity = '1';
                    setTimeout(() => {
                        character.classList.add('show');
                        
                        // 再次确保图片正确设置
                        character.src = character.dataset.uploadedImage;
                        
                        console.log('主角图片设置为:', character.src);
                        console.log('存储的图片数据:', character.dataset.uploadedImage ? '已存储' : '未存储');
                        
                        // 2秒后自动进入第八面
                        setTimeout(() => {
                            transitionToEighthScene();
                        }, 2000);
                        
                    }, 100);
                    
                    console.log('主角已生成，2秒后将进入第八面');
                }
            };
            reader.readAsDataURL(file);
        } else {
            console.log('文件名不是U.png，忽略上传');
            alert('请上传名为 U.png 的文件来召唤主角');
        }
    }

    // 初始化第七面主角移动控制（和第二面一样）
    function initSeventhSceneCharacterMovement() {
        const character = document.getElementById('seventhCharacter');
        if (!character) {
            console.error('第七面主角元素未找到');
            return;
        }
        
        // 移动状态
        let keys = {
            ArrowUp: false,
            ArrowDown: false,
            ArrowLeft: false,
            ArrowRight: false,
            KeyW: false,
            KeyA: false,
            KeyS: false,
            KeyD: false
        };
        
        let characterX = 50; // 百分比位置
        let characterY = 50;
        let moveSpeed = 0.5; // 移动速度
        
        // 重置所有按键状态
        function resetAllKeys() {
            Object.keys(keys).forEach(key => {
                keys[key] = false;
            });
        }
        
        // 更新主角图片方向
        function updateCharacterImage() {
            // 第七面专用：只使用上传的图片，不进行任何图片切换
            if (character.dataset.uploadedImage) {
                // 强制设置为上传的图片，覆盖任何其他设置
                character.src = character.dataset.uploadedImage;
            }
            
            // 只处理翻转，不改变图片源
            if (keys.ArrowLeft || keys.KeyA) {
                character.style.transform = 'translate(-50%, -50%) scaleX(-1)'; // 向左翻转
            } else if (keys.ArrowRight || keys.KeyD) {
                character.style.transform = 'translate(-50%, -50%) scaleX(1)'; // 向右正常
            }
        }
        
        // 键盘按下事件
        function keydownHandler(event) {
            if (keys.hasOwnProperty(event.code)) {
                keys[event.code] = true;
                updateCharacterImage();
                event.preventDefault();
            }
        }
        
        // 键盘释放事件
        function keyupHandler(event) {
            if (keys.hasOwnProperty(event.code)) {
                keys[event.code] = false;
                updateCharacterImage();
                event.preventDefault();
            }
        }
        
        // 窗口失焦时重置按键
        function handleWindowBlur() {
            resetAllKeys();
            updateCharacterImage();
        }
        
        // 窗口获焦时重置按键
        function handleWindowFocus() {
            resetAllKeys();
            updateCharacterImage();
        }
        
        // 页面可见性变化时重置按键
        function handleVisibilityChange() {
            if (document.hidden) {
                resetAllKeys();
                updateCharacterImage();
            }
        }
        
        // 更新移动
        function updateMovement() {
            // 计算移动方向
            let deltaX = 0;
            let deltaY = 0;
            
            if (keys.ArrowLeft || keys.KeyA) deltaX -= moveSpeed;
            if (keys.ArrowRight || keys.KeyD) deltaX += moveSpeed;
            if (keys.ArrowUp || keys.KeyW) deltaY -= moveSpeed;
            if (keys.ArrowDown || keys.KeyS) deltaY += moveSpeed;
            
            // 更新位置
            characterX += deltaX;
            characterY += deltaY;
            
            // 边界检查
            characterX = Math.max(5, Math.min(95, characterX));
            characterY = Math.max(5, Math.min(95, characterY));
            
            // 应用位置
            character.style.left = characterX + '%';
            character.style.top = characterY + '%';
            
            // 确保上传图片保持
            if (character.dataset.uploadedImage) {
                // 确保使用上传的图片
                if (character.src !== character.dataset.uploadedImage) {
                    character.src = character.dataset.uploadedImage;
                }
            }
            
            // 继续更新
            requestAnimationFrame(updateMovement);
        }
        
        // 添加事件监听器
        document.addEventListener('keydown', keydownHandler);
        document.addEventListener('keyup', keyupHandler);
        window.addEventListener('blur', handleWindowBlur);
        window.addEventListener('focus', handleWindowFocus);
        document.addEventListener('visibilitychange', handleVisibilityChange);
        
        // 开始移动更新循环
        requestAnimationFrame(updateMovement);
        
        // 添加定期检查，确保图片正确显示
        const imageCheckInterval = setInterval(() => {
            if (character.dataset.uploadedImage) {
                // 检查图片是否被意外更改
                if (character.src !== character.dataset.uploadedImage) {
                    console.log('检测到图片被更改，重新设置为上传的图片');
                    character.src = character.dataset.uploadedImage;
                }
                

                
                // 检查可见性
                const computedStyle = getComputedStyle(character);
                if (computedStyle.opacity === '0' || computedStyle.visibility === 'hidden' || character.style.display === 'none') {
                    console.log('检测到主角不可见，强制显示');
                    character.style.display = 'block';
                    character.style.visibility = 'visible';
                    character.style.opacity = '1';
                    character.classList.add('show');
                }
            }
        }, 100); // 每100ms检查一次
        
        // 返回清理函数
        return function cleanup() {
            document.removeEventListener('keydown', keydownHandler);
            document.removeEventListener('keyup', keyupHandler);
            window.removeEventListener('blur', handleWindowBlur);
            window.removeEventListener('focus', handleWindowFocus);
            document.removeEventListener('visibilitychange', handleVisibilityChange);
            
            // 清理图片检查定时器
            if (imageCheckInterval) {
                clearInterval(imageCheckInterval);
            }
        };
    }

    // 转场到第八面
    function transitionToEighthScene() {
        console.log('开始转场到第八面');
        
        // 添加下滑动画
        const container = document.getElementById('seventhContainer');
        if (container) {
            container.style.transition = 'transform 1s ease-in-out';
            container.style.transform = 'translateY(-100vh)';
            
            setTimeout(() => {
                createEighthScene();
            }, 1000);
        }
    }

    // 创建第八面
    function createEighthScene() {
        console.log('创建第八面');
        
        // 清除第七面内容
        document.body.innerHTML = '';
        
        // 创建第八面的HTML结构（空白场景）
        const eighthSceneHTML = `
            <div class="scene-eight-container" id="eighthContainer">
                <!-- 顶部角色 -->
                <div class="top-character" style="opacity: 0;">
                    <img src="9/16.png" alt="角色" class="character-image" onerror="this.style.display='none'">
                </div>
                
                <!-- 多语言图片区域 -->
                <div class="language-texts">
                    <div class="language-group korean">
                        <img src="9/1.png" alt="열쇠" class="main-image" style="opacity: 0;" onerror="this.style.display='none'">
                        <img src="9/2.png" alt="를 찾아요" class="sub-image" style="opacity: 0;" onerror="this.style.display='none'">
                    </div>
                    
                    <div class="language-group georgian">
                        <img src="9/3.png" alt="კარი" class="main-image" style="opacity: 0;" onerror="this.style.display='none'">
                        <img src="9/4.png" alt="გაიღე" class="sub-image" style="opacity: 0;" onerror="this.style.display='none'">
                    </div>
                    
                    <div class="language-group arabic">
                        <div class="arabic-container">
                            <img src="9/6.png" alt="ك" class="arabic-left-image" style="opacity: 0;" onerror="this.style.display='none'">
                            <img src="9/5.png" alt="تتحدث" class="arabic-right-image" style="opacity: 0;" onerror="this.style.display='none'">
                        </div>
                    </div>
                    
                    <div class="language-group thai">
                        <div class="thai-container">
                            <img src="9/8.png" alt="ใจ" class="thai-left-image" style="opacity: 0;" onerror="this.style.display='none'">
                            <img src="9/9.png" alt="ของคุณ สำคัญ" class="thai-right-image" style="opacity: 0;" onerror="this.style.display='none'">
                        </div>
                    </div>
                    
                    <div class="language-group swahili">
                        <div class="main-text" style="opacity: 0;">wako ni</div>
                        <div class="sub-text" style="opacity: 0;">pamoja nami</div>
                    </div>
                </div>
                
                <!-- 半圆和图标 -->
                <div class="center-semicircle">
                    <img src="9/13.png" alt="灯泡" class="icon icon-bulb" style="opacity: 0;" onerror="this.style.display='none'">
                    <img src="9/14.png" alt="烟花" class="icon icon-fireworks" style="opacity: 0;" onerror="this.style.display='none'">
                    <img src="9/12.png" alt="钥匙" class="icon icon-key" style="opacity: 0;" onerror="this.style.display='none'">
                    <img src="9/15.png" alt="心形" class="icon icon-heart" style="opacity: 0;" onerror="this.style.display='none'">
                </div>
            </div>
        `;
        
        document.body.innerHTML = eighthSceneHTML;
        
        // 添加第八面的样式
        addEighthSceneStyles();
        
        // 初始化第八面
        initEighthScene();
        
        // 添加第八面的跳转按钮
        addSceneSkipButton(8, transitionToNextScene);
    }

    // 添加第八面的样式（空白场景）
    function addEighthSceneStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .scene-eight-container {
                width: 100vw;
                height: 100vh;
                background-color: #D5E6D4;
                position: relative;
                overflow: hidden;
                animation: slideInFromBottom 1s ease-out;
            }

            @keyframes slideInFromBottom {
                from {
                    transform: translateY(100vh);
                }
                to {
                    transform: translateY(0);
                }
            }

            /* 顶部角色 */
            .top-character {
                position: absolute;
                top: 8%;
                left: 50%;
                transform: translateX(-50%);
                text-align: center;
            }

            .character-image {
                width: 80px;
                height: auto;
                animation: characterFloat 3s ease-in-out infinite;
            }



            @keyframes characterFloat {
                0%, 100% { transform: translateY(0px); }
                50% { transform: translateY(-8px); }
            }

            /* 多语言文字区域 */
            .language-texts {
                position: absolute;
                top: 35%;
                left: 0;
                right: 0;
                display: flex;
                justify-content: space-around;
                align-items: flex-start;
                padding: 0 5%;
            }

            .language-group {
                text-align: center;
                color: #322030;
                font-family: Arial, sans-serif;
            }

            /* 图片样式 */
            .language-group .main-image {
                height: 55px;
                width: auto;
                margin-bottom: 5px;
                display: block;
                margin-left: auto;
                margin-right: auto;
            }

            .language-group .sub-image {
                height: 25px;
                width: auto;
                opacity: 0.8;
                display: block;
                margin-left: auto;
                margin-right: auto;
            }

            /* 文字样式（保留给斯瓦希里语） */
            .language-group .main-text {
                font-size: 50px;
                font-weight: bold;
                margin-bottom: 5px;
                line-height: 1;
            }

            .language-group .sub-text {
                font-size: 25px;
                font-weight: normal;
                opacity: 0.8;
                line-height: 1;
            }

            /* 韩语图片 */
            .korean .main-image {
                height: 58px;
            }

            /* 格鲁吉亚语图片 */
            .georgian .main-image {
                height: 55px;
            }

            /* 阿拉伯语容器和图片 */
            .arabic-container {
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 15px;
            }

            .arabic-left-image {
                height: 55px;
                width: auto;
            }

            .arabic-right-image {
                height: 32px;
                width: auto;
            }

            /* 泰语容器和图片 */
            .thai-container {
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 15px;
            }

            .thai-left-image {
                height: 55px;
                width: auto;
            }

            .thai-right-image {
                height: 55px;
                width: auto;
            }

            /* 斯瓦希里语文字 */
            .swahili .main-text {
                font-size: 48px;
            }

            /* 半圆和图标 */
            .center-semicircle {
                position: absolute;
                width: 500px;
                height: 250px;
                background-color: #322030;
                border-radius: 500px 500px 0 0;
                bottom: 0;
                left: 50%;
                transform: translateX(-50%);
                display: flex;
                align-items: center;
                justify-content: space-around;
                padding: 50px 75px 0;
                border: 4px solid rgba(213, 230, 212, 0.3);
                box-shadow: inset 0 0 25px rgba(0, 0, 0, 0.3);
            }

            .icon {
                width: 100px;
                height: 100px;
                filter: none;
                opacity: 1;
                transition: all 0.3s ease;
            }

            .icon:hover {
                transform: scale(1.1);
            }

            /* 发光动画效果 */
            @keyframes glowEffect {
                0% {
                    filter: drop-shadow(0 0 0px #4CAF50);
                }
                50% {
                    filter: drop-shadow(0 0 25px #4CAF50);
                }
                100% {
                    filter: drop-shadow(0 0 0px #4CAF50);
                }
            }

            .glow-animation {
                animation: glowEffect 1s ease-in-out;
            }

            .permanent-glow {
                filter: drop-shadow(0 0 20px #4CAF50) !important;
            }

            /* 图标位置调整 - 按顺序从左到右围成半圆弧形 */
            .icon-key {
                position: absolute;
                top: 125px;
                left: 75px;
            }

            .icon-bulb {
                position: absolute;
                top: 62px;
                left: 30%;
            }

            .icon-fireworks {
                position: absolute;
                top: 62px;
                right: 30%;
            }

            .icon-heart {
                position: absolute;
                top: 125px;
                right: 75px;
            }
        `;
        document.head.appendChild(style);
        
        console.log('第八面样式已添加');
    }

    // 初始化第八面（空白场景）
    function initEighthScene() {
        console.log('初始化第八面（空白场景）');
        
        // 关闭摄像头功能
        if (window.cameraStream) {
            console.log('关闭摄像头流');
            try {
                window.cameraStream.getTracks().forEach(track => {
                    track.stop();
                    console.log('摄像头轨道已停止:', track.kind);
                });
                window.cameraStream = null;
                console.log('摄像头流已清理');
            } catch (error) {
                console.error('关闭摄像头时出错:', error);
            }
        }
        
        // 清理摄像头相关的DOM元素
        const cameraVideo = document.getElementById('camera-video');
        const cameraCanvas = document.getElementById('camera-canvas');
        
        if (cameraVideo) {
            cameraVideo.srcObject = null;
            cameraVideo.pause();
            console.log('摄像头视频元素已清理');
        }
        
        if (cameraCanvas) {
            const ctx = cameraCanvas.getContext('2d');
            if (ctx) {
                ctx.clearRect(0, 0, cameraCanvas.width, cameraCanvas.height);
            }
            console.log('摄像头画布已清理');
        }
        
        // 重置人脸识别相关的全局变量
        window.faceTrackingInitializing = false;
        window.mouthCalibrated = false;
        window.mouthOrigin = null;
        
        // 启动第八面动画序列
        startEighthSceneAnimation();
        
        console.log('第八面初始化完成，摄像头功能已关闭');
    }

    // 第八面动画序列
    function startEighthSceneAnimation() {
        console.log('开始第八面动画序列');
        
        // 淡入动画函数
        function fadeInElement(selector, delay = 0) {
            setTimeout(() => {
                const element = document.querySelector(selector);
                if (element) {
                    element.style.transition = 'opacity 1s ease-in-out';
                    element.style.opacity = '1';
                    console.log(`${selector} 淡入完成`);
                }
            }, delay);
        }
        
        // 发光动画函数
        function glowElement(selector, delay = 0) {
            setTimeout(() => {
                const element = document.querySelector(selector);
                if (element) {
                    element.classList.add('glow-animation');
                    setTimeout(() => {
                        element.classList.remove('glow-animation');
                    }, 1000);
                    console.log(`${selector} 发光完成`);
                }
            }, delay);
        }
        
        // 显示图标并发光
        function showAndGlowIcon(iconSelector, delay = 0) {
            setTimeout(() => {
                const icon = document.querySelector(iconSelector);
                if (icon) {
                    icon.style.transition = 'opacity 1s ease-in-out';
                    icon.style.opacity = '1';
                    icon.classList.add('glow-animation');
                    setTimeout(() => {
                        icon.classList.remove('glow-animation');
                    }, 1000);
                    console.log(`${iconSelector} 显示并发光完成`);
                }
            }, delay);
        }
        
        // 第一阶段：元素依次淡入（2秒后开始，每隔1秒一个）
        fadeInElement('.korean .main-image', 2000);           // 1.png
        fadeInElement('.korean .sub-image', 3000);            // 2.png
        fadeInElement('.georgian .main-image', 4000);         // 3.png
        fadeInElement('.georgian .sub-image', 5000);          // 4.png
        fadeInElement('.arabic-left-image', 6000);            // 6.png
        fadeInElement('.arabic-right-image', 7000);           // 5.png
        fadeInElement('.thai-left-image', 8000);              // 8.png
        fadeInElement('.thai-right-image', 9000);             // 9.png
        fadeInElement('.swahili .main-text', 10000);          // wako ni
        fadeInElement('.swahili .sub-text', 11000);           // pamoja nami
        
        // 显示中文翻译函数
        function showChineseTranslation(parentSelector, text, delay = 0) {
            setTimeout(() => {
                const parent = document.querySelector(parentSelector);
                if (parent) {
                    const translation = document.createElement('div');
                    translation.textContent = text;
                    translation.style.cssText = `
                        color: #322030;
                        font-size: 18px;
                        font-family: Arial, sans-serif;
                        margin-top: 10px;
                        opacity: 0;
                        transition: opacity 1s ease-in-out;
                        text-align: center;
                    `;
                    translation.className = 'chinese-translation';
                    
                    parent.appendChild(translation);
                    
                    // 淡入效果
                    setTimeout(() => {
                        translation.style.opacity = '1';
                    }, 100);
                    
                    console.log(`中文翻译"${text}"已添加到${parentSelector}`);
                }
            }, delay);
        }
        
        // 第二阶段：配对发光（等待5秒后开始，每隔2秒一对）
        const pairStartTime = 16000; // 11秒 + 5秒等待
        
        // 1.png 和 12.png 配对发光，同时在2.png下面显示"钥匙（韩语）"
        glowElement('.korean .main-image', pairStartTime);
        showAndGlowIcon('.icon-key', pairStartTime);
        showChineseTranslation('.korean', '钥匙（韩语）', pairStartTime);
        
        // 3.png 和 13.png 配对发光，同时在4.png下面显示"门（格鲁吉亚语）"
        glowElement('.georgian .main-image', pairStartTime + 2000);
        showAndGlowIcon('.icon-bulb', pairStartTime + 2000);
        showChineseTranslation('.georgian', '门（格鲁吉亚语）', pairStartTime + 2000);
        
        // 6.png 和 14.png 配对发光，同时在6.png下面显示"不要（阿拉伯语）"
        glowElement('.arabic-left-image', pairStartTime + 4000);
        showAndGlowIcon('.icon-fireworks', pairStartTime + 4000);
        showChineseTranslation('.arabic-container', '不要（阿拉伯语）', pairStartTime + 4000);
        
        // 8.png 和 15.png 配对发光，同时在8.png下面显示"心（泰语）"
        glowElement('.thai-left-image', pairStartTime + 6000);
        showAndGlowIcon('.icon-heart', pairStartTime + 6000);
        showChineseTranslation('.thai-container', '心（泰语）', pairStartTime + 6000);
        
        // 第三阶段：wako ni 发光，16.png 出现并持续发光，同时在pamoja nami下面显示"在你身边"
        setTimeout(() => {
            glowElement('.swahili .main-text', 0);
            showChineseTranslation('.swahili', '在你身边', 0);
            
            const character = document.querySelector('.top-character');
            if (character) {
                character.style.transition = 'opacity 1s ease-in-out';
                character.style.opacity = '1';
                const characterImage = character.querySelector('.character-image');
                characterImage.classList.add('permanent-glow');
                
                // 添加点击事件
                characterImage.style.cursor = 'pointer';
                characterImage.addEventListener('click', function() {
                    console.log('16.png 被点击，播放组合句.mp4');
                    playVideoAndTransition();
                });
                
                console.log('16.png 出现并持续发光，点击事件已添加');
            }
        }, pairStartTime + 11000); // 再等待5秒
        
        console.log('第八面动画序列设置完成');
    }

    // 播放视频并切换场景
    function playVideoAndTransition() {
        console.log('开始播放组合句.mp4');
        
        // 创建视频容器
        const videoContainer = document.createElement('div');
        videoContainer.style.position = 'fixed';
        videoContainer.style.top = '0';
        videoContainer.style.left = '0';
        videoContainer.style.width = '100vw';
        videoContainer.style.height = '100vh';
        videoContainer.style.backgroundColor = '#D5E6D4'; // 使用游戏背景色
        videoContainer.style.zIndex = '9999';
        videoContainer.style.display = 'flex';
        videoContainer.style.alignItems = 'center';
        videoContainer.style.justifyContent = 'center';
        
        // 创建视频元素
        const video = document.createElement('video');
        video.src = '组合句.mp4';
        video.style.maxWidth = '100%';
        video.style.maxHeight = '100%';
        video.style.objectFit = 'contain'; // 改为contain以保持比例
        video.autoplay = true;
        video.muted = false;
        video.controls = false; // 不显示控制条
        
        // 添加加载提示
        const loadingText = document.createElement('div');
        loadingText.textContent = '视频加载中...';
        loadingText.style.position = 'absolute';
        loadingText.style.color = '#322030';
        loadingText.style.fontSize = '24px';
        loadingText.style.fontFamily = 'Arial, sans-serif';
        
        videoContainer.appendChild(loadingText);
        videoContainer.appendChild(video);
        document.body.appendChild(videoContainer);
        
        // 视频可以播放时隐藏加载提示
        video.addEventListener('canplay', function() {
            loadingText.style.display = 'none';
            console.log('视频可以播放');
        });
        
        // 视频播放完成后的处理
        video.addEventListener('ended', function() {
            console.log('组合句.mp4 播放完成，准备切换到下一面');
            
            // 移除视频容器
            videoContainer.remove();
            
            // 下滑切换到下一面（新的空白页）
            transitionToNextScene();
        });
        
        // 视频加载失败的处理
        video.addEventListener('error', function(e) {
            console.error('视频播放失败:', e);
            loadingText.textContent = '视频加载失败，3秒后继续...';
            
            // 如果视频播放失败，3秒后切换到下一面
            setTimeout(() => {
                videoContainer.remove();
                transitionToNextScene();
            }, 3000);
        });
        
        // 确保视频开始播放
        video.play().catch(error => {
            console.error('视频播放启动失败:', error);
            loadingText.textContent = '视频播放失败，3秒后继续...';
            
            // 如果播放启动失败，3秒后切换到下一面
            setTimeout(() => {
                videoContainer.remove();
                transitionToNextScene();
            }, 3000);
        });
    }

    // 切换到下一面（新的空白页）
    function transitionToNextScene() {
        console.log('开始下滑切换到新的空白页');
        
        const container = document.getElementById('eighthContainer');
        if (container) {
            container.style.transition = 'transform 1.5s ease-in-out';
            container.style.transform = 'translateY(-100vh)';
            
            setTimeout(() => {
                // 创建新的空白页
                createBlankPage();
            }, 1500);
        } else {
            // 如果容器不存在，直接创建空白页
            createBlankPage();
        }
    }

    // 创建新的空白页
    function createBlankPage() {
        console.log('创建新的空白页');
        
        // 清除页面内容
        document.body.innerHTML = '';
        
        // 创建空白页HTML（只有背景）
        const blankPageHTML = `
            <div class="blank-page-container">
                <!-- 左侧月亮 -->
                <div class="moon">
                    <img src="10/3.png" alt="月亮" class="moon-image" onerror="this.style.display='none'">
                </div>
                
                <!-- 英文文字 -->
                <div class="english-text">
                    <img src="10/英文.png" alt="Your sweet courage walks near me." class="english-image" style="opacity: 0;" onerror="this.style.display='none'">
                </div>
                
                <!-- 中文文字 -->
                <div class="chinese-text">
                    <img src="10/中文句.png" alt="你的勇气，如微光随我而行" class="chinese-image" style="opacity: 0;" onerror="this.style.display='none'">
                </div>
                
                <!-- 右侧树和人物 -->
                <div class="tree-character">
                    <img src="10/5.png" alt="树和人物" class="tree-image" onerror="this.style.display='none'">
                </div>
                
                <!-- 按钮 -->
                <div class="button-container">
                    <img src="10/按钮.png" alt="按钮" class="button-image" onerror="this.style.display='none'">
                </div>
            </div>
        `;
        
        document.body.innerHTML = blankPageHTML;
        
        // 添加空白页样式（只有背景）
        const style = document.createElement('style');
        style.textContent = `
            .blank-page-container {
                width: 100vw;
                height: 100vh;
                background-color: #322030;
                position: relative;
                overflow: hidden;
                animation: slideInFromBottom 1s ease-out;
            }

            @keyframes slideInFromBottom {
                from {
                    transform: translateY(100vh);
                }
                to {
                    transform: translateY(0);
                }
            }

            /* 右下角月亮 */
            .moon {
                position: absolute;
                right: 25%;
                bottom: 15%;
                z-index: 1;
            }

            .moon-image {
                width: 80px;
                height: auto;
                opacity: 0.9;
            }

            /* 英文文字 */
            .english-text {
                position: absolute;
                top: 15%;
                left: 50%;
                transform: translateX(-50%);
                z-index: 3;
            }

            .english-image {
                width: auto;
                height: 60px;
                transition: opacity 1s ease-in-out;
            }

            /* 中文文字 */
            .chinese-text {
                position: absolute;
                top: 28%;
                left: 50%;
                transform: translateX(-50%);
                z-index: 3;
            }

            .chinese-image {
                width: auto;
                height: 50px;
                transition: opacity 1s ease-in-out;
            }
            
            /* 淡入动画类 */
            .fade-in {
                opacity: 1 !important;
            }
            
            /* 月亮发光效果 */
            .moon-glow {
                animation: moonGlow 2s ease-in-out;
            }
            
            @keyframes moonGlow {
                0% {
                    filter: drop-shadow(0 0 0 #D5E6D4);
                }
                50% {
                    filter: drop-shadow(0 0 30px #D5E6D4) drop-shadow(0 0 60px #D5E6D4);
                }
                100% {
                    filter: drop-shadow(0 0 0 #D5E6D4);
                }
            }

            /* 右侧树和人物 */
            .tree-character {
                position: absolute;
                right: 8%;
                bottom: 0;
                z-index: 2;
            }

            .tree-image {
                width: auto;
                height: 400px;
            }

            /* 按钮 */
            .button-container {
                position: absolute;
                top: 5%;
                left: 5%;
                z-index: 4;
                cursor: pointer;
            }

            .button-image {
                width: auto;
                height: 60px;
                transition: all 0.3s ease;
                cursor: pointer;
            }
            
            .button-image:hover {
                transform: scale(1.1);
                filter: brightness(1.2);
            }

            .button-image:hover {
                transform: scale(1.05);
                filter: brightness(1.1);
            }
        `;
        
        document.head.appendChild(style);
        
        // 添加最后一面的跳转按钮（重新开始游戏）
        addSceneSkipButton(9, () => {
            location.reload();
        });
        
        // 为按钮.png添加点击事件
        const buttonImage = document.querySelector('.button-image');
        if (buttonImage) {
            buttonImage.addEventListener('click', function() {
                console.log('按钮.png被点击，播放组合句.mp4');
                playVideoInLastScene();
            });
        }
        
        // 启动最后一面的动画
        startLastSceneAnimation();
        
        console.log('空白页创建完成');
    }

    // 启动最后一面的动画
    function startLastSceneAnimation() {
        console.log('开始最后一面动画');
        
        // 2秒后显示英文.png（慢慢淡入）
        setTimeout(() => {
            const englishImage = document.querySelector('.english-image');
            if (englishImage) {
                console.log('显示英文.png');
                englishImage.classList.add('fade-in');
            }
            
            // 再过1秒后显示中文.png（渐渐淡入）
            setTimeout(() => {
                const chineseImage = document.querySelector('.chinese-image');
                const moonImage = document.querySelector('.moon-image');
                
                if (chineseImage) {
                    console.log('显示中文.png');
                    chineseImage.classList.add('fade-in');
                }
                
                // 同时让月亮发光
                if (moonImage) {
                    console.log('月亮开始发光');
                    moonImage.classList.add('moon-glow');
                    
                    // 2秒后移除发光效果（动画完成后）
                    setTimeout(() => {
                        moonImage.classList.remove('moon-glow');
                        
                        // 月亮发光完成后开始生成1.png和2.png
                        console.log('开始生成随机图片');
                        startRandomImageGeneration();
                    }, 2000);
                }
            }, 1000); // 英文.png显示1秒后
            
        }, 2000); // 进入最后一面2秒后
    }

    // 随机图片生成系统
    let randomImageInterval;
    let generationSpeed = 800; // 初始生成间隔（毫秒）- 更快的起始速度
    let isGeneratingImages = false;

    function startRandomImageGeneration() {
        if (isGeneratingImages) return;
        
        isGeneratingImages = true;
        console.log('启动随机图片生成系统');
        
        // 开始生成图片
        generateRandomImages();
        
        // 每2秒加快生成速度
        const speedInterval = setInterval(() => {
            if (generationSpeed > 50) { // 最快每50毫秒生成一次
                generationSpeed = Math.max(50, generationSpeed * 0.6); // 每次速度提升40%
                console.log('生成速度加快至:', generationSpeed + 'ms');
                
                // 重新设置生成间隔
                clearInterval(randomImageInterval);
                generateRandomImages();
            }
        }, 2000); // 更频繁的加速
        
        // 存储间隔ID以便清理
        window.lastSceneSpeedInterval = speedInterval;
    }

    function generateRandomImages() {
        randomImageInterval = setInterval(() => {
            if (!isGeneratingImages) return;
            
            // 随机生成1-3个图片
            const batchSize = Math.floor(Math.random() * 3) + 1;
            
            for (let i = 0; i < batchSize; i++) {
                // 随机选择1.png或2.png
                const imageNames = ['1.png', '2.png'];
                const randomImage = imageNames[Math.floor(Math.random() * imageNames.length)];
                
                // 稍微延迟每个图片的生成，避免完全重叠
                setTimeout(() => {
                    createFloatingImage(randomImage);
                }, i * 100);
            }
        }, generationSpeed);
    }

    function createFloatingImage(imageName) {
        const container = document.querySelector('.blank-page-container');
        if (!container) return;
        
        // 创建图片元素
        const img = document.createElement('img');
        img.src = imageName;
        img.style.position = 'absolute';
        img.style.pointerEvents = 'none';
        img.style.zIndex = '1';
        
        // 随机位置
        const x = Math.random() * (window.innerWidth - 100); // 减去图片宽度避免溢出
        const y = Math.random() * window.innerHeight;
        
        // 根据Y位置调整大小：越下方越大，越上方越小
        const minSize = 20; // 最小尺寸
        const maxSize = 80; // 最大尺寸
        const sizeRatio = y / window.innerHeight; // 0到1的比例
        const size = minSize + (maxSize - minSize) * sizeRatio;
        
        img.style.left = x + 'px';
        img.style.top = y + 'px';
        img.style.width = size + 'px';
        img.style.height = 'auto';
        img.style.opacity = '0';
        img.style.transition = 'opacity 0.5s ease-in-out';
        
        container.appendChild(img);
        
        // 淡入效果
        setTimeout(() => {
            img.style.opacity = '0.8';
        }, 50);
        
        // 图片不会消失，永久保留在画面上
        
        console.log(`生成${imageName}，位置:(${Math.round(x)}, ${Math.round(y)})，大小:${Math.round(size)}px`);
    }

    function stopRandomImageGeneration() {
        isGeneratingImages = false;
        if (randomImageInterval) {
            clearInterval(randomImageInterval);
        }
        if (window.lastSceneSpeedInterval) {
            clearInterval(window.lastSceneSpeedInterval);
        }
        
        // 清理所有生成的图片
        const container = document.querySelector('.blank-page-container');
        if (container) {
            const floatingImages = container.querySelectorAll('img[src="1.png"], img[src="2.png"]');
            floatingImages.forEach(img => img.remove());
        }
        
        // 重置参数
        generationSpeed = 800;
        console.log('停止随机图片生成');
    }

    // 在最后一面播放视频
    function playVideoInLastScene() {
        console.log('开始在最后一面播放组合句.mp4');
        
        // 暂停图片生成
        stopRandomImageGeneration();
        
        // 创建视频容器
        const videoContainer = document.createElement('div');
        videoContainer.style.position = 'fixed';
        videoContainer.style.top = '0';
        videoContainer.style.left = '0';
        videoContainer.style.width = '100vw';
        videoContainer.style.height = '100vh';
        videoContainer.style.backgroundColor = '#322030'; // 使用最后一面的背景色
        videoContainer.style.zIndex = '9999';
        videoContainer.style.display = 'flex';
        videoContainer.style.alignItems = 'center';
        videoContainer.style.justifyContent = 'center';
        
        // 创建视频元素
        const video = document.createElement('video');
        video.src = '组合句.mp4';
        video.style.maxWidth = '100%';
        video.style.maxHeight = '100%';
        video.style.objectFit = 'contain';
        video.autoplay = true;
        video.muted = false;
        video.controls = false;
        
        // 添加加载提示
        const loadingText = document.createElement('div');
        loadingText.textContent = '视频加载中...';
        loadingText.style.position = 'absolute';
        loadingText.style.color = '#D5E6D4';
        loadingText.style.fontSize = '24px';
        loadingText.style.fontFamily = 'Arial, sans-serif';
        
        videoContainer.appendChild(loadingText);
        videoContainer.appendChild(video);
        document.body.appendChild(videoContainer);
        
        // 视频可以播放时隐藏加载提示
        video.addEventListener('canplay', function() {
            loadingText.style.display = 'none';
            console.log('视频可以播放');
        });
        
        // 视频播放完成后的处理
        video.addEventListener('ended', function() {
            console.log('组合句.mp4 播放完成，返回最后一面');
            
            // 移除视频容器，返回最后一面
            videoContainer.remove();
            
            // 重新开始图片生成
            startRandomImageGeneration();
        });
        
        // 视频加载失败的处理
        video.addEventListener('error', function(e) {
            console.error('视频播放失败:', e);
            loadingText.textContent = '视频加载失败，3秒后关闭...';
            
            // 如果视频播放失败，3秒后关闭
            setTimeout(() => {
                videoContainer.remove();
            }, 3000);
        });
        
        // 确保视频开始播放
        video.play().catch(error => {
            console.error('视频播放启动失败:', error);
            loadingText.textContent = '视频播放失败，3秒后关闭...';
            
            // 如果播放启动失败，3秒后关闭
            setTimeout(() => {
                videoContainer.remove();
            }, 3000);
        });
    }

    // 下载U.png文件
    function downloadUPng() {
        console.log('开始下载U.png文件');
        
        const uPngPath = 'U.png';
        
        // 使用fetch API下载U.png
        fetch(uPngPath)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.blob();
            })
            .then(blob => {
                // 创建下载链接
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'U.png';
                a.style.display = 'none';
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
                console.log('U.png 下载成功');
            })
            .catch(error => {
                console.log('U.png 下载失败，尝试创建示例文件:', error);
                // 如果U.png不存在，创建一个示例U.png文件
                createSampleUPng();
            });
    }





    // 创建示例U.png文件
    function createSampleUPng() {
        // 创建一个简单的canvas作为示例U.png
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        // 设置canvas尺寸
        canvas.width = 100;
        canvas.height = 100;
        
        // 绘制一个简单的U字符
        ctx.fillStyle = '#4CAF50';
        ctx.fillRect(0, 0, 100, 100);
        
        ctx.fillStyle = 'white';
        ctx.font = 'bold 60px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('U', 50, 50);
        
        // 将canvas转换为blob并下载
        canvas.toBlob(function(blob) {
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'U.png';
            a.style.display = 'none';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            console.log('示例 U.png 创建并下载成功');
        }, 'image/png');
    }





    // 游戏初始化
    startGame();
});