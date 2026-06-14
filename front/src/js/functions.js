// When the user clicks on the button, scroll to the top of the document
function topFunction() {
  // For Safari
  document.body.scrollTop = 0; 
  // For Chrome, Firefox, IE and Opera
  document.documentElement.scrollTop = 0; 
}

function nipah() {
  var audio = new Audio('audio/nipah-sound.mp3');
  audio.play();
}

async function getStatus() {
    try {
        const response = await fetch('/api/status');
        if (!response.ok) throw new Error(`Error HTTP: ${response.status}`);

        const data = await response.json();

        const readingEl = document.getElementById('status-reading');
        const messageEl = document.getElementById('status-message');

        if (readingEl) readingEl.textContent = data.Reading || 'Nada por ahora';
        if (messageEl) messageEl.textContent = data.Message || 'Sin mensaje';

    } catch (error) {
        console.error('Error cargando el estado desde el homelab:', error);
        if (document.getElementById('status-reading')) {
            document.getElementById('status-reading').textContent = '---';
            document.getElementById('status-message').textContent = '---';
        }
    }
}

