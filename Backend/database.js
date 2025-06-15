// const sqlite3 = require('sqlite3').verbose();
// const path = require('path');

// const dbPath = path.join(__dirname, 'app.db');
// const db = new sqlite3.Database(dbPath, (err) => {
//     if (err) {
//         console.error('Error connecting to SQLite:', err.message);
//     } else {
//         console.log('Connected to SQLite database at', dbPath);

//         db.run(`CREATE TABLE IF NOT EXISTS admin (
//             id INTEGER PRIMARY KEY AUTOINCREMENT,
//             username TEXT UNIQUE NOT NULL,
//             password TEXT NOT NULL
//         )`, (err) => {
//             if (err) {
//                 console.error('Error creating Admin table:', err.message);
//             } else {
//                 console.log('Admin table initialized');
                
//                 // Insert admin data with plain text password if not exists
//                 db.get(`SELECT * FROM admin WHERE username = ?`, ['admin'], (err, row) => {
//                     if (err) {
//                         console.error('Error checking admin user:', err.message);
//                     } else if (!row) {
//                         db.run(`INSERT INTO admin (username, password) VALUES (?, ?)`, ['admin', 'admin123'], (err) => {
//                             if (err) {
//                                 console.error('Error inserting default admin:', err.message);
//                             } else {
//                                 console.log('Default admin user inserted');
//                             }
//                         });
//                     } else {
//                         console.log('Admin user already exists');
//                     }
//                 });
//             }
//         });
//     }
// });

// module.exports = db;



const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'app.db');
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error connecting to SQLite:', err.message);
    } else {
        console.log('Connected to SQLite database at', dbPath);

        db.run(`CREATE TABLE IF NOT EXISTS admin (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL
        )`, (err) => {
            if (err) {
                console.error('Error creating Admin table:', err.message);
            } else {
                console.log('Admin table initialized');
            }
        });

        db.run(`CREATE TABLE IF NOT EXISTS user (
            userId INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT NOT NULL,
            phoneNo TEXT,
            profession TEXT,
            hobbies TEXT,
            interest TEXT,
            image TEXT,
            password TEXT NOT NULL,
            createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )`);

        db.run(`CREATE TABLE IF NOT EXISTS activity (
            activityId INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            location TEXT NOT NULL,
            status TEXT NOT NULL,
            createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )`);

        db.run(`CREATE TABLE IF NOT EXISTS event (
            eventId INTEGER PRIMARY KEY AUTOINCREMENT,
            image TEXT NOT NULL,
            title TEXT NOT NULL,
            description TEXT NOT NULL,
            venue TEXT NOT NULL,
            date TEXT NOT NULL,
            status TEXT NOT NULL,
            createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )`);

        // db.run(`
        //     ALTER TABLE event 
        //     ADD COLUMN image TEXT NOT NULL;
        //   `, function(err) {
        //     if (err) {
        //       console.error('Error adding image column:', err.message);
        //     } else {
        //       console.log('Image column added successfully');
        //     }
        //   });

        db.run(`CREATE TABLE IF NOT EXISTS brandAmbassador (
            brandId INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            role TEXT NOT NULL,
            image TEXT NOT NULL,
            description TEXT NOT NULL,
            createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )`);

        db.run(`CREATE TABLE IF NOT EXISTS announcement (
            announcementId INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            description TEXT NOT NULL,
            createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )`);

        db.run(`CREATE TABLE IF NOT EXISTS activityApplication (
            activityApplicationId INTEGER PRIMARY KEY AUTOINCREMENT,
            activityId INTEGER NOT NULL,
            userId INTEGER NOT NULL,
            description TEXT NOT NULL,
            createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (activityId) REFERENCES activity(activityId),
            FOREIGN KEY (userId) REFERENCES user(userId)
        )`);

        db.run(`CREATE TABLE IF NOT EXISTS eventApplication (
            eventApplicationId INTEGER PRIMARY KEY AUTOINCREMENT,
            eventId INTEGER NOT NULL,
            userId INTEGER NOT NULL,
            isattending TEXT NOT NULL,
            feedback TEXT,
            createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (eventId) REFERENCES event(eventId),
            FOREIGN KEY (userId) REFERENCES user(userId)
        )`);


          
    }
});






module.exports = db;
