function initPremio() {
    const img  = document.getElementById('premio-img');
    const bill = document.getElementById('money-bill');
    const coin = document.getElementById('money-coin');

    function onPremioClick() {
        const audio = new Audio('audio/Slot.mp3');
        audio.volume = 0.4;
        audio.play();

        img.removeEventListener('click', onPremioClick);
        bill.style.display = 'block';
        coin.style.display = 'block';

        setTimeout(() => {
            bill.style.display = 'none';
            coin.style.display = 'none';
            img.addEventListener('click', onPremioClick);
        }, 3000);
    }

    img.addEventListener('click', onPremioClick);
}

function initWaow() {
    document.getElementById('waow').addEventListener('click', () => {
        new Audio('audio/waow.ogg').play();
    });
}

function initWarning() {
    attachWarningListeners(document.getElementById('warning-img'));
}

function attachWarningListeners(el) {
    el.addEventListener('click', playXPSound);
    el.addEventListener('click', cloneWarning);
}

function playXPSound() {
    const audio = new Audio('audio/XP_error.mp3');
    audio.volume = 0.4;
    audio.play();
}

function cloneWarning(event) {
    const clone = document.createElement('img');
    clone.src               = '/img/warning.png';
    clone.style.cursor      = 'pointer';
    clone.draggable         = false;
    clone.style.userSelect  = 'none';
    clone.style.position    = 'absolute';

    const distance = 100;
    clone.style.top  = (event.pageY + (Math.random() * 2 - 1) * distance) + 'px';
    clone.style.left = (event.pageX + (Math.random() * 2 - 1) * distance) + 'px';

    attachWarningListeners(clone);
    document.body.appendChild(clone);
}

document.addEventListener('DOMContentLoaded', () => {
    initPremio();
    initWaow();
    initWarning();
});
