import styled from "@emotion/styled";

import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';

import SignupListItem from "../components/SignupListItem.js";
import { kisel_blue, kisel_blue_dark, primary_lighter } from "../palette";
import { getApiFetcher } from "../api.js";

const StyledSignupList = styled(SignupList) ({});

function SignupList({className, children}) {
    return (
        <div className={className}>
            {children}
        </div>
    );
}

//Render-method seems to be the current problem
const render_signups = (data, role) => 
    Object.values(data).filter(data => data.role === role).map(data => {console.log(data); return(<SignupListItem worker={data}/>)})

const StyledViewSignups = styled(ViewSignups)({
    h2: {
        fontSize: "12px",
    },

    ".detailRow": {
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(1.2em, 1fr))",
    },

    ".detailBox": {
        borderStyle: "solid",
        borderColor: "black",
        borderWidth: "thin",
        overflow: "hidden",
        textOverflow: "ellipsis",
    },

    "@media (max-width: 950px)" :{
        h2: {
            fontSize: "8px",
        },

        ".detailRow": {
            gridTemplateColumns: "repeat(auto-fil, minmax(1.4em, 1fr))",
        }
    }
});

function ViewSignups({className, eventID})
{

    /*
    const loadSignupData = async () => {setSignupList(await getApiFetcher().get(//set path to get signup-data from API with the help of eventID).json())}
    useEffect(() => { loadSignupData() }, []); // Load list of signups when component is mounted, only once
    */

    const dummySignupList = {
        signups : [{first_name: "Sebastian", nickname: "Bänk", last_name: "Divander", phonenum: "num", mail: "sdiv@kth.se", role: "Marshal", 
                    canwork: true, work_start: "10", work_end: "03", willBreak: false, break_start: null, break_end: null, comment: ""},

                    {first_name: "Edwin", nickname: null, last_name: "Ahlstrand", phonenum: "num", mail: "edah@kth.se", role: "Prao", 
                    canwork: false, work_start: null, work_end: null, willBreak: false, break_start: null, break_end: null, comment: "Have to watch the kids today"},

                    {first_name: "Gustav", nickname: null, last_name: "Appelros", phonenum: "num", mail: "guap@kth.se", role: "Prao", 
                    canwork: true, work_start: "14", work_end: "22", willBreak: true, break_start: "16", break_end: "17", comment: "Have to attend a lecture at 16 to 17. Will have to leave early"}
                ]
    };

    const masterList = render_signups(dummySignupList.signups, "Master"); //Render-method seems to be the problem
    const marshalList = render_signups(dummySignupList.signups, "Marshal");
    const praoList = render_signups(dummySignupList.signups, "Prao");
    
    return(
        <div className={className}>
            <Box sx={{display: "grid", gridTemplateRows: "repeat(auto-fit, minmax(20px, 1fr))", marginTop: 2, marginBottom: 2, padding: "1em", borderRadius: "1em", bgcolor: primary_lighter}}>
                <div>
                    <Grid>
                        <h1>Signups for event: {eventID} </h1>
                    </Grid>
                </div>
                <div className="detailRow">
                    <Grid className="detailBox">  <h2>Name: </h2>                         </Grid>
                    <Grid className="detailBox">  <h2>Nick: </h2>                         </Grid>
                    <Grid className="detailBox">  <h2>Role: </h2>                         </Grid>
                    <Grid className="detailBox">  <h2>Phone no.: </h2>                    </Grid>
                    <Grid className="detailBox">  <h2>Can work?: </h2>                    </Grid>
                    <Grid className="detailBox">  <h2>From: </h2>                         </Grid>
                    <Grid className="detailBox">  <h2>To: </h2>                           </Grid>
                    <Grid className="detailBox">  <h2>Will leave?: </h2>                  </Grid>
                    <Grid className="detailBox">  <h2>From: </h2>                         </Grid>
                    <Grid className="detailBox">  <h2>To: </h2>                           </Grid>
                    <Grid className="detailBox">  <h2>Comment: </h2>                      </Grid>
                </div>
                <div>
                    <StyledSignupList>{masterList}</StyledSignupList>
                    <StyledSignupList>{marshalList}</StyledSignupList>
                    <StyledSignupList>{praoList}</StyledSignupList>
                </div>
            </Box>
        </div>
    );
}

export default StyledViewSignups