// Duração - segundos
const duracaoLendo = 25 * 60;
const duracaoRefletir = 5 * 60;
const duracaoReler = 15 * 60;
let tempoRestante = duracaoLendo; // Inicializa com 25 minutos
let timer;
let ciclo = ["Lendo", "Refletir", "Lendo", "Refletir", "Lendo", "Refletir", "Lendo", "Reler"];
let etapaAtual = 0;
let tempoLeituraTotal = 0; 

// DOM Elements
const botaoLendo = document.getElementById("start");
const botaoRefletir = document.getElementById("pause");
const botaoReler = document.getElementById("reset");
const botaoPular = document.getElementById("skip");
const displayMinutos = document.getElementById("minutes");
const displaySegundos = document.getElementById("seconds");
const inputRegistro = document.getElementById("registro");
const listaDiario = document.getElementById("diario");
const containerDiario = document.querySelector(".diario");

localStorage.removeItem("diarioLeitura");

// Atualiza o timer no display
function atualizarTimer() {
    const minutos = Math.floor(tempoRestante / 60);
    const segundos = tempoRestante % 60;
    displayMinutos.textContent = String(minutos).padStart(2, '0');
    displaySegundos.textContent = String(segundos).padStart(2, '0');
}

// Registra a leitura no localStorage e atualiza a interface
function registrarLeitura() {
    const livro = inputRegistro.value;
    if (!livro) return;

    const leitura = {
        livro,
        tempo: tempoLeituraTotal,
        data: new Date().toLocaleString(),
    };
    
    let registros = JSON.parse(localStorage.getItem("diarioLeitura")) || [];
    registros.push(leitura);
    localStorage.setItem("diarioLeitura", JSON.stringify(registros));
    atualizarDiario();
    tempoLeituraTotal = 0;
}

// Atualiza a lista de registros na interface
function atualizarDiario() {
    listaDiario.innerHTML = "";
    const registros = JSON.parse(localStorage.getItem("diarioLeitura")) || [];
    if (registros.length === 0) {
        containerDiario.style.display = "none"; 
    } else {
        containerDiario.style.display = "block"; 
        registros.forEach(registro => {
            const item = document.createElement("li");
            item.textContent = `${registro.data} - Livro: ${registro.livro}, Tempo: ${Math.floor(registro.tempo / 60)} min`;
            listaDiario.appendChild(item);
        });
    }
}

// Inicia o timer
function iniciarTimer(duracao) {
    if (timer) clearInterval(timer);
    tempoRestante = duracao;
    atualizarTimer();

    timer = setInterval(() => {
        tempoRestante--;
        tempoLeituraTotal++;
        atualizarTimer();

        if (tempoRestante <= 0) {
            pularEtapa();
        }
    }, 1000);
}

// Avança para a próxima etapa no ciclo, registrando ao final do ciclo completo
function pularEtapa() {
    clearInterval(timer);

    if (ciclo[etapaAtual] === "Reler") {
        registrarLeitura();
        etapaAtual = 0;
    } else {
        etapaAtual = (etapaAtual + 1) % ciclo.length;
    }

    switch (ciclo[etapaAtual]) {
        case "Lendo":
            iniciarTimer(duracaoLendo);
            break;
        case "Refletir":
            iniciarTimer(duracaoRefletir);
            break;
        case "Reler":
            iniciarTimer(duracaoReler);
            break;
    }
}

// Event Listeners para os botões
botaoLendo.addEventListener("click", () => iniciarTimer(duracaoLendo));
botaoRefletir.addEventListener("click", () => iniciarTimer(duracaoRefletir));
botaoReler.addEventListener("click", () => iniciarTimer(duracaoReler));
botaoPular.addEventListener("click", () => {
    registrarLeitura();
    pularEtapa();
});

// Inicializa o timer e o diário na primeira execução
atualizarTimer();
atualizarDiario();
