import {useState} from "react";
import {Link, useLoaderData } from "react-router-dom";

import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';

import styled from "@emotion/styled";

import Centered from "../components/Centered.js";
import TextSummary from "../components/TextSummary.js";
import { getApiFetcher } from "../api.js";


function WebsiteMigrateForm({data}) {
    const [submitMigrateResult, setSubmitMigrateResult] = useState("")

    const handleSubmit = async (event) => {
        event.preventDefault();

        let submitFailed = false;

        let searchParams = new URLSearchParams(document.location.search)
        const security_token = searchParams.get('token');

        const formData = new FormData(event.currentTarget);
        if(formData.get("password") !== formData.get("confirmPassword")) {
            setSubmitMigrateResult("Passwords don't match!");
            return;
        }
        const toSubmit = {
            uuid: data.uuid,
            security_token: security_token,
            login_email: formData.get("login_email"),
            phone: formData.get("phone"),
            password: formData.get("password"),
            gdpr_consent: (formData.get("gdpr_consent")? true: false),
        }

        try {
            const new_member = await getApiFetcher().url(`/migrations/members/${data.uuid}/migrate`).post(toSubmit).json();
            setSubmitMigrateResult("Account migration complete! You can now log in.")
        } catch (e) {
            submitFailed = true;
            console.error(e)
            setSubmitMigrateResult(`${e.status}: ${e.text}`);
        }
    }

    if(data.migrated) {
        return (<b>You have already migrated your account! Go ahead and log in! Contaxt Lex if you are having issues.</b>)
    } else {
        return (
            <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
                <h2> Set your login email and password </h2>
                <TextField
                    variant="filled"
                    fullWidth
                    id="login_email"
                    label="Login Email"
                    name="login_email"
                    autoComplete="email"
                    type="email"
                    defaultValue={data.login_email}
                    required
                />
                <TextField
                    variant="filled"
                    fullWidth
                    id="phone"
                    label="Phone Number (optional)"
                    name="phone"
                    autoComplete="tel"
                    defaultValue={data.phone}
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
                />
                <h3>How TMEIT uses your personal data</h3>
                <p>
                    As a club organizing social activities for its members, TMEIT stores data about you to help plan these activities and facilitate social interaction with other members.
                    Some of the data we store includes your name, your email address, your phone number, when your account was created,
                    special events that happen during your membership in TMEIT, Workteams you participate in, events you attended, photos uploaded of you,
                    and any other data that you or other members upload to the site.
                </p>
                <h3> Who can see your data </h3>
                <p>
                    As a member of TMEIT, your name, some photos of you, your rank in TMEIT, your current Workteam,
                    and whether you have attended/are attending an event are displayed publicly on the website.
                    Please contact one of the Masters if this is an issue.
                    All other personal data can only be seen by other members of TMEIT.
                </p>
                <h3> Website logs </h3>
                <p>
                    To combat bots and spammers, we log page accesses and their associated IP addresses and store those logs for three months.
                    Only administrators can see these logs and IP addresses.
                </p>
                <h3> Data security, data controllers, and data processors </h3>
                <p>
                    All personal data is stored securely in the EU in Finnish and Dutch datacenters with our cloud providers Hetzner and Backblaze.
                    If you have any questions or concerns about how we use your personal data, please contact one of the Masters.
                </p>
                <FormControlLabel
                    control={<Checkbox color="primary" />}
                    name="gdpr_consent"
                    label="I give my consent for TMEIT to store and use my personal data according to the policy above."
                />
                <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    sx={{ mt: 3, mb: 2 }}
                    >
                    Complete Account Migration
                </Button>
                <p>{submitMigrateResult}</p>
                <p><b>If you no longer want to have an account with TMEIT or be displayed as a TMEIT member, please contact a master or Lex.</b></p>
            </Box>
        )
    }


}

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

    return(
        <Centered className={className}>
            <TextSummary>
                {adminVersion? (<>
                    <h2> Admin debug info: </h2>
                    <TextField defaultValue={data.uuid} label="UUID" variant="filled" InputProps={{readOnly: true,}} fullWidth />
                    <TextField defaultValue={data.security_token} label="Security Token" variant="filled" InputProps={{readOnly: true,}} fullWidth />
                    <TextField defaultValue={data.time_created} label="Migration Started" variant="filled" InputProps={{readOnly: true,}} fullWidth />
                    <TextField defaultValue={data.email_sent} label="Last Email Sent" variant="filled" InputProps={{readOnly: true,}} fullWidth />
                    <TextField defaultValue={data.old_username} label="Username in Old DB" variant="filled" InputProps={{readOnly: true,}} fullWidth />
                    <TextField defaultValue={data.migrated} label="Migration Completed?" variant="filled" InputProps={{readOnly: true,}} fullWidth />
                    <TextField defaultValue={data.login_email} label="Email on Old Website" variant="filled" InputProps={{readOnly: true,}} fullWidth />
                </>): null}
                <h2> Existing data being imported from old website: </h2>
                <TextField defaultValue={data.first_name} label="First Name" variant="filled" InputProps={{readOnly: true,}} fullWidth />
                <TextField defaultValue={data.nickname} label="Ovvenamn" variant="filled" InputProps={{readOnly: true,}} fullWidth />
                <TextField defaultValue={data.last_name} label="Last Name" variant="filled" InputProps={{readOnly: true,}} fullWidth />
                <TextField defaultValue={data.drivers_license} label="Driver's License" variant="filled" InputProps={{readOnly: true,}} fullWidth />
                <TextField defaultValue={data.stad} label="STAD Date" variant="filled" InputProps={{readOnly: true,}} fullWidth />
                <TextField defaultValue={data.fest} label="FEST Date" variant="filled" InputProps={{readOnly: true,}} fullWidth />
                <TextField defaultValue={data.liquor_permit} label="Liqour Permit Date" variant="filled" InputProps={{readOnly: true,}} fullWidth />
                {!adminVersion? <WebsiteMigrateForm data={data} />: null}
            </TextSummary>
        </Centered>
    );
}
export default StyledWebsiteMigrate
