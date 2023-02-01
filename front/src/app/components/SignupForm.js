import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "@emotion/styled";
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Slider from '@mui/material/Slider';
import { kisel_blue_dark, primary_lighter } from "../palette";

const StyledSignupForm = styled(SignupForm)({
    ".signupForm": {
        padding: "1em",
        background: primary_lighter,
        borderRadius: "1em",
        marginBottom: "1em",
    },

    ".submit": {
        display : "flex",
        justifyContent: "flex-end"
    }
})

function SignupForm({className, eventID = "Friday pub"})
{

    //IMPLEMENT FUNCTION THAT RETREIVES ME-DATA FROM API

    //IMPLEMENT FUNCTION THAT RETREIVES ME-DATA FROM API
    const timeMarks = [{value: 0, label:"10"}, {value: 1, label:"11"}, {value: 2, label:"12"}, {value: 3, label:"13"}, {value: 4, label: "14"}, 
                {value: 5, label:"15"}, {value: 6, label:"16"}, {value: 7, label: "17"}, {value: 8, label: "18"}, {value: 9, label: "19"}, 
                {value: 10, label:"20"}, {value: 11, label:"21"}, {value: 12, label:"22"}, {value: 13, label:"23"}, {value: 14, label: "00"}, 
                {value: 15, label: "01"}, {value: 16, label: "02"}, {value: 17, label: "03"}];

    const [comment, setComment] = useState("");

    const [canwork, setCanwork] = useState(false);
    const [time, setTime] = useState([0,17]);
    const [start_time, setStarttime] = useState("10");
    const [end_time, setEndtime] = useState("03");

    const [willBreak, setBreak] = useState(false);
    const [awaytime, setAwaytime] = useState(time);
    const [startAway, setStartaway] = useState("10");
    const [endAway, setEndaway] = useState("03");

    const handleInputChange = (e) => {
        const { id, value } = e.target;
        if (id === "Yes") {
            setCanwork(true);
        }
        if (id === "No") {
            setCanwork(false);
        }
        if (id === "breakYes") {
            setBreak(true);
        }
        if (id === "breakNo") {
            setBreak(false);
        }
        if (id === "comment") {
            setComment(value);
        }
    };

    const worksliderInputChange = (e, val) => {
            setTime(val);
            setStarttime(timeMarks[val[0]].label);
            setEndtime(timeMarks[val[1]].label);  
    }

    const breaksliderInputChange = (e, val) => {
        setAwaytime(val);
        setStartaway(timeMarks[val[0]].label);
        setEndaway(timeMarks[val[1]].label);
    }

    const submit = (event) => {
        if (start_time == end_time) {
          setErrorMessage(1);
        } 
        if (startAway == endAway) {
          setErrorMessage(2);
        }
        else {
            if (canwork == false) {     
                const data = {
                    user_uuid       : userUuid,
                    event_uuid      : eventID,
                    can_work        : canwork,      //data for whether user can work or not
                    comment         : comment,      //data for comment
                };
            }
            else if (canwork == true && willBreak == false) {
                const data = {
                    user_uuid       : userUuid,
                    event_uuid      : eventID,
                    can_work        : canwork,      //data for whether user can work or not
                    work_start      : start_time,   //data for start time
                    work_end        : end_time,     //data for end time
                    will_break      : willBreak,    //data for whether user will have to take a break during the shift or not
                    comment         : comment,      //data for comment
                };
            }
            else {
                const data = { 
                    user_uuid       : userUuid,
                    event_uuid      : eventID,
                    can_work        : canwork,      //data for whether user can work or not
                    work_start      : start_time,   //data for start time
                    work_end        : end_time,     //data for end time
                    will_break      : willBreak,    //data for whether user will have to take a break during the shift or not
                    break_start     : startAway,    //data for when break starts
                    break_end       : endAway,      //data for when break ends
                    comment         : comment,      //data for comment
                };

    //ÄNDRA DET HÄR ASAP, VI SKA FASEN INTE GÖRA EN API-CALL TILL PRAO-SIGNUP ;D
    /*
        const signUp = new XMLHttpRequest();
        signUp.open("POST", "/api/v1/work_signup/" + String(eventID));
        signUp.setRequestHeader("Content-Type", "application/json");
        signUp.responseType = "json";
        signUp.send(JSON.stringify(data));

        signUp.onload = function () {
        if (signUp.status === 422) {
            let responseObj = "";
            signUp.response["detail"].forEach((e) => {
                responseObj += e.msg + "\n";
                });

        setErrorSpec(responseObj);
        setErrorMessage(4);
        } 
        else if (signUp.status === 200) {
            setErrorMessage(3);
            navigate("/join_completed");
            } 
        else {
            alert(`Error ${signUp.status}: ${signUp.statusText}`);
            }
        };
        signUp.onerror = function () {
        alert("Request has failed, try again or contact web masters");
        };
    */
    //ÄNDRA DET HÄR ASAP, VI SKA FASEN INTE GÖRA EN API-CALL TILL PRAO-SIGNUP ;D
            }
        }
    }
    //ÄNDRA DESIGNEN, WE GONNA INCLUDE SOME SLIDERS BOII
    return(
        <div className={className}>
            <div className="signupForm">
                <h2>Work signup for event: {eventID} </h2>
                <Box component="form" onSubmit={submit} sx={{ mt: 3}}>
                    <p>Can you work this event?</p>
                    <Grid container spacing={0}>
                        <div required>
                            <input type="radio" id="Yes" name="answer" onChange={(e) => handleInputChange(e)}/>
                            <label htmlFor="Yes"> Yes</label><br/>
                            <input type="radio" id="No" name="answer" onChange={(e) => handleInputChange(e)}/>
                            <label htmlFor="No"> No</label>
                        </div>
                        <Slider
                        className="formFont"
                        id = "timeVal"
                        min={0}
                        max={17}
                        getAriaLabel={() => "Always visible"}
                        marks={timeMarks}
                        step={1}
                        disabled={!canwork}
                        onChange={worksliderInputChange}
                        value={time}
                        />
                    </Grid>
                    <br/>
                    <p>Will you need to leave during the event? {"(e.g to attend a lecture or appointment)"}</p>
                    <Grid>
                        <div required>
                            <input type="radio" id="breakYes" name="breakAnswer" disabled={!canwork} onChange={(e) => handleInputChange(e)}/>
                            <label htmlFor="breakYes"> Yes</label><br/>
                            <input type="radio" id="breakNo" name="breakAnswer" disabled={!canwork} onChange={(e) => handleInputChange(e)}/>
                            <label htmlFor="breakNo"> No</label>
                        </div>
                        <Slider
                        className = "formFont"
                        id = "breaktimeVal"
                        min={time[0]}
                        max={time[1]}
                        getAriaLabel={() => "Always visible"}
                        marks={timeMarks}
                        step={1}
                        disabled={!(willBreak & canwork)}
                        onChange={breaksliderInputChange}
                        value={awaytime}
                        />
                    </Grid>
                    <br/>
                    <Grid item xs={12}>
                        <TextField
                            variant="filled"
                            fullWidth
                            id="comment"
                            label="Comment"
                            placeholder="Comment.."
                            onChange={handleInputChange}
                        />
                    </Grid>
                </Box>
                <br/>
                <div className="submit">
                    <input type="submit" value="save"/>
                </div>
            </div>
        </div>
    );
}

export default StyledSignupForm;