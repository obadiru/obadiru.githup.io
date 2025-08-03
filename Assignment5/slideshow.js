"use strict";

function setCookie(name, value, days) {
  let expires = "";
  if (days) {
    const d = new Date();
    d.setTime(d.getTime() + days*24*60*60*1000);
    expires = "; expires=" + d.toUTCString();
  }
  document.cookie = name + "=" + encodeURIComponent(value) + expires + "; path=/";
}

function getCookie(name) {
  const nameEQ = name + "=";
  const ca = document.cookie.split(';');
  for(let c of ca) {
    c = c.trim();
    if (c.indexOf(nameEQ) === 0) return decodeURIComponent(c.substring(nameEQ.length));
  }
  return null;
}

function eraseCookie(name) {
  setCookie(name, "", -1);
}

const favorites = [];
const maxFavorites = 5;

function saveFavoritesToCookie() {
  setCookie('favorites', JSON.stringify(favorites), 7);
}

function addToFavorites(imgSrc, titleText = "", skipPush = false) {
  const favoritesList = document.getElementById("favoritesList");
  const favCount = document.getElementById("favCount");
  const favMessage = document.getElementById("favMessage");

  if (!favoritesList || !favCount || !favMessage) return;

  if (favorites.includes(imgSrc)) {
    favMessage.textContent = "Image is already in your favorites.";
    return;
  }

  if (favorites.length >= maxFavorites && !skipPush) {
    favMessage.textContent = "Maximum of 5 favorites reached. Remove one to add more.";
    return;
  }

  const favDiv = document.createElement("div");
  favDiv.className = "favorite-item";

  const img = document.createElement("img");
  img.src = imgSrc;
  img.alt = titleText;
  img.style.width = "100px";
  img.style.cursor = "pointer";

  img.addEventListener("click", () => {
    favDiv.classList.toggle("clicked");
  });

  const removeBtn = document.createElement("button");
  removeBtn.textContent = "Remove";
  removeBtn.className = "remove-btn";

  removeBtn.onclick = function () {
    favoritesList.removeChild(favDiv);
    const index = favorites.indexOf(imgSrc);
    if (index !== -1) {
      favorites.splice(index, 1);
      saveFavoritesToCookie();
    }
    favCount.textContent = favorites.length;
    favMessage.textContent = "";
  };

  favDiv.appendChild(img);
  favDiv.appendChild(removeBtn);
  favoritesList.appendChild(favDiv);

  if (!skipPush) {
    favorites.push(imgSrc);
    saveFavoritesToCookie();
  }

  favCount.textContent = favorites.length;
  favMessage.textContent = "";
}

function loadFavoritesFromCookie() {
  const favCookie = getCookie('favorites');
  if (favCookie) {
    try {
      const savedFavorites = JSON.parse(favCookie);
      if (Array.isArray(savedFavorites)) {
        // Clear current favorites and UI
        favorites.length = 0;
        const favoritesList = document.getElementById("favoritesList");
        if (favoritesList) favoritesList.innerHTML = "";

        savedFavorites.forEach(imgSrc => addToFavorites(imgSrc, "", true));

        const favCount = document.getElementById("favCount");
        if (favCount) favCount.textContent = favorites.length;
      }
    } catch (e) {
      console.error("Could not parse favorites cookie:", e);
    }
  }
}

window.addEventListener("load", () => {
  createLightbox();
  loadFavoritesFromCookie();
});

function createLightbox() {
  let lightBox = document.getElementById("lightbox");

  let lbTitle = document.createElement("h1");
  let lbCounter = document.createElement("div");
  let lbPrev = document.createElement("div");
  let lbNext = document.createElement("div");
  let lbPlay = document.createElement("div");
  let lbImages = document.createElement("div");

  lightBox.appendChild(lbTitle);
  lbTitle.id = "lbTitle";
  lbTitle.textContent = lightboxTitle;

  lightBox.appendChild(lbCounter);
  lbCounter.id = "lbCounter";
  let currentImg = 1;
  lbCounter.textContent = currentImg + " / " + imgCount;

  lightBox.appendChild(lbPrev);
  lbPrev.id = "lbPrev";
  lbPrev.textContent = "\u25C0";  
  lbPrev.onclick = showPrev;

  lightBox.appendChild(lbNext);
  lbNext.id = "lbNext";
  lbNext.textContent = "\u25B6";  
  lbNext.onclick = showNext;

  lightBox.appendChild(lbPlay);
  lbPlay.id = "lbPlay";
  lbPlay.textContent = "\u25B6";  
  let timeID;
  lbPlay.onclick = function () {
    if (timeID) {
      window.clearInterval(timeID);
      timeID = undefined;
      lbPlay.textContent = "\u25B6";  
    } else {
      showNext();
      timeID = window.setInterval(showNext, 1500);
      lbPlay.textContent = "\u23F8";  
    }
  };

  lightBox.appendChild(lbImages);
  lbImages.id = "lbImages";

  for (let i = 0; i < imgCount; i++) {
    let image = document.createElement("img");
    image.src = imgFiles[i];
    image.alt = imgCaptions[i];
    image.onclick = createOverlay;
    lbImages.appendChild(image);
  }

  function showNext() {
    lbImages.appendChild(lbImages.firstElementChild);
    currentImg = (currentImg < imgCount) ? currentImg + 1 : 1;
    lbCounter.textContent = currentImg + " / " + imgCount;
  }

  function showPrev() {
    lbImages.insertBefore(lbImages.lastElementChild, lbImages.firstElementChild);
    currentImg = (currentImg > 1) ? currentImg - 1 : imgCount;
    lbCounter.textContent = currentImg + " / " + imgCount;
  }

  function createOverlay() {
    let overlay = document.createElement("div");
    overlay.id = "lbOverlay";

    let figureBox = document.createElement("figure");
    overlay.appendChild(figureBox);

    let overlayImage = this.cloneNode(true);
    figureBox.appendChild(overlayImage);

    let overlayCaption = document.createElement("figcaption");
    overlayCaption.textContent = this.alt;
    figureBox.appendChild(overlayCaption);

    let favBtn = document.createElement("button");
    favBtn.textContent = "❤️ Add to Favorites";
    favBtn.onclick = () => {
      addToFavorites(this.src, this.alt);
      document.body.removeChild(overlay);
    };
    figureBox.appendChild(favBtn);

    let closeBtn = document.createElement("button");
    closeBtn.textContent = "Close Window";
    closeBtn.onclick = () => {
      document.body.removeChild(overlay);
    };
    figureBox.appendChild(closeBtn);

    let closeBox = document.createElement("div");
    closeBox.id = "lbOverlayClose";
    closeBox.textContent = "×";
    closeBox.onclick = function () {
      document.body.removeChild(overlay);
    };
    overlay.appendChild(closeBox);

    document.body.appendChild(overlay);
  }
}
