const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const net = require('net');
const db = require('./database');

let mainWindow;
const isDev = process.env.NODE_ENV === 'development';
const frontendURL = 'http://localhost:3000';

function waitForReactServer(url, callback) {
    const client = net.createConnection({ port: 3000 }, () => {
        client.end();
        callback();
    });
    client.on('error', () => {
        setTimeout(() => waitForReactServer(url, callback), 100);
    });
}

app.on('ready', () => {
    mainWindow = new BrowserWindow({
        width: 1200,
        height: 800,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            enableRemoteModule: true
        },
    });

    waitForReactServer(frontendURL, () => {
        mainWindow.loadURL(frontendURL);
    });
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

ipcMain.handle('login', (event, { username, password }) => {
    return new Promise((resolve, reject) => {
        db.get(`SELECT * FROM admin WHERE username = ?`, [username], (err, row) => {
            if (err) {
                reject({ success: false, message: 'Database error' });
            } else if (!row) {
                resolve({ success: false, message: 'User not found' });
            } else if (row.password === password) {
                resolve({ success: true, message: 'Login successful', user: row });
            } else {
                resolve({ success: false, message: 'Invalid credentials' });
            }
        });
    });
});


ipcMain.handle('userLogin', (event, { email, password }) => {
    return new Promise((resolve, reject) => {
        db.get(`SELECT * FROM user WHERE email = ?`, [email], (err, row) => {
            if (err) {
                reject({ success: false, message: 'Database error' });
            } else if (!row) {
                resolve({ success: false, message: 'User not found' });
            } else if (row.password === password) {
                resolve({ success: true, message: 'Login successful', user: row });
            } else {
                resolve({ success: false, message: 'Invalid credentials' });
            }
        });
    });
});


ipcMain.handle('addUser', async (event, userData) => {
    return new Promise((resolve) => {
        db.run(
            `INSERT INTO user (name, email, password, phoneNo, profession, hobbies, interest, image, createdAt)
             VALUES (?, ?, ?, NULL, NULL, NULL, NULL, NULL, CURRENT_TIMESTAMP)`,
            [userData.name, userData.email, userData.password],
            function (err) {
                if (err) {
                    console.error('Error inserting user:', err.message);
                    resolve({ success: false, message: 'Database error' });
                } else {
                    resolve({ success: true, message: 'User added successfully' });
                }
            }
        );
    });
});


ipcMain.handle('addActivity', async (event, activityData) => {
    return new Promise((resolve) => {
      db.run(
        `INSERT INTO activity (title, location, status, createdAt)
         VALUES (?, ?, 'Active', CURRENT_TIMESTAMP)`,  
        [activityData.title, activityData.location],
        function (err) {
          if (err) {
            console.error('Error inserting activity:', err.message);
            resolve({ success: false, message: 'Database error' });
          } else {
            resolve({ success: true, message: 'Activity added successfully' });
          }
        }
      );
    });
  });


  ipcMain.handle('addNotification', async (event, NotificationData) => {
    return new Promise((resolve) => {
        db.run(
            `INSERT INTO announcement (title, description, createdAt)
             VALUES (?, ?, CURRENT_TIMESTAMP)`,
            [NotificationData.title, NotificationData.description],
            function (err) {
                if (err) {
                    console.error('Error inserting Notification:', err.message);
                    resolve({ success: false, message: 'Database error' });
                } else {
                    resolve({ success: true, message: 'Notification added successfully' });
                }
            }
        );
    });
});
  


ipcMain.handle('addEvent', async (event, eventData) => {
    return new Promise((resolve) => {
        const { image, title, description, venue, date, status } = eventData;
        db.run(
            `INSERT INTO event (image, title, description, venue, date, status, createdAt)
             VALUES (?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)`,
            [image, title, description, venue, date, status],
            function (err) {
                if (err) {
                    console.error('Error inserting Event:', err.message);
                    resolve({ success: false, message: 'Database error' });
                } else {
                    resolve({ success: true, message: 'Event added successfully' });
                }
            }
        );
    });
});


ipcMain.handle('addAmbassador', async (event, ambassadorData) => {
    return new Promise((resolve) => {
        const { image, name, role, description } = ambassadorData;

        db.run(
            `INSERT INTO brandAmbassador (name, role, image, description, createdAt)
             VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP)`,
            [name, role, image, description],
            function (err) {
                if (err) {
                    console.error('Error inserting Ambassador:', err.message);
                    resolve({ success: false, message: 'Database error' });
                } else {
                    resolve({ success: true, message: 'Ambassador added successfully' });
                }
            }
        );
    });
});


ipcMain.handle('signUp', async (event, userData) => {
    return new Promise((resolve) => {
        const { name, email, phoneNo, profession, hobbies, interest, image, password } = userData;

        db.run(
            `INSERT INTO user (name, email, phoneNo, profession, hobbies, interest, image, password, createdAt)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)`,
            [name, email, phoneNo, profession, hobbies, interest, image, password],
            function (err) {
                if (err) {
                    console.error('Error inserting user:', err.message);
                    resolve({ success: false, message: 'Database error' });
                } else {
                    resolve({ success: true, message: 'User added successfully' });
                }
            }
        );
    });
});



// ipcMain.handle("fetchUsers", async () => {
//     return new Promise((resolve, reject) => {
//       db.all("SELECT userId, name, profession FROM user", [], (err, rows) => {
//         if (err) {
//           reject({ success: false, message: "Database error" });
//         } else {
//           resolve({ success: true, users: rows });
//         }
//       });
//     });
//   });


ipcMain.handle("fetchUsers", async (event, userId = null) => {
    return new Promise((resolve, reject) => {
      let query;
      let params;
      if (userId) {
        query = "SELECT * FROM user WHERE userId != ?";
        params = [userId];
      } else {
        query = "SELECT * FROM user";  
        params = [];
      }
      db.all(query, params, (err, rows) => {
        if (err) {
          reject({ success: false, message: "Database error" });
        } else if (rows.length > 0) {
          resolve({ success: true, users: rows });  
        } else {
          resolve({ success: false, message: userId ? "User not found" : "No users found" });
        }
      });
    });
  });
  
  


  ipcMain.handle("fetchSpecificUser", async (event, userId) => {
    return new Promise((resolve, reject) => {
      const query = "SELECT * FROM user WHERE userId = ?";
      db.get(query, [userId], (err, row) => {
        if (err) {
          reject({ success: false, message: "Database error" });
        } else if (row) {
          resolve({ success: true, SpecificUser: [row] }); 
        } else {
          resolve({ success: false, message: "User not found" });
        }
      });
    });
  });
  


  ipcMain.handle("fetchAnnouncements", async () => {
    return new Promise((resolve, reject) => {
      db.all("SELECT * FROM announcement", [], (err, rows) => {
        if (err) {
          reject({ success: false, message: "Database error" });
        } else {
          resolve({ success: true, announcements: rows });
        }
      });
    });
  });


  ipcMain.handle("fetchBrandAmbassadors", async () => {
    return new Promise((resolve, reject) => {
      db.all("SELECT * FROM brandAmbassador", [], (err, rows) => {
        if (err) {
          reject({ success: false, message: "Database error" });
        } else {
          resolve({ success: true, ambassadors: rows });
        }
      });
    });
  });

  ipcMain.handle("fetchEvents", async () => {
    return new Promise((resolve, reject) => {
      db.all(
        "SELECT * FROM event",
        [],
        (err, rows) => {
          if (err) {
            reject({ success: false, message: "Database error" });
          } else {
            resolve({ success: true, events: rows });
          }
        }
      );
    });
  });


  ipcMain.handle("fetchEventById", async (event, eventId) => {
    return new Promise((resolve, reject) => {
      db.get("SELECT * FROM event WHERE eventId = ?", [eventId], (err, row) => {
        if (err) {
          reject({ success: false, message: "Database error" });
        } else if (!row) {
          reject({ success: false, message: "Event not found" });
        } else {
          resolve({ success: true, event: row });
        }
      });
    });
  });

  ipcMain.handle("fetchActiveEvents", async () => {
    return new Promise((resolve, reject) => {
      db.all(
        "SELECT * FROM event WHERE status='Active' ",
        [],
        (err, rows) => {
          if (err) {
            reject({ success: false, message: "Database error" });
          } else {
            resolve({ success: true, events: rows });
          }
        }
      );
    });
  });
  

  ipcMain.handle("fetchActivity", async () => {
    return new Promise((resolve, reject) => {
      db.all("SELECT * FROM activity", [], (err, rows) => {
        if (err) {
          reject({ success: false, message: "Database error" });
        } else {
          resolve({ success: true, activities: rows });
        }
      });
    });
  });

  ipcMain.handle("fetchActiveActivity", async () => {
    return new Promise((resolve, reject) => {
      db.all("SELECT * FROM activity WHERE status='Active' ", [], (err, rows) => {
        if (err) {
          reject({ success: false, message: "Database error" });
        } else {
          resolve({ success: true, activities: rows });
        }
      });
    });
  });


  ipcMain.on("delete-user", (event, userId) => {
    db.run("DELETE FROM user WHERE userId = ?", [userId], function (err) {
      if (err) {
        console.error("Error deleting user:", err.message);
        return;
      }
      console.log(`User with ID ${userId} deleted successfully.`);
    });
  });

  ipcMain.on("delete-activity", (event, activityId) => {
    db.run("DELETE FROM activity WHERE activityId = ?", [activityId], function (err) {
      if (err) {
        console.error("Error deleting acivity:", err.message);
        return;
      }
      console.log(`Activity with ID ${activityId} deleted successfully.`);
    });
  });

  ipcMain.on("delete-event", (event, eventId) => {
    db.run("DELETE FROM event WHERE eventId = ?", [eventId], function (err) {
      if (err) {
        console.error("Error deleting event:", err.message);
        return;
      }
      console.log(`Event with ID ${eventId} deleted successfully.`);
    });
  });


  ipcMain.on("delete-brandAmbassador", (event, brandId) => {
    db.run("DELETE FROM brandAmbassador WHERE brandId = ?", [brandId], function (err) {
      if (err) {
        console.error("Error deleting Brand Ambassador:", err.message);
        return;
      }
      console.log(`Brand Ambassador with ID ${brandId} deleted successfully.`);
    });
  });

  ipcMain.on("delete-announcement", (event, announcementId) => {
    db.run("DELETE FROM announcement WHERE announcementId = ?", [announcementId], function (err) {
      if (err) {
        console.error("Error deleting Announcement:", err.message);
        return;
      }
      console.log(`Announcement with ID ${announcementId} deleted successfully.`);
    });
  });
  
  ipcMain.handle("get-dashboard-stats", async () => {
    return new Promise((resolve, reject) => {
      db.get(
        `
        SELECT 
          (SELECT COUNT(*) FROM user) AS usersCount,
          (SELECT COUNT(*) FROM activity) AS activitiesCount,
          (SELECT COUNT(*) FROM event) AS eventsCount,
          (SELECT COUNT(*) FROM brandAmbassador) AS brandAmbassadorCount,
          (SELECT COUNT(*) FROM announcement) AS announcementsCount
        `,
        [],
        (err, row) => {
          if (err) {
            console.error("Error fetching dashboard stats:", err.message);
            reject(err);
          } else {
            resolve(row); // Send the stats object back to the renderer
          }
        }
      );
    });
  });


  ipcMain.handle("update-credentials", async (event, { username, newUsername, newPassword }) => {
    try {
      console.log("Received credentials update:", username, newUsername, newPassword);
  
      return new Promise((resolve, reject) => {
        const query = newUsername ? 
          "UPDATE admin SET username = ?, password = ? WHERE username = ?" : 
          "UPDATE admin SET password = ? WHERE username = ?";
          
        const params = newUsername ? [newUsername, newPassword, username] : [newPassword, username];
  
        db.run(query, params, function (err) {
          if (err) {
            console.error("Error updating credentials:", err);
            reject({ success: false, message: "Error Occurred" });
          } else {
            console.log(`Credentials updated for admin with username ${username}`);
            resolve({ success: true, message: `Credentials updated for ${newUsername || username}.` });
          }
        });
      });
    } catch (error) {
      console.error("Error in update-credentials:", error);
      return { success: false, message: "An error occurred." };
    }
  });

  
  ipcMain.handle('update-activity-status', (event, { activityId, status }) => {
    return new Promise((resolve, reject) => {
      const statusValue = status === 'Active' ? 'Active' : 'Inactive'; // Ensure status matches your DB values
      
      const query = `UPDATE activity SET status = ? WHERE activityId = ?`;
      db.run(query, [statusValue, activityId], function (err) {
        if (err) {
          console.error('Database update error:', err);
          reject({ success: false, message: 'Error updating status' });
        } else {
          resolve({ success: true });
        }
      });
    });
  });

  ipcMain.handle('update-event-status', (event, { eventId, status }) => {
    return new Promise((resolve, reject) => {
      const statusValue = status === 'Active' ? 'Active' : 'Inactive'; 
      
      const query = `UPDATE event SET status = ? WHERE eventId = ?`;
      db.run(query, [statusValue, eventId], function (err) {
        if (err) {
          console.error('Database update error:', err);
          reject({ success: false, message: 'Error updating status' });
        } else {
          resolve({ success: true });
        }
      });
    });
  });


  ipcMain.handle('updateUser', async (event, userData) => {
    return new Promise((resolve) => {
        db.run(
            `UPDATE user SET name = ?, email = ?, password = ? WHERE userId = ?`,
            [userData.name, userData.email, userData.password, userData.id],
            function (err) {
                if (err) {
                    console.error('Error updating user:', err.message);
                    resolve({ success: false, message: 'Database error' });
                } else {
                    resolve({ success: true, message: 'User updated successfully' });
                }
            }
        );
    });
});


ipcMain.handle('updateBrandAmbassador', async (event, ambassadorData) => {
  return new Promise((resolve) => {
      // Fetch the existing image if no new image is provided
      db.get(`SELECT image FROM brandAmbassador WHERE brandId = ?`, [ambassadorData.id], (err, row) => {
          if (err) {
              console.error('Error fetching existing image:', err.message);
              resolve({ success: false, message: 'Database error' });
              return;
          }

          const existingImage = row ? row.image : null;
          const imageToUpdate = ambassadorData.image || existingImage; // Use new image if provided, otherwise keep the old one

          db.run(
              `UPDATE brandAmbassador 
               SET name = ?, role = ?, image = ?, description = ? 
               WHERE brandId = ?`,
              [ambassadorData.name, ambassadorData.role, imageToUpdate, ambassadorData.description, ambassadorData.id],
              function (updateErr) {
                  if (updateErr) {
                      console.error('Error updating brand ambassador:', updateErr.message);
                      resolve({ success: false, message: 'Database error' });
                  } else {
                      resolve({ success: true, message: 'Brand Ambassador updated successfully' });
                  }
              }
          );
      });
  });
});


ipcMain.handle('updateEvent', async (event, eventData) => {
  return new Promise((resolve) => {
      // Fetch the existing image if no new image is provided
      db.get(`SELECT image FROM event WHERE eventId = ?`, [eventData.id], (err, row) => {
          if (err) {
              console.error('Error fetching existing image:', err.message);
              resolve({ success: false, message: 'Database error' });
              return;
          }

          const existingImage = row ? row.image : null;
          const imageToUpdate = eventData.image || existingImage; // Use new image if provided, otherwise keep the old one

          db.run(
              `UPDATE event 
               SET title = ?, image = ?, description = ?, venue = ?, date = ? 
               WHERE eventId = ?`,
              [eventData.title, imageToUpdate, eventData.description, eventData.venue, eventData.date, eventData.id],
              function (updateErr) {
                  if (updateErr) {
                      console.error('Error updating event:', updateErr.message);
                      resolve({ success: false, message: 'Database error' });
                  } else {
                      resolve({ success: true, message: 'Event updated successfully' });
                  }
              }
          );
      });
  });
});


ipcMain.handle('updateActivity', async (event, activityData) => {
  return new Promise((resolve) => {
      db.run(
          `UPDATE activity SET title = ?, location = ? WHERE activityId = ?`,
          [activityData.title, activityData.location, activityData.id],
          function (err) {
              if (err) {
                  console.error('Error updating Activity:', err.message);
                  resolve({ success: false, message: 'Database error' });
              } else {
                  resolve({ success: true, message: 'Activity updated successfully' });
              }
          }
      );
  });
});

ipcMain.handle("getLoggedInUser", async (event, Id) => {
  return new Promise((resolve, reject) => {
    db.get(
      "SELECT userId FROM user WHERE userId = ?",
      [Id],
      (err, row) => {
        if (err) {
          console.error("Error fetching logged-in user:", err);
          resolve({ success: false });
        } else {
          resolve({ success: true, user: row || null });
        }
      }
    );
  });
});


ipcMain.handle("insertEventApplication", async (event, { eventId, userId, isattending, feedback }) => {
  return new Promise((resolve, reject) => {
    db.get(
      `SELECT * FROM eventApplication WHERE eventId = ? AND userId = ?`,
      [eventId, userId],
      (err, row) => {
        if (err) {
          console.error("Error checking event application:", err);
          resolve({ success: false });
          return;
        }

        if (row) {
          db.run(
            `UPDATE eventApplication SET isattending = ?, feedback = ? WHERE eventId = ? AND userId = ?`,
            [isattending, feedback, eventId, userId],
            function (updateErr) {
              if (updateErr) {
                console.error("Error updating event application:", updateErr);
                resolve({ success: false });
              } else {
                resolve({ success: true, updated: true });
              }
            }
          );
        } else {
          db.run(
            `INSERT INTO eventApplication (eventId, userId, isattending, feedback) VALUES (?, ?, ?, ?)`,
            [eventId, userId, isattending, feedback],
            function (insertErr) {
              if (insertErr) {
                console.error("Error inserting event application:", insertErr);
                resolve({ success: false });
              } else {
                resolve({ success: true, inserted: true });
              }
            }
          );
        }
      }
    );
  });
});


ipcMain.handle("fetchAttendingEvent", async (event, userId) => {
  return new Promise((resolve, reject) => {
    const query = `
      SELECT e.*, ep.feedback, ep.isattending 
      FROM eventApplication ep 
      JOIN event e ON ep.eventId = e.eventId 
      WHERE ep.isattending='Attending' AND ep.userId = ?
    `;
    db.all(query, [userId], (err, rows) => {
      if (err) {
        reject({ success: false, message: "Database error" });
      } else {
        resolve({ success: true, attendingEvent: rows });
      }
    });
  });
});


ipcMain.handle("submitFeedback", async (event, { eventId, userId, feedback }) => {
  try {
    const result = await db.run(
      `UPDATE eventApplication SET feedback = ? WHERE eventId = ? AND userId = ?`,
      [feedback, eventId, userId]
    );
    return { success: true, message: "Feedback Given" };
  } catch (error) {
    console.error("Error submitting feedback:", error);
    return { success: false, message: error.message };
  }
});



ipcMain.handle("fetchEventAttendees", async (event, id) => {
  try {
    const attendees = await new Promise((resolve, reject) => {
      db.all(
        `SELECT u.name, u.email, u.image, ea.feedback
        FROM eventApplication ea
        JOIN user u ON ea.userId = u.userId
        WHERE ea.eventId = ? AND ea.isattending = 'Attending'`,
        [id],
        (err, rows) => {
          if (err) {
            console.error("Error running SELECT query:", err.message);
            reject(err);
          } else {
            console.log("Fetched Attendees:", rows); // Log the fetched rows
            resolve(rows);
          }
        }
      );
    });

    return { success: true, attendees }; 
  } catch (error) {
    console.error("Error fetching event attendees:", error);
    return { success: false, message: error.message };
  }
});

ipcMain.handle("insertActivityApplication", async (event, { activityId, userId, description }) => {
  return new Promise((resolve, reject) => {
    db.get(
      `SELECT * FROM activityApplication WHERE activityId = ? AND userId = ?`,
      [activityId, userId],
      (err, row) => {
        if (err) {
          console.error("Error checking activity application:", err);
          resolve({ success: false });
          return;
        }

        if (row) {
          db.run(
            `UPDATE activityApplication SET description = ? WHERE activityId = ? AND userId = ?`,
            [description, activityId, userId],
            function (updateErr) {
              if (updateErr) {
                console.error("Error updating activity application:", updateErr);
                resolve({ success: false });
              } else {
                resolve({ success: true, updated: true });
              }
            }
          );
        } else {
          db.run(
            `INSERT INTO activityApplication (activityId, userId, description) VALUES (?, ?, ?)`,
            [activityId, userId, description],
            function (insertErr) {
              if (insertErr) {
                console.error("Error inserting activity application:", insertErr);
                resolve({ success: false });
              } else {
                resolve({ success: true, inserted: true });
              }
            }
          );
        }
      }
    );
  });
});


ipcMain.handle("fetchUserAppliedActivities", async (event, userId) => {
  try {
      const activities = await new Promise((resolve, reject) => {
          db.all(
              `SELECT aa.activityId, a.title, a.location, aa.description
               FROM activityApplication aa
               JOIN activity a ON aa.activityId = a.activityId
               WHERE aa.userId = ?`,
              [userId],
              (err, rows) => {
                  if (err) reject(err);
                  else resolve(rows);
              }
          );
      });

      return { success: true, activities };
  } catch (error) {
      console.error("Error fetching applied activities:", error);
      return { success: false };
  }
});


ipcMain.handle("fetchActivityAttendees", async (event, id) => {
  try {
    const attendees = await new Promise((resolve, reject) => {
      db.all(
        `SELECT u.name, u.email, u.image, aa.description
        FROM activityApplication aa
        JOIN user u ON aa.userId = u.userId
        WHERE aa.activityId = ?`,
        [id],
        (err, rows) => {
          if (err) {
            console.error("Error running SELECT query:", err.message);
            reject(err);
          } else {
            console.log("Fetched Attendees:", rows); 
            resolve(rows);
          }
        }
      );
    });

    return { success: true, attendees }; 
  } catch (error) {
    console.error("Error fetching activity attendees:", error);
    return { success: false, message: error.message };
  }
});



ipcMain.handle('updateUserProfile', async (event, userData) => {
  return new Promise((resolve) => {
      db.get(`SELECT image FROM user WHERE userId = ?`, [userData.id], (err, row) => {
          if (err) {
              console.error('Error fetching existing user image:', err.message);
              resolve({ success: false, message: 'Database error' });
              return;
          }

          const existingImage = row ? row.image : null;
          const imageToUpdate = userData.image || existingImage; 

          db.run(
              `UPDATE user 
               SET name = ?, email = ?, phoneNo = ?, profession = ? , hobbies = ? , interest = ? , image = ? 
               WHERE userId = ?`,
              [userData.name, userData.email, userData.phoneNo,userData.profession, userData.hobbies ,userData.interest, imageToUpdate, userData.id],
              function (updateErr) {
                  if (updateErr) {
                      console.error('Error updating user:', updateErr.message);
                      resolve({ success: false, message: 'Database error' });
                  } else {
                      resolve({ success: true, message: 'User updated successfully' });
                  }
              }
          );
      });
  });
});









  



  






  
  



  




  




