// Handles language toggle + "Did you benefit?" votes stored in localStorage
const defaultLang = localStorage.getItem('fn_lang') || 'ar';
document.documentElement.lang = defaultLang === 'ar' ? 'ar' : 'en';
applyLang(defaultLang);

function toggleLang(){
  const cur = localStorage.getItem('fn_lang') || 'ar';
  const next = cur === 'ar' ? 'en' : 'ar';
  localStorage.setItem('fn_lang', next);
  applyLang(next);
  location.reload(); // reload so separate pages show selected language (simple approach)
}

function applyLang(lang){
  // add body class for direction
  if(lang === 'ar'){ document.body.classList.add('lang-rtl'); document.body.classList.remove('lang-ltr'); }
  else { document.body.classList.add('lang-ltr'); document.body.classList.remove('lang-rtl'); }
}

// Voting (localStorage) - expects element with data-vote-id
function registerVoteButtons(){
  document.querySelectorAll('[data-vote-id]').forEach(container=>{
    const id = container.dataset.voteId;
    const yesBtn = container.querySelector('.vote-yes');
    const noBtn = container.querySelector('.vote-no');
    const yesCountEl = container.querySelector('.yes-count');
    const noCountEl = container.querySelector('.no-count');

    // init counts
    const counts = JSON.parse(localStorage.getItem('fn_votes_' + id) || '{"yes":0,"no":0}');
    yesCountEl.textContent = counts.yes;
    noCountEl.textContent = counts.no;

    yesBtn.addEventListener('click', ()=>{
      counts.yes += 1; localStorage.setItem('fn_votes_' + id, JSON.stringify(counts));
      yesCountEl.textContent = counts.yes;
      showThanks(container, true);
    });
    noBtn.addEventListener('click', ()=>{
      counts.no += 1; localStorage.setItem('fn_votes_' + id, JSON.stringify(counts));
      noCountEl.textContent = counts.no;
      showThanks(container, false);
    });
  });
}

function showThanks(container, isYes){
  const t = container.querySelector('.vote-thanks');
  if(t) t.remove();
  const div = document.createElement('div');
  div.className = 'small vote-thanks';
  div.textContent = isYes ? (localStorage.getItem('fn_lang')==='en' ? 'Thanks! Glad it helped.' : 'شكراً! سعيدين إنه أفادك.') : (localStorage.getItem('fn_lang')==='en' ? 'Thanks for the feedback.' : 'شكراً على ملاحظتك.');
  container.appendChild(div);
}

// For safety: when opening affiliate links, we include placeholder function (replace with real links)
function openAffiliate(url){
  // url should be full affiliate link
  window.open(url, '_blank');
}

document.addEventListener('DOMContentLoaded', ()=>{
  // attach toggle button if exists
  const toggleBtn = document.getElementById('langToggle');
  if(toggleBtn) toggleBtn.addEventListener('click', toggleLang);
  registerVoteButtons();
});
