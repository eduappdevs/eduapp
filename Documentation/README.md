# Development Notes

- [Backend Structure](#backend-structure)
- [Frontend Structure](#frontend-structure)
- [Administration Structure](#administration-structure)

# Backend Structure

The main components we are going to dive in are:
- Controllers
- Extra Fields
- Filtration
- Encryption

## Controllers

Each table has a custom controller by which each have their own methods.
The main controller to look at is the Application Controller.

This controller contains all methods used for the Extra Fields as well as helper methods for other controllers to deny or permit accesd to users and paginate extra fields.

These are explicitly documented inside the code to make it easy to find and follow.

An example of what you can find in the Application Controller:

```ruby
  # UTILS

  # Returns a ```UserRole``` entry for the currently existing admin role.
  def get_admin_role
    return UserRole.where(name: "eduapp-admin").first
  end

  # Returns the user's respective ```UserRole``` information.
  def get_user_roles(user_id = @current_user)
    return UserRole.find(UserInfo.where(user_id: user_id).first.user_role_id)
  end

  # Serializes each element in an array.
  def serialize_each(array, iExcept = [], iInclude = [])
    s = []
    array.each do |item|
      s.push(item.serializable_hash(except: iExcept, include: iInclude))
    end
    return s
  end

  # Paginates an ```ActiveRecord``` query.
  def query_paginate(query, page, limit = 10)
    page = Integer(page)
    if page - 1 < 0
      return { :error => "Page cannot be less than 1" }
    end
    return { :current_page => query.limit(limit).offset((page - 1) * limit), :total_pages => (query.count.to_f / limit).ceil, :page => page }
  end

  # Paginates an array.
  def array_paginate(array, page, limit = 10)
    return array.slice(Integer(page) > 0 ? Integer(page) - 1 : 0, limit)
  end

  # A parser made to correctly return a decoded order filter.
  def parse_filter_order(order)
    order = JSON.parse(Base64.decode64(order))
    return { order["field"] => order["order"] == "asc" ? :asc : :desc }
  end
```

## Extra Fields

Extra fields are made to provide access to custom information each Institution needs. Examples of this can be student debts, detention counts and custom notes.

The tables elegible for extra fields are Users, Courses, Sessions, Institutions, Resources and Subjects.

Helper methods for these are located as well in the Application Controller.

## Filtration

Each controller has it's own way of filtrating. Every controller follows a pattern:

- Check if any extra fields exists and try to filter by that
- If there's any filtered extra fields, filter with that by the other main fields, if not, filter by any value in the database.
- Order by ascending if no order is specified
- Return the first page if not page of information is specified

## Encryption

EduApp has it's own encryption utility inside ```lib/edu_app_utils/encrypt_utils.rb```.

Here, you will find different methods used to encrypt and decrypt messages for the messaging part of EduApp.

# Frontend Structure

The main topics we will cover about how the frontend works:
- It's PWA
  - How we save information offline
- It's different utilities
- Custom hooks

## The PWA

The PWA has two main components necessary:
- ```service-worker.js```
- ```serviceWorkerRegistration.js```

These two components are necessary for registering the Service Worker to the browser so that it works correctly.

This all depends on WorkBox to register and save to browser cache the compiled assets necessary to run the app.

To save the user's important information for offline use, we use the ```OfflineManager.js``` utility. This helps us saving and updating any information when needed so that we have always the most updated user information at all types.

## Utilities

The different types of utilities we use are:
- ```OfflineManager```
- ```IDBManager```
- ```MediaFixer```
- ```FirebaseStorage```
- ```UrlPrefixer```
- ActionCable websockets

### OfflineManager

The offline manager contains various functions used to save and load information for further use when in offline mode. 

The workflow used is to always store information offline when received from the API, and if the information is different then save it, if not there's no need to save it.

```getOfflineUser()``` is the main function you will want to use for accessing a user's information online or offline. It all depends on the information in it.

### IDBManager

The IDBManager uses a library @jakearchibald called ```idb-keyval``` which converts all IndexedDB functions into asynchronous, for ease of use.

The class contains methods used as a Singleton to load a store and make transactions.

### MediaFixer

MediaFixer is a small function used to correct files from Rails ActiveStorage from not displaying the correct URL. It changes the ```localhost:3000``` domain that ActiveStorage sets to the back domain passed inside the ```.env``` file.

### FirebaseStorage

This is used to upload any files used to a Firebase Storage bucket in case ActiveStorage fails. As of now, only profile images are uploaded to Firebase.

### UrlPrefixer

This is used in case you change your domains base name to a new mount point.

Example: default - eduapp.com
Changed basename: eduapp.com/app

This functions converts all urls passed to use the new basename you specify. This was previously used for ease of use, but it's not necessary anymore.

### ActionCable Websockets

Rails ActionCable needs a special JS library from the same developers to connect to each other.

To provide an easy interface, we created a class called ```ACManager``` which is an abstract class used to create new Websocket classes to manage the different websocket channels in the backend.


# Administration Structure

The main topics we will cover:

- Initialization of the administration panel and database
- Login
- Components

## Initialization

When creating and intializing the backend, frontend and administration for the first time, you will be prompted to create a new administrator user. Once done, you may login with your new administration account.

Once in, you will only be able to see to sections:
- Institutions
- User Permissions/Roles

To unlock the other administrative sections, you must first create your an Institution. Once created, you may access the other sections to setup your educational environment.

## Login

Only users who have an ```admin-query``` or ```admin``` role are able to have access to the web app by default. You may change this inside the authentication service inside ```services```.

## Components

The administration panel constitutes of one main parent view with rotating child components. This means that ControlPanel is the parent view that never changes, and the only components that change are the inside/body of the main page.

Each component behaves differently since they all manage different sets of data according to their table, but they share common features:
- Creation 
- Deletion
- Updates
- Filtration
- Extra Fields
- Extra Fields Filtration
- Order By

Chat messages are not displayed to manage to keep the users privacy safe.