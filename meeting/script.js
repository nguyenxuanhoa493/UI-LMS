let currentSlide = 0;
let appData = null;
let slideInterval = null;
let sessionStatus = "upcoming"; // upcoming, ongoing, ended
let sessionDuration = 90; // 90 phút (1.5 giờ)
let timeRemaining = 15; // phút còn lại để bắt đầu
let timeElapsed = 0; // phút đã diễn ra

// Load data from JSON
async function loadData() {
    showLoadingState();
    try {
        const response = await fetch("./data.json");
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        appData = await response.json();
        hideLoadingState();
        initializeApp();
    } catch (error) {
        console.error("Error loading data:", error);
        hideLoadingState();
        showErrorState();
        // Fallback to hardcoded data if JSON fails
        setTimeout(() => {
            initializeWithFallbackData();
            hideErrorState();
        }, 2000);
    }
}

function showLoadingState() {
    const loadingDiv = document.createElement("div");
    loadingDiv.id = "loadingState";
    loadingDiv.className =
        "fixed inset-0 bg-white/90 backdrop-blur-sm z-50 flex items-center justify-center";
    loadingDiv.innerHTML = `
        <div class="text-center">
            <div class="animate-spin rounded-full h-12 w-12 border-4 border-orange-500 border-t-transparent mx-auto mb-4"></div>
            <p class="text-gray-600 font-medium">Đang tải dữ liệu khóa học...</p>
        </div>
    `;
    document.body.appendChild(loadingDiv);
}

function hideLoadingState() {
    const loading = document.getElementById("loadingState");
    if (loading) loading.remove();
}

function showErrorState() {
    const errorDiv = document.createElement("div");
    errorDiv.id = "errorState";
    errorDiv.className =
        "fixed inset-0 bg-red-50/90 backdrop-blur-sm z-50 flex items-center justify-center";
    errorDiv.innerHTML = `
        <div class="text-center max-w-md">
            <i class="fas fa-exclamation-triangle text-red-500 text-4xl mb-4"></i>
            <h3 class="text-xl font-semibold text-red-700 mb-2">Lỗi tải dữ liệu</h3>
            <p class="text-red-600 mb-4">Không thể tải dữ liệu từ server. Đang chuyển sang chế độ offline...</p>
            <div class="animate-pulse text-red-500">
                <i class="fas fa-sync-alt animate-spin mr-2"></i>
                Đang thử lại...
            </div>
        </div>
    `;
    document.body.appendChild(errorDiv);
}

function hideErrorState() {
    const error = document.getElementById("errorState");
    if (error) error.remove();
}

