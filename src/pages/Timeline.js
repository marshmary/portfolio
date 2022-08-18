import React from 'react';
import '../styles/Common.css';
import '../styles/Timeline.css';
import 'react-vertical-timeline-component/style.min.css';
import { VerticalTimeline, VerticalTimelineElement } from 'react-vertical-timeline-component';
import PageWrapper from '../components/PageWrapper';
import Icon from '../components/Icon';

const Timeline = () => {
    // List of events in timeline
    const eventList = [
        {
            title: "Bachelor Degree",
            location: "Can Tho, Viet Nam",
            company: "FPT University",
            time: "09/2019 - Current"
        },
        {
            title: "Internship",
            location: "Can Tho, Viet Nam",
            company: "FPT Soft",
            time: "09/2021 - 12/2021"
        },
        {
            title: "Internship",
            location: "Can Tho, Viet Nam",
            company: "Biwoko",
            time: "06/2022 - 08/2022"
        }
    ];

    // Count to detect even and odd number
    var eventCount = 0;

    // Color
    const colorList = ["#66B8F1", '#F69DA4', '#D0A78A'];

    return (
        <div id="timeline">
            <PageWrapper>
                {/* Title  */}
                <div className="section_title h-100">
                    Timeline
                </div>

                {/* Timeline  */}
                <VerticalTimeline>
                    {
                        eventList.map((event) => {
                            eventCount++;
                            var colorSelected = colorList[Math.floor(Math.random() * colorList.length)];
                            return (
                                <VerticalTimelineElement key={Math.random()}

                                    // style for root div
                                    className="vertical-timeline-element--work"
                                    date={`${event.time}`}

                                    // style for card component
                                    contentStyle={{
                                        boxShadow: "var(--shadow)",
                                        borderRadius: "0.5rem",
                                        borderRight: (eventCount % 2 !== 0) ? `0.5rem solid ${colorSelected}` : "none",
                                        borderLeft: (eventCount % 2 === 0) ? `0.5rem solid ${colorSelected}` : "none"
                                    }}
                                    contentArrowStyle={{ display: "none" }}

                                    // style for date
                                    dateClassName={`text-center ${(eventCount % 2 !== 0) ? "text-md-start" : "text-md-end"} w-100 px-4`}

                                    // style for icon
                                    iconStyle={{ background: `${colorSelected}`, color: '#fff' }}
                                    icon={<Icon icon="graduation-cap" size="lg" />}
                                >
                                    <h4 className="vertical-timeline-element-title">{event.title}</h4>
                                    <h6 className="vertical-timeline-element-subtitle">{event.location}</h6>
                                    <p className="timeline_p">
                                        {event.company}
                                    </p>
                                </VerticalTimelineElement>
                            )
                        })
                    }

                    {/* Final element */}
                    <VerticalTimelineElement
                        iconStyle={{ background: `${colorList[Math.floor(Math.random() * colorList.length)]}`, color: '#fff' }}
                        icon={<Icon icon="star" size="lg" />}
                    />
                </VerticalTimeline>
            </PageWrapper>
        </div>
    );
}

export default Timeline;