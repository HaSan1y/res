const cookieBox = document.querySelector(".wrapper");
const buttons = document.querySelectorAll(".button");
const disc = document.querySelector("#disclaimerModal");

const cards = document.querySelectorAll("#card");
const cardHolder = document.getElementById('card-holder');
let kek = 8;
// cookie+disclaimer
const executeCodes = () => {
  if (!document.cookie.includes("cookie-consent")) {
    cookieBox.classList.add("show");
    buttons.forEach((button) => {
      button.addEventListener("click", () => {
        cookieBox.classList.remove("show");
        if (button.id == "acceptBtn") {
          //cookies for 1 month 60=1min* 60=1hr* 30=30days samesitestrict only within the orignpage
          return document.cookie =
            "cookieBy= ${cookie-consent}; SameSite=Strict; max-age= " + 60 * 60 * 24 * 7;
        }
      });
    });
  }
  if (!document.cookie.includes("terms-accepted")) {
    closeDisclaimerModal.addEventListener("click", () => {
      if (acknowledgeDisclaimer.checked) {
        document.cookie =
          "acpttermsBy= ${terms-accepted}; SameSite=Strict; max-age= " + 60 * 60 * 24 * 30;
        document.body.style.overflow = 'auto';
        disc.remove();
      } else {
        body.classList.add("hide");
        document.body.style.overflow = 'hidden';
      }
    });
  } else {
    document.body.style.overflow = 'auto';
    disc.remove();
  };
}

// theme switcher
const colorThemes = document.querySelectorAll('[name="theme"]');
const storeTheme = function (theme) {
  localStorage.setItem("theme", theme);
};
const setTheme = function () {
  const activeTheme = localStorage.getItem("theme");
  colorThemes.forEach((themeOption) => {
    if (themeOption.id === activeTheme) {
      themeOption.checked = true;
    }
  });
  document.documentElement.className = activeTheme;
};
colorThemes.forEach((themeOption) => {
  themeOption.addEventListener("click", () => {
    storeTheme(themeOption.id);
    document.documentElement.className = themeOption.id;
  });
});

//                    document.onload = ;
window.addEventListener("load", () => {
  executeCodes();
  setTheme();
  displ();
  // todo when upload file, cant see err, wrong filetype, nor console.log, ?submit?e.preventdefault?
  //  upload png recreate png into folder
  // const formx = document.querySelector('form.xx');
  // formx.addEventListener('submit', (e) => {
  //   e.preventDefault();
  //   console.log('Default form submission prevented');
  //   // const name = document.getElementById("name");
  //   const files = document.getElementById("files");
  //   const formData = new FormData();
  //   // // formData.append("name", name.value);
  //   for (let i = 0; i < files.files.length; i++) {
  //     formData.append("files", files.files[i]);
  //   }
  //   fetch('http://127.0.0.1:5000/api', {
  //     method: 'POST',
  //     body: formData,

  //   })
  //     .then(res => res.json())
  //     .then(data => console.log(data));
  // })
});

// read from file display to html toggle
async function displ() {
  try {
    const response = await fetch('sen.txt');
    const data = await response.text();
    const sentences = data.trim().split('\n');
    let showmore = 8; // Initial number of cards to display
    let totalCards = 0; // Keep track of the total number of cards displayed

    const showMoreButton = document.createElement('button');
    showMoreButton.textContent = 'Show More';
    showMoreButton.setAttribute('id', 'showmore');
    showMoreButton.addEventListener('click', () => {
      showMoreCards(showMoreButton, sentences, showmore);
    });

    for (let i = 0; i < sentences.length; i++) {
      if (totalCards < showmore) {
        const card = document.createElement('div');
        card.classList.add('card');
        card.id = `card-${i}`;

        const heading = document.createElement('h2');
        heading.textContent = sentences[i];

        const paragraph = document.createElement('p');
        if (i + 1 < sentences.length) {
          paragraph.textContent = sentences[i + 1];
          i++;
        }

        card.addEventListener('click', () => {
          toggleCardContent(card, sentences);
        });
        card.appendChild(heading);
        card.appendChild(paragraph);
        cardHolder.appendChild(card);
        totalCards++;
      } else {
        break;
      }
    }

    show.appendChild(showMoreButton);
  } catch (error) {
    console.error('Error reading file:', error);
  }
}

