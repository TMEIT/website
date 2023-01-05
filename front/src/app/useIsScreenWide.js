import {useState, useEffect} from "react";

/**
* Custom React hook that returns true or false depending on if the screen is {minWidth} px wide
*/
const useIsScreenWide = (minWidth) => {
    const [screenWidth, setScreenWidth] = useState(window.innerWidth);

    useEffect(() => {
        function handleResize() {
            setScreenWidth(window.innerWidth);
        }
        window.addEventListener('resize', handleResize)
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return screenWidth >= minWidth;
};

export default useIsScreenWide;
