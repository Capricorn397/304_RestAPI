# Christopher Carr 5355226 304cem Rest API
___
### Files under /views/addOns are from external sources and are only used to provide a date and time picker on the webpage. They should not be taken into account for linting errors etc.
---
## A Things to do API
##### Should be available at http://164.132.195.20:8000/home.html (all api requests can be made to the same ip:port)

---
## List of endpoints - 
##### /search? -GET Takes a location(string), catID(string) and date(yyyy-mm-dd hh:mm:ss) Returns results with links in a JSON object

##### /weather -GET Takes a location(string) and date(yyyy-mm-dd hh:mm:ss) Returns weather results in a JSON object
##### /categories -GET Returns accepted foursquare categories with their id's in a JSON object
##### /register -POST Takes a body {username: string, password: string} will register user
##### /login -GET Takes username and password as headers, will check if valid login credentials
##### /addFavourite -POST Takes username and password as headers, adds body to favourites
##### /viewFavourites -GET Takes username and password as headers. Returns a user's favourites
##### /delFavourite -DELETE Takes username and password as headers, will remove a users favourites from the database
##### /delUser -DELETE Takes username and password as headers, will remove a user from the database
##### /changePassword -UPDATE Takes username and password as headers and new password in a body {newPass: string}, updates a user's password
---

