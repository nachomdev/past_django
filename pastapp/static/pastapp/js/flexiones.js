// pastapp/static/pastapp/js/flexiones.js

document.addEventListener('DOMContentLoaded', () => {
    // Global fetch interceptor to handle 401 Unauthorized
    const originalFetch = window.fetch;
    window.fetch = async function(...args) {
        const response = await originalFetch(...args);
        if (response.status === 401) {
            window.location.href = '/flexiones/login';
            return new Promise(() => {}); // Halt execution
        }
        return response;
    };

    // State variables
    let chartInstance = null;
    let currentChartTab = 'daily'; // 'daily' (month view) or 'monthly' (year view)
    let pageData = null;

    // DOM Elements
    const circleProgress = document.getElementById('circleProgress');
    const circleNumber = document.getElementById('circleNumber');
    const circleSubtext = document.getElementById('circleSubtext');
    const weeklyGoalVal = document.getElementById('weeklyGoalVal');
    const weeklyBarFill = document.getElementById('weeklyBarFill');
    const monthlyGoalVal = document.getElementById('monthlyGoalVal');
    const monthlyBarFill = document.getElementById('monthlyBarFill');
    const historyList = document.getElementById('historyList');
    
    // Log inputs
    const quickButtons = document.querySelectorAll('.quick-btn');
    const customInput = document.getElementById('customInput');
    const customAddBtn = document.getElementById('customAddBtn');
    
    // Modal elements
    const settingsBtn = document.getElementById('settingsBtn');
    const modalOverlay = document.getElementById('modalOverlay');
    const cancelModalBtn = document.getElementById('cancelModalBtn');
    const goalsForm = document.getElementById('goalsForm');
    const goalDailyInput = document.getElementById('goalDaily');
    const goalWeeklyInput = document.getElementById('goalWeekly');
    const goalMonthlyInput = document.getElementById('goalMonthly');

    // Chart tabs
    const tabDaily = document.getElementById('tabDaily');
    const tabMonthly = document.getElementById('tabMonthly');

    // Circle dimensions
    const CIRCUMFERENCE = 2 * Math.PI * 90; // r = 90
    circleProgress.style.strokeDasharray = CIRCUMFERENCE;
    circleProgress.style.strokeDashoffset = CIRCUMFERENCE;

    // Get current local date in YYYY-MM-DD
    function getLocalDateString() {
        const d = new Date();
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

    const localDateStr = getLocalDateString();

    // Fetch dashboard data
    async function fetchDashboardData() {
        try {
            const response = await fetch(`/flexiones/api/data?date=${localDateStr}`);
            if (!response.ok) throw new Error('Error al obtener datos');
            
            pageData = await response.json();
            updateUI();
        } catch (error) {
            console.error('API Error:', error);
            alert('No se pudieron cargar los datos. Reintente por favor.');
        }
    }

    // Update UI elements from pageData
    function updateUI() {
        if (!pageData) return;

        const { today_total, weekly_total, monthly_total, goals, recent_sets } = pageData;
        
        // 1. Circle progress updates
        circleNumber.textContent = today_total;
        
        const dailyGoal = goals.daily || 100;
        const dailyPercent = Math.min(100, Math.round((today_total / dailyGoal) * 100));
        circleSubtext.textContent = `${dailyPercent}% de ${dailyGoal}`;
        
        // Circular ring animation
        const offset = CIRCUMFERENCE - (Math.min(1, today_total / dailyGoal) * CIRCUMFERENCE);
        circleProgress.style.strokeDashoffset = offset;

        // Set colors based on daily goal completion
        if (today_total >= dailyGoal) {
            circleProgress.style.stroke = 'var(--color-success)';
            circleProgress.style.filter = 'drop-shadow(0 0 10px rgba(16, 185, 129, 0.6))';
            circleSubtext.style.background = 'rgba(16, 185, 129, 0.15)';
            circleSubtext.style.color = '#ffffff';
        } else {
            circleProgress.style.stroke = 'url(#progressGradient)';
            circleProgress.style.filter = 'drop-shadow(0 0 8px rgba(99, 102, 241, 0.4))';
            circleSubtext.style.background = 'rgba(16, 185, 129, 0.1)';
            circleSubtext.style.color = 'var(--color-success)';
        }

        // 2. Weekly goal updates
        const weeklyGoal = goals.weekly || 500;
        const weeklyPercent = Math.min(100, Math.round((weekly_total / weeklyGoal) * 100));
        weeklyGoalVal.textContent = `${weekly_total} / ${weeklyGoal}`;
        weeklyBarFill.style.width = `${weeklyPercent}%`;

        // 3. Monthly goal updates
        const monthlyGoal = goals.monthly || 2000;
        const monthlyPercent = Math.min(100, Math.round((monthly_total / monthlyGoal) * 100));
        monthlyGoalVal.textContent = `${monthly_total} / ${monthlyGoal}`;
        monthlyBarFill.style.width = `${monthlyPercent}%`;

        // 4. Form inputs placeholder default value
        goalDailyInput.value = dailyGoal;
        goalWeeklyInput.value = weeklyGoal;
        goalMonthlyInput.value = monthlyGoal;

        // 5. Recent logs rendering
        historyList.innerHTML = '';
        if (recent_sets.length === 0) {
            historyList.innerHTML = '<div class="empty-history">No has registrado flexiones hoy.</div>';
        } else {
            recent_sets.forEach(set => {
                const item = document.createElement('div');
                item.className = 'history-item';
                item.innerHTML = `
                    <div class="history-info">
                        <span class="history-amount">+${set.amount}</span>
                        <span class="history-time">a las ${set.time}</span>
                    </div>
                    <button class="delete-btn" data-id="${set.id}">
                        <svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                        </svg>
                    </button>
                `;
                
                // Attach delete click
                const delBtn = item.querySelector('.delete-btn');
                delBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    if (delBtn.classList.contains('confirm-mode')) {
                        deleteLogEntry(set.id);
                    } else {
                        // Reset all other delete buttons
                        document.querySelectorAll('.delete-btn').forEach(btn => {
                            btn.classList.remove('confirm-mode');
                            btn.innerHTML = `
                                <svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                                </svg>
                            `;
                        });
                        
                        // Set this button to confirm mode
                        delBtn.classList.add('confirm-mode');
                        delBtn.innerHTML = `
                            <span style="font-size: 0.85rem; font-weight: 700; color: var(--color-danger); margin-right: 4px;">¿Borrar?</span>
                            <svg width="18" height="18" fill="none" stroke="var(--color-danger)" stroke-width="2.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"></path>
                            </svg>
                        `;
                    }
                });
                historyList.appendChild(item);
            });
        }

        // 6. Chart refresh
        renderChart();
    }

    // Add pushup count
    async function addPushUps(amount) {
        if (!amount || amount <= 0) return;
        try {
            const response = await fetch('/flexiones/api/add', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ amount, date: localDateStr })
            });

            if (!response.ok) {
                const errData = await response.json();
                throw new Error(errData.error || 'Error al agregar');
            }

            // Play a success sound or haptic if supported (optional)
            if (navigator.vibrate) navigator.vibrate(20);

            customInput.value = '';
            fetchDashboardData();
        } catch (error) {
            console.error('Error adding:', error);
            alert(error.message);
        }
    }

    // Delete a set
    async function deleteLogEntry(logId) {
        try {
            const response = await fetch(`/flexiones/api/delete/${logId}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' }
            });
            if (!response.ok) throw new Error('Error al eliminar');
            fetchDashboardData();
        } catch (error) {
            console.error('Error deleting:', error);
            alert('No se pudo borrar el registro.');
        }
    }

    // Reset delete confirmation when clicking anywhere else
    window.addEventListener('click', () => {
        document.querySelectorAll('.delete-btn').forEach(btn => {
            if (btn.classList.contains('confirm-mode')) {
                btn.classList.remove('confirm-mode');
                btn.innerHTML = `
                    <svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                    </svg>
                `;
            }
        });
    });

    // Goal form submit
    goalsForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const daily = parseInt(goalDailyInput.value);
        const weekly = parseInt(goalWeeklyInput.value);
        const monthly = parseInt(goalMonthlyInput.value);

        try {
            const response = await fetch('/flexiones/api/goal', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ daily, weekly, monthly })
            });
            if (!response.ok) throw new Error('Error al actualizar metas');
            
            modalOverlay.classList.remove('active');
            fetchDashboardData();
        } catch (error) {
            console.error('Error saving goals:', error);
            alert('No se pudieron guardar las metas.');
        }
    });

    // Chart.js rendering
    function renderChart() {
        if (!pageData) return;

        const ctx = document.getElementById('historyChart').getContext('2d');
        let chartData, chartLabels, title;

        if (currentChartTab === 'daily') {
            chartData = pageData.chart_daily.data;
            chartLabels = pageData.chart_daily.labels;
            title = 'Flexiones por día de este mes';
        } else {
            chartData = pageData.chart_monthly.data;
            chartLabels = pageData.chart_monthly.labels;
            title = 'Flexiones por mes de este año';
        }

        if (chartInstance) {
            chartInstance.destroy();
        }

        // Create elegant glowing neon colors for Chart
        const primaryGradient = ctx.createLinearGradient(0, 0, 0, 200);
        primaryGradient.addColorStop(0, 'rgba(99, 102, 241, 0.4)');
        primaryGradient.addColorStop(1, 'rgba(168, 85, 247, 0.02)');

        const config = {
            type: 'line',
            data: {
                labels: chartLabels,
                datasets: [{
                    label: 'Flexiones',
                    data: chartData,
                    borderColor: '#8b5cf6',
                    borderWidth: 3,
                    backgroundColor: primaryGradient,
                    fill: true,
                    tension: 0.35,
                    pointBackgroundColor: '#6366f1',
                    pointBorderColor: '#ffffff',
                    pointBorderWidth: 1.5,
                    pointRadius: 3,
                    pointHoverRadius: 5,
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        titleFont: { family: 'Outfit', size: 13, weight: '600' },
                        bodyFont: { family: 'Outfit', size: 12 },
                        padding: 10,
                        backgroundColor: '#0f172a',
                        borderColor: 'rgba(255,255,255,0.08)',
                        borderWidth: 1,
                        displayColors: false,
                        callbacks: {
                            label: function(context) {
                                return `Cantidad: ${context.parsed.y} flexiones`;
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        grid: { display: false },
                        ticks: {
                            color: '#64748b',
                            font: { family: 'Outfit', size: 10 }
                        }
                    },
                    y: {
                        grid: {
                            color: 'rgba(255,255,255,0.04)',
                        },
                        ticks: {
                            color: '#64748b',
                            font: { family: 'Outfit', size: 10 },
                            precision: 0
                        },
                        min: 0
                    }
                }
            }
        };

        chartInstance = new Chart(ctx, config);
    }

    // Quick Add Button clicks
    quickButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const amount = parseInt(btn.getAttribute('data-val'));
            addPushUps(amount);
        });
    });

    // Custom Add Button click
    customAddBtn.addEventListener('click', () => {
        const amount = parseInt(customInput.value);
        if (!amount || amount <= 0) {
            alert('Ingrese una cantidad válida mayor a 0');
            return;
        }
        addPushUps(amount);
    });

    // Custom input Enter press
    customInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            customAddBtn.click();
        }
    });

    // Modal Events
    settingsBtn.addEventListener('click', () => modalOverlay.classList.add('active'));
    cancelModalBtn.addEventListener('click', () => modalOverlay.classList.remove('active'));
    modalOverlay.addEventListener('click', (e) => {
        if (e.target === modalOverlay) modalOverlay.classList.remove('active');
    });

    // Chart Tabs Switch
    tabDaily.addEventListener('click', () => {
        if (currentChartTab === 'daily') return;
        currentChartTab = 'daily';
        tabDaily.classList.add('active');
        tabMonthly.classList.remove('active');
        renderChart();
    });

    tabMonthly.addEventListener('click', () => {
        if (currentChartTab === 'monthly') return;
        currentChartTab = 'monthly';
        tabMonthly.classList.add('active');
        tabDaily.classList.remove('active');
        renderChart();
    });

    // Initial load
    fetchDashboardData();
});
