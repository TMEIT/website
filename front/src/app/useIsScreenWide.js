import {useState, useEffect} from "react";

const useIsScreenWide = () => {
    const [screenWidth, setScreenWidth] = useState(window.innerWidth);

    useEffect(() => {
        function handleResize() {
            setScreenWidth(window.innerWidth);
        }
        window.addEventListener('resize', handleResize)
        return () => window.removeEventListener('resize', handleResize);
    });

    return screenWidth >= 1280;
};

export default useIsScreenWide;
