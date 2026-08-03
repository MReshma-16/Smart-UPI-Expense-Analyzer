/* ==========================================================================
   Smart UPI Expense Analyzer & Money Saving Assistant - Core Orchestrator
   ========================================================================== */

document.addEventListener("DOMContentLoaded", function() {
    // 1. Initial Icon Setup
    lucide.createIcons();

    // 2. Theme Switcher System (Light/Dark Toggle)
    const themeToggleBtn = document.getElementById("theme-toggle-btn");
    const themeToggleIcon = document.getElementById("theme-toggle-icon");
    
    // Load cached theme or default to Light
    let currentTheme = localStorage.getItem("upi_theme") || "light";
    document.body.className = `${currentTheme}-theme`;
    updateThemeIcon(currentTheme);

    themeToggleBtn.addEventListener("click", function() {
        currentTheme = currentTheme === "light" ? "dark" : "light";
        document.body.className = `${currentTheme}-theme`;
        localStorage.setItem("upi_theme", currentTheme);
        updateThemeIcon(currentTheme);
    });

    function updateThemeIcon(theme) {
        if (theme === "light") {
            themeToggleIcon.setAttribute("data-lucide", "moon");
        } else {
            themeToggleIcon.setAttribute("data-lucide", "sun");
        }
        // Redraw icons
        lucide.createIcons();
    }

    // 2b. User Profile Session Loader & Logout
    const userProfileJSON = localStorage.getItem("upi_user_profile");
    if (userProfileJSON) {
        try {
            const profile = JSON.parse(userProfileJSON);
            const avatarEl = document.getElementById("sidebar-user-avatar");
            const nameEl = document.getElementById("sidebar-user-name");
            const subtitleEl = document.getElementById("sidebar-user-subtitle");

            if (avatarEl) avatarEl.textContent = profile.avatarText || "US";
            if (nameEl) nameEl.textContent = profile.username || "User";
            if (subtitleEl) subtitleEl.textContent = profile.email || "UPI Saver User";
        } catch(e) {
            console.warn("Could not parse user profile:", e);
        }
    }

    // Logout button handler
    const logoutBtn = document.getElementById("logout-btn");
    if (logoutBtn) {
        logoutBtn.addEventListener("click", function() {
            localStorage.removeItem("upi_user_profile");
<<<<<<< HEAD
            localStorage.removeItem("upi_current_user_id");
=======
>>>>>>> 496c18f464d1845877ed92c0f66d19bd0d2e6dc1
            window.location.href = "login.html";
        });
    }

    // 3. Tab Navigation Logic
    const menuItems = document.querySelectorAll(".menu-item");
    const tabPanes = document.querySelectorAll(".tab-pane");
    const pageTitle = document.getElementById("page-title");

    menuItems.forEach(item => {
        item.addEventListener("click", function(e) {
            e.preventDefault();
            const targetTab = this.getAttribute("data-tab");

            // Update active sidebar state
            menuItems.forEach(mi => mi.classList.remove("active"));
            this.classList.add("active");

            // Switch visible panel
            tabPanes.forEach(pane => {
                pane.classList.remove("active");
                if (pane.id === `tab-${targetTab}`) {
                    pane.classList.add("active");
                }
            });

            // Update Header Page Title
            const tabNames = {
                dashboard: "Overview",
                transactions: "UPI Transactions",
                analytics: "AI Insights",
                savings: "Savings Planner"
            };
            pageTitle.textContent = tabNames[targetTab] || "Overview";

            // Special trigger for Charts rendering on tab changes to fix canvas resize issues
            if (targetTab === "analytics" || targetTab === "dashboard") {
                setTimeout(() => {
                    window.UPICharts.buildAll();
                }, 100);
            }
        });
    });

    // Hook up dashboard 'View All' link to redirect to transactions tab
    const viewAllLink = document.getElementById("view-all-tx-link");
    if (viewAllLink) {
        viewAllLink.addEventListener("click", function(e) {
            e.preventDefault();
            const txMenuItem = document.querySelector(".menu-item[data-tab='transactions']");
            if (txMenuItem) txMenuItem.click();
        });
    }

    // Set Date in Nav
    const navDate = document.getElementById("nav-date");
    if (navDate) {
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        navDate.textContent = new Date().toLocaleDateString('en-US', options);
    }

    // 4. Collapsible Panels in Transactions Tab
    const toggleManualBtn = document.getElementById("toggle-manual-form-btn");
    const manualPanel = document.getElementById("manual-form-panel");
    const closeManualBtn = document.getElementById("close-manual-form");

    const toggleCsvBtn = document.getElementById("toggle-csv-import-btn");
    const csvPanel = document.getElementById("csv-import-panel");
    const closeCsvBtn = document.getElementById("close-csv-import");

    if (toggleManualBtn && manualPanel) {
        toggleManualBtn.addEventListener("click", () => {
            manualPanel.classList.toggle("hidden");
            csvPanel.classList.add("hidden"); // close other
        });
        closeManualBtn.addEventListener("click", () => {
            manualPanel.classList.add("hidden");
        });
    }

    if (toggleCsvBtn && csvPanel) {
        toggleCsvBtn.addEventListener("click", () => {
            csvPanel.classList.toggle("hidden");
            manualPanel.classList.add("hidden"); // close other
        });
        closeCsvBtn.addEventListener("click", () => {
            csvPanel.classList.add("hidden");
        });
    }

    // 5. Notification Drawer & Toast Center UI Logic
    const notifDrawer = document.getElementById("notifications-drawer");
    const toggleNotifBtn = document.getElementById("toggle-notifications-btn");
    const closeNotifBtn = document.getElementById("close-notifications-btn");
    const clearNotifBtn = document.getElementById("clear-notifications-btn");
    const notifBadge = document.getElementById("notif-badge-count");
    const notifContainer = document.getElementById("notifications-container");

    // Open/Close drawer
    toggleNotifBtn.addEventListener("click", () => notifDrawer.classList.toggle("active"));
    closeNotifBtn.addEventListener("click", () => notifDrawer.classList.remove("active"));
    
    clearNotifBtn.addEventListener("click", () => {
        window.UPIDatabase.saveNotifications([]);
        renderNotifications();
    });

    // Toast alert wrapper helper
    function showToast(title, message, type = "primary") {
        const toast = document.getElementById("app-toast");
        const toastTitle = document.getElementById("toast-title");
        const toastMsg = document.getElementById("toast-message");
        
        toastTitle.textContent = title;
        toastMsg.textContent = message;

        // Color border according to alert type
        toast.style.borderColor = {
            primary: "var(--primary)",
            success: "var(--accent)",
            warning: "var(--warning)",
            danger: "var(--danger)"
        }[type] || "var(--primary)";

        toast.classList.add("active");

        // Auto-close after 5 seconds
        setTimeout(() => {
            toast.classList.remove("active");
        }, 5000);
    }

    document.getElementById("toast-close-btn").addEventListener("click", () => {
        document.getElementById("app-toast").classList.remove("active");
    });

    // 6. Simulated Smart Notification Trigger Engine
    function evaluateTransactionRules(newTx, currentTxs, budgets) {
        const notifs = window.UPIDatabase.getNotifications();
        const expenses = currentTxs.filter(t => !t.isIncome);
        const monthlyTotal = expenses.reduce((sum, t) => sum + t.amount, 0);

        // Rule A: Category Specific Savings Suggestions
        if (newTx.category === "Food") {
            const coffeeOrders = expenses.filter(t => t.merchant.toLowerCase().includes("starbucks") || t.merchant.toLowerCase().includes("coffee"));
            const coffeeSpent = coffeeOrders.reduce((sum, t) => sum + t.amount, 0);

            if (newTx.merchant.toLowerCase().includes("starbucks") || newTx.merchant.toLowerCase().includes("coffee")) {
                notifs.unshift({
                    id: "nt-" + Date.now(),
                    title: "💡 Saving Coffee Hint",
                    message: `You've spent ₹${coffeeSpent.toLocaleString()} on Starbucks/Coffee. Reducing just one coffee a week could save ₹2,000+ per year.`,
                    type: "info",
                    timestamp: new Date().toISOString(),
                    read: false
                });
            } else {
                notifs.unshift({
                    id: "nt-" + Date.now(),
                    title: "💡 Cooking vs Delivery",
                    message: `You paid ₹${newTx.amount} on food delivery today. Cooking at home could save around ₹${Math.round(newTx.amount * 0.6)}.`,
                    type: "info",
                    timestamp: new Date().toISOString(),
                    read: false
                });
            }
        }

        // Rule B: Late Night Shopping Impulse Warning
        if (newTx.isNight && !newTx.isIncome) {
            notifs.unshift({
                id: "nt-" + Date.now(),
                title: "🌙 Impulse Spending Check",
                message: `Late-night purchase at ${newTx.merchant} detected. Was this purchase necessary? Waiting 24 hours can decrease impulse transactions by 80%.`,
                type: "warning",
                timestamp: new Date().toISOString(),
                read: false
            });
        }

        // Rule C: Monthly Budget pacing warnings (80% & 100%)
        const ratioBefore = (monthlyTotal - newTx.amount) / budgets.monthly;
        const ratioAfter = monthlyTotal / budgets.monthly;

        if (ratioBefore < 0.8 && ratioAfter >= 0.8) {
            notifs.unshift({
                id: "nt-" + Date.now(),
                title: "⚠️ 80% Budget Warning",
                message: `You have consumed 80% of your monthly budget limit. (₹${monthlyTotal} spent of ₹${budgets.monthly}).`,
                type: "warning",
                timestamp: new Date().toISOString(),
                read: false
            });
            showToast("Budget Warning", "You've reached 80% of your monthly budget limits!", "warning");
        }

        // Rule D: Daily Limit Exceeded
        const todayStr = new Date().toISOString().split('T')[0];
        const todayTxs = currentTxs.filter(t => !t.isIncome && t.timestamp.startsWith(todayStr));
        const todaySpent = todayTxs.reduce((sum, t) => sum + t.amount, 0);

        if (todaySpent > budgets.daily && (todaySpent - newTx.amount) <= budgets.daily) {
            notifs.unshift({
                id: "nt-" + Date.now(),
                title: "🚨 Daily Spending Cap Exceeded",
                message: `Your spending today (₹${todaySpent}) has exceeded your daily savings target limit (₹${budgets.daily}).`,
                type: "danger",
                timestamp: new Date().toISOString(),
                read: false
            });
            showToast("Daily Limit Exceeded", `You spent ₹${todaySpent} today against a ₹${budgets.daily} budget!`, "danger");
        }

        // Rule E: Emergency Weekly Inflation Check
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        const fourteenDaysAgo = new Date();
        fourteenDaysAgo.setDate(fourteenDaysAgo.getDate() - 14);

        const thisWeekSpend = expenses.filter(t => new Date(t.timestamp) >= sevenDaysAgo).reduce((sum, t) => sum + t.amount, 0);
        const lastWeekSpend = expenses.filter(t => {
            const date = new Date(t.timestamp);
            return date >= fourteenDaysAgo && date < sevenDaysAgo;
        }).reduce((sum, t) => sum + t.amount, 0);

        if (thisWeekSpend > lastWeekSpend * 1.3 && lastWeekSpend > 500) {
            const inflationPct = Math.round(((thisWeekSpend - lastWeekSpend) / lastWeekSpend) * 100);
            notifs.unshift({
                id: "nt-" + Date.now(),
                title: "⚠️ Emergency Alert: Spending Spike",
                message: `Your spending this week is ₹${thisWeekSpend.toLocaleString()}, which is ${inflationPct}% higher than last week's spend of ₹${lastWeekSpend.toLocaleString()}.`,
                type: "danger",
                timestamp: new Date().toISOString(),
                read: false
            });
        }

        // Save back
        window.UPIDatabase.saveNotifications(notifs);
        renderNotifications();
    }

    // 7. Simulation Modal Dialog Handling
    const simModal = document.getElementById("simulation-modal");
    const openSimBtn = document.getElementById("open-sim-btn");
    const closeSimBtn = document.getElementById("close-sim-btn");
    const simOverlay = document.getElementById("sim-modal-overlay");

    openSimBtn.addEventListener("click", () => simModal.classList.add("active"));
    const hideSimModal = () => simModal.classList.remove("active");
    closeSimBtn.addEventListener("click", hideSimModal);
    simOverlay.addEventListener("click", hideSimModal);

    // Preset cards simulation click
    const presetCards = document.querySelectorAll(".sim-preset-card");
    presetCards.forEach(card => {
        card.addEventListener("click", function() {
            const merchant = this.getAttribute("data-merchant");
            const amount = parseFloat(this.getAttribute("data-amount"));
            const category = this.getAttribute("data-category");
            const isNight = this.getAttribute("data-night") === "true";

            addSimulatedTransaction(merchant, amount, category, isNight);
            hideSimModal();
        });
    });

    // Custom simulated form submit
    const customSimForm = document.getElementById("custom-sim-form");
    customSimForm.addEventListener("submit", function(e) {
        e.preventDefault();
        const merchant = document.getElementById("sim-merchant").value;
        const amount = parseFloat(document.getElementById("sim-amount").value);
        const category = document.getElementById("sim-category").value;
        const isNight = document.getElementById("sim-night-purchase").checked;
        const offsetDays = parseInt(document.getElementById("sim-date-offset").value);

        addSimulatedTransaction(merchant, amount, category, isNight, offsetDays);
        customSimForm.reset();
        hideSimModal();
    });

    // CORE ADD TRANSACTION ENGINE
    function addSimulatedTransaction(merchant, amount, category, isNight = false, offsetDays = 0) {
        const txs = window.UPIDatabase.getTransactions();
        const budgets = window.UPIDatabase.getBudgets();

        // Calculate offset date
        const txDate = new Date();
        txDate.setDate(txDate.getDate() + offsetDays);
        if (isNight) {
            txDate.setHours(23, 15, 0); // Late night hour
        }

        const newTx = {
            id: "tx-" + Date.now(),
            merchant: merchant,
            amount: amount,
            category: category,
            timestamp: txDate.toISOString(),
            isNight: isNight,
            isIncome: false
        };

        txs.unshift(newTx);
        window.UPIDatabase.saveTransactions(txs);

        // Run Rule checks to trigger alerts
        evaluateTransactionRules(newTx, txs, budgets);

        // Show floating success toast
        showToast("UPI Transaction Parsed", `Rs. ${amount} debited to ${merchant} successfully.`, "success");
        
        // Refresh UI
        refreshUI();
    }

    // 8. Manual Transaction Entry Form
    const manualTxForm = document.getElementById("manual-tx-form");
    if (manualTxForm) {
        const localDateTime = new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 16);
        document.getElementById("manual-date").value = localDateTime;

        manualTxForm.addEventListener("submit", function(e) {
            e.preventDefault();
            const amount = parseFloat(document.getElementById("manual-amount").value);
            const merchant = document.getElementById("manual-merchant").value;
            const category = document.getElementById("manual-category").value;
            const dateStr = document.getElementById("manual-date").value;
            
            const txDate = new Date(dateStr);
            const hour = txDate.getHours();
            const isNight = (hour >= 22 || hour < 4);

            const txs = window.UPIDatabase.getTransactions();
            const budgets = window.UPIDatabase.getBudgets();

            const newTx = {
                id: "tx-manual-" + Date.now(),
                merchant: merchant,
                amount: amount,
                category: category,
                timestamp: txDate.toISOString(),
                isNight: isNight,
                isIncome: false
            };

            txs.unshift(newTx);
            window.UPIDatabase.saveTransactions(txs);
            evaluateTransactionRules(newTx, txs, budgets);

            showToast("Manual Log Added", `Logged ₹${amount} for ${merchant} under ${category}.`, "success");
            manualTxForm.reset();
            document.getElementById("manual-date").value = localDateTime;
            
            // Hide panel after submission
            manualPanel.classList.add("hidden");
            
            refreshUI();
        });
    }

    // 9. SMS Parser Sandbox UI
    const quickSMSBtn = document.getElementById("quick-parse-btn");
    const quickSMSInput = document.getElementById("quick-sms-input");

    if (quickSMSBtn && quickSMSInput) {
        quickSMSBtn.addEventListener("click", function() {
            const smsText = quickSMSInput.value.trim();
            if (!smsText) {
                showToast("Empty Input", "Please paste or select a sample UPI SMS text.", "warning");
                return;
            }

            const parsed = window.UPIParser.parseSMS(smsText);
            if (!parsed) {
                showToast("Parsing Failed", "Could not extract amount or merchant from text. Format unrecognized.", "danger");
                return;
            }

            const txs = window.UPIDatabase.getTransactions();
            const budgets = window.UPIDatabase.getBudgets();

            const newTx = {
                id: "tx-sms-" + Date.now(),
                merchant: parsed.merchant,
                amount: parsed.amount,
                category: parsed.category,
                timestamp: parsed.timestamp,
                isNight: parsed.isNight,
                isIncome: parsed.isIncome
            };

            txs.unshift(newTx);
            window.UPIDatabase.saveTransactions(txs);

            if (parsed.isIncome) {
                showToast("Income Logged", `Salary/Credit of Rs. ${parsed.amount} received from ${parsed.merchant}!`, "success");
            } else {
                evaluateTransactionRules(newTx, txs, budgets);
                showToast("SMS Debited Added", `SMS Parsed! Rs. ${parsed.amount} to ${parsed.merchant} saved.`, "success");
            }

            quickSMSInput.value = "";
            refreshUI();
        });

        // Bind sample SMS paste buttons
        const sampleSMSBtns = document.querySelectorAll(".btn-sample-sms");
        sampleSMSBtns.forEach(btn => {
            btn.addEventListener("click", function() {
                quickSMSInput.value = this.getAttribute("data-sms");
            });
        });
    }

    // 10. CSV Drag and Drop Statement Importer
    const dropZone = document.getElementById("csv-drag-drop");
    const fileInput = document.getElementById("csv-file-input");
    const importStatus = document.getElementById("csv-import-status");
    const loadSampleBtn = document.getElementById("load-sample-csv-btn");

    if (dropZone && fileInput) {
        dropZone.addEventListener("click", () => fileInput.click());

        dropZone.addEventListener("dragover", (e) => {
            e.preventDefault();
            dropZone.classList.add("active");
        });

        dropZone.addEventListener("dragleave", () => dropZone.classList.remove("active"));

        dropZone.addEventListener("drop", (e) => {
            e.preventDefault();
            dropZone.classList.remove("active");
            const file = e.dataTransfer.files[0];
            if (file && file.name.endsWith('.csv')) {
                processCSVFile(file);
            } else {
                importStatus.textContent = "Please upload a valid CSV file.";
                importStatus.style.color = "var(--danger)";
            }
        });

        fileInput.addEventListener("change", function() {
            const file = this.files[0];
            if (file) processCSVFile(file);
        });

        function processCSVFile(file) {
            importStatus.textContent = `Reading ${file.name}...`;
            importStatus.style.color = "var(--text-sec)";

            const reader = new FileReader();
            reader.onload = function(e) {
                const text = e.target.result;
                try {
                    const importedTxs = parseCSV(text);
                    if (importedTxs.length === 0) {
                        throw new Error("No valid transactions found in CSV.");
                    }

                    const txs = window.UPIDatabase.getTransactions();
                    const merged = [...importedTxs, ...txs];
                    window.UPIDatabase.saveTransactions(merged);

                    importStatus.textContent = `Successfully imported ${importedTxs.length} transactions!`;
                    importStatus.style.color = "var(--accent)";
                    showToast("Statement Imported", `${importedTxs.length} transactions loaded from CSV.`, "success");
                    
                    // Hide panel after 1.5s
                    setTimeout(() => {
                        csvPanel.classList.add("hidden");
                        importStatus.textContent = "";
                    }, 1500);

                    refreshUI();
                } catch (err) {
                    importStatus.textContent = `Import failed: ${err.message}`;
                    importStatus.style.color = "var(--danger)";
                }
            };
            reader.readAsText(file);
        }

        // CSV parsing helper
        function parseCSV(text) {
            const lines = text.split(/\r?\n/);
            const imported = [];
            
            lines.forEach((line, idx) => {
                if (idx === 0 || !line.trim()) return; // skip header or empty rows
                
                const parts = line.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);
                if (parts.length >= 3) {
                    const dateStr = parts[0].trim();
                    const merchant = parts[1].replace(/"/g, '').trim();
                    const amount = parseFloat(parts[2].trim());
                    const category = parts[3] ? parts[3].replace(/"/g, '').trim() : "Others";
                    
                    if (!isNaN(amount) && merchant) {
                        const parsedDate = new Date(dateStr);
                        const isIncome = category.toLowerCase() === "income";

                        imported.push({
                            id: "tx-csv-" + idx + "-" + Date.now(),
                            merchant: merchant,
                            amount: amount,
                            category: isIncome ? "Income" : category,
                            timestamp: isNaN(parsedDate.getTime()) ? new Date().toISOString() : parsedDate.toISOString(),
                            isNight: false,
                            isIncome: isIncome
                        });
                    }
                }
            });
            return imported;
        }

        // Load pre-made sample CSV text
        loadSampleBtn.addEventListener("click", function(e) {
            e.preventDefault();
            const sampleCSV = `Date,Merchant,Amount,Category\n` +
                `${getPastDateCSV(1)},Pizza Hut Delivery,680,Food\n` +
                `${getPastDateCSV(2)},Netflix Subcription,649,Entertainment\n` +
                `${getPastDateCSV(3)},Amazon Shopping Electronics,4500,Shopping\n` +
                `${getPastDateCSV(4)},Ola Cab Commute,420,Travel\n` +
                `${getPastDateCSV(5)},Mobile Bill Jio,599,Bills\n` +
                `${getPastDateCSV(6)},Apollo Medicines,120,Medical\n` +
                `${getPastDateCSV(7)},Udemy Web Dev Course,389,Education`;

            const blob = new Blob([sampleCSV], { type: 'text/csv' });
            const file = new File([blob], 'mock_bank_statement.csv', { type: 'text/csv' });
            processCSVFile(file);
        });

        function getPastDateCSV(daysAgo) {
            const d = new Date();
            d.setDate(d.getDate() - daysAgo);
            return d.toISOString().split('T')[0];
        }
    }

    // 11. Budgets Update Form
    const budgetSettingsForm = document.getElementById("settings-budget-form");
    if (budgetSettingsForm) {
        const currBudgets = window.UPIDatabase.getBudgets();
        document.getElementById("settings-monthly-budget").value = currBudgets.monthly;
        document.getElementById("settings-daily-budget").value = currBudgets.daily;

        budgetSettingsForm.addEventListener("submit", function(e) {
            e.preventDefault();
            const monthly = parseFloat(document.getElementById("settings-monthly-budget").value);
            const daily = parseFloat(document.getElementById("settings-daily-budget").value);

            const budgets = window.UPIDatabase.getBudgets();
            budgets.monthly = monthly;
            budgets.daily = daily;

            budgets.categories.Food = Math.round(monthly * 0.25);
            budgets.categories.Shopping = Math.round(monthly * 0.25);
            budgets.categories.Travel = Math.round(monthly * 0.15);
            budgets.categories.Bills = Math.round(monthly * 0.15);
            budgets.categories.Entertainment = Math.round(monthly * 0.1);
            budgets.categories.Education = Math.round(monthly * 0.05);
            budgets.categories.Medical = Math.round(monthly * 0.03);
            budgets.categories.Others = Math.round(monthly * 0.02);

            window.UPIDatabase.saveBudgets(budgets);
            showToast("Budgets Updated", "Limits updated and category allocations redistributed.", "success");
            refreshUI();
        });
    }

    // 12. Savings Goal Form
    const createGoalForm = document.getElementById("create-goal-form");
    const goalMathPreview = document.getElementById("goal-math-preview");

    if (createGoalForm && goalMathPreview) {
        const goalTargetInput = document.getElementById("goal-target");
        const goalTimeframeInput = document.getElementById("goal-timeframe");

        function updateGoalPreview() {
            const target = parseFloat(goalTargetInput.value);
            const months = parseInt(goalTimeframeInput.value);

            if (!isNaN(target) && target > 0 && !isNaN(months) && months > 0) {
                const totalDays = months * 30;
                const dailySaving = Math.round(target / totalDays);
                goalMathPreview.innerHTML = `To reach ₹${target.toLocaleString()} in <strong>${months} months</strong> (approx. ${totalDays} days), save <strong>₹${dailySaving}/day</strong>.`;
                goalMathPreview.style.color = "var(--accent)";
            } else {
                goalMathPreview.textContent = "Enter details to view estimated daily saving requirements.";
                goalMathPreview.style.color = "var(--text-sec)";
            }
        }

        goalTargetInput.addEventListener("input", updateGoalPreview);
        goalTimeframeInput.addEventListener("input", updateGoalPreview);

        createGoalForm.addEventListener("submit", function(e) {
            e.preventDefault();
            const name = document.getElementById("goal-name").value;
            const target = parseFloat(goalTargetInput.value);
            const timeframe = parseInt(goalTimeframeInput.value);

            const goals = window.UPIDatabase.getGoals();
            const newGoal = {
                id: "goal-" + Date.now(),
                name: name,
                target: target,
                current: 0,
                timeframe: timeframe,
                createdAt: new Date().toISOString()
            };

            goals.push(newGoal);
            window.UPIDatabase.saveGoals(goals);
            showToast("Savings Goal Created", `Saved plan for ${name} costing ₹${target}.`, "success");
            
            createGoalForm.reset();
            goalMathPreview.textContent = "Enter details to view estimated daily saving requirements.";
            goalMathPreview.style.color = "var(--text-sec)";
            refreshUI();
        });
    }

    // 13. Impulse Buy Cooldown Box Form
    const addCooldownForm = document.getElementById("add-cooldown-form");
    if (addCooldownForm) {
        addCooldownForm.addEventListener("submit", function(e) {
            e.preventDefault();
            const name = document.getElementById("cooldown-item-name").value;
            const cost = parseFloat(document.getElementById("cooldown-item-cost").value);

            const items = window.UPIDatabase.getCooldownItems();
            const newItem = {
                id: "cd-" + Date.now(),
                name: name,
                cost: cost,
                createdAt: new Date().toISOString(),
                timeLimitMs: 24 * 60 * 60 * 1000,
                decision: "pending"
            };

            items.push(newItem);
            window.UPIDatabase.saveCooldownItems(items);
            showToast("Item Placed on Cooldown", `Waiting period of 24h started for ${name}.`, "warning");

            addCooldownForm.reset();
            refreshUI();
        });
    }

    // 14. Clear Data History
    const clearHistoryBtn = document.getElementById("clear-all-data-btn");
    if (clearHistoryBtn) {
        clearHistoryBtn.addEventListener("click", function() {
            if (confirm("Are you sure you want to reset all transaction history, goals, and customized budgets to seed defaults?")) {
                window.UPIDatabase.clearAllData();
                showToast("Database Reset", "Application returned to original demo seeds.", "success");
                refreshUI();
            }
        });
    }

    // ==========================================================================
    // UI RENDER AND REFRESH ORCHESTRATORS
    // ==========================================================================

    function refreshUI() {
        renderKPIs();
        renderRecentTransactions();
        renderAllTransactionsList();
        renderNotifications();
        renderBudgetsAndGoals();
        renderChallenges();
        renderCooldownList();
        renderAICoachPanel();
        lucide.createIcons();
    }

    // RENDER: KPI Metric Numbers
    function renderKPIs() {
        const txs = window.UPIDatabase.getTransactions();
        const budgets = window.UPIDatabase.getBudgets();

        const income = txs.filter(t => t.isIncome).reduce((sum, t) => sum + t.amount, 0);
        const expenses = txs.filter(t => !t.isIncome).reduce((sum, t) => sum + t.amount, 0);
        const savings = Math.max(0, income - expenses);

        document.getElementById("kpi-income").textContent = `₹${income.toLocaleString()}`;
        document.getElementById("kpi-expenses").textContent = `₹${expenses.toLocaleString()}`;
        document.getElementById("kpi-savings").textContent = `₹${savings.toLocaleString()}`;

        const ratioText = document.getElementById("kpi-expenses-ratio");
        if (income > 0) {
            const pct = Math.round((expenses / income) * 100);
            ratioText.textContent = `${pct}% of income spent`;
            ratioText.className = `kpi-trend ${pct > 75 ? 'negative' : 'positive'}`;
        } else {
            ratioText.textContent = `₹${expenses.toLocaleString()} spent`;
        }

        const savingsRateText = document.getElementById("kpi-savings-rate");
        if (income > 0) {
            const pct = Math.round((savings / income) * 100);
            savingsRateText.textContent = `${pct}% savings rate`;
        }

        const todayStr = new Date().toISOString().split('T')[0];
        const todaySpent = txs.filter(t => !t.isIncome && t.timestamp.startsWith(todayStr))
                              .reduce((sum, t) => sum + t.amount, 0);
        
        document.getElementById("kpi-daily").textContent = `₹${todaySpent} / ₹${budgets.daily}`;
        
        const dailyProgressFill = document.getElementById("daily-budget-fill");
        const dailyPct = Math.min(100, Math.round((todaySpent / budgets.daily) * 100));
        dailyProgressFill.style.width = `${dailyPct}%`;
        if (dailyPct > 100) {
            dailyProgressFill.style.backgroundColor = "var(--danger)";
        } else if (dailyPct > 80) {
            dailyProgressFill.style.backgroundColor = "var(--warning)";
        } else {
            dailyProgressFill.style.backgroundColor = "var(--accent)";
        }
    }

    // RENDER: Recent Transactions (Dashboard Overview)
    function renderRecentTransactions() {
        const txs = window.UPIDatabase.getTransactions();
        const tbody = document.getElementById("recent-transactions-tbody");
        if (!tbody) return;

        const recent = txs.slice(0, 5);
        tbody.innerHTML = "";

        if (recent.length === 0) {
            tbody.innerHTML = `<tr><td colspan="4" style="text-align:center;color:var(--text-muted);">No transactions recorded.</td></tr>`;
            return;
        }

        recent.forEach(t => {
            const date = new Date(t.timestamp);
            const dateStr = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) + " • " + 
                            date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
            
            const badgeClass = `badge-${t.category.toLowerCase()}`;
            const amountText = t.isIncome ? `+₹${t.amount.toLocaleString()}` : `-₹${t.amount.toLocaleString()}`;
            const amountClass = t.isIncome ? "tx-amount pos" : "tx-amount neg";
            const initial = t.merchant.charAt(0).toUpperCase();

            tbody.innerHTML += `
                <tr>
                    <td>
                        <div class="merchant-cell">
                            <div class="merchant-avatar">${initial}</div>
                            <div>
                                <h5 style="font-weight:600;">${t.merchant}</h5>
                                ${t.isNight ? '<span style="font-size:9px;color:var(--warning);font-weight:600;"><i data-lucide="moon" style="width:8px;height:8px;display:inline-block;vertical-align:middle;margin-right:2px;"></i> Late Night</span>' : ''}
                            </div>
                        </div>
                    </td>
                    <td><span class="badge ${badgeClass}">${t.category}</span></td>
                    <td class="text-muted">${dateStr}</td>
                    <td class="${amountClass}">${amountText}</td>
                </tr>
            `;
        });
    }

    // RENDER: All Transactions (Transactions Tab)
    function renderAllTransactionsList() {
        const txs = window.UPIDatabase.getTransactions();
        const tbody = document.getElementById("all-transactions-tbody");
        if (!tbody) return;

        const search = document.getElementById("tx-search-input").value.toLowerCase();
        const filterCat = document.getElementById("tx-category-filter").value;

        const filtered = txs.filter(t => {
            const matchesSearch = t.merchant.toLowerCase().includes(search);
            const matchesCat = (filterCat === "All") || (t.category === filterCat);
            return matchesSearch && matchesCat;
        });

        tbody.innerHTML = "";

        if (filtered.length === 0) {
            tbody.innerHTML = `<tr><td colspan="5" style="text-align:center;color:var(--text-muted);padding:30px 0;">No matching transactions found.</td></tr>`;
            return;
        }

        filtered.forEach(t => {
            const date = new Date(t.timestamp);
            const dateStr = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) + " • " + 
                            date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
            
            const badgeClass = `badge-${t.category.toLowerCase()}`;
            const amountText = t.isIncome ? `+₹${t.amount.toLocaleString()}` : `-₹${t.amount.toLocaleString()}`;
            const amountClass = t.isIncome ? "tx-amount pos" : "tx-amount neg";
            const initial = t.merchant.charAt(0);

            const row = document.createElement("tr");
            row.innerHTML = `
                <td>
                    <div class="merchant-cell">
                        <div class="merchant-avatar">${initial}</div>
                        <div>
                            <h5 style="font-weight:600;">${t.merchant}</h5>
                            ${t.isNight ? '<span style="font-size:9px;color:var(--warning);font-weight:600;"><i data-lucide="moon" style="width:8px;height:8px;display:inline-block;vertical-align:middle;margin-right:2px;"></i> Late Night</span>' : ''}
                        </div>
                    </div>
                </td>
                <td><span class="badge ${badgeClass}">${t.category}</span></td>
                <td class="text-muted">${dateStr}</td>
                <td class="${amountClass}">${amountText}</td>
                <td>
                    <button class="btn-icon btn-xs delete-tx-btn" data-id="${t.id}" title="Delete Item" style="background:transparent;border:0">
                        <i data-lucide="trash-2" style="width:12px;height:12px;color:var(--danger)"></i>
                    </button>
                </td>
            `;

            row.querySelector(".delete-tx-btn").addEventListener("click", function() {
                const id = this.getAttribute("data-id");
                if (confirm("Delete this transaction entry?")) {
                    const remaining = txs.filter(item => item.id !== id);
                    window.UPIDatabase.saveTransactions(remaining);
                    showToast("Transaction Deleted", "Record removed from database.", "warning");
                    refreshUI();
                }
            });

            tbody.appendChild(row);
        });
    }

    document.getElementById("tx-search-input").addEventListener("input", renderAllTransactionsList);
    document.getElementById("tx-category-filter").addEventListener("change", renderAllTransactionsList);

    // RENDER: Notification Drawer Cards
    function renderNotifications() {
        const notifs = window.UPIDatabase.getNotifications();
        const badgeCount = document.getElementById("notif-badge-count");
        const container = document.getElementById("notifications-container");
        
        const unreadCount = notifs.filter(n => !n.read).length;
        badgeCount.textContent = unreadCount;
        badgeCount.style.display = unreadCount > 0 ? "flex" : "none";

        container.innerHTML = "";

        if (notifs.length === 0) {
            container.innerHTML = `
                <div class="no-notifications">
                    <i data-lucide="bell-off"></i>
                    <p>No new notifications</p>
                </div>
            `;
            return;
        }

        notifs.forEach(n => {
            const date = new Date(n.timestamp);
            const timeStr = date.toLocaleDateString() + " " + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            
            const icon = {
                success: "check-circle",
                warning: "alert-triangle",
                danger: "x-circle",
                info: "lightbulb"
            }[n.type] || "info";

            const notifItem = document.createElement("div");
            notifItem.className = `notification-item ${n.read ? '' : 'unread'}`;
            notifItem.style.borderLeft = `3px solid var(--${n.type === 'success' ? 'accent' : n.type})`;
            
            notifItem.innerHTML = `
                <div class="notif-icon-circle ${n.type}">
                    <i data-lucide="${icon}"></i>
                </div>
                <div class="notif-details">
                    <h5>${n.title}</h5>
                    <p>${n.message}</p>
                    <span class="notif-time">${timeStr}</span>
                </div>
                <button class="notif-delete-btn" data-id="${n.id}">&times;</button>
            `;

            notifItem.addEventListener("mouseenter", function() {
                if (!n.read) {
                    n.read = true;
                    window.UPIDatabase.saveNotifications(notifs);
                    badgeCount.textContent = notifs.filter(it => !it.read).length;
                }
            });

            notifItem.querySelector(".notif-delete-btn").addEventListener("click", function(e) {
                e.stopPropagation();
                const filtered = notifs.filter(it => it.id !== n.id);
                window.UPIDatabase.saveNotifications(filtered);
                renderNotifications();
            });

            container.appendChild(notifItem);
        });
    }

    // RENDER: Budgets Settings & Goal Lists
    function renderBudgetsAndGoals() {
        const budgets = window.UPIDatabase.getBudgets();
        const txs = window.UPIDatabase.getTransactions();
        const goals = window.UPIDatabase.getGoals();

        // 1. Render Category Budgets
        const budgetContainer = document.getElementById("category-budgets-container");
        if (budgetContainer) {
            budgetContainer.innerHTML = "";
            const catTotals = {};
            txs.filter(t => !t.isIncome).forEach(t => {
                catTotals[t.category] = (catTotals[t.category] || 0) + t.amount;
            });

            const icons = {
                Food: "pizza", Shopping: "shopping-bag", Travel: "car",
                Bills: "phone", Entertainment: "play", Education: "book-open",
                Medical: "plus-circle", Others: "help-circle"
            };

            Object.entries(budgets.categories).forEach(([category, limit]) => {
                const spent = catTotals[category] || 0;
                const pct = Math.min(100, Math.round((spent / limit) * 100));
                const barFillColor = pct > 99 ? 'var(--danger)' : (pct > 80 ? 'var(--warning)' : 'var(--accent)');
                const iconName = icons[category] || "tag";

                budgetContainer.innerHTML += `
                    <div class="category-budget-item">
                        <div class="cat-budget-header">
                            <span class="cat-name"><i data-lucide="${iconName}"></i> ${category}</span>
                            <span class="cat-budget-math">₹${spent.toLocaleString()} / <strong>₹${limit.toLocaleString()}</strong></span>
                        </div>
                        <div class="progress-bar-container">
                            <div class="progress-bar-fill" style="width: ${pct}%; background: ${barFillColor};"></div>
                        </div>
                    </div>
                `;
            });
        }

        // 2. Render Widget values
        const expenses = txs.filter(t => !t.isIncome).reduce((sum, t) => sum + t.amount, 0);
        document.getElementById("budget-widget-spent").textContent = `₹${expenses.toLocaleString()} spent`;
        document.getElementById("budget-widget-limit").textContent = `of ₹${budgets.monthly.toLocaleString()}`;
        
        const widgetFillPct = Math.min(100, Math.round((expenses / budgets.monthly) * 100));
        const widgetFill = document.getElementById("budget-widget-fill");
        widgetFill.style.width = `${widgetFillPct}%`;
        
        if (widgetFillPct > 90) {
            widgetFill.style.background = "var(--danger)";
        } else if (widgetFillPct > 75) {
            widgetFill.style.background = "var(--warning)";
        } else {
            widgetFill.style.background = "linear-gradient(90deg, var(--primary), var(--accent))";
        }

        const now = new Date();
        const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
        const diffTime = Math.abs(endOfMonth - now);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        document.getElementById("budget-widget-days").textContent = `${diffDays} days remaining in month`;

        // 3. Render Savings Goals
        const goalsContainer = document.getElementById("goals-list-container");
        if (goalsContainer) {
            goalsContainer.innerHTML = "";
            if (goals.length === 0) {
                goalsContainer.innerHTML = `<p style="color:var(--text-muted);text-align:center;padding:20px 0;">No active savings goals. Create one above!</p>`;
                return;
            }

            const incomeTotal = txs.filter(t => t.isIncome).reduce((sum, t) => sum + t.amount, 0);
            const expensesTotal = txs.filter(t => !t.isIncome).reduce((sum, t) => sum + t.amount, 0);
            const savingsPool = Math.max(0, incomeTotal - expensesTotal);

            goals.forEach(g => {
                const allocated = Math.min(g.target, Math.round(savingsPool * 0.4) + g.current);
                const pct = Math.min(100, Math.round((allocated / g.target) * 100));

                const remainingCost = Math.max(0, g.target - allocated);
                const daysRemaining = g.timeframe * 30;
                const reqDailySaving = Math.round(remainingCost / daysRemaining);

                goalsContainer.innerHTML += `
                    <div class="goal-card-item">
                        <div class="goal-card-header">
                            <div class="goal-card-title">
                                <h4>${g.name}</h4>
                                <p>Target timeframe: ${g.timeframe} Months (${daysRemaining} Days)</p>
                            </div>
                            <div class="goal-card-target">
                                <h4>₹${allocated.toLocaleString()} / ₹${g.target.toLocaleString()}</h4>
                                <p>${pct}% Completed</p>
                            </div>
                        </div>
                        <div class="progress-bar-container">
                            <div class="progress-bar-fill" style="width: ${pct}%; background: linear-gradient(90deg, var(--primary), var(--accent));"></div>
                        </div>
                        ${remainingCost > 0 ? `
                            <div class="goal-math-advice">
                                <i data-lucide="piggy-bank"></i>
                                <span>Save <strong>₹${reqDailySaving}/day</strong> over the next ${daysRemaining} to reach this goal.</span>
                            </div>
                        ` : `
                            <div class="goal-math-advice" style="background:var(--accent-glow);border:1px solid rgba(16,185,129,0.2)">
                                <i data-lucide="sparkles" style="color:var(--accent)"></i>
                                <span style="color:var(--accent)">Goal Achieved! You have accumulated enough savings.</span>
                            </div>
                        `}
                    </div>
                `;
            });
        }
    }

    // RENDER: Challenges Panel
    function renderChallenges() {
        const challenges = window.UPIDatabase.getChallenges();
        const widgetContainer = document.getElementById("dashboard-challenge-widget");
        const gridContainer = document.getElementById("challenges-grid");

        if (widgetContainer) {
            const activeCh = challenges.find(c => c.status === "joined") || challenges.find(c => c.status === "active");
            if (activeCh) {
                widgetContainer.innerHTML = `
                    <div class="challenge-title">${activeCh.name}</div>
                    <div class="challenge-desc">${activeCh.desc}</div>
                    <div class="challenge-actions-row">
                        <span class="challenge-reward"><i data-lucide="zap"></i> +${activeCh.reward} Score Points</span>
                        ${activeCh.status === 'joined' ? `
                            <button class="btn btn-accent btn-xs claim-ch-btn" data-id="${activeCh.id}">Claim Reward</button>
                        ` : `
                            <button class="btn btn-secondary btn-xs join-ch-btn" data-id="${activeCh.id}">Join Now</button>
                        `}
                    </div>
                `;

                const btn = widgetContainer.querySelector(".claim-ch-btn") || widgetContainer.querySelector(".join-ch-btn");
                if (btn) {
                    btn.addEventListener("click", function() {
                        const id = this.getAttribute("data-id");
                        toggleChallengeStatus(id);
                    });
                }
            } else {
                widgetContainer.innerHTML = `<p style="color:var(--text-muted);font-size:12px;">All challenges completed this week!</p>`;
            }
        }

        if (gridContainer) {
            gridContainer.innerHTML = "";
            challenges.forEach(c => {
                const card = document.createElement("div");
                card.className = `challenge-card ${c.status}`;

                let statusBadge = "Available";
                let actionBtn = `<button class="btn btn-secondary btn-sm join-btn">Accept Challenge</button>`;
                
                if (c.status === "joined") {
                    statusBadge = "In Progress";
                    actionBtn = `<button class="btn btn-accent btn-sm claim-btn">Claim Reward</button>`;
                } else if (c.status === "completed") {
                    statusBadge = "Completed";
                    actionBtn = `<button class="btn btn-outline btn-sm" disabled style="cursor:not-allowed;">Reward Claimed</button>`;
                }

                card.innerHTML = `
                    <div class="challenge-card-header">
                        <span class="challenge-badge">${statusBadge}</span>
                        <span class="challenge-reward"><i data-lucide="zap"></i> +${c.reward} Score</span>
                    </div>
                    <div class="challenge-card-body">
                        <h4>${c.name}</h4>
                        <p>${c.desc}</p>
                    </div>
                    <div class="challenge-card-footer">
                        ${actionBtn}
                    </div>
                `;

                const btn = card.querySelector(".join-btn") || card.querySelector(".claim-btn");
                if (btn) {
                    btn.addEventListener("click", function() {
                        toggleChallengeStatus(c.id);
                    });
                }

                gridContainer.appendChild(card);
            });
        }
    }

    function toggleChallengeStatus(id) {
        const challenges = window.UPIDatabase.getChallenges();
        const ch = challenges.find(item => item.id === id);
        
        if (ch) {
            if (ch.status === "active") {
                ch.status = "joined";
                showToast("Challenge Accepted", `Started: ${ch.name}. Complete it to earn score points!`, "primary");
            } else if (ch.status === "joined") {
                ch.status = "completed";
                showToast("Challenge Completed!", `Awarded +${ch.reward} to your Spending Score!`, "success");
                
                const notifs = window.UPIDatabase.getNotifications();
                notifs.unshift({
                    id: "nt-" + Date.now(),
                    title: `🏆 Challenge Completed: ${ch.name}`,
                    message: `You successfully completed the weekly challenge and received +${ch.reward} financial health points.`,
                    type: "success",
                    timestamp: new Date().toISOString(),
                    read: false
                });
                window.UPIDatabase.saveNotifications(notifs);
            }
            window.UPIDatabase.saveChallenges(challenges);
            refreshUI();
        }
    }

    // RENDER: Impulse Buy Cooldown Box (Ticking timer list)
    let cooldownTimerId = null;

    function renderCooldownList() {
        const container = document.getElementById("cooldown-items-container");
        if (!container) return;

        const items = window.UPIDatabase.getCooldownItems();
        container.innerHTML = "";

        if (items.length === 0) {
            container.innerHTML = `
                <div style="padding: 20px; text-align: center; color: var(--text-muted); font-size: 13px;">
                    No items on cooling hold. Place non-essentials here to sleep on decisions!
                </div>
            `;
            return;
        }

        items.forEach(item => {
            const createdTime = new Date(item.createdAt).getTime();
            const elapsed = Date.now() - createdTime;
            const remaining = item.timeLimitMs - elapsed;

            const isExpired = remaining <= 0;
            let timerHtml = "";
            let actionHtml = "";

            if (item.decision !== "pending") {
                timerHtml = `<span class="cooldown-timer expired" style="color:var(--text-muted)"><i data-lucide="check-circle"></i> Decided</span>`;
                actionHtml = `<span style="font-size:11px;color:var(--text-muted);font-weight:600;text-transform:uppercase;">${item.decision.replace('_', ' ')}</span>`;
            } else if (isExpired) {
                timerHtml = `<span class="cooldown-timer expired"><i data-lucide="unlock"></i> Cooling Done</span>`;
                actionHtml = `
                    <div style="display:flex;gap:6px;">
                        <button class="btn btn-accent btn-xs cd-save-btn" data-id="${item.id}" title="I saved this money">Saved It!</button>
                        <button class="btn btn-secondary btn-xs cd-buy-btn" data-id="${item.id}" title="I bought it anyway">Bought It</button>
                    </div>
                `;
            } else {
                const hours = Math.floor(remaining / (1000 * 60 * 60));
                const mins = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));
                const secs = Math.floor((remaining % (1000 * 60)) / 1000);
                const timerStr = `${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
                
                timerHtml = `<span class="cooldown-timer"><i data-lucide="clock"></i> ${timerStr}</span>`;
                actionHtml = `
                    <div style="display:flex;gap:6px;">
                        <button class="btn btn-outline btn-xs cd-bypass-btn" data-id="${item.id}" style="border-color:var(--danger);color:var(--danger);background:transparent" title="Buy before cooldown expires">Bypass (Buy Now)</button>
                    </div>
                `;
            }

            const row = document.createElement("div");
            row.className = "cooldown-item-row";
            row.innerHTML = `
                <div class="cooldown-item-info">
                    <h5>${item.name}</h5>
                    <p>Cost: ₹${item.cost.toLocaleString()} • Placed: ${new Date(item.createdAt).toLocaleDateString()}</p>
                </div>
                <div>${timerHtml}</div>
                <div>${actionHtml}</div>
            `;

            const saveBtn = row.querySelector(".cd-save-btn");
            const buyBtn = row.querySelector(".cd-buy-btn");
            const bypassBtn = row.querySelector(".cd-bypass-btn");

            if (saveBtn) {
                saveBtn.addEventListener("click", () => handleCooldownDecision(item.id, "saved_money"));
            }
            if (buyBtn) {
                buyBtn.addEventListener("click", () => handleCooldownDecision(item.id, "bought_legit"));
            }
            if (bypassBtn) {
                bypassBtn.addEventListener("click", () => handleCooldownDecision(item.id, "bought_early"));
            }

            container.appendChild(row);
        });

        const hasActiveTicking = items.some(item => (item.decision === "pending" && (Date.now() - new Date(item.createdAt).getTime()) < item.timeLimitMs));
        if (hasActiveTicking && !cooldownTimerId) {
            cooldownTimerId = setInterval(renderCooldownList, 1000);
        } else if (!hasActiveTicking && cooldownTimerId) {
            clearInterval(cooldownTimerId);
            cooldownTimerId = null;
        }
    }

    function handleCooldownDecision(id, decision) {
        const items = window.UPIDatabase.getCooldownItems();
        const item = items.find(it => it.id === id);

        if (item) {
            item.decision = decision;
            window.UPIDatabase.saveCooldownItems(items);

            const notifs = window.UPIDatabase.getNotifications();

            if (decision === "saved_money") {
                showToast("Money Saved!", `Awesome! You saved ₹${item.cost} by skipping impulse shopping.`, "success");
                
                notifs.unshift({
                    id: "nt-" + Date.now(),
                    title: `🎉 Impulse Avoided: Saved ₹${item.cost}`,
                    message: `You slept on the decision to buy ${item.name} and saved ₹${item.cost.toLocaleString()}! Financial score boosted.`,
                    type: "success",
                    timestamp: new Date().toISOString(),
                    read: false
                });

            } else if (decision === "bought_early") {
                showToast("Bypass Alert", `Item purchased early. A penalty is applied to your spending score.`, "danger");

                notifs.unshift({
                    id: "nt-" + Date.now(),
                    title: `🚨 Cooldown Bypass: Purchased ${item.name}`,
                    message: `You bought ${item.name} costing ₹${item.cost.toLocaleString()} before the 24-hour waiting period completed. Try to wait next time.`,
                    type: "danger",
                    timestamp: new Date().toISOString(),
                    read: false
                });

                const txs = window.UPIDatabase.getTransactions();
                txs.unshift({
                    id: "tx-cd-" + Date.now(),
                    merchant: item.name + " (Impulsive)",
                    amount: item.cost,
                    category: "Shopping",
                    timestamp: new Date().toISOString(),
                    isNight: false,
                    isIncome: false
                });
                window.UPIDatabase.saveTransactions(txs);
            } else {
                showToast("Decision Registered", `Logged purchase of ${item.name} after wait timer completed.`, "primary");
                
                const txs = window.UPIDatabase.getTransactions();
                txs.unshift({
                    id: "tx-cd-" + Date.now(),
                    merchant: item.name + " (Planned)",
                    amount: item.cost,
                    category: "Shopping",
                    timestamp: new Date().toISOString(),
                    isNight: false,
                    isIncome: false
                });
                window.UPIDatabase.saveTransactions(txs);
            }

            window.UPIDatabase.saveNotifications(notifs);
            refreshUI();
        }
    }

    // RENDER: AI Coach Insights panel & Financial Score
    function renderAICoachPanel() {
        const scoreReport = window.UPICoach.calculateSpendingScore();
        
        document.getElementById("sidebar-score-val").textContent = scoreReport.total;
        document.getElementById("sidebar-score-fill").style.width = `${scoreReport.total}%`;
        document.getElementById("sidebar-score-status").textContent = scoreReport.rating;

        const radialText = document.getElementById("score-radial-number");
        if (radialText) {
            radialText.textContent = scoreReport.total;
            
            const gaugeFill = document.getElementById("radial-gauge-fill");
            const circumference = 314;
            const offset = circumference - (scoreReport.total / 100) * circumference;
            gaugeFill.style.strokeDashoffset = offset;

            const scoreColors = {
                excellent: "#10b981",
                avg: "#f59e0b",
                poor: "#ef4444"
            };
            gaugeFill.style.stroke = scoreColors[scoreReport.ratingClass] || "var(--primary)";
            document.getElementById("score-radial-tip").textContent = scoreReport.desc;
        }

        const scoreLargeVal = document.getElementById("score-large-val");
        if (scoreLargeVal) {
            scoreLargeVal.textContent = scoreReport.total;
            
            const badge = document.getElementById("score-rating-badge");
            badge.className = `score-rating-badge ${scoreReport.ratingClass}`;
            badge.textContent = scoreReport.rating;

            document.getElementById("score-large-desc").textContent = scoreReport.desc;

            document.getElementById("factor-budget-val").textContent = `+${scoreReport.breakdown.budgetPts} pts`;
            document.getElementById("factor-budget-fill").style.width = `${scoreReport.breakdown.budget}%`;

            document.getElementById("factor-impulse-val").textContent = `${scoreReport.breakdown.impulsePts - 30} pts`;
            document.getElementById("factor-impulse-fill").style.width = `${scoreReport.breakdown.impulse}%`;

            document.getElementById("factor-consistency-val").textContent = `${scoreReport.breakdown.consistencyPts - 20} pts`;
            document.getElementById("factor-consistency-fill").style.width = `${scoreReport.breakdown.consistency}%`;

            document.getElementById("factor-challenge-val").textContent = `+${scoreReport.breakdown.challengePts} pts`;
            document.getElementById("factor-challenge-fill").style.width = `${scoreReport.breakdown.challenge}%`;
        }

        const explainerContainer = document.getElementById("ai-explainer-container");
        if (explainerContainer) {
            explainerContainer.innerHTML = window.UPICoach.generateHabitExplanation();
        }

        const dbAiTip = document.getElementById("dashboard-ai-tip");
        if (dbAiTip) {
            const txs = window.UPIDatabase.getTransactions();
            const expensesOnly = txs.filter(t => !t.isIncome);
            if (expensesOnly.length > 0) {
                const catTotals = {};
                expensesOnly.forEach(t => { catTotals[t.category] = (catTotals[t.category] || 0) + t.amount; });
                let topCat = "Food";
                let max = 0;
                Object.entries(catTotals).forEach(([c, a]) => { if (a > max) { max = a; topCat = c; } });

                dbAiTip.innerHTML = `Your spending on <strong>${topCat}</strong> is currently your highest category. Take the <strong>${topCat} Challenges</strong> on the coach tab to improve your score!`;
            } else {
                dbAiTip.textContent = "Welcome! Add or simulate your first UPI transaction to trigger AI habit analysis.";
            }
        }

        const adviceContainer = document.getElementById("custom-advice-container");
        if (adviceContainer) {
            adviceContainer.innerHTML = "";
            const adviceList = window.UPICoach.getCustomAdvice();
            
            adviceList.forEach(adv => {
                const card = document.createElement("div");
                card.className = `advice-card-item ${adv.highPriority ? 'high-priority' : ''}`;
                
                const icon = adv.icon || "lightbulb";

                card.innerHTML = `
                    <div class="advice-card-icon">
                        <i data-lucide="${icon}"></i>
                    </div>
                    <div class="advice-card-text">
                        <h5>${adv.title}</h5>
                        <p>${adv.text}</p>
                    </div>
                `;
                adviceContainer.appendChild(card);
            });
        }
    }

    // ==========================================================================
    // INITIAL APP INITIALIZATION CALLS
    // ==========================================================================
    refreshUI();
    window.UPICharts.buildAll();
});
