// TO DO: This is where the token can be checked for validity

async function CheckLogin() {
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
        const tokenText = "Bearer " + decodeURIComponent(cookiePair[1]);
        let result = await makeRequest(tokenText);
        console.log(result);
        if (result === 200) return true;
      }
    }
  }

  // If there is no cookie for access_token, return false
  return false;
}

function makeRequest(tokenText) {
  return new Promise(function (resolve, reject) {
    let xhr = new XMLHttpRequest();
    xhr.open("GET", "/api/v1/me");
    xhr.setRequestHeader("Authorization", tokenText);
    xhr.responseType = "json";

    xhr.onload = function () {
      if (this.status >= 200 && this.status < 300) {
        resolve(xhr.status);
      } else {
        reject({
          status: this.status,
          statusText: xhr.statusText,
        });
      }
    };
    xhr.onerror = function () {
      reject({
        status: this.status,
        statusText: xhr.statusText,
      });
    };
    xhr.send();
  });
}
export default CheckLogin;