// Minimal data factory function
function createMinimalData() {
    return {
        course: {
            title: "Phật Pháp Căn Bản",
            lesson: "Bài 8: Tứ Diệu Đế và Con Đường Giải Thoát",
            time: "19:30 - 21:00, Thứ 5, 15/03/2024",
            format: "Học trực tuyến qua LMS Platform",
            content:
                "Tìm hiểu về Khổ đế, Tập đế, Diệt đế, Đạo đế và ý nghĩa trong cuộc sống thường ngày",
            students: { current: 18, total: 25 },
            timeLeft: 15,
            status: "Sắp diễn ra",
        },
        teachers: [
            {
                name: "Thầy Thích Nhất Tư",
                title: "Thầy Giảng Phật Pháp",
                specialty: "Chuyên về Thiền học & Kinh điển Phật giáo",
                experience: "15+ năm tu học",
                education: "Thạc sĩ Phật học",
                certification: "Chứng chỉ Thiền sư",
                students: "300+ học viên",
                rating: 4.9,
                reviews: 89,
                image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=800&fit=crop&crop=face&auto=format",
            },
            {
                name: "Thầy Thích Minh An",
                title: "Thầy Giảng Kinh Điển",
                specialty: "Chuyên về Kinh Pháp Cú & Tâm lý học Phật giáo",
                experience: "12+ năm tu học",
                education: "Tiến sĩ Phật học",
                certification: "Giảng sư Phật pháp",
                students: "250+ học viên",
                rating: 4.8,
                reviews: 67,
                image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=800&h=800&fit=crop&crop=face&auto=format",
            },
            {
                name: "Thầy Thích Trí Quảng",
                title: "Thầy Giảng Triết học",
                specialty: "Chuyên về Triết học Phật giáo & Văn hóa Á Đông",
                experience: "18+ năm tu học",
                education: "Giáo sư Phật học",
                certification: "Hòa thượng",
                students: "400+ học viên",
                rating: 4.9,
                reviews: 124,
                image: "https://images.unsplash.com/photo-1566492031773-4f4e44671d66?w=800&h=800&fit=crop&crop=face&auto=format",
            },
            {
                name: "Thầy Thích Bảo Lạc",
                title: "Thầy Giảng Thiền học",
                specialty: "Chuyên về Thiền Vipassana & Mindfulness",
                experience: "10+ năm tu học",
                education: "Thạc sĩ Tâm lý học",
                certification: "Thiền sư",
                students: "180+ học viên",
                rating: 4.7,
                reviews: 45,
                image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=800&h=800&fit=crop&crop=face&auto=format",
            },
        ],
        documents: [
            {
                id: 1,
                title: "Kinh Tứ Diệu Đế",
                type: "Kinh điển",
                description:
                    "Giải thích chi tiết về Tứ Diệu Đế - nền tảng của Phật giáo",
                pages: 45,
                downloadUrl: "#",
                thumbnail:
                    "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=200&h=300&fit=crop",
            },
            {
                id: 2,
                title: "Bát Chính Đạo",
                type: "Hướng dẫn tu tập",
                description: "Con đường tám nhánh dẫn đến giải thoát khổ đau",
                pages: 32,
                downloadUrl: "#",
                thumbnail:
                    "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=200&h=300&fit=crop",
            },
        ],
        studyTips: [
            "Chuẩn bị tâm hồn thanh tịnh và tập trung",
            "Ghi chú những điều thắc mắc muốn hỏi thầy",
        ],
    };
}

function initializeWithFallbackData() {
    console.log("🔄 Using fallback data - offline mode");
    appData = createMinimalData();

    // Show notification that we're in offline mode
    showOfflineNotification();

    initializeApp();
}

function showOfflineNotification() {
    const notification = document.createElement("div");
    notification.className =
        "fixed top-4 left-4 bg-yellow-500 text-white px-4 py-2 rounded-lg shadow-lg z-50 flex items-center";
    notification.innerHTML = `
        <i class="fas fa-wifi-slash mr-2"></i>
        <span class="text-sm">Chế độ offline - Dữ liệu hạn chế</span>
    `;
    document.body.appendChild(notification);

    // Auto remove after 5 seconds
    setTimeout(() => {
        notification.style.transform = "translateX(-100%)";
        setTimeout(() => notification.remove(), 300);
    }, 5000);
}

function initializeApp() {
    // Update course info from JSON
    updateCourseInfo();
    // Generate teacher slides from JSON
    generateTeacherSlides();
    // Render teacher avatars from JSON
    renderTeacherAvatars();
    // Initialize teacher slider
    showSlide(0);
    // Start auto slide every 5 seconds
    startAutoSlide();
    // Add event listener for join button
    setupJoinButtonListener();
    // Initialize status
    timeRemaining = 15; // Bắt đầu sau 15 phút
    updateJoinButtonContent();
    updateBottomStatus();
}

function setupJoinButtonListener() {
    // Sử dụng event delegation để handle cả nút desktop và mobile
    document.addEventListener("click", function (e) {
        if (
            e.target.id === "joinButton" ||
            e.target.closest("#joinButton") ||
            e.target.id === "mobileJoinButton" ||
            e.target.closest("#mobileJoinButton")
        ) {
            e.preventDefault();
            toggleSessionStatus();
        }
    });
}

function startAutoSlide() {
    if (slideInterval) clearInterval(slideInterval);
    slideInterval = setInterval(nextSlide, 5000);
}

function stopAutoSlide() {
    if (slideInterval) clearInterval(slideInterval);
}

