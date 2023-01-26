import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "@emotion/styled";
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Slider from '@mui/material/Slider';

const StyledSignupForm = styled(SignupForm)({})

function SignupForm({className, eventID})
{
    const [canwork, setCanwork] = useState(0);
    const [start_time, setStartTime] = useState(0);
    const [end_time, setEndTime] = useState(0);
    //SKAPA RÄTT FUNKTIONER
    const handleInputChange = (e) => {
        const { id, value } = e.target;
        if (id === "canWork") {
            setCanwork(value);
        }
        if (id === "startTime") {
            setStartTime(value);
        }
        if (id === "endTime") {
            setEndTime(value);
        }
      };

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
    //ÄNDRA DET HÄR ASAP, VI SKA FASEN INTE GÖRA EN API-CALL TILL PRAO-SIGNUP ;D
        }
    }
    //ÄNDRA DESIGNEN, WE GONNA INCLUDE SOME SLIDERS BOII
    return (
        <div className={className}>
          <h2>PRAO Signup</h2>
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
                <input type="submit" value="Register" />
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
    //ÄNDRA DESIGNEN, WE GONNA INCLUDE SOME SLIDERS BOII
}

export default StyledSignupForm;