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

//Function that validates input for inquirer prompt
function validateInput(value) {
    if ((typeof parseInt(value) == 'number') && (parseInt(value) >= 1)) {
      return true;
    } else {
      return false;
    }
  }

function mainPrompt() {
    inquirer.prompt([
        {
            type: "list",
            name: "menu",
            message: "Please select a command",
            choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product", "Exit"]
        }
    ]).then(function (response) {

        switch (response.menu) {
            case 'View Products for Sale':
                viewProducts();
                break;
            case 'View Low Inventory':
                viewlowInventory();
                break;
            case 'Add to Inventory':
                addtoInventory();
                break;
            case 'Add New Product':
                addnewProduct();
                break;
            case 'Exit':
                connection.end();
        }
    });
}
mainPrompt();


function viewProducts() {
    connection.query("SELECT * FROM products", function (error, result) {
        if (error) throw error;
        console.log("Displaying products...");
        console.table(result);
        anotherCommand();
    });
}

function viewlowInventory() {
    connection.query("SELECT * FROM products WHERE stock_quantity < 5",
        function (err, res) {
            if (err) throw err;
            if (res.length === 0) {
                console.log("No low inventory");
            }
            else {
                console.table(res);
            };
            anotherCommand();
        }
    );
};

function addtoInventory() {
    inquirer.prompt([
        {
            type: "input",
            name: "id",
            message: "Please enter the ID of the product that you would like to restock",
            validate: validateInput
        },
        {
            type: "input",
            name: "quantity",
            message: "How units are being added?",
            validate: validateInput
        }
    ]).then(function (response) {
        var id = parseInt(response.id);
        var quantity = parseInt(response.quantity);

        connection.query("SELECT * FROM products WHERE item_id = ?", id, function (err, res) {
            var inStock = res[0].stock_quantity;
            var newQuantity = inStock + quantity;

            connection.query("UPDATE products SET stock_quantity = " + (res[0].stock_quantity + quantity) + " WHERE item_id = " + id,
                function (err, res) {
                    console.log(res.affectedRows + " product(s) updated!\n");
                    console.log("This product now has " + newQuantity + " units.");
                    anotherCommand();
                }
            );
        });
    });
}

function addnewProduct() {
    console.log("Adding a new product...")
    inquirer.prompt([
        {
            type: "input",
            name: "product",
            message: "What is the name of the product?",
        },
        {
            type: "input",
            name: "department",
            message: "What department does this product belong to?"
        },
        {
            type: "input",
            name: "price",
            message: "How much does each unit cost?",
            validate: validateInput
        },
        {
            type: "input",
            name: "stock",
            message: "How many units are you adding?",
            validate: validateInput
        }
    ]).then(function (response) {
        console.log("Adding your new product to the database...");
        var product = response.product;
        var department = response.department;
        var price = parseFloat(response.price);
        var stock = parseInt(response.stock);
        var newProduct = [product, department, price, stock];
        connection.query("INSERT INTO products (product_name, department_name, price, stock_quantity) VALUES (?, ? , ?, ?)", newProduct, function (err, res) {
            if (err) throw err;
            console.log("Success! Your new product is now available for sale.")
            viewProducts();
        });
    });
}

function anotherCommand() {
    inquirer.prompt([
        {
            type: "confirm",
            name: "confirmation",
            message: "Would you like to execute another command?",
        }
    ]).then(function (response) {
        if (response.confirmation) {
            mainPrompt();
        } else {
            console.log("Exiting application...");
            connection.end();
        }
    });
}