'use strict';
const $ = id => document.getElementById(id);
const kinds = {questions:'Question', causeandeffects:'Cause & effect', investigations:'Investigation'};
const titles = {question:'Ask a question', causeandeffect:'Cause & effect', investigation:'Plan an investigation'};
const defaultServer = /Android/i.test(navigator.userAgent) ? 'http://10.0.2.2:18000' : 'http://localhost:18000';
let server = localStorage.getItem('sinq.server') || defaultServer;
let items = [], filter = 'all', editing = 'question', parent = null, generation = 0;
$('server-url').value = server;

function element(tag, text, className) {
  const node = document.createElement(tag);
  if (text !== undefined) node.textContent = text;
  if (className) node.className = className;
  return node;
}
async function api(route, options = {}) {
  const response = await fetch(server + '/sinq/api/' + route, {...options, signal: AbortSignal.timeout(options.method === 'POST' ? 60000 : 30000)});
  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    throw new Error(data.error || 'Server returned ' + response.status);
  }
  return response.json();
}
function description(item) {
  if (item.kind === 'questions') return item.fields.text;
  if (item.kind === 'causeandeffects') return item.fields.effect;
  return 'How could we find out?';
}
function renderCards() {
  $('cards').replaceChildren();
  const visible = items.filter(item => filter === 'all' || filter === item.kind);
  for (const item of visible) {
    const card = element('button', undefined, 'card');
    card.type = 'button'; card.dataset.kind = item.kind;
    card.append(element('span', kinds[item.kind], 'kind'), element('h2', description(item)));
    if (item.kind === 'causeandeffects') card.append(element('p', 'Because ' + item.fields.cause));
    card.append(element('small', new Date(item.fields.date_created).toLocaleDateString()));
    card.addEventListener('click', () => showDetail(item));
    $('cards').append(card);
  }
  if (!visible.length) $('cards').append(element('p', 'No inquiries here yet. Start with a question.'));
}
async function refresh() {
  const current = ++generation;
  $('status').textContent = 'Loading inquiries…';
  try {
    const groups = await Promise.all(Object.keys(kinds).map(async kind => (await api(kind + '/')).map(item => ({...item, kind}))));
    if (current !== generation) return;
    items = groups.flat().sort((a,b) => b.fields.date_created.localeCompare(a.fields.date_created));
    renderCards();
    $('status').textContent = `Connected · ${items.length} inquiries`;
  } catch (error) {
    if (current !== generation) return;
    $('status').textContent = 'Could not connect. Check Server connection below. ' + error.message;
  }
}
function addStep(value = '') {
  const label = element('label', 'Step ' + ($('steps').children.length + 1));
  const input = element('input'); input.required = true; input.value = value; input.name = 'step';
  label.append(input); $('steps').append(label);
}
function openEditor(kind, related = null) {
  editing = kind; parent = related;
  $('create-form').reset(); $('steps').replaceChildren(); addStep();
  $('editor-title').textContent = titles[kind];
  $('question-fields').hidden = kind !== 'question';
  $('cause-fields').hidden = kind !== 'causeandeffect';
  $('investigation-fields').hidden = kind !== 'investigation';
  $('photo-field').hidden = kind === 'investigation';
  $('question-text').required = kind === 'question';
  $('cause-text').required = $('effect-text').required = kind === 'causeandeffect';
  for (const input of $('steps').querySelectorAll('input')) input.required = kind === 'investigation';
  $('relationship').textContent = related ? 'Linked to: ' + description(related) : '';
  $('form-error').textContent = ''; $('save').disabled = false;
  $('editor').showModal();
}
async function showDetail(item) {
  $('detail-title').textContent = kinds[item.kind];
  const body = $('detail-body'); body.replaceChildren(element('h3', description(item)));
  if (item.kind === 'causeandeffects') body.append(element('p', 'Because ' + item.fields.cause));
  const actions = $('detail-actions'); actions.replaceChildren();
  const choices = {questions:['causeandeffect','investigation'], causeandeffects:['question','investigation'], investigations:['question','causeandeffect']};
  for (const kind of choices[item.kind]) {
    const button = element('button', '+ ' + titles[kind]); button.type = 'button';
    button.onclick = () => { $('detail').close(); openEditor(kind, item); };
    actions.append(button);
  }
  const linked = items.filter(other => {
    if (item.kind === 'questions') return (item.fields.causeandeffects || []).includes(other.pk) && other.kind === 'causeandeffects' || (item.fields.investigations || []).includes(other.pk) && other.kind === 'investigations';
    if (item.kind === 'causeandeffects') return other.kind === 'questions' && (other.fields.causeandeffects || []).includes(item.pk) || other.kind === 'investigations' && (item.fields.investigations || []).includes(other.pk);
    return other.kind === 'questions' && (other.fields.investigations || []).includes(item.pk) || other.kind === 'causeandeffects' && (other.fields.investigations || []).includes(item.pk);
  });
  if (linked.length) {
    body.append(element('h3','Connected inquiries'));
    for (const other of linked) {
      const button = element('button', kinds[other.kind] + ': ' + description(other));
      button.onclick = () => { $('detail').close(); showDetail(other); }; body.append(button);
    }
  }
  $('detail').showModal();
  try {
    if (item.kind === 'investigations') {
      const steps = await api(`investigations/${item.pk}/steps/`);
      const list = element('ol');
      steps.forEach(step => list.append(element('li', step.fields.text))); body.append(list);
    } else {
      const photos = await api(`${item.kind}/${item.pk}/images/`);
      photos.forEach(photo => {
        const img = element('img'); img.alt = 'Inquiry photo';
        img.src = server + '/media/' + photo.fields.image; body.append(img);
      });
    }
  } catch (error) { body.append(element('p', 'Could not load attachments: ' + error.message)); }
}
$('create-form').addEventListener('submit', async event => {
  event.preventDefault(); $('save').disabled = true; $('form-error').textContent = '';
  const kind = editing;
  const routes = {question:'questions', causeandeffect:'causeandeffects', investigation:'investigations'};
  const data = kind === 'question' ? {text:$('question-text').value} : kind === 'causeandeffect' ? {cause_text:$('cause-text').value, effect_text:$('effect-text').value} : {steps:[...$('steps').querySelectorAll('input')].map((input,index) => ({number:index+1, text:input.value}))};
  if (parent) data[{questions:'question_id',causeandeffects:'causeandeffect_id',investigations:'investigation_id'}[parent.kind]] = parent.pk;
  let created = false;
  try {
    const result = await api(routes[kind] + '/create/', {method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({[kind]:data})});
    created = true;
    const photo = $('photo').files[0];
    if (photo && kind !== 'investigation') {
      const form = new FormData(); form.append(kind + '_image', photo);
      await api(`${routes[kind]}/${result[0].pk}/images/create/`, {method:'POST', body:form});
    }
    $('editor').close(); await refresh();
  } catch (error) {
    if (created) {
      $('editor').close(); await refresh();
      $('status').textContent = 'Inquiry saved, but the photo failed: ' + error.message;
    } else $('form-error').textContent = 'Could not save: ' + error.message;
  } finally { $('save').disabled = false; }
});
$('add-step').onclick = () => addStep();
$('refresh').onclick = refresh;
document.querySelectorAll('[data-create]').forEach(button => button.onclick = () => openEditor(button.dataset.create));
document.querySelectorAll('[data-close]').forEach(button => button.onclick = () => $(button.dataset.close).close());
document.querySelectorAll('[data-filter]').forEach(button => button.onclick = () => {
  filter = button.dataset.filter;
  document.querySelectorAll('[data-filter]').forEach(other => other.setAttribute('aria-pressed', String(other === button)));
  renderCards();
});
$('server-form').onsubmit = event => {
  event.preventDefault();
  const value = $('server-url').value.replace(/\/$/, '');
  if (!['http://localhost:18000','http://127.0.0.1:18000','http://10.0.2.2:18000'].includes(value)) {
    $('status').textContent = 'Use one of the local development servers listed below.'; return;
  }
  server = value; localStorage.setItem('sinq.server', server); refresh();
};
refresh();
