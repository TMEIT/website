import styled from "@emotion/styled";

import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';

import { kisel_blue, kisel_blue_dark, primary_lighter } from "../palette";

const StyledSignupListItem = styled(SignupListItem)({
    h2: {
        fontSize: "12px",
    }
});

function SignupListItem({className, worker}) {

    return (
        <div className={className}>
            <Box sx={{marginTop: 1, marginBottom: 1, display: "flex", flexDirection: "row", flexWrap: "wrap", width: "fill", overflow: "elipsis"}}>
                <Grid mr={2}>
                    <h2>{worker.first_name + " " + worker.last_name}</h2>   {/*display worker's full name*/}
                </Grid>
                {(worker.nickname !== null)? <Grid ms={2}><h2>{worker.nickname}</h2></Grid>:<></>} {/*If worker has a nickname, display it. Otherwise don't*/}
                <Grid ms={2}>
                    <h2>{worker.role}</h2>  {/*Display worker's role: Master, Marshal, Prao or Vraq*/}
                </Grid>
                <Grid ms={2}>
                    <h2>{worker.phonenum}</h2>  {/*Display worker's phone number*/}
                </Grid>
                {worker.canwork?   //Check whether worker can work or not
                <>
                <Grid ms={2}>      {/*If worker has answered Yes:*/}
                    <h2>Yes</h2>    {/*Answer yes in the table*/}
                </Grid>
                <Grid ms={2}>
                    <h2>{worker.work_start}</h2> {/*Answer from when the worker will start their shift*/}
                </Grid>
                <Grid ms={2}>
                    <h2>{worker.work_end}</h2>  {/*Answer at which time the worker's shift has to end*/}
                </Grid>
                {worker.willBreak?      //Check whether worker will have to leave during the event
                <>
                <Grid ms={2}>       {/*If yes then answer yes in the table*/}
                    <h2>Yes</h2>
                </Grid>
                <Grid>
                    <h2>{worker.break_start}</h2>   {/*Answer from when the worker has to leave*/}
                </Grid>
                <Grid>
                    <h2>{worker.break_end}</h2>     {/*Answer at which time the worker will come back*/}
                </Grid>
                </> 
                : 
                <>
                <Grid ms={2}>           {/*If worker does not have to leave during the event, aswer No in the table*/}
                    <h2>No</h2>
                </Grid>
                </>
                }
                </>
                :
                <>
                <Grid ms={2}>
                    <h2>No</h2>         {/*If worker cannot work, then answer no in the table. All consequent fields will be emptyu*/}
                </Grid>
                </>
                }
                <Grid ms={2}>
                    <h2>{worker.comment}</h2>       {/*Display any comments the worker might have*/}
                </Grid>
            </Box>
        </div>
    )
}

export default StyledSignupListItem