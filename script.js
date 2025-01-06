const addItemButton = document.getElementById("add-item-button");
const itemNameInput = document.getElementById("item-name");
const itemCategorySelect = document.getElementById("item-category");
const wardrobeList = document.getElementById("wardrobe-list");
const generateOutfitButton = document.getElementById("generate-outfit-button");
const outfitSuggestion = document.getElementById("outfit-suggestion");

let wardrobe = JSON.parse(localStorage.getItem("wardrobe")) || [];

updateWardrobeDisplay();

addItemButton.addEventListener("click", () => {
  const itemName = itemNameInput.value.trim();
  const itemCategory = itemCategorySelect.value;
  if (itemName === "") {
    alert("Please enter an item name.");
    return;
  }
  wardrobe.push({ name: itemName, category: itemCategory });
  saveWardrobeToLocalStorage();
  updateWardrobeDisplay();
  itemNameInput.value = "";
  itemCategorySelect.value = "Shirt/Top";
});

function updateWardrobeDisplay() {
  wardrobeList.innerHTML = "";
  wardrobe.forEach((item, index) => {
    const listItem = document.createElement("li");
    listItem.textContent = `${item.name} (${item.category})`;
    const removeButton = document.createElement("span");
    removeButton.textContent = " ❌";
    removeButton.classList.add("remove-item");
    removeButton.addEventListener("click", () => {
      removeItem(index);
    });
    listItem.appendChild(removeButton);
    wardrobeList.appendChild(listItem);
  });
}

function removeItem(index) {
  wardrobe.splice(index, 1);
  saveWardrobeToLocalStorage();
  updateWardrobeDisplay();
}

function saveWardrobeToLocalStorage() {
  localStorage.setItem("wardrobe", JSON.stringify(wardrobe));
}

generateOutfitButton.addEventListener("click", async () => {
  if (wardrobe.length === 0) {
    outfitSuggestion.textContent = "Your wardrobe is empty! Add some items first.";
    return;
  }
  const tops = wardrobe.filter((item) => item.category === "Shirt/Top");
  const bottoms = wardrobe.filter((item) => item.category === "Bottoms");
  if (tops.length === 0 && bottoms.length > 0) {
    outfitSuggestion.textContent = "You don't have any tops! Please add at least one shirt or top.";
    return;
  } else if (tops.length > 0 && bottoms.length === 0) {
    outfitSuggestion.textContent = "You don't have any bottoms! Please add at least one pair of pants, shorts, or skirts.";
    return;
  } else if (tops.length === 0 && bottoms.length === 0) {
    outfitSuggestion.textContent = "You need both tops and bottoms to generate an outfit!";
    return;
  }
  const wardrobeItems = wardrobe.map((item) => `${item.name} (${item.category})`).join(", ");
  const apiResponse = await getOutfitSuggestionFromAPI(wardrobeItems);
  outfitSuggestion.textContent = apiResponse;
});

async function getOutfitSuggestionFromAPI(wardrobeItems) {
  const apiKey = "AIzaSyDcTKPG-1ZEA6eG98aCM9KorvCrIyBXVis";
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
  const data = {
    contents: [
      {
        parts: [
          {
            text: `Based on the wardrobe items: ${wardrobeItems}. Suggest three different outfit options that includes a Shirt/Top and Bottoms, add Accessories if available.`,
          },
        ],
      },
    ],
  };
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }
    const result = await response.json();
    return result.candidates[0].content.parts[0].text;
  } catch (error) {
    console.error("Error:", error);
    return "Sorry, I couldn't get a response right now. Please check your API key or internet connection.";
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const addItemLink = document.querySelector('nav ul li:nth-child(2) a');
  const wardrobeLink = document.querySelector('nav ul li:nth-child(3) a');
  const outfitGeneratorLink = document.querySelector('nav ul li:nth-child(4) a');
  const addItemSection = document.getElementById("add-item");
  const wardrobeSection = document.getElementById("wardrobe");
  const outfitGeneratorSection = document.getElementById("outfit-generator");

  const scrollToSection = (section) => {
    section.scrollIntoView({ behavior: "smooth" });
  };

  addItemLink.addEventListener("click", (event) => {
    event.preventDefault();
    scrollToSection(addItemSection);
  });

  wardrobeLink.addEventListener("click", (event) => {
    event.preventDefault();
    scrollToSection(wardrobeSection);
  });

  outfitGeneratorLink.addEventListener("click", (event) => {
    event.preventDefault();
    scrollToSection(outfitGeneratorSection);
  });
});

