import wretch from "wretch"

function getAccessToken() {
    // get access_token cookie
    let name = "access_token";
    let cookieArr = document.cookie.split(";");
    let access_token = "";

    //Loop through array until token is found
    for (let i = 0; i < cookieArr.length; i++) {
        let cookiePair = cookieArr[i].split("=");
        if (name === cookiePair[0].trim()) {
            access_token = cookiePair[1];
        }
    }
    return access_token;
}

export const getApiFetcher = () => {
    const access_token = getAccessToken();
    if(access_token == '')
        return wretch("/api/v1")
    else
        return wretch("/api/v1")
        .auth(`Bearer ${access_token}`)
};
