const fields = ['actual', 'planned', 'scheduled', 'downtime'].map(id => document.getElementById(id));
function calculate() {
  const [actual, planned, scheduled, downtime] = fields.map(x => Number(x.value));
  const error = document.getElementById('input-error');
  const bad = !fields.every(x => x.value !== '' && Number.isFinite(Number(x.value))) || actual < 0 || planned <= 0 || scheduled < 1 || scheduled > 1440 || downtime < 0 || downtime > scheduled;
  error.textContent = bad ? 'Revisa los valores: plan positivo y detención entre cero y minutos programados.' : '';
  document.querySelector('.outputs').setAttribute('aria-invalid', String(bad));
  document.getElementById('compliance').textContent = bad ? '—' : `${(100 * actual / planned).toFixed(1)}%`;
  document.getElementById('availability').textContent = bad ? '—' : `${(100 * (scheduled - downtime) / scheduled).toFixed(1)}%`;
  const operating = scheduled - downtime;
  document.getElementById('rate').textContent = bad || operating === 0 ? 'No definida' : `${(actual * 60 / operating).toFixed(1)} t/h`;
}
fields.forEach(field => field.addEventListener('input', calculate));
document.getElementById('reset').addEventListener('click', () => { [1080, 1200, 720, 90].forEach((value, i) => fields[i].value = value); calculate(); });

const questions = [
  {q:'Si la producción queda bajo el plan, ¿qué muestra el cumplimiento?',a:['La proporción del plan alcanzada por la producción reportada.','La causa de la diferencia.','La disponibilidad mecánica de cada equipo.'],correct:0,why:'El cumplimiento compara producción reportada con plan. No explica por qué difieren.'},
  {q:'El turno tuvo 720 minutos programados y 90 de detención. ¿Cuál es la disponibilidad del turno según esta lección?',a:['75%','87,5%','90%'],correct:1,why:'(720 − 90) ÷ 720 × 100 = 87,5%.'},
  {q:'Si toda la ventana programada aparece como detención, ¿qué ocurre con la tasa por hora operativa?',a:['Se duplica.','Es cero toneladas por hora.','No se puede definir porque no hay horas operativas.'],correct:2,why:'El divisor sería cero: la tasa no está definida para ese caso.'}
];
let current = 0, answered = false, score = 0;
function renderQuestion() {
  const item = questions[current]; answered = false;
  document.getElementById('q-number').textContent = current + 1;
  document.getElementById('question').textContent = item.q;
  document.getElementById('feedback').textContent = '';
  const answers = document.getElementById('answers'); answers.replaceChildren();
  item.a.forEach((text, i) => { const button = document.createElement('button'); button.className = 'answer'; button.type = 'button'; button.textContent = text; button.addEventListener('click', () => selectAnswer(i)); answers.append(button); });
  const next = document.getElementById('next'); next.disabled = true; next.textContent = current === questions.length - 1 ? 'Finalizar →' : 'Siguiente pregunta →';
}
function selectAnswer(index) {
  if (answered) return;
  answered = true; const item = questions[current]; const buttons = [...document.querySelectorAll('.answer')];
  buttons.forEach((button, i) => { button.disabled = true; if (i === item.correct) button.classList.add('correct'); if (i === index && i !== item.correct) button.classList.add('incorrect'); });
  const correct = index === item.correct; if (correct) score++;
  document.getElementById('feedback').textContent = `${correct ? 'Correcto. ' : 'Revisa el concepto. '}${item.why}`;
  document.getElementById('next').disabled = false;
}
document.getElementById('next').addEventListener('click', () => {
  if (!answered) return;
  if (current < questions.length - 1) { current++; renderQuestion(); }
  else { document.getElementById('question').textContent = `Terminaste: ${score} de ${questions.length} respuestas correctas.`; document.getElementById('answers').replaceChildren(); document.getElementById('feedback').textContent = 'Puedes reiniciar la página para volver a practicar.'; document.getElementById('next').disabled = true; }
});
calculate(); renderQuestion();
