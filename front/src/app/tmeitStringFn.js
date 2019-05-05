import Enum from "enum"

export const currentRolesEN = new Enum({
    'master': 0,
    'marshal': 1,
    'prao': 2,
    'vraq': 3,
    'ex': 4,
    'inactive': 5,
    'exprao': -1
},
    { //enum options
        freez: true
    });

export function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}