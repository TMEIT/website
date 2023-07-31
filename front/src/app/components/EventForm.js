import { useState} from "react";
import {useNavigate} from 'react-router-dom';
import {Link} from "react-router-dom";
import styled from "@emotion/styled";
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import { kisel_blue_dark, kisel_blue, primary_lighter, kisel_blue_light, me_and_in_teal } from "../palette";
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

function EventForm({className, edit, event = null})
{
    let navigate = useNavigate();

    const [userMessage, setUserMessage] = useState(0);

    const [title, setTitle] = useState(edit? event.title : "");
    const [startDate, setStartDate] = useState("");
    const [startTime, setStartTime] = useState("");
    const [endDate, setEndDate] = useState("");
    const [endTime, setEndTime] = useState("");
    const [location, setLocation] = useState(edit? event.location : "");
    const [description, setDescription] = useState(edit? event.description : "");
    const [visibility, setVisibility] = useState(edit? event.visibility : "");
    

    const handleInputChange = (e) => {
        const { id, value } = e.target;

        if (id === "title") {setTitle(value);}

        if (id === "start_date") {setStartDate(value);}

        if (id === "start_time") {setStartTime(value);}

        if (id === "end_date") {setEndDate(value);}

        if (id === "end_time") {setEndTime(value);}

        if (id === "location") {setLocation(value);}

        if (id === "description") {setDescription(value);}

        if (id === "visibilityPublic") {setVisibility("public");}

        if (id === "visibilityInternal") {setVisibility("internal");}

        if (id === "visibilityElected") {setVisibility("elected");}

    };

    const submit = (event) => {

        var tokenText = cookie();

        const start = startDate + "T" + startTime + "+00:00";
        const end = endDate + "T" + endTime + "+00:00";

        const data = { 
            title               : title,                //data for whether user can work or not
            event_start         : start,                //data for whether user will have to take a break during the shift or not
            event_end           : end,                  //data for when break starts
            location            : location,             //
            description         : description,          //
            visibility          : visibility,
        };

        const create = new XMLHttpRequest();
        create.open("POST", "/api/v1/events/create");
        create.setRequestHeader("Authorization", tokenText);
        create.setRequestHeader("Content-Type", "application/json");
        create.responseType = "json";
        create.send(JSON.stringify(data));

        create.onload = function () {
        if (create.status === 422) {
            setUserMessage(1);
        } 
        else if (create.status == 403) {
            setUserMessage(2);
        }
        else if (create.status === 200) {
            setUserMessage(3);
            navigate("/events");
        }
            create.onerror = function () {
            alert("Request has failed, try again or contact web masters");
        };
        }
        event.preventDefault();
    };

    function cookie(){
        var name = "access_token";
        var cookieArr = document.cookie.split(";");
    
        //Loop through array until token is found
        for (var i = 0; i < cookieArr.length; i++) {
          var cookiePair = cookieArr[i].split("=");
    
          if (name === cookiePair[0].trim()) {
            if (decodeURIComponent(cookiePair[1]) === "") {
              // If value for access_token is empty
              navigate(0);
            } else {
              return "Bearer " + decodeURIComponent(cookiePair[1]);
            }
          }
        }
        navigate(0);
      }

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
                            <TextField required variant="filled" fullWidth id="title" label="Event title" placeholder="Friday Pub" onChange={handleInputChange}/>
                        </Grid>
                        <Grid item xs={12} style={{marginTop: "1em"}}>
                            <TextField required variant="filled" fullWidth id="start_date" label="Event takes place on" placeholder="YYYY-MM-DD" onChange={handleInputChange}/>
                        </Grid>
                        <Grid item xs={12} style={{marginTop: "1em"}}>
                            <TextField required variant="filled" fullWidth id="start_time" label="Event starts at" placeholder="17:00:00" onChange={handleInputChange}/>
                        </Grid>
                        <Grid item xs={12} style={{marginTop: "1em"}}>
                            <TextField variant="filled" fullWidth id="end_date" label="Event ends on" placeholder="YYYY-MM-DD" onChange={handleInputChange}/>
                        </Grid>
                        <Grid item xs={12} style={{marginTop: "1em"}}>
                            <TextField variant="filled" fullWidth id="end_time" label="Event ends at" placeholder="03:00:00" onChange={handleInputChange}/>
                        </Grid>
                        <Grid item xs={12} style={{marginTop: "1em"}}>
                            <TextField required variant="filled" fullWidth id="location" label="Location" placeholder="Kistan 2.0" onChange={handleInputChange}/>
                        </Grid>
                        <Grid item xs={12} style={{marginTop: "1em", marginBottom: "1em"}}>
                            <TextField required variant="filled" fullWidth id="description" label="Description of the event" placeholder="Description.." onChange={handleInputChange}/>
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
                        return <p>Error: please make sure the event details are formatted correctly!</p>;

                        case 2:
                        return <p>Error: You do not have permission to create events!</p>;

                        case 3:
                        return <p>Event Created!</p>;
                    }
                    })()}
                </div>
            </div>
        </div>
    );
}

export default StyledEventForm;