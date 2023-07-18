const Course = require("../models/courseDB")

const courseService = {
    addCourse: async course => {
        try {
            return await new Course(course).save();
        }
        catch (error) {
            throw error;
        }
    },
    delCourse: async course => {
        try {
            return await Course.findByIdAndDelete(course._id);
        }
        catch (error) {
            throw error;
        }
    },
    getCourseById: async courseId => {
        try {
            return await Course.findById(courseId);
        }
        catch (error) {
            throw error
        }
    },
    getCourseByName: async courseName => {
        try {
            return await Course.findOne({ name: courseName })
        }
        catch (error) {
            throw error;
        }
    },
    changeTeacher: async (course, teacher) => {
        try {
            return await Course.updateOne(
                { _id: course._id },
                {
                    $set:
                        { teacherId: teacher._id }
                }
            );
        }
        catch (error) {
            throw error;
        }
    },
    addResource: async (courseId, fileName) => {
        try {
            return await Course.updateOne(
                { _id: courseId },
                {
                    $push:
                    {
                        resources:
                            { fileName: fileName }
                    }
                }
            );
        }
        catch (error) {
            throw error;
        }
    },
    removeResourse: async (courseId,fileName) =>{
        try{
            return await Course.updateOne(
                { _id: courseId },
                {
                    $pull:
                    {
                        resources:
                            { fileName: fileName }
                    }
                }
            );
        }
        catch(error){
            throw error;
        }
    },
    addStudent: async (course, stud) => {
        try {
            const update = await Course.updateOne(
                { _id: course._id },
                {
                    $push:
                    {
                        students:
                            { studentId: stud._id }
                    }
                });
            return update;
        }
        catch (error) {
            throw error
        }
    },
    delStudent: async (course, stud) => {
        try {
            return await Course.updateOne(
                { _id: course._id },
                {
                    $pull:
                    {
                        students:
                            { studentId: stud._id }
                    }
                });
        }
        catch (error) {
            throw error
        }
    },
    getStudMarksById: async (courseId, userId) => {
        try {
            const obj = await Course.findOne({ _id: courseId, "students.studentId": userId });
            if (obj)
                return obj.students[0];
            else
                return false;
        }
        catch (error) {
            throw error
        }
    },
    editStudMarksById: async (courseId, studId, marks) => {
        try {
            const update = await Course.findOneAndUpdate({ _id: courseId, "students.studentId": studId },
                {
                    $set: {
                        "students.$.marks": marks
                    }
                });
            return update;
        }
        catch (error) {
            throw error
        }
    }
}

module.exports = courseService