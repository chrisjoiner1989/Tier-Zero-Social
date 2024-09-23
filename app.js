// Add this near the top of your file
const TCG_API_KEY = "YOUR_TCG_API_KEY_HERE"; // Replace with your actual API key

// Function to fetch card price from TCGplayer
async function fetchCardPrice(cardName, gameType) {
  const url = `https://api.tcgplayer.com/v1.39.0/pricing/product`;
  const queryParams = new URLSearchParams({
    productName: cardName,
    groupName: gameType,
  });

  try {
    const response = await fetch(`${url}?${queryParams}`, {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${TCG_API_KEY}`,
      },
    });

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const data = await response.json();
    return data.results[0]; // Assuming we want the first result
  } catch (error) {
    console.error("Error fetching card price:", error);
    return null;
  }
}

// Function to display card price
function displayCardPrice(priceData) {
  const priceDisplay = document.getElementById("price-display");
  if (priceData && priceData.marketPrice) {
    priceDisplay.innerHTML = `
            <h3>Price Information</h3>
            <p>Market Price: $${priceData.marketPrice.toFixed(2)}</p>
            <p>Low Price: $${
              priceData.lowPrice ? priceData.lowPrice.toFixed(2) : "N/A"
            }</p>
            <p>Mid Price: $${
              priceData.midPrice ? priceData.midPrice.toFixed(2) : "N/A"
            }</p>
            <p>High Price: $${
              priceData.highPrice ? priceData.highPrice.toFixed(2) : "N/A"
            }</p>
        `;
  } else {
    priceDisplay.innerHTML = "<p>Price information not available.</p>";
  }
}

// Function to fetch Pokémon card image
async function fetchPokemonCardImage(cardName) {
  try {
    const response = await fetch(
      `https://api.pokemontcg.io/v2/cards?q=name:"${cardName}"`
    );
    const data = await response.json();
    if (data.data && data.data.length > 0) {
      return data.data[0].images.small;
    }
    return null;
  } catch (error) {
    console.error("Error fetching Pokémon card image:", error);
    return null;
  }
}

// Function to fetch Yu-Gi-Oh! card image
async function fetchYugiohCardImage(cardName) {
  try {
    const response = await fetch(
      `https://db.ygoprodeck.com/api/v7/cardinfo.php?name=${encodeURIComponent(
        cardName
      )}`
    );
    const data = await response.json();
    if (data.data && data.data.length > 0) {
      return data.data[0].card_images[0].image_url;
    }
    return null;
  } catch (error) {
    console.error("Error fetching Yu-Gi-Oh! card image:", error);
    return null;
  }
}

// Function to fetch MTG card image
async function fetchMtgCardImage(cardName) {
  try {
    const response = await fetch(
      `https://api.scryfall.com/cards/named?fuzzy=${encodeURIComponent(
        cardName
      )}`
    );
    const data = await response.json();
    if (data.image_uris) {
      return data.image_uris.normal;
    }
    return null;
  } catch (error) {
    console.error("Error fetching MTG card image:", error);
    return null;
  }
}

// Function to fetch Lorcana card image
async function fetchLorcanaCardImage(cardName) {
  try {
    const response = await fetch(
      `https://api.lorcana.com/cards?name=${encodeURIComponent(cardName)}`
    );
    const data = await response.json();
    if (data.cards && data.cards.length > 0) {
      return data.cards[0].imageUrl;
    }
    return null;
  } catch (error) {
    console.error("Error fetching Lorcana card image:", error);
    return null;
  }
}

// Function to display card image
function displayCardImage(imageUrl) {
  const imageDisplay = document.getElementById("image-display");
  if (imageUrl) {
    imageDisplay.innerHTML = `<img src="${imageUrl}" alt="Card Image" class="card-image">`;
  } else {
    imageDisplay.innerHTML = "<p>Card image not available.</p>";
  }
}

// Function to search for a card
async function searchCard(cardName, gameType) {
  let imageUrl = null;

  switch (gameType.toLowerCase()) {
    case "pokemon":
      imageUrl = await fetchPokemonCardImage(cardName);
      break;
    case "yugioh":
      imageUrl = await fetchYugiohCardImage(cardName);
      break;
    case "mtg":
      imageUrl = await fetchMtgCardImage(cardName);
      break;
    case "lorcana":
      imageUrl = await fetchLorcanaCardImage(cardName);
      break;
    default:
      console.error("Invalid game type");
  }

  displayCardImage(imageUrl);

  // Fetch and display price
  const priceData = await fetchCardPrice(cardName, gameType);
  displayCardPrice(priceData);
}

// D&D Game Room Functionality
function initializeDndGameRoom() {
  const rollDiceButton = document.getElementById("roll-dice");
  const rollResult = document.getElementById("roll-result");
  const sendMessageButton = document.getElementById("send-message");
  const chatInput = document.getElementById("chat-input");
  const chatMessages = document.getElementById("chat-messages");

  if (rollDiceButton) {
    // Dice Rolling
    rollDiceButton.addEventListener("click", function () {
      const diceType = document.getElementById("dice-type").value;
      const result = Math.floor(Math.random() * parseInt(diceType)) + 1;
      rollResult.textContent = `You rolled a ${result} on a d${diceType}`;
    });

    // Chat System
    sendMessageButton.addEventListener("click", sendMessage);
    chatInput.addEventListener("keypress", function (e) {
      if (e.key === "Enter") {
        sendMessage();
      }
    });

    function sendMessage() {
      const message = chatInput.value.trim();
      if (message) {
        const characterName =
          document.getElementById("character-name").value || "Anonymous";
        const messageElement = document.createElement("p");
        messageElement.textContent = `${characterName}: ${message}`;
        chatMessages.appendChild(messageElement);
        chatInput.value = "";
        chatMessages.scrollTop = chatMessages.scrollHeight;
      }
    }

    // Character Sheet (basic functionality)
    const characterInputs = document.querySelectorAll(".character-sheet input");
    characterInputs.forEach((input) => {
      input.addEventListener("change", function () {
        // Here you could add logic to update character stats, save to local storage, etc.
        console.log(`Updated ${input.id}: ${input.value}`);
      });
    });
  }
}

// Dark mode toggle
function initializeDarkModeToggle() {
  const modeToggle = document.querySelector(".mode-toggle");
  if (modeToggle) {
    modeToggle.addEventListener("click", function () {
      document.body.classList.toggle("dark-mode");
      localStorage.setItem(
        "darkMode",
        document.body.classList.contains("dark-mode")
      );
      updateModeToggleText();
    });

    // Check for saved user preference
    const savedMode = localStorage.getItem("darkMode");
    if (savedMode === "true") {
      document.body.classList.add("dark-mode");
    }
    updateModeToggleText();
  }
}

function updateModeToggleText() {
  const modeToggle = document.querySelector(".mode-toggle");
  if (document.body.classList.contains("dark-mode")) {
    modeToggle.textContent = "☀️";
    modeToggle.title = "Switch to Light Mode";
  } else {
    modeToggle.textContent = "🌙";
    modeToggle.title = "Switch to Dark Mode";
  }
}

// Smooth scrolling for anchor links
function initializeSmoothScrolling() {
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();
      document.querySelector(this.getAttribute("href")).scrollIntoView({
        behavior: "smooth",
      });
    });
  });
}

