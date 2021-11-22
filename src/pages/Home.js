import React from 'react';
import '../styles/Home.css';
import PageWrapper from '../components/PageWrapper';
import Slide from 'react-reveal/Slide';

const Home = () => {
    return (
        <div className="home_images">
            <PageWrapper className="d-flex align-items-center">
                <Slide left>
                    <div className="home_text">
                        Hello, I'm Tran Thien Phu <br></br>
                        I'm a web developer
                    </div>
                </Slide>
            </PageWrapper>
        </div>
    );
}

export default Home;