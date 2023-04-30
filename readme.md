<div align ='center'><img src="https://camo.githubusercontent.com/88ebb3d3a22eaccf6758b9eee02d1ef1ce49230642f86da244f4270773d59004/687474703a2f2f6564756170702d70726f6a6563742e65752f77702d636f6e74656e742f75706c6f6164732f323032312f30332f4c6f676f2d4564754170702d312d313530783135302e706e67" alt="logo">
</div>

- [About the project](#about-the-project)
- [Backend](#backend-structure)
- [Frontend](#frontend-structure)
- [API Documention](#api-documention)
- [Use Cases](#use-cases)
- [Tech stack and comparison](#tech-stack-and-comparison)
- [How to mount an EduApp server](https://github.com/eduapp-project/eduapp/tree/main/server-config)
- [Personal opinion and comparison](#personal-opinion-and-comparison)

<h1>About the project</h1>
<div>
    EduApp emerges after the COVID-19 pandemic, as the answer to the challenges that this entails.
    <br/>
	  <br/>
    It's an european project, co-funded by ERASMUS+ programme.
    <br/>
    <h2>Partners</h2>
		<ul>
			<li>Fundatia Ecologica Green - Romania</li>
			<li>Instituto Politécnico de Santarém - Portugal</li>
			<li>Stichting Landstede - Netherlands</li>
			<li>SOSU OSTJYLLAND - Denmark</li>
			<li>IES El Rincón - Spain</li>
		</ul>
    <h2>Objectives</h2>
    <p>Facilitate and increase the communication between school, students and teachers by developing an application, EduApp, free and open source, customised for each partner school.</p>
</div>
  
<h1>Backend Structure</h1>
<p>EduApp has used PostgreSQL as database, Ruby On Rails as the API framework.</p>
<h2>Database Table Structure</h2>
<table style="border: 1px solid white;">
	<tr>
		<th>Table</th>
		<th>What information it holds</th>
	</tr>
	<tr>
		<td>Users</td>
		<td>Stores the user's login information.</td>
	</tr>
	<tr>
		<td>User Roles</td>
		<td>Roles with permissions to restrict access to users.</td>
	</tr>
	<tr>
		<td>User Infos</td>
		<td>Stores user's information like user names.</td>
	</tr>
	<tr>
		<td>JTI Matchlist</td>
		<td>Table used to verify access tokens.</td>
	</tr>
	<tr>
		<td>Institutions</td>
		<td>The institution's information.</td>
	</tr>
	<tr>
		<td>Courses</td>
		<td>Information about courses.</td>
	</tr>
	<tr>
		<td>Subjects</td>
		<td>Information about subjects and its colour in the calendar.</td>
	</tr>
	<tr>
		<td>Tuitions</td>
		<td>Shows who is enrolled in what course.</td>
	</tr>
	<tr>
		<td>Resources</td>
		<td>Has a resource name, description and files attached.</td>
	</tr>
	<tr>
		<td>Sessions</td>
		<td>Has a name of session, start and end date, and different actions.</td>
	</tr>
	<tr>
		<td>Calendar Annotations (Events)</td>
		<td>Calendar displayed events with a timed duration.</td>
	</tr>
	<tr>
		<td>Chat Bases</td>
		<td>The chat's main information.</td>
	</tr>
	<tr>
		<td>Chat Participants</td>
		<td>Tells the chat which participants are allowed to enter.</td>
	</tr>
	<tr>
		<td>Chat Messages</td>
		<td>The individual chat's messages.</td>
	</tr>
</table>

<h2>ORM</h2>
<p></p>
<h3>How to install and run</h3>
<p>First of all, you must download and install a Ruby environment from 2.6.9 onwards. After you can proceed in cloning the repository.</p>
<p>To clone, use:</p>

```bash
git clone https://github.com/eduappdevs/eduapp
cd eduapp/backend/eduapp_db
rvm install 3.1.2
rvm use 3.1.2
gem install bundle
bundle install
```

<p>After using these commands, you must change the environment files to suite your development environment to make sure everything works correctly.</p>
<p>To have initialize the backend, you must run these commands:</p>

```
rails db:create
rails db:migrate:reset // Used to restart all database values
rails db:seed // To insert the app's roles.
```

<p>After you have followed these steps, you can start the API server with:</p>

```bash
rails s
```

<p>To stop the server you have to use CTRL + C.</p>

<h1>Frontend Structure</h1>
<p>This is how EduApp was initialtly planned, but some key visual changes were made.</p>

<details>
<summary>Prototypes</summary>
	<img src="./prototipo/eduapp-1.png" alt="prototipo">
	<img src="./prototipo/Eduapp-2.png" alt="prototipo">
	<img src="./prototipo/Eduapp-3.png" alt="prototipo">
</details>

<h3>How to install and run</h3>
<p> First, you must install the programs. Now you have to clone the project and used this commands.</p>
<p>To clone, use:</p>

```bash
git clone https://github.com/eduappdevs/eduapp
cd eduapp/frontend
npm install

// For Windows users
npm run devw

// For Unix system users (Mac, Linux)
npm run dev
```

<p>To stop the server you have to use CTRL + C.</p>

<h1 >Tech stack</h1>
<div>
  <a href="https://rubyonrails.org">
     <img src="https://img.shields.io/badge/rails-%23CC0000.svg?style=for-the-badge&logo=ruby-on-rails&logoColor=white" alt="Rails"/>
	</a>
</div>
<div>        
  <a href="https://reactjs.org">
    <img src="https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB" alt="React"/></a>
  </div>
<div>
  <a href="#">
    <img src="https://img.shields.io/badge/javascript-%23323330.svg?style=for-the-badge&logo=javascript&logoColor=%23F7DF1E" alt="Javascript"/>
  </a>
</div>
<div>
  <a href="#">
    <img src="https://img.shields.io/badge/html5-%23E34F26.svg?style=for-the-badge&logo=html5&logoColor=white" alt="Html"/>
  </a>
</div>
<div>
  <a href="#">
    <img src="https://img.shields.io/badge/css3-%231572B6.svg?style=for-the-badge&logo=css3&logoColor=white" alt="CSS"/>
  </a>
</div>     
<div>
  <a href="#">
    <img src="https://img.shields.io/badge/Adobe%20XD-470137?style=for-the-badge&logo=Adobe%20XD&logoColor=#FF61F6" alt="AdobeXD"/>
  </a>
</div>   
<div>
  <a href="#">
    <img src="https://img.shields.io/badge/github-%23121011.svg?style=for-the-badge&logo=github&logoColor=white" alt="Github"/>
  </a>
</div>

<h2>Platform</h2>
<p>This app is being developed in both platforms, mobile and desktop as a hybrid PWA. This means that once in the browser and in production mode, you should be able to install EduApp's browser application directly on your device.</p>

<p>The only way to access the application is by having an administrator sign you up in the administration panel.</p>

<p>EduApp has six main types of users, depending on it the permissions you will have.</p>

<h3>1. Guests are able to:</h3>
<p>Have restricted view and access to the app. Their sole purpose is to view information, but can't access the chats for privacy.</p>

<h3>2. Students are able to:</h3>
<p>View your account's calendar, resources, upcoming sessions, and chats.</p>

<h3>3. Teachers are able to:</h3>
<p>They have the same functionality as students, but they have permission to create global events in the calendar, create resources and chats.</p>

<h3>4. Worker/Administration Viewers are able to:</h3>
<p>They have control over the users of their school, they manage accounts, the calendar and the sessions.</p>

<h3>5. Administrators are able to:</h3>
<p>Have full access to the management of the app. </p>

<h3>Login</h3>
<p>Main access page to accesss the app.</p>
<details>
	<summary>App Images</summary>
	<div style="display: flex; flex-direction: row; flex-wrap: wrap;">
		<img width="350" height="750" src="https://raw.githubusercontent.com/eduappdevs/eduapp/features/skinnydevi/Documentation/screenshots/login.png"m/>
	</div>
</details>

<h3>Home Page</h3>
<p>Displays the main user's welcome page. It contains the current day's sessions, as well as received notifications.</p>
<details>
	<summary>App Images</summary>
	<div style="display: flex; flex-direction: row; flex-wrap: wrap;">
		<img width="350" height="750" src="https://raw.githubusercontent.com/eduappdevs/eduapp/features/skinnydevi/Documentation/screenshots/home-page.png"m/>
	</div>
</details>

<h3>Calendar Page</h3>
<p>Shows a calendar with current sessions and events one can keep track.</p>
<details>
	<summary>App Images</summary>
	<div style="display: flex; flex-direction: row; flex-wrap: wrap;">
		<img width="350" height="750" src="https://raw.githubusercontent.com/eduappdevs/eduapp/features/skinnydevi/Documentation/screenshots/calendar-page.png"/>
	</div>
</details>

<h3>Resources Page</h3>
<p>At first you will see a 'General' tab or subject. The 'General' tab is used to display public announcements</p>
<p>You must select the subject to see its resource. You can also filter the resources with the search bar placed at the top of the page.</p>
<p>If you are a teacher of that subject, you will see a plus icon which will provide you with access to a creation modal.</p>
<details>
	<summary>App Images</summary>
	<div style="display: flex; flex-direction: row; flex-wrap: wrap;">
		<img width="350" height="750" src="https://raw.githubusercontent.com/eduappdevs/eduapp/features/skinnydevi/Documentation/screenshots/resources-subjects-page.png" />
		<img width="350" height="750" src="https://raw.githubusercontent.com/eduappdevs/eduapp/features/skinnydevi/Documentation/screenshots/resources-page.png" />
		<img width="350" height="750" src="https://raw.githubusercontent.com/eduappdevs/eduapp/features/skinnydevi/Documentation/screenshots/create-resource.png" />
		<img width="350" height="750" src="https://raw.githubusercontent.com/eduappdevs/eduapp/features/skinnydevi/Documentation/screenshots/example-resource.png" />
	</div>
</details>

<h3>Chat Page</h3>
<p>Displays the main user's welcome page. It contains the current day's sessions, as well as received notifications.</p>
<p>If you are a teacher or superior, you will find a creation button that will allow you to create different types of chats.</p>
<details>
	<summary>App Images</summary>
	<div style="display: flex; flex-direction: row; flex-wrap: wrap;">
		<img width="350" height="750" src="https://raw.githubusercontent.com/eduappdevs/eduapp/features/skinnydevi/Documentation/screenshots/chats-page.png" />
		<img width="350" height="750" src="https://raw.githubusercontent.com/eduappdevs/eduapp/features/skinnydevi/Documentation/screenshots/create-direct-chat.png" />
		<img width="350" height="750" src="https://raw.githubusercontent.com/eduappdevs/eduapp/features/skinnydevi/Documentation/screenshots/create-group-chat.png" />
		<img width="350" height="750" src="https://raw.githubusercontent.com/eduappdevs/eduapp/features/skinnydevi/Documentation/screenshots/direct-chat-page.png" />
		<img width="350" height="750" src="https://raw.githubusercontent.com/eduappdevs/eduapp/features/skinnydevi/Documentation/screenshots/direct-chat-page.png" />
		<img width="350" height="750" src="https://raw.githubusercontent.com/eduappdevs/eduapp/features/skinnydevi/Documentation/screenshots/group-chat-page.png" />
		<img width="350" height="750" src="https://raw.githubusercontent.com/eduappdevs/eduapp/features/skinnydevi/Documentation/screenshots/chat-info-page.png" />
	</div>
</details>


<h1>API Documention
	<img  width="100" height="35" src="https://miro.medium.com/max/802/1*dLWPk_rziSpWhPx1UWONbQ@2x.png" style="transform: translateY(5px);"/>
</h1>

<ul>
	<li>
		<a href="https://documenter.getpostman.com/view/17931022/UVksLtxR">Institutions Database Table</a>
	</li>
	<li>
		<a href="https://documenter.getpostman.com/view/17931022/UVksLtxP">Courses Database Table</a>
	</li>
	<li>
		<a href="https://documenter.getpostman.com/view/17931022/UVksLtxS">Tuitions Database Table</a>
	</li>
	<li>
		<a href="https://documenter.getpostman.com/view/17853818/UVR5qUPr">User Info Database Table</a>
	</li>
	<li>
		<a href="https://documenter.getpostman.com/view/17853818/UVR5qUUB">User Auth Database Table</a>
	</li>
	<li>
		<a href="https://documenter.getpostman.com/view/17931022/UVksLtoe">Subjects Database Table</a>
	</li>
	<li>
		<a href="https://documenter.getpostman.com/view/17931022/UVR5qUU8">Session Database Table</a>
	</li>
	<li>
		<a href="https://documenter.getpostman.com/view/17853818/UVR5qUPn">Resources Database Table</a>
	</li>
	<li>
		<a href="https://documenter.getpostman.com/view/17931022/UVksLtt4">Calendar Database Table</a>
	</li>
	<li>
		<a href="https://documenter.getpostman.com/view/17831178/UVksLtt8">Chats Database Table</a>
	</li>
</ul>

<h1>Use Cases</h1>
<img src="./Documentation/UseCases.jpg" />

<h1>Tech stack and comparison</h1>
<p>EduApp has been develop to serve as a web app, as well as a downloadable multi-platform PWA.</p>
<div >        
  <a href="https://reactjs.org">
    <img src="https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB" alt="React"/>
	</a>
</div>
     
<p>We are using ReactJS as frontend framework, React provides us many advantages, such an easier learning curve, reusable components, ReactJS is chosed by most developers because it provides us a very rich JavaScript library of utilities.</p>
<div>
  <a href="https://rubyonrails.org">
    <img src="https://img.shields.io/badge/rails-%23CC0000.svg?style=for-the-badge&logo=ruby-on-rails&logoColor=white" alt="Rails"/>
	</a>
</div>
<p>In the backend we are using Ruby On Rails, which provides us a Model-View-Controller architecture, a fast development when you know the basics of it and a great number of helpful tools and libraries. It has many disadvantages, as it has a very steep learning curve, and it takes a while for you to get used</p>

<h1 id="personal-opinion-and-comparison">Personal opinion and conclusions</h1>
<p>It is a pleasure for us be part of this project, as our first project working in with other people, overcoming this project a challenge. We found many difficulties in the journey, but we also have learned so much through it, although this it is just the beggining of the project and so much things will happen through the journey.</p>
