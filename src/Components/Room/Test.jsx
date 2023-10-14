import React, { useState } from 'react';
import { generate } from 'random-words';
import Checkbox from '@mui/material/Checkbox';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import { Icon } from '@iconify/react';

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

const Test = () => {
  const [randomWordsList, setRandomWordsList] = useState([]);
  const [newWord, setNewWord] = useState('');
  const [selectedWords, setSelectedWords] = useState([]);

  const generateRandomWords = () => {
    const newWords = generate({ exactly: 10, wordsPerString: 1 });
    const newWordsWithIds = newWords.map((word, index) => ({
        id: index + 1 + randomWordsList.length,
        word,
    }));
    setRandomWordsList([...newWordsWithIds]);
  };

  const addNewWord = () => {
    if (newWord.trim() !== '') {
      const id = randomWordsList.length + 1;
      const wordObj = { word: newWord, id };
      setRandomWordsList([...randomWordsList, wordObj]);
      setNewWord('');
    }
  };

  return (
    <div>
        <Stack direction="column" spacing={2}>
            <Stack direction="row" spacing={2}>
                <TextField id="filled-basic" size='small' label="New word" value={newWord} onChange={(e) => setNewWord(e.target.value)} variant="filled" />
                <Button variant="contained" size='small' style={{ width: '30%', fontWeight: 'bolder' }} href="#contained-buttons" onClick={addNewWord} startIcon={<Icon icon="fluent:add-12-filled" />}>Add Word</Button>
            </Stack>

            <Stack direction="row" spacing={2}>
                <Autocomplete
                    multiple
                    size='small'
                    id="checkboxes-tags-demo"
                    options={randomWordsList}
                    disableCloseOnSelect
                    value={selectedWords}
                    onChange={(event) => { setSelectedWords(event.target.value);}}
                    getOptionLabel={(option) => option.word}
                    renderOption={(props, option, { selected }) => (
                        <li {...props}>
                        <Checkbox
                            icon={icon}
                            checkedIcon={checkedIcon}
                            style={{ marginRight: 8 }}
                            checked={selected}
                        />
                        {option.title}
                        </li>
                    )}
                    style={{ width: '60%' }}
                    renderInput={(params) => (
                        <TextField {...params} label="Words" placeholder="Favorites" />
                    )}
                />
                <Button variant="contained" style={{ width: '30%' }} size='small' onClick={generateRandomWords} startIcon={<Icon icon="charm:refresh" />}>Suggeestions</Button>
            </Stack>
        </Stack>
        {selectedWords}
    </div>
  );
};

export default Test;