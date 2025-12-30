// ==================== MEDIVERSE - SMART HEALTH VAULT ====================
// Hackathon MVP - All data stored in LocalStorage
// Firebase placeholders for Auth, Firestore, Storage

// ==================== GLOBAL VARIABLES ====================
let currentUser = null;
let vitalChart = null;

// ==================== FIREBASE PLACEHOLDERS ====================
// TODO: Initialize Firebase
// const firebaseConfig = { ... };
// firebase.initializeApp(firebaseConfig);
// const auth = firebase.auth();
// const db = firebase.firestore();
// const storage = firebase.storage();

// ==================== DOM ELEMENTS ====================
document.addEventListener('DOMContentLoaded', function() {
    
    // Get all DOM elements
    const loginSection = document.getElementById('loginSection');
    const dashboard = document.getElementById('dashboard');
    const googleSignInBtn = document.getElementById('googleSignInBtn');
    const logoutBtn = document.getElementById('logoutBtn');
    const healthForm = document.getElementById('healthForm');
    const reportUpload = document.getElementById('reportUpload');
    const uploadedFiles = document.getElementById('uploadedFiles');
    const generateQRBtn = document.getElementById('generateQRBtn');
    const viewEmergencyBtn = document.getElementById('viewEmergencyBtn');
    const emergencyPage = document.getElementById('emergencyPage');
    const closeEmergencyBtn = document.getElementById('closeEmergencyBtn');
    const askAIBtn = document.getElementById('askAIBtn');
    const aiQuery = document.getElementById('aiQuery');
    const aiResponse = document.getElementById('aiResponse');
    const addVitalBtn = document.getElementById('addVitalBtn');
    const addReminderBtn = document.getElementById('addReminderBtn');
    const reminderList = document.getElementById('reminderList');

    // ==================== AUTHENTICATION ====================
    // Simulate Google Sign-In (Firebase Auth placeholder)
    googleSignInBtn.addEventListener('click', function() {
        // TODO: Replace with actual Firebase Auth
        // firebase.auth().signInWithPopup(new firebase.auth.GoogleAuthProvider())
        
        // Simulate login
        currentUser = {
            uid: 'user_' + Date.now(),
            email: 'user@example.com',
            displayName: 'Demo User'
        };
        
        // Save to localStorage
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        
        // Show dashboard
        loginSection.style.display = 'none';
        dashboard.style.display = 'block';
        logoutBtn.style.display = 'block';
        
        // Load existing data
        loadHealthData();
        loadUploadedFiles();
        loadReminders();
        loadVitalData();
        
        alert('✅ Signed in successfully! (Simulated)');
    });

    // Logout
    logoutBtn.addEventListener('click', function() {
        // TODO: Replace with actual Firebase Auth
        // firebase.auth().signOut()
        
        currentUser = null;
        localStorage.removeItem('currentUser');
        
        loginSection.style.display = 'flex';
        dashboard.style.display = 'none';
        logoutBtn.style.display = 'none';
        
        alert('✅ Logged out successfully!');
    });

    // Check if user is already logged in
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
        currentUser = JSON.parse(savedUser);
        loginSection.style.display = 'none';
        dashboard.style.display = 'block';
        logoutBtn.style.display = 'block';
        loadHealthData();
        loadUploadedFiles();
        loadReminders();
        loadVitalData();
    }

    // ==================== HEALTH DATA FORM ====================
    healthForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Collect form data
        const healthData = {
            fullName: document.getElementById('fullName').value.trim(),
            age: document.getElementById('age').value,
            bloodGroup: document.getElementById('bloodGroup').value,
            allergies: document.getElementById('allergies').value.trim() || 'None',
            chronicDiseases: document.getElementById('chronicDiseases').value.trim() || 'None',
            bloodPressure: document.getElementById('bloodPressure').value.trim() || 'Not recorded',
            bloodSugar: document.getElementById('bloodSugar').value || 'Not recorded',
            weight: document.getElementById('weight').value || 'Not recorded',
            emergencyContact1: document.getElementById('emergencyContact1').value.trim(),
            emergencyContact2: document.getElementById('emergencyContact2').value.trim() || 'None',
            lastUpdated: new Date().toLocaleDateString()
        };

        // TODO: Save to Firebase Firestore
        // db.collection('users').doc(currentUser.uid).set(healthData)
        
        // Save to LocalStorage
        localStorage.setItem('healthData', JSON.stringify(healthData));
        
        alert('✅ Health profile saved successfully!');
    });

    // Load health data from LocalStorage
    function loadHealthData() {
        const savedData = localStorage.getItem('healthData');
        if (savedData) {
            const data = JSON.parse(savedData);
            document.getElementById('fullName').value = data.fullName;
            document.getElementById('age').value = data.age;
            document.getElementById('bloodGroup').value = data.bloodGroup;
            document.getElementById('allergies').value = data.allergies === 'None' ? '' : data.allergies;
            document.getElementById('chronicDiseases').value = data.chronicDiseases === 'None' ? '' : data.chronicDiseases;
            document.getElementById('bloodPressure').value = data.bloodPressure === 'Not recorded' ? '' : data.bloodPressure;
            document.getElementById('bloodSugar').value = data.bloodSugar === 'Not recorded' ? '' : data.bloodSugar;
            document.getElementById('weight').value = data.weight === 'Not recorded' ? '' : data.weight;
            document.getElementById('emergencyContact1').value = data.emergencyContact1;
            document.getElementById('emergencyContact2').value = data.emergencyContact2 === 'None' ? '' : data.emergencyContact2;
        }
    }

    // ==================== FILE UPLOAD ====================
    reportUpload.addEventListener('change', function(e) {
        const files = Array.from(e.target.files);
        
        if (files.length === 0) return;
        
        // TODO: Upload to Firebase Storage
        // files.forEach(file => {
        //     const storageRef = storage.ref(`reports/${currentUser.uid}/${file.name}`);
        //     storageRef.put(file);
        // });
        
        // Store file names in LocalStorage
        let uploadedFilesList = JSON.parse(localStorage.getItem('uploadedFiles') || '[]');
        
        files.forEach(file => {
            uploadedFilesList.push({
                name: file.name,
                size: (file.size / 1024).toFixed(2) + ' KB',
                uploadDate: new Date().toLocaleDateString()
            });
        });
        
        localStorage.setItem('uploadedFiles', JSON.stringify(uploadedFilesList));
        loadUploadedFiles();
        
        alert(`✅ ${files.length} file(s) uploaded successfully! (Stored locally)`);
    });

    // Display uploaded files
    function loadUploadedFiles() {
        const filesList = JSON.parse(localStorage.getItem('uploadedFiles') || '[]');
        
        if (filesList.length === 0) {
            uploadedFiles.innerHTML = '<p style="text-align: center; color: #888;">No files uploaded yet</p>';
            return;
        }
        
        uploadedFiles.innerHTML = '<h3 style="margin-bottom: 15px;">Uploaded Files:</h3>';
        filesList.forEach((file, index) => {
            uploadedFiles.innerHTML += `
                <div class="file-item">
                    <div>
                        <strong>${file.name}</strong><br>
                        <small>${file.size} - ${file.uploadDate}</small>
                    </div>
                    <button onclick="deleteFile(${index})" style="background: #dc3545; color: white; border: none; padding: 5px 15px; border-radius: 5px; cursor: pointer;">Delete</button>
                </div>
            `;
        });
    }

    // Delete file function (global scope)
    window.deleteFile = function(index) {
        let filesList = JSON.parse(localStorage.getItem('uploadedFiles') || '[]');
        filesList.splice(index, 1);
        localStorage.setItem('uploadedFiles', JSON.stringify(filesList));
        loadUploadedFiles();
    };

    // ==================== QR CODE GENERATION ====================
    generateQRBtn.addEventListener('click', function() {
        const healthData = localStorage.getItem('healthData');
        
        if (!healthData) {
            alert('⚠️ Please save your health profile first!');
            return;
        }
        
        // Clear previous QR code
        document.getElementById('qrcode').innerHTML = '';
        
        // Generate emergency page URL with data
        // In production, this would be a real URL: https://mediverse.com/emergency?id=userId
        const emergencyURL = 'Emergency Data: ' + healthData;
        
        // Generate QR code
        new QRCode(document.getElementById('qrcode'), {
            text: emergencyURL,
            width: 200,
            height: 200,
            colorDark: '#000000',
            colorLight: '#ffffff',
        });
        
        alert('✅ QR Code generated! Scan to access emergency data.');
    });

    // ==================== EMERGENCY PAGE ====================
    viewEmergencyBtn.addEventListener('click', function() {
        const healthData = localStorage.getItem('healthData');
        
        if (!healthData) {
            alert('⚠️ Please save your health profile first!');
            return;
        }
        
        const data = JSON.parse(healthData);
        
        // Populate emergency data
        document.getElementById('emergencyData').innerHTML = `
            <div class="emergency-item">
                <span class="emergency-label">👤 Name:</span>
                <span class="emergency-value">${data.fullName}</span>
            </div>
            <div class="emergency-item">
                <span class="emergency-label">🩸 Blood Group:</span>
                <span class="emergency-value">${data.bloodGroup}</span>
            </div>
            <div class="emergency-item">
                <span class="emergency-label">⚠️ Allergies:</span>
                <span class="emergency-value">${data.allergies}</span>
            </div>
            <div class="emergency-item">
                <span class="emergency-label">🏥 Chronic Diseases:</span>
                <span class="emergency-value">${data.chronicDiseases}</span>
            </div>
            <div class="emergency-item">
                <span class="emergency-label">💊 Blood Pressure:</span>
                <span class="emergency-value">${data.bloodPressure}</span>
            </div>
            <div class="emergency-item">
                <span class="emergency-label">📞 Emergency Contact 1:</span>
                <span class="emergency-value">${data.emergencyContact1}</span>
            </div>
            <div class="emergency-item">
                <span class="emergency-label">📞 Emergency Contact 2:</span>
                <span class="emergency-value">${data.emergencyContact2}</span>
            </div>
        `;
        
        emergencyPage.style.display = 'block';
    });

    closeEmergencyBtn.addEventListener('click', function() {
        emergencyPage.style.display = 'none';
    });

    // ==================== AI HEALTH ADVISOR ====================
    askAIBtn.addEventListener('click', function() {
        const query = aiQuery.value.trim();
        
        if (!query) {
            alert('⚠️ Please enter a health question!');
            return;
        }
        
        const healthData = JSON.parse(localStorage.getItem('healthData') || '{}');
        
        // Rule-based AI advisor (reads user input)
        let advice = generateAIAdvice(query, healthData);
        
        aiResponse.innerHTML = `
            <h3>🤖 AI Health Advisor Response:</h3>
            <p>${advice}</p>
            <p style="margin-top: 15px; font-size: 0.9rem; color: #888;"><em>Note: This is a rule-based advisor. Consult a real doctor for medical advice.</em></p>
        `;
    });

    // AI Advice Generator (Rule-based)
    function generateAIAdvice(query, healthData) {
        query = query.toLowerCase();
        
        // Check for blood pressure concerns
        if (query.includes('blood pressure') || query.includes('bp')) {
            const bp = healthData.bloodPressure || 'Not recorded';
            if (bp !== 'Not recorded') {
                const systolic = parseInt(bp.split('/')[0]);
                if (systolic > 140) {
                    return `Your blood pressure is ${bp} mmHg, which is high. Recommendations: 1) Reduce salt intake, 2) Exercise regularly, 3) Manage stress, 4) Consult a doctor for medication if needed.`;
                } else if (systolic < 90) {
                    return `Your blood pressure is ${bp} mmHg, which is low. Recommendations: 1) Stay hydrated, 2) Eat small, frequent meals, 3) Avoid sudden position changes, 4) Consult a doctor if symptoms persist.`;
                } else {
                    return `Your blood pressure is ${bp} mmHg, which is normal. Keep maintaining a healthy lifestyle!`;
                }
            }
            return 'Please enter your blood pressure in the health profile to get personalized advice.';
        }
        
        // Check for blood sugar concerns
        if (query.includes('sugar') || query.includes('diabetes') || query.includes('glucose')) {
            const sugar = healthData.bloodSugar || 'Not recorded';
            if (sugar !== 'Not recorded' && sugar !== '') {
                const sugarLevel = parseInt(sugar);
                if (sugarLevel > 140) {
                    return `Your blood sugar is ${sugar} mg/dL, which is high. Recommendations: 1) Reduce sugar and carb intake, 2) Exercise daily, 3) Monitor levels regularly, 4) Consult a doctor for diabetes management.`;
                } else if (sugarLevel < 70) {
                    return `Your blood sugar is ${sugar} mg/dL, which is low. Recommendations: 1) Eat something with sugar immediately, 2) Carry glucose tablets, 3) Eat regular meals, 4) Consult a doctor.`;
                } else {
                    return `Your blood sugar is ${sugar} mg/dL, which is normal. Continue monitoring and maintain a balanced diet!`;
                }
            }
            return 'Please enter your blood sugar level in the health profile to get personalized advice.';
        }
        
        // Check for weight concerns
        if (query.includes('weight') || query.includes('obesity')) {
            const weight = healthData.weight || 'Not recorded';
            if (weight !== 'Not recorded' && weight !== '') {
                return `Your current weight is ${weight} kg. General recommendations: 1) Maintain a balanced diet, 2) Exercise 30 minutes daily, 3) Stay hydrated, 4) Get adequate sleep, 5) Consult a nutritionist for personalized plans.`;
            }
            return 'Please enter your weight in the health profile to get personalized advice.';
        }
        
        // Check for allergies
        if (query.includes('allergy') || query.includes('allergies')) {
            const allergies = healthData.allergies || 'None';
            if (allergies !== 'None') {
                return `You have reported allergies to: ${allergies}. Recommendations: 1) Always inform healthcare providers, 2) Carry emergency medication if prescribed, 3) Read food labels carefully, 4) Wear a medical alert bracelet.`;
            }
            return 'You have no reported allergies. If you develop any, please update your health profile.';
        }
        
        // Check for chronic diseases
        if (query.includes('disease') || query.includes('chronic') || query.includes('condition')) {
            const diseases = healthData.chronicDiseases || 'None';
            if (diseases !== 'None') {
                return `You have reported chronic conditions: ${diseases}. General recommendations: 1) Take medications as prescribed, 2) Regular check-ups with your doctor, 3) Maintain a healthy lifestyle, 4) Monitor symptoms closely, 5) Keep emergency contacts updated.`;
            }
            return 'You have no reported chronic diseases. Continue maintaining a healthy lifestyle!';
        }
        
        // Default response
        return `Thank you for your question: "${query}". For personalized health advice, please: 1) Update your complete health profile, 2) Consult with a healthcare professional, 3) Use this app to track your vitals regularly. Remember, this is a basic advisor and not a replacement for professional medical advice.`;
    }

    // ==================== VITAL TRACKER ====================
    addVitalBtn.addEventListener('click', function() {
        const bp = document.getElementById('newBP').value;
        const sugar = document.getElementById('newSugar').value;
        const weight = document.getElementById('newWeight').value;
        
        if (!bp && !sugar && !weight) {
            alert('⚠️ Please enter at least one vital reading!');
            return;
        }
        
        // Get existing vital data
        let vitalData = JSON.parse(localStorage.getItem('vitalData') || '{"dates": [], "bp": [], "sugar": [], "weight": []}');
        
        // Add new reading
        const today = new Date().toLocaleDateString();
        vitalData.dates.push(today);
        vitalData.bp.push(bp ? parseInt(bp) : null);
        vitalData.sugar.push(sugar ? parseInt(sugar) : null);
        vitalData.weight.push(weight ? parseInt(weight) : null);
        
        // Save to LocalStorage
        localStorage.setItem('vitalData', JSON.stringify(vitalData));
        
        // Clear inputs
        document.getElementById('newBP').value = '';
        document.getElementById('newSugar').value = '';
        document.getElementById('newWeight').value = '';
        
        // Update chart
        updateVitalChart();
        
        alert('✅ Vital reading added successfully!');
    });

    // Load and display vital data
    function loadVitalData() {
        updateVitalChart();
    }

    // Update vital chart
    function updateVitalChart() {
        const vitalData = JSON.parse(localStorage.getItem('vitalData') || '{"dates": [], "bp": [], "sugar": [], "weight": []}');
        
        const ctx = document.getElementById('vitalChart').getContext('2d');
        
        // Destroy existing chart if it exists
        if (vitalChart) {
            vitalChart.destroy();
        }
        
        // Create new chart
        vitalChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: vitalData.dates,
                datasets: [
                    {
                        label: 'Blood Pressure (Systolic)',
                        data: vitalData.bp,
                        borderColor: '#dc3545',
                        backgroundColor: 'rgba(220, 53, 69, 0.1)',
                        tension: 0.4
                    },
                    {
                        label: 'Blood Sugar (mg/dL)',
                        data: vitalData.sugar,
                        borderColor: '#ffc107',
                        backgroundColor: 'rgba(255, 193, 7, 0.1)',
                        tension: 0.4
                    },
                    {
                        label: 'Weight (kg)',
                        data: vitalData.weight,
                        borderColor: '#28a745',
                        backgroundColor: 'rgba(40, 167, 69, 0.1)',
                        tension: 0.4
                    }
                ]
            },
            options: {
                responsive: true,
                plugins: {
                    title: {
                        display: true,
                        text: 'Your Vital Trends'
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    }

    // ==================== MEDICINE REMINDERS ====================
    addReminderBtn.addEventListener('click', function() {
        const medicineName = document.getElementById('medicineName').value.trim();
        const medicineTime = document.getElementById('medicineTime').value;
        
        if (!medicineName || !medicineTime) {
            alert('⚠️ Please enter medicine name and time!');
            return;
        }
        
        // Get existing reminders
        let reminders = JSON.parse(localStorage.getItem('reminders') || '[]');
        
        // Add new reminder
        reminders.push({
            id: Date.now(),
            name: medicineName,
            time: medicineTime
        });
        
        // Save to LocalStorage
        localStorage.setItem('reminders', JSON.stringify(reminders));
        
        // Clear inputs
        document.getElementById('medicineName').value = '';
        document.getElementById('medicineTime').value = '';
        
        // Update display
        loadReminders();
        
        alert('✅ Medicine reminder added!');
    });

    // Load and display reminders
    function loadReminders() {
        const reminders = JSON.parse(localStorage.getItem('reminders') || '[]');
        
        if (reminders.length === 0) {
            reminderList.innerHTML = '<p style="text-align: center; color: #888;">No reminders set yet</p>';
            return;
        }
        
        reminderList.innerHTML = '';
        reminders.forEach(reminder => {
            reminderList.innerHTML += `
                <div class="reminder-item">
                    <div>
                        <strong>💊 ${reminder.name}</strong><br>
                        <small>⏰ ${reminder.time}</small>
                    </div>
                    <button onclick="deleteReminder(${reminder.id})">Delete</button>
                </div>
            `;
        });
    }

    // Delete reminder function (global scope)
    window.deleteReminder = function(id) {
        let reminders = JSON.parse(localStorage.getItem('reminders') || '[]');
        reminders = reminders.filter(r => r.id !== id);
        localStorage.setItem('reminders', JSON.stringify(reminders));
        loadReminders();
    };

});

// ==================== END OF SCRIPT ====================