function updateCourseInfo() {
    if (!appData?.course) return;

    const course = appData.course;

    // Update course title and lesson
    const courseTitle = document.querySelector(".course-title");
    const courseLesson = document.querySelector(".course-lesson");

    if (courseTitle) courseTitle.textContent = course.title;
    if (courseLesson) courseLesson.textContent = course.lesson;

    // Update session details with null checks
    const sessionTime = document.querySelector(".session-time");
    const sessionFormat = document.querySelector(".session-format");
    const sessionContent = document.querySelector(".session-content");
    const sessionStudents = document.querySelector(".session-students");

    if (sessionTime) sessionTime.textContent = course.time;
    if (sessionFormat) sessionFormat.textContent = course.format;
    if (sessionContent) sessionContent.textContent = course.content;
    if (sessionStudents)
        sessionStudents.textContent = `${course.students.current}/${course.students.total} học viên đã tham gia`;

    // Update main action button based on time left
    updateMainActionButton(course.timeLeft);

    // Update bottom status bar
    const bottomTimeLeft = document.querySelector(".bottom-time-left");
    const bottomStudents = document.querySelector(".bottom-students");

    if (bottomTimeLeft)
        bottomTimeLeft.innerHTML = `<span class="font-bold text-orange-500">${course.timeLeft} phút</span>`;
    if (bottomStudents)
        bottomStudents.textContent = `${course.students.current} học viên đã sẵn sàng`;
}

function updateMainActionButton(timeLeft) {
    const waitingButton = document.getElementById("waitingButton");
    const joinButton = document.getElementById("joinButton");
    const timeLeftElement = waitingButton?.querySelector(".time-left");

    if (sessionStatus === "upcoming" && timeRemaining > 0) {
        // Chưa đến giờ - hiển thị nút đợi với countdown
        if (waitingButton) {
            waitingButton.classList.remove("hidden");
            waitingButton.disabled = true;
        }
        if (joinButton) {
            joinButton.classList.add("hidden");
        }
        if (timeLeftElement) {
            timeLeftElement.innerHTML = `<i class="fas fa-clock mr-2"></i>${timeRemaining} phút`;
        }
    } else {
        // Đã đến giờ hoặc đang diễn ra - hiển thị nút tham gia/kết thúc
        if (waitingButton) {
            waitingButton.classList.add("hidden");
        }
        if (joinButton) {
            joinButton.classList.remove("hidden");
            joinButton.disabled = false;

            // Cập nhật nội dung nút dựa trên trạng thái
            updateJoinButtonContent();
        }
    }
}

function updateJoinButtonContent() {
    const joinButton = document.getElementById("joinButton");
    const mobileJoinButton = document.getElementById("mobileJoinButton");

    const updateButton = (button) => {
        if (!button) return;

        switch (sessionStatus) {
            case "upcoming":
                button.innerHTML = `
                    <div class="text-center">
                        <div>Buổi học bắt đầu sau</div>
                        <div class="time-left text-2xl font-bold animate-pulse flex items-center justify-center">
                            <i class="fas fa-clock mr-2"></i>
                            ${timeRemaining} phút
                        </div>
                    </div>
                `;
                button.className =
                    "w-full bg-gray-400 text-white py-3 px-6 rounded-xl cursor-not-allowed flex items-center justify-center text-lg font-semibold shadow-lg";
                break;
            case "ongoing":
                button.innerHTML = `
                    <div class="text-center">
                        <div>Buổi học đang diễn ra ${timeElapsed} phút</div>
                        <div class="time-left text-2xl font-bold animate-pulse flex items-center justify-center">
                            <i class="fas fa-play-circle mr-2"></i>
                            Tham gia ngay
                        </div>
                    </div>
                `;
                button.className =
                    "w-full bg-green-500 text-white py-3 px-6 rounded-xl hover:bg-green-600 transition-colors flex items-center justify-center text-lg font-semibold shadow-lg btn-hover-scale";
                break;
            case "ended":
                button.innerHTML = `
                    <div class="text-center">
                        <div>Buổi học đã kết thúc</div>
                        <div class="time-left text-2xl font-bold animate-pulse flex items-center justify-center">
                            <i class="fas fa-video mr-2"></i>
                            Xem lại ghi hình
                        </div>
                    </div>
                `;
                button.className =
                    "w-full bg-blue-500 text-white py-3 px-6 rounded-xl hover:bg-blue-600 transition-colors flex items-center justify-center text-lg font-semibold shadow-lg btn-hover-scale";
                button.disabled = false; // Cho phép click để xem ghi hình hoặc reset
                break;
        }
    };

    updateButton(joinButton);
    updateButton(mobileJoinButton);
}

