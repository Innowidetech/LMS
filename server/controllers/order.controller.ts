import { NextFunction, Request, Response } from "express";
import { CatchAsyncError } from "../middleware/catchAsyncErrors";
import ErrorHandler from "../utils/ErrorHandler";
import OrderModel, { IOrder } from "../models/order.Model";
import userModel from "../models/user.model";
import CourseModel from "../models/course.model";
import path from "path";
import ejs from "ejs";
import sendMail from "../utils/sendMail";
import NotificationModel from "../models/notificationModel";
import { redis } from "../utils/redis";
import { getAllOrdersService, newOrder } from "../services/order.service";
require("dotenv").config();
// import Stripe from "stripe";

// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

// create order

export const createOrder = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { courseId, payment_info } = req.body as IOrder;

      // if(payment_info){
      //   if("id" in payment_info){
      //     const paymentId = payment_info.id;
      //     // const paymentIntents = await stripe.paymentIntents.retrieve(paymentId)
      //     await stripe.paymentIntents.retrieve(paymentId);
      //   }
      // }

      const user = await userModel.findById(req.user?._id);

      const courseExistInUser = user?.courses.some(
        (course: any) => course._id.toString() === courseId
      );

      if (courseExistInUser) {
        return next(
          new ErrorHandler("You have alredy purchased this course", 400)
        );
      }
      const course= await CourseModel.findById(courseId);

      if (!course) {
        return next(new ErrorHandler("Course not found ", 404));
      }
      const data: any = {
        courseId: course._id,
        userId: user?._id,
        payment_info,
      };
      const mailData = {
        order: {
          _id: String(course._id).slice(0, 6),
          name: course.name,
          price: course.price,
          data: new Date().toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          }),
        },
      };

      const html = await ejs.renderFile(
        path.join(__dirname, "../mails/order-confirmation.ejs"),
        {order:mailData}  );

        try{

            if(user){
                await sendMail({
                    email:user.email,
                    subject:"Course Order Confirmation from LMS",
                    template:"order-confirmation.ejs",
                    data:mailData,
             });
            }

        }catch (error:any){
            return next(new ErrorHandler(error.message,500));

       }
       if (user && user.courses) {
        user.courses.push(course?._id as string); // or adjust according to your type
      }

        // await redis.set(req.user?._id, JSON.stringify(user));

        await user?.save();

         await NotificationModel.create({
            user:user?._id,
            title:"New Order",
            message:`You have a new order from ${course?.name}`,
        });
        course.purchased? course.purchased += 1 : course.purchased;

        await course.save();

        newOrder(data, res, next);
       } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

// get All orders ---- only for admin
export const getAllOrders = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      getAllOrdersService(res);
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

//send stripe publishable key
// export const sendStripePublishableKey = CatchAsyncError(async(req:Request,res:Response) => {
//   res.status(200).json({
//     PublishableKey: process.env.STRIPE_PUBLISHABLE_KEY
//   })
// });

// //NEW PAYMENT
// export const newPayment = CatchAsyncError(async(req:Request,res:Response,next:NextFunction) => {
//   try  {
//       const mypayment = await stripe.paymentIntents.create({
//         amount: req.body.amount,
//         currency: "USD",
//         metadata: {
//           company: "E-Learning",
//         },
//         automatic_payment_methods: {
//           enabled: true,       
//          }
//       });

//       res.status(201).json({
//         success: true,
//         client_secret: mypayment.client_secret
//       })
//   }catch (error:any) {
//     return next(new ErrorHandler(error.message, 500));
//   }
// })