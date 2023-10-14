import React, { useEffect, useState } from 'react'
import { useTheme } from '@mui/material/styles';
import { useParams } from 'react-router-dom';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Chip from '@mui/material/Chip';
import Button from '@mui/material/Button';
import { Icon } from '@iconify/react';
import './room.css'
import config from '../../config';
import CheckLogin from '../Auth/CheckLogin';
import Header from '../Lobby/Header';
import { styled } from '@mui/material/styles';
import SpeedDial from '@mui/material/SpeedDial';
import SpeedDialIcon from '@mui/material/SpeedDialIcon';
import SpeedDialAction from '@mui/material/SpeedDialAction';
import LinearProgress from '@mui/material/LinearProgress';
import FileCopyIcon from '@mui/icons-material/FileCopyOutlined';
import Slider from '@mui/material/Slider';
import SaveIcon from '@mui/icons-material/Save';
import PrintIcon from '@mui/icons-material/Print';
import ShareIcon from '@mui/icons-material/Share';

const StyledSpeedDial = styled(SpeedDial)(({ theme }) => ({
  position: 'absolute',
  '&.MuiSpeedDial-directionUp, &.MuiSpeedDial-directionLeft': {
    bottom: theme.spacing(2),
    right: theme.spacing(2),
  },
  '&.MuiSpeedDial-directionDown, &.MuiSpeedDial-directionRight': {
    top: theme.spacing(2),
    left: theme.spacing(2),
  },
}));

const actions = [
  { icon: <FileCopyIcon />, name: 'Copy' },
  { icon: <SaveIcon />, name: 'Save' },
  { icon: <PrintIcon />, name: 'Print' },
  { icon: <ShareIcon />, name: 'Share' },
];

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

const genres = [
    'Mystery',
    'Fantasy',
    'Adventure',
    'Science Fiction',
    'Romance',
    'Horror',
    'Thriller',
    'Historical',
    'Comedy',
    'Drama',
    'Western',
    'Biography',
    'Autobiography',
    'Superhero',
    'Political',
    'Epic',
    'Satire',
    'Fairy Tale',
];

function getStyles(name, personName, theme) {
    return {
        fontWeight:
            personName.indexOf(name) === -1
            ? theme.typography.fontWeightRegular
            : theme.typography.fontWeightMedium,
    };
}

