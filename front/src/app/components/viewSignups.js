import { useState } from "react";
import {useEffect} from "react";
import { useNavigate } from "react-router-dom";
import styled from "@emotion/styled";
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Slider from '@mui/material/Slider';
import { kisel_blue, kisel_blue_dark, primary_lighter } from "../palette";
import { getApiFetcher } from "../api.js";

const StyledSignupList = styled(SignupList) ({});

function SignupList({className, children}) {
    return (
        <div className={className}>
            {children}
        </div>
    );
}

function listSignupItem({className})
{
return (
    <p>This is a listing</p>
);
}

const render_signups = (data, role) =>
    data.filter(data => data.role === role).map(data => <listSignupItem></listSignupItem>);

const StyledViewSignups = styled(ViewSignups)({});

function ViewSignups({className, eventID})
{
    const [signupList, setSignupList] = useState(null);

    /*
    const loadSignupData = async () => {setSignupList(await getApiFetcher().get(//set path to get signup-data from API with the hlep of eventID).json())}
    useEffect(() => { loadSignupData() }, []); // Load list of signups when component is mounted, only once
    */

    const dummySignupList = {
        signups : [{short_uuid: "derbys", role: "Marshal", canwork: true, work_start: "10", work_end: "03", willBreak: true, break_start: null, break_end: null, comment: ""},
                    {short_uuid: "cdhrYe", role: "Prao", canwork: false, work_start: null, work_end: null, willBreak: false, break_start: null, break_end: null, comment: "Have to watch the kids today"},
                    {short_uuid: "grjsaY", role: "Prao", canwork: true, work_start: "14", work_end: "22", willBreak: true, break_start: "16", break_end: "17", comment: "Have to attend a lecture at 16 to 17. Will have to leave early"}
                ],
    };

    const masterList = render_signups(dummySignupList, "Master");
    const marshalList = render_signups(dummySignupList, "Marshal");
    const praoList = render_signups(dummySignupList, "Prao");

    return(
        <div className={className}>
            <Box component="table" sx={{margin: 3}}>
                <Grid>
                    <h1>Signups for event: {eventID} </h1>
                </Grid>
                <br></br>
                <Grid>
                    <SignupList>{masterList}</SignupList>
                </Grid>
                <Grid>
                    <SignupList>{marshalList}</SignupList>
                </Grid>
                <Grid>
                    <SignupList>{praoList}</SignupList>
                </Grid>
            </Box>
        </div>
    );
}

export default StyledViewSignups