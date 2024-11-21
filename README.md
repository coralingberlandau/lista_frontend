# Welcome to application LISTA - frontend 👋


# **Lista - Personal and Collaborative List Management App**  
Your ultimate solution for organizing personal and shared lists with real-time updates and customization options.

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

---

## **Technological Stack**   🚀

| Domain     | Technology           |
|------------|----------------------|
| Frontend   | React Native, Expo   |
| Backend    | Django REST          |
| Database   | SQLite               |
| Security   | JWT Authentication   |


- **Frontend**: React Native with TypeScript, powered by **Expo** for project management.  
- **Backend**: Django REST Framework.  
- **Database**: SQLite.  
- **Security**: JWT for authentication and permissions.  
- **Communication**: Axios for HTTP requests between the frontend and backend.  

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
- **Email**: Used for sharing lists and password recovery.  
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

---

## **Future Upgrades**  
- Integration with external apps.  
- Performance analytics and productivity tracking.  
- Personalized notifications powered by AI.  

---


## **API Endpoints**  
### Get All Lists  
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

  ### Get Lists by user 
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
📧 **listaassistance@gmail.com**  

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
