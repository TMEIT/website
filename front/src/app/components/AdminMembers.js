import { Fragment, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import { primary_light } from "../palette";
import useIsScreenWide from "../useIsScreenWide";
import { getApiFetcher } from "../api";
import Loading from "./Loading";


function AdminMembers() {

const loadMemberData = async() => {setMemberData(await getApiFetcher().get("/members/").json())}
    useEffect(() => {loadMemberData() }, []);

const [memberArr, setMemberData] = useState(null);

let screenWide = useIsScreenWide(949);

const style ={
members :{
    background: primary_light, 
    bordeStyle: "solid",
    maxWidth: "50vw",
    margin: "2em",
    borderRadius: "1em",
    padding: "1em",
},

membersMobile :{
    background: primary_light, 
    bordeStyle: "solid",
    margin: "2em",
    maxWidth: "80vw",
    borderRadius: "1em",
    padding: "1em",
}
};

if (memberArr == null)
    return <Loading/>;


function handleEdit(short_uuid, data) {

if (confirm("Do you want to save the changes made to member with short uuid: " + short_uuid + "?") == true)
{
    getApiFetcher().patch("/members/" + String(short_uuid)).json({data});
}
else
    return;
}


function handleDelete(short_uuid) {

if(confirm("You are deleting member with short uuid: " + short_uuid) == true)
    getApiFetcher().delete("/members/" + String(short_uuid)).json();
else
    return;
}

var membersmap;

if (memberArr.length == 0)
{
    alert("Somehow...TMEIT has no members...?");
    membersmap = <></>;
}
else
{
    membersmap = memberArr.map(membermap =>

    {

    const handleInputChange = (e) => {
        const { id, value } = e.target;
        if (id === "firstName") {
        setFirstName(value);
        }
        if (id === "nickName") {
        setNickName(value);
        }
        if (id === "lastName") {
        setLastName(value);
        }
        if (id === "currentRole") {
        setCurrentRole(value);
        }
        if (id === "phone") {
        setPhone(value);
        }
        if (id === "driversLicense") {
        setDriversLicense(value);
        }
        if (id === "stad") {
        setStad(value);
        }
        if (id === "fest") {
        setFest(value);
        }
        if (id === "liquorPermit") {
        setLiquorPermit(value);
        }
    };

    const [firstName, setFirstName]             = useState(membermap.first_name);
    const [nickName, setNickName]               = useState(membermap.nickname);
    const [lastName, setLastName]               = useState(membermap.last_name);
    const [currentRole, setCurrentRole]         = useState(membermap.current_role);
    const [phone, setPhone]                     = useState(membermap.phone);
    const [driversLicense, setDriversLicense]   = useState(membermap.drivers_license);
    const [stad, setStad]                       = useState(membermap.stad);
    const [fest, setFest]                       = useState(membermap.fest);
    const [liquorPermit, setLiquorPermit]       = useState(membermap.liquor_permit);

    let data = {
        first_name      :   firstName,
        nickname        :   nickName,
        last_name       :   lastName,
        current_role    :   currentRole,
        login_email     :   membermap.login_email,
        phone           :   phone,
        drivers_license :   driversLicense,
        stad            :   stad,
        fest            :   fest,
        liquor_permit   :   liquorPermit
    };
    
    <div>
        <div style={screenWide? style.members : style.membersMobile}>

            <p>{membermap.uuid}</p>

            <p>{membermap.short_uuid}</p>

            <TextField  variant="filled"  fullWidth  id="firstName"  label="First name"  name="first name" value={firstName}  required  onChange={handleInputChange}/>

            <TextField  variant="filled"  fullWidth  id="nickName"  label="Nickname"  name="nickname" value={nickName}  required  onChange={handleInputChange}/>

            <TextField  variant="filled"  fullWidth  id="lastName"  label="Last name"  name="last name" value={lastName}  required  onChange={handleInputChange}/>

            <TextField  variant="filled"  fullWidth  id="currentRole"  label="Current role"  name="current role" value={currentRole}  required  onChange={handleInputChange}/>

            <p>{membermap.login_email}</p>

            <TextField  variant="filled"  fullWidth  id="phone"  label="Phone number"  name="phone number" value={phone}  required  onChange={handleInputChange}/>

            <TextField  variant="filled"  fullWidth  id="driversLicense"  label="Drivers license"  name="drivers license" value={driversLicense}  required  onChange={handleInputChange}/>

            <TextField  variant="filled"  fullWidth  id="stad"  label="STAD"  name="stad" value={stad}  required  onChange={handleInputChange}/>

            <TextField  variant="filled"  fullWidth  id="fest"  label="FEST"  name="fest" value={fest}  required  onChange={handleInputChange}/>

            <TextField  variant="filled"  fullWidth  id="liquorPermit"  label="Liquor permit"  name="liquor permit" value={liquorPermit}  required  onChange={handleInputChange}/>
            
            <Button variant="contained"onClick={() => handleEdit(membermap.short_uuid, data)}>Edit</Button>
            <Button variant="contained"onClick={() => handleDelete(membermap.short_uuid)}>Delete</Button>
        </div>
    </div>
    })
}

return (
<>
    <Fragment>{membersmap}</Fragment>{/* <button onClick={() => console.log(currentData)}>Cum</button> who tf put this here? xD*/}
</>
)
}


export default AdminMembers;