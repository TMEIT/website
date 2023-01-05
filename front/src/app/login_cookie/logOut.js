
function logOut(navigate) {
    // TODO: add logout confirm logic
    // Delete the login cookie and refresh the page
    document.cookie = "access_token=; expires = Thu, 01 Jan 1970 00:00:00 UTC;";
    navigate(0);
}

export default logOut;