function updateSessionStatusBadge() {
    // Desktop status badge
    const statusBadge = document.getElementById("sessionStatusBadge");
    // Mobile status badge
    const mobileStatusBadge = document.querySelector(".mobile-status-badge");

    const updateBadge = (badge) => {
        if (!badge) return;

        switch (sessionStatus) {
            case "upcoming":
                badge.innerHTML = `
                    <i class="fas fa-bell mr-1"></i>
                    Sắp bắt đầu
                `;
                badge.className =
                    "flex items-center bg-gray-400 text-white px-3 py-1 rounded-full text-sm font-medium";
                break;
            case "ongoing":
                badge.innerHTML = `
                    <i class="fas fa-circle mr-1 animate-pulse"></i>
                    Đang diễn ra
                `;
                badge.className =
                    "flex items-center bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium";
                break;
            case "ended":
                badge.innerHTML = `
                    <i class="fas fa-check mr-1"></i>
                    Đã kết thúc
                `;
                badge.className =
                    "flex items-center bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-medium";
                break;
        }
    };

    updateBadge(statusBadge);

    // Mobile badge có class khác nhau
    if (mobileStatusBadge) {
        switch (sessionStatus) {
            case "upcoming":
                mobileStatusBadge.innerHTML = `
                    <i class="fas fa-bell mr-1"></i>
                    Sắp bắt đầu
                `;
                mobileStatusBadge.className =
                    "mobile-status-badge flex items-center bg-gray-400 text-white px-2 py-1 rounded-full text-xs font-medium";
                break;
            case "ongoing":
                mobileStatusBadge.innerHTML = `
                    <i class="fas fa-circle mr-1 animate-pulse"></i>
                    Đang diễn ra
                `;
                mobileStatusBadge.className =
                    "mobile-status-badge flex items-center bg-green-500 text-white px-2 py-1 rounded-full text-xs font-medium";
                break;
            case "ended":
                mobileStatusBadge.innerHTML = `
                    <i class="fas fa-check mr-1"></i>
                    Đã kết thúc
                `;
                mobileStatusBadge.className =
                    "mobile-status-badge flex items-center bg-blue-500 text-white px-2 py-1 rounded-full text-xs font-medium";
                break;
        }
    }
}

function updateBottomStatus() {
    const bottomTimeLeft = document.querySelector(".bottom-time-left");
    const bottomStatusText = bottomTimeLeft?.parentNode;

    if (bottomTimeLeft && bottomStatusText) {
        switch (sessionStatus) {
            case "upcoming":
                bottomTimeLeft.innerHTML = `<span class="font-bold text-orange-500">${timeRemaining} phút</span>`;
                // Cập nhật text trước span
                const upcomingTextNode = Array.from(
                    bottomStatusText.childNodes
                ).find(
                    (node) =>
                        node.nodeType === Node.TEXT_NODE &&
                        node.textContent.includes("Buổi học")
                );
                if (upcomingTextNode) {
                    upcomingTextNode.textContent = "Buổi học bắt đầu sau ";
                }
                break;
            case "ongoing":
                bottomTimeLeft.innerHTML = `<span class="font-bold text-green-500">${timeElapsed}/${sessionDuration} phút</span>`;
                // Cập nhật text trước span
                const ongoingTextNode = Array.from(
                    bottomStatusText.childNodes
                ).find(
                    (node) =>
                        (node.nodeType === Node.TEXT_NODE &&
                            node.textContent.includes("Buổi học")) ||
                        node.textContent.includes("Đã diễn ra")
                );
                if (ongoingTextNode) {
                    ongoingTextNode.textContent = "Đã diễn ra ";
                }
                break;
            case "ended":
                bottomTimeLeft.innerHTML = `<span class="font-bold text-gray-500">Hoàn thành</span>`;
                // Cập nhật text trước span
                const endedTextNode = Array.from(
                    bottomStatusText.childNodes
                ).find(
                    (node) =>
                        node.nodeType === Node.TEXT_NODE &&
                        (node.textContent.includes("Buổi học") ||
                            node.textContent.includes("Đã diễn ra"))
                );
                if (endedTextNode) {
                    endedTextNode.textContent = "Buổi học ";
                }
                break;
        }
    }
}

