// DASHBOARD JAVASCRIPT

// Wait for DOM to load
document.addEventListener('DOMContentLoaded', function() {
    initTicketSalesChart();
    initSalesRevenueChart();
    initCalendar();
});

// ============================================
// TICKET SALES DOUGHNUT CHART
// ============================================
function initTicketSalesChart() {
    const ctx = document.getElementById('ticketSalesChart');
    if (!ctx) return;

    new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Seat Sold', 'Seat Empty', 'Available'],
            datasets: [{
                data: [45, 30, 25],
                backgroundColor: [
                    '#10b981',  // Green
                    '#6b7280',  // Gray
                    '#3b82f6'   // Blue
                ],
                borderWidth: 0,
                cutout: '70%'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return context.label + ': ' + context.parsed + '%';
                        }
                    }
                }
            }
        },
        plugins: [{
            beforeDraw: function(chart) {
                const width = chart.width;
                const height = chart.height;
                const ctx = chart.ctx;
                ctx.restore();

                const fontSize = (height / 80).toFixed(2);
                ctx.font = fontSize + "em Inter, sans-serif";
                ctx.textBaseline = "middle";
                ctx.fillStyle = "#1a1a1a";
                ctx.font = "700 " + fontSize + "em Inter, sans-serif";

                const text = "2,780";
                const textX = Math.round((width - ctx.measureText(text).width) / 2);
                const textY = height / 2 - 10;

                ctx.fillText(text, textX, textY);

                ctx.font = "400 " + (fontSize * 0.4) + "em Inter, sans-serif";
                ctx.fillStyle = "#6b7280";
                const labelText = "Total Tickets";
                const labelX = Math.round((width - ctx.measureText(labelText).width) / 2);
                const labelY = height / 2 + 15;

                ctx.fillText(labelText, labelX, labelY);
                ctx.save();
            }
        }]
    });
}

// ============================================
// SALES REVENUE BAR CHART
// ============================================
function initSalesRevenueChart() {
    const ctx = document.getElementById('salesRevenueChart');
    if (!ctx) return;

    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
            datasets: [{
                label: 'Revenue',
                data: [15000, 22000, 18000, 28000, 25000, 32000, 28000, 35000],
                backgroundColor: '#a855f7',
                borderRadius: 6,
                barThickness: 24
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return '$' + context.parsed.y.toLocaleString();
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        color: '#f3f4f6',
                        drawBorder: false
                    },
                    ticks: {
                        callback: function(value) {
                            return '$' + (value / 1000) + 'K';
                        },
                        color: '#9ca3af',
                        font: {
                            size: 11
                        }
                    },
                    border: {
                        display: false
                    }
                },
                x: {
                    grid: {
                        display: false,
                        drawBorder: false
                    },
                    ticks: {
                        color: '#9ca3af',
                        font: {
                            size: 11
                        }
                    },
                    border: {
                        display: false
                    }
                }
            }
        }
    });
}

// ============================================
// CALENDAR NAVIGATION
// ============================================

function initCalendar() {
    const calendarBody = document.getElementById("calendarBody");
    const monthTitle = document.getElementById("calendarTitle");
    const prevBtn = document.getElementById("prevMonth");
    const nextBtn = document.getElementById("nextMonth");

    if (!calendarBody || !monthTitle || !prevBtn || !nextBtn) return;

    let currentDate = new Date();
    let selectedDate = null;

    function renderCalendar() {
        calendarBody.innerHTML = "";

        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();

        // ✅ MONTH & YEAR TEXT NOW UPDATES
        monthTitle.textContent = currentDate.toLocaleDateString("en-US", {
            month: "long",
            year: "numeric"
        });

        const firstDay = new Date(year, month, 1).getDay();
        const lastDate = new Date(year, month + 1, 0).getDate();
        const today = new Date();

        for (let i = 0; i < firstDay; i++) {
            const empty = document.createElement("div");
            empty.classList.add("calendar-day", "inactive");
            calendarBody.appendChild(empty);
        }

        for (let day = 1; day <= lastDate; day++) {
            const dayEl = document.createElement("div");
            dayEl.classList.add("calendar-day");
            dayEl.textContent = day;

            if (
                day === today.getDate() &&
                month === today.getMonth() &&
                year === today.getFullYear()
            ) {
                dayEl.classList.add("current");
            }

            dayEl.addEventListener("click", () => {
                document
                    .querySelectorAll(".calendar-day")
                    .forEach(d => d.classList.remove("current"));

                dayEl.classList.add("current");
                selectedDate = new Date(year, month, day);

                console.log("Selected Date:", selectedDate);
            });

            calendarBody.appendChild(dayEl);
        }
    }

    prevBtn.addEventListener("click", () => {
        currentDate.setMonth(currentDate.getMonth() - 1);
        renderCalendar();
    });

    nextBtn.addEventListener("click", () => {
        currentDate.setMonth(currentDate.getMonth() + 1);
        renderCalendar();
    });

    renderCalendar();
}



// ============================================
// MOBILE SIDEBAR TOGGLE
// ============================================
function toggleSidebar() {
    const sidebar = document.querySelector('.sidebar');
    sidebar.classList.toggle('open');
}

// Add hamburger menu for mobile if needed
if (window.innerWidth < 768) {
    const header = document.querySelector('.header-left');
    const menuBtn = document.createElement('button');
    menuBtn.className = 'mobile-menu-btn';
    menuBtn.innerHTML = '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>';
    menuBtn.onclick = toggleSidebar;
    header.insertBefore(menuBtn, header.firstChild);
}