const cookieBox = document.querySelector(".wrapper");
const buttons = document.querySelectorAll(".button");
const disc = document.querySelector("#disclaimerModal");

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
  // todo when upload file, cant see err, wrong filetype, nor console.log, ?preventdefault?
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
const cards = document.querySelectorAll("#card");
const cardHolder = document.getElementById('card-holder');

async function displ() {
  try {
    const response = await fetch('sen.txt');
    const data = await response.text();
    const sentences = data.trim().split('\n');

    for (let i = 0; i < sentences.length; i++) {
      const card = document.createElement('div');
      card.classList.add('card');
      card.id = `card-${i}`;

      const heading = document.createElement('h2');
      heading.textContent = sentences[i];

      const paragraph = document.createElement('p');
      if (i + 1 < sentences.length) {
        paragraph.textContent = sentences[i + 1]; i++;
      }

      card.addEventListener('click', () => {
        toggleCardContent(card, sentences);
      });
      card.appendChild(heading);
      card.appendChild(paragraph);
      cardHolder.appendChild(card);
    }


    cards.forEach((card, index) => {
      const firstChild = card.firstElementChild;
      const lastChild = card.lastElementChild;
      let isClicked = false;

      card.addEventListener('click', () => {
        const sentenceIndex = index * 2;
        if (!isClicked) {
          if (sentenceIndex < sentences.length) {
            firstChild.textContent = sentences[sentenceIndex];
            if (sentenceIndex + 1 < sentences.length) {
              lastChild.textContent = sentences[sentenceIndex + 1];
            } else {
              lastChild.textContent = '';
            }
          } else {
            firstChild.textContent = '';
            lastChild.textContent = '';
          }
        } else {
          firstChild.textContent = '';
          lastChild.textContent = '';
        }
        isClicked = !isClicked;
        console.log(`Clicked card at index ${index}`);
      });
    });
  } catch (error) {
    console.error('Error reading file:', error);
  }
}

async function toggleCardContent(card, sentences) {
  const heading = card.firstElementChild;
  const paragraph = card.lastElementChild;
  if (heading.textContent) {
    heading.textContent = '';
    paragraph.textContent = '';
  } else {
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
}

document.getElementById('txtbtn').addEventListener('click', function (event) {
  event.preventDefault(); // Prevent form submission
  const t1 = document.getElementById('t1').value;
  const t2 = document.getElementById('t2').value;
  const t3 = document.getElementById('t3').value;
  const sentences = [t1, t2];
  const solution = [t3];

  fetch('https://github.com/HaSan1y/res/blob/main/sen.txt', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(sentences)
  })
    .then(response => response.text())
    .then(data => console.log(data))
    .catch(error => console.error('Error writing to sen.txt:', error));
    
    // http://127.0.0.1:3000/sol
  fetch('https://github.com/HaSan1y/res/blob/main/sol.txt', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(solution)
  })
    .then(response => response.text())
    .then(data => console.log(data))
    .catch(error => console.error('Error writing to sol.txt:', error));
});


function xxx() {
  wrapper2.style.maxHeight = "10%";
  wrapper2.style.overflow = "hidden";
}
