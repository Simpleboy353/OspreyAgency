import React, { useEffect, useState } from "react";
import Navbar from './Navbar';
const { ipcRenderer } = window.require("electron");

export default function ViewNotification() {
  const [data, setData] = useState([]);

  useEffect(() => {
    document.body.className = "light-mode";
    async function fetchAnnouncements() {
      try {
        const response = await ipcRenderer.invoke("fetchAnnouncements");
        if (response.success) {
          setData(response.announcements);
        } else {
          console.error("Failed to fetch announcements");
        }
      } catch (error) {
        console.error("Error fetching announcements:", error);
      }
    }

    fetchAnnouncements();
  }, []);

  return (
    <div>
      <Navbar />
      <div className="container">
        <h1 className="dashboard" style={{ textAlign: "left", paddingTop: "40px", fontWeight: "bolder" }}>
          View Announcements
        </h1>

        <div className="relative overflow-x-auto shadow-md sm:rounded-lg" style={{ borderRadius: "20px", marginTop: "30px" }}>
          <table className="w-full text-sm text-left text-gray">
            <thead className="uppercase" id="tablehead" style={{ padding: "10px", color: "#313a50" }}>
              <tr>
                <th scope="col" className="px-6 py-3">Sr</th>
                <th scope="col" className="px-6 py-3">Date</th>
                <th scope="col" className="px-6 py-3">Title</th>
                <th scope="col" className="px-6 py-3">Description</th>
              </tr>
            </thead>
            <tbody id="tablebody">
              {data.map((announcement, index) => (
                <tr className="border-b" key={announcement.announcementId}>
                  <th scope="row" className="px-6 py-4 font-medium whitespace-nowrap">
                    {index + 1}
                  </th>
                  <td className="px-6 py-4">{announcement.createdAt}</td>
                  <td className="px-6 py-4">{announcement.title}</td>
                  <td className="px-6 py-4">{announcement.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