// Initialize decks page functionality
function initializeDecksPage() {
  const createDeckForm = document.getElementById("create-deck-form");
  const decksContainer = document.querySelector(".decks-container");

  if (createDeckForm) {
    createDeckForm.addEventListener("submit", function (event) {
      event.preventDefault();

      const deckName = document.getElementById("deck-name").value;
      const deckDescription = document.getElementById("deck-description").value;

      const deckElement = document.createElement("div");
      deckElement.classList.add("card", "deck");
      deckElement.innerHTML = `
                <h2>${deckName}</h2>
                <p>${deckDescription}</p>
                <button class="view-deck">View Deck</button>
            `;

      decksContainer.appendChild(deckElement);

      // Clear the form
      createDeckForm.reset();

      // Add animation to the new deck
      setTimeout(() => {
        deckElement.style.opacity = "1";
        deckElement.style.transform = "translateY(0)";
      }, 10);
    });
  }

  // Event delegation for view deck buttons
  if (decksContainer) {
    decksContainer.addEventListener("click", function (event) {
      if (event.target.classList.contains("view-deck")) {
        alert("View deck functionality not implemented yet.");
      }
    });
  }
}

// Initialize profile page functionality
function initializeProfilePage() {
  const editProfileButton = document.getElementById("edit-profile");
  const logoutButton = document.getElementById("logout");

  if (editProfileButton) {
    editProfileButton.addEventListener("click", function () {
      alert("Edit profile functionality not implemented yet.");
    });
  }

  if (logoutButton) {
    logoutButton.addEventListener("click", function () {
      alert("Logout functionality not implemented yet.");
    });
  }
}

