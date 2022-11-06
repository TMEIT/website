import React from "react";
import {Link} from "react-router-dom";

import css from 'styled-jsx/css'

import { kiesel_blue, secondary_purp, primary_light, primary_lighter } from "../palette.js";


export const center_a_div_style = css`
    .textbox {
        padding: 1em;
        background: ${primary_lighter};
        border-radius: 1em;
    }
`

function TextSummary({children}) {
    return (
        <div className="textbox">
            {children}
            <style jsx> {center_a_div_style} </style>
        </div>
    );
}

export default TextSummary