// Smooth scroll for header links
document.querySelectorAll('header nav a').forEach(a=>{
  a.addEventListener('click', e=>{
    e.preventDefault();
    const target = document.querySelector(a.getAttribute('href'));
    if(target){
      target.scrollIntoView({behavior:'smooth', block:'start'});
    }
  });
});

// Modal functionality
const modal = document.getElementById('modal');
const modalTitle = document.getElementById('modalTitle');
const modalDesc = document.getElementById('modalDesc');
const modalClose = document.getElementById('modalClose');

document.querySelectorAll('.projeto').forEach(card=>{
  card.addEventListener('click', ()=>{
    const title = card.getAttribute('data-title') || '';
    const desc = card.getAttribute('data-desc') || '';
    modalTitle.textContent = title;
    modalDesc.textContent = desc;
    modal.classList.add('show');
    modal.setAttribute('aria-hidden','false');
  });
});

modalClose.addEventListener('click', closeModal);
modal.addEventListener('click', (e)=>{
  if(e.target.classList.contains('modal-backdrop')) closeModal();
});

function closeModal(){
  modal.classList.remove('show');
  modal.setAttribute('aria-hidden','true');
}
