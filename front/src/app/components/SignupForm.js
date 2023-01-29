import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "@emotion/styled";
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Slider from '@mui/material/Slider';
import { kisel_blue_dark } from "../palette";

const StyledSignupForm = styled(SignupForm)({})

function SignupForm({className, eventID = "Friday pub"})
{
    const timeMarks = [{value: 0, label:"10"}, {value: 1, label:"11"}, {value: 2, label:"12"}, {value: 3, label:"13"}, {value: 4, label: "14"}, 
                {value: 5, label:"15"}, {value: 6, label:"16"}, {value: 7, label: "17"}, {value: 8, label: "18"}, {value: 9, label: "19"}, 
                {value: 10, label:"20"}, {value: 11, label:"21"}, {value: 12, label:"22"}, {value: 13, label:"23"}, {value: 14, label: "00"}, 
                {value: 15, label: "01"}, {value: 16, label: "02"}, {value: 17, label: "03"}];

    const [canwork, setCanwork] = useState(false);
    const [time, setTime] = useState([0,17]);
    const [start_time, setStarttime] = useState("10");
    const [end_time, setEndtime] = useState("03");

    const [willBreak, setBreak] = useState(false);
    const [awaytime, setAwaytime] = useState(time);
    const [startAway, setStartaway] = useState("13");
    const [endAway, setEndaway] = useState("15");

    //SKAPA RÄTT FUNKTIONER
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
    };

    const worksliderInputChange = (e, val) => {
            setTime(val);
    }

    const breaksliderInputChange = (e, val) => {
        setAwaytime(val);
    }

    //ÄNDRA DET HÄR ASAP, VI SKA INTE SKICKA WEIRD DATA : D
    const submit = (event) => {
        if (start_time == end_time) {
          setErrorMessage(1);
        } 
        else {
          const data = { //behövs mer data?
            Name        : Name, //använd den inloggade personens namn
            canwork     : canwork,
            start_time  : start_time,
            end_time    : end_time,
          };
    //ÄNDRA DET HÄR ASAP, VI SKA INTE SKICKA WEIRD DATA : D

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
    //ÄNDRA DESIGNEN, WE GONNA INCLUDE SOME SLIDERS BOII
    return(
        <div className={className}>
            <h2>Work signup for event: {eventID} </h2>
            <Box component="form" onSubmit={submit} sx={{ mt: 3}}>
                <p>Can you work this event?</p>
                <Grid container spacing={0}>
                    <div>
                        <input type="radio" id="Yes" name="answer" onChange={(e) => handleInputChange(e)}/>
                        <label htmlFor="Yes"> Yes</label><br/>
                        <input type="radio" id="No" name="answer" onChange={(e) => handleInputChange(e)}/>
                        <label htmlFor="No"> No</label>
                    </div>
                    <Slider
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
                <p>Will you have to take a break to, for example, go to a lecture?</p>
                <Grid>
                    <div>
                        <input type="radio" id="breakYes" name="breakAnswer" onChange={(e) => handleInputChange(e)}/>
                        <label htmlFor="breakYes"> Yes</label><br/>
                        <input type="radio" id="breakNo" name="breakAnswer" onChange={(e) => handleInputChange(e)}/>
                        <label htmlFor="breakNo"> No</label>
                    </div>
                    <Slider
                    id = "breaktimeVal"
                    min={3}
                    max={5}
                    getAriaLabel={() => "Always visible"}
                    marks={timeMarks}
                    step={1}
                    disabled={!willBreak}
                    onChange={breaksliderInputChange}
                    value={awaytime}
                    />
                </Grid>
            </Box>
        </div>
    );
    /*
    return (
        <div className={className}>
          <h2>Work signup for event:</h2>
          <Box component="form" onSubmit={submit} sx={{ mt: 3 }}>
              <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                      <TextField
                          variant="filled"
                          fullWidth
                          id="firstName"
                          label="First Name"
                          name="firstName"
                          autoComplete="given-name"
                          placeholder="Prao"
                          required
                          onChange={handleInputChange}
                      />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                      <TextField
                          variant="filled"
                          fullWidth
                          id="lastName"
                          label="Last Name"
                          name="lastName"
                          autoComplete="family-name"
                          placeholder="Praosson"
                          required
                          onChange={handleInputChange}
                      />
                  </Grid>
                  <Grid item xs={12}>
                      <TextField
                          variant="filled"
                          fullWidth
                          id="email"
                          label="Email Address"
                          name="email"
                          autoComplete="email"
                          type="email"
                          placeholder="prao@kth.se"
                          required
                          onChange={handleInputChange}
                      />
                  </Grid>
                  <Grid item xs={12}>
                      <TextField
                          variant="filled"
                          fullWidth
                          id="phone"
                          label="Phone Number"
                          name="phone"
                          autoComplete="tel"
                          placeholder="+467077267726"
                          onChange={handleInputChange}
                      />
                  </Grid>
                  <Grid item xs={12}>
                      <TextField
                          variant="filled"
                          fullWidth
                          id="password"
                          label="Password"
                          name="password"
                          autoComplete="new-password"
                          type="password"
                          required
                          onChange={handleInputChange}
                      />
                  </Grid>
                  <Grid item xs={12}>
                      <TextField
                          variant="filled"
                          fullWidth
                          id="confirmPassword"
                          label="Confirm Password"
                          name="confirmPassword"
                          autoComplete="new-password"
                          type="password"
                          required
                          onChange={handleInputChange}
                      />
                  </Grid>
              </Grid>
              <div>
                <label htmlFor="GDPR">
                  I give my consent for TMEIT to store and use my personal data.
                </label>
                <input
                  type="checkbox"
                  id="GDPR"
                  onChange={(e) => handleInputChange(e)}
                />
              </div>
              <div className="submit">
                <input type="submit" value="Save" />
              </div>
          </Box>
        <div className="errorMessage">
          {(() => {
            switch (errorMessage) {
              case 0:
                return <></>;
              case 1:
                return (
                  <>
                      You must give TMEIT your GDPR consent for us to register an account for you at TMEIT.
                      Please contact one of the Masters if you have any questions or concerns about your personal data.
                  </>
                );
  
              case 2:
                return <>Password does not match or is empty</>;
  
              case 3:
                return <>Message has been sent and received</>;
  
              case 4:
                return <p>{errorSpec}</p>;
            }
          })()}
        </div>
      </div>
    );
    */
    //ÄNDRA DESIGNEN, WE GONNA INCLUDE SOME SLIDERS BOII
}

export default StyledSignupForm;