"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function Home() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`Hello ${name}! Form submitted with email: ${email}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-slate-900 dark:text-slate-100 mb-4">
            Next.js + shadcn/ui
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400">
            A beautiful, modern web application built with Next.js and shadcn/ui components
          </p>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {/* Welcome Card */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl">Welcome!</CardTitle>
              <CardDescription>
                This is a demo showcasing shadcn/ui components in a Next.js application without a src folder.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  The project structure follows Next.js 13+ app directory conventions with components
                  organized in the root-level components folder.
                </p>
                <div className="flex gap-2">
                  <Button variant="default">Primary Button</Button>
                  <Button variant="outline">Secondary Button</Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contact Form Card */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl">Contact Form</CardTitle>
              <CardDescription>
                Try out the shadcn/ui form components below.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="Enter your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <Button type="submit" className="w-full">
                  Submit Form
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card className="text-center shadow-md">
            <CardHeader>
              <CardTitle className="text-lg">🚀 Fast</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Built with Next.js 14 and optimized for performance
              </p>
            </CardContent>
          </Card>

          <Card className="text-center shadow-md">
            <CardHeader>
              <CardTitle className="text-lg">🎨 Beautiful</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Styled with Tailwind CSS and shadcn/ui components
              </p>
            </CardContent>
          </Card>

          <Card className="text-center shadow-md">
            <CardHeader>
              <CardTitle className="text-lg">📱 Responsive</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Mobile-first design that works on all devices
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Footer */}
        <div className="text-center text-slate-500 dark:text-slate-400">
          <p className="text-sm">
            Built with ❤️ using Next.js, TypeScript, Tailwind CSS, and shadcn/ui
          </p>
        </div>
      </div>
    </div>
  );
}
