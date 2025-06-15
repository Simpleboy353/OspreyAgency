import React, { useState } from "react";
import { Link, useLocation, useHistory } from "react-router-dom";
import {
  MDBNavbar,
  MDBContainer,
  MDBNavbarNav,
  MDBNavbarItem,
  MDBModal,
  MDBModalDialog,
  MDBModalContent,
  MDBModalHeader,
  MDBModalBody,
  MDBModalFooter,
  MDBBtn,
} from "mdb-react-ui-kit";
import Cookies from "js-cookie";

export default function App() {
  const location = useLocation();
  const history = useHistory();

  const [logoutModalOpen, setLogoutModalOpen] = useState(false);

  const handleLogout = () => {
    Cookies.remove("userId");
    Cookies.remove("username");
    setLogoutModalOpen(false); 
    history.push("/userLogin"); 
  };

  const navItems = [
    { name: "Events", url: "/viewEvents" },
    { name: "Activities", url: "/userHome" },
    { name: "Brand Ambassadors", url: "/viewBrandAmbassador" },
    { name: "Notifications", url: "/viewNotification" },
    { name: "Membership", url: "/membership" },
    { name: "Users", url: "/viewUsers" },
    { name: "Profile", url: "/userProfile" },
  ];

  return (
    <>
      <MDBNavbar expand="lg" light style={{ backgroundColor: "#313a50" }}>
        <MDBContainer
          fluid
          className="d-flex justify-content-center"
          style={{ padding: "20px" }}
        >
          <MDBNavbarNav className="d-flex justify-content-center">
            {navItems.map((item) => (
              <MDBNavbarItem key={item.name} className="mx-2">
                <Link
                  to={item.url}
                  style={{
                    color: "white",
                    textDecoration: "none",
                    fontWeight:
                      location.pathname === item.url ? "bold" : "normal",
                    borderBottom:
                      location.pathname === item.url ? "3px solid white" : "none",
                    paddingBottom: "5px",
                  }}
                >
                  {item.name}
                </Link>
              </MDBNavbarItem>
            ))}

            {/* Logout Button */}
            <MDBNavbarItem className="mx-2">
              <button
                onClick={() => setLogoutModalOpen(true)} 
                style={{
                  background: "none",
                  border: "none",
                  color: "white",
                  cursor: "pointer",
                  fontWeight: "normal",
                  paddingBottom: "5px",
                }}
              >
                Logout
              </button>
            </MDBNavbarItem>
          </MDBNavbarNav>
        </MDBContainer>
      </MDBNavbar>

      {/* Logout Confirmation Modal */}
      <MDBModal show={logoutModalOpen} setShow={setLogoutModalOpen} tabIndex="-1">
        <MDBModalDialog>
          <MDBModalContent id="card">
            <MDBModalHeader>
              <h5>Confirm Logout</h5>
            </MDBModalHeader>
            <MDBModalBody>Are you sure you want to logout?</MDBModalBody>
            <MDBModalFooter>
              <MDBBtn color="secondary" onClick={() => setLogoutModalOpen(false)}>
                No
              </MDBBtn>
              <MDBBtn color="danger" onClick={handleLogout}>
                Yes
              </MDBBtn>
            </MDBModalFooter>
          </MDBModalContent>
        </MDBModalDialog>
      </MDBModal>
    </>
  );
}