function generateTeacherSlides() {
    if (!appData?.teachers || appData.teachers.length === 0) return;

    const leftHalf = document.querySelector(".teachers-container");
    const dotsContainer = document.querySelector(".dots-container");

    if (!leftHalf || !dotsContainer) return;

    // Clear existing content
    leftHalf.innerHTML = "";
    dotsContainer.innerHTML = "";

    // Generate slides
    appData.teachers.forEach((teacher, index) => {
        // Create slide
        const slide = document.createElement("div");
        slide.className = `teacher-slide slide-transition${
            index === 0 ? " active" : ""
        }`;
        slide.innerHTML = `
            <div class="absolute inset-0">
                <img
                    src="${teacher.image}"
                    alt="${teacher.name}"
                    class="w-full h-full object-cover"
                    onerror="this.src='https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=800&fit=crop&crop=face&auto=format'"
                />
                
            </div>

            <div class="relative z-10 h-full text-white">
                <div class="absolute top-4 right-4">
                    <div class="bg-orange-500 px-2 py-1 rounded-full flex items-center shadow-lg">
                        <div class="w-1.5 h-1.5 bg-green-400 rounded-full mr-1 animate-pulse"></div>
                        <span class="text-xs font-medium">Trực tuyến</span>
                    </div>
                </div>
            </div>

            <div class="absolute bottom-32 left-1/2 transform -translate-x-1/2 z-20 w-[90%] px-4">
                <div class="bg-gray-900/85 backdrop-blur-md rounded-lg p-4 border border-gray-700/50 w-full mx-auto text-white shadow-2xl">
                    <div class="mb-3">
                        <h2 class="text-2xl font-bold mb-1 text-white drop-shadow-lg">${
                            teacher.name
                        }</h2>
                        <p class="text-base font-semibold text-orange-300 mb-1">${
                            teacher.title
                        }</p>
                        <div class="flex items-center justify-between">
                            <p class="text-sm text-gray-300">${
                                teacher.specialty
                            }</p>
                            <div class="flex items-center">
                                <div class="flex text-yellow-400 mr-2 text-sm">
                                    ${'<i class="fas fa-star"></i>'.repeat(
                                        Math.floor(teacher.rating)
                                    )}
                                    ${
                                        teacher.rating % 1 !== 0
                                            ? '<i class="fas fa-star-half-alt"></i>'
                                            : ""
                                    }
                                </div>
                                <span class="text-sm font-medium text-white">${
                                    teacher.rating
                                }/5</span>
                                <span class="text-gray-300 ml-1 text-sm">(${
                                    teacher.reviews
                                })</span>
                            </div>
                        </div>
                    </div>

                    <div class="grid grid-cols-2 gap-2 text-sm pt-2 border-t border-gray-600/50">
                        <div class="flex items-center">
                            <i class="fas fa-dharmachakra text-orange-400 mr-2 text-sm"></i>
                            <span class="text-gray-200">${
                                teacher.experience
                            }</span>
                        </div>
                        <div class="flex items-center">
                            <i class="fas fa-graduation-cap text-orange-400 mr-2 text-sm"></i>
                            <span class="text-gray-200">${
                                teacher.education
                            }</span>
                        </div>
                        <div class="flex items-center">
                            <i class="fas fa-lotus text-orange-400 mr-2 text-sm"></i>
                            <span class="text-gray-200">${
                                teacher.certification
                            }</span>
                        </div>
                        <div class="flex items-center">
                            <i class="fas fa-users text-orange-400 mr-2 text-sm"></i>
                            <span class="text-gray-200">${
                                teacher.students
                            }</span>
                        </div>
                    </div>
                </div>
            </div>
        `;

        leftHalf.appendChild(slide);

        // Create dot
        const dot = document.createElement("button");
        dot.className = `dot w-3 h-3 rounded-full bg-white/50 hover:bg-white/80 transition-all${
            index === 0 ? " active" : ""
        }`;
        dot.onclick = () => goToSlide(index);
        dotsContainer.appendChild(dot);
    });

    // Add navigation arrows
    const prevArrow = document.createElement("button");
    prevArrow.className =
        "absolute left-4 top-1/2 transform -translate-y-1/2 z-20 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full p-3 transition-all";
    prevArrow.onclick = prevSlide;
    prevArrow.innerHTML =
        '<i class="fas fa-chevron-left text-white text-xl"></i>';
    leftHalf.appendChild(prevArrow);

    const nextArrow = document.createElement("button");
    nextArrow.className =
        "absolute right-4 top-1/2 transform -translate-y-1/2 z-20 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full p-3 transition-all";
    nextArrow.onclick = nextSlide;
    nextArrow.innerHTML =
        '<i class="fas fa-chevron-right text-white text-xl"></i>';
    leftHalf.appendChild(nextArrow);
}

