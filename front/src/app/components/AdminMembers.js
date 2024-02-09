import { Fragment, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "@mui/material/Button";
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

var membersmap;

if (memberArr.length == 0)
{
    alert("apparently TMEIT...has no members...?");
    membersmap = <></>;
}
else
{
    membersmap = memberArr.map(membermap =>

    {
    
    <div>
        <div style={screenWide? style.members : style.membersMobile}>
    
            <p>{membermap.uuid}</p>
    
            <p>{membermap.short_uuid}</p>
    
            <p>{membermap.first_name}</p>
    
            <p>{membermap.nickname}</p>
    
            <p>{membermap.last_name}</p>
    
            <p>{membermap.current_role}</p>
    
            <p>{membermap.login_email}</p>
    
            <p>{membermap.phone}</p>
    
            <p>{membermap.drivers_license}</p>
    
            <p>{membermap.stad}</p>
    
            <p>{membermap.fest}</p>
    
            <p>{membermap.liquor_permit}</p>
            
            <Button variant="contained">Edit</Button>
            <Button variant="contained">Delete</Button>
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