// =============================================
//  WinStore Note — app.js (Full Updated)
//  အရောင်း / အဝယ် မှတ်တမ်း Logic အားလုံး
// =============================================

// ── အခြေခံ Variables ──
let currentType = 'Sales';
let selectedItem = null;
let salesRecords = [];
let buyRecords   = [];

// ── မင်းရဲ့ Web App URL ကို ဒီမှာထည့်ပါ ──
const WEB_APP_URL = "https://script.google.com/macros/s/ထွက်လာတဲ့_ID_ကို_ဒီမှာ_ထည့်ပါ/exec";

// =============================================
//  NAVIGATION — စာမျက်နှာပြောင်းခြင်း
// =============================================
function navigateTo(pageId) {
    document.querySelectorAll('.app-page').forEach(p => p.classList.remove('active'));
    document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));

    document.getElementById(pageId + '-page').classList.add('active');

    const tabMap = {
        'entry'      : 'tab-entry',
        'sales-view' : 'tab-sales-view',
        'buy-view'   : 'tab-buy-view'
    };
    if (tabMap[pageId]) {
        document.getElementById(tabMap[pageId]).classList.add('active');
    }

    if (pageId === 'sales-view') renderSalesTable();
    if (pageId === 'buy-view')   renderBuyTable();
}

// =============================================
//  SWITCH — အရောင်း / အဝယ် ပြောင်းခြင်း
// =============================================
function switchEntryType(type) {
    currentType  = type;
    selectedItem = null;

    document.getElementById('card-sell').classList.toggle('active', type === 'Sales');
    document.getElementById('card-buy').classList.toggle('active', type === 'Buy');

    renderItems();

    const statusEl = document.getElementById('entry-status');
    statusEl.innerText = 'ရွေးချယ်ထားသည့်ပစ္စည်း: မရှိသေးပါ';
    statusEl.classList.remove('highlight');
}

// =============================================
//  RENDER ITEMS — ပစ္စည်းစာရင်းတင်ပေးခြင်း
// =============================================
function renderItems() {
    const listContainer = document.getElementById('entry-items-list');
    listContainer.innerHTML = '';

    const items = (currentType === 'Sales') ? SELL_ITEMS : BUY_ITEMS;

    items.forEach(item => {
        const div = document.createElement('div');
        div.className = 'item-list-row';
        div.innerHTML = `<div class="item-text-main">${item.name}</div>`;
        div.onclick = () => selectItem(item, div);
        listContainer.appendChild(div);
    });
}

// =============================================
//  SELECT ITEM — ပစ္စည်းရွေးချယ်ခြင်း
// =============================================
function selectItem(item, element) {
    selectedItem = item;
    document.querySelectorAll('.item-list-row').forEach(el => el.classList.remove('selected'));
    element.classList.add('selected');

    const statusEl = document.getElementById('entry-status');
    statusEl.innerText = `ရွေးချယ်ထားသည့်ပစ္စည်း: ${item.name}`;
    statusEl.classList.add('highlight');
}

// =============================================
//  SUBMIT — မှတ်တမ်းသိမ်းဆည်းခြင်း
// =============================================
function submitForm() {
    if (!selectedItem) {
        alert('ကျေးဇူးပြု၍ ပစ္စည်းတစ်ခု ရွေးပေးပါ။');
        return;
    }

    const date  = document.getElementById('entry-date').value;
    const qty   = document.getElementById('entry-qty').value.trim();
    const unit  = document.getElementById('entry-unit').value;
    const total = document.getElementById('entry-total-price').value.trim();

    if (!date || !qty || !total) {
        alert('ကျေးဇူးပြု၍ ရက်စွဲ၊ အရေအတွက်နှင့် ကျသင့်ငွေ ဖြည့်ပေးပါ။');
        return;
    }

    const data = {
        type  : currentType,
        date  : date,
        item  : selectedItem.name,
        qty   : qty + ' ' + unit,
        total : parseInt(total)
    };

    if (currentType === 'Sales') salesRecords.push(data);
    else                         buyRecords.push(data);

    saveToSheet(data);

    alert('မှတ်တမ်း သိမ်းဆည်းပြီးပါပြီ။ ✅');
    resetForm();
    // သိမ်းပြီးတာနဲ့ Table တွေ Update ဖြစ်သွားအောင် ပြန် Render
    renderSalesTable();
    renderBuyTable();
}

// =============================================
//  RESET — Form ကို ရှင်းလင်းခြင်း
// =============================================
function resetForm() {
    document.getElementById('entry-qty').value           = '';
    document.getElementById('entry-total-price').value = '';

    selectedItem = null;
    document.querySelectorAll('.item-list-row').forEach(el => el.classList.remove('selected'));

    const statusEl = document.getElementById('entry-status');
    statusEl.innerText = 'ရွေးချယ်ထားသည့်ပစ္စည်း: မရှိသေးပါ';
    statusEl.classList.remove('highlight');
}

// =============================================
//  RENDER TABLES — ဇယားများပြသခြင်း
// =============================================
function renderSalesTable() {
    const tbody = document.getElementById('sales-table-body');
    const total = salesRecords.reduce((sum, r) => sum + r.total, 0);
    document.getElementById('total-sales-amount').textContent = total.toLocaleString();

    if (salesRecords.length === 0) {
        tbody.innerHTML = '<tr><td colspan="4" style="text-align:center; color:#94A3B8; padding:30px; font-weight:700;">မှတ်တမ်း မရှိသေးပါ</td></tr>';
        return;
    }

    tbody.innerHTML = salesRecords.map(r => `
        <tr>
            <td>${r.date}</td>
            <td>${r.item}</td>
            <td>${r.qty}</td>
            <td>${r.total.toLocaleString()}</td>
        </tr>
    `).join('');
}

function renderBuyTable() {
    const tbody = document.getElementById('buy-table-body');
    const total = buyRecords.reduce((sum, r) => sum + r.total, 0);
    document.getElementById('total-buy-amount').textContent = total.toLocaleString();

    if (buyRecords.length === 0) {
        tbody.innerHTML = '<tr><td colspan="4" style="text-align:center; color:#94A3B8; padding:30px; font-weight:700;">မှတ်တမ်း မရှိသေးပါ</td></tr>';
        return;
    }

    tbody.innerHTML = buyRecords.map(r => `
        <tr>
            <td>${r.date}</td>
            <td>${r.item}</td>
            <td>${r.qty}</td>
            <td>${r.total.toLocaleString()}</td>
        </tr>
    `).join('');
}

// =============================================
//  INIT — အက်ပ်စတင်ချိန် နှင့် DATA LOADING
// =============================================
function loadRecordsFromSheet() {
    fetch(WEB_APP_URL)
    .then(res => res.json())
    .then(data => {
        salesRecords = data.filter(r => r.type === 'Sales');
        buyRecords = data.filter(r => r.type === 'Buy');
        renderSalesTable();
        renderBuyTable();
    })
    .catch(err => console.log("Data ဆွဲယူရာတွင် အမှားရှိနေသည် - ", err));
}

window.onload = () => {
    renderItems();
    WinStoreCalendar.init();
    loadRecordsFromSheet(); // အရေးကြီးသည်: App စဖွင့်ရင် Data အရင်ဆွဲမည်
};
