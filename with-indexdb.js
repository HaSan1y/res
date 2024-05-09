const cards = document.querySelectorAll("#card");
const cardHolder = document.getElementById('card-holder');

const request = window.indexedDB.open('myDatabase', 1);

request.onupgradeneeded = (event) => {
  const db = event.target.result;
  const sentencesStore = db.createObjectStore('sentences', { keyPath: 'id', autoIncrement: true });
  sentencesStore.createIndex('sentence', 'sentence', { unique: true });
  const solutionsStore = db.createObjectStore('solutions', { keyPath: 'id', autoIncrement: true });
  solutionsStore.createIndex('solution', 'solution', { unique: true });
};
request.onsuccess = (event) => {
  db = event.target.result;
  console.log('Database opened successfully');
  display();
};
request.onerror = (event) => {
  console.error('Error opening database:', event.target.errorCode);
};
document.getElementById('txtbtn').addEventListener('submit', (event) => {
  // event.preventDefault();
  const t1 = document.getElementById('t1').value;
  const t2 = document.getElementById('t2').value;
  const t3 = document.getElementById('t3').value;
  const sentences = [t1, t2];
  const solutions = [t3];
  let transaction = db.transaction('sentences', 'readwrite');
  const sentencesStore = transaction.objectStore('sentences');
  sentences.forEach((sentence) => {
    sentencesStore.add({ sentence: sentence });
    // sentencesStore.put({ id: sentencesStore.indexNames.length, sentence: sentences[1] });
  });
  transaction.oncomplete = () => {
    console.log('Data added to database successfully1');
  };
  transaction.onerror = (event) => {
    console.error('Error adding data to database:1', event.target.errorCode);
  };
  transaction = db.transaction('solutions', 'readwrite');
  const solutionsStore = transaction.objectStore('solutions');
  solutionsStore.put({ solution: solutions[0] });
  transaction.oncomplete = () => {
    console.log('Data added to database successfully2');
  };
  transaction.onerror = (event) => {
    console.error('Error adding data to database:2', event.target.errorCode);
  };
});

async function display() {
  try {
    let transaction = db.transaction('sentences', 'readonly');
    const sentencesStore = transaction.objectStore('sentences');
    const sentencesRequest = sentencesStore.getAll();
    sentencesRequest.onsuccess = (event) => {
      const sentences = event.target.result;
      try {
        transaction = db.transaction('solutions', 'readonly');
        const solutionsStore = transaction.objectStore('solutions');
        const solutionsRequest = solutionsStore.getAll();
        solutionsRequest.onsuccess = (event) => {
          const solutions = event.target.result;
          console.log(solutions);
          console.log(sentences);
          displayCards(sentences, solutions);
        };
        solutionsRequest.onerror = (event) => {
          console.error('Error reading solution from database:', event.target.errorCode);
        };
      } catch (error) {
        console.error('Error reading file:', error);
      }
    };
    sentencesRequest.onerror = (event) => {
      console.error('Error reading sentences from database:', event.target.errorCode);
    };
  } catch (error) {
    console.error('Error reading file:', error);
  }
}

