import styled from "@emotion/styled";

import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';

import { kisel_blue, kisel_blue_dark, primary_lighter } from "../palette";

const StyledSignupListItem = styled(SignupListItem)({
    h2: {
        fontSize: "10px",
    },

    ".workerRow": {
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(1.2em, 1fr))",
        maxHeight: "50px",
        overflow: "scroll",
    },

    ".workerDetail": {
        borderStyle: "dotted",
        borderColor: "black",
        borderWidth: "thin",
        overflow: "scroll",
        textOverflow: "ellipsis",
    },

    "@media (max-width: 950px)": {
        h2: {
            fontSize: "9px",
        },

        ".workerRow": {
            gridTemplateColumns: "repeat(auto-fit, minmax(1.4em, 1fr))",
            maxHeight: "40px",
            overflow: "scroll",
        },
    },

});

function SignupListItem({className, worker}) {

    return (
        <div className={className}>
            <Box>
                <div className="workerRow">
                    <Grid className="workerDetail">   <h2>{worker.first_name + " " + worker.last_name} </h2>      </Grid>  {/*display worker's full name*/}
                    <></>
                    <Grid className="workerDetail">   <h2>{worker.role} </h2>                                     </Grid>  {/*display worker's Role: Master, Marshal, Prao or Vraq*/}
                    <></>
                    <Grid className="workerDetail">   <h2>{worker.phonenum} </h2>                                 </Grid>  {/*Display worker's phone number*/}
                    <></>
                    {worker.canwork?                         //Check whether worker can work or not
                        <>
                        <></>
                        <Grid className="workerDetail">   <h2>Yes </h2>                                               </Grid>  {/*If worker has answered Yes:*/}
                        <></>
                        <Grid className="workerDetail">   <h2>{worker.work_start} </h2>                               </Grid>  {/*Answer from when the worker will start their shift*/}
                        <></>
                        <Grid className="workerDetail">   <h2>{worker.work_end} </h2>                                 </Grid>  {/*Answer at which time the worker's shift has to end*/}
                        <></>
                        {worker.willBreak?                      //Check whether worker will have to leave during the event
                            <>
                            <></>
                            <Grid className="workerDetail">   <h2>Yes </h2>                                               </Grid>  {/*If yes then answer yes in the table*/}
                            <></>    
                            <Grid className="workerDetail">   <h2>{worker.break_start} </h2>                              </Grid>  {/*Answer from when the worker has to leave*/}
                            <></>
                            <Grid className="workerDetail">   <h2>{worker.break_end} </h2>                                </Grid>  {/*Answer at which time the worker will come back*/}
                            <></>
                            </> 
                            : 
                            <>
                            <></>
                            <Grid className="workerDetail">   <h2>No </h2>                                                </Grid>  {/*If worker does not have to leave during the event, aswer No in the table*/}
                            <></>
                            <Grid className="workerDetail">   <h2>--- </h2>                                               </Grid>
                            <></>
                            <Grid className="workerDetail">   <h2>--- </h2>                                               </Grid>
                            <></>
                            </>
                        }
                        </>
                        :
                        <>
                        <></>
                        <Grid className="workerDetail">  <h2>No </h2>                                               </Grid>   {/*If worker cannot work, then answer no in the table. All consequent fields will be emptyu*/}
                        <></>
                        <Grid className="workerDetail">  <h2>--- </h2>                                              </Grid>
                        <></>
                        <Grid className="workerDetail">  <h2>--- </h2>                                              </Grid>
                        <></>
                        <Grid className="workerDetail">  <h2>--- </h2>                                              </Grid>
                        <></>
                        <Grid className="workerDetail">  <h2>--- </h2>                                              </Grid>
                        <></>
                        <Grid className="workerDetail">  <h2>--- </h2>                                              </Grid>
                        <></>
                        </>
                    }
                    <></>
                    <Grid className="workerDetail">   <h2>{worker.comment} </h2>                                  </Grid>    {/*Display any comments the worker might have*/}
                </div>
            </Box>
        </div>
    )
}

export default StyledSignupListItem