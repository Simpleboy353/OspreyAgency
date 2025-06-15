import React, { useEffect, useState } from "react";
import Navbar from './Navbar';
import {
  MDBCard,
  MDBCardBody,
  MDBCardTitle,
  MDBCardText,
  MDBRow,
  MDBCol,
  MDBBtn,
} from "mdb-react-ui-kit";

export default function Membership() {
  const [show, setShow] = useState(false);
  const [membership, setMembership] = useState([]);

  useEffect(() => {
    setShow(true);
    document.body.className = "light-mode";
    getData();
  }, []);

  function getData() {
    const MockMembership = [
      {
        Id: "1",
        name: "MEMBERSHIP",
        price: "$4200",
        year: 'ANNUAL',
        description:
          "Executive memberships start at $4200 a year. With 100 members onboarded by Q1 25.",
      },
      {
        Id: "2",
        name: "SPONSERSHIPS",
        price: "$5k-250k",
        year: 'ANNUAL',
        description:
          "Sponsorships designed to support the growth of businesses & brands using our high count collective following and to get our members more work whilst elevate their status alongside our sponsors.",
      },
      {
        Id: "3",
        name: "EVENTS",
        price: "$100K",
        year: 'ANNUAL',
        description:
          "We host events to showcase our members. Panels, speakers, shows and more.",
      },
      {
        Id: "4",
        name: "OSPREY AGENCY",
        price: "$500K +",
        year: 'ANNUAL',
        description:
          "OA- A female run subscription based agency for our college and talent circle.",
      },
    ];

    setMembership(MockMembership);
  }

  return (
    <div>
      <Navbar />
      <div className="container">
        <div className={` ${show ? "show" : ""}`}>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <h1
              className="dashboard"
              style={{
                textAlign: "left",
                paddingTop: "40px",
                fontWeight: "bolder",
                color: "#2c3e50",
              }}
            >
              Revenue
            </h1>
          </div>
          <p style={{ fontStyle: 'italic', color: "#7f8c8d", marginBottom: "40px" }}>
            Our model is simple. Primarily based on membership fees & sponsorships.
          </p>
          <MDBRow className="row-cols-1 row-cols-md-4 g-4" style={{ margin: "20px 0" }}>
            {membership.map((ambassador) => (
              <MDBCol key={ambassador.Id}>
                <MDBCard
                  className="h-100"
                  style={{
                    borderRadius: "15px",
                    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                    transition: "transform 0.3s ease",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
                  onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
                >
                  <MDBCardBody>
                    <MDBCardTitle
                      style={{
                        fontSize: "24px",
                        fontWeight: "bold",
                        color: "#34495e",
                        marginBottom: "20px",
                      }}
                    >
                      {ambassador.name}
                    </MDBCardTitle>
                    <MDBCardText
                      style={{
                        fontWeight: "bold",
                        color: "#e74c3c",
                        fontSize: "48px",
                        fontFamily: 'cursive',
                        marginBottom: "20px",
                      }}
                    >
                      {ambassador.price}
                    </MDBCardText>
                    <hr style={{ border: "2px solid #e74c3c", width: "100%", marginBottom: "20px" }} />
                    <MDBCardText
                      style={{
                        color: '#27ae60',
                        fontWeight: 'bold',
                        fontSize: "18px",
                        marginBottom: "20px",
                      }}
                    >
                      {ambassador.year}
                    </MDBCardText>
                    <MDBCardText
                      style={{
                        textAlign: "justify",
                        color: "#7f8c8d",
                        fontSize: "16px",
                        lineHeight: "1.6",
                      }}
                    >
                      {ambassador.description}
                    </MDBCardText>
                   
                     
                      
                    
                   
                    
                  </MDBCardBody>
                </MDBCard>
              </MDBCol>
            ))}
          </MDBRow>
        </div>
      </div>
    </div>
  );
}