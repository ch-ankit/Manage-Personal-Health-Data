import React from "react";
import Ankit from "./images/ankit.jpg";
import Nischal from "./images/nischal.jpg";
import Babin from "./images/babin.jpg";
import Nabin from "./images/Nabin.jpg";
import "./About.css";
import Header from "./Nav";

function AboutUs(props) {
  return (
    <div>
      <Header aboutUs={true} />
      <div class="bg-light">
        <div class="container ">
          <div class="row h-100 align-items-center py-5">
            <div class="col-lg-6">
              <h2 class="jumbotron">Managing Personal Health Data</h2>
              <p class="lead text mb-0" style={{wordSpacing:"0.3em",textAlign:"center", fontSize:"1.3em",padding:"1em 1em"}}>
                {" "}
                <i style={{textAlign:"center"}}>
                  A place to digitize your health<br></br>
                </i>{" "}
                MPHD is a FHIR based web pplication that stores the pdf format
                of your health data. The document is scanned and categortized
                under different heading. You can acess your medical record as
                per timeline,body system,type of reports and other various
                factors are considered for categorization. Also you can get a
                list of all the medicines that you have consumed till now.
              </p>
              <p class="lead text-muted" style={{fontSize:"1.2em",textAlign:"center"}}>
                {" "}
                Visit our web application:
                <a href="/" class="text">
                  <u>MPHD</u>
                </a>
              </p>
            </div>
            <div class="col-lg-6 d-none d-lg-block">
              <img
                src="https://res.cloudinary.com/mhmd/image/upload/v1556834136/illus_kftyh4.png"
                alt=""
                class="img-fluid"
              />
            </div>
          </div>
        </div>
      </div>
      <section id="team" class="pb-5 white-section">
        <div class="container1">
          <h5 class="section-title h1" style={{fontSize:"1.4em"}}>OUR TEAM</h5>
          <div class="row">
            <div class="content">
              <div
                class="image-flip"
                ontouchstart="this.classList.toggle('hover');"
              >
                <div class="mainflip">
                  <div class="frontside">
                    <div class="card">
                      <div class="card-body text-center" style={{textAlign:"center"}}>
                        <p>
                          <img
                            class=" img-fluid"
                            src={Nischal}
                            alt="card image"
                          />
                        </p>
                        <h4 class="card-title">Nischal Bhandari</h4>
                        <h6 class="card-subtitle mb-2 text-muted">
                          Backend Developer
                        </h6>
                        <p class="card-text">.....................</p>
                      </div>
                    </div>
                  </div>
                  <div class="backside">
                    <div class="card">
                      <div class="card-body text-center mt-4" style={{textAlign:"center"}}>
                        <h4 class="card-title">Nischal Bhandari</h4>
                        <p class="card-text">
                          He has worked on backend and database.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="cotent">
              <div
                class="image-flip"
                ontouchstart="this.classList.toggle('hover');"
              >
                <div class="mainflip">
                  <div class="frontside">
                    <div class="card">
                      <div class="card-body text-center" style={{textAlign:"center"}}>
                        <p>
                          <img
                            class=" img-fluid"
                            src={Nabin}
                            alt="card image"
                          />
                        </p>
                        <h4 class="card-title">Nabin Ghimire</h4>
                        <h6 class="card-subtitle mb-2 text-muted">
                          Backend Developer
                        </h6>
                        <p class="card-text">.....................</p>
                      </div>
                    </div>
                  </div>
                  <div class="backside">
                    <div class="card">
                      <div class="card-body text-center mt-4" style={{textAlign:"center"}}>
                        <h4 class="card-title">Nabin Ghimire</h4>
                        <p class="card-text">
                          He has worked on socket and chat application.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="cotent">
              <div
                class="image-flip"
                ontouchstart="this.classList.toggle('hover');"
              >
                <div class="mainflip">
                  <div class="frontside">
                    <div class="card">
                      <div class="card-body text-center" style={{textAlign:"center"}}>
                        <p>
                          <img
                            class=" img-fluid"
                            src={Ankit}
                            alt="card image"
                          />
                        </p>
                        <h4 class="card-title">Ankit khatiwada</h4>
                        <h6 class="card-subtitle mb-2 text-muted">
                          Frontend Developer
                        </h6>
                        <p class="card-text">...................</p>
                      </div>
                    </div>
                  </div>
                  <div class="backside">
                    <div class="card">
                      <div class="card-body text-center mt-4" style={{textAlign:"center"}}>
                        <h4 class="card-title">Ankit khatiwada</h4>
                        <p class="card-text ">
                          He has worked on frontend mainly focusing on Gift
                          Store and the admin pannel.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="cotent">
              <div
                class="image-flip"
                ontouchstart="this.classList.toggle('hover');"
              >
                <div class="mainflip">
                  <div class="frontside">
                    <div class="card">
                      <div class="card-body text-center" style={{textAlign:"center"}}>
                        <p>
                          <img
                            class=" img-fluid"
                            src={Babin}
                            alt="card image"
                          />
                        </p>
                        <h4 class="card-title">Babin Khatri</h4>
                        <h6 class="card-subtitle mb-2 text-muted">
                          Frontend Developer
                        </h6>
                        <p class="card-text">.....................</p>
                      </div>
                    </div>
                  </div>
                  <div class="backside">
                    <div class="card">
                      <div class="card-body text-center mt-4" style={{textAlign:"center"}}>
                        <h4 class="card-title">Babin Khatri</h4>
                        <p class="card-text">
                          He has worked on wonderful frontend designs on the
                          user side and host side
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <h2 class="text-center bg-success">What our customers say</h2>
      <div
        id="myCarousel"
        class="carousel slide text-center"
        data-ride="carousel"
      >
        <div class="carousel-inner" role="listbox">
          <div class="item active">
            <h4>
              "This web application is the best. I am so happy with the work and
              easiness!"
              <br />
              <span>-Pratik Gauchan, User</span>
            </h4>
          </div>
          <div class="item active" >
            <h4>
              "One word... WOW!! The work on party palace interface is simple
              and easy"
              <br />
              <span>-Alfa House, Host</span>
            </h4>
          </div>
        </div>
      </div>
      <div class="bg-white py-5">
        <div class="container py-5">
          <div class="row align-items-center mb-5">
            <div class="significance">
              <i class="fa fa-bar-chart fa-2x mb-3 text-primary"></i>
              <h2 class="font-weight-light">Significance</h2>
              <div class="significance__content">
                <p>
                Our application generally focuses on organizing online weddings
                and providing a common platform for users, party palace and
                bands</p>
                <a href="/" class="btn btn-light px-5 rounded-pill shadow-sm">
                Learn More
              </a>
              </div>
            </div>
            <div class="col-lg-5 px-5 mx-auto order-1 order-lg-2">
              <img
                src="https://res.cloudinary.com/mhmd/image/upload/v1556834139/img-1_e25nvh.jpg"
                alt=""
                class="img-fluid mb-4 mb-lg-0"
              />
            </div>
          </div>
          <div class="row align-items-center">
            <div class="col-lg-5 px-5 mx-auto">
              <img
                src="https://res.cloudinary.com/mhmd/image/upload/v1556834136/img-2_vdgqgn.jpg"
                alt=""
                class="img-fluid mb-4 mb-lg-0"
              />
            </div>
            <div class="features">
              <i class="fa fa-leaf fa-2x mb-3 text-primary"></i>
              <h2 class="font-weight-light">Features</h2>
              <p class="features__content">
                {" "}
                Apart from the above features our application also provides a
                platform for an online giftstore to purchase gifts for the
                invited events.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AboutUs;
