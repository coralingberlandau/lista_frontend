# Welcome to application LISTA - frontend 👋

## **Lista - Personal and Collaborative List Management App**  

The frontend of **Lista**, a personal and collaborative list management app,
is built to deliver seamless, secure, and efficient functionalities.
Below is the detailed README for setting up and contributing to this project.

---

## **📋 Overview**  
**Lista** is your ultimate solution for organizing and managing personal and shared lists. 
It combines real-time updates, customization options, and a user-friendly experience.

---


### 🔗 **Backend URL - Render **:  
✨ [Access the backend here!](https://lista-backend-n3la.onrender.com) ✨


### 🌐 **Frontend URL - Netlify **:  
✨ [Access the frontend here!](https://lista-project.netlify.app/Welcome) ✨


---

## Doker: 

### Doker -backend : 
- **The terminal command to pull the Docker image is: :**
This command will download the lista-backend image with the version1 tag from Docker Hub.

```bash
   docker pull corallandau/lista-backend:version3
   ```

https://hub.docker.com/repository/docker/corallandau/lista-backend/general


### Doker -frontend : 
- **The terminal command to pull the Docker image is: :**
This command will download the lista-front image with the version1 tag from Docker Hub.

```bash
   docker pull corallandau/lista-front:version5
   ```

https://hub.docker.com/repository/docker/corallandau/lista-front/general


---

## **Table of Contents**
1. [Introduction](#introduction)  
2. [Project Goals](#project-goals)  
3. [Target Audience](#target-audience)  
4. [Key Features](#key-features)  
5. [Technological Stack](#technological-stack)  
6. [Screens](#screens)  
7. [Database Models](#database-models)  
8. [Development Process](#development-process)  
9. [Future Upgrades](#future-upgrades)  
10. [API Endpoints](#api-endpoints)  
11. [Contributing](#contributing)  

---

## **Introduction**  
The idea for **Lista** arose from a daily need to organize, manage, and track lists and tasks effortlessly.  
**Lista** provides an all-in-one solution that combines personal and collaborative list management with real-time updates and customizable design.

---

## **Project Goals**  
- Create an intuitive application for managing lists, compatible with all devices (mobile and desktop).  
- Enable real-time collaboration, editing, and sharing of lists.  
- Provide user-friendly tools for productive and seamless management.  
- Deliver a highly personalized user experience.  

---

## **Target Audience**  
- **Individuals**: People looking to organize personal lists and tasks.  
- **Groups**: Teams managing projects, events, or activities collaboratively.  
- **Organized Users**: People who need to share and manage information efficiently with tailored permissions.  

---

## **Key Features**  
1. **List Management**  
   - Create and manage lists by category (e.g., shopping, tasks, travel).  
   - Add tasks with notes, images, and deadlines.  
   - Mark tasks as complete.  
   - **Delete Lists**: Option to delete unwanted or unused lists.  
   - **Update Lists**: Update existing lists by adding or removing items, or modifying list details.  
   - **Recycle Lists**: Option to reuse existing lists, including saving and restoring lists for future use.

2. **List Sharing**  
   - Share lists with others via email.  
   - Choose user permissions:  
     - **Read-Only**  
     - **Full Edit Access**  

3. **Real-Time Updates**  
   - Changes reflect immediately for all users connected to a shared list.  

4. **Customization**  
   - Design lists with personalized backgrounds.  

5. **User-Friendly Interface**  
   - Clean, intuitive design suitable for all user types.  

6. **Security and User Management**  
   - Secure registration and login with **JWT**.  
   - Permission-based management by user and list.  

7. **Smart Recommendations and List Management**  
   - **AI-Driven Recommendations**: The application integrates with OpenAI to provide personalized, intelligent recommendations for tasks or list items. These recommendations help 
   users make smarter decisions when organizing their lists and tasks.  
   - **Smart List Management**: By analyzing user behavior and preferences, the AI automatically organizes, categorizes, and suggests the most efficient ways to manage lists, 
   improving productivity and organization.

8. **Device Compatibility**  
   - The application is fully responsive, ensuring seamless adaptation to various screen sizes and devices.
   - Optimized for desktop, tablet, and mobile devices.

---

## **Technologies Used**  ## **Technological Stack**   🚀

| Domain         | Technology                                                                        |
|----------------|-----------------------------------------------------------------------------------|
| Frontend       | React Native TSX, Expo                                                            |
| Backend        | Django REST Framework, CORS                                                       |
| Database       | SQLite                                                                            |
| Security       | JWT Authentication                                                                |
| Logging        | Python Logging Library                                                            |
| Code Quality   | Pylint Static Analysis with PEP8 compliance and automatic formatting via autopep8.|
| AI Integration | OpenAI API for smart recommendations and list management.                         |

---

- **Frontend**: React Native with TypeScript, powered by **Expo** for streamlined project management and development.  
- **Backend**: Django REST Framework, with CORS support to ensure smooth cross-origin communication.  
- **Database**: SQLite for lightweight and efficient data storage.  
- **Security**: Authentication and permission management using **JWT (JSON Web Tokens)**.  
- **Communication**: **Axios** facilitates seamless HTTP requests between the frontend and backend.   
- **Code Quality**: Static analysis performed with **Pylint** to maintain clean, error-free code, 
while adhering to **PEP8** standards for organized and consistent code formatting.
Additionally, **autopep8** is used to automatically format the code according to **PEP8** guidelines.
- **Logging**: Robust debugging and auditing capabilities via **Python's logging module**.  

---

## **Screens**  

1. **Sign Up and Login**  
   - Registration with username, full name, email address, and password.
   - Login for existing users with username and password.  

2. **List Overview**  
   - View all lists (personal and shared).  
   - Create and manage new lists.  

3. **List Creation**  
   - Select categories, add tasks, deadlines, and images.  

4. **Edit and Share Lists**  
   - Modify list details and tasks.  
   - Share lists with additional users and set permissions.  

5. **Notifications**  
   - Track changes and updates to shared lists.  

---

## **Database Models**  

### **Users**  
Utilizes Django’s built-in `User` model:  
- **User ID**: Unique identifier.  
- **Username**: Unique within the system, used for login alongside the password
- **First Name**: User's given name. 
- **Last Name:**: User's family name 
- **Email**: Unique within the system, used for sharing lists and password recovery.  
- **Password**: Secure authentication credential.  

### **ListItem**  
Represents tasks or list items:  
- **List ID**: Unique identifier for the list.  
- **Title**: Default: `"No items"`.  
- **Items**: Stored as plain text.  
- **Creation Date**: Auto-generated upon list creation.  
- **Owner**: Associated with the user who created it.  
- **Status**: Active or inactive.  

### **GroupList**  
Manages collaborative list sharing:  
- **User**: Reference to a participating user.  
- **List**: Reference to the shared list.  
- **Join Date**: Date user joined the group.  
- **Role**: Either `Admin` or `Member`.  
- **Permissions**: `Read-Only` or `Full Access`.  

### **ListItemImage**  
Stores images associated with a specific list item and index:
- **List Item:**: A foreign key linking to the ListItem model
 (on_delete=models.CASCADE, related_name='images').
- **Image:**: An image file, optional (default='/placeholder.png', 
upload_to='list_item_images/').
- **Index:**: Position of the image in the list, defaults to 0.
- **MIME Type:**: Optional field to store the image's MIME type 
(max_length=50)

### **Customization**  
Allows users to personalize their experience:  
- **User**: Reference to the modifying user.  
- **Background**: Identifier for a custom background image.  

### **Recommendation**  
Stores recommendations related to specific list items:
- **List Item**: A foreign key linking to the ListItem model (on_delete=models.CASCADE, 
related_name="recommendations").  
- **Recommended Items**: A text field containing recommended items, separated by commas.
- **Created At**: Automatically records the timestamp when the recommendation is created.
python

---

## **Development Process**  
1. **Planning and Design**  
   - Market research, wireframes, and user interface design.  

2. **Frontend Development**  
   - Built with React Native and Expo.  

3. **Backend Development**  
   - Developed using Django for API, authentication, and security.  

4. **Integration**  
   - Seamless data exchange using Axios.  

5. **Quality Assurance (QA)**  
   - Manual and automated feature testing.  

6. **Release and Feedback**  
   - Initial launch followed by user feedback for continuous improvement.  

7. **Development Process**  
    Responsive Design Implementation
   - Developed a mobile-first approach using modern CSS techniques and frameworks.
   - Ensured consistent layout and functionality across devices using media queries.
   - Extensively tested on different screen sizes to guarantee a seamless user experience.

---
## **Future Upgrades**  
- Integration with external apps.  
- Performance analytics and productivity tracking.  
- Personalized notifications powered by AI.  

---

## **API Endpoints**  

### User Authentication  
#### Register  
- **URL:** `/api/register/`  
- **Method:** `POST`  
- **Body Example:**  
  ```json
  {
    "username": "user1",
    "first_name": "John",
    "last_name": "Doe", 
    "email": "user1@example.com",
    "password": "password123"
  }
  ```

#### Login  
- **URL:** `/api/login/`  
- **Method:** `POST`  
- **Body Example:**  
  ```json
  {
    "username": "user1",
    "password": "password123"
  }
  ```
#### Get All Lists  
- **URL:** `/api/listitem/`  
- **Method:** `GET`  
- **Response:**  
  ```json
  [
    {
      "id": 1,
      "title": "Shopping List",
      "items": ["Milk", "Bread"],
      "user_id": 2,

    }
  ]
  ```  

#### Get Lists by user 
- **URL:** `/api/listitem/by-user/{user_id}`  
- **Method:** `GET`  
- **Response:**  
  ```json
  [
    {
      "id": 1,
      "title": "Shopping List",
      "items": ["Milk", "Bread"],
    }
  ]
  ```  
####  **Delete ListItem (Deactivate List)**

- **URL:** `/api/listitem/{id}`
- **Method:** `DELETE`
- **Description:** Deactivates a list item instead of deleting it.
- **Response:**
  ```json
  {
    "message": "List item deactivated successfully"
  }
  ```

#### **Update ListItem**

- **URL:** `/api/listitem/{id}`
- **Method:** `PUT`
- **Description:** Updates an existing list item.
- **Request Body:**
  ```json
  {
    "title": "Updated Shopping List",
    "items": ["Apples", "Bananas"]
  }
  ```
- **Response:**
  ```json
  {
    "id": 1,
    "title": "Updated Shopping List",
    "items": ["Apples", "Bananas"]
  }
  ```

####  **Get Lists by User**

- **URL:** `/api/listitem/by-user/{user_id}`
- **Method:** `GET`
- **Response:**
  ```json
  [
    {
      "id": 1,
      "title": "Shopping List",
      "items": ["Milk", "Bread"]
    }
  ]
  ```

####  **Share List with User by Email**

- **URL:** `/api/listitem/{id}/share`
- **Method:** `POST`
- **Description:** Allows a user to share a list with another user by specifying their email 
   and selecting the level of access (read-only or full edit).
- **Request Body:**
  ```json
  {
    "email": "user@example.com",
    "permission": "read-only"  // or "full-edit"
  }
  ```
- **Response:**
  ```json
  {
    "message": "List shared successfully with user",
    "shared_with_user_id": 2,
    "permission": "read-only"
  }
  ```

####  **Get Shared Lists by User**

- **URL:** `/api/listitem/shared-with/{user_id}`
- **Method:** `GET`
- **Description:** Retrieves all lists shared with a user. Includes permission details.
- **Response:**
  ```json
  [
    {
      "id": 1,
      "title": "Shared Shopping List",
      "items": ["Milk", "Bread"],
      "shared_by": 1,
      "permission": "read-only"
    }
  ]
  ```

####  **Update Share Permission**

- **URL:** `/api/listitem/{id}/update-share`
- **Method:** `PUT`
- **Description:** Allows a user to update the permissions of a shared list (e.g., change from `read-only` to `full-edit`).
- **Request Body:**
  ```json
  {
    "email": "user@example.com",
    "permission": "full-edit"  // or "read-only"
  }
  ```
- **Response:**
  ```json
  {
    "message": "Share permissions updated successfully",
    "updated_permission": "full-edit"
  }
  ```

####  **Remove Share from List**

- **URL:** `/api/listitem/{id}/remove-share`
- **Method:** `DELETE`
- **Description:** Removes sharing access from a list that was previously shared with a user by email.
- **Request Body:**
  ```json
  {
    "email": "user@example.com"
  }
  ```
- **Response:**
  ```json
  {
    "message": "List share removed successfully"
  }
  ```

### Workflow

1. **Share a List by Email:**
   - When sharing, the user will provide the email of the person they want to share with, along with the permission level (`read-only` or `full-edit`).
   - The system will look up the user by email, and then save the list's share information, including the permission level.
   
2. **Get Shared Lists:**
   - When the shared user accesses the shared list, they can retrieve it along with the permission details.

3. **Update Share Permissions:**
   - The user who shared the list can update the permissions of the shared list.

 * This allows flexibility in how lists are shared and managed between users while allowing the user to set different levels of permissions.


---
   
### 🚀 Installation and Setup  
Follow these steps to install and run the application locally:  

1. Clone the repository:  
   ```bash
   git clone https://github.com/username/lista.git
   cd lista
   ```
2. Install dependencies:  
   ```bash
   pip install -r requirements.txt
   cd frontend
   npm install
   expo start or npm run web

   ```
3. Start the server:  
   ```bash
   python manage.py runserver
   npm start
   ```

---
💻

  ![Build Status](https://img.shields.io/badge/build-passing-brightgreen)  
![Version](https://img.shields.io/badge/version-1.0.0-blue)  
![License](https://img.shields.io/badge/license-MIT-green)  

---


### 🤝 Contributing  
Contributions are welcome!  
1. Fork the repository.  
2. Create a feature branch: `git checkout -b feature-name`.  
3. Commit your changes: `git commit -m 'Add feature'`.  
4. Push to the branch: `git push origin feature-name`.  
5. Open a pull request.  

---


1. **Fork the repository** to your GitHub account.  
2. **Clone your fork**:  
   ```bash
   git clone https://github.com/yourusername/lista-backend.git
   ```  
3. Create a new branch:  
   ```bash
   git checkout -b feature/your-feature-name
   ```  
4. Commit changes:  
   ```bash
   git commit -m "Add your feature"
   ```  
5. Push changes:  
   ```bash
   git push origin feature/your-feature-name
   ```  
6. Open a **pull request** in the original repository.  

---

**Thank you for exploring Lista and its frontend! We’re excited 
to see how you use 
and improve it. 😊.** 

**We’re here to make your life easier and more organized.** 😊  


    For improvements, suggestions, and constructive feedback,
     I am always happy to hear from you. Enjoy and good luck!
---

### **Contact Us**
For technical issues or inquiries, please contact:  
📧 **listaassistance@gmail.com**  or  📧 **coralingber@gmail.com**  

--- 

# Welcome to your Expo app 👋

This is an [Expo](https://expo.dev) project created with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).

## Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
    npx expo start
   ```

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

## Get a fresh project

When you're ready, run:

```bash
npm run reset-project
```

This command will move the starter code to the **app-example** directory and create a blank **app** directory where you can start developing.

## Learn more

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.

## Join the community

Join our community of developers creating universal apps.

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.
