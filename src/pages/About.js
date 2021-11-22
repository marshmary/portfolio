import React from 'react';
import '../styles/Common.css';
import '../styles/About.css';
import PageWrapper from '../components/PageWrapper';
import Info from '../components/Info';
import LogoList from '../components/LogoList';
import Fade from 'react-reveal/Fade';

const About = () => {
    return (
        <div id="about">
            <PageWrapper className="w-100 d-flex flex-column">

                {/* Title */}
                <div className="section_title h-100">
                    About
                </div>

                {/* Content */}
                <div className="flex-grow-1 row mx-0">

                    {/* Left content */}
                    <div className="col-12 col-md-6 px-0 d-flex">
                        <Info className="align-self-center"></Info>
                    </div>

                    {/* Right content */}
                    <Fade bottom>
                        <div className="col-12 col-md-6 px-0 d-flex">
                            <LogoList className="align-self-center w-100"></LogoList>
                        </div>
                    </Fade>
                </div>
            </PageWrapper>
        </div>
    );
}

export default About;