import React, {useEffect, useState} from 'react'
import Header from './Header';
import Spline from '@splinetool/react-spline';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import { Icon } from '@iconify/react';
import './layout.css';
import mission from '../../Assets/land_mission.svg';
import config from '../../config';
import Loader from './Loader';

const Landing = () => {
    const [bgImage, setBgImage] = useState(false);
    const [email, setEmail] = useState('');
    const [feedback, setFeedback] = useState('');
    const [sumbittedFeed, setSumbittedFeed] = useState(false);

    useEffect(() => {
        const screenWidth = window.innerWidth;
        if (screenWidth < 768) {
            setBgImage(true);
        } else {
            setBgImage(false);
        }   
    }, []);

    const handleStart = () => {
        window.location.href = './login';
    }

    const handleGit = () => {
        window.location.href = './login';
    }

    const handleSubmit = async() => {
        try {
            const response = await fetch( config.apiUrlFeedback, {
                method: 'POST',
                headers: {
                'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, feedback }),
            });
        
            if (response.ok) {
                const data = await response.json();
                if (data.success) {
                    console.log(data);
                    setSumbittedFeed(true);
                } else {
                    console.error('Login failed:', data.message);
                }
            } else {
                console.error('HTTP error:', response.status);
            }
        } catch (error) {
            console.error('An error occurred:', error);
        }
    }

    return (
        <div className='Landing' style={{background: '#9BA3B7'}}>
            <Loader time='5000'/>
            <Header />
            {!bgImage ? (
                <div className='back-3d' id='about'>
                    <Spline scene="https://prod.spline.design/vlGVxbQy4LSX233f/scene.splinecode" style={{width: '100%', height: '100%'}} />
                </div>
            ) : (
                <div className='back-3d-mobile' id='about'>
                    <Spline scene="https://prod.spline.design/vlGVxbQy4LSX233f/scene.splinecode" style={{width: '100%', height: '100%'}} />
                </div>
            )}
            
            <div className='intro'>
                <div className='intro-mega1'>StoryCircle</div>
                <div className='intro-mega2'>Welcome to Our Collaborative Storytelling Adventure!</div>
                <div className='intro-mini'>Are you ready to embark on a journey of creativity, imagination, and teamwork? Look no further - our online collaborative storytelling game is here to spark your imagination and connect you with fellow storytellers from around the world.</div>
                <div className='intro-controls'><Button variant="contained" endIcon={<Icon icon="line-md:arrow-right" />} onClick={handleStart}><p style={{fontWeight: 'bolder'}}>Get Started</p></Button></div>
            </div>

            <div className='spacer' id='mission'></div>

            <div className='mission' >
                <img className='mission-image' src={mission} alt="Mission" />
                <div className='mission-content'>
                    <div className='mission-header'>Our Mission</div>
                    <div className='mission-text'>At StoryCircle, our mission is to unite individuals from diverse backgrounds, fostering creativity, teamwork, and a shared love for storytelling. We believe in the power of collaborative storytelling to inspire imagination, cultivate bonds, and create unforgettable narratives together.</div>
                </div>
            </div>

            <div className='spacer' id='working'></div>

            <div className='working'>
                <div className='working-content'>
                    <div className='working-header'>How does it Works?</div>
                    <div className='working-text'>In our collaborative storytelling game, participants collectively choose a story genre, from mystery to fantasy or romance. Each storyteller contributes just one word, adding an element of surprise to the narrative canvas. Our AI-driven model then takes these ingredients and weaves them into an exciting and coherent story in real-time. What sets this adventure apart is the power of collaboration. Engage in discussions with your fellow storytellers to shape the characters, plot, and direction of the unfolding tale. It's a dynamic and immersive storytelling experience where your creativity plays a pivotal role in crafting a unique and thrilling narrative. Join us today and start your journey into the world of collaborative storytelling!</div>
                </div>
                <div className='working-map'>
                    <div className='working-mapbox' id='working-mapbox'>
                        <Spline scene="https://prod.spline.design/hizh8Xu39dFx8YNR/scene.splinecode" />
                    </div>
                </div>
            </div>

            <div className='spacer' id='features'></div>

            <div className='features'>
                <h1>Features</h1><br />
                <div className="flex-container">
                    <div className="flex-item1">
                        <div className="marker">
                            <div className="ribbon">
                                <span>1</span>
                            </div>
                        </div>
                        <h2><b>Dynamic Storytelling</b></h2><br />
                        <span>Experience the thrill of dynamic storytelling as your contributions shape the narrative in real-time, making each story unique.</span>
                    </div>
                    <div className="flex-item2"><div className="numbers"><h3>1</h3></div></div>
                </div>

                <div className="flex-container">
                    <div className="flex-item3"><div className="flex-item2"><div className="numbers"><h3>2</h3></div></div></div>
                    <div className="flex-item4">
                        <div className="marker">
                            <div className="ribbon">
                                <span>2</span>
                            </div>
                        </div>
                        <h2><b>Genre Variety</b></h2><br />
                        <span>Explore a world of genres, from spine-tingling mysteries to enchanting fantasies. Our diverse community ensures there's a genre for everyone.</span>
                    </div>
                </div>

                <div className="flex-container">
                    <div className="flex-item5">
                        <div className="marker">
                            <div className="ribbon">
                                <span>3</span>
                            </div>
                        </div>
                        <h2><b>Community Interaction</b></h2><br />
                        <span>Connect with fellow participants, discuss story direction, and appreciate the rich tapestry of perspectives within our global storytelling community.</span>
                    </div>
                    <div className="flex-item6"><div className="flex-item2"><div className="numbers"><h3>3</h3></div></div></div>
                </div>

                <div className="flex-container">
                    <div className="flex-item7"><div className="flex-item2"><div className="numbers"><h3>4</h3></div></div></div>
                    <div className="flex-item8">
                        <div className="marker">
                            <div className="ribbon">
                                <span>4</span>
                            </div>
                        </div>
                        <h2><b>Immerse in Creativity</b></h2><br />
                        <span>Unleash your creative side. Whether you're a seasoned wordsmith or a novice, our platform provides a canvas for your imagination to thrive.</span>
                    </div>
                </div>
            </div>
            
            <div className='end-spacer' id='contact'></div>

            <div className='end-intro'>
                <div className='end-left'>
                    <div className='left-header'>Join the StoryCircle Community</div>
                    <div className='left-content'>Ready to embark on your collaborative storytelling journey?</div>
                    <Button variant="contained" endIcon={<Icon icon="line-md:arrow-right" />} onClick={handleGit}><p style={{fontWeight: 'bolder'}}>Github </p></Button><br />
                    <div className='left-header'>Get Started Today</div>
                    <div className='left-content'>Don't wait for accidents to happen. Take control of your safety and join StoryCircle today. Sign up now to experience the future of road safety.</div>
                    <Button variant="contained" endIcon={<Icon icon="line-md:arrow-right" />} onClick={handleStart}><p style={{fontWeight: 'bolder'}}>Sign Up Now !</p></Button>
                </div>
                <div className='end-right'>
                    <div className='right-header'>Contact Us</div>
                    <div className='right-content'>Have questions or need assistance? Our dedicated support team is here to help.</div>
                    <div className='contact-form'>
                        <Box component="form" sx={{ '& .MuiTextField-root': { m: 1, display: 'flex', flexDirection: 'row', width: '90%', alignContent: 'center', justifyContent: 'center', alignItems: 'center' }, }} noValidate autoComplete="off">
                            <TextField id="filled-multiline-static" label="Email" fullWidth required value={email} onChange={(e) => setEmail(e.target.value)} disabled={sumbittedFeed}/>
                            <TextField id="filled-multiline-static2" label="Message" multiline rows={4} fullWidth variant="filled" value={feedback} onChange={(e) => setFeedback(e.target.value)} disabled= {sumbittedFeed}/>
                        </Box>
                        {sumbittedFeed ? (
                            <div className='form-submit'><Button variant="contained" color='success' endIcon={<Icon icon="fluent:mail-checkmark-24-filled" />}><p style={{fontWeight: 'bolder'}} >SENT</p></Button><br />
                            <b><i>WE WILL REACH OUT TO YOU SOON!!!</i></b></div>
                        ) : (
                            <div className='form-submit'><Button variant="contained" endIcon={<Icon icon="ic:round-mail" />} onClick={handleSubmit}><p style={{fontWeight: 'bolder'}} >SEND</p></Button></div>
                        )}
                    </div>
                </div>
            </div>

            <div className='spacer' id='features'></div>
        </div>
    )
}

export default Landing