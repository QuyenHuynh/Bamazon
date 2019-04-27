DROP DATABASE if exists bamazon;

CREATE DATABASE bamazon;
USE bamazon;

CREATE TABLE products (
item_id INTEGER NOT NULL auto_increment,
product_name VARCHAR(100) NOT NULL,
department_name VARCHAR(30) NOT NULL,
price DECIMAL(6,2) NOT NULL,
stock_quantity INTEGER NOT NULL,
PRIMARY KEY (item_id)
);

INSERT INTO products (product_name, department_name, price, stock_quantity) VALUES ("Sun Bum SPF 70 Sunscreen Lotion" , "Skincare" , 14.99 , 10);
INSERT INTO products (product_name, department_name, price, stock_quantity) VALUES ("Pink Heart-Shaped Egg Pan", "Cooking" , 10.00 , 5);
INSERT INTO products (product_name, department_name, price, stock_quantity) VALUES ("Glazed Cerulean Tea Pot" , "Cooking" , 25.00 , 10);
INSERT INTO products (product_name, department_name, price, stock_quantity) VALUES ("Scandinavian Comfort Food Cookbook" , "Cooking" , 25.00 , 10);
INSERT INTO products (product_name, department_name, price, stock_quantity) VALUES ("24k White Gold Necklace" , "Jewelry" , 100.00 , 3);
INSERT INTO products (product_name, department_name, price, stock_quantity) VALUES ("Floral Canvas Print" , "Decor" , 20.00 , 15);
INSERT INTO products (product_name, department_name, price, stock_quantity) VALUES ("COSRX Low pH Good Morning Cleanser" , "Skincare" , 12.00 , 10);
INSERT INTO products (product_name, department_name, price, stock_quantity) VALUES ("BareMinerals Gen Nude Matte Liquid Lipstick" , "Cosmetics" , 20.00 , 10);
INSERT INTO products (product_name, department_name, price, stock_quantity) VALUES ("Sapphire Earrings" , "Jewelry" , 30.00, 20);
INSERT INTO products (product_name, department_name, price, stock_quantity) VALUES ("Decorative Pillow of Shushu the Dog" , "Decor" , 20.00 , 80);

SELECT * FROM products;