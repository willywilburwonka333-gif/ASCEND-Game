const SUPPORT_MARK = 'data-ascend-support-ready';

const normalise = (text='') => text.replace(/\s+/g,' ').trim();

function supportFor(prompt) {
  const q = normalise(prompt).toLowerCase();
  if (/\d+\s*[×x*]\s*\d+|groups? of|each row/.test(q)) return {
    hint: 'Draw equal groups, skip-count, or turn the words into a multiplication sentence.',
    explanation: 'Multiplication combines equal groups. Identify how many groups there are and how many items are in each group, then multiply those two numbers.'
  };
  if (/percent|%/.test(q)) return {
    hint: 'Start by finding 10%, 25%, 50% or 1% of the number, whichever is easiest.',
    explanation: 'A percentage means “out of 100.” Convert the percentage to a fraction or decimal, then multiply it by the whole amount.'
  };
  if (/fraction|one half|one third|quarter|numerator|denominator/.test(q)) return {
    hint: 'The denominator tells how many equal parts make the whole. The numerator tells how many parts are being used.',
    explanation: 'Fractions describe equal parts of a whole. For a fraction of a quantity, divide by the denominator and multiply by the numerator.'
  };
  if (/place value|value of \d|digit/.test(q)) return {
    hint: 'Read the digit’s position from right to left: ones, tens, hundreds, thousands.',
    explanation: 'A digit’s value depends on its position. For example, the 3 in 392 is in the hundreds place, so its value is 300.'
  };
  if (/adjective|noun|verb|adverb/.test(q)) return {
    hint: 'Ask what job each word is doing: naming, acting, describing a noun, or describing an action.',
    explanation: 'A noun names, a verb shows action or state, an adjective describes a noun, and an adverb often describes how an action happens.'
  };
  if (/punctuat|sentence|capital|comma|apostrophe/.test(q)) return {
    hint: 'Check the beginning, ending punctuation and any pause or ownership shown inside the sentence.',
    explanation: 'A complete sentence begins with a capital letter, expresses a complete thought and ends with suitable punctuation. Commas and apostrophes show structure and meaning.'
  };
  if (/evaporation|condensation|freezing|melting|water/.test(q)) return {
    hint: 'Think about whether matter is gaining or losing heat and which state it changes into.',
    explanation: 'Heating and cooling can change matter between solid, liquid and gas. Evaporation is liquid to gas; condensation is gas to liquid.'
  };
  if (/force|gravity|friction|magnet/.test(q)) return {
    hint: 'Ask what is causing the object to speed up, slow down, change direction or stay attracted.',
    explanation: 'A force is a push or pull. Gravity attracts objects toward Earth, friction resists motion and magnetism acts between magnetic materials.'
  };
  if (/map|direction|north|south|east|west|scale|coordinate/.test(q)) return {
    hint: 'Look for the map feature that matches the task: direction, distance, position or meaning of symbols.',
    explanation: 'Maps use conventions: a compass rose for direction, scale for distance, coordinates for position and a legend for symbols.'
  };
  if (/algorithm|code|program|sequence/.test(q)) return {
    hint: 'An algorithm must be clear enough that another person or computer can follow its steps in order.',
    explanation: 'An algorithm is a precise sequence of ordered instructions used to complete a task or solve a problem.'
  };
  return {
    hint: 'Read the question once for the topic, then again for exactly what it asks. Remove answers that clearly do not fit.',
    explanation: 'Break the question into three parts: what information is given, what must be found, and which rule or idea connects them. Try explaining the question in your own words before answering.'
  };
}

const style = document.createElement('style');
style.textContent = `
.ascend-support-row{display:flex;flex-wrap:wrap;gap:8px;margin:10px 0;justify-content:center}.ascend-support-row button{min-height:46px;border:3px solid #fff;border-radius:14px;padding:9px 14px;background:#eef7ff;color:#17324d;font:900 15px Nunito,Arial;cursor:pointer;touch-action:manipulation}.ascend-support-panel{display:none;margin:8px auto 12px;max-width:680px;padding:13px 15px;border:3px solid #fff;border-radius:14px;background:#fff0b8;color:#17324d;font-weight:800;line-height:1.45;text-align:left}.ascend-support-panel.open{display:block}
`;
document.head.appendChild(style);

function locatePrompt(container) {
  const selectors = ['.ar-question','.lw-question','.battle-question','.question-text','[data-question]'];
  for (const selector of selectors) {
    const element = container.matches?.(selector) ? container : container.querySelector?.(selector);
    if (element && normalise(element.textContent).length > 5) return element;
  }
  return null;
}

function inject(question) {
  if (question.hasAttribute(SUPPORT_MARK)) return;
  const host = question.parentElement;
  if (!host) return;
  question.setAttribute(SUPPORT_MARK,'true');
  const row = document.createElement('div');
  row.className = 'ascend-support-row';
  row.innerHTML = '<button type="button" data-support="hint">💡 Hint</button><button type="button" data-support="explain">📖 Explain it</button>';
  const panel = document.createElement('div');
  panel.className = 'ascend-support-panel';
  const reference = [...host.children].find(child => child.classList?.contains('ar-options') || child.classList?.contains('lw-options'));
  if (reference) host.insertBefore(row, reference);
  else question.insertAdjacentElement('afterend', row);
  row.insertAdjacentElement('afterend', panel);
  row.addEventListener('click', event => {
    const action = event.target.closest('button')?.dataset.support;
    if (!action) return;
    const support = supportFor(question.textContent);
    panel.textContent = action === 'hint' ? support.hint : support.explanation;
    panel.classList.add('open');
  });
}

function scan(root=document) {
  root.querySelectorAll?.('.ar-question,.lw-question,.battle-question,.question-text,[data-question]').forEach(inject);
}

const observer = new MutationObserver(records => {
  for (const record of records) {
    for (const node of record.addedNodes) if (node.nodeType === 1) { if (node.matches?.('.ar-question,.lw-question,.battle-question,.question-text,[data-question]')) inject(node); scan(node); }
    if (record.type === 'characterData') {
      const question = record.target.parentElement?.closest?.('.ar-question,.lw-question,.battle-question,.question-text,[data-question]');
      if (question) {
        question.removeAttribute(SUPPORT_MARK);
        question.parentElement?.querySelectorAll('.ascend-support-row,.ascend-support-panel').forEach(el=>el.remove());
        inject(question);
      }
    }
  }
});
observer.observe(document.body,{subtree:true,childList:true,characterData:true});
scan();
window.ASCEND_LEARNING_SUPPORT = { supportFor, scan };
