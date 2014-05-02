/** 
 * server/routes/bill.sj
 * Bill routes
 */
var bills = function(app) {

  // Process add bill form, add to database
  app.post('/bills/add', function(req, res) {
    res.end();
  });

  // Get edit bill form information
  app.get('/bills/edit/:bill', function(req, res) {
    res.end();
  });
  
  // Process edit bill form, modify database
  app.post('/bills/edit', function(req, res) {
    res.end();
  });

  // Remove bill from database
  app.post('/bills/delete', function(req, res) {
    res.end();
  });

  //Get all bills in apartment information
  app.get('/bills/all', function(req, res) {
    res.json({title: 'Bills'});
  });

  // Get most recent bills information
  app.get('/bills/recent', function(req, res) {
    res.end();
  });

  //Get the details of selected bill information
  app.get('/bills/:bill', function(req, res) {
    res.end();
  });

};

module.exports = bills;