const Room = () => {
    const { code } = useParams();
    const [userId, setUserId] = useState(null);
    const [userName, setUserName] = useState('');
    const [roomCode, setRoomCode] = useState('');
    const [word, setWord] = useState('');
    const [selectedGenres, setSelectedGenres] = useState([]);
    const [additionalChanges, setAdditionalChanges] = useState('');
    const [displayGenerate, setDisplayGenerate] = useState(false);
    const [story, setStory] = useState(false);
    const [storyContent, setStoryContent] = useState(null);
    const [disabled, setDisabled] = useState(false);
    const [wordLimit, setWordLimit] = useState(200);

    const theme = useTheme();

    const handleChange = (event) => {
        const {
        target: { value },
        } = event;
        setSelectedGenres(
        // On autofill we get a stringified value.
        typeof value === 'string' ? value.split(',') : value,
        );
    };

    useEffect(() => {
        try {
            const storedUser = localStorage.getItem('user');
            const userObject = JSON.parse(storedUser);
            setUserId(userObject.id);
            setUserName(userObject.name);
            setRoomCode(userObject.roomCode);
            
            if (userObject.roomCode !== code) {
                window.location.href = config.apiUrlLobby;
            }
        } catch (error) {
            window.location.href = config.apiUrlLobby;
        }
    }, [code]);

    const sendTokens = async () => {
        try {
            const response = await fetch(`${config.apiUrlHandleTokens}/${roomCode}/${userId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ word: word, genres: selectedGenres, additionalChanges: additionalChanges }),
            })
            const data = await response.json();
            setDisabled(true);
            if (data.process) {
                setDisplayGenerate(true);
                setDisabled(true);
                console.log("true");
            }
            else {
                setDisplayGenerate(false);
                console.log('false');
            }
        }
        catch (error) {
            console.error(error);
        }
    };

    const leaveRoom = async () => {
        try {
            await fetch(`${config.apiUrlLeaveRoom}/${roomCode}/${userId}`, {
                method: 'POST',
            });
            setUserId(null);
            localStorage.removeItem("user");
            window.location.href = config.apiUrlLobby;
        } catch (error) {
            console.error('Error leaving room:', error);
        }
    };

    const handleGenerate = async () => {
        try {
            const response = await fetch(`${config.apiUrlGenerateStory}/${roomCode}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ wordLimit: wordLimit}),
            });
            const data = await response.json();
            if (data.success) {
                setStory(data.success);
                setStoryContent(data.storyContent);
                console.log("True");
            }
            else {
                console.log("failed");
                console.log(data.message);
            }
        }
        catch (error) {
            console.error(error);
        }
    }

    const [time, setTime] = useState(5000);

    useEffect(() => {
        const interval = setInterval(async () => {
            if (roomCode) {
                try {
                    const response = await fetch(`${config.apiUrlHandleTokens}/${roomCode}/${userId}`, {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                    });
                    const data = await response.json();
                    if (data.process) {
                        setDisplayGenerate(true);
                        setTime(10000);
                    }
                    if (data.generated) {
                        complete();
                    }
                } catch (error) {
                    console.error(error);
                }
            }
        }, time);

        return () => clearInterval(interval);
    }, [roomCode, userId, userName, time]);

    const complete = async () => {
        try {
            const response = await fetch(`${config.apiUrlComplete}/${roomCode}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            
            const data = await response.json();
            if (response.ok) {
                console.log("success")
                setStory(true);
                setStoryContent(data.story_content);
                setTime(600000);
            }
        }
        catch (error) {
            console.log(error);
        }
    };

    const [hearts, sethearts] = useState(false);
    const [likeCount, setLikeCount] = useState(null);

    const handleReactTrue = async() => {
        try {
            const response = await fetch(`${config.apiUrlReactionTrue}/${roomCode}`, {
            method: 'GET',
            });
            const data = await response.json();
            if (response.ok) {
                if (data.success) {
                    sethearts(true);
                    setLikeCount(data.likeCount);
                }
                else {
                    sethearts(false);
                }
            }
            else {
                console.log("failed");
            }
        }
        catch (error) {
            console.log(error);
        }
    };

    const handleReactFalse = async() => {
        try {
            const response = await fetch(`${config.apiUrlReactionFalse}/${roomCode}`, {
            method: 'GET',
            });
            const data = await response.json();
            if (response.ok) {
                if (data.success) {
                    sethearts(false);
                    setLikeCount(data.likeCount);
                }
                else {
                    sethearts(true);
                }
            }
            else {
                console.log("failed");
            }
        }
        catch (error) {
            console.log(error);
        }
    };

    const [progress, setProgress] = useState(null);
    const [text, setText] = useState(null);
    const [chatData, setChatData] = useState([]);

    useEffect(() => {
        const interval = setInterval(async () => {
            if (roomCode) {
                try {
                    const response = await fetch(`${config.apiUrlHandleRoomChat}/${roomCode}`, {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                    });
                    const data = await response.json();
                    if (response.ok) {
                        if (data.success) {
                            setChatData(data.chats);
                            setProgress(data.pollCount * 20);
                            setSentButton(true);
                        }
                        else {
                            console.log("failed");
                        }
                    }
                    else {
                        console.log('failed');
                    }
                } catch (error) {
                    console.error(error);
                }
            }
        }, 6000);

        return () => clearInterval(interval);
    }, [roomCode, userId]);

    const [sentButton, setSentButton] = useState(true);

    const handleChatInput = async() => {
        if (text !== null) {
            try {
                const response = await fetch(`${config.apiUrlHandleChatInput}/${roomCode}/${userId}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ 'text': text })
                });
                const data = await response.json();
                if (response.ok) {
                    if (data.success) {
                        console.log("sent");
                        setText(null);
                        setSentButton(false);
                    }
                }
            }
            catch (error) {
                console.log(error);
            }
        }
    };

    const handlePollInput = async() => {
        try {
            const response = await fetch(`${config.apiUrlHandlePollData}/${roomCode}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            const data = await response.json();
            if (response.ok) {
                if (data.success) {
                    console.log("Polled");
                }
            }
        }
        catch (error) {
            console.log(error);
        }
    };

    function valuetext(value) {
        return `${value} words`;
      }


    const receiveDataFromChild = (data) => {
    };
    
    return (
        <div>
        <Header />
        <CheckLogin redirect={'/login'} trueRedirect={'/null'} sendDataToParent={receiveDataFromChild} /><br /><br />
        <div className = 'room-main'>
            <div className='sidebar'>
                <div className='logs'>
                    <div style={{display:'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', fontSize: '24px', fontWeight: 'bolder' }}><Icon icon="ic:round-home" style={{fontSize: '64px'}} />{code}</div><br />
                    <h2>{userName}</h2>
                </div><br />
                <Box sx={{ '& > :not(style)': { m: 0.5 }, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                    <InputLabel id="word-label">Suggest a Word</InputLabel>
                    <TextField size='small' fullWidth id="outlined-basic" label="Word" variant="outlined" onChange={(e) => setWord(e.target.value)} disabled={disabled} />
                    <InputLabel id="demo-multiple-chip-label">Select Genres</InputLabel>
                    <Select
                        labelId="demo-multiple-chip-label"
                        id="demo-multiple-chip"
                        multiple
                        disabled={disabled}
                        size='small'
                        fullWidth
                        value={selectedGenres}
                        onChange={handleChange}
                        input={<OutlinedInput id="select-multiple-chip" label="Chip" />}
                        renderValue={(selected) => (
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                            {selected.map((value) => (
                                <Chip key={value} label={value} />
                            ))}
                            </Box>
                        )}
                        MenuProps={MenuProps}
                        label="Genres"
                        >
                        {genres.map((name) => (
                            <MenuItem
                            key={name}
                            value={name}
                            style={getStyles(name, selectedGenres, theme)}
                            >
                            {name}
                            </MenuItem>
                        ))}
                    </Select>
                    <TextField size='small' id="filled-multiline-static" label="Additional Context" multiline rows={3} variant="filled" fullWidth onChange={(e) => setAdditionalChanges(e.target.value)} disabled={disabled} />
                    {userId === 1 && (
                        <div>
                            <InputLabel id="word-lesbe">Word Limit</InputLabel>
                            <Slider
                                aria-label="Temperature"
                                defaultValue={200}
                                getAriaValueText={valuetext}
                                valueLabelDisplay="auto"
                                step={50}
                                marks
                                min={50}
                                max={500}
                                value={wordLimit}
                                onChange={(e) => setWordLimit(e.target.value)}
                            />
                        </div>
                    )}
                </Box><br />
                <Box sx={{ '& > :not(style)': { m: 0.5 }, display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around' }}>
                    <Button variant='contained' onClick={sendTokens} disabled={disabled}>{disabled ? (<div style={{justifyContent: 'center'}}>SENT <Icon icon="ep:circle-check-filled" color="green" /></div>): (<div style={{alignItems: 'center'}}>SEND <Icon icon="fluent:send-16-filled" /></div>)}</Button>
                    <Button variant='contained' onClick={leaveRoom}>Leave Room</Button>
                </Box><br />
                {(displayGenerate && userId === 1) ? (
                    <Box sx={{ '& > :not(style)': { m: 0.5 }, display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                        <Button variant='contained' onClick={handleGenerate}startIcon={<Icon icon="mdi:thunder" />}>Generate Story</Button>
                    </Box>
                ): (
                    <div></div>
                )}
            </div>
            <div className='story-body'>
                <div className='story-text'>    
                    {story ? (
                        <div className='story-text-content'>{storyContent}</div>
                    ): (
                        <div className='story-text-content'>Loading....</div>
                    )}
                </div>
                <div className='story-reactions'>
                    <div className='react-right'>
                        <StyledSpeedDial
                            ariaLabel="SpeedDial playground example"
                            icon={<SpeedDialIcon />}
                            direction='left'
                            >
                            {actions.map((action) => (
                                <SpeedDialAction
                                key={action.name}
                                icon={action.icon}
                                tooltipTitle={action.name}
                                />
                            ))}
                        </StyledSpeedDial>
                    </div>
                    <div className='react-left'>        
                        {hearts ? (
                            <Button variant="contained" startIcon={<Icon icon="mdi:heart" />} onClick={handleReactFalse}>{likeCount && (likeCount)} Likes</Button>
                            ) : (
                            <Button variant="contained" startIcon={<Icon icon="mdi:heart-outline" />} onClick={handleReactTrue}>Like</Button>
                            )
                        }
                    </div>
                </div>
            </div>
            <div className='group-chat'>
                <div className='chating'>
                    <div className='chat-view'>
                        
                    {chatData.map(chat => (
                        <div className='single-chat' style={{ float: `${chat.id === userId ? ('right') : ('left')}`, backgroundColor: `${chat.id === userId ? ('') : ('#0093E9')}`, backgroundImage: `${chat.id === userId ? ('radial-gradient( circle farthest-corner at 10% 20%,  rgba(176,229,208,1) 42%, rgba(92,202,238,0.41)93.6%)') : ('linear-gradient(160deg, #0093E9 0%, #80D0C7 100%)')}`}}>
                            {chat.text}
                        </div>
                    ))}

                    </div>
                    <div className='chat-input'>
                            <Box sx={{ '& > :not(style)': { m: 0.5 }, display: 'flex', alignItems: 'center' }}>
                                <TextField id="filled-multiline-flexible" label="Enter text" value={text} onChange={(e) => setText(e.target.value)} multiline maxRows={4} variant="filled" size='small' fullWidth/>
                                {sentButton ? (
                                    <Icon icon="ion:send" style={{fontSize: '28px'}} onClick={handleChatInput}/>
                                ) : (
                                    <Icon icon="ion:send" style={{fontSize: '28px'}} color='grey'/>
                                ) }
                            </Box>
                    </div>
                </div>
                <div className='polling'>
                    <Box sx={{ '& > :not(style)': { m: 0.5 }, width: '100%', margin: '12px auto', padding: '3px', display: 'flex', flexDirection: 'column', alignContent: 'center' }}>
                        <div>
                            <LinearProgress variant="determinate" value={progress} />
                            <div className='display-votes' style={{fontSize: '12px', fontWeight: 'bold'}}>{progress / 20} Vote</div>
                        </div>
                        <Button variant="contained" color='secondary' startIcon={<Icon icon="ant-design:thunderbolt-filled" />} size='small' onClick={handlePollInput} >Re-Generate</Button>
                    </Box>
                </div>
            </div>
        </div>
        </div>
    )
}

export default Room