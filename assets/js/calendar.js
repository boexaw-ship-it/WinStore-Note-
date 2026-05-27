// win-store-app/assets/js/calendar.js

const WinStoreCalendar = {
    // အက်ပ်စဖွင့်ချိန်တွင် HTML ထဲက ပြက္ခဒိန်အကွက်ထဲ ယနေ့ရက်စွဲ အလိုအလျောက် ဖြည့်ရန်
    init: function() {
        const today = new Date();
        const yyyy = today.getFullYear();
        let mm = today.getMonth() + 1; // ဇန်နဝါရီသည် 0 ဖြစ်သောကြောင့် 1 ပေါင်းပေးရသည်
        let dd = today.getDate();

        // ဂဏန်းတစ်လုံးတည်းဖြစ်ပါက ရှေ့တွင် 0 ခံရန် (ဥပမာ - 05)
        if (mm < 10) mm = '0' + mm;
        if (dd < 10) dd = '0' + dd;

        const formattedToday = `${yyyy}-${mm}-${dd}`;
        const dateInput = document.getElementById('entry-date');
        
        if (dateInput) {
            dateInput.value = formattedToday;
        }
    },

    // လက်ရှိ ရွေးချယ်ထားသည့် ရက်စွဲကို ဒေတာသိမ်းချိန်တွင် လှမ်းယူရန်
    getSelectedDate: function() {
        const dateInput = document.getElementById('entry-date');
        return dateInput ? dateInput.value : "";
    }
};

// HTML DOM တက်လာသည်နှင့် ပြက္ခဒိန်ကို ချက်ချင်း အသက်သွင်းမည်
document.addEventListener("DOMContentLoaded", () => {
    WinStoreCalendar.init();
});