function showSlide(index) {
    const slides = document.querySelectorAll(".teacher-slide");
    const dots = document.querySelectorAll(".dot");

    slides.forEach((slide) => slide.classList.remove("active"));
    dots.forEach((dot) => dot.classList.remove("active"));

    if (slides[index]) slides[index].classList.add("active");
    if (dots[index]) dots[index].classList.add("active");

    currentSlide = index;
}

function nextSlide() {
    currentSlide = (currentSlide + 1) % (appData?.teachers?.length || 1);
    showSlide(currentSlide);
}

function prevSlide() {
    currentSlide =
        (currentSlide - 1 + (appData?.teachers?.length || 1)) %
        (appData?.teachers?.length || 1);
    showSlide(currentSlide);
}

function goToSlide(index) {
    stopAutoSlide();
    showSlide(index);
    // Restart auto slide after user interaction
    setTimeout(startAutoSlide, 10000);
}

function showDocumentsPopup() {
    const popup = document.getElementById("documentsPopup");
    const documentsGrid = document.getElementById("documentsGrid");

    if (!appData?.documents || appData.documents.length === 0) {
        alert("Chưa có tài liệu nào. Vui lòng thử lại sau.");
        return;
    }

    // Check if mobile or desktop
    const isMobile = window.innerWidth < 1024;

    if (isMobile) {
        // Generate documents HTML for mobile
        documentsGrid.innerHTML = appData.documents
            .map(
                (doc) => `
            <div class="bg-white rounded-lg shadow-sm p-3 hover:shadow-md transition-all duration-300 cursor-pointer border border-gray-200" onclick="downloadDocument('${doc.title}')">
                <div class="flex items-center space-x-3">
                    <img src="${doc.thumbnail}" alt="${doc.title}" class="w-12 h-12 object-cover rounded-lg" 
                         onerror="this.src='https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=48&h=48&fit=crop'">
                    <div class="flex-1 min-w-0">
                        <h4 class="font-medium text-gray-900 text-sm truncate">${doc.title}</h4>
                        <div class="flex items-center justify-between mt-1">
                            <span class="inline-block bg-orange-100 text-orange-800 text-xs px-2 py-0.5 rounded-full">${doc.type}</span>
                            <span class="text-xs text-gray-500">${doc.pages} trang</span>
                        </div>
                    </div>
                    <div class="text-orange-500">
                        <i class="fas fa-download text-sm"></i>
                    </div>
                </div>
                <p class="text-xs text-gray-600 mt-2 line-clamp-2">${doc.description}</p>
            </div>
        `
            )
            .join("");
    } else {
        // Generate documents HTML for desktop
        documentsGrid.innerHTML = appData.documents
            .map(
                (doc) => `
            <div class="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-all duration-300 cursor-pointer transform hover:scale-105" onclick="downloadDocument('${doc.title}')">
                <img src="${doc.thumbnail}" alt="${doc.title}" class="w-full h-32 object-cover rounded-lg mb-3" 
                     onerror="this.src='https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=200&h=300&fit=crop'">
                <h4 class="font-semibold text-gray-900 mb-1 line-clamp-2">${doc.title}</h4>
                <span class="inline-block bg-orange-100 text-orange-800 text-xs px-2 py-1 rounded-full mb-2">${doc.type}</span>
                <p class="text-sm text-gray-600 mb-2 line-clamp-2">${doc.description}</p>
                <div class="flex justify-between items-center text-xs text-gray-500">
                    <span><i class="fas fa-file-pdf mr-1 text-red-500"></i>${doc.pages} trang</span>
                    <span class="text-orange-500 hover:text-orange-600"><i class="fas fa-download"></i></span>
                </div>
            </div>
        `
            )
            .join("");
    }

    popup.classList.remove("hidden");
    document.body.style.overflow = "hidden";
}

