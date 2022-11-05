import css from 'styled-jsx/css'

import AtkinsonHyperlegibleRegular from './fonts/AtkinsonHyperlegible-Regular.ttf';
import MerriweatherRegular from './fonts/Merriweather-Regular.ttf';
import MerriweatherBlack from './fonts/Merriweather-Black.ttf';

// Font importing code taken from here
// https://www.robinwieruch.de/webpack-font/

const fonts = css.global`
@font-face {
    font-family: 'Atkinson Hyperlegible';
    font-style: normal;
    font-weight: normal;
    src:
      url('${AtkinsonHyperlegibleRegular}') format('truetype');
}
@font-face {
    font-family: 'Merriweather';
    font-style: normal;
    font-weight: normal;
    src:
      url('${MerriweatherRegular}') format('truetype');
}
@font-face {
    font-family: 'Merriweather';
    font-style: normal;
    font-weight: 900;
    src:
      url('${MerriweatherBlack}') format('truetype');
}
`
export default fonts