/* ==========================================================================
   Smart UPI Expense Analyzer & Money Saving Assistant - Seed Data & DB
<<<<<<< HEAD
   Per-User Data Isolation: Each user's data is stored with a unique prefix.
   ========================================================================== */

(function() {
    // -----------------------------------------------------------------------
    // Helper: Get current user's storage key prefix from session
    // -----------------------------------------------------------------------
    function getUserPrefix() {
        const userId = localStorage.getItem("upi_current_user_id");
        return userId ? "upi_" + userId + "_" : "upi_guest_";
    }

    function getKey(name) {
        return getUserPrefix() + name;
    }

    // -----------------------------------------------------------------------
    // Default data for NEW users (fresh / empty start)
    // -----------------------------------------------------------------------

    // Default Budgets (every user starts with reasonable defaults)
=======
   ========================================================================== */

(function() {
    const now = new Date();

    // Helper to subtract days and set hours
    function getPastDate(daysAgo, hour, minute) {
        const d = new Date(now);
        d.setDate(now.getDate() - daysAgo);
        d.setHours(hour || 12, minute || 0, 0, 0);
        return d.toISOString();
    }

    // Default Seed Transactions (Rolling 30 days)
    const DEFAULT_TRANSACTIONS = [
        { id: "tx-1", merchant: "Salary Credited", amount: 45000, category: "Income", timestamp: getPastDate(28, 10, 0), isNight: false, isIncome: true },
        
        // Week 1 Expenses
        { id: "tx-2", merchant: "Zomato Delivery", amount: 420, category: "Food", timestamp: getPastDate(27, 13, 15), isNight: false },
        { id: "tx-3", merchant: "Uber Cab", amount: 280, category: "Travel", timestamp: getPastDate(26, 9, 30), isNight: false },
        { id: "tx-4", merchant: "Amazon India", amount: 1500, category: "Shopping", timestamp: getPastDate(25, 23, 10), isNight: true },
        { id: "tx-5", merchant: "Airtel Fiber Recharge", amount: 799, category: "Bills", timestamp: getPastDate(25, 11, 0), isNight: false },
        { id: "tx-6", merchant: "Starbucks Coffee", amount: 220, category: "Food", timestamp: getPastDate(24, 15, 45), isNight: false },
        { id: "tx-7", merchant: "PVR Cinemas", amount: 650, category: "Entertainment", timestamp: getPastDate(23, 19, 0), isNight: false },
        { id: "tx-8", merchant: "Apollo Pharmacy", amount: 350, category: "Medical", timestamp: getPastDate(22, 10, 30), isNight: false },
        
        // Week 2 Expenses
        { id: "tx-9", merchant: "Swiggy Food", amount: 310, category: "Food", timestamp: getPastDate(20, 14, 0), isNight: false },
        { id: "tx-10", merchant: "HP Petrol Pump", amount: 1200, category: "Travel", timestamp: getPastDate(19, 8, 45), isNight: false },
        { id: "tx-11", merchant: "Udemy Course", amount: 499, category: "Education", timestamp: getPastDate(18, 16, 20), isNight: false },
        { id: "tx-12", merchant: "Flipkart Order", amount: 2450, category: "Shopping", timestamp: getPastDate(17, 23, 55), isNight: true },
        { id: "tx-13", merchant: "Netflix Premium", amount: 649, category: "Entertainment", timestamp: getPastDate(16, 6, 0), isNight: false },
        { id: "tx-14", merchant: "BESCOM Electricity Bill", amount: 1420, category: "Bills", timestamp: getPastDate(15, 12, 15), isNight: false },
        
        // Week 3 Expenses
        { id: "tx-15", merchant: "Zomato Delivery", amount: 380, category: "Food", timestamp: getPastDate(13, 21, 30), isNight: false },
        { id: "tx-16", merchant: "Uber Auto", amount: 120, category: "Travel", timestamp: getPastDate(12, 18, 10), isNight: false },
        { id: "tx-17", merchant: "Starbucks Coffee", amount: 180, category: "Food", timestamp: getPastDate(11, 10, 15), isNight: false },
        { id: "tx-18", merchant: "BookMyShow Play", amount: 900, category: "Entertainment", timestamp: getPastDate(10, 16, 0), isNight: false },
        { id: "tx-19", merchant: "Local Chemist", amount: 150, category: "Medical", timestamp: getPastDate(9, 20, 5), isNight: false },
        { id: "tx-20", merchant: "Amazon Shopping", amount: 890, category: "Shopping", timestamp: getPastDate(8, 14, 45), isNight: false },
        
        // Week 4 Expenses (Close to current date)
        { id: "tx-21", merchant: "Swiggy Food", amount: 350, category: "Food", timestamp: getPastDate(6, 12, 30), isNight: false },
        { id: "tx-22", merchant: "Zara Fashion", amount: 3200, category: "Shopping", timestamp: getPastDate(5, 23, 40), isNight: true },
        { id: "tx-23", merchant: "Uber Ride", amount: 310, category: "Travel", timestamp: getPastDate(4, 9, 15), isNight: false },
        { id: "tx-24", merchant: "Jio Mobile Recharge", amount: 299, category: "Bills", timestamp: getPastDate(3, 11, 30), isNight: false },
        { id: "tx-25", merchant: "Starbucks Coffee", amount: 180, category: "Food", timestamp: getPastDate(2, 16, 50), isNight: false },
        { id: "tx-26", merchant: "Swiggy Instamart", amount: 940, category: "Food", timestamp: getPastDate(1, 19, 10), isNight: false },
        { id: "tx-27", merchant: "Tea Stall", amount: 40, category: "Food", timestamp: getPastDate(0, 11, 0), isNight: false } // Today noon
    ];

    // Default Budgets Setting
>>>>>>> 496c18f464d1845877ed92c0f66d19bd0d2e6dc1
    const DEFAULT_BUDGETS = {
        monthly: 20000,
        daily: 500,
        categories: {
            Food: 5000,
            Shopping: 5000,
            Travel: 3000,
            Bills: 4000,
            Entertainment: 2000,
            Education: 2000,
            Medical: 1000,
            Others: 1000
        }
    };

<<<<<<< HEAD
    // Default Weekly Savings Challenges (app features, same for all users)
    const DEFAULT_CHALLENGES = [
        { id: "ch-1", name: "No Swiggy/Zomato Week", desc: "Skip online food orders for 7 days to cook at home.", reward: 15, status: "active" },
        { id: "ch-2", name: "Spend Under ₹300 Today", desc: "Limit all UPI transactions today below ₹300.", reward: 10, status: "active" },
        { id: "ch-3", name: "Shopping Freeze", desc: "Lock out shopping apps. Buy only absolute essentials.", reward: 20, status: "active" },
        { id: "ch-4", name: "Carry Water Bottle Challenge", desc: "Stop buying ₹20 bottled drinks on rides.", reward: 5, status: "active" }
    ];

    // Welcome notification for brand new users
    const WELCOME_NOTIFICATION = [
        {
            id: "nt-welcome",
            title: "🎉 Welcome to UPISaver!",
            message: "Your account is ready! Start adding transactions to track your spending and get smart saving tips.",
            type: "success",
            timestamp: new Date().toISOString(),
            read: false
        }
    ];

    // -----------------------------------------------------------------------
    // User Registry (global, not per-user)
    // Stores: [{id, username, email, mobile, avatarText, provider, createdAt}]
    // -----------------------------------------------------------------------
    window.UPIUserRegistry = {
        getAll: function() {
            const raw = localStorage.getItem("upi_registered_users");
            return raw ? JSON.parse(raw) : [];
        },
        save: function(users) {
            localStorage.setItem("upi_registered_users", JSON.stringify(users));
        },
        findByEmail: function(email) {
            return this.getAll().find(u => u.email.toLowerCase() === email.toLowerCase());
        },
        register: function(profile) {
            const users = this.getAll();
            // Check duplicate email
            if (users.find(u => u.email.toLowerCase() === profile.email.toLowerCase())) {
                return { success: false, error: "An account with this email already exists. Please login instead." };
            }
            // Generate unique user ID from email
            const userId = profile.email.toLowerCase().replace(/[^a-z0-9]/g, "_");
            const newUser = {
                id: userId,
                username: profile.username,
                email: profile.email,
                mobile: profile.mobile,
                avatarText: profile.avatarText,
                provider: profile.provider || "credentials",
                createdAt: new Date().toISOString()
            };
            users.push(newUser);
            this.save(users);
            return { success: true, user: newUser };
        },
        login: function(email, mobile) {
            const user = this.findByEmail(email);
            if (!user) {
                return { success: false, error: "No account found with this email. Please register first." };
            }
            // Verify mobile number matches (strip spaces and + for comparison)
            const cleanMobile = mobile.replace(/[\s\+\-]/g, "");
            const storedMobile = user.mobile.replace(/[\s\+\-]/g, "");
            if (cleanMobile !== storedMobile) {
                return { success: false, error: "Mobile number does not match. Please check and try again." };
            }
            return { success: true, user: user };
        }
    };

    // -----------------------------------------------------------------------
    // DB Wrapper: All keys scoped to current logged-in user
    // -----------------------------------------------------------------------
    window.UPIDatabase = {
        getTransactions: function() {
            const key = getKey("transactions");
            if (!localStorage.getItem(key)) {
                // New user = empty transaction list (fresh start)
                localStorage.setItem(key, JSON.stringify([]));
            }
            return JSON.parse(localStorage.getItem(key));
        },
        saveTransactions: function(txs) {
            localStorage.setItem(getKey("transactions"), JSON.stringify(txs));
            window.dispatchEvent(new Event('upiDataUpdated'));
        },

        getBudgets: function() {
            const key = getKey("budgets");
            if (!localStorage.getItem(key)) {
                localStorage.setItem(key, JSON.stringify(DEFAULT_BUDGETS));
            }
            return JSON.parse(localStorage.getItem(key));
        },
        saveBudgets: function(budgets) {
            localStorage.setItem(getKey("budgets"), JSON.stringify(budgets));
            window.dispatchEvent(new Event('upiDataUpdated'));
        },

        getGoals: function() {
            const key = getKey("goals");
            if (!localStorage.getItem(key)) {
                // New user = no goals (fresh start)
                localStorage.setItem(key, JSON.stringify([]));
            }
            return JSON.parse(localStorage.getItem(key));
        },
        saveGoals: function(goals) {
            localStorage.setItem(getKey("goals"), JSON.stringify(goals));
            window.dispatchEvent(new Event('upiDataUpdated'));
        },

        getChallenges: function() {
            const key = getKey("challenges");
            if (!localStorage.getItem(key)) {
                localStorage.setItem(key, JSON.stringify(DEFAULT_CHALLENGES));
            }
            return JSON.parse(localStorage.getItem(key));
        },
        saveChallenges: function(challenges) {
            localStorage.setItem(getKey("challenges"), JSON.stringify(challenges));
            window.dispatchEvent(new Event('upiDataUpdated'));
        },

        getCooldownItems: function() {
            const key = getKey("cooldown_items");
            if (!localStorage.getItem(key)) {
                // New user = no cooldown items (fresh start)
                localStorage.setItem(key, JSON.stringify([]));
            }
            return JSON.parse(localStorage.getItem(key));
        },
        saveCooldownItems: function(items) {
            localStorage.setItem(getKey("cooldown_items"), JSON.stringify(items));
            window.dispatchEvent(new Event('upiDataUpdated'));
        },

        getNotifications: function() {
            const key = getKey("notifications");
            if (!localStorage.getItem(key)) {
                localStorage.setItem(key, JSON.stringify(WELCOME_NOTIFICATION));
            }
            return JSON.parse(localStorage.getItem(key));
        },
        saveNotifications: function(notifs) {
            localStorage.setItem(getKey("notifications"), JSON.stringify(notifs));
            window.dispatchEvent(new Event('upiNotificationsUpdated'));
        },

        clearAllData: function() {
            localStorage.removeItem(getKey("transactions"));
            localStorage.removeItem(getKey("budgets"));
            localStorage.removeItem(getKey("goals"));
            localStorage.removeItem(getKey("challenges"));
            localStorage.removeItem(getKey("cooldown_items"));
            localStorage.removeItem(getKey("notifications"));
            // Reload fresh defaults for this user
=======
    // Default Goal Planner
    const DEFAULT_GOALS = [
        { id: "goal-1", name: "High-End Student Laptop", target: 60000, current: 18000, timeframe: 6, createdAt: getPastDate(15, 12, 0) }
    ];

    // Default Weekly Savings Challenges
    const DEFAULT_CHALLENGES = [
        { id: "ch-1", name: "No Swiggy/Zomato Week", desc: "Skip online food orders for 7 days to cook at home.", reward: 15, status: "joined" },
        { id: "ch-2", name: "Spend Under ₹300 Today", desc: "Limit all UPI transactions today below ₹300.", reward: 10, status: "active" },
        { id: "ch-3", name: "Shopping Freeze", desc: "Lock out shopping apps. Buy only absolute essentials.", reward: 20, status: "active" },
        { id: "ch-4", name: "Carry Water Bottle Challenge", desc: "Stop buying ₹20 bottled drinks on rides.", reward: 5, status: "completed" }
    ];

    // Default Impulse Buy items with time ticking down
    const DEFAULT_COOLDOWN_ITEMS = [
        // Expired cooldown (item is unlocked to purchase or ignore)
        { id: "cd-1", name: "Mechanical Gaming Keyboard", cost: 4500, createdAt: getPastDate(2, 10, 0), timeLimitMs: 24 * 60 * 60 * 1000, decision: "pending" },
        // Active ticking cooldown (7 hours ago, 17 hours left)
        { id: "cd-2", name: "Wireless ANC Headphones", cost: 9500, createdAt: new Date(Date.now() - 7 * 60 * 60 * 1000).toISOString(), timeLimitMs: 24 * 60 * 60 * 1000, decision: "pending" }
    ];

    // Default notifications feed
    const DEFAULT_NOTIFICATIONS = [
        {
            id: "nt-1",
            title: "Welcome to UPISaver!",
            message: "Setup your budgets and start simulating transactions to analyze your habits.",
            type: "success",
            timestamp: getPastDate(2, 10, 0),
            read: true
        },
        {
            id: "nt-2",
            title: "💡 Smart Suggestion: Food Ordering",
            message: "You've spent ₹770 on food delivery this week. Cooking at home could save around ₹450.",
            type: "info",
            timestamp: getPastDate(1, 14, 0),
            read: false
        },
        {
            id: "nt-3",
            title: "⚠️ High Spending Alert (Zara)",
            message: "A late night purchase of ₹3,200 was detected. Consider waiting 24 hours to reduce impulse shopping.",
            type: "warning",
            timestamp: getPastDate(5, 23, 40),
            read: true
        }
    ];

    // DB Wrapper object attached to global window scope
    window.UPIDatabase = {
        getTransactions: function() {
            if (!localStorage.getItem("upi_transactions")) {
                localStorage.setItem("upi_transactions", JSON.stringify(DEFAULT_TRANSACTIONS));
            }
            return JSON.parse(localStorage.getItem("upi_transactions"));
        },
        saveTransactions: function(txs) {
            localStorage.setItem("upi_transactions", JSON.stringify(txs));
            // Trigger storage event manually to notify charts/UI
            window.dispatchEvent(new Event('upiDataUpdated'));
        },
        getBudgets: function() {
            if (!localStorage.getItem("upi_budgets")) {
                localStorage.setItem("upi_budgets", JSON.stringify(DEFAULT_BUDGETS));
            }
            return JSON.parse(localStorage.getItem("upi_budgets"));
        },
        saveBudgets: function(budgets) {
            localStorage.setItem("upi_budgets", JSON.stringify(budgets));
            window.dispatchEvent(new Event('upiDataUpdated'));
        },
        getGoals: function() {
            if (!localStorage.getItem("upi_goals")) {
                localStorage.setItem("upi_goals", JSON.stringify(DEFAULT_GOALS));
            }
            return JSON.parse(localStorage.getItem("upi_goals"));
        },
        saveGoals: function(goals) {
            localStorage.setItem("upi_goals", JSON.stringify(goals));
            window.dispatchEvent(new Event('upiDataUpdated'));
        },
        getChallenges: function() {
            if (!localStorage.getItem("upi_challenges")) {
                localStorage.setItem("upi_challenges", JSON.stringify(DEFAULT_CHALLENGES));
            }
            return JSON.parse(localStorage.getItem("upi_challenges"));
        },
        saveChallenges: function(challenges) {
            localStorage.setItem("upi_challenges", JSON.stringify(challenges));
            window.dispatchEvent(new Event('upiDataUpdated'));
        },
        getCooldownItems: function() {
            if (!localStorage.getItem("upi_cooldown_items")) {
                localStorage.setItem("upi_cooldown_items", JSON.stringify(DEFAULT_COOLDOWN_ITEMS));
            }
            return JSON.parse(localStorage.getItem("upi_cooldown_items"));
        },
        saveCooldownItems: function(items) {
            localStorage.setItem("upi_cooldown_items", JSON.stringify(items));
            window.dispatchEvent(new Event('upiDataUpdated'));
        },
        getNotifications: function() {
            if (!localStorage.getItem("upi_notifications")) {
                localStorage.setItem("upi_notifications", JSON.stringify(DEFAULT_NOTIFICATIONS));
            }
            return JSON.parse(localStorage.getItem("upi_notifications"));
        },
        saveNotifications: function(notifs) {
            localStorage.setItem("upi_notifications", JSON.stringify(notifs));
            // Trigger specialized event for notification rendering
            window.dispatchEvent(new Event('upiNotificationsUpdated'));
        },
        clearAllData: function() {
            localStorage.removeItem("upi_transactions");
            localStorage.removeItem("upi_budgets");
            localStorage.removeItem("upi_goals");
            localStorage.removeItem("upi_challenges");
            localStorage.removeItem("upi_cooldown_items");
            localStorage.removeItem("upi_notifications");
            // Reload seed data
>>>>>>> 496c18f464d1845877ed92c0f66d19bd0d2e6dc1
            this.getTransactions();
            this.getBudgets();
            this.getGoals();
            this.getChallenges();
            this.getCooldownItems();
            this.getNotifications();
            window.dispatchEvent(new Event('upiDataUpdated'));
            window.dispatchEvent(new Event('upiNotificationsUpdated'));
        }
    };

<<<<<<< HEAD
    // Initialize database entries for current user on page load
=======
    // Initialize all database entries on load
>>>>>>> 496c18f464d1845877ed92c0f66d19bd0d2e6dc1
    window.UPIDatabase.getTransactions();
    window.UPIDatabase.getBudgets();
    window.UPIDatabase.getGoals();
    window.UPIDatabase.getChallenges();
    window.UPIDatabase.getCooldownItems();
    window.UPIDatabase.getNotifications();
})();
