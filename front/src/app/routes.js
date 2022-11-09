import {lazy} from "react";

// Use loader to import component
// https://www.infoxicator.com/en/react-router-6-4-code-splitting

const routes = {
    "Home": {
        "component": lazy(() => import("./layouts/Home")),
        "loader": async () => await import("./layouts/Home"),
    },
    "Events": {
        "component": lazy(() => import("./layouts/Events")),
        "loader": async () => await import("./layouts/Events"),
    },
    "Join": {
        "component": lazy(() => import("./layouts/Join")),
        "loader": async () => await import("./layouts/Join"),
    },
    "Team": {
        "component": lazy(() => import("./layouts/Team")),
        "loader": async () => await import("./layouts/Team"),
    },
    "Profile": {
        "component": lazy(() => import("./layouts/Profile")),
        "loader": async () => await import("./layouts/Profile"),
    },
    "Joined": {
        "component": lazy(() => import("./layouts/Joined")),
        "loader": async () => await import("./layouts/Joined"),
    },
    "MasterMenu": {
        "component": lazy(() => import("./layouts/MasterMenu")),
        "loader": async () => await import("./layouts/MasterMenu"),
    },
    "WebsiteMigrations": {
        "component": lazy(() => import("./layouts/WebsiteMigrations")),
        "loader": async () => await import("./layouts/WebsiteMigrations"),
    },
}

export default routes;