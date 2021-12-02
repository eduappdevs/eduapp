import React, { Component, useEffect, useState } from "react";
import "./openedResource.css";
import axios from "axios";
export default function OpenedResource(props) {
  const [id, setId] = useState(props.data.id);
  const [name, setName] = useState(props.data.name);
  const [description, setDescription] = useState(props.data.description);
  const deleteResource = (id) => {
    axios
      .delete(`http://localhost:3000/resources/${id}`)
      .then((res) => console.log, window.location.reload())
      .catch((err) => console.log);
  };
  const editResource = (id) => {
    console.log(id);
  };
  const closeResource = () => {
    document
      .getElementById("resource__res" + id + "__opened")
      .classList.add("openedResource__hidden");
  };

  return (
    <div
      id={"resource__res" + id + "__opened"}
      className={"openedResource__main-container openedResource__hidden"}
    >
      <div className="resourceOpened__header">
        <div className="resourceOpened__backToResources">
          <div
            className="resourceOpened__backToResources__container"
            onClick={closeResource}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              class="bi bi-caret-left-fill"
              viewBox="0 0 16 16"
            >
              <path d="m3.86 8.753 5.482 4.796c.646.566 1.658.106 1.658-.753V3.204a1 1 0 0 0-1.659-.753l-5.48 4.796a1 1 0 0 0 0 1.506z" />
            </svg>
          </div>
        </div>
        <div className="resourceOpened__name">
          <h1>{name}</h1>
        </div>
        <div className="resourceOpened__buttons">
          <div
            className="resources__editButton"
            onClick={() => {
              editResource(id);
            }}
          >
            {window.matchMedia("(max-width: 1100px)").matches ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                x="0px"
                y="0px"
                width="24"
                height="24"
                viewBox="0 0 24 24"
              >
                {" "}
                <path d="M 18.414062 2 C 18.158062 2 17.902031 2.0979687 17.707031 2.2929688 L 15.707031 4.2929688 L 14.292969 5.7070312 L 3 17 L 3 21 L 7 21 L 21.707031 6.2929688 C 22.098031 5.9019687 22.098031 5.2689063 21.707031 4.8789062 L 19.121094 2.2929688 C 18.926094 2.0979687 18.670063 2 18.414062 2 z M 18.414062 4.4140625 L 19.585938 5.5859375 L 18.292969 6.8789062 L 17.121094 5.7070312 L 18.414062 4.4140625 z M 15.707031 7.1210938 L 16.878906 8.2929688 L 6.171875 19 L 5 19 L 5 17.828125 L 15.707031 7.1210938 z"></path>
              </svg>
            ) : (
              "Edit this"
            )}
          </div>

          <div
            className="resources__deleteButton"
            onClick={() => {
              deleteResource(id);
            }}
          >
            {window.matchMedia("(max-width: 1100px)").matches ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                x="0px"
                y="0px"
                width="24"
                height="24"
                viewBox="0 0 24 24"
              >
                <path d="M 10 2 L 9 3 L 5 3 C 4.4 3 4 3.4 4 4 C 4 4.6 4.4 5 5 5 L 7 5 L 17 5 L 19 5 C 19.6 5 20 4.6 20 4 C 20 3.4 19.6 3 19 3 L 15 3 L 14 2 L 10 2 z M 5 7 L 5 20 C 5 21.1 5.9 22 7 22 L 17 22 C 18.1 22 19 21.1 19 20 L 19 7 L 5 7 z M 9 9 C 9.6 9 10 9.4 10 10 L 10 19 C 10 19.6 9.6 20 9 20 C 8.4 20 8 19.6 8 19 L 8 10 C 8 9.4 8.4 9 9 9 z M 15 9 C 15.6 9 16 9.4 16 10 L 16 19 C 16 19.6 15.6 20 15 20 C 14.4 20 14 19.6 14 19 L 14 10 C 14 9.4 14.4 9 15 9 z"></path>
              </svg>
            ) : (
              "Delete this"
            )}
          </div>
        </div>
      </div>
      <div className="resourceOpened__description">
        <h1>Description</h1>
        <p>{description}</p>
      </div>
      <div className="resourceOpened__files">
        <h1>Files</h1>
        <ul>
          <li>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Qui,
            accusamus ullam voluptates vel libero, explicabo earum quos modi
            nulla debitis rem porro eos fugiat asperiores tempore temporibus cum
            dolorum optio.
          </li>
          <li>
            Unde qui necessitatibus, rem atque pariatur magnam officia similique
            aliquam nihil cupiditate dolorum nesciunt facilis voluptas eligendi
            omnis possimus ratione placeat ex iusto illum. Sint mollitia alias
            molestias distinctio cum!
          </li>
          <li>
            Odio iure laudantium eius illum fugit optio? Hic iste quod modi
            facere rem culpa exercitationem voluptas maiores iusto voluptates,
            dolorem perferendis illo quos dolore animi explicabo, laborum
            excepturi aspernatur perspiciatis.
          </li>
          <li>
            Odio earum id vel voluptatum ad quasi dolores numquam! Neque
            asperiores, iusto nam enim libero ad provident suscipit ex excepturi
            sunt aut eos. Et incidunt, non at repudiandae temporibus voluptatum.
          </li>
          <li>
            Facilis laudantium error cumque minima temporibus obcaecati officia
            quam dignissimos, aliquid, nemo rerum ducimus dolor accusantium quo
            exercitationem quasi, nam velit magnam magni eligendi assumenda
            facere sit reiciendis! Quibusdam, illo.
          </li>
          <li>
            Beatae vitae eius modi optio facilis libero, atque similique eveniet
            tempore numquam, quaerat deleniti soluta obcaecati fugiat iste
            doloremque dolore, odio perspiciatis. Saepe excepturi laboriosam
            cupiditate dolore, eveniet natus tempore.
          </li>
          <li>
            Pariatur doloribus dicta expedita provident autem mollitia, aliquam
            quibusdam placeat tenetur quod? Quaerat iusto ullam itaque autem
            eius atque ipsum perferendis placeat quo vel. Est eius
            necessitatibus beatae eveniet ratione.
          </li>
          <li>
            Nostrum, recusandae nam praesentium voluptates aut quidem reiciendis
            dolor sit, consectetur maxime expedita veritatis iste magni vel
            maiores, alias culpa ex dolores sed. Eaque repellat obcaecati nobis
            voluptate cum. Quas.
          </li>
          <li>
            Iure saepe officiis nesciunt magni. Commodi, eveniet. Autem quo sunt
            dolores. Delectus, autem repellendus asperiores vel explicabo eius
            laborum esse aliquid exercitationem vitae eligendi repellat itaque,
            nemo ipsa necessitatibus corrupti.
          </li>
          <li>
            Laudantium labore repellendus voluptas, culpa quos unde? Nemo
            perferendis cumque aspernatur nesciunt odio incidunt fuga mollitia,
            sequi temporibus? Consequuntur totam aliquam numquam ex dignissimos
            illo saepe nemo itaque incidunt. Suscipit!
          </li>
          <li>
            Enim quaerat quis ea eius corrupti unde excepturi quibusdam, quasi
            ullam repudiandae dolor quo ad, soluta beatae possimus? Nesciunt
            optio omnis asperiores, eaque sequi excepturi consequuntur neque
            animi explicabo laudantium!
          </li>
          <li>
            Fugiat nihil nulla deleniti temporibus iusto eos, at obcaecati
            animi, doloribus facilis cumque hic beatae nostrum doloremque earum
            reprehenderit nemo facere sapiente voluptatum, eius id nisi. Ab
            tenetur assumenda fuga.
          </li>
          <li>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Quia iste
            velit provident explicabo vitae odit dolor, sapiente iusto eum nihil
            repudiandae esse accusamus voluptates incidunt minus molestias at
            distinctio ipsa.
          </li>
          <li>
            Aliquam, impedit dolorum quibusdam aut eum consectetur illum sunt
            totam quod iusto culpa veniam, voluptates quisquam id voluptatum
            aliquid pariatur architecto at? Sint et atque autem dicta accusamus,
            repellendus maxime.
          </li>
          <li>
            Quam ipsam asperiores repellat harum unde corrupti doloremque
            tempore, delectus, deleniti dolores rerum quaerat dicta sit! Quos
            maiores atque recusandae optio cum delectus nulla, quam assumenda
            excepturi molestias temporibus eius.
          </li>
          <li>
            Eaque sunt unde possimus minima dicta, commodi cumque error
            voluptatum veritatis vitae cupiditate nesciunt dolores similique,
            quae voluptatem iste libero? Inventore eum quis eius tempora
            excepturi ducimus voluptate quos ea!
          </li>
          <li>
            Soluta eius cupiditate totam, praesentium amet reiciendis atque illo
            doloribus. Quas nulla, doloribus, expedita impedit animi, officiis
            cupiditate atque porro eaque error aut at quidem ea. Qui omnis
            exercitationem iusto?
          </li>
          <li>
            Ducimus tempore veritatis minus vel aspernatur, odit sed!
            Voluptates, laborum possimus voluptatum, sequi corrupti cumque, ab
            mollitia libero enim debitis eaque asperiores sed ducimus excepturi
            culpa expedita magnam facilis est?
          </li>
          <li>
            Eligendi pariatur voluptate voluptatum quidem quia. Commodi ipsum
            officiis soluta fugiat architecto doloremque corporis
            necessitatibus, assumenda sunt! Accusamus necessitatibus veniam
            sequi aliquam alias maxime laborum. Laborum quaerat consequuntur
            quia harum!
          </li>
          <li>
            In qui error exercitationem perspiciatis natus et, distinctio optio,
            vero animi autem dignissimos ipsam labore illum, ex voluptatem
            necessitatibus veritatis soluta voluptate quibusdam veniam debitis
            odio tenetur officiis rerum. Eveniet?
          </li>
          <li>
            Fuga porro enim nisi commodi eveniet dolorum totam placeat officiis
            vitae. Accusamus voluptates eum, quasi asperiores ipsa tempore
            quibusdam similique error animi quidem nulla, dolorum in non sit,
            consequuntur tenetur.
          </li>
          <li>
            Voluptas iusto delectus quasi a perspiciatis rem illum facilis porro
            maxime amet sunt repellendus omnis, doloribus aspernatur corporis
            eveniet, quaerat vel totam dolore, earum quam libero tempore autem
            et. Accusantium.
          </li>
          <li>
            Adipisci placeat itaque officiis exercitationem laudantium
            reprehenderit qui rem eos. Laudantium nihil velit voluptate ullam
            quisquam nulla, pariatur sunt minus, vel exercitationem maiores
            fugit quam! Deleniti iure fugit ad eaque.
          </li>
          <li>
            Officia harum consectetur obcaecati quod laudantium fugit modi a
            pariatur soluta quam eligendi delectus quo amet minima incidunt,
            reiciendis magni nihil cum aliquam? Commodi iure dicta adipisci
            omnis deleniti explicabo!
          </li>
        </ul>
      </div>
    </div>
  );
}
