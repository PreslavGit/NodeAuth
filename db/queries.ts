var pool = require('./pool');

export async function getCountries() {
    const [rows] = await pool.query("SELECT * FROM countries");
    return rows.map((c: any) => c.Country)
}

export async function insertUser(user: any) {
    pool.query(`INSERT INTO users (email, login, real_name, pass, birth_date, country) VALUES (?, ?, ?, ?, ?, ?)`,
        [user.email, user.login, user.name, user.password, user.date, user.country])
        .then(() => console.log(user.login + " inserted"))
}

export async function loginExists(user: any) {
    const [users] = await pool.query(`SELECT * FROM users WHERE email = ? OR login = ?`, [user.email, user.login])

    return users.length > 0 ? true : false;
}

export async function getEmail(login: string) {
    const [user] = await pool.query(`SELECT * FROM users WHERE email = ? OR login = ?`, [login, login])
    
    return user[0].email
}

export async function getName(login: string) {
    const [user] = await pool.query(`SELECT * FROM users WHERE email = ? OR login = ?`, [login, login])
    
    return user[0].real_name
}

export async function getHash(login: string): Promise<string> {
    const [user] = await pool.query(`SELECT * FROM users WHERE email = ? OR login = ?`, [login, login])
    
    return user[0].pass
}