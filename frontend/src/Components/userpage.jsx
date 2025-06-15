import React, { useEffect, useState } from "react";
import {
  MDBCard,
  MDBCardBody,
  MDBCardTitle,
  MDBCardText,
  MDBRow,
  MDBCol,
} from "mdb-react-ui-kit";
import Navbar from "./Navbar";
import Cookies from "js-cookie";

const { ipcRenderer } = window.require("electron");

export default function ViewUsers() {
  const [show, setShow] = useState(false);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    setShow(true);
    document.body.className = "light-mode";
    getData();
  }, []);

  async function getData() {
    try {
      const userId = Cookies.get("userId"); 
      if (userId) {
      const result = await ipcRenderer.invoke("fetchUsers",userId);
      if (result.success) {
        setUsers(result.users);
      } else {
        console.error("No userId found in cookies");
      }
    }
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  }

  return (
    <div>
      <Navbar />
      <div className="container">
        <div className="row">
          <div className="sidecol3">
            <div className={` ${show ? "show" : ""}`}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <h1
                  className="dashboard"
                  style={{
                    textAlign: "left",
                    paddingTop: "40px",
                    fontWeight: "bolder",
                  }}
                >
                  View Users
                </h1>
              </div>
              <MDBRow
                className="row-cols-1 row-cols-md-3 g-4"
                style={{ margin: "20px" }}
              >
                {users.map((user) => (
                  <MDBCol key={user.userId}>
                    <MDBCard className="h-100" style={{ borderRadius: "10px" }} id="card">
                      <MDBCardBody>
                        <MDBCardTitle style={{ fontSize: "25px", color: "green" }}>
                          {user.name}
                        </MDBCardTitle>
                        <MDBCardText style={{ textAlign: "center" }}>
                          {user.profession || "No profession added"}
                        </MDBCardText>
                        <MDBCardText style={{ textAlign: "justify" }}>
                          <span style={{color:'darkblue', fontWeight:'bold'}}>Hobbies: </span>{user.hobbies || "No Hobbies added"}
                        </MDBCardText>
                        <MDBCardText style={{ textAlign: "justify", marginTop:'-15px' }}>
                        <span style={{color:'darkblue', fontWeight:'bold'}}>Interest: </span>{user.interest || "No profession added"}
                        </MDBCardText>
                      </MDBCardBody>
                    </MDBCard>
                  </MDBCol>
                ))}
              </MDBRow>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

