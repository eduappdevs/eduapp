<div align ='center'><img src="https://camo.githubusercontent.com/88ebb3d3a22eaccf6758b9eee02d1ef1ce49230642f86da244f4270773d59004/687474703a2f2f6564756170702d70726f6a6563742e65752f77702d636f6e74656e742f75706c6f6164732f323032312f30332f4c6f676f2d4564754170702d312d313530783135302e706e67" alt="logo">
</div>

- [About the project](#about-the-project)
- [Backend](#backend-information)
- [Frontend](#frontend-information)
- [Built with](#built-with)

</div>
<h1 align='center'>About the project</h1>
<div >
     Eduapp emerges after the covid 19 pandemic ,as the answer to the challenges that this entails.
     <br/>
     It's an european project , co-funded by erasmus+ programme
     <br/>
          <h1>Partners</h1>
          <p>Fundatia Ecologica Green , Romania , Instituto Politécnico de Santarém , Portugal , Stichting Landstede , Netherlands , SOSU OSTJYLLAND , Denmark and IES El Rincón , Spain</p>
     <h1 >Objectives</h1>
          <p>Faciliate and increase the communication between school, students and teachers by developing an application , EduApp , free and open source , customised for each partner school.</p>
   </div>
  
<h1 align='center'>Backend information</h1>
<p>Eduapp has used pgAdmin as a database with postgreSQL and ruby on rails was used from the software.</p>
<h3>Diagram E/R</h3>
<div ><img src="./Diagrama/DiagramaER.png" alt="diagramER">
</div>
<h3>Diagram UML</h3>
<div ><img src="./Diagrama/DiagramaUML.png" alt="diagramUML">
</div>
<h3>Relational diagram:</h3>
<div>
    <h4>User and Annotations</h4>
    <p>Annotation(annotation_id, annotation_description, annotation_start, annotation_end )</p>
    <p>USER(user_id,name, image,rol,email,password)</p>
    <p>HAVE(user_id*, annotation_id*)</p>
    <h4>User and session</h4>
    <p>USER(user_id,name, image,rol,email,password)</p>
    <p>SESSION(session_id, session_name, date, streaming_platform, resoruces_platform, session_chat_id)</p>
    <p>PARTICIPATES(user_id*, session_id*)</p>
    <h4>User and Courser</h4>
    <p>COURSER(couser_id, courser_name, couser_participants)</p>
    <p>USER(user_id,name, image,rol,email,password)</p>
    <p>HAVE(couser_id*, user_id*)</p>
     <h4>Courser and Resources</h4>
    <p>COURSER(couser_id, courser_name, couser_participants)</p>
     <p>RESORCES(resources_id, resources_name, resources_description, id_courser*)</p>
     <h4>Resources and files</h4>
     <p>RESORCES(resources_id, resources_name, resources_description, id_courser*)</p>
     <p>FILES(files_id, files_content, id_resources*)</p>
     <h4>Courser, messages and courser chat</h4>
     <p>COURSER(couser_id, courser_name, couser_participants)</p>
     <p>MESSAGES(messages_id, writer_at, message_text, user_id)</p>
     <p>COURSER_CHAT(courser_chat_id, message_id*,chat_image,courser_name,courder_id*)</p>    
</div>

<h3>Explanation of the diagrams contents:</h3>
<p>-User table is used to register.</p>
<p>-Annotations table is used as a calendar for events to be stored.</p>
<p>-Session table is used to know when you have classes and thei information.</p>
<p>-Courser table is used to know the students of a courser.</p>
<p>-Courser chat table is used to create a chat for each courser or subject.</p>
<p>-Messages table is used to save who send the messages and the contents.</p>
<p>-Resources table are the documents or information about sessions.</p>
<p>-Files table is used to save the documents.</p>
<h3>ORM</h3>
<p></p>
<h3>How to install and run</h3>
<p> First, you must install the programs. Now you have to clone the project and used this commands.</p>
<p>To clone, use:</p>

```bash
git clone https://github.com/eduappdevs/eduapp
cd eduapp/backend/eduapp_db/
bundle install
```
<p>After using these commands, you need to look for the folder config and find database.yml, you need to change the password to the password of the pgAdmin</p>

<p>To have values in the database enter the following command:</p>

```bash
rails db:migrate
rails db:seed
```
<p>After you have followed these steps, you can start the server with:</p>

```bash
rails s
```
<p>To stop the server you have to use CTRL + C.</p>
<h1 align='center'>Frontend information:</h1>
<p>This is how eduapp started but some visual changes were made.</p>
<details >
<summary>Prototype</summary>
<div ><img src="./prototipo/eduapp-1.png" alt="prototipo">
</div>
<div ><img src="./prototipo/Eduapp-2.png" alt="prototipo">
</div>
<div ><img src="./prototipo/Eduapp-3.png" alt="prototipo">
</div>
</details>
<h3>How to install and run</h3>
<p> First, you must install the programs. Now you have to clone the project and used this commands.</p>
<p>To clone, use:</p>

```bash
git clone https://github.com/eduappdevs/eduapp
cd eduapp/frontend
npm start
```

<p>To stop the server you have to use CTRL + C.</p>

<h1 >Tech stack</h1>

<div>
    <a href="https://rubyonrails.org">
        <img src="https://img.shields.io/badge/rails-%23CC0000.svg?style=for-the-badge&logo=ruby-on-rails&logoColor=white" alt="Rails"/></a>
   </div>
  
<div >        
     <a href="https://reactjs.org">
            <img src="https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB" alt="React"/></a>
   </div>
     
<div >
       <a href="#">
            <img src="https://img.shields.io/badge/javascript-%23323330.svg?style=for-the-badge&logo=javascript&logoColor=%23F7DF1E" alt="Javascript"/>
     </a>
   </div>
     
<div >
     <a href="#">
            <img src="https://img.shields.io/badge/html5-%23E34F26.svg?style=for-the-badge&logo=html5&logoColor=white" alt="Html"/>
     </a>
   </div>
     
<div >
     <a href="#">
            <img src="https://img.shields.io/badge/Adobe%20XD-470137?style=for-the-badge&logo=Adobe%20XD&logoColor=#FF61F6" alt="AdobeXD"/>
     </a>
   </div>
     
<div >
     <a href="#">
            <img src="https://img.shields.io/badge/github-%23121011.svg?style=for-the-badge&logo=github&logoColor=white" alt="Github"/>
     </a>
   </div>
     
     
<div>
     <a href="#">
            <img src="https://img.shields.io/badge/css3-%231572B6.svg?style=for-the-badge&logo=css3&logoColor=white" alt="CSS"/>
     </a>
   </div>


<h1>User Requirements</h1>
<p>Eduapp has three type of user, it depends on the type your user has more functions or not.</p>
<h3>1.Students user are able to:</h3>
<p>View your account's calendar, resources, upcoming sessions, and chats.</p>
<h3>2.Teacher user are able to: </h3>
<p>They have the same functionality as students, but they can edit, delete, and create events in calendars, resources, and remove students from their classes.</p>
<h3>3.Secretariat user are able to: </h3>
<p>They have control over the users of their school.</p>
<h3>4.Administrator user are able to:</h3>
<p>They have the same functionality as secretariat, but they has full control over the user of the secretariat of the educational center. </p>


<h1>API Documention</h1>
<br></br>
