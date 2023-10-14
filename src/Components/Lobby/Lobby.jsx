import React, { useState, useEffect } from 'react';
import CheckLogin from '../Auth/CheckLogin';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import './lobby.css';
import { Icon } from '@iconify/react';
import config from '../../config';
import Header from './Header';

const Lobby = () => {
    const [roomCode, setRoomCode] = useState('');
    const [playerId, setPlayerId] = useState(null);
    const [playerName, setPlayerName] = useState('');
    const [roomPlayers, setRoomPlayers] = useState([]);
    const [ready, setReady] = useState(false);
    const [roomInfo, setRoomInfo] = useState([]);
    const [displayVisuals, setDisplayVisuals] = useState(false);

    useEffect(() => {
        try {
            const storedUser = localStorage.getItem('user');
            const userObject = JSON.parse(storedUser);
            setPlayerId(userObject.id);
            setPlayerName(userObject.name);
            setRoomCode(userObject.roomCode);
            
            if (userObject.joined === true) {
                setDisplayVisuals(true);
            }
            if (userObject.started === true) {
                window.location.href = `./room/${userObject.roomCode}`;
            }
        } catch (error) {
            console.log(error);
        }
    }, []);

    const createRoom = async () => {
        try {
            const response = await fetch(config.apiUrlCreateRoom, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name: playerName }),
            });
            const data = await response.json();
            setRoomCode(data.room_code);
            setPlayerId(1);

            try {
                localStorage.setItem("user", JSON.stringify({id:1, name:playerName, roomCode: data.room_code, joined:true}));
            }
            catch (error) {
                console.log(error);
            }
        } catch (error) {
            console.error('Error creating room:', error);
        }
    };

    const joinRoom = async () => {
        try {
            const response = await fetch(`${config.apiUrlJoinRoom}/${roomCode}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name: playerName }),
            });
            const data = await response.json();
            setPlayerId(data.player_id);
            try {
                localStorage.setItem("user", JSON.stringify({id:data.player_id, name:playerName, roomCode: roomCode}));
            }
            catch (error) {
                
            }
            if (data.ready) {
                setReady(true);
            }
        } catch (error) {
            console.error('Error joining room:', error);
        }
    };

    const joinRoomCopy = async (roomCode) => {
        setRoomCode(roomCode);
        try {
            const response = await fetch(`${config.apiUrlJoinRoom}/${roomCode}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name: playerName }),
            });
            const data = await response.json();
            setPlayerId(data.player_id);
            try {
                localStorage.setItem("user", JSON.stringify({id:data.player_id, name:playerName, roomCode: roomCode}));
            }
            catch (error) {
                
            }
            if (data.ready) {
                setReady(true);
            }
        } catch (error) {
            console.error('Error joining room:', error);
        }
    };

    const leaveRoom = async () => {
        try {
            await fetch(`${config.apiUrlLeaveRoom}/${roomCode}/${playerId}`, {
                method: 'POST',
            });
            setPlayerId(null);
            setDisplayVisuals(false);
            localStorage.removeItem("user");
        } catch (error) {
            console.error('Error leaving room:', error);
        }
    };

    const startRoom = async () => {
        try {
            const response = await fetch(`${config.apiUrlStartRoom}/${roomCode}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            const data = await response.json();
            if (data.success) {
                console.log("Room Started");
            }
        }
        catch (error) {
            console.error('Error starting room: ', error);
        }
    };

    useEffect(() => {
        const interval = setInterval(async () => {
            if (roomCode && playerId) {
                try {
                    const response = await fetch(`${config.apiUrlJoinRoom}/${roomCode}`, {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                    });
                    const data = await response.json();
                    if (data.ready) {
                        setRoomPlayers(data.players);
                        setReady(true);
                    }
                    else if (data.noRoom) {
                        leaveRoom();
                    }
                    if (data.started) {
                        localStorage.setItem("user", JSON.stringify({id:playerId, name:playerName, roomCode: roomCode, started: true, joined: true}));
                        console.log(data.meta_data);
                        const playerData = data.meta_data.players.map(({ id, name }) => ({ id, name }));
                        localStorage.setItem('playerData', JSON.stringify(playerData));
                        window.location.href = `./room/${roomCode}`;
                    }
                    else {
                        setRoomPlayers(data.players);
                    }
                } catch (error) {
                    console.error('Error fetching room players:', error);
                }
            }
        }, 5000);

        return () => clearInterval(interval);
    }, [roomCode, playerId, playerName]);

    const listRooms = async () => {
        try {
            const response = await fetch( config.apiUrlListRooms, {
                method: 'GET',
            })
            if (response.ok) {
                const data = await response.json();
                setRoomInfo(data.roomInfo);
            } else {
                console.error('Failed to fetch data from the server.');
            }
        } catch (error) {
            console.error('An error occurred:', error);
        }
    };

    const getDirection = () => {
		if (window.innerWidth <= 768) {
			return 'column';
		} else {
			return 'row';
		}
	};

    const renderPlayerList = () => {
        return (
            <div>
                <h4>Players are Joining...</h4>
                <div className='scrollable'>
                    <Box sx={{ '& > :not(style)': { m: 1 }, display: 'flex', flexDirection:'column', alignItems: 'center', width: '100%' }}>
                        {roomPlayers.map((player) => (
                            <div className='player-joins' key={player.id}>
                                <Box sx={{ '& > :not(style)': { m: 0.2 }, display: 'flex', alignItems: 'center', justifyContent:'flex-start', width: '100%' }}>
                                    <div className='vertical'><b><i>{player.id}.</i></b></div>
                                    <Box sx={{ '& > :not(style)': { m: 1 }, display: 'flex', alignItems: 'center' }}>
                                        <Icon icon="fluent:password-24-regular" style={{fontSize: '24px'}} />
                                        <div><b><i>{player.name}</i></b></div>
                                    </Box>
                                </Box>
                            </div>
                        ))}
                    </Box>
                </div>
            </div>
        );
    };

    const receiveDataFromChild = (data) => {
        setPlayerName(data.name);
    };

    return (
        <div>
            <Header />
            <CheckLogin redirect={'/login'} trueRedirect={'/null'} sendDataToParent={receiveDataFromChild} /><br /><br /><br />
        <div className='room-acter'>
            <div className='room-controls' style={{display: 'flex', flexDirection: getDirection()}}>
                <div className='room-actions'>
                    <h2>Room</h2>
                    <div className='action-content'>
                        <Box sx={{ '& > :not(style)': { m: 2 }, display: 'flex', alignItems: 'center' }}>
                            <Icon icon="wpf:name" style={{fontSize: '32px'}}/>
                            <TextField id="outlined-basic" label="Name" required variant="outlined" value={playerName} onChange={(e) => setPlayerName(e.target.value)}/>
                        </Box>
                        <Box sx={{'& > :not(style)': { m: 1, width: '25ch' },}} noValidate autoComplete="off">
                            <button className="button-85" onClick={createRoom} style={{width: '100%'}}>Create Room</button>
                        </Box>
                        <div style={{height: '30px'}}></div>
                        <Box sx={{ '& > :not(style)': { m: 2 }, display: 'flex', alignItems: 'center' }}>
                            <Icon icon="solar:password-outline" style={{fontSize: '32px'}}/>
                            <TextField id="outlined-basic" label="Room Code" required variant="outlined" value={roomCode} onChange={(e) => setRoomCode(e.target.value)}/>
                        </Box>
                        <Box sx={{'& > :not(style)': { m: 1, width: '25ch' },}} noValidate autoComplete="off">
                            <button className="button-85" onClick={joinRoom} style={{width: '100%'}}>Join Room</button>
                        </Box>
                    </div>
                </div>
                <div className='all-rooms'>
                    <h2>Public Rooms</h2><br />
                    <div>
                        <Box sx={{ '& > :not(style)': { m: 0.2 }, display: 'flex', alignItems: 'center', justifyContent:'space-around', width: '100%' }}>
                            <h3>Available Rooms:</h3>
                            <button className="button-85" onClick={listRooms} style={{ width: "25ch" }}><Icon icon="pepicons-pop:refresh" /> Refresh Rooms</button>
                        </Box><br />
                        <Box sx={{ '& > :not(style)': { m: 1 }, display: 'flex', flexDirection:'column', alignItems: 'center', width: '100%', overflow: 'scroll', maxHeight: '55vh' }}>
                            {Object.keys(roomInfo).map((roomCode) => (
                                roomInfo[roomCode] !== 3 &&  (
                                    <div className='rooms-options' key={roomCode}>
                                        <Box sx={{ '& > :not(style)': { m: 0.2 }, display: 'flex', alignItems: 'center', justifyContent:'space-around', width: '100%' }}>
                                            <div className='vertical'><Icon icon="fluent:conference-room-48-regular" style={{fontSize: '32px'}}/></div>
                                            <Box sx={{ '& > :not(style)': { m: 0.5 }, display: 'flex', flexDirection:getDirection()}}>
                                                <Box sx={{ '& > :not(style)': { m: 1 }, display: 'flex', alignItems: 'center' }}>
                                                    <Icon icon="fluent:password-24-regular" style={{fontSize: '24px'}} />
                                                    <div>Room Code: <b><i>{roomCode}</i></b></div>
                                                </Box>
                                                <Box sx={{ '& > :not(style)': { m: 1 }, display: 'flex', alignItems: 'center' }}>
                                                    <Icon icon="fa:group"/>
                                                    <div>Participants: <b><i>{roomInfo[roomCode]}</i></b></div>
                                                </Box>
                                            </Box>
                                            {/* <Button variant='contained' onClick={() => {joinRoomCopy(roomCode);}}>Join</Button> */}
                                            <button className="button-85" onClick={() => {joinRoomCopy(roomCode);}} style={{ width: "25ch" }}><Icon icon="iconamoon:exit" fontSize={'18px'} /> Join</button>
                                        </Box>
                                    </div>
                                )
                            ))}
                        </Box>
                    </div>
                </div>
            </div>
            {displayVisuals || playerId ? (
                <div className='join-info'>
                    <div className='join-content'>
                        <div style={{display:'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', fontSize: '24px', fontWeight: 'bolder' }}><Icon icon="ic:round-home" style={{fontSize: '64px'}} />{roomCode}</div><br />
                        <h2>Welcome, {playerName}!</h2>
                        {renderPlayerList()}
                        <br />
                        <Box sx={{ '& > :not(style)': { m: 1 }, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            {/* <Button variant='contained' onClick={leaveRoom}>Leave Room</Button> */}
                            <button className="button-85"  onClick={leaveRoom} style={{ width: "25ch" }}><Icon icon="iconamoon:exit" fontSize={'18px'} /> Leave Room</button>
                            { (ready && playerId === 1) ? (
                                // <Button variant='contained' onClick={startRoom}>Start Room</Button>
                                <button className="button-85"  onClick={startRoom} style={{ width: "25ch" }}><Icon icon="solar:play-bold-duotone" fontSize={'18px'} /> Start Room</button>
                            ) : (
                                <div></div>
                            )}
                        </Box>
                    </div>
                </div>
            ) : (
                <div></div>
            )};
        </div>
        </div>
    )
}

export default Lobby