function displayCards(sen, sol) {
  let showmore = 8; // Initial number of cards to display
  let totalCards = 0; // Keep track of the total number of cards displayed
  const showMoreButton = document.createElement('button');
  showMoreButton.textContent = 'Show More';
  showMoreButton.setAttribute('id', 'showmore');
  showMoreButton.setAttribute('class', 'btn-primary');
  showMoreButton.addEventListener('click', () => {
    showMoreCards(showMoreButton, sen, sol);
  });
  for (let i = 0; i < sen.length; i++) {

    if (totalCards < showmore) {
      const card = document.createElement('div');
      card.classList.add('card', 'bi', 'bi-hand-index-fill');
      card.id = `card-${i / 2}`;
      const heading = document.createElement('h2');
      heading.textContent = sen[i].sentence;
      const paragraph = document.createElement('p');
      if (i + 1 < sen.length) {
        paragraph.textContent = sen[i + 1].sentence;
        i++;
      }
      card.addEventListener('click', () => {
        toggleCardContent(card);
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
}
//     if (totalCards < showmore) {
//   const card = createCard(sen, i);
//   cardHolder.appendChild(card);
//   totalCards++;
// } else {
//   break;
// }
// }
// show.appendChild(showMoreButton);
// }

async function toggleCardContent(card) {
  const [heading, paragraph] = [card.firstElementChild, card.lastElementChild];
  const cardIndex = parseInt(card.id.split('-')[1]);
  try {
    const dbTransaction = db.transaction('solutions', 'readonly');
    const solutionsStore = dbTransaction.objectStore('solutions');
    const solutionRequest = solutionsStore.get(cardIndex + 1);
    solutionRequest.onsuccess = ({ target: { result: solution } }) => {
      paragraph.textContent = solution ? solution.solution : '';
    };
    solutionRequest.onerror = ({ target: { errorCode } }) => {
      console.error(`Error reading solution from database: ${errorCode}`);
    };
  } catch (error) {
    console.error('Error reading file:', error);
  }
}

function showMoreCards(showMoreBtn, sentences, solutions) {
  const totalCards = document.querySelectorAll('.card').length;
  console.log(solutions);
  // const cardsToShow = totalCards + showmore * 2;
  // for (let i = totalCards; i < cardsToShow && i < sentences.length; i++) {

  const cardsToShow = solutions.length + 1;
  for (let i = totalCards; i < cardsToShow; i++) {
    const displayviashowmore = true;
    const card = createCard(sentences, i, displayviashowmore);
    cardHolder.appendChild(card);
    if (i + 1 < sentences.length) {
      i++; // Increment i to skip the next sentence
    }
  }
  toggleButton(showMoreBtn, cardsToShow, sentences.length);
}
function createCard(sentences, index, displayviashowmore) {
  const card = document.createElement('div');
  card.classList.add('card', 'bi', 'bi-hand-index-fill');
  card.id = `card-${index}`;
  const heading = document.createElement('h2');
  if (!displayviashowmore) {
    heading.textContent = sentences[index];
  }
  const paragraph = document.createElement('p');
  if (index + 1 < sentences.length) {
    let k;
    if (!displayviashowmore) { k = 1 } else { k = 0; }
    paragraph.textContent = sentences[index + k];
  }
  card.addEventListener('click', () => {
    toggleCardContent(card);
  });
  card.appendChild(heading);
  card.appendChild(paragraph);
  displayviashowmore = false;
  return card;
}
function toggleButton(showMoreBtn, cardsToShow, sentencesLength) {
  if (cardsToShow >= sentencesLength) {
    showMoreBtn.classList.add('deactivated');
    showMoreBtn.disabled = true;
  } else {
    showMoreBtn.classList.remove('deactivated');
    showMoreBtn.disabled = false;
  }
}
// called via button onclick="remove()"
function removeData() {
  let transaction = db.transaction('sentences', 'readwrite');
  const sentencesStore = transaction.objectStore('sentences');
  sentencesStore.clear();
  transaction.oncomplete = () => {
    console.log('Data removed from database successfully');
  };
  transaction.onerror = (event) => {
    console.error('Error removing data from database:', event.target.errorCode);
  };
  // 
  transaction = db.transaction('solutions', 'readwrite');
  const solutionsStore = transaction.objectStore('solutions');
  solutionsStore.clear();
  transaction.oncomplete = () => {
    console.log('Data removed from database successfully2');
  };
  transaction.onerror = (event) => {
    console.error('Error removing data from database:2', event.target.errorCode);
  };
}
//   const cards = document.querySelectorAll('.card');
//   for (let i = cards.length - 1; i >= cards.length && i >= 0; i--) {
//       cards[i].remove(); ;
//   }
// }
