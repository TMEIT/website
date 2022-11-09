import styled from "@emotion/styled";


const StyledJoinWhyJoin = styled(JoinWhyJoin)({
    p: {
        textAlign: "justify"
    },
    h2: {
        fontSize: "calc(1.325rem + .9vw)"
    }
});

function JoinWhyJoin({className}) {
  return (
    <div className={className}>
        <h2>Our community</h2>
        <p>
            TMEIT isn't the only student club in Kista that runs fun social events.
            We also have 3 sister clubs in Kista, with both ITK and QMISK running gaming and pub events here with us at KTH Kista,
            and DISK just up the road at Stockholm University Kista.
            All of these student clubs in Kista are good friends with each other,
            and we all get discounts at each other's events.
        </p>
        <p>
            We are also good friends with many other klubbmästerier in Stockholm and Sweden.
            We are part of the "Klubbmästerirådet" (KMR) council in Stockholm,
            and we go to many parties with students from Stockholm University, other KTH campuses,
            and other universities in Greater Stockholm.
        </p>
        <h2>Who can join</h2>
        <p>
            No prior bartending experience is needed to join TMEIT.
            Everyone is welcome to become a PRAO and learn how to run events and become a bartender.
        </p>
        <p>
            Sober lifestyles are also welcome in the klubbmästeri, and we speak both Swedish and English in TMEIT.
        </p>
        <h2>Becoming a Marshal</h2>
        <p>
            As a TMEIT PRAO, you can learn about what we do in TMEIT and join in on the fun.
            Being a PRAO is the first step towards becoming a Marshal and a permanent member of TMEIT.
        </p>
        <p>
            At TMEIT, we're all best friends, and we have a process of promoting new members from PRAO to Marshal.
            As a PRAO, you may be offered the chance to be accepted into TMEIT as a Marshal.
        </p>
        <p>
            TMEIT does not have a limit on its member count, and every PRAO is able to become a Marshal when they are ready for it.
        </p>
    </div>
  )
}

export default StyledJoinWhyJoin;
