
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

export const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);
};
