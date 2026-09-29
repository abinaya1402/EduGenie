const TASKS = {
  explain: {color: '#f39c12', ph: 'Example: Explain photosynthesis in simple words'},
  qa:      {color: '#e84393', ph: 'Example: Why is the sky blue?'},
  quiz:    {color: '#00b894', ph: 'Example: Solar System'},
  summary: {color: '#0984e3', ph: 'Paste your long study material here...'},
  path:    {color: '#6c5ce7', ph: 'Example: Machine Learning for beginners'}
};

const $ = id => document.getElementById(id);
const taskSel = $('task'), textEl = $('text'), resultEl = $('result'), btn = $('generate');

function setTask(k) {
  taskSel.value = k;
  textEl.placeholder = TASKS[k].ph;
  document.documentElement.style.setProperty('--accent', TASKS[k].color);
  document.querySelectorAll('.feature').forEach(f => f.classList.toggle('active', f.dataset.task === k));
}
document.querySelectorAll('.feature').forEach(f => f.addEventListener('click', () => setTask(f.dataset.task)));
taskSel.addEventListener('change', () => setTask(taskSel.value));
setTask('explain');

function esc(s) { return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }

function md(s) {
  const inl = x => esc(x).replace(/\*\*(.+?)\*\*/g, '<b>$1</b>').replace(/\*(.+?)\*/g, '<i>$1</i>').replace(/`(.+?)`/g, '<code>$1</code>');
  let html = '', list = null;
  const close = () => { if (list) { html += '</' + list + '>'; list = null; } };
  for (const line of s.split('\n')) {
    let m;
    if ((m = line.match(/^#{1,4}\s+(.*)/))) { close(); html += '<h3>' + inl(m[1]) + '</h3>'; }
    else if ((m = line.match(/^\s*[-*•]\s+(.*)/))) { if (list !== 'ul') { close(); html += '<ul>'; list = 'ul'; } html += '<li>' + inl(m[1]) + '</li>'; }
    else if ((m = line.match(/^\s*\d+[.)]\s+(.*)/))) { if (list !== 'ol') { close(); html += '<ol>'; list = 'ol'; } html += '<li>' + inl(m[1]) + '</li>'; }
    else if (line.trim() === '') { close(); }
    else { close(); html += '<p>' + inl(line) + '</p>'; }
  }
  close();
  return html;
}

function renderQuiz(items) {
  let score = 0, done = 0;
  const wrap = document.createElement('div');
  items.forEach((q, i) => {
    const box = document.createElement('div');
    box.className = 'q';
    box.innerHTML = '<b>' + (i + 1) + '. ' + esc(q.q) + '</b>';
    q.options.forEach((o, j) => {
      const b = document.createElement('button');
      b.className = 'opt';
      b.textContent = o;
      b.onclick = () => {
        box.querySelectorAll('.opt').forEach(x => x.disabled = true);
        box.querySelectorAll('.opt')[q.answer].classList.add('ok');
        if (j === q.answer) score++; else b.classList.add('bad');
        const why = document.createElement('p');
        why.innerHTML = '💡 ' + esc(q.why || '');
        box.appendChild(why);
        if (++done === items.length) {
          const s = document.createElement('div');
          s.className = 'score';
          s.textContent = '🎉 You scored ' + score + ' / ' + items.length;
          wrap.appendChild(s);
        }
      };
      box.appendChild(b);
    });
    wrap.appendChild(box);
  });
  return wrap;
}

btn.addEventListener('click', async () => {
  const text = textEl.value.trim();
  if (!text) { resultEl.innerHTML = '<div class="error">Please enter a topic or text first.</div>'; return; }
  btn.disabled = true;
  btn.textContent = '🧞 Thinking...';
  resultEl.innerHTML = '<div class="loading"><i></i><i></i><i></i></div>';
  try {
    const res = await fetch('/api/generate', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({task: taskSel.value, text: text})
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Something went wrong');
    resultEl.innerHTML = '';
    if (data.type === 'quiz') resultEl.appendChild(renderQuiz(data.result));
    else resultEl.innerHTML = md(data.result);
  } catch (e) {
    resultEl.innerHTML = '<div class="error"><b>Error:</b> ' + esc(e.message) + '</div>';
  }
  btn.disabled = false;
  btn.textContent = '✨ Generate with EduGenie';
});
