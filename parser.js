/* ==========================================================================
   Smart UPI Expense Analyzer & Money Saving Assistant - SMS Parser
   ========================================================================== */

(function() {
    // Keywords mapping for auto-categorization
    const CATEGORY_KEYWORDS = {
        Food: ['swiggy', 'zomato', 'starbucks', 'coffee', 'mcdonald', 'kfc', 'burger', 'restaurant', 'pizza', 'dominos', 'cafe', 'tea', 'bakery', 'eats', 'dhaba', 'hotel', 'instamart', 'blinkit', 'zepto', 'chai', 'food', 'canteen'],
        Shopping: ['amazon', 'flipkart', 'myntra', 'zara', 'nykaa', 'decathlon', 'clothing', 'fashion', 'shoes', 'dress', 'apparel', 'mall', 'supermarket', 'mart', 'grocery', 'groceries', 'store', 'retail', 'shopper'],
        Travel: ['uber', 'ola', 'rapido', 'cab', 'taxi', 'petrol', 'fuel', 'metro', 'irctc', 'railways', 'flight', 'airline', 'make-my-trip', 'bus', 'auto', 'shell', 'cng', 'transport'],
        Bills: ['airtel', 'jio', 'recharge', 'bescom', 'electricity', 'gas', 'water', 'wifi', 'broadband', 'postpaid', 'bill', 'dth', 'tata play', 'insurance', 'tax', 'mobile'],
        Entertainment: ['netflix', 'spotify', 'movie', 'cinemas', 'pvr', 'bookmyshow', 'ticket', 'prime video', 'youtube premium', 'game', 'steam', 'playstation', 'pubg', 'disney', 'hotstar', 'club', 'bar', 'pub'],
        Education: ['udemy', 'coursera', 'college', 'tuition', 'books', 'stationery', 'school', 'academy', 'course', 'exam', 'fees', 'library'],
        Medical: ['apollo', 'pharmeasy', 'hospital', 'chemist', 'medical', 'pharmacy', 'clinic', 'doctor', 'medplus', 'dentist', 'labs', 'healthcare', 'care']
    };

    // Clean reference IDs, VPA handles, bank jargon
    function cleanMerchantName(name) {
        if (!name) return "Unknown Merchant";
        
        let cleaned = name.trim();

        // 1. If it's an email VPA handle (e.g. Swiggy@upi, starbucks@ybl, etc.)
        if (cleaned.includes('@')) {
            cleaned = cleaned.split('@')[0];
        }
        
        // 2. Remove transaction descriptors / bank abbreviations
        // e.g. "Ref-128374", "A/c 123", "UPI-Zomato", "VPA-xxx"
        const jargonPatterns = [
            /(?:Ref|A\/c|RefNo|VPA|UPI|No|Txn|Id|ID|Code)\.?\s*[0-9a-zA-Z]*/gi,
            /\b(?:to|from|by|sent|paid|towards|transferred)\b/gi,
            /[^a-zA-Z0-9\s]/g // remove special characters
        ];
        
        jargonPatterns.forEach(pattern => {
            cleaned = cleaned.replace(pattern, ' ');
        });

        // 3. Trim extra spaces
        cleaned = cleaned.replace(/\s+/g, ' ').trim();
        
        // 4. Title Case Capitalization
        cleaned = cleaned.split(' ')
            .filter(word => word.length > 0)
            .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
            .join(' ');

        // Fallbacks
        if (!cleaned || cleaned.length < 2) {
            return "UPI Merchant";
        }
        
        // Shorten long strings
        if (cleaned.length > 25) {
            cleaned = cleaned.substring(0, 25) + "...";
        }

        return cleaned;
    }

    // Main Parser Engine
    window.UPIParser = {
        parseSMS: function(smsText) {
            if (!smsText || typeof smsText !== 'string') return null;
            
            // Normalize spaces and line endings
            const normalizedText = smsText.replace(/[\n\r]+/g, ' ').replace(/\s+/g, ' ').trim();
            
            let amount = null;
            let merchant = "";
            let isIncome = false;

            // 1. Extract Amount: Matches ₹100, Rs.100.50, INR 1,500, Rs 500, etc.
            const amtRegex = /(?:Rs\.?|INR|₹)\s*([\d,]+(?:\.\d{1,2})?)/i;
            const amtMatch = normalizedText.match(amtRegex);
            if (amtMatch) {
                // Remove commas for parsing float
                amount = parseFloat(amtMatch[1].replace(/,/g, ''));
            } else {
                // Secondary check: look for "debited/sent/credited of X"
                const fallbackAmtRegex = /(?:debited|sent|paid|received|credited|spent)\s*(?:by|of|rs\.?|₹)?\s*([\d,]+(?:\.\d{1,2})?)/i;
                const fallbackMatch = normalizedText.match(fallbackAmtRegex);
                if (fallbackMatch) {
                    amount = parseFloat(fallbackMatch[1].replace(/,/g, ''));
                }
            }

            if (!amount || isNaN(amount)) {
                return null; // Return null if amount is not found
            }

            // 2. Identify if transaction is Credit/Income
            // e.g. "credited", "received", "deposited", "added to a/c"
            const incomeKeywords = /(?:credited|received|deposited|added to|refunded)/i;
            if (incomeKeywords.test(normalizedText)) {
                isIncome = true;
            }

            // 3. Extract Merchant Name
            // Patterns:
            // "to [Merchant] on/via/Ref..."
            // "sent [Merchant]"
            // "debited to [Merchant]"
            // "received from [Merchant]"
            // "credited by [Merchant]"
            
            if (isIncome) {
                const fromRegex = /(?:received from|credited by|from)\s+([A-Za-z0-9\s\.\-_&'@]{3,35})(?:\s+on|\s+via|\s+Ref|\s+RefNo|\s+at|\.|\s*$)/i;
                const fromMatch = normalizedText.match(fromRegex);
                if (fromMatch) {
                    merchant = fromMatch[1];
                } else {
                    merchant = "Salary/Income Source";
                }
            } else {
                // Debit patterns
                const toRegex = /(?:to|paid|towards|sent|spent on)\s+([A-Za-z0-9\s\.\-_&'@]{3,35})(?:\s+on|\s+via|\s+Ref|\s+RefNo|\s+at|\.|\s*$)/i;
                const toMatch = normalizedText.match(toRegex);
                if (toMatch) {
                    merchant = toMatch[1];
                } else {
                    // Look for after merchant keyword: e.g. "at [Merchant]"
                    const atRegex = /(?:at)\s+([A-Za-z0-9\s\.\-_&'@]{3,35})(?:\s+on|\s+via|\s+Ref|\s+RefNo|\s+at|\.|\s*$)/i;
                    const atMatch = normalizedText.match(atRegex);
                    if (atMatch) {
                        merchant = atMatch[1];
                    } else {
                        merchant = "UPI Merchant";
                    }
                }
            }

            // Clean merchant text
            merchant = cleanMerchantName(merchant);

            // 4. Auto-categorize
            const category = this.categorize(merchant, isIncome);

            // 5. Late Night detection (check current local hour, or check if SMS mentions a late time or simulated night flag)
            // Default: check if hour is between 10 PM (22:00) and 4 AM (04:00)
            const currentHour = new Date().getHours();
            const isNight = (currentHour >= 22 || currentHour < 4);

            return {
                merchant: merchant,
                amount: amount,
                category: category,
                isIncome: isIncome,
                isNight: isNight,
                timestamp: new Date().toISOString()
            };
        },

        categorize: function(merchantName, isIncome = false) {
            if (isIncome) return "Income";
            
            const lowerMerchant = merchantName.toLowerCase();
            
            for (const [category, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
                for (const keyword of keywords) {
                    if (lowerMerchant.includes(keyword)) {
                        return category;
                    }
                }
            }
            
            return "Others";
        }
    };
})();
