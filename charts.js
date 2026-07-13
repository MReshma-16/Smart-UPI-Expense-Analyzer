/* ==========================================================================
   Smart UPI Expense Analyzer & Money Saving Assistant - Charts
   ========================================================================== */

(function() {
    // Keep track of active chart instances to destroy them before re-creating
    let donutChartInstance = null;
    let barChartInstance = null;
    let lineChartInstance = null;

    // Define colors for each category
    const CATEGORY_COLORS = {
        Food: '#ef4444',          // Soft Crimson
        Shopping: '#6366f1',      // Indigo
        Travel: '#f59e0b',        // Amber
        Bills: '#06b6d4',         // Cyan
        Entertainment: '#a855f7',  // Purple
        Education: '#3b82f6',      // Blue
        Medical: '#ec4899',        // Pink
        Others: '#94a3b8'          // Slate Muted
    };

    // Shared options for dark theme chart styling
    const chartDefaults = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                labels: {
                    color: 'rgba(255, 255, 255, 0.7)',
                    font: {
                        family: "'Inter', sans-serif",
                        size: 11
                    },
                    boxWidth: 12
                }
            },
            tooltip: {
                backgroundColor: '#1e293b',
                titleColor: '#ffffff',
                bodyColor: '#ffffff',
                borderColor: 'rgba(255, 255, 255, 0.1)',
                borderWidth: 1,
                padding: 10,
                displayColors: true,
                bodyFont: {
                    family: "'Inter', sans-serif"
                },
                titleFont: {
                    family: "'Outfit', sans-serif",
                    weight: 'bold'
                }
            }
        },
        scales: {
            x: {
                grid: {
                    color: 'rgba(255, 255, 255, 0.05)',
                    borderColor: 'rgba(255, 255, 255, 0.1)'
                },
                ticks: {
                    color: 'rgba(255, 255, 255, 0.5)',
                    font: {
                        family: "'Inter', sans-serif",
                        size: 10
                    }
                }
            },
            y: {
                grid: {
                    color: 'rgba(255, 255, 255, 0.05)',
                    borderColor: 'rgba(255, 255, 255, 0.1)'
                },
                ticks: {
                    color: 'rgba(255, 255, 255, 0.5)',
                    font: {
                        family: "'Inter', sans-serif",
                        size: 10
                    }
                }
            }
        }
    };

    // Aggregate transactions by category
    function getCategoryData(transactions) {
        const categories = ["Food", "Shopping", "Travel", "Bills", "Entertainment", "Education", "Medical", "Others"];
        const aggregates = {};
        categories.forEach(c => aggregates[c] = 0);

        transactions.filter(t => !t.isIncome).forEach(t => {
            const cat = t.category || "Others";
            if (aggregates[cat] !== undefined) {
                aggregates[cat] += t.amount;
            } else {
                aggregates["Others"] += t.amount;
            }
        });

        return aggregates;
    }

    // Render 1: Donut Chart on Dashboard Page
    function renderDonutChart(txs) {
        const ctx = document.getElementById('categoryDonutChartDashboard');
        if (!ctx) return;

        if (donutChartInstance) {
            donutChartInstance.destroy();
        }

        const catData = getCategoryData(txs);
        const labels = Object.keys(catData);
        const dataValues = Object.values(catData);
        const backgroundColors = labels.map(l => CATEGORY_COLORS[l]);

        // Hide chart element and show message if no expenses
        const totalExpense = dataValues.reduce((a, b) => a + b, 0);
        if (totalExpense === 0) {
            ctx.style.display = 'none';
            return;
        } else {
            ctx.style.display = 'block';
        }

        donutChartInstance = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: labels,
                datasets: [{
                    data: dataValues,
                    backgroundColor: backgroundColors,
                    borderWidth: 1,
                    borderColor: 'rgba(15, 23, 42, 0.8)',
                    hoverOffset: 6
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                cutout: '72%',
                plugins: {
                    legend: {
                        position: 'right',
                        labels: {
                            color: 'rgba(255, 255, 255, 0.7)',
                            font: { family: "'Inter', sans-serif", size: 10 },
                            boxWidth: 10,
                            padding: 8
                        }
                    },
                    tooltip: chartDefaults.plugins.tooltip
                }
            }
        });
    }

    // Render 2: Budget vs Actual Bar Chart on Analytics Page
    function renderBarChart(txs, budgets) {
        const ctx = document.getElementById('categoryTrendBarChart');
        if (!ctx) return;

        if (barChartInstance) {
            barChartInstance.destroy();
        }

        const catData = getCategoryData(txs);
        const categories = Object.keys(catData);
        const actualSpent = Object.values(catData);
        
        // Match allocations
        const budgetLimits = categories.map(cat => budgets.categories[cat] || 0);

        barChartInstance = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: categories,
                datasets: [
                    {
                        label: 'Actual Spending (₹)',
                        data: actualSpent,
                        backgroundColor: categories.map(cat => CATEGORY_COLORS[cat] + 'bb'),
                        borderColor: categories.map(cat => CATEGORY_COLORS[cat]),
                        borderWidth: 1.5,
                        borderRadius: 4
                    },
                    {
                        label: 'Budget Limit (₹)',
                        data: budgetLimits,
                        backgroundColor: 'rgba(255, 255, 255, 0.05)',
                        borderColor: 'rgba(255, 255, 255, 0.2)',
                        borderWidth: 1.5,
                        borderDash: [4, 4],
                        borderRadius: 4
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        labels: { color: 'rgba(255, 255, 255, 0.7)', font: { family: "'Inter', sans-serif", size: 11 } }
                    },
                    tooltip: chartDefaults.plugins.tooltip
                },
                scales: chartDefaults.scales
            }
        });
    }

    // Render 3: Cumulative Expense Timeline Line Chart
    function renderLineChart(txs) {
        const ctx = document.getElementById('dailyExpenseLineChart');
        if (!ctx) return;

        if (lineChartInstance) {
            lineChartInstance.destroy();
        }

        // Generate cumulative daily totals over last 15 days for a clean timeline
        const daysToShow = 15;
        const labels = [];
        const data = [];
        const now = new Date();

        // Initialize object with 0s for past 15 days
        const dailyAggregates = {};
        for (let i = daysToShow - 1; i >= 0; i--) {
            const date = new Date(now);
            date.setDate(now.getDate() - i);
            const dateStr = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
            labels.push(dateStr);
            
            const keyStr = date.toISOString().split('T')[0];
            dailyAggregates[keyStr] = 0;
        }

        // Sum amounts
        txs.filter(t => !t.isIncome).forEach(t => {
            const keyStr = t.timestamp.split('T')[0];
            if (dailyAggregates[keyStr] !== undefined) {
                dailyAggregates[keyStr] += t.amount;
            }
        });

        // Compute Cumulative Curve
        let runningSum = 0;
        Object.keys(dailyAggregates).sort().forEach(key => {
            runningSum += dailyAggregates[key];
            data.push(runningSum);
        });

        // Create beautiful gradient under line
        const chartCtx = ctx.getContext('2d');
        const gradient = chartCtx.createLinearGradient(0, 0, 0, 240);
        gradient.addColorStop(0, 'rgba(99, 102, 241, 0.3)');
        gradient.addColorStop(1, 'rgba(99, 102, 241, 0)');

        lineChartInstance = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Cumulative Expense (₹)',
                    data: data,
                    borderColor: '#6366f1',
                    borderWidth: 3,
                    pointBackgroundColor: '#6366f1',
                    pointBorderColor: '#ffffff',
                    pointHoverRadius: 6,
                    fill: true,
                    backgroundColor: gradient,
                    tension: 0.3
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        labels: { color: 'rgba(255, 255, 255, 0.7)', font: { family: "'Inter', sans-serif", size: 11 } }
                    },
                    tooltip: chartDefaults.plugins.tooltip
                },
                scales: chartDefaults.scales
            }
        });
    }

    // Main Chart Builder API
    window.UPICharts = {
        buildAll: function() {
            const txs = window.UPIDatabase.getTransactions();
            const budgets = window.UPIDatabase.getBudgets();

            renderDonutChart(txs);
            renderBarChart(txs, budgets);
            renderLineChart(txs);
        }
    };

    // Auto-update charts when database triggers updates
    window.addEventListener('upiDataUpdated', function() {
        window.UPICharts.buildAll();
    });
})();
