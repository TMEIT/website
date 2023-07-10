import { useState } from "react";
import {useEffect} from "react";
import styled from "@emotion/styled";
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import { kisel_blue_dark, primary_lighter } from "../palette";
import { getApiFetcher } from "../api.js";
import tmeit_logo_nogojan_mono from "../logos/LogoTMEIT_withoutGojan_monochrome.svg";

const StyledEventForm = styled(EventForm)({
    ".eventForm": {
        padding: "1em",
        background: kisel_blue_dark,
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

function EventForm({className})
{

    const [userData, setMeData] = useState(null);
 
    const loadMeData = async () => {setMeData(await getApiFetcher().get("/me").json())} // Load user information when dropdown is opened
    useEffect(() => { loadMeData() }, []); // Load user information when component is mounted, only once

    const [title, setTitle] = useState("");
    const [workteam, setWorkteam] = useState("");
    const [date, setDate] = useState("");
    const [start, setStart] = useState("");
    const [end, setEnd] = useState("");
    const [signupLatest, setSUL] = useState("");
    const [food, setFood] = useState("");
    const [food_price, setFoodPrice] = useState("");
    const [location, setLocation] = useState("");
    const [description, setDescription] = useState("");

    const handleInputChange = (e) => {
        const { id, value } = e.target;

        if (id === "title") {setTitle(value);}
        
        if (id === "workteam") {setWorkteam(value);}

        if (id === "date") {setDate(value);}

        if (id === "start") {setStart(value);}

        if (id === "end") {setEnd(value);}

        if (id === "signupLatest") {setSUL(value);}

        if (id === "food") {setFood(value);}

        if (id === "food_price") {setFoodPrice(value);}

        if (id === "location") {setLocation(value);}

        if (id === "description") {setComment(value);}
    };

    const submit = (event) => {
        if (canwork && (start_time === end_time)) {
          setUserMessage(1);
        } 
        if (willBreak && (startAway === endAway)) {
          setUserMessage(2);
        }
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
            };
            setUserMessage(3);
            console.log(data);
    //ÄNDRA DET HÄR ASAP, VI SKA FASEN INTE GÖRA EN API-CALL TILL PRAO-SIGNUP ;D
    /*
        const signUp = new XMLHttpRequest();
        signUp.open("POST", "/api/v1/events");
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
            <div className="eventForm">
                <Box component="form" onSubmit={(e) => {e.preventDefault(); submit(e);}} sx={{ mt: 3}}>
                    <Grid>
                        <img id="banner" src={tmeit_logo_nogojan_mono}/>
                        <Grid item xs={12}>
                            <TextField variant="filled" fullWidth id="title" label="Event title" placeholder="Friday Pub" onChange={handleInputChange}/>
                        </Grid>
                        <Grid item xs={12}>
                            <TextField variant="filled" fullWidth id="workteam" label="Workteam hosting the event" placeholder="α" onChange={handleInputChange}/>
                        </Grid>
                        <Grid item xs={12}>
                            <TextField variant="filled" fullWidth id="date" label="Event takes place on" placeholder="YYYY-MM-DD" onChange={handleInputChange}/>
                        </Grid>
                        <Grid item xs={12}>
                            <TextField variant="filled" fullWidth id="start" label="Event starts at" placeholder="17:00" onChange={handleInputChange}/>
                        </Grid>
                        <Grid item xs={12}>
                            <TextField variant="filled" fullWidth id="end" label="Event ends at" placeholder="03:00" onChange={handleInputChange}/>
                        </Grid>
                        <Grid item xs={12}>
                            <TextField variant="filled" fullWidth id="signupLatest" label="Sign up at the latest" placeholder="YYYY-MM-DD" onChange={handleInputChange}/>
                        </Grid>
                        <Grid item xs={12}>
                            <TextField variant="filled" fullWidth id="food" label="Food" placeholder="Tacos" onChange={handleInputChange}/>
                        </Grid>
                        <Grid item xs={12}>
                            <TextField variant="filled" fullWidth id="food_price" label="Price for food" placeholder="20kr" onChange={handleInputChange}/>
                        </Grid>
                        <Grid item xs={12}>
                            <TextField variant="filled" fullWidth id="location" label="Location" placeholder="Kistan 2.0" onChange={handleInputChange}/>
                        </Grid>
                        <Grid item xs={12}>
                            <TextField variant="filled" fullWidth id="description" label="Description of the event" placeholder="Description.." onChange={handleInputChange}/>
                        </Grid>
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

export default StyledEventForm;