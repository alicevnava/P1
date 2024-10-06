// Variáveis - duração em segundos
let duracao = 25 * 60; 
let intervaloCurto = 5 * 60; 
let intervaloLongo = 15 * 60; 
let tempoRestante = duracao;
let timer; 
let pausado = false;
let ciclos = 0;

// DOM
const botaoIniciar = document.getElementById("start");
const botaoPausar = document.getElementById("pause");
const botaoReiniciar = document.getElementById("reset");
const botaoPular = document.getElementById("skip");
const displayMinutos = document.getElementById("minutes");
const displaySegundos = document.getElementById("seconds");
const campoRegistro = document.getElementById("registro");
const listaDiario = document.getElementById("diario");

// Funções

// Atualiza o timer
function atualizarTimer() {
    const minutos = Math.floor(tempoRestante / 60);
    const segundos = tempoRestante % 60;

    displayMinutos.textContent = String(minutos).padStart(2, '0');
    displaySegundos.textContent = String(segundos).padStart(2, '0');
}

// Controlar tempo
function iniciarTimer() {
    timer = setInterval(() => {
        tempoRestante--;
        atualizarTimer();

        if (tempoRestante <= 0) {
            pular();
        }
    }, 1000);
}

// Mudar fase
function pular() {
    clearInterval(timer);

    if (ciclos % 4 === 0 && ciclos !== 0) {
        tempoRestante = intervaloLongo; 
    } else {
        tempoRestante = (pausado) ? intervaloCurto : duracao; 
        if (!pausado) {
            ciclos++; 
        }
    }

    pausado = !pausado; 
    atualizarTimer(); 
}

// Armazenar dados
let logDeTarefas = JSON.parse(localStorage.getItem("pomodoroLog")) || [];

function registrarTarefa(tarefa) {
    let termino = new Date().toLocaleTimeString();
    logDeTarefas.push({
        tarefa: tarefa,
        hora: termino
    });
    localStorage.setItem("pomodoroLog", JSON.stringify(logDeTarefas));

    // Atualiza a lista no diário
    const li = document.createElement("li");
    li.textContent = `Leitura: ${tarefa}, Hora: ${termino}`;
    listaDiario.appendChild(li);
}

// Event Listeners
botaoIniciar.addEventListener("click", () => {
    if (!timer) iniciarTimer();
});

botaoPausar.addEventListener("click", () => {
    clearInterval(timer); 
    pausado = true; 
});

botaoReiniciar.addEventListener("click", () => {
    clearInterval(timer); 
    tempoRestante = duracao; 
    atualizarTimer();
});

botaoPular.addEventListener("click", () => {
    const tarefa = campoRegistro.value.trim(); 
    if (tarefa) {
        registrarTarefa(tarefa); 
        campoRegistro.value = ""; 
    }
    pular(); 
});

// Inicializa o timer na primeira execução
atualizarTimer(); 

