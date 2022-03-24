import { createSlice } from '@reduxjs/toolkit';

export const wordList = [
  {
    imagePath: '/images/words/bat.png',
    name: 'bat',
  }, {
    imagePath: '/images/words/bed.png',
    name: 'bed',
  }, {
    imagePath: '/images/words/car.png',
    name: 'car',
  }, {
    imagePath: '/images/words/cat.png',
    name: 'cat',
  }, {
    imagePath: '/images/words/dog.png',
    name: 'dog',
  }, {
    imagePath: '/images/words/fan.png',
    name: 'fan',
  }, {
    imagePath: '/images/words/fire.png',
    name: 'fire',
  }, {
    imagePath: '/images/words/frog.png',
    name: 'frog',
  }, {
    imagePath: '/images/words/ham.png',
    name: 'ham',
  }, {
    imagePath: '/images/words/jam.png',
    name: 'jam',
  }, {
    imagePath: '/images/words/log.png',
    name: 'log',
  }, {
    imagePath: '/images/words/man.png',
    name: 'man',
  }, {
    imagePath: '/images/words/nose.png',
    name: 'nose',
  }, {
    imagePath: '/images/words/pan.png',
    name: 'pan',
  }, {
    imagePath: '/images/words/shoe.png',
    name: 'shoe',
  },
];

const initialState = {
  keyboardLetters: [],
  status: 'choose-word',
  targetWord: null,
  wordInProgress: null,
  wordList: wordList,
};

const getKeyboardLetters = function(wordList, word) {
  const allLetters = {};
  wordList.forEach(word => {
    word.name.split('').forEach(letter => {
      allLetters[letter] = true;
    });
  });
  let letters = word.name.split('');
  letters.forEach(letter => delete allLetters[letter]);
  while (letters.length < 8 && Object.keys(allLetters).length > 0) {
    const candidateLetters = Object.keys(allLetters);
    const rnd = Math.floor(Math.random() * (candidateLetters.length - 1));
    const letter = candidateLetters[rnd];
    letters.push(letter);
    delete allLetters[letter];
  }
  // Shuffle letters
  for (let i = letters.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var temp = letters[i];
      letters[i] = letters[j];
      letters[j] = temp;
  }
  return letters;
}

export const spellerSlice = createSlice({
  name: 'speller',
  initialState,
  // The `reducers` field lets us define reducers and generate associated actions
  reducers: {
    addLetter: (state, action) => {
      state.wordInProgress += action.payload;
      state.status = state.wordInProgress === state.targetWord.name ? "spelled-word" : "spell-word";
    },
    deleteLetter: (state) => {
      if (state.wordInProgress.length > 0) {
        state.wordInProgress = state.wordInProgress.slice(0, -1);
        state.status = state.wordInProgress === state.targetWord.name ? "spelled-word" : "spell-word";
      }
    },
    endWord: (state) => {
      state.keyboardLetters = [];
      state.status = 'choose-word';
      state.targetWord = null;
    },
    startWord: (state, action) => {
      const wordChosen = action.payload;
      state.keyboardLetters = getKeyboardLetters(state.wordList, wordChosen);
      state.status = 'spell-word';
      state.targetWord = wordChosen;
      state.wordInProgress = '';
    },
  },
});

export const { addLetter, deleteLetter, endWord, startWord } = spellerSlice.actions;

export const selectKeyboardLetters = (state) => state.speller.keyboardLetters;
export const selectWordInProgress = (state) => state.speller.wordInProgress;
export const selectWordList = (state) => state.speller.wordList;
export const selectTargetWordName = (state) => {
  return state.speller.status === 'spell-word' ? state.speller.targetWord.name : '';
}
export const selectTargetWordImagePath = (state) => {
  return state.speller.status === 'spell-word' ? state.speller.targetWord.imagePath : '';
}
export const selectTargetWord = (state) => {
  return state.speller.targetWord;
}

export default spellerSlice.reducer;
