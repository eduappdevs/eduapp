<div align ='center'><img src="https://camo.githubusercontent.com/88ebb3d3a22eaccf6758b9eee02d1ef1ce49230642f86da244f4270773d59004/687474703a2f2f6564756170702d70726f6a6563742e65752f77702d636f6e74656e742f75706c6f6164732f323032312f30332f4c6f676f2d4564754170702d312d313530783135302e706e67" alt="logo">
</div>

- [About the project](#about-the-project)
- [How to Use](#how-to-use)
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
  
<details >
<summary>Prototype</summary>
<div ><img src="./prototipo/eduapp-1.png" alt="prototipo">
</div>
<div ><img src="./prototipo/Eduapp-2.png" alt="prototipo">
</div>
<div ><img src="./prototipo/Eduapp-3.png" alt="prototipo">
</div>
</details>
<h1>Database information</h1>
<h1>Diagram E/R</h1>
<div ><img src="./Diagrama/DiagramaER.png" alt="diagramER">
</div>
<h1>Diagram UML</h1>
<div ><img src="./Diagrama/DiagramaUML.png" alt="diagramUML">
</div>
<h1>Relational diagram</h1>
<div>
    <h3>User and Annotations</h3>
    <p>Annotation(annotation_id, annotation_description, annotation_start, annotation_end )</p>
    <p>USER(user_id,name, image,rol,email,password)</p>
    <p>HAVE(user_id*, annotation_id*)</p>
    <h3>User and session</h3>
    <p>USER(user_id,name, image,rol,email,password)</p>
    <p>SESSION(session_id, session_name, date, streaming_platform, resoruces_platform, session_chat_id)</p>
    <p>PARTICIPATES(user_id*, session_id*)</p>
    <h3>User and Courser</h3>
    <p>COURSER(couser_id, courser_name, couser_participants)</p>
    <p>USER(user_id,name, image,rol,email,password)</p>
    <p>HAVE(couser_id*, user_id*)</p>
     <h3>Courser and Resources</h3>
    <p>COURSER(couser_id, courser_name, couser_participants)</p>
     <p>RESORCES(resources_id, resources_name, resources_description, id_courser*)</p>
     <h3>Resources and files</h3>
     <p>RESORCES(resources_id, resources_name, resources_description, id_courser*)</p>
     <p>FILES(files_id, files_content, id_resources*)</p>
     <h3>Courser, messages and courser chat</h3>
     <p>COURSER(couser_id, courser_name, couser_participants)</p>
     <p>MESSAGES(messages_id, writer_at, message_text, user_id)</p>
     <p>COURSER_CHAT(courser_chat_id, message_id*,chat_image,courser_name,courder_id*)</p>    
</div>
<div>
    <p></p>
</div>
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
     
<h1 >User requirements</h1>
     <p>Login/Signup view</p>
     <h1>---Log in</h1>
     <p>------Fields</p>
     <p>---------Email</p>
     <p>---------Password</p>
     <p>---------Submit button</p>
     <h1>---Sign up</h1>
     <p>------Fields</p>
     <p>---------Email</p>
     <p>---------Password</p>
     <p>---------Password confirmation</p>
     <p>---------Submit button</p>
     
<div>
     <h1>Session view: </h1>
		<p>You can view your image and your name</p>
		<p>If you press the pencil you can edit the sessions, delete them and create new ones. Administrators have this function</p>
     <p>Next Session/Sessions:</p>
     <p>You can view the following sessions and their information such as name, time, stream site, resource site and the chat link.</p>
</div>
<div>
     <h1>Resources:</h1>
		<p>You can view </p>
		<p>If you press the pencil you can edit the sessions, delete them and create new ones. Administrators have this function</p>
     <p>Next Session/Sessions:</p>
     <p>You can view the following sessions and their information such as name, time, stream site, resource site and the chat link.</p>
</div>
  
