import { generateMockData, formatCurrency } from './mockData.js';

export function initAiBot() {
    // 1. Inject Styles
    const style = document.createElement('style');
    style.textContent = `
        #ai-bot-fab {
            position: fixed;
            bottom: 24px;
            right: 24px;
            width: 60px;
            height: 60px;
            border-radius: 50%;
            background: linear-gradient(135deg, #00f3ff, #7b2cbf);
            box-shadow: 0 4px 15px rgba(0, 243, 255, 0.4);
            cursor: pointer;
            z-index: 9999;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: transform 0.2s, box-shadow 0.2s;
        }
        #ai-bot-fab:hover {
            transform: scale(1.05);
            box-shadow: 0 6px 20px rgba(0, 243, 255, 0.6);
        }
        #ai-bot-fab svg { color: white; width: 32px; height: 32px; }
        
        #ai-bot-window {
            position: fixed;
            bottom: 100px;
            right: 24px;
            width: 380px;
            height: 600px;
            background: rgba(15, 23, 42, 0.95);
            backdrop-filter: blur(12px);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 16px;
            display: flex;
            flex-direction: column;
            box-shadow: 0 10px 40px rgba(0,0,0,0.5);
            z-index: 9998;
            transition: opacity 0.3s, transform 0.3s;
            transform-origin: bottom right;
            opacity: 0;
            transform: scale(0.9);
            pointer-events: none;
        }
        #ai-bot-window.open {
            opacity: 1;
            transform: scale(1);
            pointer-events: all;
        }
        
        /* Mobile adjustment */
        @media (max-width: 768px) {
            #ai-bot-window {
                width: 100%;
                height: 100%;
                bottom: 0;
                right: 0;
                border-radius: 0;
            }
        }

        .ai-header {
            padding: 16px;
            background: linear-gradient(90deg, rgba(0,243,255,0.1), transparent);
            border-bottom: 1px solid rgba(255,255,255,0.1);
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        .ai-messages {
            flex: 1;
            padding: 16px;
            overflow-y: auto;
            display: flex;
            flex-direction: column;
            gap: 12px;
        }
        .ai-input-area {
            padding: 16px;
            border-top: 1px solid rgba(255,255,255,0.1);
            display: flex;
            gap: 8px;
        }
        .ai-input {
            flex: 1;
            background: rgba(0,0,0,0.3);
            border: 1px solid rgba(255,255,255,0.2);
            border-radius: 8px;
            padding: 10px;
            color: white;
            outline: none;
            font-size: 14px;
        }
        .ai-input:focus { border-color: #00f3ff; }
        
        .msg {
            max-width: 85%;
            padding: 10px 14px;
            border-radius: 12px;
            font-size: 14px;
            line-height: 1.4;
        }
        .msg.bot {
            background: rgba(255,255,255,0.1);
            color: #ccc;
            align-self: flex-start;
            border-bottom-left-radius: 2px;
        }
        .msg.user {
            background: rgba(0, 243, 255, 0.2);
            color: white;
            align-self: flex-end;
            border-bottom-right-radius: 2px;
            border: 1px solid rgba(0, 243, 255, 0.3);
        }
        .typing-indicator span {
            display: inline-block;
            width: 6px;
            height: 6px;
            background: #aaa;
            border-radius: 50%;
            animation: bounce 1.4s infinite ease-in-out both;
            margin: 0 1px;
        }
        @keyframes bounce { 0%, 80%, 100% { transform: scale(0); } 40% { transform: scale(1); } }
        .typing-indicator span:nth-child(1) { animation-delay: -0.32s; }
        .typing-indicator span:nth-child(2) { animation-delay: -0.16s; }
    `;
    document.head.appendChild(style);

    // 2. Inject HTML
    const fab = document.createElement('div');
    fab.id = 'ai-bot-fab';
    fab.innerHTML = `<i data-lucide="bot-message-square"></i>`; // Will need to re-run lucide
    document.body.appendChild(fab);

    const windowDiv = document.createElement('div');
    windowDiv.id = 'ai-bot-window';
    windowDiv.innerHTML = `
        <div class="ai-header">
            <div class="flex items-center">
                <div class="w-8 h-8 rounded-full bg-gradient-to-tr from-neon-cyan to-deep-purple flex items-center justify-center mr-3">
                    <i data-lucide="bot" class="w-4 h-4 text-white"></i>
                </div>
                <div>
                    <h3 class="font-bold text-white text-sm">Spendshark Agent</h3>
                    <p class="text-[10px] text-green-400 flex items-center"><span class="w-1.5 h-1.5 bg-green-400 rounded-full mr-1"></span> Online</p>
                </div>
            </div>
            <button id="ai-close-btn" class="text-gray-400 hover:text-white"><i data-lucide="x" class="w-5 h-5"></i></button>
        </div>
        <div class="ai-messages" id="ai-messages">
            <div class="msg bot">
                Hello! I'm your AI finance assistant. I can explain suspicious transactions, analyze vendor history, or help you investigate anomalies.<br><br>
                Try asking: <i>"Why was invoice INV-1042 flagged?"</i>
            </div>
        </div>
        <div class="ai-input-area">
            <input type="text" id="ai-input" class="ai-input" placeholder="Ask me anything..." autocomplete="off">
            <button id="ai-send-btn" class="p-2 bg-neon-cyan/20 text-neon-cyan rounded-lg hover:bg-neon-cyan/40 transition-colors">
                <i data-lucide="send" class="w-5 h-5"></i>
            </button>
        </div>
    `;
    document.body.appendChild(windowDiv);

    // Re-init icons for the new elements
    if (window.lucide) window.lucide.createIcons();

    // 3. Logic & State
    const msgsContainer = document.getElementById('ai-messages');
    const input = document.getElementById('ai-input');
    const sendBtn = document.getElementById('ai-send-btn');
    const closeBtn = document.getElementById('ai-close-btn');

    // Load mock data for RAG
    const data = generateMockData();
    const invoices = data.invoices;
    const vendors = data.vendors;
    const predictions = data.predictions || []; // Might be undefined if not regen

    // Toggle Window
    let isOpen = false;
    const toggleChat = () => {
        isOpen = !isOpen;
        if (isOpen) windowDiv.classList.add('open');
        else windowDiv.classList.remove('open');
    };
    fab.addEventListener('click', toggleChat);
    closeBtn.addEventListener('click', toggleChat);

    // Chat Logic
    const addMessage = (text, type) => {
        const div = document.createElement('div');
        div.className = `msg ${type}`;
        div.innerHTML = text; // Allow HTML
        msgsContainer.appendChild(div);
        msgsContainer.scrollTop = msgsContainer.scrollHeight;
    };

    const processQuery = (query) => {
        const lowerQ = query.toLowerCase();

        // Simulating RAG Latency
        const typingDiv = document.createElement('div');
        typingDiv.className = 'msg bot typing-indicator';
        typingDiv.innerHTML = '<span></span><span></span><span></span>';
        msgsContainer.appendChild(typingDiv);
        msgsContainer.scrollTop = msgsContainer.scrollHeight;

        setTimeout(() => {
            msgsContainer.removeChild(typingDiv);
            let response = "I'm not sure about that. Try asking for a specific Invoice ID (e.g., INV-1005) or Vendor Name.";

            // 1. Invoice Lookup
            const invoiceMatch = query.match(/INV-\d+/i);
            if (invoiceMatch) {
                const invId = invoiceMatch[0].toUpperCase();
                const num = parseInt(invId.split('-')[1]);
                // Since mock IDs are randomized, lets find one loosely or exactly
                const invoice = invoices.find(i => i.id === invId);

                if (invoice) {
                    if (invoice.status === 'Suspected') {
                        response = `
                            <strong>Analysis for ${invoice.id}:</strong><br>
                            This invoice from <b>${invoice.vendor}</b> was flagged by the <b>${invoice.inspector}</b>.<br><br>
                            Reasoning:<br>
                            • Confidence Score: <b>${(invoice.confidence * 100).toFixed(1)}%</b><br>
                            • Risk Factor: High duplication probability with similar amount <b>${formatCurrency(invoice.amount)}</b>.<br>
                            • Action: Recommended to hold payment until manual review.
                        `;
                    } else {
                        response = `Invoice <b>${invoice.id}</b> for ${formatCurrency(invoice.amount)} is currently <b>Cleared</b>. No anomalies detected.`;
                    }
                } else {
                    response = `I couldn't find invoice <b>${invId}</b> in the recent dataset. It might be archived or hasn't been ingested yet.`;
                }
            }

            // 2. Vendor Analysis
            else if (vendors.some(v => lowerQ.includes(v.name.toLowerCase()))) {
                const vendor = vendors.find(v => lowerQ.includes(v.name.toLowerCase()));
                const activeInvoices = invoices.filter(i => i.vendor === vendor.name).length;
                const riskLevel = vendor.riskScore > 50 ? "High" : "Low";

                response = `
                    <strong>Vendor Profile: ${vendor.name}</strong><br>
                    • Trust Score: <b>${vendor.trustScore}/100</b><br>
                    • Risk Level: <b>${riskLevel}</b> (${vendor.riskScore})<br>
                    • Active Invoices: ${activeInvoices}<br>
                    • Total Spend: ${formatCurrency(vendor.totalSpend)}<br><br>
                    ${vendor.riskScore > 80 ? "⚠️ This vendor has a history of billing irregularities." : "✅ This vendor is generally reliable."}
                `;
            }

            // 3. General "Help"
            else if (lowerQ.includes('help') || lowerQ.includes('what can you do')) {
                response = "I can analyze transaction risk, look up specific invoices by ID, and summarize vendor health. Try asking 'Is McKesson risky?' or 'Check INV-1020'.";
            }

            addMessage(response, 'bot');
        }, 800 + Math.random() * 1000); // 0.8s - 1.8s delay
    };

    const handleSend = () => {
        const text = input.value.trim();
        if (!text) return;

        addMessage(text, 'user');
        input.value = '';
        processQuery(text);
    };

    sendBtn.addEventListener('click', handleSend);
    input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleSend();
    });
}
