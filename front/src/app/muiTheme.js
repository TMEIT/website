import { createTheme } from '@mui/material/styles';

import { kiesel_blue, me_green, data_pink } from "./palette.js";


const theme = createTheme({
    palette: {
        primary: {
            // light: will be calculated from palette.primary.main,
            main: me_green,
            // dark: will be calculated from palette.primary.main,
            // contrastText: will be calculated to contrast with palette.primary.main
        },
        secondary: {
            main: data_pink,
        }
    }
});

export default theme;
