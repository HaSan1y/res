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
  // todo cant upload file, see err, wrong filetype, nor console.log, preventdefault?
  //  upload png recreate png into folder
  // const formx = document.querySelector('form.xx');
  // formx.addEventListener('submit', (e) => {
  //   e.preventDefault();
  //   console.log('Default form submission prevented');
  //   // Prevents HTML handling submission
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


function xxx() {
  wrapper2.style.maxHeight = "10%";
  wrapper2.style.overflow = "hidden";
}

/*
Here are some suggestions for the provided code:
Cookie and Disclaimer Handling
    Improve Cookie Handling: The current implementation of the cookie handling logic can be simplified and made more robust. Instead of checking for the presence of the cookie on each page load, you can use a single function to handle the cookie consent and display the cookie box accordingly.
    Separate Concerns: The cookie and disclaimer handling logic can be separated into two distinct functions or modules to improve code organization and maintainability.
    Error Handling: Add error handling for cases where the cookie or disclaimer-related operations fail, such as when the cookie cannot be set or the disclaimer modal cannot be displayed.
    User Experience: Consider adding more user-friendly features, such as allowing the user to manage their cookie preferences or providing a link to the privacy policy in the cookie box.

Theme Switcher
    Accessibility: Ensure that the theme switcher is accessible to users with disabilities, such as providing appropriate ARIA attributes or keyboard navigation.
    Persistence: Instead of storing the theme in the localStorage, you could consider using a more robust solution, such as a server-side preference storage or a cookie, to ensure the theme persists across sessions.
    Optimization: Optimize the theme switching process by avoiding unnecessary DOM manipulations or reflows, especially on large websites.

File Upload
    Error Handling: Implement proper error handling for the file upload functionality, such as displaying error messages to the user and logging errors for debugging purposes.
    File Type Validation: Validate the file type on the client-side before attempting to upload, and provide clear feedback to the user if the file type is not supported.
    Progress Indicators: Consider adding progress indicators or loading states to provide a better user experience during the file upload process.
    Security: Ensure that the server-side implementation of the file upload functionality is secure and follows best practices to prevent potential security vulnerabilities.

Sentence Display
    Optimization: The current implementation of the sentence display logic can be optimized by reducing the number of DOM manipulations and event listeners. Consider using a more efficient approach, such as template rendering or virtual DOM updates.
    Accessibility: Ensure that the sentence display is accessible to users with disabilities, such as providing appropriate ARIA attributes or keyboard navigation.
    Separation of Concerns: Separate the sentence display logic from the event handling and file reading logic to improve code organization and maintainability.
    Error Handling: Implement proper error handling for cases where the file reading operation fails, and provide clear feedback to the user.
    Responsiveness: Ensure that the sentence display is responsive and adapts well to different screen sizes and devices.

By addressing these suggestions, you can improve the overall quality, maintainability, and user experience of the provided code.
*/
