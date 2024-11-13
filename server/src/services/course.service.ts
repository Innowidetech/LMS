import { Response } from "express";
import CourseModel from "../src/models/course.model";
import { CatchAsyncError } from "../src/middleware/catchAsyncErrors";

// create  course
export const createCourse = CatchAsyncError(async(data:any, res:Response)=>{
    const course=await CourseModel.create(data)
    res.status(201).json({
        success:true,
        course,
    })
});

//get all courses
export const getAllCoursesService=async(res:Response)=>{
    const courses = await CourseModel.find().sort({createdAt:-1});
    res.status(201).json({
        success:true,
        courses,
    });
}