// Initialize events page functionality
function initializeEventsPage() {
  const viewEventButtons = document.querySelectorAll(".view-event");

  viewEventButtons.forEach((button) => {
    button.addEventListener("click", function () {
      alert("View event functionality not implemented yet.");
    });
  });
}

// Initialize community page functionality
function initializeCommunityPage() {
  const viewPostButtons = document.querySelectorAll(".view-post");

  viewPostButtons.forEach((button) => {
    button.addEventListener("click", function () {
      alert("View post functionality not implemented yet.");
    });
  });
}

// Initialize login page functionality
function initializeLoginPage() {
  const loginForm = document.getElementById("login-form");
  if (loginForm) {
    loginForm.addEventListener("submit", function (event) {
      event.preventDefault();
      const email = document.getElementById("email").value;
      const password = document.getElementById("password").value;
      console.log("Login attempt:", email, password);
      alert("Login functionality not implemented yet.");
    });
  }
}

// Initialize signup page functionality
function initializeSignupPage() {
  const signupForm = document.getElementById("signup-form");
  if (signupForm) {
    signupForm.addEventListener("submit", function (event) {
      event.preventDefault();
      const username = document.getElementById("username").value;
      const email = document.getElementById("email").value;
      const password = document.getElementById("password").value;
      console.log("Signup attempt:", username, email, password);
      alert("Signup functionality not implemented yet.");
    });
  }
}

// Initialize D&D game page functionality
function initializeDndGamePage() {
  const rollDiceButton = document.getElementById("roll-dice");
  const useAbilityButton = document.getElementById("use-ability");

  if (rollDiceButton) {
    rollDiceButton.addEventListener("click", function () {
      const result = Math.floor(Math.random() * 20) + 1;
      alert(`You rolled a ${result}!`);
    });
  }

  if (useAbilityButton) {
    useAbilityButton.addEventListener("click", function () {
      alert("Ability use functionality not implemented yet.");
    });
  }
}

// Initialize everything when the DOM is loaded
document.addEventListener("DOMContentLoaded", function () {
  initializeDarkModeToggle();
  initializeSmoothScrolling();

  // Initialize page-specific functionality
  const currentPage = window.location.pathname;

  if (currentPage.includes("decks.html")) {
    initializeDecksPage();
  } else if (currentPage.includes("events.html")) {
    initializeEventsPage();
  } else if (currentPage.includes("community.html")) {
    initializeCommunityPage();
  } else if (currentPage.includes("login.html")) {
    initializeLoginPage();
  } else if (currentPage.includes("signup.html")) {
    initializeSignupPage();
  } else if (currentPage.includes("dnd-game.html")) {
    initializeDndGamePage();
  }

  // Add any global interactive elements here
  const cards = document.querySelectorAll(".card");
  cards.forEach((card) => {
    card.addEventListener("mouseenter", function () {
      this.style.transform = "translateY(-5px)";
    });
    card.addEventListener("mouseleave", function () {
      this.style.transform = "translateY(0)";
    });
  });
});

document.addEventListener("DOMContentLoaded", function () {
  const searchForm = document.getElementById("search-form");
  if (searchForm) {
    searchForm.addEventListener("submit", async function (event) {
      event.preventDefault();
      const cardName = document.getElementById("card-name").value;
      const gameType = document.getElementById("game-type").value;
      await searchCard(cardName, gameType);
    });
  }

  // Initialize D&D Game Room only if on the D&D game page
  if (window.location.pathname.includes("dnd-game.html")) {
    initializeDndGameRoom();
  }

  // Initialize profile page only if on the profile page
  if (window.location.pathname.includes("profile.html")) {
    initializeProfilePage();
  }

  // Initialize events page only if on the events page
  if (window.location.pathname.includes("events.html")) {
    initializeEventsPage();
  }

  // Initialize community page only if on the community page
  if (window.location.pathname.includes("community.html")) {
    initializeCommunityPage();
  }
});
