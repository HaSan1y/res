const cards = document.querySelectorAll("#card");
const cardHolder = document.getElementById('card-holder');

const request = window.indexedDB.open('myDatabase', 1);
let db;
console.log(1)
request.onupgradeneeded = (event) => {
  db = event.target.result;
  const sentencesStore = db.createObjectStore('sentences', { keyPath: 'id', autoIncrement: true });
  // sentencesStore.createIndex('sentence', 'sentence', { unique: false }); store same msg unique true
  sentencesStore.createIndex('sentence', 'sentence', { unique: true });
  const solutionsStore = db.createObjectStore('solutions', { keyPath: 'id', autoIncrement: true });
  solutionsStore.createIndex('solution', 'solution', { unique: true });
};

request.onsuccess = (event 
) => {
  db = event.target.result;
  console.log('Database opened successfully');
  display();
};

request.onerror = (event) => {
  console.error('Error opening database:', event.target.errorCode);
};

document.getElementById('txtbtn').addEventListener('submit', (event) => {
  event.preventDefault();
  const t1 = document.getElementById('t1').value;
  const t2 = document.getElementById('t2').value;
  const t3 = document.getElementById('t3').value;
  const sentences = [t1, t2];
  const solution = [t3];
  // Add sentences to the database
  let transaction = db.transaction('sentences', 'readwrite');
  const sentencesStore = transaction.objectStore('sentences');
  sentences.forEach((sentence, index) => {
    sentencesStore.put({ id: sentencesStore.indexNames.length, sentence: sentence });
  });

  transaction = db.transaction('solutions', 'readwrite');
  const solutionsStore = transaction.objectStore('solutions');
  solution.forEach((solution, index) => {
    solutionsStore.put({ id: solutionsStore.indexNames.length, solution: solution });
    // solutionsStore.add({ id: index, solution: solution });
  });
  transaction.oncomplete = () => {console.log(6)
    console.log('Data added to database successfully');
  };

  transaction.onerror = (event) => {
    console.error('Error adding data to database:', event.target.errorCode);
  };
});

async function display() {
  try {
    const transaction = db.transaction('sentences', 'readonly');
    const sentencesStore = transaction.objectStore('sentences');
    const sentencesRequest = sentencesStore.getAll();console.log(7)
    sentencesRequest.onsuccess = (event) => {console.log(8)
      const sentences = event.target.result;
      displayCards(sentences);
    };
    sentencesRequest.onerror = (event) => {
      console.error('Error reading sentences from database:', event.target.errorCode);
    };
  } catch (error) {
    console.error('Error reading file:', error);
  }
}

function displayCards(data) {
  const sentences = data;
  //  .trim().split('\n');
  let showmore = 8; // Initial number of cards to display
  let totalCards = 0; // Keep track of the total number of cards displayed
  const showMoreButton = document.createElement('button');
  showMoreButton.textContent = 'Show More';
  showMoreButton.setAttribute('id', 'showmore');
  showMoreButton.setAttribute('class', 'btn-primary');
  showMoreButton.addEventListener('click', () => {
    showMoreCards(showMoreButton, sentences, showmore);
  });
  for (let i = 0; i < sentences.length; i++) {
    if (totalCards < showmore) {
      const card = document.createElement('div');
      card.classList.add('card', 'bi', 'bi-hand-index-fill');
      /*^this is the way to add space with javascript*/
      card.id = `card-${i}`;
      const heading = document.createElement('h2');
      heading.textContent = JSON.stringify(sentences[i].sentence);
      const paragraph = document.createElement('p');
      if (i + 1 < sentences.length) {
        paragraph.textContent = JSON.stringify(sentences[i + 1].sentence);
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
}
async function toggleCardContent(card, sentences) {
  const heading = card.firstElementChild;
  const paragraph = card.lastElementChild;
  const cardIndex = parseInt(card.id.split('-')[1]);/////////////////////////////////
  heading.textContent = sentences[cardIndex].sentence;
  try {
    const transaction = db.transaction('solutions', 'readonly');
    const solutionsStore = transaction.objectStore('solutions');
    const solutionRequest = solutionsStore.get(cardIndex);
    solutionRequest.onsuccess = (event) => {
      const solution = event.target.result;
      if (solution) {
        paragraph.textContent = solution.solution;
      } else {
        paragraph.textContent = '';
      }
    };
    solutionRequest.onerror = (event) => {
      console.error('Error reading solution from database:', event.target.errorCode);
    };
  } catch (error) {
    console.error('Error reading file:', error);//? 
  }
}
function remove() {
  const transaction = db.transaction('sentences', 'readwrite');
  const sentencesStore = transaction.objectStore('sentences');
  sentencesStore.clear();
  transaction.oncomplete = () => {
    console.log('Data removed from database successfully');
  };
  transaction.onerror = (event) => {
    console.error('Error removing data from database:', event.target.errorCode);
  };
}
//  