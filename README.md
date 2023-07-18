# Student Portal for an University

---

## About The Project
This is a portal in which an university can manage its departments, courses, teachers and students.

---

## Basic work flow of the portal
- An admin representing an university can signup and login.
- Now the admin can add new departments and appoint HODs.
- New users can signup as teacher or a student, existing users can login.
- The HOD of a department or the admin can add courses to the department appoint a teacher to that course.
- The teacher of a course can enroll students in that course, edit marks of a student in that course and also upload course resources.
- The students in a course can view their marks in the course and also the course resources.

---

## Detailed Functionalities
### Authentication and Authorization
- The admin can signup using name, unique email id and password.
- The users can signup using name, unique email id, department they belong to and password.
- The admin and the users can login with email id and password.
- The authorization of both the admin and the users is done using JWT.
- The users and the admin can update their name, email and password.

### Departments
- Only the admin can create a new department and appoint the HOD.
- The admin can also change the HOD of a department.
- The HOD  of the department and the admin have the access to make changes in the department.
- They can add or delete courses in the department and appoint a teacher from the same department.
- They can also delete a user from the portal.

### Courses
- The teacher of the course, the HOD of the department and the admin have the access to make any changes in the course.
- They can enroll or delist a student in the course.
- They can change the scores of a student enrolled in the course.
- They can also upload or delete the course resources.

