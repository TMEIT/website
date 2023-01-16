# [tmeit.se](https://tmeit.se)

### **A social media site for the TMEIT klubbmästeri 💙**

[![Push and publish app](https://github.com/TMEIT/website/actions/workflows/publish-master.yaml/badge.svg)](https://github.com/TMEIT/website/actions/workflows/publish-master.yaml)

___

## What this repository is used for

This repository is a "mono-repo" containing all of the source code and infrastructure for [tmeit.se](https://tmeit.se).

### Documentation

* Documentation about the website and the infrastructure we have for hosting it can be found in [`docs/`](/docs)

### Code

* The ReactJS code for the frontend can be found in [`front/`](/front).
* The Python code for the FastAPI-based backend API can be found in [`back/`](/back).
* The Dockerfiles used for distributing the app and other tools and scripts can be found in [`containerfiles/`](/containerfiles).

### CI/CD

All of the code and infrastructure in this repository is automatically deployed on every push to the master branch, 
we use Github Actions and a number of scripts to enable this. 

* The Github Actions workflow that runs on every push to the master branch is located in [`publish-master.yaml`](/.github/workflows/publish-master.yaml).
* The Github Actions workflow that validates and tests incoming Pull Requests is located in [`test-pr.yaml`](/.github/workflows/test-pr.yaml).
* Helper scripts for Github actions and coordinating component versions are located in [`release_utils/`](/release_utils).
* The Tiltfiles for spinning up a developer environment are located at [Tiltfile](/Tiltfile) 
and [Tiltfile-docker](/Tiltfile-docker), 
depending on if you use Podman or Docker on your local computer. 
* [tilt_options.json](/tilt_options.json) is used to configure Tilt after you have cloned this repository onto your local computer.

### Infrastructure

* Our Kubernetes configuration used to deploy the website and spin up developer environments can be found in [`deploy/kubernetes/`](/deploy/kubernetes) 
* Our Terraform configuration used to configure Cloudflare DNS, Backblaze B2 storage, and Hetzner compute can be found in [`deploy/terraform/`](/deploy/terraform) 

### License

All of the code in this repository is open-source and licensed under **AGPL-3.0**. 
If you use this code in your own projects, you must share your source code, even if you are only using the code to run a website.  The full license can be found [here](/LICENSE).


## Contributors

* Justin Lex-Hammarskjöld (AKA "Lex")
  * Project leader, Architecture, Python code, Terraform & Kubernetes configuration
  * [Github](https://github.com/JustinLex)
* Sebastian Divander (AKA "Bänk")
  * Lead frontend developer
  * [Github](https://github.com/Sebbedi)
* Axel Förshallen (AKA "Doggo")
  * Frontend forms, cookie handling, and API integration
  * [Github](https://github.com/axelf08)
* Jesper Falk
  * Product owner, Senior advice
  * [Github](https://github.com/loffa)
* Wajd Tohme
  * Frontend HTML/CSS
  * [Github](https://github.com/wajd)


## Features

### Code components
The most important principles when developing this software are that 
it is flexible enough to be expanded in the future without being completely rewritten, 
and that it is extremely accessible to university students just starting their computer engineering careers.

* All of the website components run on Kubernetes for portability, self-healing, and automated certificate renewal.
* The backend API uses the powerful FastAPI library and is backed by a self-managed PostgreSQL cluster.
* The frontend is a ReactJS single-page-app that uses a well-defined api to get its data from the backend. The frontend is intentionally kept simple, avoiding complexity like create-react-app and Redux.
* The API takes advantage of FastAPI's automatic OpenAPI documentation, and every API endpoint can be tried out from the [site's OpenAPI documentation page](https://tmeit.se/api/v1/docs). 
* All code is linted and tested automatically before it is merged to master to ensure code quality and give developers feedback about their code.
* New releases are built and deployed automatically, with no knowledge needed from the developers. 

### Infrastructure
This website is a hobby project, so the two most important things when it comes to infrastructure are that it's resilient without outside interaction, and that it's cheap.

The website infrastructure is deployed automatically with Terraform and configured to update itself. 
The server doesn't need any interaction from the admins, 
except when it's time for major updates like new versions of Kubernetes, Debian, and Postgres, 
which only happen once a year or less.

New versions of the website are built as containers and deployed automatically with a CI/CD pipeline. 
Software runtimes are packaged with the website code and don't have to be updated on the server.

The PostgreSQL database is backed up every hour to object storage to ensure user data is safe even if the server crashes and burns.

At the same time, we keep hosting costs as low as possible. We don't use any managed services, 
just a cheap single-core VM from Hetzner, cheap object storage on Backblaze B2, and free DNS/CDN services from Cloudflare. 
Monthly costs are under €5 / month.

We also store personal data about our members, so it's important that we follow GDPR principles when storing our data. 

Our server is firewalled from the outside world and can only be accessed over encrypted channels using mTLS authentication.
~~Even the website itself can only be accessed through Cloudflare with an Authenticated Origin Pull.~~ (Not implemented yet...)

The attack surface on the server is very small, and requires either using major zero-day exploits across multiple layers of security, 
or theft of API keys from Github. 

Our Compute provider, Hetzner, is based in Europe, with our server located locally in a secure Finnish datacenter. 
All long-term storage of user data is done at Backblaze's Amsterdam datacenter. 
All data is stored with trusted cloud providers with good reputations, and no user data ever leaves the EU once it hits our server.

## History of tmeit.se

This is the third revision of tmeit.se.

### tmeit.se (~2004)
There was a tmeit.se from 2004. It is not well documented, but full backups of the site exist.

The site was a place where members could chat on a forum and share photos from TMEIT parties.

### tmeit.se (2011)
From 2011 to 2022, tmeit.se was a PHP site written by [Wilhelm Svenselius](https://github.com/wsv-accidis) in December 2011.

It was a custom fork of Mediawiki hosted on a Loopia webbhotell. It had added features like workteams, events, multiple profile pictures, groups, and badges. 
Users could earn points and level up for working at events (or maybe hacking some points for themselves)

TMEIT members could create their own pages, and people got pretty creative.

The website lived for nearly 11 years. The website was finally taken down on 2022-10-26.

[You can browse the source code for the original tmeit.se here](https://github.com/wsv-accidis/tmeit-wiki).

The original tmeit.se even had an Android app. [You can find it's source code here](https://github.com/wsv-accidis/tmeit-android).

![Screenshot of the old website in 2022](/docs/old_website.png?raw=true "The original tmeit.se in 2022")

### tmeit.se (2022)
The current version of tmeit.se has been in development since 2018 when Lex got elected as Webbmarskalk!

The old website was 7 years old at the time and looked pretty outdated. 
The goal was to build a new, modern, and flexible website from scratch to replace the original website.

Development was pretty slow the first few years since it was a large, complicated project, starting from scratch. 
There were a number of revisions and rewrites of the early code.

After 4 years of off-and-on development, the new tmeit.se was finally released on 2022-11-11.

## How to get involved
Everyone is welcome to open an [Issue](https://github.com/TMEIT/website/issues) if they have any ideas for features! 
Please open an issue if you notice any bugs on the website or in the documentation.

One of the first things you can do to start digging into the website is to check out the [API documentation](https://tmeit.se/api/v1/docs)!    
This documentation page is automatically generated by the backend and shows every API endpoint you can call, 
and it even lets you test them out and talk JSON to the backend, right in the browser.

The website is completely container-based, and so is the development environment. 
It's pretty easy to spin up a copy of the website on your own computer for development, 
but you will need access to a kubernetes cluster to run it. 
You can either use something like [minikube](https://minikube.sigs.k8s.io/docs/start/) 
to spin one up on your local machine, or you can ask Lex to give you access to his home server cluster.

More information about how to get started with this code can be found in the [Developer Guide](/docs/howto-dev.md).

This website covers many areas of web-development and systems-operations, 
and it's a pretty good playground to learn new technologies and practice coding!

You can find the website discussion in the #webbweebs channel on the TMEIT discord. 
Feel free to come by and ask questions!

<br/>
<br/>
<br/>
<br/>

___

vi kan bara iterera
