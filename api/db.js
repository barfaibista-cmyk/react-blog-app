import mysql from "mysql"

export const db = mysql.createConnection({
	host:"localhost",
	user:"root",
	password:"Taurean14@",
	database:"react-blog"
})
