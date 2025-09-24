"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import Image from "next/image";

export default function AboutPage() {
  return (
    <div className="min-h-screen w-full  text-white p-6 md:p-12">
      <div className="max-w-5xl mx-auto space-y-12">
        <header className="text-center space-y-2">
          <h1 className="text-3xl md:text-5xl font-bold">About DeloBooks</h1>
          <p className="text-lg text-gray-300">
            A Digital EBook Selling Platform
          </p>
        </header>

        <section className="space-y-4">
          <h2 className="text-2xl md:text-3xl font-semibold">
            Project Overview
          </h2>
          <p className="leading-relaxed text-gray-300 text-justify">
            DeloBooks is a digital platform designed to address the challenges
            faced by IGNOU BCA students in accessing up-to-date study materials
            in a digital format. The platform is built using a modern technology
            stack, including <span className="font-semibold">Next.js 15</span>{" "}
            (a React framework with server-side rendering capabilities),{" "}
            <span className="font-semibold">TypeScript</span> (for typesafe
            programming), <span className="font-semibold">Prisma</span> (an
            Object-Relational Mapping tool), and{" "}
            <span className="font-semibold">Supabase</span> (a PostgreSQL-based
            open-source database platform).
          </p>
          <p className="leading-relaxed text-gray-300 text-justify">
            This combination ensures a scalable, secure, and efficient system
            suitable for an academic project while aligning with industry
            standards. DeloBooks features two distinct portals: an{" "}
            <span className="font-semibold">admin portal</span> for uploading,
            editing, and deleting e-books, as well as monitoring sales activity,
            and a <span className="font-semibold">user portal</span> where
            students can register, log in, browse ebooks, make purchases using
            Razorpay in test mode, and access purchased content in a “My Books”
            section. The use of Razorpay’s test mode ensures no real financial
            transactions occur, making the project examiner-friendly.
          </p>
          <p className="leading-relaxed text-gray-300 text-justify">
            The motivation for DeloBooks stems from the difficulties IGNOU
            students face in procuring physical study materials, which are often
            expensive (e.g., ₹200–₹500 per book plus shipping), delayed in
            delivery (especially in rural areas), and inconvenient. DeloBooks
            provides affordable ebooks (e.g., ₹100 each) accessible via any
            internet-enabled device, addressing these issues and aligning with
            the trend of e-learning adoption.
          </p>
          <p className="leading-relaxed text-gray-300 text-justify">
            The project applies key BCA concepts, such as{" "}
            <span className="font-semibold">
              Relational Database Management Systems (RDBMS)
            </span>
            ,
            <span className="font-semibold">
              Object-Oriented Programming (OOPS)
            </span>
            , and <span className="font-semibold">web development</span>, making
            it an ideal submission for{" "}
            <span className="font-semibold">BCSP064</span>. The deliberate
            exclusion of notification services (e.g., email or SMS) keeps the
            project focused on core functionality, avoiding unnecessary
            complexity for academic demonstration.
          </p>
        </section>
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="bg-gray-900 border-gray-700 text-white">
            <CardHeader className="flex flex-col items-center space-y-4">
              <div className="relative w-full h-48 md:h-64">
                <Image
                  src="/hemant.jpeg"
                  alt="Guide - HEMANT KUMAWAT"
                  fill
                  className="rounded-md  object-cover  border-gray-700"
                />
              </div>
              <CardTitle className="text-xl">Guide</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-center">
              <p className="text-lg font-semibold">HEMANT KUMAWAT</p>
              <p className="text-gray-400">Project Guide</p>
            </CardContent>
          </Card>

          <Card className="bg-gray-900 border-gray-700 text-white">
            <CardHeader className="flex flex-col items-center space-y-4">
              <div className="relative w-full h-48 md:h-64">
                <Image
                  src="/jyoti.jpeg"
                  alt="Student - Jyoti"
                  fill
                  className="rounded-md  object-cover  border-gray-700"
                />
              </div>
              <CardTitle className="text-xl">Student</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-center">
              <p className="text-lg font-semibold">Jyoti</p>
              <p className="text-gray-400">BCA Student, IGNOU</p>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
}
