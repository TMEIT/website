import { useState, useEffect } from "react";

export const useFetch = url => {
    /**
     * Custom React hook to handle asynchronous fetches in components.
     *
     * Returns a state object "data" that contains the results of the fetch, as well as a flag to notify if the fetch
     * is still loading. When the fetch is complete, the state object will update, which will trigger a rerender on the
     * component that called this hook.
     * Fetches are only started at the first render calling this function with a given url. If a component calls the
     * hook again with a new url, it will start a new fetch.
     *
     * Code adapted from this guide: https://reactgo.com/ajax-requests-fetch-data-using-react-hooks/
     * More in-depth look at the same code logic used directly in a component here:
     * https://www.robinwieruch.de/react-hooks-fetch-data/
     *
     * There is currently a plan to build asynchronous fetches into React by Mid 2019 (aka react-cache + Suspense),
     * so this code may be replaced with the built-in functionality when that is released.
     */
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    async function fetchData() {
        // get access_token cookie
        var name = "access_token";
        var cookieArr = document.cookie.split(";");
        var access_token = "";
        
        //Loop through array until token is found
        for (var i = 0; i < cookieArr.length; i++) {
            var cookiePair = cookieArr[i].split("=");
            if (name === cookiePair[0].trim()) {
                access_token = "Bearer " + cookiePair[1];
            }
        }
                
        const response = await fetch(url, {headers: {"Authorization": access_token}});
        if(!response.ok) {
            setData("error");
            setLoading(false);
        } else {
            const json = await response.json();
            setData(json);
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchData()
    }, [url]);

    return {loading,data};
};