/* Foothills Repertory Theatre — site behaviour */

/* ---------- Seat selection ---------- */

var picked = [];

function seatClicked(btn) {
  if (btn.getAttribute('data-state') === 'taken') { return; }

  var label = btn.getAttribute('aria-label');
  var price = parseInt(btn.getAttribute('data-price'), 10);

  if (btn.getAttribute('data-state') === 'picked') {
    btn.setAttribute('data-state', 'open');
    picked = picked.filter(function (s) { return s.label !== label; });
  } else {
    btn.setAttribute('data-state', 'picked');
    picked.push({ label: label, price: price });
  }

  var out = document.getElementById('order-summary');
  if (!out) { return; }
  if (picked.length === 0) {
    out.textContent = 'No seats selected.';
  } else {
    var total = picked.reduce(function (sum, s) { return sum + s.price; }, 0);
    var noun = picked.length === 1 ? ' seat selected, $' : ' seats selected, $';
    out.textContent = picked.length + noun + total + '.00 total';
  }
}

/* ---------- Accessible seating modal ---------- */

function openAccessModal() {
  var m = document.getElementById('access-modal');
  m.classList.add('open');
}

function closeAccessModal() {
  document.getElementById('access-modal').classList.remove('open');
}

/* ---------- Checkout validation ---------- */

function validateCheckout(e) {
  e.preventDefault();

  var form = document.getElementById('pay');
  var problems = [];

  var fields = [
    { id: 'name',   message: 'Enter a name.' },
    { id: 'email',  message: 'Enter a valid email address.' },
    { id: 'card',   message: 'Enter a card number.' },
    { id: 'expiry', message: 'Enter an expiry date in MM/YYYY format.' },
    { id: 'cvv',    message: 'Enter a CVV.' },
    { id: 'zip',    message: 'Enter a billing postcode.' }
  ];

  fields.forEach(function (f) {
    var el = document.getElementById(f.id);
    if (el && el.value.trim() === '') { problems.push(f); }
  });

  var email = document.getElementById('email');
  if (email && email.value.trim() !== '' && email.value.indexOf('@') === -1) {
    problems.push({ id: 'email', message: 'Enter a valid email address.' });
  }

  // Clear any previously rendered messages.
  Array.prototype.forEach.call(form.querySelectorAll('.error-text'), function (n) {
    n.parentNode.removeChild(n);
  });

  if (problems.length === 0) {
    window.location = 'confirmation.html';
    return;
  }

  problems.forEach(function (p) {
    var el = document.getElementById(p.id);
    if (!el) { return; }
    var msg = document.createElement('p');
    msg.className = 'error-text';
    msg.textContent = p.message;
    el.parentNode.insertBefore(msg, el);
  });
}

/* ---------- Wiring ---------- */

document.addEventListener('DOMContentLoaded', function () {
  Array.prototype.forEach.call(document.querySelectorAll('.seat'), function (btn) {
    btn.addEventListener('click', function () { seatClicked(btn); });
  });

  var form = document.getElementById('pay');
  if (form) {
    form.addEventListener('submit', validateCheckout);
  }
});
