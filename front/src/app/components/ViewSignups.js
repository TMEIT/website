import { useState } from "react";
import {useEffect} from "react";
import { useNavigate } from "react-router-dom";
import styled from "@emotion/styled";
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Slider from '@mui/material/Slider';
import { kisel_blue, kisel_blue_dark, primary_lighter } from "../palette";
import { getApiFetcher } from "../api.js";

const StyledSignupList = styled(SignupList) ({ 
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "space-around",
    alignItems: "center",
})

function SignupList({className, children}) {
    return (
        <div className={className}>
            {children}
        </div>
    );
}

const render_signups = (data, role) => 
    Object.values(data).filter(data => data.role === role).map(data => <h2>Name: {data.short_uuid}  Role: {data.role} Can work: {data.canwork? <>Yes</> : <>No</>}
                                                        {data.canwork? <>From: {data.work_start} To: {data.work_end}</>:<></>}
                                                        Has to leave during event: {data.willBreak? <>Yes</> : <>No</>}
                                                        {data.willbreak? <>From: {data.break_start} To: {data.break_end}</> : <></>}
                                                        Comment: {data.comment}</h2>)

const StyledViewSignups = styled(ViewSignups)({
    ".viewSignups": {
        padding: "1em",
        borderRadius: "1em",
        background: primary_lighter,
    },
});

function ViewSignups({className, eventID})
{

    /*
    const loadSignupData = async () => {setSignupList(await getApiFetcher().get(//set path to get signup-data from API with the help of eventID).json())}
    useEffect(() => { loadSignupData() }, []); // Load list of signups when component is mounted, only once
    */

    const dummySignupList = {
        signups : [{short_uuid: "derbys", role: "Marshal", canwork: true, work_start: "10", work_end: "03", willBreak: true, break_start: null, break_end: null, comment: ""},
                    {short_uuid: "cdhrYe", role: "Prao", canwork: false, work_start: null, work_end: null, willBreak: false, break_start: null, break_end: null, comment: "Have to watch the kids today"},
                    {short_uuid: "grjsaY", role: "Prao", canwork: true, work_start: "14", work_end: "22", willBreak: true, break_start: "16", break_end: "17", comment: "Have to attend a lecture at 16 to 17. Will have to leave early"}
                ]
    };

    const masterList = render_signups(dummySignupList, "Master");
    const marshalList = render_signups(dummySignupList, "Marshal");
    const praoList = render_signups(dummySignupList, "Prao");

    return(
        <div className={className}>
            <div className="viewSignups">
                <Box sx={{margin: 3}}>
                    <Grid>
                        <h1>Signups for event: {eventID} </h1>
                    </Grid>
                    <br></br>
                    <Grid>
                        <StyledSignupList>{masterList}</StyledSignupList>
                    </Grid>
                    <Grid>
                        <StyledSignupList>{marshalList}</StyledSignupList>
                    </Grid>
                    <Grid>
                        <StyledSignupList>{praoList}</StyledSignupList>
                    </Grid>
                </Box>
            </div>
        </div>
    );
}

export default StyledViewSignups