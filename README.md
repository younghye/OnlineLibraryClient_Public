# Library Management System
Library Management System offers many flexible and convenient features to allow librarians to maximize their efficiency. The application gives the relevent information about books, DVDs and software by searching the catalogue. It tracks if the item is available in the library and which items have been issued. New items can be easily added and updated. The system provides the function to manage users in catagories such as employees or customers and the check-out and check-in status of items.
<img src="https://github.com/younghye/OnlineLibraryClient_Public/blob/70d7c981a921d2af6fabc7e59e992798da5efe89/Library.png" >

## Development
![LayerDesign](https://github.com/younghye/OnlineLibraryClient_Public/blob/master/src/assets/images/readme/LayerDesign.jpg)


## Use Case Diagram
![UseCase](https://github.com/younghye/OnlineLibraryClient_Public/blob/master/src/assets/images/readme/UseCase.jpg)

## Use Case
### Before Login
#### 1. SignUp
   Access Page -> "SignUp" button<br />
   It will check if the employee is already registered and if the user name is available.
#### 2. Reset Password
   Access Page -> "Login" button -> "Forgot Password" link<br />
   Once the user clicks the "Reset Password" button, the system generates a token and sends the reset password link to the users email. When the user clicks the reset password 
   link received in the email, the user is asked to enter a new password.
#### 3. Login
   Access Page -> "Login" button<br />
   After the system has verified the username and password, the system generates an authentication token and stores it in local storage. The token is removed on user logout and expires after an hour.
### After Login
#### 4. Add Customer<br />
   Home page -> "Customer" -> "Add New" button<br />
   Once the user clicks the "Add" button after entering the input fields, the system generates library card number and inserts the customers data into the database. From here the user can view added new customer details on a data table with "delete", "edit" and "show loan" buttons.
#### 5. Search Customer and Staff<br />
   Home page -> "Customer/Staff" -> "Search" button<br />
   The user can view customer/staff details on a data table. If the user hasn't entered any search input fields and clicked "Search" button, it will show all of customer/staff information.
#### 6. Update Customer and Staff<br />
   Home page -> "Customer/Staff" -> "Search" button -> "Edit" button on table <br />
   After editing data, the table will refresh with updated data immediately.
#### 7. Delete Customer and Staff<br />
   Home page -> "Customer/Staff" -> "Search" button -> "Delete" button on table<br />
   After delete customer/staff, the selected row will be removed from table immediately.
#### 8. View Customer Loan History<br />
   Home page -> "Customer" -> "Search" button -> "ShowLoan" button on table<br />
   Displays all items that have been borrowed, both current and historical. The "Active Loans" tab shows current checkout details and allows the user to update loan status. If an item doesn't have any issue such as being damaged or lost, simply scan the barcode on the "Return" page and the item will be marked as returned. If the checked out item is damaged or lost, you need to update the status manually including a note and any relevent fine issued. No fine for returning items after the due date.<br />
   The "Loan History" tab shows customer's borrowing history.
#### 9. Add Item and Item copy<br />
   Home page -> "Item" -> "Add New" button<br />
   The input fields will change depending on the item type.<br />
   There could be more than one copy of a item, and library members should be able to check-out any copy. When adding a new item, after filling out all the relevent information, the user can view added new item details and add item copy. When the user clicks "Add Copy" button, the system generates a unique item barcode for the copy and inserts a fixed item price into the database without re-entering existing data. If there are multiple item copies, click the button for the number of times. From here the user can view the details for the added item copies on the data table with "delete", "edit" and "show loan" buttons. 
#### 10. Search Item and Item copy<br />
   Home page -> "Item" -> "Search" button<br />
   The user can view searched item details on data table. If the user doesn't enter any search input field and click the "Search" button, it will show all item information. If the search result has multiple results, the user can click the relevent row of the search results table to be shown more detailed information about selected item and the item copies on the right side of the table with the number of available items.
#### 11. Update Item/Item copy<br />
   Home page -> "Item" -> "Search" button -> "Edit" button on item table or item copy table<br />
   After editing data, the table will be refreshed with the updated data immediately.
   The user can't change item's type and item copy's barcode. 
#### 12. Delete Item/ Item copy<br />
   Home page -> "Item" -> "Search" button -> "Delete" on item table or item copy table<br />
   On delete item/item copy, the selected row will be removed from the table immediately. If the selected item has any copies of an item being checked out, the item can't be deleted. Even if the user deletes an item copy, check if the item copy is being checked out. 
#### 13. View Item Loan History
   Home page -> "Item" -> "Search" button -> "ShowLoan" button on item copy table<br />
   It shows the item copy's loans history. 
#### 14. Checkout<br />
   Home page -> "Loan" -> "Checkout"<br />
   A barcode scanner is optional. The barcode scanner will allow the user to quickly fill in the library card number and barcode. Without the scanner, the user will need to enter in the library card number and item barcode manually into the required field.
   First the user has to scan/enter the customer's library card number and scan/enter barcode for item copy being borrowed. It will show the details of the customer and item copy, then add the item copy to checkout list table with "Add To List" button. If the item is not available, the button will not appear to add to the check-out. Items that have been borrowed are marked in the system, and can be reviewed within the item and customer menu.
#### 15. Return<br />
   Home page -> "Loan" -> "Return"<br />
   User don't need to enter library card number for this. Simply scan the item barcode, and it will be marked as returned with "Return" button.
   If the item is not available to be scanned, the user can update the item manually by first accessing the customer menu. Access the list of "Active Loan" that have been borrowed. From there, user can update the item status(Avaliable, Lost, Damaged)

## Setup
1. Setting up "Visual Studio Code" and clone a "OnlineLibraryClient_Public" repository. <br />
https://github.com/younghye/OnlineLibraryClient_Public
3. Setting up EmailJS for Reset Password feature.<br /> 
https://www.telerik.com/blogs/sending-emails-react-app-using-emailjs
4. Update variables of emailjs, JWT and API url in the ".env" file.
5. API <br />
Reference https://github.com/younghye/OnlineLibraryAPI_Public


## Demo
https://blue-cliff-0bdeaa900.5.azurestaticapps.net/access
#### $\textsf{\color{#ff0000}{I have the API hosted on Azure that is sometimes timing out connection, and it works again after few minutues.}}$   $\textsf{\color{#ff0000}{If you get the error, please try again later. I'm working on resolving the issue.}}$

### Login 
UserName: Test<br /> 
Password: Test@1234 
