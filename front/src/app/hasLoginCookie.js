function hasLoginCookie() {
    const cookieName = "access_token";
    const cookieArr = document.cookie.split(";");

    //Loop through array until token cookie is found
    for (let i = 0; i < cookieArr.length; i++) {
        const cookiePair = cookieArr[i].split("=");

        if (cookieName === cookiePair[0].trim()) {
            return !(decodeURIComponent(cookiePair[1]) === "");
        }
    }

    // If no cookie was found, return false
    return false;
}

export default hasLoginCookie;