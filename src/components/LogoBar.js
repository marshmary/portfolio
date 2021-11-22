import React, { useEffect, useState } from 'react';
import '../styles/LogoBar.css';
import Icon from './Icon';

const LogoBar = ({ className = "", style = {}, iconList = [], title = "", half = false }) => {
    // Number of items show in LogoBar
    var visibleItem = 6;
    if (half) visibleItem = 3;

    // Count variable for show icon
    var countVisible = 0;
    var countHidden = 0;

    // Animation for icon button
    // Note: setState does not work immediately that's why I useEffect include
    const [collapsed, setCollapsed] = useState(false);
    const [rotated, setRotated] = useState(false);

    const handleRotate = () => {
        var iconButton = document.getElementById(`${title}_icon`).getAttribute('aria-expanded');
        setCollapsed(iconButton);
    }

    useEffect(() => {
        if (rotated !== collapsed)
            setRotated(!rotated);
    }, [collapsed]);

    return (
        <div style={{ ...style }} className={`logoBar w-100 ${className}`}>
            {/* Title & Navigation button */}
            <div className="d-flex justify-content-between pt-3 mb-2">
                <div className="ps-3 text-start w-80">
                    {title}
                </div>
                {(iconList.length !== visibleItem) ?
                    <div className={`px-2 rotate_ojbect ${rotated ? "rotate_animation" : ""}`} onClick={handleRotate}>
                        <Icon
                            id={`${title}_icon`}
                            className="rotate_button"
                            icon="chevron-down"
                            data-bs-toggle="collapse"
                            data-bs-target={`#${title}`}
                            aria-expanded="false"
                            aria-controls={title}
                        />
                    </div>
                    : ""
                }
            </div>

            {/* Visible icon list */}
            <div className="d-flex justify-content-around">
                {
                    iconList.map(icon => {
                        countVisible++;
                        if (countVisible <= visibleItem)
                            return (
                                <a key={Math.random()} target="_blank" rel="noreferrer" href={icon.page}>
                                    <img className="logo mb-2" src={icon.url} alt={icon.title} />
                                </a>
                            );
                    })
                }
            </div>

            {/* Hidden icon list */}
            <div className="collapse pt-2" id={title}>
                <div className="d-flex justify-content-around">
                    {
                        iconList.map(icon => {
                            countHidden++;
                            if (countHidden > visibleItem)
                                return (
                                    <a key={Math.random()} target="_blank" rel="noreferrer" href={icon.page}>
                                        <img className="logo mb-2" src={icon.url} alt={icon.title} />
                                    </a>
                                );
                        })
                    }
                </div>
            </div>
        </div>
    );
}

export default LogoBar;