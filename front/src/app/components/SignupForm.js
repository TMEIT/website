import { useState } from "react";
import {useEffect} from "react";
import { useNavigate } from "react-router-dom";
import styled from "@emotion/styled";
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Slider from '@mui/material/Slider';
import { kisel_blue_dark, primary_lighter } from "../palette";
import { getApiFetcher } from "../api.js";

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
    },

    "@media (max-width: 600px)": {
        ".MuiSlider-markLabel": {
            fontSize: "0.6rem",
        }
    },
})

function SignupForm({className, eventID})
{

    const [userData, setMeData] = useState(null);
 
    const loadMeData = async () => {setMeData(await getApiFetcher().get("/me").json())} // Load user information when dropdown is opened
    useEffect(() => { loadMeData() }, []); // Load user information when component is mounted, only once

    const timeMarks = [{value: 0, label:"10"}, {value: 1, label:"11"}, {value: 2, label:"12"}, {value: 3, label:"13"}, {value: 4, label: "14"}, 
                {value: 5, label:"15"}, {value: 6, label:"16"}, {value: 7, label: "17"}, {value: 8, label: "18"}, {value: 9, label: "19"}, 
                {value: 10, label:"20"}, {value: 11, label:"21"}, {value: 12, label:"22"}, {value: 13, label:"23"}, {value: 14, label: "00"}, 
                {value: 15, label: "01"}, {value: 16, label: "02"}, {value: 17, label: "03"}];

    const [userMessage, setUserMessage] = useState(0);

    const [canwork, setCanwork] = useState(false);
    const [time, setTime] = useState([0,17]);
    const [start_time, setStarttime] = useState("10");
    const [end_time, setEndtime] = useState("03");

    const [willBreak, setBreak] = useState(false);
    const [awaytime, setAwaytime] = useState(time);
    const [startAway, setStartaway] = useState("10");
    const [endAway, setEndaway] = useState("03");

    const [comment, setComment] = useState("");

    const handleInputChange = (e) => {
        const { id, value } = e.target;
        if (id === "workYes") {
            setCanwork(true);
        }
        if (id === "workNo") {
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
        if (time[1] - time[0] < 1)
        {
            setTime([0, 17]);
            setStarttime("10");
            setEndtime("03"); 
        }
        else
        {
            setTime(val);
            setStarttime(timeMarks[val[0]].label);
            setEndtime(timeMarks[val[1]].label); 
        }
    }

    const breaksliderInputChange = (e, val) => {
        if (awaytime[1] - awaytime[0] <= 1)
        {
            setAwaytime(time);
            setStartaway(timeMarks[time[0]].label);
            setEndaway(timeMarks[time[1]].label);
        }
        else
        {
            setAwaytime(val);
            setStartaway(timeMarks[val[0]].label);
            setEndaway(timeMarks[val[1]].label);
        }
    }

    const submit = (event) => {
        if (canwork && (start_time === end_time)) {
          setUserMessage(1);
        } 
        if (willBreak && (startAway === endAway)) {
          setUserMessage(2);
        }
        else {
            const data = { 
                user_uuid       : userData.short_uuid,
                event_uuid      : eventID,
                can_work        : canwork,      //data for whether user can work or not
                work_start      : start_time,   //data for start time
                work_end        : end_time,     //data for end time
                will_break      : willBreak,    //data for whether user will have to take a break during the shift or not
                break_start     : startAway,    //data for when break starts
                break_end       : endAway,      //data for when break ends
                comment         : comment,      //data for comment
            };
            setUserMessage(3);
            console.log(data);
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
        event.preventDefault();
    };
    //ÄNDRA DESIGNEN, WE GONNA INCLUDE SOME SLIDERS BOII
    return(
        <div className={className}>
            <div className="signupForm">
                <h2>Work signup for event: {eventID} </h2>
                <Box component="form" onSubmit={(e) => {e.preventDefault(); submit(e);}} sx={{ mt: 3}}>
                    <Grid>
                        <p>Can you work this event?</p>
                        <Grid container spacing={0}>
                            <div required>
                                <input type="radio" id="workYes" name="answer" onChange={(e) => handleInputChange(e)}/>
                                <label htmlFor="workYes"> Yes</label><br/>
                                <input type="radio" id="workNo" name="answer" onChange={(e) => handleInputChange(e)}/>
                                <label htmlFor="workNo"> No</label>
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
                            className="formFont"
                            id = "breaktimeVal"
                            min={time[0]}
                            max={time[1]}
                            getAriaLabel={() => "Always visible"}
                            marks={timeMarks}
                            step={1}
                            disabled={(!(willBreak & canwork)) | (time[1] - time[0] <= 1)}
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
                        <br/>
                        <div className="submit">
                            <input type="submit" value="save"/>
                        </div>
                    </Grid>
                </Box>
                <div className="errorMessage">
                    {(() => {
                    switch (userMessage) {
                        case 0:
                        return <></>;

                        case 1:
                        return <>You cannot start and end your working shift at the same time</>;

                        case 2:
                        return <>You cannot leave from and come back to your working shift at the same time</>;

                        case 3:
                        return <>Saved!</>;

                        case 4:
                        return <p>{errorSpec}</p>;
                    }
                    })()}
                </div>
            </div>
        </div>
    );
}

export default StyledSignupForm;