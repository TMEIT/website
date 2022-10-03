function CheckLogin() {
  var name = "access_token";
  var cookieArr = document.cookie.split(";");

  //Loop through array until token is found
  for (var i = 0; i < cookieArr.length; i++) {
    var cookiePair = cookieArr[i].split("=");

    if (name === cookiePair[0].trim()) {
      if (decodeURIComponent(cookiePair[1]) === "") {
        // If value for access_token is empty, return false
        return false;
      } else {
        return true;
      }
    }
  }

  // If there is no cookie for access_token, return false
  return false;
}

export default CheckLogin;