function showMoreCards(button, sentences, showmore) {

  let totalCards = document.querySelectorAll('.card').length + kek;
  kek += 8;
  let cardsToShow = totalCards + showmore * 2;

  for (let i = totalCards; i < cardsToShow && i < sentences.length; i++) {
    const card = document.createElement('div');
    card.classList.add('card');
    card.id = `card-${i}`;

    const heading = document.createElement('h2');
    heading.textContent = sentences[i];

    const paragraph = document.createElement('p');
    if (i + 1 < sentences.length) {
      paragraph.textContent = sentences[i + 1];
      i++;
    }

    card.addEventListener('click', () => {
      toggleCardContent(card, sentences);
    });
    card.appendChild(heading);
    card.appendChild(paragraph);
    cardHolder.appendChild(card);
  }

  if (cardsToShow >= sentences.length) {
    button.style.display = 'none';
  }
}

async function toggleCardContent(card, sentences) {
  const heading = card.firstElementChild;
  const paragraph = card.lastElementChild;
  const cardIndex = parseInt(card.id.split('-')[1]);
  heading.textContent = sentences[cardIndex];
  if (cardIndex < sentences.length) {
    try {
      const response = await fetch('sol.txt');
      const data = await response.text();
      const solution = data.trim().split('\n');
      if (cardIndex > 0) {
        let x = cardIndex / 2;
        paragraph.textContent = solution[x] + `${x}`;
      } else {
        paragraph.textContent = solution[cardIndex] + `${cardIndex}`;
      }
    } catch (error) {
      console.error('Error reading file:', error);
    }
  } else {
    paragraph.textContent = '';
  }
}
//update sen.txt + sol.txt        serverside app
document.getElementById('txtbtn').addEventListener('submit', (event) => {
  event.preventDefault();
  console.log(event);
  console.debug()
  debugger;
  const t1 = document.getElementById('t1').value;
  const t2 = document.getElementById('t2').value;
  const t3 = document.getElementById('t3').value;
  const sentences = [t1, t2];
  const solution = [t3];

  fetch('http://127.0.0.1:3000/sen', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(sentences)
  })
    .then(response => response.text())
    .then(data => console.log(data))
    .catch(error => console.error('Error writing to sen.txt:', error));

  fetch('http://127.0.0.1:3000/sol', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(solution)
  })
    .then(response => response.text())
    .then(data => console.log(data))
    .catch(error => console.error('Error writing to sol.txt:', error));
});


//update sen.txt + sol.txt        clientside app
function addTextToFile() {
  var text = document.getElementById('t1').value;
  var blob = new Blob([text], { type: "text/plain;charset=utf-8" });
  var link = document.createElement("a");
  var url = URL.createObjectURL(blob);
  link.setAttribute("href", url);
  link.setAttribute("download", "file.txt");
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

function remove() {
  const cards = document.querySelectorAll('.card');
  for (let i = cards.length - 1; i >= cards.length - kek + 8 && i >= 0; i--) {
    if(kek > i){
      cards[i].remove();kek--}
  }
}

//////////////////////////////////////////////////////////////////////////////////////////
//3state slider
function filterme(value) {
  value = parseInt(value, 10); // Convert to an integer
  var customToggle = document.getElementById('custom-toggle');
  var spanElements = document.querySelectorAll('span');

  if (value === 1) {
    customToggle.classList.remove('tgl-off', 'tgl-def');
    customToggle.classList.add('tgl-on');
    spanElements.forEach(function(span) {
      span.textContent = 'Enabled';
    });
  } else if (value === 2) {
    customToggle.classList.remove('tgl-on', 'tgl-off');
    customToggle.classList.add('tgl-def');
    spanElements.forEach(function(span) {
      span.textContent = 'Undetermined';
    });
  } else if (value === 3) {
    customToggle.classList.remove('tgl-def', 'tgl-on');
    customToggle.classList.add('tgl-off');
    spanElements.forEach(function(span) {
      span.textContent = 'Disabled';
    });
  }
}
