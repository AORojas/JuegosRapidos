let localGamesCache = [];
let retroGamesCache = [];

document.addEventListener("DOMContentLoaded", async () => {
  updateVisitCounter();
  localGamesCache = await loadLocalGames();
  retroGamesCache = await loadRetroGames();
  renderRetroSelection(retroGamesCache);
  setupShuffleButton();
  setupGameModal();
  setupHeroLogoToggle();
  enableRevealAnimations();
  addCardTiltEffect(".project");
});

function setupHeroLogoToggle() {
  const logoWrap = document.querySelector(".hero-logo-wrap");
  const logoImage = document.querySelector(".neon-ps-logo");
  if (!(logoWrap instanceof HTMLElement) || !(logoImage instanceof HTMLElement)) return;

  const animationDurationMs = 1250;
  let cleanupTimer = null;
  let isPointerOnVisiblePixel = false;
  let isTrackingInside = false;
  let alphaCanvas = null;
  let alphaContext = null;

  const buildAlphaMap = () => {
    const naturalWidth = logoImage.naturalWidth;
    const naturalHeight = logoImage.naturalHeight;
    if (!naturalWidth || !naturalHeight) return false;

    alphaCanvas = document.createElement("canvas");
    alphaCanvas.width = naturalWidth;
    alphaCanvas.height = naturalHeight;
    alphaContext = alphaCanvas.getContext("2d", { willReadFrequently: true });
    if (!alphaContext) return false;

    alphaContext.drawImage(logoImage, 0, 0, naturalWidth, naturalHeight);
    return true;
  };

  const clearEffectClasses = () => {
    logoWrap.classList.remove("logo-turning-on", "logo-turning-off");
  };

  const queueToggle = () => {
    window.clearTimeout(cleanupTimer);

    const isLit = logoWrap.classList.contains("logo-lit");
    logoWrap.dataset.nextState = isLit ? "off" : "on";
    clearEffectClasses();
    logoWrap.classList.add(isLit ? "logo-turning-off" : "logo-turning-on");
  };

  const commitToggle = () => {
    const nextState = logoWrap.dataset.nextState;
    if (!nextState) return;

    if (nextState === "on") {
      logoWrap.classList.add("logo-lit");
    } else {
      logoWrap.classList.remove("logo-lit");
    }

    cleanupTimer = window.setTimeout(() => {
      clearEffectClasses();
      delete logoWrap.dataset.nextState;
    }, animationDurationMs);
  };

  const isOverVisiblePixel = (event) => {
    if (!alphaContext && !buildAlphaMap()) return true;

    const bounds = logoImage.getBoundingClientRect();
    const relativeX = event.clientX - bounds.left;
    const relativeY = event.clientY - bounds.top;

    if (relativeX < 0 || relativeY < 0 || relativeX > bounds.width || relativeY > bounds.height) {
      return false;
    }

    const pixelX = Math.floor((relativeX / bounds.width) * logoImage.naturalWidth);
    const pixelY = Math.floor((relativeY / bounds.height) * logoImage.naturalHeight);
    const alphaValue = alphaContext.getImageData(pixelX, pixelY, 1, 1).data[3];
    return alphaValue > 20;
  };

  const handlePointerMove = (event) => {
    if (!isTrackingInside) return;

    const overVisiblePixel = isOverVisiblePixel(event);
    if (overVisiblePixel === isPointerOnVisiblePixel) return;

    isPointerOnVisiblePixel = overVisiblePixel;

    if (overVisiblePixel) {
      queueToggle();
      return;
    }

    commitToggle();
  };

  const startTracking = (event) => {
    isTrackingInside = true;
    isPointerOnVisiblePixel = isOverVisiblePixel(event);
    if (isPointerOnVisiblePixel) {
      queueToggle();
    }
  };

  const stopTracking = () => {
    if (isPointerOnVisiblePixel) {
      commitToggle();
    }

    isTrackingInside = false;
    isPointerOnVisiblePixel = false;
  };

  if (logoImage.complete) {
    buildAlphaMap();
  } else {
    logoImage.addEventListener("load", buildAlphaMap, { once: true });
  }

  logoImage.addEventListener("pointerenter", startTracking);
  logoImage.addEventListener("pointermove", handlePointerMove);
  logoImage.addEventListener("pointerleave", stopTracking);

  logoImage.addEventListener("mouseleave", () => {
    if (!isTrackingInside) return;
    stopTracking();
  });
}

