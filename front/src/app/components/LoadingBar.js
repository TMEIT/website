import React from "react";

import { createTheme, ThemeProvider } from '@mui/material/styles';
import LinearProgress from "@mui/material/LinearProgress";

import { kiesel_blue, secondary_purp, data_pink } from "../palette.js";

const loading_bar_color = createTheme({
    palette: {
        primary: {
            main: data_pink,
        }
    },
});

const LoadingBar = ({className}) => {
    return (
            <ThemeProvider theme={loading_bar_color}>
                <LinearProgress className={className} />
            </ThemeProvider>
            )
}

export default LoadingBar;