//Form redirect and submit
const form = document.querySelector("div#Contacto form");
    
form.addEventListener("submit", async function (e) {
    e.preventDefault(); // Impede o submit padrão

    const formData = new FormData(form);

    const response = await fetch("https://formsubmit.co/e5147151c2d64e4ceaf0a9c445101848", {
        method: "POST",
        body: formData,
    });

    if (response.ok) {
        window.location.href = "/email.html"; // redireciona só depois de sucesso
    } else {
        alert("Houve um erro. Tenta novamente.");
    }
});


// Automatic scroll to merchandise caroussel
const carousel = document.querySelector('section#Merchandise div:nth-child(2)');
let direction = 1; // 1 = direita, -1 = esquerda
let speed = 0.5; // pixels por frame
let scroll = () => {
    carousel.scrollLeft += direction * speed;

    // Muda de direção ao chegar ao fim ou início
    if (carousel.scrollLeft + carousel.clientWidth >= carousel.scrollWidth) {
        direction = -1;
    } else if (carousel.scrollLeft <= 0) {
        direction = 1;
    }
  
    requestAnimationFrame(scroll);
};
requestAnimationFrame(scroll);

// Scroll to top button
const toTopButton = document.getElementById('ToTop');
window.onscroll = function() {
    if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
        toTopButton.style.display = "block";
    } else {
        toTopButton.style.display = "none";
    }
};
toTopButton.onclick = function() {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
};


//Automatic image slider
const slides = document.querySelectorAll('div#SliderPictures img');
let current = 0;

function showNextSlide() {
    slides[current].classList.remove('!opacity-100');
    current = (current + 1) % slides.length;
    slides[current].classList.add('!opacity-100');
}

setInterval(showNextSlide, 4000); // troca a cada 3 segundos

//Show collection of event pictures
function ShowEventCollection(collection){    
    switch(collection){ //Add more cases for other collections
        case 0: //Fevereiro 24-26  
            const fevereiroCollection = document.querySelector('#Collection0');
            fevereiroCollection.classList.toggle('hidden');
            document.body.classList.toggle('overflow-hidden');
            break;
        case 1: //Abril 2  
            const abrilCollection = document.querySelector('#Collection1');
            abrilCollection.classList.toggle('hidden');
            document.body.classList.toggle('overflow-hidden');
            break;
        case 2://Junho 28 e 29
            const junhoCollection = document.querySelector('#Collection2');
            junhoCollection.classList.toggle('hidden');
            document.body.classList.toggle('overflow-hidden');
            break;
    }
}