import styled from "@emotion/styled";

import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";

import Centered from "../components/Centered.js";
import TextSummary from "../components/TextSummary.js";

import {useNavigate, useParams} from 'react-router-dom';
import {useState} from "react";

import { light_background_light } from "../palette.js";

const StyledPasswordReset = styled(PasswordReset)({
    ".main": {
        maxWidth: "40em",
        margin: "10em",
        background: light_background_light,
        borderRadius: "1em",
        padding: "2em",
    },

    "@media (max-width: 950px)": {
        ".main": {
            maxWidth: "20em",
            margin: "5em",
            padding: "1em",
        }
    }
});

function PasswordReset({className}) {
    const navigate = useNavigate();
    const parameters = useParams();
    const reset_token = parameters.reset_token;

    const [email, setEmail] = useState("");
    const [newPass, setNewPass] = useState("");
    const [confirmPass, setConfirmPass] = useState("");

    const [errorMessage, setErrorMessage] = useState(0);

    const submit = (event) => {
        event.preventDefault();

        if (confirmPass != newPass)
            setErrorMessage(2);
        else
        {
            const data = {
                password : newPass
            }

            const address = "/api/v1/reset/" + reset_token + "?email=" + email;

            const xhr = new XMLHttpRequest();
            xhr.open("PUT", address, true);
            xhr.setRequestHeader("Content-Type", "application/json");
            xhr.send(JSON.stringify(data)); 
            xhr.responseType = "json";

            xhr.onload = function () {
            if(xhr.status === 200){
                setErrorMessage(1);
                alert("Password has been reset!");
                navigate("/");
            }
            else{
                alert(`error: ${xhr.status}: ${xhr.statusText}`);
            }
            };
            xhr.onerror = function (){
            console.log("Request failed");
            }
        }
    };

    const handleInputChange = (e) => {
        const { id, value } = e.target;
        if (id === "email") {
        setEmail(value);
        }
        if (id === "newPass") {
        setNewPass(value);
        }
        if (id === "confirmPass") {
        setConfirmPass(value);
        }
    };
    return(
        <Centered className={className}>
            <div className="main">
                <h1>Password Reset</h1>
                <Box component="form" onSubmit={submit} sx={{ mt: 3 }}>
                    <Grid container spacing={2} direction="column" alignItems="center" justifyContent="center">
                    <Grid item xs={12} sm={6} mb={2}>
                            <TextField
                                variant="filled"
                                fullWidth
                                id="email"
                                label="Email"
                                name="email"
                                required
                                onChange={handleInputChange}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6} mb={2}>
                            <TextField
                                type="password"
                                variant="filled"
                                fullWidth
                                id="newPass"
                                label="New Password"
                                name="newpassword"
                                required
                                onChange={handleInputChange}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6} mb={2}>
                            <TextField
                                type="password"
                                variant="filled"
                                fullWidth
                                id="confirmPass"
                                label="Confirm New Password"
                                name="confirmnewpassword"
                                required
                                onChange={handleInputChange}
                            />
                        </Grid>
                        <Grid mb={2}>
                            <input type="submit" value="Submit"></input>
                        </Grid>
                        <Grid>
                        {(() => {
                                switch (errorMessage) {
                                    case 0:
                                        return <></>;
                                    case 1:
                                        return <>Password reset</>;
                                    case 2:
                                        return <>Passwords do not match!</>;
                                }
                            })()}
                        </Grid>
                    </Grid>
                </Box>
            </div>
        </Centered>
    );
}
export default StyledPasswordReset