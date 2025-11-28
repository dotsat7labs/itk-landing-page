
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

    return { invoices, vendors, inspectors };
};

export const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);
};