function updateVisitCounter() {
  const key = "juegosRapidosVisits";
  const counter = document.getElementById("visit-counter");
  if (!counter) return;

  const storedVisits = Number.parseInt(localStorage.getItem(key) || "0", 10);
  const nextVisits = Number.isNaN(storedVisits) ? 1 : storedVisits + 1;

  localStorage.setItem(key, String(nextVisits));
  counter.textContent = nextVisits.toLocaleString("es-AR");
}

async function loadLocalGames() {
  const gamesContainer = document.getElementById("games-grid");
  const gamesTotal = document.getElementById("games-total");
  if (!gamesContainer || !gamesTotal) return [];

  try {
    const response = await fetch("./games.json", { cache: "no-store" });
    if (!response.ok) throw new Error("No se pudo cargar games.json");

    const games = await response.json();
    if (!Array.isArray(games) || !games.length) {
      gamesContainer.innerHTML = emptyStateMarkup("No hay juegos cargados todavia.");
      gamesTotal.textContent = "0";
      return [];
    }

    gamesContainer.innerHTML = games.map(createLocalGameCardMarkup).join("");
    gamesTotal.textContent = String(games.length);
    return games;
  } catch (error) {
    gamesContainer.innerHTML = emptyStateMarkup("No se pudieron cargar tus juegos.");
    gamesTotal.textContent = "0";
    console.error(error);
    return [];
  }
}

async function loadRetroGames() {
  try {
    const response = await fetch("./retro-games.json", { cache: "no-store" });
    if (!response.ok) throw new Error("No se pudo cargar retro-games.json");

    const games = await response.json();
    if (!Array.isArray(games)) return [];
    return games;
  } catch (error) {
    console.error(error);
    return [];
  }
}

function createLocalGameCardMarkup(game) {
  const title = game.title || "Juego sin titulo";
  const category = game.category || "General";
  const description = game.description || "Descripcion no disponible.";
  const playUrl = game.playUrl || "#";
  const repoUrl = game.repoUrl || "#";
  const stack = Array.isArray(game.stack) ? game.stack : [];
  const stackMarkup = stack.map((item) => `<span>${item}</span>`).join("");

  return `
    <article class="project reveal">
      <span class="badge">${category}</span>
      <h3>${title}</h3>
      <p>${description}</p>
      <div class="stack-chips stack-chips-game">${stackMarkup}</div>
      <div class="actions">
        <a class="btn btn-play" href="${playUrl}" target="_blank" rel="noopener noreferrer">Jugar</a>
        <a class="btn btn-code" href="${repoUrl}" target="_blank" rel="noopener noreferrer">Ver Codigo</a>
      </div>
    </article>
  `;
}

function createRetroGameCardMarkup(game) {
  const title = game.title || "Clasico sin titulo";
  const category = game.category || "Retro";
  const description = game.description || "Juego clasico disponible online.";
  const platform = game.platform || "Retro";
  const founded = game.founded || "Dato no disponible";
  const creator = game.creator || "Autor no disponible";
  const source = game.source || "Fuente externa";
  const playUrl = game.playUrl || "#";
  const tech = Array.isArray(game.tech) ? game.tech : [];
  const techText = tech.length ? tech.join(", ") : "No especificadas.";
  const embeddable = Boolean(game.embeddable);
  const playControl = embeddable
    ? `<button class="btn btn-play launch-retro" type="button" data-game-url="${playUrl}" data-game-title="${title}">Jugar Aqui</button>`
    : `<a class="btn btn-play" href="${playUrl}" target="_blank" rel="noopener noreferrer">Jugar Ahora</a>`;
  const hint = embeddable
    ? `<p class="embed-hint">Compatible con juego dentro de esta pagina.</p>`
    : `<p class="embed-hint">Este sitio no permite iframe, se abre directo en su pagina.</p>`;

  return `
    <article class="project reveal external-project">
      <span class="badge">${category}</span>
      <h3>${title}</h3>
      <p>${description}</p>
      <div class="stack-chips stack-chips-game">
        <span>${platform}</span>
        <span>${source}</span>
      </div>
      <p class="embed-hint"><strong>Fundacion / Lanzamiento:</strong> ${founded}</p>
      <p class="embed-hint"><strong>Creador:</strong> ${creator}</p>
      <p class="embed-hint"><strong>Tecnologias:</strong> ${techText}</p>
      ${hint}
      <div class="actions">
        ${playControl}
        <a class="btn btn-code" href="${playUrl}" target="_blank" rel="noopener noreferrer">Abrir Original</a>
      </div>
    </article>
  `;
}

