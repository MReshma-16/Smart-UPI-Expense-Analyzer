/* ==========================================================================
   Smart UPI Expense Analyzer & Money Saving Assistant - Seed Data & DB
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

    // Initialize database entries for current user on page load
    window.UPIDatabase.getTransactions();
    window.UPIDatabase.getBudgets();
    window.UPIDatabase.getGoals();
    window.UPIDatabase.getChallenges();
    window.UPIDatabase.getCooldownItems();
    window.UPIDatabase.getNotifications();
})();
