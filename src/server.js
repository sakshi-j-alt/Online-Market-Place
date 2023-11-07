const path = require('path');

const express = require('express')
const app = express()
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();

const port = 3000
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.json());






//send the index file
app.use(express.static(path.join(__dirname, '../public')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

// handle register form input
app.post('/register-shop', (req, res) => {

  // // open the database connection
  const db = new sqlite3.Database('marketplace.db',sqlite3.OPEN_READWRITE, (err) => {
  if (err) {
    console.error(err.message);
  } else {
    console.log('Connected to the database.');
  }
});


  
  const name = req.body.name;
  const info = req.body.info;
  const category = req.body.category;
  const username = req.body.username;
  const password = req.body.password;



  // Insert the form data into the "vendor" table
  db.run(`INSERT INTO vendor (name, information, category, username, password) 
          VALUES (?, ?, ?, ?, ?)`,
    [name, info, category, username, password],
    function(err) {
      if (err) {
        return console.log(err.message);
      }
     const vendorId = this.lastID; 
      
      res.redirect(`/vendor-login.html?id=${vendorId}`);
    });

  // close the database connection
  db.close((err) => {
  if (err) {
    console.error(err.message);
  } else {
    console.log('Disconnected from the database.');
  }
});

  
});

// Backend endpoint to get all vendors
app.get('/vendors', (req, res) => {
  const db = new sqlite3.Database('marketplace.db',sqlite3.OPEN_READWRITE, (err) => {
  if (err) {
    console.error(err.message);
  } else {
    console.log('Connected to the database.');
  }
});
  
  // Get all vendors from the database
  db.all('SELECT * FROM vendor', (err, rows) => {
    if (err) {
      console.error(err.message);
      res.status(500).send('Internal server error');
    } else {
      
      res.send(rows);
    }
  });

  
   db.close((err) => {
  if (err) {
    console.error(err.message);
    
  } else {
    console.log('Disconnected from the database.');
  }
});
  
});


app.get('/vendor/:id', (req, res) => {
  const vendorId = req.params.id;
  

  const db = openDatabase();

  // Query the database to get the vendor information based on the ID
  db.get('SELECT * FROM vendor WHERE id = ?', [vendorId], (err, vendor) => {
    if (err) {
      console.error(err.message);
      res.status(500).send('Internal server error');
    } else {
      if (vendor) {
        // Vendor found, query the items associated with the vendor
        db.all('SELECT * FROM item WHERE vendor_id = ?', [vendorId], (err, items) => {
          if (err) {
            console.error(err.message);
            res.status(500).send('Internal server error');
          } else {

          
            
            // Combine the vendor and item information
            const vendorInfo = {
              id: vendor.id,
              name: vendor.name,
              information: vendor.information,
              items: items
            };

            // Send the combined information as JSON response
            
            res.json(vendorInfo);
          }

          closeDatabase(db);
        });
      } else {
        // Vendor not found
        res.status(404).send('Vendor not found');
        closeDatabase(db);
      }
    }
  });
});

app.post('/login', (req, res) => {
  const db = openDatabase()
  const { username, password } = req.body;

  // Retrieve vendor information from the database based on the username
  const sql = 'SELECT * FROM vendor WHERE username = ?';
  db.get(sql, [username], (err, vendor) => {
    if (err) {
      console.error(err.message);
      res.status(500).send('Internal Server Error');
      return;
    }
    console.log(username);
    

    if (vendor) {
      console.log(vendor);
      // const { vendor_id, vendor_name, stored_password } = vendor;
      // Compare the stored password with the provided password
      if (password === vendor.password) {
        console.log("password verified")
        // Valid credentials, redirect to the vendor info page
        res.json({ success: true, vendorId: vendor.id });
        return;
      }
    }

    // Invalid username or password
    res.status(401).send('Unauthorized');
  });
  closeDatabase(db);
});


app.post('/add-item', (req, res) => {
  console.log(req.body);
  const db = openDatabase();
  const { name, price, image_url, description, vendorId } = req.body;


  // Insert the item data into the database
  const sql = 'INSERT INTO item (name, price, image_url, description, vendor_id) VALUES (?, ?, ?, ?, ?)';
    const values = [name, price, image_url, description, vendorId];

  console.log(values);
  
  db.run(sql, values, function (err) {
    if (err) {
      console.error(err.message);
      res.status(500).send('Internal Server Error');
      return;
    }

    // Return the newly added item ID
    res.json({ success: true });
  });

  closeDatabase(db);
});

app.get('/featured', (req, res) => {
  const db = openDatabase();
  
  // Query the database to fetch random items
  const sql = 'SELECT * FROM item ORDER BY RANDOM() LIMIT 9'; // Adjust the query according 
  db.all(sql, [], (err, rows) => {
    if (err) {
      console.error(err.message);
      res.status(500).send('Internal Server Error');
    } else {
      const items = rows.map((row) => ({
        image: row.image_url,
        title: row.price,
        description: row.description,
        
      }));
      res.json(items);
    }
  });
  closeDatabase(db);
});


//function open and close db
function openDatabase() {
   const db = new sqlite3.Database('marketplace.db',sqlite3.OPEN_READWRITE, (err) => {
  if (err) {
    console.error(err.message);
  } else {
    console.log('Connected to the database.');
  }
});
  return db;
}

function closeDatabase(db) {
  db.close((err) => {
    if (err) {
      console.error(err.message);
    } else {
      console.log('Disconnected from the database.');
    }
  });
}


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})