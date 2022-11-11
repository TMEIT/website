import {Link, useLoaderData } from "react-router-dom";

import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';

import styled from "@emotion/styled";

import Centered from "../components/Centered.js";
import TextSummary from "../components/TextSummary.js";

const StyledWebsiteMigrate = styled(WebsiteMigrate)({
    [TextSummary]: {
        maxWidth: "80em",
        margin: "2em",
        display: "flex",
        flexDirection: "column",
    }
});

function WebsiteMigrate({className, adminVersion}) {
    const data = useLoaderData();

    //TODO
    const submit = () => {};
    const handleInputChange = () => {};

    return(
        <Centered className={className}>
            <TextSummary>
                <h2> Existing data from old website: </h2>
                    {adminVersion? (<>
                        <TextField defaultValue={data.uuid} label="UUID" variant="filled" InputProps={{readOnly: true,}} fullWidth />
                        <TextField defaultValue={data.security_token} label="Security Token" variant="filled" InputProps={{readOnly: true,}} fullWidth />
                        <TextField defaultValue={data.time_created} label="Migration Started" variant="filled" InputProps={{readOnly: true,}} fullWidth />
                        <TextField defaultValue={data.email_sent} label="Last Email Sent" variant="filled" InputProps={{readOnly: true,}} fullWidth />
                        <TextField defaultValue={data.old_username} label="Username in Old DB" variant="filled" InputProps={{readOnly: true,}} fullWidth />
                        <TextField defaultValue={data.migrated} label="Migration Completed?" variant="filled" InputProps={{readOnly: true,}} fullWidth />
                        <TextField defaultValue={data.login_email} label="Email on Old Website" variant="filled" InputProps={{readOnly: true,}} fullWidth />
                    </>): null}
                    <TextField defaultValue={data.first_name} label="First Name" variant="filled" InputProps={{readOnly: true,}} fullWidth />
                    <TextField defaultValue={data.nickname} label="Ovvenamn" variant="filled" InputProps={{readOnly: true,}} fullWidth />
                    <TextField defaultValue={data.last_name} label="Last Name" variant="filled" InputProps={{readOnly: true,}} fullWidth />
                    <TextField defaultValue={data.drivers_license} label="Driver's License" variant="filled" InputProps={{readOnly: true,}} fullWidth />
                    <TextField defaultValue={data.stad} label="STAD Date" variant="filled" InputProps={{readOnly: true,}} fullWidth />
                    <TextField defaultValue={data.fest} label="FEST Date" variant="filled" InputProps={{readOnly: true,}} fullWidth />
                    <TextField defaultValue={data.liquor_permit} label="Liqour Permit Date" variant="filled" InputProps={{readOnly: true,}} fullWidth />
                {!adminVersion?(
                    <Box component="form" onSubmit={submit} sx={{ mt: 3 }}>
                        <h2> Set your email, (phone), and password </h2>
                        <TextField
                            variant="filled"
                            fullWidth
                            id="email"
                            label="Login Email"
                            name="email"
                            autoComplete="email"
                            type="email"
                            defaultValue={data.login_email}
                            required
                            onChange={handleInputChange}
                        />
                        <TextField
                            variant="filled"
                            fullWidth
                            id="phone"
                            label="Phone Number"
                            name="phone"
                            autoComplete="tel"
                            defaultValue={data.phone}
                            onChange={handleInputChange}
                        />
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
                        If you no longer want to have an account with TMEIT or be displayed as a TMEIT member, please contact a master or Lex.
                    </Box>
                ): null}
            </TextSummary>
        </Centered>
    );
}
export default StyledWebsiteMigrate
