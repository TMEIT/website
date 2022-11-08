import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';

function JoinForm() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [GDPR, setGDPR] = useState(false);

  const [errorMessage, setErrorMessage] = useState(0);
  const [errorSpec, setErrorSpec] = useState("");
  let navigate = useNavigate();

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    if (id === "firstName") {
      setFirstName(value);
    }
    if (id === "lastName") {
      setLastName(value);
    }
    if (id === "email") {
      setEmail(value);
    }
    if (id === "phone") {
      setPhone(value);
    }
    if (id === "password") {
      setPassword(value);
    }
    if (id === "confirmPassword") {
      setConfirmPassword(value);
    }
    if (id === "GDPR") {
      setGDPR(value);
    }
  };

  const submit = (event) => {
    if (password != confirmPassword || password == "") {
      setErrorMessage(2);
    } else if (!GDPR) {
      setErrorMessage(1);
    } else {
      const data = {
        login_email: email,
        first_name: firstName,
        last_name: lastName,
        phone: phone,
        password: password,
      };

      const signUp = new XMLHttpRequest();
      signUp.open("POST", "/api/v1/sign_up/sign_up");
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
        } else if (signUp.status === 200) {
          setErrorMessage(3);
          navigate("/join_completed");
        } else {
          alert(`Error ${signUp.status}: ${signUp.statusText}`);
        }
      };
      signUp.onerror = function () {
        alert("Request has failed, try again or contact web masters");
      };
    }
    event.preventDefault();
  };

  return (
    <>
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
                I give my informed consent for TMEIT to store and use my personal data.
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
    </>
  );
}

export default JoinForm;