function hideDocumentsPopup() {
    const popup = document.getElementById("documentsPopup");
    popup.classList.add("hidden");
    document.body.style.overflow = "";
}

function downloadDocument(title) {
    // Show download notification with better UX
    const notification = document.createElement("div");
    notification.className =
        "fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 transform translate-x-full transition-transform duration-300";
    notification.innerHTML = `
        <div class="flex items-center">
            <i class="fas fa-download mr-2"></i>
            <span>Đang tải xuống: ${title}</span>
        </div>
    `;
    document.body.appendChild(notification);

    // Animate in
    setTimeout(() => {
        notification.classList.remove("translate-x-full");
    }, 100);

    // Animate out and remove
    setTimeout(() => {
        notification.classList.add("translate-x-full");
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Keyboard navigation
document.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft") prevSlide();
    if (e.key === "ArrowRight") nextSlide();
    if (e.key === "Escape") hideDocumentsPopup();
});

function toggleSessionStatus() {
    switch (sessionStatus) {
        case "upcoming":
            sessionStatus = "ongoing";
            timeElapsed = 20; // Đã diễn ra 20 phút
            break;
        case "ongoing":
            sessionStatus = "ended";
            timeElapsed = sessionDuration; // Hoàn thành full session
            break;
        case "ended":
            sessionStatus = "upcoming";
            timeElapsed = 0;
            timeRemaining = 15; // Bắt đầu sau 15 phút
            break;
    }

    // Cập nhật UI
    updateJoinButtonContent();
    updateSessionStatusBadge();
    updateBottomStatus();
}

function renderTeacherAvatars() {
    const avatarsContainer = document.getElementById("teacherAvatarsContainer");
    const teacherCount = document.getElementById("teacherCount");
    const studentCount = document.getElementById("studentCount");

    if (!appData?.teachers || appData.teachers.length === 0) {
        // Fallback nếu không có data
        avatarsContainer.innerHTML = `
            <div class="w-8 h-8 rounded-full border-2 border-white shadow-sm bg-gray-300 flex items-center justify-center">
                <i class="fas fa-user text-gray-500 text-xs"></i>
            </div>
        `;
        if (teacherCount) teacherCount.textContent = "Chưa có thông tin";
        if (studentCount) studentCount.textContent = "Chưa có thông tin";
        return;
    }

    // Render teacher avatars từ JSON
    const maxDisplay = 3; // Hiển thị tối đa 3 avatar
    const teachers = appData.teachers.slice(0, maxDisplay);
    const remainingCount = Math.max(0, appData.teachers.length - maxDisplay);

    avatarsContainer.innerHTML =
        teachers
            .map(
                (teacher) => `
        <img src="${teacher.image}" 
             alt="${teacher.name}" 
             title="${teacher.name} - ${teacher.title}"
             class="w-8 h-8 rounded-full border-2 border-white shadow-sm object-cover"
             onerror="this.src='https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face&auto=format'">
    `
            )
            .join("") +
        (remainingCount > 0
            ? `
        <div class="w-8 h-8 rounded-full border-2 border-white shadow-sm bg-orange-500 flex items-center justify-center">
            <span class="text-white text-xs font-bold">+${remainingCount}</span>
        </div>
    `
            : "");

    // Update teacher count
    if (teacherCount) {
        const totalTeachers = appData.teachers.length;
        teacherCount.textContent = `${totalTeachers} Thầy giảng`;
    }

    // Update student count từ course data
    if (studentCount && appData?.course?.students) {
        studentCount.textContent = `${appData.course.students.current}/${appData.course.students.total} học viên`;
    } else if (studentCount) {
        studentCount.textContent = "25 học viên"; // fallback
    }
}

// Initialize when page loads
document.addEventListener("DOMContentLoaded", loadData);
