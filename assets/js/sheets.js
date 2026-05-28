// =============================================
//  WinStore Note — sheets.js
//  Google Sheets ဆီ ဒေတာပို့ပေးမည့် ကုဒ်
// =============================================

// ── ဒီ URL ကို သင့် Apps Script URL နဲ့ အစားထိုးပါ ──
const APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzLdowIHgh3AW2q4FZ4ikDbaHM-P1y5FHNSdHT_1I-JpM2LCl6agA8nkmvy2XwVMUAU/exec";

// =============================================
//  MAIN FUNCTION — Sheets ဆီ data ပို့ခြင်း
// =============================================
function saveToSheet(data) {

    // ပို့မည့် data ကို ပြင်ဆင်
    const payload = {
        type  : data.type,   // "Sales" သို့မဟုတ် "Buy"
        date  : data.date,   // "2025-05-27"
        item  : data.item,   // "မျှင်ငပိ"
        qty   : data.qty,    // "5 ပိဿာ"
        total : data.total   // 250000
    };

    // Button ကို loading state ပြောင်း
    setButtonLoading(true);

    fetch(APPS_SCRIPT_URL, {
        method      : "POST",
        mode        : "no-cors",   // Apps Script CORS ကျော်ဖြတ်ရန်
        cache       : "no-cache",
        headers     : { "Content-Type": "application/json" },
        body        : JSON.stringify(payload)
    })
    .then(() => {
        // no-cors မှာ response body မရနိုင်သောကြောင့် success ဟု မှတ်ယူ
        showToast("✅ Google Sheets သို့ သိမ်းဆည်းပြီးပါပြီ။");
    })
    .catch((error) => {
        console.error("Sheets Error:", error);
        showToast("❌ ချိတ်ဆက်မှု မအောင်မြင်ပါ။ နောက်မှ ထပ်ကြိုးစားပါ။");
    })
    .finally(() => {
        setButtonLoading(false);
    });
}

// =============================================
//  HELPER — Button loading state
// =============================================
function setButtonLoading(isLoading) {
    const btn = document.getElementById("btn-submit");
    if (!btn) return;

    if (isLoading) {
        btn.disabled     = true;
        btn.innerHTML    = "<span>⏳ သိမ်းဆည်းနေသည်...</span>";
        btn.style.opacity = "0.7";
    } else {
        btn.disabled     = false;
        btn.innerHTML    = "<span>💾 မှတ်တမ်းအသစ် သိမ်းဆည်းမည်</span>";
        btn.style.opacity = "1";
    }
}

// =============================================
//  HELPER — Toast notification
// =============================================
function showToast(message) {
    // ရှိပြီးသား toast ရှိလျှင် ဖျက်
    const existing = document.getElementById("ws-toast");
    if (existing) existing.remove();

    const toast = document.createElement("div");
    toast.id = "ws-toast";
    toast.textContent = message;
    toast.style.cssText = `
        position: fixed;
        bottom: 90px;
        left: 50%;
        transform: translateX(-50%);
        background: #1A2533;
        color: #FFFFFF;
        padding: 12px 24px;
        border-radius: 30px;
        font-size: 0.95rem;
        font-weight: 700;
        z-index: 9999;
        box-shadow: 0 8px 24px rgba(0,0,0,0.2);
        white-space: nowrap;
        animation: fadeInUp 0.3s ease;
    `;

    // Animation style ထည့်
    if (!document.getElementById("ws-toast-style")) {
        const style = document.createElement("style");
        style.id = "ws-toast-style";
        style.textContent = `
            @keyframes fadeInUp {
                from { opacity: 0; transform: translateX(-50%) translateY(16px); }
                to   { opacity: 1; transform: translateX(-50%) translateY(0); }
            }
        `;
        document.head.appendChild(style);
    }

    document.body.appendChild(toast);

    // 3 စက္ကန့်ကြာပြီးရင် ပျောက်
    setTimeout(() => {
        toast.style.transition = "opacity 0.4s ease";
        toast.style.opacity    = "0";
        setTimeout(() => toast.remove(), 400);
    }, 3000);
}
