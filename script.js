"use strict";
document.getElementById('year').textContent = new Date().getFullYear();
const menuButton = document.querySelector('.menu-toggle');
const nav = document.querySelector('.nav');
menuButton.addEventListener('click', () => {const open = nav.classList.toggle('open');menuButton.setAttribute('aria-expanded', String(open));});
const taskForm = document.getElementById('task-form');
if (taskForm) {
  const key = 'emmanuel-academic-tasks-v1';
  let tasks = [];
  try {const saved = JSON.parse(localStorage.getItem(key) || '[]');tasks = Array.isArray(saved) ? saved.filter(t => t && typeof t.id === 'string' && typeof t.title === 'string') : [];} catch {tasks = [];}
  const list = document.getElementById('task-list');
  const save = () => {try {localStorage.setItem(key, JSON.stringify(tasks));} catch { /* Storage may be disabled */ }};
  function render() {
    list.replaceChildren();
    tasks.forEach(task => {
      const li = document.createElement('li');if(task.done)li.classList.add('task-done');
      const checkbox = document.createElement('input');checkbox.type='checkbox';checkbox.checked=Boolean(task.done);checkbox.setAttribute('aria-label','Complete '+task.title);
      checkbox.addEventListener('change', () => {task.done=checkbox.checked;save();render();});
      const content=document.createElement('div');content.className='task-content';const strong=document.createElement('strong');strong.textContent=task.title;const small=document.createElement('small');small.textContent=task.course+(task.date?' · Due '+task.date:'');content.append(strong,small);
      const remove=document.createElement('button');remove.type='button';remove.className='delete-task';remove.textContent='Delete';remove.setAttribute('aria-label','Delete '+task.title);remove.addEventListener('click',()=>{tasks=tasks.filter(t=>t.id!==task.id);save();render();});li.append(checkbox,content,remove);list.append(li);
    });
    const completed=tasks.filter(t=>t.done).length;const pct=tasks.length?Math.round(completed/tasks.length*100):0;
    document.getElementById('task-count').textContent=tasks.length+' task'+(tasks.length===1?'':'s');document.getElementById('empty-tasks').hidden=tasks.length>0;document.getElementById('progress-bar').style.width=pct+'%';document.getElementById('progress').setAttribute('aria-valuenow',String(pct));document.getElementById('progress-text').textContent=pct+'% completed ('+completed+'/'+tasks.length+')';
  }
  taskForm.addEventListener('submit',event=>{event.preventDefault();const title=document.getElementById('task-title').value.trim();if(!title)return;tasks.push({id:crypto.randomUUID?crypto.randomUUID():String(Date.now())+Math.random(),title,course:document.getElementById('task-course').value,date:document.getElementById('task-date').value,done:false});save();taskForm.reset();render();document.getElementById('task-title').focus();});render();
}
const contactForm=document.getElementById('contact-form');
if(contactForm){contactForm.addEventListener('submit',event=>{event.preventDefault();const name=document.getElementById('contact-name').value.trim();const email=document.getElementById('contact-email').value.trim();const phone=document.getElementById('contact-phone').value.trim();const message=document.getElementById('contact-message').value.trim();const feedback=document.getElementById('form-feedback');let error='';if(!name||!email||!phone||!message)error='All fields are required.';else if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))error='Please enter a valid email address.';else if(!/^[0-9]+$/.test(phone))error='Phone number must contain digits only.';feedback.className=error?'error':'success';feedback.textContent=error||'All fields are valid. This demonstration does not send or store your message.';});}
