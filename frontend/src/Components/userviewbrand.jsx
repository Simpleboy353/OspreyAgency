
import React, { useEffect, useState } from "react";
import {
  MDBCard,
  MDBCardImage,
  MDBCardBody,
  MDBCardTitle,
  MDBCardText,
  MDBCol,
  MDBRow,
} from "mdb-react-ui-kit";
import Navbar from './Navbar';

const { ipcRenderer } = window.require("electron");

export default function UserViewbrand() {
  const [show, setShow] = useState(false);
  const [brand, setBrand] = useState([]);

  useEffect(() => {
    setShow(true);
    document.body.className = "light-mode";
    fetchBrandAmbassadors();
  }, []);

  async function fetchBrandAmbassadors() {
    try {
      const response = await ipcRenderer.invoke("fetchBrandAmbassadors");
      if (response.success) {
        setBrand(response.ambassadors);
      } else {
        console.error("Failed to fetch brand ambassadors");
      }
    } catch (error) {
      console.error("Error fetching brand ambassadors:", error);
    }
  }

  return (
    <div>
      <Navbar />
      <div className="container">
        <h1
          className="dashboard"
          style={{
            textAlign: "left",
            paddingTop: "40px",
            fontWeight: "bolder",
          }}
        >
          View Brand Ambassadors
        </h1>
        <MDBRow className="row-cols-1 row-cols-md-3 g-4" style={{ marginTop: "10px", marginBottom: "10px" }}>
          {brand.map((b) => (
            <MDBCol key={b.brandId}>
              <MDBCard className="h-100" style={{ borderRadius: "10px" }} id="card">
                <center>
                  <MDBCardImage
                    src={b.image ? `data:image/png;base64,${b.image}` : "../Assets/user.png"}
                    position="top"
                    style={{
                      borderRadius: "10px",
                      height: "300px",
                      width: "300px",
                      padding: "20px",
                    }}
                  />
                </center>
                <MDBCardBody>
                  <MDBCardTitle style={{ fontSize: "20px" }}>{b.name}</MDBCardTitle>
                  <MDBCardText style={{ fontWeight: "bold", color: "#386bc0" }}>{b.role}</MDBCardText>
                  <MDBCardText style={{ textAlign: "justify", marginTop: "-10px" }}>{b.description}</MDBCardText>
                </MDBCardBody>
              </MDBCard>
            </MDBCol>
          ))}
        </MDBRow>
      </div>
    </div>
  );
}

