'use strict';
document.querySelectorAll('.mr-assistant-details').forEach(details => details.addEventListener('toggle', () => { const frame = details.querySelector('iframe'); if (details.open && frame && !frame.hasAttribute('src')) frame.src = frame.dataset.src; }));
