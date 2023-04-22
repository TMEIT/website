import styled from "@emotion/styled";

import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';

import { kisel_blue, kisel_blue_dark, primary_lighter } from "../palette";

const StyledSignupListItem = styled(SignupListItem)({});

function SignupListItem({className, worker}) {

    return (
        <div className={className}>
            <Box sx={{marginTop: 1, marginBottom: 1, display: "flex", flexDirection: "row", width: "fill", overflow: "elipsis"}}>
                <Grid mr={2}>
                    <h2>Name: {worker.first_name + " " + worker.last_name}</h2>
                </Grid>
                {(worker.nickname !== null)? <Grid ms={2}><h2>Nickname: {worker.nickname}</h2></Grid>:<></>}
                <Grid ms={2}>
                    <h2>Role: {worker.role}</h2>
                </Grid>
                <Grid ms={2}>
                    <h2>Phone number: {worker.phonenum}</h2>
                </Grid>
                {worker.canWork? 
                <>
                <Grid ms={2}>
                    <h2>Can work?: Yes</h2>
                </Grid>
                <Grid ms={2}>
                    <h2>From: {worker.work_start}</h2>
                </Grid>
                <Grid ms={2}>
                    <h2>To: {worker.work_end}</h2>
                </Grid>
                {worker.willBreak? 
                <>
                <Grid ms={2}>
                    <h2>Will have to leave during event: Yes</h2>
                </Grid>
                <Grid>
                    <h2>From: {worker.leave_start}</h2>
                </Grid>
                <Grid>
                    <h2>To: {worker.leave_end}</h2>
                </Grid>
                </> 
                : 
                <></>
                }
                </>
                :
                <>
                <Grid ms={2}>
                    <h2>Can work?: No</h2>
                </Grid>
                </>
                }
                <Grid ms={2}>
                    <h2>Comment: {worker.comment}</h2>
                </Grid>
            </Box>
        </div>
    )
}

export default StyledSignupListItem