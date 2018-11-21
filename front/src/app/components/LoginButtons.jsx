import React from "react";
import GoogleLogin from "react-google-login";

const google_client_id = "497107500705-ngsmiiqi3p6r1l5pp0gpfgnfqf7b8jcb.apps.googleusercontent.com";

export class LoginButtons extends React.Component {
    render() {
        return (
            <div>
                <GoogleLogin
                    clientId={google_client_id}
                    onSuccess={(response) => console.log(response)}
                    onFailure={(response) => console.log(response)}
                />
            </div>
        );
    }
}