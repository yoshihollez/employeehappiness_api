// import mysql from "mysql2";
// import * as dotenv from "dotenv";
// dotenv.config();

// // initializing .env variables
// const DATABASENAME: string = process.env.DATABASENAME || "WeAreHappy";
// const TABLENAME: string = process.env.TABLENAME || "employeehappiness";
// const DATABASE_IP: string = process.env.DATABASE_IP || "locahost";
// const DATABSE_USER: string = process.env.DATABSE_USER || "root";
// const DATABASE_PASSWORD: string = process.env.DATABASE_PASSWORD || "";

// // Creates connection to the database.
// let con = mysql.createConnection({
//   host: DATABASE_IP,
//   user: DATABSE_USER,
//   password: DATABASE_PASSWORD,
// });
// // DatabaseHandler class.
// export default class DatabaseHandler {
//   // Checks if the database and table exist, if not then creates it.
//   constructor() {
//     con.query(
//       `SHOW DATABASES LIKE '${DATABASENAME}';`,
//       (err: Error, result: Array<JSON>) => {
//         if (err) throw err;
//         if (result[0] == undefined) {
//           console.log("database doesn't exist");
//           con.query(`CREATE DATABASE ${DATABASENAME}`, (err: Error) => {
//             if (err) throw err;
//             console.log(`created database with name ${DATABASENAME}`);
//           });
//           con.query(`use ${DATABASENAME}`, (err: Error) => {
//             if (err) throw err;
//             console.log(`connected to ${DATABASENAME}`);
//           });
//           con.query(
//             `CREATE TABLE ${TABLENAME} (id INT AUTO_INCREMENT PRIMARY KEY,mood VARCHAR(255) NOT NULL, timeStamp VARCHAR(255) NOT NULL)`,
//             (err: Error) => {
//               if (err) throw err;
//               console.log(`created table with mood and timeStamp`);
//             }
//           );
//         } else {
//           console.log("database exists");
//           con.query(`use ${DATABASENAME}`, (err: Error) => {
//             if (err) throw err;
//             console.log(`connected to ${DATABASENAME}`);
//           });
//         }
//       }
//     );
//   }
//   // adds the mood of an employee with the date of today in year-month-day.
//   addEmployeeHappiness = (moodValue: string) => {
//     let sqlQuery: string = `INSERT INTO ${TABLENAME} (mood, timeStamp) VALUES ('${moodValue}', CURDATE())`;
//     con.query(sqlQuery, function (err: Error) {
//       if (err) throw err;
//       console.log("1 record inserted");
//     });
//   };
//   // Adds test data to the database.
//   addTestData = (moodValue: string, date: string) => {
//     let sqlQuery: string = `INSERT INTO ${TABLENAME} (mood, timeStamp) VALUES ('${moodValue}', '${date}')`;
//     con.query(sqlQuery, function (err: Error) {
//       if (err) throw err;
//       console.log("1 test record inserted");
//     });
//   };
//   // Gets the requested employee happiness data.
//   getEmployeeHappinessData = async (
//     timePeriod: string
//   ): Promise<Array<JSON>> => {
//     let databaseQuery: string = "";
//     let employeeHappinessArray: Array<JSON> = [];
//     // Checks which query to use for the selected time period.
//     switch (timePeriod) {
//       case "day":
//         databaseQuery = `SELECT * FROM ${TABLENAME} WHERE DATE(timeStamp) = CURDATE()`;
//         break;
//       case "week":
//         databaseQuery = `SELECT * FROM ${TABLENAME} WHERE yearweek(DATE(timeStamp), 1) = yearweek(curdate(), 1)`;
//         break;
//       case "month":
//         databaseQuery = `SELECT * FROM ${TABLENAME} WHERE MONTH(timeStamp) = MONTH(CURRENT_DATE()) AND YEAR(timeStamp) = YEAR(CURRENT_DATE())`;
//         break;
//       default:
//         databaseQuery = `SELECT * FROM ${TABLENAME} WHERE DATE(timeStamp) = CURDATE()`;
//         break;
//     }
//     // using a promise to wait for the data.
//     const query = new Promise<void>((resolve, reject) => {
//       con.query(databaseQuery, (err: Error, result: Array<JSON>) => {
//         if (err) throw err;
//         employeeHappinessArray = result;
//         resolve();
//       });
//     });
//     await query;
//     return employeeHappinessArray;
//   };
// }
