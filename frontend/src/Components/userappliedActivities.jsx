import React, { useState, useEffect } from "react";
import Navbar from './Navbar';
import Cookies from "js-cookie";

const { ipcRenderer } = window.require("electron");

export default function UserAppliedActivities() {
    const [appliedActivities, setAppliedActivities] = useState([]);
    const userId = Cookies.get("userId");

    useEffect(() => {
        document.body.className = "light-mode";
        fetchAppliedActivities(userId);
    }, [userId]);

    async function fetchAppliedActivities(userId) {
        try {
            const response = await ipcRenderer.invoke("fetchUserAppliedActivities", userId);
            if (response.success) {
                setAppliedActivities(response.activities);
            } else {
                console.error("Failed to fetch applied activities");
            }
        } catch (error) {
            console.error("Error fetching applied activities:", error);
        }
    }

    return (
        <div>
            <Navbar />
            <div className="container">
                <div className="sidecol3">
                    <h1 className="dashboard" style={{ textAlign: "left", paddingTop: "40px", fontWeight: "bolder" }}>
                        Applied Activities
                    </h1>

                    <div className="relative overflow-x-auto shadow-md sm:rounded-lg" style={{ borderRadius: "20px", marginTop: "30px" }}>
                        <table className="w-full text-sm text-left text-gray">
                            <thead className="uppercase" id="tablehead" style={{ padding: "10px", color: "#313a50" }}>
                                <tr>
                                    <th scope="col" className="px-6 py-3">Sr</th>
                                    <th scope="col" className="px-6 py-3">Title</th>
                                    <th scope="col" className="px-6 py-3">Location</th>
                                    <th scope="col" className="px-6 py-3">YourParticipation</th>
                                </tr>
                            </thead>
                            <tbody id="tablebody">
                                {appliedActivities.length > 0 ? (
                                    appliedActivities.map((activity, index) => (
                                        <tr className="border-b" key={activity.activityId}>
                                            <th scope="row" className="px-6 py-4 font-medium whitespace-nowrap">{index + 1}</th>
                                            <td className="px-6 py-4">{activity.title}</td>
                                            <td className="px-6 py-4">{activity.location}</td>
                                            <td className="px-6 py-4">{activity.description}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="4" className="px-6 py-4 text-center">No activities applied yet.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}

