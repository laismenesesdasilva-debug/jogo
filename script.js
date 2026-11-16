const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const telaInicial = document.getElementById("telaInicial");
const telaFim = document.getElementById("telaFim");
const elPontos = document.getElementById("pontos");
const elRecorde = document.getElementById("recorde");
const elPontosFinal = document.getElementById("pontosFinal");
const elRecordeFinal = document.getElementById("recordeFinal");

const tamanho = 20;
const colunas = canvas.width / tamanho;

let cobra;
let direcao;
let comida;
let pontos;
let intervalo;
let recorde = Number(localStorage.getItem("recorde")) || 0;

elRecorde.textContent = recorde;

function iniciar() {
  cobra = [
    { x: 5, y: 10 },
    { x: 4, y: 10 },
    { x: 3, y: 10 },
  ];
  direcao = { x: 1, y: 0 };
  pontos = 0;
  elPontos.textContent = pontos;

  criarComida();

  telaInicial.classList.add("escondido");
  telaFim.classList.add("escondido");

  clearInterval(intervalo);
  intervalo = setInterval(atualizar, 120);
}

function criarComida() {
  comida = {
    x: Math.floor(Math.random() * colunas),
    y: Math.floor(Math.random() * colunas),
  };

  // se a comida nascer em cima da cobra, sorteia de novo
  for (let i = 0; i < cobra.length; i++) {
    if (cobra[i].x === comida.x && cobra[i].y === comida.y) {
      criarComida();
      return;
    }
  }
}

function atualizar() {
  const cabeca = {
    x: cobra[0].x + direcao.x,
    y: cobra[0].y + direcao.y,
  };

  // bateu na parede
  if (cabeca.x < 0 || cabeca.x >= colunas || cabeca.y < 0 || cabeca.y >= colunas) {
    fimDeJogo();
    return;
  }

  // bateu no próprio corpo
  for (let i = 0; i < cobra.length; i++) {
    if (cobra[i].x === cabeca.x && cobra[i].y === cabeca.y) {
      fimDeJogo();
      return;
    }
  }

  cobra.unshift(cabeca);

  if (cabeca.x === comida.x && cabeca.y === comida.y) {
    pontos++;
    elPontos.textContent = pontos;
    criarComida();
  } else {
    cobra.pop();
  }

  desenhar();
}

function desenhar() {
  // fundo
  ctx.fillStyle = "#fdf0f7";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // comida
  ctx.fillStyle = "#ff7eb3";
  ctx.beginPath();
  ctx.arc(
    comida.x * tamanho + tamanho / 2,
    comida.y * tamanho + tamanho / 2,
    tamanho / 2 - 2,
    0,
    Math.PI * 2
  );
  ctx.fill();

  // cobra
  for (let i = 0; i < cobra.length; i++) {
    ctx.fillStyle = i === 0 ? "#9b6fd6" : "#c3a3f0";
    ctx.fillRect(cobra[i].x * tamanho + 1, cobra[i].y * tamanho + 1, tamanho - 2, tamanho - 2);
  }
}

function fimDeJogo() {
  clearInterval(intervalo);

  if (pontos > recorde) {
    recorde = pontos;
    localStorage.setItem("recorde", recorde);
  }

  elRecorde.textContent = recorde;
  elPontosFinal.textContent = pontos;
  elRecordeFinal.textContent = recorde;
  telaFim.classList.remove("escondido");
}

document.addEventListener("keydown", function (e) {
  if (e.key === "ArrowUp" && direcao.y !== 1) {
    direcao = { x: 0, y: -1 };
  } else if (e.key === "ArrowDown" && direcao.y !== -1) {
    direcao = { x: 0, y: 1 };
  } else if (e.key === "ArrowLeft" && direcao.x !== 1) {
    direcao = { x: -1, y: 0 };
  } else if (e.key === "ArrowRight" && direcao.x !== -1) {
    direcao = { x: 1, y: 0 };
  }

  // evita que a página role com as setas
  if (e.key.startsWith("Arrow")) {
    e.preventDefault();
  }
});

document.getElementById("btnIniciar").addEventListener("click", iniciar);
document.getElementById("btnReiniciar").addEventListener("click", iniciar);
