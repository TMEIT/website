import React from "react";

import css from 'styled-jsx/css'

export const center_a_div_style = css`
    .outer {
        display: grid;
        grid-template-columns: 1fr auto 1fr;
    }
    .inner { grid-column-start: 2; }
`

function Centered({children}) {
    return (
        <div className="outer">
            <div className="inner">
                {children}
            </div>
            <style jsx> {center_a_div_style} </style>
        </div>
    );
}

export default Centered