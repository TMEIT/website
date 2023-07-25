import { useState, useEffect} from "react";
import {Link} from "react-router-dom";
import styled from "@emotion/styled";
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import { kisel_blue_dark, kisel_blue, primary_lighter, kisel_blue_light, me_and_in_teal } from "../palette";
import { getApiFetcher } from "../api.js";
import tmeit_logo_nogojan_mono from "../logos/LogoTMEIT_withoutGojan_monochrome.svg";
import Button from "@mui/material/Button";


const StyledEventForm = styled(EventForm)({
    ".eventForm": {
        padding: "1em",
        background: me_and_in_teal,
        borderRadius: "1em",
        marginBottom: "1em",
    },

    ".submit": {
        display : "flex",
        justifyContent: "flex-end"
    },

    "#banner": {
        width: "100%",
        height: "20%"
    },

    /*
    "@media (max-width: 600px)": {
        ".MuiSlider-markLabel": {
            fontSize: "0.6rem",
        }
    },
    */
})

function EventForm({className, edit, eventuuid = ""})
{
    /*const [eventData, setEventData] = useState(null);

    const loadEventData = async() => {setEventData(await getApiFetcher().get("/event/" + {eventuuid}).json())}
    useEffect(() => {loadEventData() }, []);*/

    const eventData = {
        title: "Friday pub",
        date: "2023-02-30",
        start: "17:00",
        end: "03:00",
        signupLatest: "2023-02-29",
        location: "Kistan 2.0",
        description: "Welcome to our pub hosten on a 30:th of February!",
        visibility : "member",
    };

    const [userData, setMeData] = useState(null);
 
    const loadMeData = async () => {setMeData(await getApiFetcher().get("/me").json())} // Load user information when dropdown is opened
    useEffect(() => { loadMeData() }, []); // Load user information when component is mounted, only once

    const [userMessage, setUserMessage] = useState(0);

    const [title, setTitle] = useState(edit? eventData.title : "");
    const [date, setDate] = useState(edit? eventData.date : "");
    const [start, setStart] = useState(edit? eventData.start : "");
    const [end, setEnd] = useState(edit? eventData.end : "");
    const [signupLatest, setSUL] = useState(edit? eventData.signupLatest : "");
    const [location, setLocation] = useState(edit? eventData.location : "");
    const [description, setDescription] = useState(edit? eventData.description : "");
    const [visibility, setVisibility] = useState(edit? eventData.visibility : "");
    

    const handleInputChange = (e) => {
        const { id, value } = e.target;

        if (id === "title") {setTitle(value);}

        if (id === "date") {setDate(value);}

        if (id === "start") {setStart(value);}

        if (id === "end") {setEnd(value);}

        if (id === "signupLatest") {setSUL(value);}

        if (id === "location") {setLocation(value);}

        if (id === "description") {setDescription(value);}

        if (id === "visibilityPublic") {setVisibility("public");}

        if (id === "visibilityInternal") {setVisibility("internal");}

        if (id === "visibilityElected") {setVisibility("members");}

    };

    const submit = (event) => {
       if(1 == 0) {}
        else {
            const data = { 
                event_owner         : userData.short_uuid,  //assign the event-creator as the owner of the event
                event_title         : title,                //data for whether user can work or not
                event_date          : date,                 //data for end time
                event_start_time    : start,                //data for whether user will have to take a break during the shift or not
                event_end_time      : end,                  //data for when break starts
                signu_up_end_time   : signupLatest,         //data for when the
                location            : location,             //
                description         : description,          //
                visibility          : visibility,
            };

            const create = new XMLHttpRequest();
            create.open("POST", "/api/v1/events/create");
            create.setRequestHeader("Content-Type", "application/json");
            create.responseType = "json";
            create.send(JSON.stringify(data));

            create.onload = function () {
            if (signUp.status === 422) {
                let responseObj = "";
                signUp.response["detail"].forEach((e) => {
                    responseObj += e.msg + "\n";
                    });

            setErrorSpec(responseObj);
            setUserMessage(4);
            } 
            else if (create.status === 200) {
                setUserMessage(3);
            }
                create.onerror = function () {
                alert("Request has failed, try again or contact web masters");
            };
        }
        event.preventDefault();
        }
    };

    const save = (event) => {
        /* if(1 == 0) {}
        else {
            const data = { 
                event_owner     : userData.short_uuid,  //assign the event-creator as the owner of the event
                event_title     : title,                //data for whether user can work or not
                event_workteam  : workteam,             //data for start time
                event_date      : date,                 //data for end time
                event_start     : start,                //data for whether user will have to take a break during the shift or not
                event_end       : end,                  //data for when break starts
                event_SUL       : signupLatest,         //data for when break ends
                event_food      : food,                 //data for comment
                event_foodprice : food_price,           //
                event_location  : location,             //
                event_descript  : description,          //
            };*/
            setUserMessage(3);
    /*
        const edit = new XMLHttpRequest();
        edit.open("PATCH", "/api/v1/events/" + {eventuuid});
        edit.setRequestHeader("Content-Type", "application/json");
        edit.responseType = "json";
        edit.send(JSON.stringify(data));

        edit.onload = function () {
        if (edit.status === 422) {
            let responseObj = "";
            edit.response["detail"].forEach((e) => {
                responseObj += e.msg + "\n";
                });

        setErrorSpec(responseObj);
        setUserMessage(4);
        } 
        else if (edit.status === 200) {
            setUserMessage(3);
        }
        edit.onerror = function () {
        alert("Request has failed, try again or contact web masters");
        };
    */
        //}
        event.preventDefault();
    };

    return(
        <div className={className}>
            <div className="eventForm">
                <Box component="form" onSubmit={(e) => {e.preventDefault(); (edit? save(e) : submit(e));}} sx={{ mt: 3}}>
                    <Grid>
                        <img id="banner" src={tmeit_logo_nogojan_mono}/>
                        <Grid item xs={12} style={{marginTop: "1em"}}>
                            <TextField variant="filled" fullWidth id="title" label="Event title" placeholder="Friday Pub" onChange={handleInputChange}/>
                        </Grid>
                        <Grid item xs={12} style={{marginTop: "1em"}}>
                            <TextField variant="filled" fullWidth id="date" label="Event takes place on" placeholder="YYYY-MM-DD" onChange={handleInputChange}/>
                        </Grid>
                        <Grid item xs={12} style={{marginTop: "1em"}}>
                            <TextField variant="filled" fullWidth id="start" label="Event starts at" placeholder="17:00:00" onChange={handleInputChange}/>
                        </Grid>
                        <Grid item xs={12} style={{marginTop: "1em"}}>
                            <TextField variant="filled" fullWidth id="end" label="Event ends at" placeholder="03:00:00" onChange={handleInputChange}/>
                        </Grid>
                        <Grid item xs={12} style={{marginTop: "1em"}}>
                            <TextField variant="filled" fullWidth id="signupLatest" label="Sign up at the latest" placeholder="YYYY-MM-DD HH:MM:SS" onChange={handleInputChange}/>
                        </Grid>
                        <Grid item xs={12} style={{marginTop: "1em"}}>
                            <TextField variant="filled" fullWidth id="location" label="Location" placeholder="Kistan 2.0" onChange={handleInputChange}/>
                        </Grid>
                        <Grid item xs={12} style={{marginTop: "1em", marginBottom: "1em"}}>
                            <TextField variant="filled" fullWidth id="description" label="Description of the event" placeholder="Description.." onChange={handleInputChange}/>
                        </Grid>
                        <div required>
                            <Box my={1}>
                                <h2>Visibility</h2>
                            </Box>
                            <Box>
                                <input type="radio" id="visibilityPublic" name="visibility" onChange={(e) => handleInputChange(e)}/>
                                <label htmlFor="visibilityPublic">Public</label>
                            </Box>
                            <Box>
                                <input type="radio" id="visibilityInternal" name="visibility" onChange={(e) => handleInputChange(e)}/>
                                <label htmlFor="visibilityInternal">Internal for TMEIT</label>
                            </Box>
                            <Box>
                                <input type="radio" id="visibilityElected" name="visibility" onChange={(e) => handleInputChange(e)}/>
                                <label htmlFor="visibilityElected">Internal for TMEIT - excluding Prao</label>
                            </Box>
                        </div>
                        <br></br>
                        <Button variant="contained"><Link to="/events">Cancel</Link></Button>
                        <Button variant="contained" type="submit">Save</Button>
                    </Grid>
                </Box>
                <div className="errorMessage">
                    {(() => {
                    switch (userMessage) {
                        case 0:
                        return <></>;

                        case 1:
                        return <></>;

                        case 2:
                        return <></>;

                        case 3:
                        return <>Sorry, this event-form is only a preview of the upcoming Events-functionality!</>;

                        case 4:
                        return <p>{errorSpec}</p>;
                    }
                    })()}
                </div>
            </div>
        </div>
    );
}

export default StyledEventForm;