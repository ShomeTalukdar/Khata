import type { BillItem } from './db';

const UNITS = ['kilo', 'kg', 'gram', 'litre', 'ltr', 'packet', 'nag', 'piece', 'dozen', 'g', 'ml', 'pao', 'gm', 'pcs', 'unit', 'pieces', 'kilograms', 'items', 'packet', 'pau', 'किलो', 'ग्राम', 'लीटर', 'पैकेट', 'नाग', 'पीस', 'दर्जन', 'पाओ', 'यूनिट', 'आइटम'];
const PRICE_KEYWORDS = ['rupaye', 'rs', 'rupees', 'bhau', 'rate', 'price', 'ka', 'ke', 'rupes', 'rupe', 'rupya', 'cost', 'at', 'mein', 'wale', 'wala', 'रुपये', 'भाव', 'रेत', 'का', 'के', 'वाला', 'में', '₹'];
const INTENT_ADD = ['add', 'daal', 'likh', 'rakh', 'plus', 'jod', 'bana', 'karo', 'karein', 'put', 'insert', 'de', 'do', 'डाल', 'लिख', 'रख', 'प्लस', 'जोड़', 'बना', 'करो', 'करें', 'दे', 'दो'];
const INTENT_REMOVE = ['delete', 'hata', 'nikal', 'remove', 'galti', 'mita', 'cancel', 'remove', 'sorry', 'wrong', 'no', 'हटा', 'निकाल', 'मिटा', 'गलती', 'नहीं'];
const GREETINGS = ['hello', 'hi', 'billu', 'namaste', 'kaise ho', 'help', 'madad', 'suno', 'hey', 'billu bhai', 'नमस्ते', 'कैसे हो', 'मदद', 'सुना', 'हेलो', 'हाय'];
const HINDI_MARKERS = ['hai', 'karo', 'de', 'do', 'mein', 'ka', 'ke', 'ko', 'aur', 'kya', 'namaste', 'bhai', 'ji', 'kitna', 'hata', 'galat', 'wala', 'wale', 'है', 'करो', 'में', 'का', 'के', 'को', 'और', 'क्या', 'नमस्ते', 'भाई', 'जी', 'कितना'];

const NUMBER_WORDS: Record<string, number> = {
    'ek': 1, 'do': 2, 'teen': 3, 'chaar': 4, 'paanch': 5, 'cheh': 6, 'saat': 7, 'aath': 8, 'nau': 9, 'dus': 10,
    'one': 1, 'two': 2, 'three': 3, 'four': 4, 'five': 5, 'six': 6, 'seven': 7, 'eight': 8, 'nine': 9, 'ten': 10,
    'twenty': 20, 'thirty': 30, 'forty': 40, 'fifty': 50, 'hundred': 100, 'sau': 100, 'pachass': 50, 'bees': 20, 'tees': 30, 'chalis': 40,
    'एक': 1, 'दो': 2, 'तीन': 3, 'चार': 4, 'पांच': 5, 'छह': 6, 'सात': 7, 'आठ': 8, 'नौ': 9, 'दस': 10,
    'बीस': 20, 'तीस': 30, 'चालीस': 40, 'पचास': 50, 'सौ': 100
};

const FILLER_WORDS = [
    'ji', 'z जरा', 'thoda', 'mein', 'ko', 'kar', 'de', 'do', 'ha', 'theek',
    'toh', 'sahi', 'se', 'bhi', 'hai', 'tha', 'raha', 'rahie', 'for', 'in', 'of', 'with', 'hai', 'hua', 'bhai', 'yaar', 'okay'
];

export interface ParserResult {
    items?: Partial<BillItem>[];
    intent: 'add' | 'remove' | 'summary' | 'greeting' | 'unknown';
    conversationalReply: string;
    language: 'hindi' | 'english';
}

