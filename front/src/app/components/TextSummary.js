import React from "react";
import {Link} from "react-router-dom";

import css from 'styled-jsx/css'

import { kiesel_blue, secondary_purp, primary_light } from "../palette.js";


export const center_a_div_style = css`
    .outer {
        display: grid;
        grid-template-columns: 1fr auto 1fr;
    }
    .inner {
        grid-column-start: 2;
        max-width: 60rem;
        padding-left: 1em;
        padding-right: 1em;
        background: ${primary_light};
    }
`

function TextSummary({children}) {
    return (
        <div className="outer">
            <div className="inner">
                {children}
            </div>
            <style jsx> {center_a_div_style} </style>
        </div>
    );
}

export default TextSummary