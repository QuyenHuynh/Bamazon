//Dependencies
const mysql = require('mysql');
const inquirer = require('inquirer');

//Create server connection
var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "root",
  database: "bamazon"
});

//Log connection id if connection successful
connection.connect(function (err) {
  if (err) throw err;
  console.log("connected as id " + connection.threadId);
});

//Main function which executes bamazon
function main() {
  showProducts();

  setTimeout(function () {
    promptPurchase();
  }, 1000);
}
main();

//Function that validates ID input for inquirer prompt
function validateID(value) {
  if ((typeof parseInt(value) == 'number') && (parseInt(value) >= 1) && (value <= 10)) {
    return true;
  } else {
    return false;
  }
}

//Function that validates quantity input for inquirer prompt
function validateQuantity(value) {
  if ((typeof parseInt(value) == 'number') && (parseInt(value) >= 1)) {
    return true;
  } else {
    return false;
  }
}

//Display products function
function showProducts() {
  connection.query("SELECT item_id, product_name, department_name, price FROM products", function (error, result) {
    if (error) throw error;
    console.log("Displaying products...");
    console.table(result);
  })
}

//Executes inquirer prompts
function promptPurchase() {
  inquirer.prompt([
    {
      type: "input",
      name: "id",
      message: "Please enter the ID of the product that you would like to purchase.",
      validate: validateID
    },
    {
      type: "input",
      name: "quantity",
      message: "How many would you like?",
      validate: validateQuantity
    }
  ]).then(function (response) {

    //stores user input into variables
    var id = parseInt(response.id);
    var quantity = parseInt(response.quantity);

    connection.query("SELECT * FROM products WHERE item_id = ?", id, function (err, res) {

      //stores available quantity within variable
      var inStock = res[0].stock_quantity;
      //store total cost within variable
      var totalCost = res[0].price * quantity;

      //If we have enough units, update the database, and display total
      if (inStock > quantity) {
        console.log("Thank you for your purchase!");
        connection.query(
          "UPDATE products SET ? WHERE ?", [
            {
              stock_quantity: inStock - quantity
            }, {
              stock_quantity: inStock
            }], function (err, res) {
              console.log(res.affectedRows + " product updated!\n");
              console.log("Your total cost is $" + totalCost);
              connection.end();
            }
        );
      } else {
        console.log("Sorry. We have insufficient quantities.\n");
        tryAgain();
      }
    });
  });
}

//In the case of insufficient quantities, prompt use if they would like to attempt another purchase or exit application
function tryAgain() {
  inquirer.prompt([
    {
      type: "list",
      name: "tryagain",
      message: "Would you like to attempt another purchase or exit?",
      choices: ["Another purchase", "Exit"]
    }
  ]).then(function (response) {
    if (response.tryagain == "Another purchase") {
      promptPurchase();
    } else {
      console.log("Come back again soon!");
      connection.end();
    }
  });
}