export const parseConversationalCommand = (text: string): ParserResult => {
    const input = text.toLowerCase().trim();

    // Simple Language Detection
    const isHindi = HINDI_MARKERS.some(m => input.includes(m));
    const lang = isHindi ? 'hindi' : 'english';

    // 1. Contextual Greeting / Social
    if (GREETINGS.some(g => input === g || input === `v ${g}`) || input.includes('kaise ho')) {
        return {
            intent: 'greeting',
            language: lang,
            conversationalReply: isHindi
                ? "Namaste! Main Billu hoon. Boliye kya add karna hai?"
                : "Hello! I am Billu. What should I add today?"
        };
    }

    // 2. Removal / Correction
    if (INTENT_REMOVE.some(r => input.includes(r)) && !input.match(/\d/)) {
        return {
            intent: 'remove',
            language: lang,
            conversationalReply: isHindi
                ? "Theek hai, maine wo hata diya. Aur kuch?"
                : "Got it, removed that item. Anything else?"
        };
    }

    // 3. Main Entity Extraction Loop
    // Pre-process: Separate special characters and symbols
    // 1. Separate ₹ from numbers (e.g., ₹10 -> ₹ 10)
    // 2. Separate - from numbers if needed, though usually not for prices/qty
    let processedInput = input.replace(/₹/g, ' ₹ ').replace(/([\d]+)(?=[a-zA-Z\u0900-\u097F])/g, '$1 ').replace(/([a-zA-Z\u0900-\u097F])(?=[\d]+)/g, '$1 ');

    const segments = processedInput.split(/\s+(?:aur|and|,|\+|और)\s+/);
    const resultItems: Partial<BillItem>[] = [];

    segments.forEach(segment => {
        const words = segment.trim().split(/\s+/);

        // Semantic Pre-processing (Word to Numbers)
        const processedWords = words.map(w => {
            const num = NUMBER_WORDS[w];
            return num !== undefined ? num.toString() : w;
        });

        const numberTokens: { val: number; idx: number; used: boolean }[] = [];
        processedWords.forEach((pw, idx) => {
            const val = parseInt(pw);
            if (!isNaN(val)) {
                numberTokens.push({ val, idx, used: false });
            }
        });

        let price = 0;
        let qty = 1;
        let unit = 'piece';

        // High Intelligence Mapping:
        // A. Look for PRICE proximity
        numberTokens.forEach(t => {
            const prev = processedWords[t.idx - 1];
            const next = processedWords[t.idx + 1];
            if (PRICE_KEYWORDS.includes(prev) || PRICE_KEYWORDS.includes(next)) {
                price = t.val;
                t.used = true;
            }
        });

        // B. Look for QTY proximity to Units
        processedWords.forEach((pw, idx) => {
            if (UNITS.includes(pw)) {
                unit = pw;
                const nearbyNum = numberTokens.find(t => !t.used && (t.idx === idx - 1 || t.idx === idx + 1));
                if (nearbyNum) {
                    qty = nearbyNum.val;
                    nearbyNum.used = true;
                }
            }
        });

        // C. Fallback for remaining numbers (Greedy)
        numberTokens.forEach(t => {
            if (!t.used) {
                if (price === 0 && (t.val > 20 || t.idx > processedWords.length / 2)) {
                    price = t.val;
                    t.used = true;
                } else if (qty === 1) {
                    qty = t.val;
                    t.used = true;
                }
            }
        });

        // D. Item Name extraction (the 'residue')
        const itemParts = processedWords.filter((w, idx) => {
            if (numberTokens.some(t => t.idx === idx)) return false;
            if (UNITS.includes(w) || PRICE_KEYWORDS.includes(w) || FILLER_WORDS.includes(w) || INTENT_ADD.includes(w)) return false;
            return true;
        });

        let name = itemParts.join(' ').replace(/[^\w\s\u0900-\u097F]/g, '').trim();
        if (!name) name = "Item";

        if (price > 0 || qty > 1) {
            resultItems.push({
                name,
                qty,
                unit,
                price,
                total: qty * price
            });
        }
    });

    if (resultItems.length > 0) {
        const itemDescriptions = resultItems.map(i => `${i.qty} ${i.unit} ${i.name}`).join(isHindi ? ' aur ' : ' and ');
        const totalAmount = resultItems.reduce((acc, curr) => acc + (curr.total || 0), 0);

        return {
            items: resultItems,
            intent: 'add',
            language: lang,
            conversationalReply: isHindi
                ? `Theek hai! Maine ${itemDescriptions} add kar diya (Total: ₹${totalAmount}). Aur kuch?`
                : `Sure! Added ${itemDescriptions} (Total: ₹${totalAmount}). Anything else?`
        };
    }

    return {
        intent: 'unknown',
        language: lang,
        conversationalReply: isHindi
            ? "Maaf kijiye, samajh nahi aaya. Dobara boliye?"
            : "Sorry, I didn't catch that. Could you say it again?"
    };
};
