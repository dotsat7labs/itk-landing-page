
// Mock Data Generator

const COMPANIES = ['Children\'s Hospital', 'UnityPoint Health', 'Virginia Health', 'National Fuel', 'Apparel Retailer'];
const VENDORS = ['McKesson', 'Cardinal Health', 'Medline', 'Stryker', 'Johnson & Johnson', 'Siemens Healthineers', 'GE Healthcare', 'Philips', 'Baxter', 'Boston Scientific'];
const INSPECTORS = ['Duplicate Detector', 'Anomaly Hunter', 'Fraud Watchdog', 'Vendor Validator'];
const OPERATORS = ['Alice Smith', 'Bob Jones', 'Charlie Brown', 'Diana Prince'];

function randomDate(start, end) {
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

function randomCurrency(min, max) {
    return (Math.random() * (max - min) + min).toFixed(2);
}

export const generateMockData = () => {
    const invoices = [];
    const vendors = [];
    const inspectors = [];

    // Generate Vendors
    VENDORS.forEach((name, index) => {
        vendors.push({
            id: index + 1,
            name: name,
            status: Math.random() > 0.8 ? 'Inactive' : 'Active',
            riskScore: Math.floor(Math.random() * 100),
            trustScore: Math.floor(Math.random() * 100),
            totalSpend: randomCurrency(100000, 5000000),
            anomalies: Math.floor(Math.random() * 5)
        });
    });

    // Generate Invoices
    for (let i = 0; i < 200; i++) {
        const isSuspected = Math.random() > 0.9;
        const vendor = vendors[Math.floor(Math.random() * vendors.length)];
        const isFalsePositive = isSuspected && Math.random() > 0.7;

        invoices.push({
            id: `INV-${1000 + i}`,
            vendor: vendor.name,
            company: COMPANIES[Math.floor(Math.random() * COMPANIES.length)],
            amount: parseFloat(randomCurrency(100, 50000)),
            date: randomDate(new Date(2024, 0, 1), new Date()),
            status: isSuspected ? 'Suspected' : 'Cleared',
            inspector: isSuspected ? INSPECTORS[Math.floor(Math.random() * INSPECTORS.length)] : null,
            confidence: isSuspected ? (Math.random() * (0.99 - 0.7) + 0.7).toFixed(2) : null,
            operator: OPERATORS[Math.floor(Math.random() * OPERATORS.length)],
            duplicateScore: isSuspected ? Math.floor(Math.random() * (100 - 60) + 60) : Math.floor(Math.random() * 20),
            source: ['OCR', 'EDI', 'Manual'][Math.floor(Math.random() * 3)],
            resolutionTime: isSuspected ? Math.floor(Math.random() * 48) + 2 : null, // Hours
            isFalsePositive: isFalsePositive
        });
    }

    // Generate Inspector Stats
    INSPECTORS.forEach(name => {
        inspectors.push({
            name: name,
            detectedAmount: parseFloat(randomCurrency(50000, 500000)),
            falsePositives: Math.floor(Math.random() * 20),
            confirmedFraud: Math.floor(Math.random() * 50)
        });
    });

    // Generate Predictions
    const predictions = [];
    vendors.forEach(vendor => {
        // Generate monthly historical data (last 6 months)
        const history = [];
        const forecast = [];
        const monthNames = ['Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan'];

        let baseSpend = parseFloat(vendor.totalSpend) / 12; // Rough monthly average
        let trend = (Math.random() * 0.2) - 0.1; // -10% to +10% trend per month

        // History
        for (let i = 0; i < 6; i++) {
            let val = baseSpend * (1 + (trend * i)) + (Math.random() * baseSpend * 0.1); // add noise
            history.push(val);
        }

        // Forecast (Next 2 months)
        for (let i = 6; i < 8; i++) {
            let val = baseSpend * (1 + (trend * i));
            forecast.push(val);
        }

        // Generate Anomalies for specific vendors
        const alerts = [];
        if (vendor.riskScore > 80) {
            alerts.push({
                type: 'Spike',
                message: `Projected spend is 45% higher than historical average.`,
                severity: 'High'
            });
        }
        if (vendor.status === 'Active' && Math.random() > 0.8) {
            alerts.push({
                type: 'Off-Cycle',
                message: `Payment frequency deviation detected.`,
                severity: 'Medium'
            });
        }

        predictions.push({
            vendorId: vendor.id,
            vendorName: vendor.name,
            category: 'General', // Simplified
            history: history, // Last 6 months
            forecast: forecast, // Next 2 months
            confidenceLower: forecast.map(v => v * 0.9),
            confidenceUpper: forecast.map(v => v * 1.1),
            alerts: alerts
        });
    });

    return { invoices, vendors, inspectors, predictions };
};

export const generateVendorStats = (vendors) => {
    // 1. Executive KPIs
    const avgRiskScore = Math.floor(vendors.reduce((acc, v) => acc + v.riskScore, 0) / vendors.length);
    const highRiskVendors = vendors.filter(v => v.riskScore > 80);
    const highRiskCount = highRiskVendors.length;

    // Calculate total spend
    const totalSpend = vendors.reduce((acc, v) => acc + parseFloat(v.totalSpend), 0);
    const highRiskSpend = highRiskVendors.reduce((acc, v) => acc + parseFloat(v.totalSpend), 0);
    const percentSpendAtRisk = ((highRiskSpend / totalSpend) * 100).toFixed(1);

    // Derived Metrics (Simulated)
    const duplicateRate = 2.4; // %
    const totalVendorSavings = 1250000; // $1.25M

    // 2. Operational KPIs (Simulated Averages)
    const onboardingSla = 92; // %
    const invoiceQuality = 88; // %
    const disputeRate = 5.2; // %
    const contractCompliance = 94; // %
    const lateDeliveries = 12; // Count

    // 3. Chart Data Generation

    // Risk Classification (Donut)
    const riskCounts = {
        High: highRiskCount,
        Medium: vendors.filter(v => v.riskScore > 50 && v.riskScore <= 80).length,
        Low: vendors.filter(v => v.riskScore <= 50).length,
        New: Math.floor(Math.random() * 3) // Random small number
    };

    // Duplicate Rate by Vendor (Bar) - Top 5 Risky
    const topRiskyVendors = [...vendors].sort((a, b) => b.riskScore - a.riskScore).slice(0, 5);
    const duplicateRates = topRiskyVendors.map(v => ({
        name: v.name,
        rate: (Math.random() * 5 + 1).toFixed(1) // 1-6%
    }));

    // Vendor Savings (Bar)
    const vendorSavings = topRiskyVendors.map(v => ({
        name: v.name,
        amount: Math.floor(Math.random() * 100000 + 10000)
    }));

    // Invoice Error Types (Stacked Bar)
    const errorTypes = { // Random distribution
        'Missing PO': 35,
        'Tax ID Error': 20,
        'Currency Mismatch': 15,
        'Format Error': 30
    };

    // SLA Compliance Over Time (Line)
    const slaTrend = [85, 87, 86, 89, 90, 92, 91, 93, 94, 92, 95, 96];

    // Contract Compliance (Bar)
    const complianceData = topRiskyVendors.map(v => ({
        name: v.name,
        compliance: Math.floor(Math.random() * 20 + 80) // 80-100%
    }));

    return {
        avgRiskScore,
        highRiskCount,
        percentSpendAtRisk,
        duplicateRate,
        totalVendorSavings,
        onboardingSla,
        invoiceQuality,
        disputeRate,
        contractCompliance,
        lateDeliveries,
        riskCounts,
        duplicateRates,
        vendorSavings,
        errorTypes,
        slaTrend,
        complianceData,
        topRiskyVendors // For Scatter/Bubble and Heatmap
    };
};

export const generateRoiStats = () => {
    // Simulated ROI Data
    const totalPrevented = 4250000; // $4.25M
    const preventedCount = 142;
    const detectionRate = 0.94; // 94%
    const accuracy = 0.985; // 98.5%
    const avgValue = totalPrevented / preventedCount;

    // Monthly Savings (Last 12 Months)
    const monthlySavings = [320000, 340000, 310000, 380000, 360000, 410000, 390000, 420000, 400000, 450000, 430000, 480000];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    // Savings by Component
    const savingsByComponent = {
        'Machine Learning': 1800000,
        'Rule Engine': 1450000,
        'Recurring Pattern': 800000,
        'Manual Review': 200000
    };

    // Duplicate Types
    const duplicateTypes = {
        'Exact Match': 45,
        'Fuzzy Match': 30,
        'Recurring Pattern': 15,
        'Vendor Error': 10
    };

    return {
        totalPrevented,
        preventedCount,
        detectionRate,
        accuracy,
        avgValue,
        monthlySavings,
        months,
        savingsByComponent,
        duplicateTypes
    };
};

export const generateOperatorStats = () => {
    // Mock Operators
    const ops = [
        { name: 'Alice Smith', initials: 'AS' },
        { name: 'Bob Jones', initials: 'BJ' },
        { name: 'Charlie Brown', initials: 'CB' },
        { name: 'Diana Prince', initials: 'DP' },
        { name: 'Evan Wright', initials: 'EW' }
    ];

    const operators = ops.map(op => {
        const invoices = Math.floor(Math.random() * 500) + 1500; // 1500-2000
        const accuracy = (Math.random() * (99.9 - 95) + 95).toFixed(1);
        return {
            name: op.name,
            initials: op.initials,
            invoicesProcessed: invoices,
            valueProcessed: invoices * (Math.random() * 500 + 100),
            avgTime: Math.floor(Math.random() * 10) + 5, // 5-15 mins
            accuracy: accuracy,
            sla: Math.floor(Math.random() * (100 - 90) + 90),
            exceptions: Math.floor(invoices * ((100 - accuracy) / 100)),
            savings: Math.floor(Math.random() * 50000) + 10000
        };
    });

    // Aggregates
    const totalInvoices = operators.reduce((sum, op) => sum + op.invoicesProcessed, 0);
    const totalValueProcessed = operators.reduce((sum, op) => sum + op.valueProcessed, 0);
    const avgProcessingTime = Math.floor(operators.reduce((sum, op) => sum + op.avgTime, 0) / operators.length);
    const avgAccuracy = (operators.reduce((sum, op) => sum + parseFloat(op.accuracy), 0) / operators.length).toFixed(1);
    const slaCompliance = Math.floor(operators.reduce((sum, op) => sum + op.sla, 0) / operators.length);
    const duplicatesBlocked = 45; // Mock
    const invoicesPerHour = Math.floor(totalInvoices / (operators.length * 40)); // Weekly roughly

    // Exception Types
    const exceptionTypes = {
        'Missing PO': 40,
        'Price Mismatch': 30,
        'Duplicate': 20,
        'Vendor Unknown': 10
    };

    return {
        operators,
        totalInvoices,
        avgProcessingTime,
        avgAccuracy,
        slaCompliance,
        totalValueProcessed,
        exceptionRate: (100 - avgAccuracy).toFixed(1),
        reworkRate: 2.5,
        onTimeRate: 96,
        duplicatesBlocked,
        invoicesPerHour,
        exceptionTypes,
        slaTrend: [94, 95, 93, 96, 97]
    };
};

export const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);
};
