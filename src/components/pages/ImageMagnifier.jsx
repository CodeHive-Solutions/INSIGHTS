import React, { useState } from 'react';
import Box from '@mui/material/Box';
import imageTest from '../../images/workstations/piso-2.png';

function ImageMagnifier() {
    const [showMagnifier, setShowMagnifier] = useState(false);
    const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });

    const handleMouseHover = (e) => {
        const { left, top, width, height } =
            e.currentTarget.getBoundingClientRect();
        const x = ((e.pageX - left) / width) * 100;
        const y = ((e.pageY - top) / height) * 100;

        setCursorPosition({ x: e.pageX - left, y: e.pageY - top });
    };

    return (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <div
                className="img-container"
                onMouseEnter={() => setShowMagnifier(true)}
                onMouseLeave={() => setShowMagnifier(false)}
                onMouseMove={handleMouseHover}
                style={{ position: 'relative' }}
            >
                <img className="magnifier-img" src={imageTest} alt="" />

                {showMagnifier && (
                    <div
                        style={{
                            position: 'absolute',
                            left: 'calc(100% + 20px)', // Position to the right of the image
                            top: 0,
                            width: '500px', // Set width of magnifier
                            height: '500px', // Set height of magnifier
                            border: '2px solid #ccc', // Add border for visual clarity
                            borderRadius: '5px', // Optional: Add border radius for aesthetics
                            overflow: 'hidden', // Hide overflow content
                        }}
                    >
                        <div
                            className="magnifier-image"
                            style={{
                                width: '100%', // Increase background size for zoom effect
                                height: '100%', // Increase background size for zoom effect
                                backgroundImage: `url(${imageTest})`,
                                backgroundPosition: `${-cursorPosition.x * 4 + 100}% ${-cursorPosition.y * 4 + 100}%`, // Adjust background position based on cursor position
                            }}
                        />
                    </div>
                )}
            </div>
        </Box>
    );
}

export default ImageMagnifier;
