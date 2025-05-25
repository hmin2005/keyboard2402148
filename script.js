const paper = document.getElementById('paper');
const toggle = document.createElement('div');
toggle.className = 'key toggle-key';
toggle.id = 'toggle';
toggle.textContent = '한/영';

const keyboard = document.getElementById('keyboard');
let isKorean = false;
let buffer = [];

const rows = [
  ['1','2','3','4','5','6','7','8','9','0'],
  ['q','w','e','r','t','y','u','i','o','p'],
  ['a','s','d','f','g','h','j','k','l'],
  ['z','x','c','v','b','n','m',',','.']
];

const engKeys = {
  'q':'q','w':'w','e':'e','r':'r','t':'t','y':'y','u':'u','i':'i','o':'o','p':'p',
  'a':'a','s':'s','d':'d','f':'f','g':'g','h':'h','j':'j','k':'k','l':'l',
  'z':'z','x':'x','c':'c','v':'v','b':'b','n':'n','m':'m',',':',','.':'.',
  '1':'1','2':'2','3':'3','4':'4','5':'5','6':'6','7':'7','8':'8','9':'9','0':'0'
};

const korKeys = {
  'q':'ㅂ','w':'ㅈ','e':'ㄷ','r':'ㄱ','t':'ㅅ','y':'ㅛ','u':'ㅕ','i':'ㅑ','o':'ㅐ','p':'ㅔ',
  'a':'ㅁ','s':'ㄴ','d':'ㅇ','f':'ㄹ','g':'ㅎ','h':'ㅗ','j':'ㅓ','k':'ㅏ','l':'ㅣ',
  'z':'ㅋ','x':'ㅌ','c':'ㅊ','v':'ㅍ','b':'ㅠ','n':'ㅜ','m':'ㅡ',',':',','.':'.',
  '1':'1','2':'2','3':'3','4':'4','5':'5','6':'6','7':'7','8':'8','9':'9','0':'0'
};

function renderKeyboard() {
  keyboard.innerHTML = '';
  rows.forEach((rowKeys, i) => {
    const row = document.createElement('div');
    row.className = `row row${i+1}`;
    rowKeys.forEach(k => {
      const key = document.createElement('div');
      key.className = 'key';
      key.textContent = isKorean ? korKeys[k] : engKeys[k];
      row.appendChild(key);
    });
    if (i === 3) row.appendChild(toggle);
    keyboard.appendChild(row);
  });
}

function updateLabel() {
  const base = paper.dataset.base || '';
  if (isKorean) {
    const current = Hangul.assemble(buffer);
    paper.textContent = base + current;
  } else {
    paper.textContent = base;
  }
}

function toggleLang() {
  if (buffer.length > 0) {
    paper.dataset.base += Hangul.assemble(buffer);
    buffer = [];
  }
  isKorean = !isKorean;
  toggle.textContent = isKorean ? '한글' : 'ENG';
  renderKeyboard();
  updateLabel();
}

document.addEventListener('keydown', (e) => {
  const char = e.key.toLowerCase();
  if (char === 'backspace') {
    if (isKorean) {
      if (buffer.length > 0) {
        buffer.pop();
      } else {
        paper.dataset.base = (paper.dataset.base || '').slice(0, -1);
      }
    } else {
      paper.dataset.base = (paper.dataset.base || '').slice(0, -1);
    }
    updateLabel();
    return;
  }

  if (char === '.' || char === '한/영') {
    toggleLang();
    return;
  }

  const keyMap = isKorean ? korKeys : engKeys;
  if (keyMap[char]) {
    const keyEl = [...document.querySelectorAll('.key')].find(k => k.textContent === (isKorean ? korKeys[char] : engKeys[char]));
    if (keyEl) {
      keyEl.classList.add('highlight');
      setTimeout(() => keyEl.classList.remove('highlight'), 200);
    }

    if (isKorean) {
      buffer.push(korKeys[char]);
    } else {
      if (buffer.length > 0) {
        paper.dataset.base += Hangul.assemble(buffer);
        buffer = [];
      }
      paper.dataset.base += engKeys[char];
    }
    updateLabel();
  }
});

toggle.addEventListener('click', toggleLang);
renderKeyboard();