function renderRetroSelection(games) {
  const container = document.getElementById("random-games-grid");
  if (!container) return;

  if (!Array.isArray(games) || !games.length) {
    container.innerHTML = emptyStateMarkup("No se encontro seleccion retro por ahora.");
    return;
  }

  const selection = shuffleArray(games).slice(0, Math.min(6, games.length));
  container.innerHTML = selection.map(createRetroGameCardMarkup).join("");

  enableRevealAnimations();
  addCardTiltEffect("#random-games-grid .project");
}

function setupShuffleButton() {
  const button = document.getElementById("shuffle-random-games");
  if (!button) return;

  button.addEventListener("click", () => {
    renderRetroSelection(retroGamesCache);
  });
}

function setupGameModal() {
  const modal = document.getElementById("game-modal");
  const closeButton = document.getElementById("close-game-modal");
  const frame = document.getElementById("game-frame");
  const modalTitle = document.getElementById("game-modal-title");
  const openOriginal = document.getElementById("open-original-game");
  const retroGrid = document.getElementById("random-games-grid");

  if (!modal || !closeButton || !frame || !modalTitle || !openOriginal || !retroGrid) return;

  retroGrid.addEventListener("click", (event) => {
    const target = event.target;
    if (!(target instanceof HTMLElement)) return;

    const launchButton = target.closest(".launch-retro");
    if (!launchButton) return;

    const gameUrl = launchButton.getAttribute("data-game-url");
    const gameTitle = launchButton.getAttribute("data-game-title");
    if (!gameUrl) return;

    modalTitle.textContent = gameTitle || "Jugar";
    frame.src = gameUrl;
    openOriginal.href = gameUrl;
    modal.classList.add("open");
    modal.setAttribute("aria-hidden", "false");
    document.body.classList.add("modal-open");
  });

  closeButton.addEventListener("click", closeGameModal);
  modal.addEventListener("click", (event) => {
    const target = event.target;
    if (!(target instanceof HTMLElement)) return;
    if (target.dataset.closeModal === "true") closeGameModal();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && modal.classList.contains("open")) {
      closeGameModal();
    }
  });

  function closeGameModal() {
    modal.classList.remove("open");
    modal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("modal-open");
    frame.src = "";
  }
}

function shuffleArray(items) {
  const copy = [...items];

  for (let index = copy.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    [copy[index], copy[randomIndex]] = [copy[randomIndex], copy[index]];
  }

  return copy;
}

function emptyStateMarkup(message) {
  return `
    <article class="project reveal">
      <h3>Sin datos</h3>
      <p>${message}</p>
    </article>
  `;
}

function enableRevealAnimations() {
  const items = document.querySelectorAll(".reveal:not(.visible)");
  if (!items.length) return;

  const observer = new IntersectionObserver(
    (entries, currentObserver) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("visible");
        currentObserver.unobserve(entry.target);
      });
    },
    { threshold: 0.15 }
  );

  items.forEach((item) => observer.observe(item));
}

function addCardTiltEffect(selector) {
  const cards = document.querySelectorAll(selector);

  cards.forEach((card) => {
    if (card.dataset.tiltEnabled === "true") return;
    card.dataset.tiltEnabled = "true";

    card.addEventListener("mousemove", (event) => {
      const bounds = card.getBoundingClientRect();
      const x = event.clientX - bounds.left;
      const y = event.clientY - bounds.top;

      const rotateY = (x / bounds.width - 0.5) * 4;
      const rotateX = (y / bounds.height - 0.5) * -4;

      card.style.transform = `translateY(-6px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg)`;
    });

    card.addEventListener("mouseleave", () => {
      card.style.transform = "translateY(0) rotateX(0) rotateY(0)";
    });
  });
}
