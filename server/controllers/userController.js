const mysql = require("mysql");

// collection pool
const pool = mysql.createPool({
  connectionLimit: 100,
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME

});

// View User
exports.view = (req, res) => {


  //connect to DB
  pool.getConnection((err, connection) => {
    if (err) throw err;
   

    // User connection
    connection.query('SELECT * FROM user WHERE status = "active"', (err, rows) => {
      connection.release();

      if (!err) {
        let removedUser = req.query.removed;
        res.render('home', { rows, removedUser });
      } else {
        console.log(err);
      }

     
    });
  }
  );
}


// User Search
exports.find = (req, res) => {

  pool.getConnection((err, connection) => {
    if (err) throw err;
  

  let searchTerm = req.body.search;

    // User connection
    connection.query('SELECT * FROM user WHERE first_name LIKE ? OR last_name LIKE ?', ['%' + searchTerm + '%','%' + searchTerm + '%'], (err, rows) => {
      connection.release();

      if (!err) {
        res.render('home', { rows });
      } else {
        console.log(err);
      }

     
    });
  }
  );

}

exports.form = (req, res) => {
  res.render('add-user');
}

//Add New User
exports.create = (req, res) => {
  const { first_name, last_name, phone, email, comments } = req.body;

   pool.getConnection((err, connection) => {
    if (err) throw err;
   

  let searchTerm = req.body.search;

    // User connection
    connection.query('INSERT INTO user SET first_name = ?, last_name = ?, email = ?, phone = ?, comments = ?', [first_name, last_name, email, phone, comments], (err, rows) => {
      connection.release();

      if (!err) {
        res.render('add-user', { alert: 'User added successefully' });
      } else {
       
      }

     
    });


  }
  );
}

// Edit User
exports.edit = (req, res) => {
     // User the connection
     pool.getConnection((err, connection) => {
      if (err) throw err;
     
  
      // User connection
      connection.query('SELECT * FROM user WHERE id = ?', [req.params.id], (err, rows) => {
        connection.release();
        if (!err) {
          res.render('edit-user', { rows });
        } else {
          console.log(err);
        }
        
      });
    }
    );
 
}



// Update User
exports.update = (req, res) => {
  const { first_name, last_name, phone, email, comments } = req.body;

  // User the connection
  pool.getConnection((err, connection) => {
   if (err) throw err;
  

   // User connection
   connection.query('UPDATE user SET first_name = ?, last_name = ?, email = ?, phone = ?, comments = ? WHERE id = ?', [first_name, last_name, email, phone, comments, req.params.id], (err, rows) => {
     connection.release();
     if (!err) {




       
      pool.getConnection((err, connection) => {
        if (err) throw err;
      
    
        // User connection
        connection.query('SELECT * FROM user WHERE id = ?', [req.params.id], (err, rows) => {
          connection.release();
          if (!err) {
            res.render('edit-user', { rows, alert: `${first_name} has been updated`});
          } else {
           
          }
          
        });
      }
      );




     } else {
       console.log(err);
     }
     
   });
 }
 );

}


// Delate User
exports.delete = (req, res) => {
  // User the connection
  
  //pool.getConnection((err, connection) => {
   //if (err) throw err;
   //console.log("Connected as ID " + connection.threadId);

   // User connection
  // connection.query('DELETE FROM user WHERE id = ?', [req.params.id], (err, rows) => {
   ///  connection.release();
   //  if (!err) {
    //   res.redirect('/');
   //  } else {
   //    console.log(err);
   //  }
    // console.log('The data from user table: \n', rows);
  // });
 //}
 //);





 // Hide a record


 pool.getConnection((err, connection) => {
  if (err) throw err;
 
  connection.query('UPDATE user SET status = ? WHERE id = ?', ['removed', req.params.id], (err, rows) => {
    if (!err) {
      let removedUser = encodeURIComponent('User successeflly removed.');
      res.redirect('/?removed=' + removedUser);
    } else {
      console.log(err);
    }
   
  });
});

}










// Viewall User
exports.viewall = (req, res) => {


  //connect to DB
  pool.getConnection((err, connection) => {
    if (err) throw err;
    

    // User connection
    connection.query('SELECT * FROM user WHERE id = ?', [req.params.id], (err, rows) => {
      connection.release();

      if (!err) {
        res.render('view-user', { rows });
      } else {
        console.log(err);
      }

      
    });
  }
  );
}



