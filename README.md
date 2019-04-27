# website

A new website created by and for TMEIT

[![Build Status](https://travis-ci.org/TMEIT/website.svg?branch=master)](https://travis-ci.org/TMEIT/website)
[![Coverage Status](https://coveralls.io/repos/github/TMEIT/website/badge.svg?branch=backend-token-processing)](https://coveralls.io/github/TMEIT/website?branch=backend-token-processing)

## Sitemap and page design ideas

### Sidebar/Navbar
* Links to important pages
    * Events
    * People
    * Signup to be a PRAO
* Login button that creates a login pop-up "window"
    * Log in with either kth email or google account
    * Must be registered to log in
* Links to IN-Sektionen and QMISK websites

### Footer
* Link to site Github
* Privacy Policy
* Link to Android apps on Play Store

### Front Page
* Description of TMEIT
* Calendars for Kistan and fester.nu
* Cards for upcoming events
* Gallery of random Member pics?


### Events
* A list of all KMR events (also internfester and utlandsfester if logged in)
* TMEIT Pubs and gasques automatically crosspost to Facebook
* Switch between two views, upcoming and past:
    * List of upcoming events from soonest to last
    * List of past events from latest to oldest, maybe with year selectors
* Time, date, location
* Number of people attending from TMEIT
* (if logged in)
    * Number of people working
    * Y/M/N attendence

    
### Event
* Banner
* Name
* Description
* Time and date
* Location
* Link to FB Page
* List of TMEIT people attending 
* Comments
    * Live comments
    * To encourage shitposting, users cannot delete comments


### People
* Basically the same page as the old site, with a fresher look
* Profile photos are randomly chosen from available
* Maybe only show a "professional" picture if not logged in
* Links to profiles

### Profiles
* Info should be limited if you're not logged in
* Profile header: Name + nickname, Title, Team, random picture, and points
* Info section:
        * email
        * DOB
        * Permits
        * History
* Tabbed sections:
    * Comments
        * Live comments
        * To encourage shitposting, users cannot delete comments
    * Pictures
        * Able to upload new photos
        * (Profile photos should be uploaded to static host automatically and backend should track IDs)
    * Events worked 
    * Events attended


### Sign up
* Homemade form for signing up as prao, can be more unique than Google Forms
* Must sign up with a kth email, masters/marskalk can bypass this
* Proper GDPR consent
* Make sure to rate limit signups
