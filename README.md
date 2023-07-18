# Student Portal for an University

---

## About The Project
This is a portal in which an university can manage its departments, courses, teachers and students.

---

## Basic work flow of the portal
- An admin representing an university can signup and login.
- Now the admin can add new departments and appoint HODs.
- New users can signup as a teacher or a student, existing users can login.
- The HOD of a department or the admin can add courses to the department appoint a teacher to that course.
- The teacher of a course can enroll students in that course, edit marks of a student in that course and also upload course resources.
- The students in a course can view their marks in the course and also the course resources.

---

## Authentication and Authorization
- [x] Admin signup using name, email id and password.
- [x] User signup using name, unique email id, department they belong to and password.
- [x] Admin and user login with email id and password.
- [x] Admin and user authorization with JWT.
- [x] User can update their details like name, email id and password.

---

## Functionalities of each user role

### Admin
- [x] Create a department.
- [x] Appoint a HOD(while creating the department).
- [x] Change the HOD of a department.
- [x] Perform all the actions that can be performed by a HOD.

### HOD
- [x] Create a course.
- [x] Appoint a teacher to a course(while creating the course).
- [x] Change the teacher of a course.
- [x] Discard a course.
- [x] Discard a teacher or a student.
- [x] Perform all the actions that can be performed by a teacher.

### Teacher
- [x] Enroll a student.
- [x] Delist a student.
- [x] View and Edit scores of a student.
- [x] Upload course resources.
- [x] Delete course resoures.

### Student
- [x] View their scores in the courses they are enrolled.
- [x] View the course resources uploaded.
